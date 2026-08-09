'use client';

import { useState } from 'react';

interface ShareModalProps {
  roomId: string;
  shareCode: string | null;
  joinLink: string;
  onClose: () => void;
}

export default function ShareModal({ roomId, shareCode, joinLink, onClose }: ShareModalProps) {
  const [copiedType, setCopiedType] = useState<'link' | 'code' | null>(null);

  async function copyToClipboard(text: string, type: 'link' | 'code') {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback
    }
  }

  const whatsappText = encodeURIComponent(`Join my anonymous video call on Ghost Call!\n\nJoin Link: ${joinLink}\nJoin Code: ${shareCode || roomId}`);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappText}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xl">
              ✨
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 uppercase tracking-wide">Invite to Ghost Call</h3>
              <p className="text-xs text-slate-500 font-medium">No account required to join</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Join Code Box */}
        {shareCode && (
          <div className="mb-5">
            <label className="block text-[11px] font-bold text-slate-500 font-mono uppercase tracking-wider mb-2">
              6-DIGIT JOIN CODE
            </label>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-indigo-200">
              <span className="text-3xl font-black font-mono tracking-[0.25em] text-indigo-700">
                {shareCode}
              </span>
              <button
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 active:scale-95 transition-all cursor-pointer shadow-sm"
                onClick={() => copyToClipboard(shareCode, 'code')}
              >
                {copiedType === 'code' ? '✨ Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        )}

        {/* Direct Link Box */}
        <div className="mb-5">
          <label className="block text-[11px] font-bold text-slate-500 font-mono uppercase tracking-wider mb-2">
            DIRECT CALL LINK
          </label>
          <div className="flex gap-2">
            <input
              readOnly
              value={joinLink}
              className="flex-1 py-3 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-mono focus:outline-none"
            />
            <button
              className="px-4 py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              onClick={() => copyToClipboard(joinLink, 'link')}
            >
              {copiedType === 'link' ? '✨ Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* WhatsApp Share Button */}
        <div className="flex gap-2 mb-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center gap-2 transition-all no-underline"
          >
            💬 Share via WhatsApp
          </a>
        </div>

        {/* Privacy Guarantee Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-slate-400 text-xs font-medium">
          <span>🔒</span>
          <span>Encrypted peer stream. Code expires in 24 hours.</span>
        </div>

      </div>
    </div>
  );
}
