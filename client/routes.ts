/**
 * Ghost Call — Client & API Route Definitions
 * Centralized route mapping for client-side navigation and backend API endpoints.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const ROUTES = {
  // Client Pages
  HOME: '/',
  ROOM: (roomId: string, code?: string) =>
    `/room/${roomId}${code ? `?code=${code}` : ''}`,

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
