import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ROUTES from '@/routes';

interface LiveRoom {
  roomId: string;
  code: string;
  numParticipants: number;
  status: 'live' | 'waiting';
  createdAt: number;
  durationMs: number;
  activeRecording?: boolean;
}

interface ParticipantInfo {
  identity: string;
  name: string;
  joinedAt: number | null;
  state: string;
  isPublisher: boolean;
  tracksCount: number;
}

interface AdminStats {
  activeLivekitRooms: number;
  registeredRedisRooms: number;
  liveParticipants: number;
  serverUptimeSeconds: number;
  livekitConfigured: boolean;
  timestamp: string;
}

/* ── SVG Icons ───────────────────────────────────────────────────────────── */

function GhostIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
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

function UsersIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function RadioIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
    </svg>
  );
}

function RefreshIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
    </svg>
  );
}

function TrashIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

function CopyIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className} aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ExternalLinkIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  );
}

function SearchIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function KeyIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  );
}

function ShieldAlertIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ── Helper: Format Time Duration ────────────────────────────────────────── */
function formatDuration(ms: number) {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  if (minutes < 60) return `${minutes}m ${remainingSecs}s`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return `${hours}h ${remainingMins}m`;
}

function formatTimeAgo(timestamp: number) {
  const diff = Date.now() - timestamp;
  if (diff < 30000) return 'Just now';
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
}

export default function AdminDashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const passedKey = (location.state as any)?.adminKey as string | undefined;

  useEffect(() => {
    if (!passedKey) {
      navigate(ROUTES.ADMIN, { replace: true });
    }
  }, [passedKey, navigate]);

  const [adminKey] = useState<string>(passedKey || '');
  const [isAuthenticated] = useState<boolean>(Boolean(passedKey));

  const [rooms, setRooms] = useState<LiveRoom[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [refreshIntervalSec] = useState<number>(5);
  const [countdown, setCountdown] = useState<number>(5);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'waiting'>('all');

  // Modals
  const [selectedRoomForParticipants, setSelectedRoomForParticipants] = useState<string | null>(null);
  const [participantsList, setParticipantsList] = useState<ParticipantInfo[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState<boolean>(false);
  const [roomToTerminate, setRoomToTerminate] = useState<LiveRoom | null>(null);
  const [terminating, setTerminating] = useState<boolean>(false);

  // Copy Feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Copy to clipboard helper
  function copyText(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  }

  // Helper: Request with Admin Key header
  const fetchWithAuth = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers || {});
      if (adminKey) {
        headers.set('x-admin-key', adminKey.trim());
      }
      return fetch(url, { credentials: 'omit', ...options, headers });
    },
    [adminKey],
  );

  async function handleCreateSampleRoom() {
    try {
      const res = await fetchWithAuth(ROUTES.API.ADMIN_CREATE_SAMPLE, { method: 'POST' });
      if (res.ok) {
        await fetchData(true);
      }
    } catch (e) {
      console.error('Failed to create sample room:', e);
    }
  }

  // Fetch Rooms & Stats
  const fetchData = useCallback(
    async (showSpinner = false) => {
      if (showSpinner) setRefreshing(true);
      try {
        const [roomsRes, statsRes] = await Promise.all([
          fetchWithAuth(ROUTES.API.ADMIN_GET_ROOMS),
          fetchWithAuth(ROUTES.API.ADMIN_STATS),
        ]);

        if (roomsRes.status === 401) {
          navigate(ROUTES.ADMIN, { replace: true });
          return;
        }

        if (roomsRes.ok) {
          const roomsData = await roomsRes.json();
          setRooms(roomsData.rooms || []);
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (err) {
        console.error('Error refreshing admin rooms:', err);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setCountdown(refreshIntervalSec);
      }
    },
    [fetchWithAuth, refreshIntervalSec, navigate],
  );

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchData(true);
    }
  }, [isAuthenticated, fetchData]);

  // Auto-refresh timer loop
  useEffect(() => {
    if (!autoRefresh || !isAuthenticated) return;

    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchData(false);
          return refreshIntervalSec;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [autoRefresh, isAuthenticated, refreshIntervalSec, fetchData]);

  // Handle Logout / Lock
  function handleLock() {
    navigate(ROUTES.ADMIN, { replace: true });
  }

  // Open Participants Modal
  async function handleViewParticipants(roomId: string) {
    setSelectedRoomForParticipants(roomId);
    setLoadingParticipants(true);
    try {
      const res = await fetchWithAuth(ROUTES.API.ADMIN_GET_PARTICIPANTS(roomId));
      if (res.ok) {
        const data = await res.json();
        setParticipantsList(data.participants || []);
      }
    } catch (err) {
      console.error('Error fetching participants:', err);
    } finally {
      setLoadingParticipants(false);
    }
  }

  // Confirm Terminate Room
  async function handleTerminateRoom() {
    if (!roomToTerminate) return;
    setTerminating(true);
    try {
      const res = await fetchWithAuth(
        ROUTES.API.ADMIN_TERMINATE_ROOM(roomToTerminate.roomId),
        { method: 'DELETE' },
      );
      if (res.ok) {
        setRooms((prev) => prev.filter((r) => r.roomId !== roomToTerminate.roomId));
        setRoomToTerminate(null);
      }
    } catch (err) {
      console.error('Failed to terminate room:', err);
    } finally {
      setTerminating(false);
    }
  }

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.roomId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.includes(searchQuery);
    if (!matchesSearch) return false;

    if (statusFilter === 'live') return r.numParticipants > 0;
    if (statusFilter === 'waiting') return r.numParticipants === 0;
    return true;
  });

  const totalLiveUsers = rooms.reduce((acc, r) => acc + (r.numParticipants || 0), 0);

  if (!isAuthenticated || !passedKey) {
    return null;
  }

  /* ── Main Admin Dashboard View ───────────────────────────────────────────── */
  return (
    <main className="min-h-dvh bg-[#f8f9fc] pb-16 text-slate-900">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 px-4 py-3.5 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-2.5 transition hover:opacity-85"
            >
              <span className="rounded-2xl bg-indigo-700 p-1">
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/40 text-white">
                  <GhostIcon className="h-6 w-6 text-slate-800" />
                </span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-tight text-slate-950 sm:text-lg">
                    Ghost Call
                  </span>
                  <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">
                    Admin
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 sm:text-[11px]">
                  Real-time Room & Peer Monitor
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Auto Refresh Toggle */}
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-600 sm:flex">
              <span
                className={`relative flex h-2 w-2 ${
                  autoRefresh ? 'text-emerald-500' : 'text-slate-400'
                }`}
              >
                {autoRefresh && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    autoRefresh ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
              </span>
              <span className="font-medium">
                {autoRefresh ? `Auto-refresh in ${countdown}s` : 'Paused'}
              </span>
              <button
                type="button"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                {autoRefresh ? 'Pause' : 'Resume'}
              </button>
            </div>

            {/* Manual Refresh Button */}
            <button
              id="admin-refresh-btn"
              type="button"
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Refresh Live Data"
            >
              <RefreshIcon
                className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-indigo-600' : ''}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Exit/Lock Button */}
            <button
              type="button"
              onClick={handleLock}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-2xs transition hover:bg-rose-50 hover:text-rose-600 active:scale-95 cursor-pointer"
            >
              Lock
            </button>

            <Link
              to={ROUTES.HOME}
              className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
            >
              Main App
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-8">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Rooms
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <RadioIcon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-950 sm:text-3xl">
                {rooms.length}
              </span>
              <span className="text-xs font-medium text-slate-400">total created</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Live Users
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <UsersIcon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-950 sm:text-3xl">
                {totalLiveUsers}
              </span>
              <span className="text-xs font-medium text-emerald-600">
                {totalLiveUsers > 0 ? '● In conversation' : 'No peers right now'}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                LiveKit Cloud
              </span>
              <span
                className={`flex h-2.5 w-2.5 rounded-full ${
                  stats?.livekitConfigured ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-amber-500 ring-4 ring-amber-100'
                }`}
              />
            </div>
            <div className="mt-2">
              <div className="text-sm font-bold text-slate-900">
                {stats?.livekitConfigured ? 'Connected & Ready' : 'Fallback / Local'}
              </div>
              <span className="text-xs text-slate-400">
                {stats?.activeLivekitRooms ?? 0} LiveKit session(s)
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Server Status
              </span>
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            </div>
            <div className="mt-2">
              <div className="text-sm font-bold text-slate-900">Online</div>
              <span className="text-xs text-slate-400">
                Uptime: {stats ? formatDuration(stats.serverUptimeSeconds * 1000) : '...'}
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar: Search & Filter */}
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Room ID or 6-digit Code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 sm:text-sm"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              All ({rooms.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('live')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                statusFilter === 'live'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Live Calls ({rooms.filter((r) => r.numParticipants > 0).length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('waiting')}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                statusFilter === 'waiting'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Waiting ({rooms.filter((r) => r.numParticipants === 0).length})
            </button>
          </div>
        </div>

        {/* Rooms Table */}
        <div className="mt-4">
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <div className="flex flex-col items-center gap-2">
                <RefreshIcon className="h-6 w-6 animate-spin text-indigo-600" />
                <span className="text-xs font-semibold text-slate-500">
                  Loading live rooms...
                </span>
              </div>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white py-16 text-center shadow-2xs">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <GhostIcon className="h-9 w-9 text-slate-400" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                {searchQuery || statusFilter !== 'all'
                  ? 'No matching rooms found'
                  : 'No active rooms right now'}
              </h3>
              <p className="mt-1 max-w-sm text-xs text-slate-500">
                {searchQuery
                  ? 'Try modifying your search filter.'
                  : 'When visitors create a call on the homepage, the room will appear here in real-time.'}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fetchData(true)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={handleCreateSampleRoom}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
                >
                  + Create Test Call
                </button>
                <Link
                  to={ROUTES.HOME}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
                >
                  Go to Main Call Page
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
              {/* Desktop Table View */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50/70 font-semibold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-3.5 pl-6 pr-3">Status</th>
                      <th className="px-3 py-3.5">Join Code</th>
                      <th className="px-3 py-3.5">Room ID</th>
                      <th className="px-3 py-3.5">Peers</th>
                      <th className="px-3 py-3.5">Created</th>
                      <th className="px-3 py-3.5">Active For</th>
                      <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRooms.map((room) => {
                      const isLive = room.numParticipants > 0;
                      return (
                        <tr
                          key={room.roomId}
                          className="transition hover:bg-indigo-50/20"
                        >
                          <td className="py-4 pl-6 pr-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                isLive
                                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                  : 'border border-amber-200 bg-amber-50 text-amber-700'
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                                }`}
                              />
                              {isLive ? 'LIVE' : 'WAITING'}
                            </span>
                          </td>

                          <td className="px-3 py-4">
                            <div className="flex items-center gap-1.5">
                              <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs font-bold tracking-widest text-indigo-700">
                                {room.code}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyText(room.code, `code-${room.roomId}`)}
                                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                                title="Copy 6-digit code"
                              >
                                {copiedId === `code-${room.roomId}` ? (
                                  <CheckIcon className="text-emerald-600" />
                                ) : (
                                  <CopyIcon />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="px-3 py-4">
                            <div className="flex items-center gap-1.5 font-mono text-xs text-slate-800">
                              <span>{room.roomId}</span>
                              <button
                                type="button"
                                onClick={() => copyText(room.roomId, `room-${room.roomId}`)}
                                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                                title="Copy Room ID"
                              >
                                {copiedId === `room-${room.roomId}` ? (
                                  <CheckIcon className="text-emerald-600" />
                                ) : (
                                  <CopyIcon />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="px-3 py-4">
                            <button
                              type="button"
                              onClick={() => handleViewParticipants(room.roomId)}
                              className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 cursor-pointer"
                            >
                              <UsersIcon className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600" />
                              <span>{room.numParticipants} {room.numParticipants === 1 ? 'user' : 'users'}</span>
                            </button>
                          </td>

                          <td className="px-3 py-4 text-slate-500">
                            {formatTimeAgo(room.createdAt)}
                          </td>

                          <td className="px-3 py-4 font-mono text-slate-600">
                            {formatDuration(room.durationMs)}
                          </td>

                          <td className="py-4 pl-3 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={ROUTES.ROOM(room.roomId, room.code)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50/80 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition active:scale-95"
                                title="Open room in new tab"
                              >
                                <span>Join</span>
                                <ExternalLinkIcon />
                              </Link>

                              <button
                                type="button"
                                onClick={() => setRoomToTerminate(room)}
                                className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50/70 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition active:scale-95 cursor-pointer"
                                title="Terminate active room"
                              >
                                <TrashIcon className="h-3.5 w-3.5" />
                                <span>End</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="divide-y divide-slate-100 lg:hidden">
                {filteredRooms.map((room) => {
                  const isLive = room.numParticipants > 0;
                  return (
                    <div key={room.roomId} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isLive
                              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border border-amber-200 bg-amber-50 text-amber-700'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                            }`}
                          />
                          {isLive ? 'LIVE' : 'WAITING'}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          {formatTimeAgo(room.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Join Code
                          </div>
                          <div className="mt-0.5 flex items-center gap-1 font-mono text-sm font-bold text-indigo-700">
                            <span>{room.code}</span>
                            <button
                              type="button"
                              onClick={() => copyText(room.code, `m-code-${room.roomId}`)}
                              className="p-1 text-slate-400 cursor-pointer"
                            >
                              {copiedId === `m-code-${room.roomId}` ? (
                                <CheckIcon className="text-emerald-600" />
                              ) : (
                                <CopyIcon />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Connected
                          </div>
                          <button
                            type="button"
                            onClick={() => handleViewParticipants(room.roomId)}
                            className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-slate-800 cursor-pointer"
                          >
                            <UsersIcon className="h-3.5 w-3.5 text-indigo-600" />
                            <span>{room.numParticipants}</span>
                          </button>
                        </div>

                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Duration
                          </div>
                          <div className="mt-0.5 font-mono text-xs text-slate-600">
                            {formatDuration(room.durationMs)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                          <span>{room.roomId.slice(0, 10)}...</span>
                          <button
                            type="button"
                            onClick={() => copyText(room.roomId, `m-room-${room.roomId}`)}
                            className="p-0.5 text-slate-400 cursor-pointer"
                          >
                            {copiedId === `m-room-${room.roomId}` ? (
                              <CheckIcon className="text-emerald-600" />
                            ) : (
                              <CopyIcon />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={ROUTES.ROOM(room.roomId, room.code)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700"
                          >
                            Join
                            <ExternalLinkIcon className="h-3 w-3" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setRoomToTerminate(room)}
                            className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 cursor-pointer"
                          >
                            End
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: View Participants */}
      {selectedRoomForParticipants && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-950">
                  Room Participants
                </h3>
                <p className="font-mono text-xs text-slate-500">
                  {selectedRoomForParticipants}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRoomForParticipants(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto">
              {loadingParticipants ? (
                <div className="flex h-32 items-center justify-center">
                  <RefreshIcon className="h-5 w-5 animate-spin text-indigo-600" />
                </div>
              ) : participantsList.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No active WebRTC participants currently connected to this room.
                </div>
              ) : (
                <div className="space-y-2">
                  {participantsList.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {p.name}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400">
                            {p.identity}
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-slate-500">
                        <div>{p.joinedAt ? formatTimeAgo(p.joinedAt) : 'Connected'}</div>
                        <span className="inline-block rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                          {p.isPublisher ? 'Publisher' : 'Subscriber'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 text-right">
              <button
                type="button"
                onClick={() => setSelectedRoomForParticipants(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Terminate Room Confirmation */}
      {roomToTerminate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <ShieldAlertIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-950">
                  Terminate Active Room?
                </h3>
                <span className="text-xs text-rose-600 font-medium">
                  This action cannot be undone
                </span>
              </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-600">
              Are you sure you want to end call{' '}
              <strong className="font-mono text-slate-900">{roomToTerminate.code}</strong> (ID:{' '}
              <span className="font-mono">{roomToTerminate.roomId}</span>)? All {roomToTerminate.numParticipants} active
              participant(s) will be disconnected immediately and the room will be deleted.
            </p>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRoomToTerminate(null)}
                disabled={terminating}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTerminateRoom}
                disabled={terminating}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {terminating ? (
                  <>
                    <RefreshIcon className="h-3.5 w-3.5 animate-spin" />
                    <span>Ending...</span>
                  </>
                ) : (
                  <span>Yes, Terminate Room</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
