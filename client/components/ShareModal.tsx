
'use client';

import { useEffect, useState } from 'react';

interface ShareModalProps {
  roomId: string;
  shareCode: string | null;
  joinLink: string;
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-2.83 2.83a5 5 0 0 0 7.07 7.07L12.5 19.5" />
    </svg>
  );
}

function HashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true">
      <path d="M10 3 8 21" />
      <path d="m16 3-2 18" />
      <path d="M4 9h17" />
      <path d="M3 15h17" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.53 3.63 1.44 5.13L2 22l5.13-1.55a9.9 9.9 0 0 0 4.91 1.29h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.71 14.08c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.06.11-1.71-.11-.39-.13-.9-.3-1.54-.58-2.72-1.17-4.49-3.93-4.63-4.11-.14-.19-1.1-1.46-1.1-2.79 0-1.32.7-1.97.95-2.24.24-.26.53-.32.71-.32.18 0 .35.01.5.01.16.01.38-.06.6.46.24.57.81 2 .88 2.14.07.14.11.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.13-.28.27-.12.53.16.26.72 1.19 1.55 1.93 1.07.95 1.98 1.24 2.24 1.38.26.14.42.12.58-.05.16-.16.66-.77.84-1.03.18-.26.35-.22.6-.13.24.09 1.55.73 1.82.86.26.13.44.19.5.3.07.11.07.63-.17 1.3Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5 15.4 17M15.4 7 8.6 10.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function ShareModal({ roomId, shareCode, joinLink, onClose }: ShareModalProps) {
  const [copiedType, setCopiedType] = useState<'link' | 'code' | null>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && Boolean(navigator.share));

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  async function copyToClipboard(text: string, type: 'link' | 'code') {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2200);
    } catch {
      // ignore clipboard errors
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({
        title: 'Ghost Call',
        text: `Join my private video call on Ghost Call.${shareCode ? ` Code: ${shareCode}` : ''}`,
        url: joinLink,
      });
    } catch {
      // user cancelled or share failed, no-op
    }
  }

  const whatsappText = encodeURIComponent(
    `Join my private video call on Ghost Call.\n\nLink: ${joinLink}\nCode: ${shareCode || roomId}`,
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappText}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md animate-in slide-in-from-bottom-4 rounded-t-[28px] border border-slate-200 bg-white shadow-2xl duration-300 sm:rounded-[28px]">
        {/* Drag handle */}
        <div className="flex justify-center pb-1 pt-3 sm:hidden">
          <div className="h-1.5 w-10 rounded-full bg-slate-300" />
        </div>

        <div className="max-h-[85vh] overflow-y-auto px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-2 sm:p-7">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/25 sm:h-10 sm:w-10 sm:rounded-xl">
                <LinkIcon />
              </div>

              <div>
                <h3 id="share-modal-title" className="text-lg font-bold tracking-tight text-slate-950 sm:text-base">
                  Invite to call
                </h3>
                <p className="text-xs font-medium text-slate-500">
                  No account required to join
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-900 active:scale-95 sm:h-8 sm:w-8"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Join code */}
          {shareCode && (
            <div className="mb-4">
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                6-digit join code
              </label>

              <div className="flex flex-row items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/40 p-3.5 sm:p-4">
                <span className="font-mono text-2xl font-extrabold tracking-[0.22em] text-indigo-700 sm:text-3xl sm:tracking-[0.25em]">
                  {shareCode}
                </span>

                <button
                  type="button"
                  onClick={() => copyToClipboard(shareCode, 'code')}
                  className="flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-xs transition-all hover:bg-slate-50 active:scale-95"
                >
                  {copiedType === 'code' ? <CheckIcon /> : <CopyIcon />}
                  <span>{copiedType === 'code' ? 'Copied' : 'Copy code'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Direct link */}
          <div className="mb-4">
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Direct call link
            </label>

            <div className="flex min-h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 pr-2">
              <input
                readOnly
                value={joinLink}
                onFocus={(e) => e.currentTarget.select()}
                className="min-w-0 flex-1 truncate bg-transparent font-mono text-xs text-slate-700 outline-none"
              />

              <button
                type="button"
                onClick={() => copyToClipboard(joinLink, 'link')}
                className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-indigo-700 active:scale-95"
              >
                {copiedType === 'link' ? <CheckIcon /> : <CopyIcon />}
                <span>{copiedType === 'link' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Share actions */}
          <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {canNativeShare ? (
              <button
                type="button"
                onClick={nativeShare}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 text-sm font-bold text-indigo-700 transition-all active:scale-95 hover:bg-indigo-100"
              >
                <ShareIcon />
                <span>Share...</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => copyToClipboard(joinLink, 'link')}
                className="hidden min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white shadow-sm shadow-indigo-500/25 transition-all active:scale-95 sm:flex"
              >
                {copiedType === 'link' ? <CheckIcon /> : <CopyIcon />}
                <span>{copiedType === 'link' ? 'Copied' : 'Copy link'}</span>
              </button>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-bold text-emerald-700 no-underline transition-all hover:bg-emerald-100 active:scale-95"
            >
              <WhatsAppIcon />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 border-t border-slate-100 pt-4 text-[11px] font-medium text-slate-400">
            <LockIcon />
            <span>Encrypted peer stream. This code expires in 24 hours.</span>
          </div>
        </div>
      </div>
    </div>
  );
}