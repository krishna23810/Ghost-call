'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';
import ROUTES from '@/routes';

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
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

function BrowserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M7 6.5h.01M10 6.5h.01" />
    </svg>
  );
}

export default function LandingPage() {
  const router = useRouter();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [showJoin, setShowJoin] = useState(false);

  async function handleStartCall() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(ROUTES.API.CREATE_ROOM, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to create room');
      }

      const data = await res.json();
      router.push(ROUTES.ROOM(data.roomId, data.code));
    } catch {
      setError('Could not create room. Please check if the backend is running.');
      setLoading(false);
    }
  }

  async function handleJoinWithCode(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    const trimmed = code.replace(/\D/g, '');

    if (trimmed.length !== 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    setJoining(true);
    setError('');

    try {
      const res = await fetch(
        ROUTES.API.GET_ROOM_BY_CODE(trimmed),
      );

      if (!res.ok) {
        throw new Error('Code not found');
      }

      const data = await res.json();
      router.push(ROUTES.ROOM(data.roomId));
    } catch {
      setError('Code not found or expired. Please try again.');
      setJoining(false);
    }
  }

  function openJoinForm() {
    setShowJoin(true);
    setError('');
  }

  function resetJoinForm() {
    setShowJoin(false);
    setCode('');
    setError('');
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-[#f8f9fc] text-slate-900">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-[env(safe-area-inset-bottom)] sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2.5">
            {/* <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm sm:h-10 sm:w-10">
              <GhostIcon className="h-5 w-5 text-white" />
            </div> */}
            <span className='bg-indigo-700 rounded-2xl'>

              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/40 text-white ring-1 ring-white/100">
                <GhostIcon className="h-11 w-11 text-gray-700 " />
              </span>
            </span>

            <div>
              <h1 className="text-sm font-semibold tracking-tight text-slate-950 sm:text-base">
                Ghost Call
              </h1>

              <p className="text-[11px] text-slate-500 sm:text-xs">
                Private video calling
              </p>
            </div>
          </div>

          <div className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-medium text-slate-500 shadow-sm sm:px-3 sm:text-xs">
            <span className="hidden sm:inline">
              No signup required
            </span>
            <span className="sm:hidden">No signup</span>
          </div>
        </header>

        {/* Main content */}
        <section className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-2xl text-center">
            {/* Status badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/70 px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.14em] text-indigo-700 shadow-sm sm:px-4 sm:text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-70" />
                <span className="relative h-2 w-2 rounded-full bg-indigo-600" />
              </span>

              PRIVATE VIDEO CALLING
            </div>

            {/* Hero */}
            <h2 className="text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
              Private calls,
              <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                without the noise.
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-[340px] text-sm leading-6 text-slate-600 sm:max-w-xl sm:text-base sm:leading-7 lg:text-lg">
              Start a secure video call instantly. No account, no download,
              and no unnecessary setup.
            </p>

            {/* Action card */}
            <div className="mx-auto mt-6 w-full max-w-[400px]">
              <div className="rounded-[26px] border border-slate-400/80 bg-white/90 p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:rounded-[30px] sm:p-2">
                <div className="rounded-[21px] border border-slate-100 bg-gradient-to-b from-white via-white to-slate-50/80 p-3 sm:rounded-[26px]">
                  {!showJoin ? (
                    <div className="space-y-2">
                      {/* Start call button */}
                      <button
                        id="start-call-btn"
                        type="button"
                        onClick={handleStartCall}
                        disabled={loading}
                        className="group relative flex min-h-[60px] w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-[0_14px_30px_rgba(79,70,229,0.32)] active:translate-y-0 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        {loading ? (
                          <>
                            <Spinner />
                            <span>Creating room...</span>
                          </>
                        ) : (
                          <>
                            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/40 text-white ring-1 ring-white/100">
                              <GhostIcon className="h-8 w-8 text-gray-700" />
                            </span>

                            <span className="relative whitespace-nowrap">
                              Start anonymous call
                            </span>

                            <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 transition-transform duration-200 group-hover:translate-x-1">
                              <ArrowIcon />
                            </span>
                          </>
                        )}
                      </button>

                      {/* Divider */}
                      <div className="flex items-center gap-3 py-1">
                        <div className="h-px flex-1 bg-slate-200" />

                        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                          or
                        </span>

                        <div className="h-px flex-1 bg-slate-200" />
                      </div>

                      {/* Join button */}
                      <button
                        id="join-code-btn"
                        type="button"
                        onClick={openJoinForm}
                        className="group flex min-h-[60px] w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-700 hover:shadow-md active:translate-y-0 active:scale-[0.985]"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600">
                          #
                        </span>

                        <span className="whitespace-nowrap">
                          Enter 6-digit code
                        </span>

                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all group-hover:translate-x-1 group-hover:bg-indigo-100 group-hover:text-indigo-600">
                          <ArrowIcon />
                        </span>
                      </button>

                      <p className="pt-1 text-[11px] leading-5 text-slate-400">
                        No account or app download required.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleJoinWithCode}
                      className="space-y-4"
                    >
                      {/* Join form header */}
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={resetJoinForm}
                          className="min-h-10 px-1 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-950"
                        >
                          ← Back
                        </button>

                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Join room
                        </span>
                      </div>

                      <div className="pt-1">
                        <label
                          htmlFor="join-code-input"
                          className="mb-2 block text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                        >
                          6-digit call code
                        </label>

                        <input
                          id="join-code-input"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          autoFocus
                          maxLength={6}
                          placeholder="748291"
                          value={code}
                          onChange={(e) => {
                            setCode(
                              e.target.value
                                .replace(/\D/g, '')
                                .slice(0, 6),
                            );
                            setError('');
                          }}
                          className="min-h-16 w-full rounded-2xl border border-slate-200 bg-white px-3 text-center font-mono text-2xl font-semibold tracking-[0.24em] text-slate-950 outline-none transition placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:text-3xl"
                          aria-invalid={Boolean(error)}
                          aria-describedby={error ? 'join-error' : undefined}
                        />

                        <p className="mt-2 text-left text-[11px] text-slate-400">
                          Ask the host for the code to join their call.
                        </p>
                      </div>

                      {/* Submit button */}
                      <button
                        id="join-submit-btn"
                        type="submit"
                        disabled={joining || code.length !== 6}
                        className="flex min-h-[60px] w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.25)] transition-all hover:bg-indigo-700 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {joining ? (
                          <>
                            <Spinner />
                            Connecting...
                          </>
                        ) : (
                          <>
                            Join call
                            <ArrowIcon />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Error message */}
                  {error && (
                    <div
                      id="join-error"
                      role="alert"
                      className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-left text-xs leading-5 text-red-700"
                    >
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mx-auto mt-7 grid max-w-[440px] grid-cols-3 gap-2 sm:gap-3">
              <div className="flex min-h-[62px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white px-2 py-3 text-[10px] text-slate-500 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:min-h-0 sm:flex-row sm:gap-2 sm:rounded-full sm:px-3 sm:py-2 sm:text-xs">
                <LockIcon />
                <span>Encrypted</span>
              </div>

              <div className="flex min-h-[62px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white px-2 py-3 text-[10px] text-slate-500 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:min-h-0 sm:flex-row sm:gap-2 sm:rounded-full sm:px-3 sm:py-2 sm:text-xs">
                <GhostIcon className="h-5 w-5 text-slate-500" />
                <span>No logs</span>
              </div>

              <div className="flex min-h-[62px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white px-2 py-3 text-[10px] text-slate-500 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:min-h-0 sm:flex-row sm:gap-2 sm:rounded-full sm:px-3 sm:py-2 sm:text-xs">
                <BrowserIcon />
                <span>Browser-based</span>
              </div>
            </div>

            <p className="mt-3 px-4 text-[11px] leading-5 text-slate-400 sm:text-xs">
              Secure browser communication for private calls.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200/70 py-3 text-center text-[11px] text-slate-400 sm:text-xs">
          Ghost Call Platform · Secure web communications
        </footer>
      </div>
    </main>
  );
}