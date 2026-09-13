import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ROUTES from '@/routes';

function KeyIcon({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState('');

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    const cleanKey = passcode.trim();

    if (!cleanKey) {
      setAuthError('Please enter the admin passcode');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch(ROUTES.API.ADMIN_VERIFY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: cleanKey }),
      });

      if (res.ok) {
        // Navigate to /admin/data and pass the verified adminKey in state
        navigate(ROUTES.ADMIN_DATA, { state: { adminKey: cleanKey }, replace: true });
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          setAuthError(data.error || 'Incorrect admin passcode');
        } else {
          setAuthError(`Server error (${res.status}): ${data.error || 'Unable to reach admin API. Please check backend.'}`);
        }
      }
    } catch (err) {
      console.error('Admin login connection error:', err);
      setAuthError('Failed to connect to backend server. Please verify backend is running.');
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#0f172a] px-4 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30">
          <KeyIcon />
        </div>

        <h1 className="text-center text-xl font-bold tracking-tight text-white sm:text-2xl">
          Ghost Call Admin
        </h1>
        <p className="mt-2 text-center text-xs text-slate-400">
          Enter the admin passcode to monitor and manage live rooms.
        </p>

        <form onSubmit={handleUnlock} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="admin-passcode"
              className="block text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Admin Passcode
            </label>
            <input
              id="admin-passcode"
              type="password"
              autoFocus
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {authError && (
            <p className="text-left text-xs font-medium text-rose-400">{authError}</p>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {isVerifying ? 'Verifying...' : 'Unlock Dashboard'}
          </button>

          <div className="text-center pt-2">
            <Link
              to={ROUTES.HOME}
              className="text-xs text-slate-500 hover:text-slate-300 transition"
            >
              ← Back to Ghost Call Home
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
