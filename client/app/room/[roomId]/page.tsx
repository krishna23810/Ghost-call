'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useTracks,
  VideoTrack,
  useLocalParticipant,
  useChat,
  TrackReference,
} from '@livekit/components-react';
import { Track } from 'livekit-client';

import Navbar from '@/components/Navbar';
import ShareModal from '@/components/ShareModal';
import ROUTES from '@/routes';

type JoinState = 'loading' | 'lobby' | 'in-call' | 'error' | 'ended';

interface TokenData {
  token: string;
  displayName: string;
  livekitUrl: string;
}

// ── Icons ────────────────────────────────────────────────────────
function MicIcon({ enabled }: { enabled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
      {enabled ? (
        <>
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </>
      ) : (
        <>
          <line x1="2" y1="2" x2="22" y2="22" />
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6" />
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </>
      )}
    </svg>
  );
}

function CamIcon({ enabled }: { enabled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
      <path d="m22 8-6 4 6 4V8z" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
      {!enabled && <line x1="2" y1="2" x2="22" y2="22" />}
    </svg>
  );
}

function ScreenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function ChatBubbleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function PhoneOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="m3 3 18 9-18 9 4.5-9L3 3z" />
    </svg>
  );
}

function GhostIcon({ className = 'h-6 w-6' }: { className?: string }) {
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

function LockIcon({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function CheckCircleIcon({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 5-5" />
    </svg>
  );
}

// ── Loading / Error / Ended Screens ──────────────────────────────
function LoadingScreen() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f7f8fc] px-4">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
          <GhostIcon className="h-8 w-8 animate-pulse" />
        </div>

        <p className="text-lg font-bold text-slate-950">Connecting Ghost Call</p>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Securing your media connection...
        </p>

        <div className="mx-auto mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/3 animate-[loading_1.3s_ease-in-out_infinite] rounded-full bg-indigo-600" />
        </div>
      </div>
    </main>
  );
}

function StatusScreen({
  type,
  message,
  onAction,
}: {
  type: 'error' | 'ended';
  message: string;
  onAction: () => void;
}) {
  const isError = type === 'error';

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f7f8fc] px-4">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-xl shadow-slate-200/60 sm:p-9">
        <div
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${isError ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
            }`}
        >
          {isError ? <LockIcon /> : <CheckCircleIcon />}
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
          {isError ? 'Session unavailable' : 'Call completed'}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>

        <button
          type="button"
          onClick={onAction}
          className="mt-7 flex min-h-12 w-full items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 active:scale-[0.98]"
        >
          {isError ? 'Return to home' : 'Start a new call'}
        </button>
      </div>
    </main>
  );
}

// ── Custom Participant Video Tile ────────────────────────────────
function CustomParticipantTile({ trackRef }: { trackRef: TrackReference }) {
  const participant = trackRef.participant;
  const isCameraOff =
    !trackRef.publication || trackRef.publication.isMuted || !trackRef.publication.track;
  const isSpeaking = participant.isSpeaking;

  const displayName = participant.name || participant.identity || 'Anonymous';

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-2xl border bg-slate-950 shadow-lg transition-all duration-300 sm:rounded-3xl ${isSpeaking
        ? 'border-indigo-500 shadow-indigo-500/20 ring-4 ring-indigo-500/20'
        : 'border-slate-800 hover:border-slate-700'
        }`}
    >
      {!isCameraOff ? (
        <VideoTrack trackRef={trackRef} className="h-full w-full bg-slate-950 object-contain" />
      ) : (
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950">
          <div className="absolute h-52 w-52 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-xl backdrop-blur-xl sm:h-20 sm:w-20">
            <GhostIcon className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>

          <p className="relative z-10 mt-3 text-[11px] font-semibold text-slate-400">
            Camera disabled
          </p>
        </div>
      )}

      <div className="absolute bottom-2.5 left-2.5 z-20 flex max-w-[calc(100%-1.25rem)] items-center gap-2 rounded-full border border-white/15 bg-slate-900/80 px-3 py-1.5 shadow-lg backdrop-blur-md sm:bottom-4 sm:left-4">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />

        <span className="truncate text-[11px] font-bold tracking-wide text-white sm:text-xs">
          {displayName}
        </span>

        {isSpeaking && (
          <span className="flex h-3 items-end gap-0.5">
            <span className="h-3 w-0.5 animate-bounce bg-emerald-400" />
            <span className="h-2 w-0.5 animate-bounce bg-emerald-400 [animation-delay:100ms]" />
            <span className="h-3.5 w-0.5 animate-bounce bg-emerald-400 [animation-delay:200ms]" />
          </span>
        )}
      </div>
    </div>
  );
}

// ── Custom Chat Drawer ────────────────────────────────────────────
function CustomChatDrawer({ onClose }: { onClose: () => void }) {
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

// ── Control Dock Button ───────────────────────────────────────────
function DockButton({
  active,
  danger,
  onClick,
  icon,
  label,
}: {
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  const base =
    'flex items-center gap-2 rounded-full px-3.5 py-2.5 text-xs font-bold transition-all active:scale-95 sm:px-4';

  const style = danger
    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
    : active
      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 hover:bg-indigo-700'
      : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200';

  return (
    <button type="button" onClick={onClick} className={`${base} ${style}`}>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function getGridClasses(count: number) {
  if (count <= 1) return 'grid-cols-1 max-w-4xl mx-auto';
  if (count === 2) return 'grid-cols-1 sm:grid-cols-2';
  if (count <= 4) return 'grid-cols-2';
  if (count <= 6) return 'grid-cols-2 sm:grid-cols-3';
  return 'grid-cols-3 sm:grid-cols-4';
}

// ── Custom Video Conference ──────────────────────────────────────
function CustomVideoConference({ onLeave }: { onLeave: () => void }) {
  const { isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled, localParticipant } =
    useLocalParticipant();

  const [showChat, setShowChat] = useState(false);

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  async function toggleMic() {
    try {
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
    } catch {
      // ignore transient toggle errors
    }
  }

  async function toggleCam() {
    try {
      await localParticipant.setCameraEnabled(!isCameraEnabled);
    } catch {
      // ignore transient toggle errors
    }
  }

  async function toggleScreen() {
    try {
      await localParticipant.setScreenShareEnabled(!isScreenShareEnabled);
    } catch {
      // ignore transient toggle errors
    }
  }

  return (
    <div className="relative flex h-[calc(100dvh-5.2rem)] w-full flex-col overflow-hidden bg-[#f1f3f9] p-3 pb-16">
      <div className={`grid flex-1 auto-rows-fr ${getGridClasses(tracks.length)} gap-2.5 sm:gap-4 min-h-0 h-full`}>
        {tracks.map((trackRef) => (
          <CustomParticipantTile
            key={`${trackRef.participant.identity}_${trackRef.source}`}
            trackRef={trackRef}
          />
        ))}
      </div>

      {showChat && <CustomChatDrawer onClose={() => setShowChat(false)} />}

      <div className="fixed bottom-3 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-2.5 py-2 shadow-[0_16px_40px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:bottom-5 sm:gap-2 sm:px-3">
        <DockButton
          active={!isMicrophoneEnabled ? false : undefined}
          danger={!isMicrophoneEnabled}
          onClick={toggleMic}
          icon={<MicIcon enabled={isMicrophoneEnabled} />}
          label={isMicrophoneEnabled ? 'Mute' : 'Unmute'}
        />

        <DockButton
          danger={!isCameraEnabled}
          onClick={toggleCam}
          icon={<CamIcon enabled={isCameraEnabled} />}
          label={isCameraEnabled ? 'Camera off' : 'Camera on'}
        />

        <DockButton
          active={isScreenShareEnabled}
          onClick={toggleScreen}
          icon={<ScreenIcon />}
          label="Share"
        />

        <DockButton
          active={showChat}
          onClick={() => setShowChat((prev) => !prev)}
          icon={<ChatBubbleIcon />}
          label="Chat"
        />

        <button
          type="button"
          onClick={onLeave}
          className="ml-1 flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-red-500/25 transition-all hover:from-red-700 hover:to-rose-700 active:scale-95 sm:px-5"
        >
          <PhoneOffIcon />
          <span>Leave</span>
        </button>
      </div>
    </div>
  );
}

// ── Room Page Main Export ─────────────────────────────────────────
export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomId = (params.roomId as string)?.toUpperCase();
  const [roomCode, setRoomCode] = useState<string | null>(searchParams.get('code'));

  const [state, setState] = useState<JoinState>('loading');
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(Boolean(searchParams.get('code')));

  const hasFetchedRef = useRef(false);

  const joinLink =
    typeof window !== 'undefined' ? `${window.location.origin}${ROUTES.ROOM(roomId)}` : '';

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
      <StatusScreen type="error" message={error} onAction={() => router.push(ROUTES.HOME)} />
    );
  }

  if (state === 'ended') {
    return (
      <StatusScreen
        type="ended"
        message="You have disconnected. No call data or messages were saved."
        onAction={() => router.push(ROUTES.HOME)}
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
            connect
            video={false}
            audio
            onDisconnected={() => setState('ended')}
            onError={() => {
              setError('The connection was interrupted. Please rejoin the room.');
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