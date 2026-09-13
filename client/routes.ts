/**
 * Ghost Call — Client & API Route Definitions
 * Centralized route mapping for client-side navigation and backend API endpoints.
 */

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/Ghost-call';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || BASE_PATH;

export const ROUTES = {
  // Client Navigation Pages (Next.js router automatically prepends basePath)
  HOME: '/',
  ADMIN: '/admin',
  ADMIN_DATA: '/admin/data',
  ROOM: (roomId: string, code?: string) =>
    `/room/${roomId}${code ? `?code=${code}` : ''}`,

  // Full Path for Share Links (includes basePath for external URL sharing)
  SHARE_ROOM: (roomId: string, code?: string) =>
    `${BASE_PATH}/room/${roomId}${code ? `?code=${code}` : ''}`,

  // Backend REST API Endpoints
  API: {
    CREATE_ROOM: `${API_BASE_URL}/api/rooms`,
    GET_ROOM_BY_ID: (roomId: string) => `${API_BASE_URL}/api/rooms/${roomId}`,
    GET_ROOM_BY_CODE: (code: string) => `${API_BASE_URL}/api/rooms/code/${code}`,
    GENERATE_TOKEN: (roomId: string) => `${API_BASE_URL}/api/rooms/${roomId}/token`,
    DELETE_ROOM: (roomId: string) => `${API_BASE_URL}/api/rooms/${roomId}`,
    ADMIN_VERIFY: `${API_BASE_URL}/api/admin/verify`,
    ADMIN_GET_ROOMS: `${API_BASE_URL}/api/admin/rooms`,
    ADMIN_GET_DATA: `${API_BASE_URL}/api/admin/data`,
    ADMIN_CREATE_SAMPLE: `${API_BASE_URL}/api/admin/create-sample`,
    ADMIN_GET_PARTICIPANTS: (roomId: string) => `${API_BASE_URL}/api/admin/rooms/${roomId}/participants`,
    ADMIN_TERMINATE_ROOM: (roomId: string) => `${API_BASE_URL}/api/admin/rooms/${roomId}`,
    ADMIN_STATS: `${API_BASE_URL}/api/admin/stats`,
  },
} as const;

export default ROUTES;
