/**
 * Ghost Call — Client & API Route Definitions
 * Centralized route mapping for client-side navigation and backend API endpoints.
 */

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/Ghost-call';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || BASE_PATH;

export const ROUTES = {
  // Client Navigation Pages (Next.js router automatically prepends basePath)
  HOME: '/',
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
  },
} as const;

export default ROUTES;
