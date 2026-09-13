/**
 * Ghost Call — Route Definitions
 * Simple, human-readable route paths for client navigation and API endpoints.
 */

const isBrowser = typeof window !== 'undefined';
const API_BASE = isBrowser && window.location.pathname.startsWith('/Ghost-call')
  ? '/Ghost-call/api'
  : '/api';

export const ROUTES = {
  // Client Pages
  HOME: '/',
  ROOM: (roomId: string, code?: string) =>
    `/room/${roomId}${code ? `?code=${code}` : ''}`,
  SHARE_ROOM: (roomId: string, code?: string) =>
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname.startsWith('/Ghost-call') ? '/Ghost-call' : ''}/room/${roomId}${code ? `?code=${code}` : ''}`
      : `/room/${roomId}${code ? `?code=${code}` : ''}`,
  ADMIN: '/admin',
  ADMIN_DATA: '/admin/data',

  // Backend API Endpoints (proxied via Vite -> http://localhost:4000/api)
  API: {
    CREATE_ROOM: `${API_BASE}/rooms`,
    GET_ROOM_BY_ID: (roomId: string) => `${API_BASE}/rooms/${roomId}`,
    GET_ROOM_BY_CODE: (code: string) => `${API_BASE}/rooms/code/${code}`,
    GENERATE_TOKEN: (roomId: string) => `${API_BASE}/rooms/${roomId}/token`,
    DELETE_ROOM: (roomId: string) => `${API_BASE}/rooms/${roomId}`,
    ADMIN_VERIFY: `${API_BASE}/admin/verify`,
    ADMIN_GET_ROOMS: `${API_BASE}/admin/rooms`,
    ADMIN_GET_DATA: `${API_BASE}/admin/data`,
    ADMIN_CREATE_SAMPLE: `${API_BASE}/admin/create-sample`,
    ADMIN_GET_PARTICIPANTS: (roomId: string) => `${API_BASE}/admin/rooms/${roomId}/participants`,
    ADMIN_TERMINATE_ROOM: (roomId: string) => `${API_BASE}/admin/rooms/${roomId}`,
    ADMIN_STATS: `${API_BASE}/admin/stats`,
  },
} as const;

export default ROUTES;
