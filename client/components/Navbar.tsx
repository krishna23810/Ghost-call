'use client';

import { useRouter } from 'next/navigation';

interface NavbarProps {
  roomId?: string;
  onInviteClick?: () => void;
}

export default function Navbar({ roomId, onInviteClick }: NavbarProps) {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 px-4 sm:px-8 flex items-center justify-between bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      {/* Brand & Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 font-extrabold text-2xl tracking-tight text-slate-900 cursor-pointer hover:opacity-90 transition-opacity"
        >
          Ghost Call
        </button>

        {roomId && (
          <>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> LIVE
            </span>

            <span className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              🔒 E2E ENCRYPTED
            </span>
          </>
        )}
      </div>

      {/* Room Action Buttons */}
      {roomId && onInviteClick && (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 font-mono">
            <span>ROOM: <strong className="text-slate-900">{roomId}</strong></span>
          </div>

          <button
            id="share-call-btn"
            className="px-4 py-2 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            onClick={onInviteClick}
          >
            <span>🔗</span> Invite
          </button>
        </div>
      )}
    </header>
  );
}
