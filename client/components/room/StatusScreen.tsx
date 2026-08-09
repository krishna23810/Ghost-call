'use client';

import { useState, useEffect } from 'react';
import { LockIcon, CheckCircleIcon } from './Icons';

interface StatusScreenProps {
  type: 'error' | 'ended';
  message: string;
  onAction: () => void;
}

export default function StatusScreen({ type, message, onAction }: StatusScreenProps) {
  const isError = type === 'error';
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) {
      onAction();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onAction]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f7f8fc] px-4">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-xl shadow-slate-200/60 sm:p-9">
        <div
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${
            isError ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
          }`}
        >
          {isError ? <LockIcon /> : <CheckCircleIcon />}
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
          {isError ? 'Session unavailable' : 'Call completed'}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>

        <p className="mt-3 text-xs font-semibold text-indigo-600">
          Redirecting to home page in <span className="font-bold">{countdown}s</span>...
        </p>

        <button
          type="button"
          onClick={onAction}
          className="mt-6 flex min-h-12 w-full items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 active:scale-[0.98]"
        >
          {isError ? 'Return to home now' : `Start a new call (${countdown}s)`}
        </button>
      </div>
    </main>
  );
}
