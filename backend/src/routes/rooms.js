const express = require('express');
const router = express.Router();
const { generateId, generateCode } = require('../utils/codeGenerator');
const { createRoom, getRoomById, getRoomByCode, deleteRoom } = require('../services/roomService');
const { generateToken } = require('../services/livekitService');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || req.ip || 'Unknown IP';
}

// POST /api/rooms — Create a new anonymous room
router.post('/', async (req, res) => {
  try {
    const clientIp = getClientIp(req);
    const roomId = generateId();
    const code = generateCode();
    const room = await createRoom(roomId, code);

    console.log(`\n\x1b[32m🆕 [ROOM CREATED]\x1b[0m`);
    console.log(`   ├─ Client IP:  \x1b[36m${clientIp}\x1b[0m`);
    console.log(`   ├─ Room ID:    \x1b[33m${room.roomId}\x1b[0m`);
    console.log(`   └─ Join Code:  \x1b[35m${room.code}\x1b[0m\n`);

    res.json({
      roomId: room.roomId,
      code: room.code,
      joinLink: `${FRONTEND_URL}/room/${room.roomId}`,
    });
  } catch (err) {
    console.error('Create room error:', err);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// GET /api/rooms/code/:code — Resolve 6-digit code to room
router.get('/code/:code', async (req, res) => {
  try {
    const clientIp = getClientIp(req);
    const room = await getRoomByCode(req.params.code);
    if (!room) return res.status(404).json({ error: 'Code not found or expired' });

    console.log(`\n\x1b[34m🔍 [CODE RESOLVED]\x1b[0m`);
    console.log(`   ├─ Client IP:  \x1b[36m${clientIp}\x1b[0m`);
    console.log(`   ├─ Code Used:  \x1b[35m${req.params.code}\x1b[0m`);
    console.log(`   └─ Room ID:    \x1b[33m${room.roomId}\x1b[0m\n`);

    res.json({ roomId: room.roomId });
  } catch (err) {
    console.error('Resolve code error:', err);
    res.status(500).json({ error: 'Failed to resolve code' });
  }
});

// GET /api/rooms/:roomId — Check if room exists
router.get('/:roomId', async (req, res) => {
  try {
    const clientIp = getClientIp(req);
    const room = await getRoomById(req.params.roomId);
    if (!room) return res.status(404).json({ error: 'Room not found or expired' });

    res.json({ exists: true, roomId: room.roomId });
  } catch (err) {
    console.error('Get room error:', err);
    res.status(500).json({ error: 'Failed to get room' });
  }
});

// POST /api/rooms/:roomId/token — Get anonymous LiveKit token to join
router.post('/:roomId/token', async (req, res) => {
  try {
    const clientIp = getClientIp(req);
    const room = await getRoomById(req.params.roomId);
    if (!room) return res.status(404).json({ error: 'Room not found or expired' });

    const { token, identity, displayName } = await generateToken(room.livekitRoomName);

    console.log(`\n\x1b[36m👤 [USER CONNECTING]\x1b[0m`);
    console.log(`   ├─ Participant IP:   \x1b[36m${clientIp}\x1b[0m`);
    console.log(`   ├─ Target Room ID:   \x1b[33m${room.roomId}\x1b[0m`);
    console.log(`   └─ Assigned Name:    \x1b[32m${displayName}\x1b[0m (\x1b[90m${identity}\x1b[0m)\n`);

    res.json({ token, identity, displayName, livekitUrl: process.env.LIVEKIT_URL });
  } catch (err) {
    console.error('Token error:', err);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// DELETE /api/rooms/:roomId — Clean up room
router.delete('/:roomId', async (req, res) => {
  try {
    const clientIp = getClientIp(req);
    await deleteRoom(req.params.roomId);

    console.log(`\n\x1b[31m🗑️ [ROOM DELETED]\x1b[0m`);
    console.log(`   ├─ Client IP:  \x1b[36m${clientIp}\x1b[0m`);
    console.log(`   └─ Room ID:    \x1b[33m${req.params.roomId}\x1b[0m\n`);

    res.json({ success: true });
  } catch (err) {
    console.error('Delete room error:', err);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

module.exports = router;
