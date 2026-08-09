'use client';

import { useRouter } from 'next/navigation';

interface NavbarProps {
  roomId?: string;
  onInviteClick?: () => void;
}

function GhostIcon({
  className = 'h-4 w-4',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 19.5V10.2a6 6 0 0 1 12 0v9.3l-2.2-1.4-2.1 1.4-2.1-1.4-2.1 1.4-2.1-1.4-1.4.9Z"
        fill="currentColor"
      />
      <circle cx="9.4" cy="11.2" r="0.9" fill="white" />
      <circle cx="14.6" cy="11.2" r="0.9" fill="white" />
      <path
        d="M10 14.2c.8.7 1.6.7 2.4 0 .8.7 1.6.7 2.4 0"
        stroke="white"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar({ roomId, onInviteClick }: NavbarProps) {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 px-4 sm:px-8 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
      {/* Brand & Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <span className='bg-indigo-700 rounded-2xl'>

            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/40 text-white ring-1 ring-white/100">
              <GhostIcon className="h-8 w-8 text-gray-700 " />
            </span>
          </span>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
            Ghost Call
          </span>
        </button>

        {roomId && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              LIVE
            </span>
          </div>
        )}
      </div>

      {/* Room Action Buttons */}
      {roomId && onInviteClick && (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/80 text-xs text-slate-600 font-mono shadow-2xs">
            <span className="text-slate-400 font-sans">CODE:</span>
            <strong className="text-slate-900 font-bold tracking-wider">{roomId}</strong>
          </div>

          <button
            id="share-call-btn"
            className="px-4 py-2 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            onClick={onInviteClick}
          >
            <span className="text-sm">🔗</span> Invite
          </button>
        </div>
      )}
    </header>
  );
}
