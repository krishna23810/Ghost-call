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
  if (!room) return;
  await redis.del(`room:${roomId}`);
  await redis.del(`code:${room.code}`);
}

module.exports = { createRoom, getRoomById, getRoomByCode, deleteRoom };
