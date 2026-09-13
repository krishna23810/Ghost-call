const { AccessToken, RoomServiceClient } = require('livekit-server-sdk');

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

// Random anonymous display names like "Swift Fox", "Bold Eagle"
const adjectives = ['Swift', 'Bold', 'Calm', 'Bright', 'Quick', 'Cool', 'Dark', 'Wise', 'Brave', 'Kind'];
const animals = ['Fox', 'Eagle', 'Wolf', 'Bear', 'Hawk', 'Lynx', 'Deer', 'Crow', 'Owl', 'Hare'];

function randomDisplayName() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adj} ${animal}`;
}

/**
 * Helper to get a configured LiveKit RoomServiceClient instance
 */
function getRoomServiceClient() {
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    return null;
  }
  const httpUrl = LIVEKIT_URL.replace(/^wss:\/\//i, 'https://').replace(/^ws:\/\//i, 'http://');
  try {
    return new RoomServiceClient(httpUrl, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
  } catch (err) {
    console.error('Failed to initialize RoomServiceClient:', err);
    return null;
  }
}

/**
 * Generate an anonymous LiveKit access token for a room.
 * No user account needed — just a random identity.
 */
async function generateToken(roomName) {
  const identity = `anon-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const displayName = randomDisplayName();

  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
    name: displayName,
    ttl: '4h',
  });

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  const token = await at.toJwt();

  return { token, identity, displayName };
}

function safeNumber(val, fallback = 0) {
  if (val == null) return fallback;
  if (typeof val === 'number') return val;
  if (typeof val === 'bigint') return Number(val);
  if (typeof val.toNumber === 'function') return val.toNumber();
  const parsed = parseInt(val.toString(), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

/**
 * List all active LiveKit rooms
 */
async function listLiveRooms() {
  const client = getRoomServiceClient();
  if (!client) return [];
  try {
    const rooms = await client.listRooms();
    return (rooms || []).map((r) => ({
      name: r.name,
      sid: r.sid,
      numParticipants: safeNumber(r.numParticipants, 0),
      creationTime: r.creationTime ? safeNumber(r.creationTime) * 1000 : null,
      activeRecording: Boolean(r.activeRecording),
    }));
  } catch (err) {
    console.warn('LiveKit listRooms error:', err.message);
    return [];
  }
}

/**
 * List active participants in a specific LiveKit room
 */
async function listRoomParticipants(roomName) {
  const client = getRoomServiceClient();
  if (!client) return [];
  try {
    const participants = await client.listParticipants(roomName);
    return (participants || []).map((p) => ({
      identity: p.identity,
      name: p.name || 'Anonymous',
      joinedAt: p.joinedAt ? safeNumber(p.joinedAt) * 1000 : null,
      state: p.state,
      isPublisher: Boolean(p.isPublisher),
      tracksCount: p.tracks ? p.tracks.length : 0,
    }));
  } catch (err) {
    console.warn(`LiveKit listParticipants error for ${roomName}:`, err.message);
    return [];
  }
}

/**
 * Force delete/close a room in LiveKit and disconnect peers
 */
async function deleteLiveRoom(roomName) {
  const client = getRoomServiceClient();
  if (!client) return;
  try {
    await client.deleteRoom(roomName);
  } catch (err) {
    console.warn(`LiveKit deleteRoom error for ${roomName}:`, err.message);
  }
}

module.exports = {
  generateToken,
  listLiveRooms,
  listRoomParticipants,
  deleteLiveRoom,
};
