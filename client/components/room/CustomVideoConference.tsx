'use client';

import { useState } from 'react';
import { useLocalParticipant, useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';

import DockButton from './DockButton';
import CustomChatDrawer from './CustomChatDrawer';
import CustomParticipantTile from './CustomParticipantTile';
import DraggableSelfView from './DraggableSelfView';
import { MicIcon, CamIcon, ScreenIcon, ChatBubbleIcon, PhoneOffIcon, SpeakerIcon } from './Icons';

function getGridClasses(count: number) {
  if (count <= 1) return 'grid-cols-1 w-full max-w-5xl mx-auto';
  if (count === 2) return 'grid-cols-1 sm:grid-cols-2';
  if (count === 3) return 'grid-cols-1 sm:grid-cols-3';
  if (count === 4) return 'grid-cols-2';
  if (count <= 6) return 'grid-cols-2 sm:grid-cols-3';
  return 'grid-cols-3 sm:grid-cols-4';
}

interface CustomVideoConferenceProps {
  onLeave: () => void;
}

export default function CustomVideoConference({ onLeave }: CustomVideoConferenceProps) {
  const { isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled, localParticipant } =
    useLocalParticipant();

  const [showChat, setShowChat] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  const localTrack = tracks.find((t) => t.participant.isLocal);
  const remoteTracks = tracks.filter((t) => !t.participant.isLocal);

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

  function toggleDeafen() {
    setIsDeafened((prev) => {
      const next = !prev;
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach((el) => {
        el.muted = next;
      });
      return next;
    });
  }

  const hasRemote = remoteTracks.length > 0;
  const mainTracks = hasRemote ? remoteTracks : tracks;

  return (
    <div className="relative flex h-[calc(100dvh-4.5rem)] w-full flex-col overflow-hidden bg-[#f1f3f9] p-3 pb-16">
      {/* Main Screen Video Grid */}
      <div className={`grid h-full w-full min-h-0 flex-1 auto-rows-fr ${getGridClasses(mainTracks.length)} gap-3 sm:gap-4`}>
        {mainTracks.map((trackRef) => (
          <CustomParticipantTile
            key={`${trackRef.participant.identity}_${trackRef.source}`}
            trackRef={trackRef}
          />
        ))}
      </div>

      {/* Floating Draggable Self-View Box */}
      {hasRemote && localTrack && <DraggableSelfView trackRef={localTrack} />}

      {/* Room Chat Drawer */}
      {showChat && <CustomChatDrawer onClose={() => setShowChat(false)} />}

      {/* Control Dock */}
      <div className="fixed bottom-3 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-2.5 py-2 shadow-[0_16px_40px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:bottom-5 sm:gap-2 sm:px-3">
        <DockButton
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
          danger={isDeafened}
          onClick={toggleDeafen}
          icon={<SpeakerIcon enabled={!isDeafened} />}
          label={isDeafened ? 'Sound off' : 'Sound on'}
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
