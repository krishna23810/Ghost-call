'use client';

import { VideoTrack, TrackReferenceOrPlaceholder } from '@livekit/components-react';
import { GhostIcon } from './Icons';

interface CustomParticipantTileProps {
  trackRef: TrackReferenceOrPlaceholder;
}

export default function CustomParticipantTile({ trackRef }: CustomParticipantTileProps) {
  const participant = trackRef.participant;
  const isCameraOff =
    !trackRef.publication || trackRef.publication.isMuted || !trackRef.publication.track;
  const isSpeaking = participant?.isSpeaking;

  const displayName = participant?.name || participant?.identity || 'Anonymous';

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-2xl border bg-slate-950 shadow-lg transition-all duration-300 sm:rounded-3xl ${isSpeaking
        ? 'border-indigo-500 shadow-indigo-500/20 ring-4 ring-indigo-500/20'
        : 'border-slate-800 hover:border-slate-700'
        }`}
    >
      {!isCameraOff ? (
        <VideoTrack
          trackRef={trackRef}
          style={{ objectFit: 'contain' }}
          className="h-full w-full bg-slate-950"
        />
      ) : (
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950">
          <div className="absolute h-52 w-52 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-xl backdrop-blur-xl sm:h-20 sm:w-20">
            <GhostIcon className="h-12 w-12 text-slate-500" />
          </div>

          <p className="relative z-10 mt-3 text-[11px] font-semibold text-slate-400">
            Camera disabled
          </p>
        </div>
      )}

      <div className="absolute bottom-2.5 left-2.5 z-20 flex max-w-[calc(100%-1.25rem)] items-center gap-2 rounded-full border border-white/15 bg-slate-900/80 px-3 py-1.5 shadow-lg backdrop-blur-md sm:bottom-4 sm:left-4">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />

        <span className="truncate text-[11px] font-bold tracking-wide text-white sm:text-xs">
          {displayName}
        </span>

        {isSpeaking && (
          <span className="flex h-3 items-end gap-0.5">
            <span className="h-3 w-0.5 animate-bounce bg-emerald-400" />
            <span className="h-2 w-0.5 animate-bounce bg-emerald-400 [animation-delay:100ms]" />
            <span className="h-3.5 w-0.5 animate-bounce bg-emerald-400 [animation-delay:200ms]" />
          </span>
        )}
      </div>
    </div>
  );
}
