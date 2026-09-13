/**
 * Ghost Call — Route Definitions
 * Simple, human-readable route paths for client navigation and API endpoints.
 */

export const ROUTES = {
  // Client Pages
  HOME: '/',
  ROOM: (roomId: string, code?: string) =>
    `/room/${roomId}${code ? `?code=${code}` : ''}`,
  SHARE_ROOM: (roomId: string, code?: string) =>
    typeof window !== 'undefined'
      ? `${window.location.origin}/room/${roomId}${code ? `?code=${code}` : ''}`
      : `/room/${roomId}${code ? `?code=${code}` : ''}`,
  ADMIN: '/admin',
  ADMIN_DATA: '/admin/data',

  // Backend API Endpoints (proxied via Vite /api -> http://localhost:4000/api)
  API: {
    CREATE_ROOM: '/api/rooms',
    GET_ROOM_BY_ID: (roomId: string) => `/api/rooms/${roomId}`,
    GET_ROOM_BY_CODE: (code: string) => `/api/rooms/code/${code}`,
    GENERATE_TOKEN: (roomId: string) => `/api/rooms/${roomId}/token`,
    DELETE_ROOM: (roomId: string) => `/api/rooms/${roomId}`,
    ADMIN_VERIFY: '/api/admin/verify',
    ADMIN_GET_ROOMS: '/api/admin/rooms',
    ADMIN_GET_DATA: '/api/admin/data',
    ADMIN_CREATE_SAMPLE: '/api/admin/create-sample',
    ADMIN_GET_PARTICIPANTS: (roomId: string) => `/api/admin/rooms/${roomId}/participants`,
    ADMIN_TERMINATE_ROOM: (roomId: string) => `/api/admin/rooms/${roomId}`,
    ADMIN_STATS: '/api/admin/stats',
  },
} as const;

export default ROUTES;
