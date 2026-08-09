'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { VideoTrack, TrackReferenceOrPlaceholder } from '@livekit/components-react';
import { MoveIcon, GhostIcon } from './Icons';

type ViewSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<ViewSize, string> = {
  sm: 'h-24 w-36 sm:h-28 sm:w-44',
  md: 'h-32 w-48 sm:h-40 sm:w-60',
  lg: 'h-44 w-64 sm:h-56 sm:w-80',
};

interface DraggableSelfViewProps {
  trackRef: TrackReferenceOrPlaceholder;
}

export default function DraggableSelfView({ trackRef }: DraggableSelfViewProps) {
  const [position, setPosition] = useState({ x: 20, y: 88 });
  const [isDragging, setIsDragging] = useState(false);
  const [viewSize, setViewSize] = useState<ViewSize>('sm');
  const [showControls, setShowControls] = useState(false);

  const dragRef = useRef({ startX: 0, startY: 0, initialX: 20, initialY: 88 });
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerShowControls = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2200);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  function handlePointerDown(e: React.PointerEvent) {
    triggerShowControls();
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    e.stopPropagation();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging) return;

    const dx = dragRef.current.startX - e.clientX;
    const dy = e.clientY - dragRef.current.startY;

    setPosition({
      x: Math.max(10, Math.min(window.innerWidth - 200, dragRef.current.initialX + dx)),
      y: Math.max(70, Math.min(window.innerHeight - 150, dragRef.current.initialY + dy)),
    });
  }

  function handlePointerUp(e: React.PointerEvent) {
    setIsDragging(false);
    triggerShowControls();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    triggerShowControls();
    if ((e.target as HTMLElement).closest('button')) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!isDragging) return;
    const touch = e.touches[0];
    const dx = dragRef.current.startX - touch.clientX;
    const dy = touch.clientY - dragRef.current.startY;

    setPosition({
      x: Math.max(10, Math.min(window.innerWidth - 180, dragRef.current.initialX + dx)),
      y: Math.max(70, Math.min(window.innerHeight - 150, dragRef.current.initialY + dy)),
    });
  }

  function handleTouchEnd() {
    setIsDragging(false);
    triggerShowControls();
  }

  const isCameraOff =
    !trackRef.publication || trackRef.publication.isMuted || !trackRef.publication.track;

  if (isCameraOff) return null;

  return (
    <div
      style={{ right: `${position.x}px`, top: `${position.y}px` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={triggerShowControls}
      className={`group fixed z-50 select-none overflow-hidden rounded-2xl border border-indigo-500/80 bg-slate-950 shadow-2xl shadow-slate-900/60 transition-[width,height] duration-200 touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${sizeClasses[viewSize]}`}
    >
      {/* Top Drag + Size Controls Bar */}
      <div
        className={`absolute inset-x-2 top-2 z-30 flex items-center justify-between transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'
          }`}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/85 text-white/90 backdrop-blur-md border border-white/15 shadow-sm">
          <MoveIcon />
        </span>

        {/* Size Presets: S, M, L */}
        <div
          onPointerDown={(e) => {
            e.stopPropagation();
            triggerShowControls();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            triggerShowControls();
          }}
          className="flex items-center gap-1 rounded-full border border-white/15 bg-slate-900/85 px-1.5 py-0.5 backdrop-blur-md cursor-pointer"
        >
          {(['sm', 'md', 'lg'] as ViewSize[]).map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setViewSize(sz);
                triggerShowControls();
              }}
              className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[9px] font-extrabold uppercase transition-all cursor-pointer ${viewSize === sz
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/20'
                }`}
            >
              {sz[0]}
            </button>
          ))}
        </div>
      </div>

      {!isCameraOff ? (
        <VideoTrack
          trackRef={trackRef}
          style={{ objectFit: 'contain' }}
          className="h-full w-full bg-slate-950"
        />
      ) : (
        <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white">
            <GhostIcon className="h-4.5 w-4.5" />
          </div>
          <p className="mt-1.5 text-[10px] font-medium text-slate-400">Camera off</p>
        </div>
      )}
    </div>
  );
}
