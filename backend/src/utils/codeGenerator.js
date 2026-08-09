const { customAlphabet } = require('nanoid');

// Only uppercase letters + numbers, easy to read (no 0/O/1/I confusion)
const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const generateId = customAlphabet(alphabet, 8);     // room ID: e.g. "AX7K9BQR"
const generateCode = customAlphabet('0123456789', 6); // join code: e.g. "748291"

module.exports = { generateId, generateCode };
