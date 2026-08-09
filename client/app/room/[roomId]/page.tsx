'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';

import Navbar from '@/components/Navbar';
import ShareModal from '@/components/ShareModal';
import ROUTES from '@/routes';

type JoinState = 'loading' | 'lobby' | 'in-call' | 'error' | 'ended';

interface TokenData {
  token: string;
  displayName: string;
  livekitUrl: string;
}

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomId = (params.roomId as string)?.toUpperCase();
  const shareCode = searchParams.get('code'); // present for host

  const [state, setState] = useState<JoinState>('loading');
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(!!shareCode); // auto-open for host

  const hasFetchedRef = useRef(false);

  const joinLink = typeof window !== 'undefined' ? `${window.location.origin}${ROUTES.ROOM(roomId)}` : '';

  // Fetch LiveKit token from backend (guarded against React 18 Strict Mode double-invocation)
  const fetchToken = useCallback(async () => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    try {
      const roomRes = await fetch(ROUTES.API.GET_ROOM_BY_ID(roomId));
      if (!roomRes.ok) {
        setError('This room does not exist or has expired.');
        setState('error');
        return;
      }

      const tokenRes = await fetch(ROUTES.API.GENERATE_TOKEN(roomId), { method: 'POST' });
      if (!tokenRes.ok) throw new Error('Token fetch failed');
      const data = await tokenRes.json();

      setTokenData(data);
      setState('lobby');
    } catch {
      setError('Could not connect to room server. Is backend running?');
      setState('error');
    }
  }, [roomId]);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-indigo-50 border border-indigo-200 shadow-sm">
            <span className="text-3xl animate-pulse">👻</span>
          </div>
          <p className="text-slate-900 font-bold text-lg">Connecting Ghost Call...</p>
          <p className="text-slate-500 text-xs mt-1 font-mono">Securing WebRTC media channel</p>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center p-8 sm:p-10 max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-xl">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-red-50 border border-red-200">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Session Expired</h2>
          <p className="text-slate-600 text-sm mb-6">{error}</p>
          <button
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            onClick={() => router.push(ROUTES.HOME)}
          >
            ← Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (state === 'ended') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center p-8 sm:p-10 max-w-md w-full bg-white border border-slate-200 rounded-3xl shadow-xl">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-emerald-50 border border-emerald-200">
            <span className="text-3xl">👋</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Call Completed</h2>
          <p className="text-slate-600 text-sm mb-6">
            You have disconnected. Zero data or logs were saved.
          </p>
          <button
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            onClick={() => router.push(ROUTES.HOME)}
          >
            + Start a New Call
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen relative overflow-hidden text-slate-900">
      
      {/* ── Navbar Component ─────────────────────────────────────────── */}
      <Navbar roomId={roomId} onInviteClick={() => setShowShareModal(true)} />

      {/* ── Share Modal Overlay Component ───────────────────────────── */}
      {showShareModal && (
        <ShareModal
          roomId={roomId}
          shareCode={shareCode}
          joinLink={joinLink}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* ── LiveKit Video Conference Container ──────────────────────── */}
      {tokenData && (
        <div className="pt-16 h-screen">
          <LiveKitRoom
            token={tokenData.token}
            serverUrl={tokenData.livekitUrl}
            connect={true}
            video={true}
            audio={true}
            onDisconnected={() => setState('ended')}
            style={{ height: '100%' }}
          >
            <VideoConference />
            <RoomAudioRenderer />
          </LiveKitRoom>
        </div>
      )}
    </div>
  );
}
