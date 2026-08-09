'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@livekit/components-react';
import { ChatBubbleIcon, CloseIcon, SendIcon } from './Icons';

interface CustomChatDrawerProps {
  onClose: () => void;
}

export default function CustomChatDrawer({ onClose }: CustomChatDrawerProps) {
  const { chatMessages, send, isSending } = useChat();
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || isSending) return;
    await send(text.trim());
    setText('');
  }

  return (
    <div className="fixed inset-x-3 bottom-24 top-20 z-50 flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-2xl sm:inset-x-auto sm:right-5 sm:w-88 sm:max-w-[calc(100vw-2rem)]">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-5 py-4">
        <div className="flex items-center gap-2">
          <ChatBubbleIcon />
          <h3 className="text-sm font-bold text-slate-950">Room chat</h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/40 p-4">
        {chatMessages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center text-slate-400">
            <ChatBubbleIcon />
            <p className="mt-3 text-xs font-semibold text-slate-500">No messages yet</p>
            <p className="mt-1 text-[11px] leading-5">
              Messages are temporary. Nothing is stored after the call ends.
            </p>
          </div>
        ) : (
          chatMessages.map((msg, i) => (
            <div
              key={msg.timestamp || i}
              className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm"
            >
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="truncate text-xs font-bold text-indigo-600">
                  {msg.from?.name || msg.from?.identity || 'Anonymous'}
                </span>

                <span className="shrink-0 font-mono text-[10px] text-slate-400">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <p className="break-words text-xs leading-relaxed text-slate-800">
                {msg.message}
              </p>
            </div>
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-200 bg-white p-3">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
        />

        <button
          type="submit"
          disabled={!text.trim() || isSending}
          className="flex min-h-11 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SendIcon />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
