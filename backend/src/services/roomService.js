const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ROOM_TTL = 60 * 60 * 24; // 24 hours in seconds

/**
 * Save a room with its join code to Redis
 * Keys:
 *   room:{roomId}  -> { roomId, code, createdAt, livekitRoomName }
 *   code:{code}    -> roomId   (for reverse lookup)
 */
async function createRoom(roomId, code) {
  const room = {
    roomId,
    code,
    livekitRoomName: roomId,
    createdAt: Date.now(),
  };

  // Store room data
  await redis.set(`room:${roomId}`, JSON.stringify(room), { ex: ROOM_TTL });
  // Store code -> roomId mapping
  await redis.set(`code:${code}`, roomId, { ex: ROOM_TTL });
  // Track in active rooms set
  try {
    await redis.sadd('active_room_ids', roomId);
  } catch (e) {
    console.warn('Redis sadd warning:', e.message);
  }

  return room;
}

/**
 * Get room data by roomId
 */
async function getRoomById(roomId) {
  const data = await redis.get(`room:${roomId}`);
  if (!data) return null;
  return typeof data === 'string' ? JSON.parse(data) : data;
}

/**
 * Resolve a 6-digit code to a roomId
 */
async function getRoomByCode(code) {
  const roomId = await redis.get(`code:${code}`);
  if (!roomId) return null;
  return getRoomById(roomId);
}

/**
 * Delete a room and its code from Redis
 */
async function deleteRoom(roomId) {
  const room = await getRoomById(roomId);
  if (room) {
    await redis.del(`code:${room.code}`);
  }
  await redis.del(`room:${roomId}`);
  try {
    await redis.srem('active_room_ids', roomId);
  } catch (e) {
    console.warn('Redis srem warning:', e.message);
  }
}

/**
 * Get all tracked active rooms from Redis
 */
async function getAllRooms() {
  try {
    const allIds = new Set();

    // 1. Fetch all room keys directly from Redis (matches room:*)
    try {
      const keys = await redis.keys('room:*');
      if (Array.isArray(keys)) {
        keys.forEach((k) => {
          if (typeof k === 'string' && k.startsWith('room:')) {
            allIds.add(k.slice(5));
          }
        });
      }
    } catch (e) {
      console.warn('Redis keys scan warning:', e.message);
    }

    // 2. Also check active_room_ids set
    try {
      const setIds = await redis.smembers('active_room_ids');
      if (Array.isArray(setIds)) {
        setIds.forEach((id) => allIds.add(id));
      }
    } catch (e) {
      console.warn('Redis smembers warning:', e.message);
    }

    if (allIds.size === 0) return [];

    const rooms = [];
    for (const id of allIds) {
      const room = await getRoomById(id);
      if (room) {
        rooms.push(room);
        // Ensure active_room_ids set has it
        await redis.sadd('active_room_ids', id).catch(() => {});
      } else {
        // Room expired by TTL, prune from set
        await redis.srem('active_room_ids', id).catch(() => {});
      }
    }

    // Sort newest first
    rooms.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return rooms;
  } catch (err) {
    console.error('Error fetching all rooms from Redis:', err.message);
    return [];
  }
}

module.exports = { createRoom, getRoomById, getRoomByCode, deleteRoom, getAllRooms };
