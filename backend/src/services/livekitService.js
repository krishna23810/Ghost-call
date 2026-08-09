const { AccessToken } = require('livekit-server-sdk');

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

// Random anonymous display names like "Swift Fox", "Bold Eagle"
const adjectives = ['Swift', 'Bold', 'Calm', 'Bright', 'Quick', 'Cool', 'Dark', 'Wise', 'Brave', 'Kind'];
const animals = ['Fox', 'Eagle', 'Wolf', 'Bear', 'Hawk', 'Lynx', 'Deer', 'Crow', 'Owl', 'Hare'];

function randomDisplayName() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adj} ${animal}`;
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

module.exports = { generateToken };
