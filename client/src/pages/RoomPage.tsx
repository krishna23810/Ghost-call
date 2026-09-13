import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';

import Navbar from '@/components/Navbar';
import ShareModal from '@/components/ShareModal';
import LoadingScreen from '@/components/room/LoadingScreen';
import StatusScreen from '@/components/room/StatusScreen';
import CustomVideoConference from '@/components/room/CustomVideoConference';
import ROUTES from '@/routes';

type JoinState = 'loading' | 'lobby' | 'in-call' | 'error' | 'ended';

interface TokenData {
  token: string;
  displayName: string;
  livekitUrl: string;
}

export default function RoomPage() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const roomId = (params.roomId as string)?.toUpperCase();
  const [roomCode, setRoomCode] = useState<string | null>(searchParams.get('code'));

  const [state, setState] = useState<JoinState>('loading');
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(Boolean(searchParams.get('code')));

  const hasFetchedRef = useRef(false);

  const joinLink =
    typeof window !== 'undefined' ? `${window.location.origin}${ROUTES.SHARE_ROOM(roomId)}` : '';

  const fetchToken = useCallback(async () => {
    if (!roomId) return;
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    try {
      const roomRes = await fetch(ROUTES.API.GET_ROOM_BY_ID(roomId));

      if (!roomRes.ok) {
        setError('This room does not exist or has expired.');
        setState('error');
        return;
      }

      const roomData = await roomRes.json();

      if (roomData.code) {
        setRoomCode(roomData.code);
      }

      const tokenRes = await fetch(ROUTES.API.GENERATE_TOKEN(roomId), { method: 'POST' });

      if (!tokenRes.ok) {
        throw new Error('Token fetch failed');
      }

      const data = await tokenRes.json();

      setTokenData(data);
      setState('lobby');
    } catch {
      setError('Could not connect to the room server. Please check if the backend is running.');
      setState('error');
    }
  }, [roomId]);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  if (state === 'loading') {
    return <LoadingScreen />;
  }

  if (state === 'error') {
    return (
      <StatusScreen type="error" message={error} onAction={() => navigate(ROUTES.HOME)} />
    );
  }

  if (state === 'ended') {
    return (
      <StatusScreen
        type="ended"
        message="You have disconnected. No call data or messages were saved."
        onAction={() => navigate(ROUTES.HOME)}
      />
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f7f8fc] text-slate-900">
      <Navbar roomId={roomId} onInviteClick={() => setShowShareModal(true)} />

      {showShareModal && (
        <ShareModal
          roomId={roomId}
          shareCode={roomCode}
          joinLink={joinLink}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {tokenData && (
        <div className="pt-16">
          <LiveKitRoom
            token={tokenData.token}
            serverUrl={tokenData.livekitUrl}
            connect={true}
            video={false}
            audio={false}
            onDisconnected={() => setState('ended')}
            onError={(err) => {
              console.error('LiveKit connection error:', err);
              // Ignore normal client-side disconnect/navigation events
              if (
                err?.message?.includes('Client initiated disconnect') ||
                err?.message?.includes('aborted')
              ) {
                return;
              }
              setError(
                err?.message
                  ? `LiveKit Connection Error: ${err.message}`
                  : 'The connection to the video server was interrupted.'
              );
              setState('error');
            }}
            style={{ height: '100%' }}
          >
            <CustomVideoConference onLeave={() => setState('ended')} />
            <RoomAudioRenderer />
          </LiveKitRoom>
        </div>
      )}
    </div>
  );
}
