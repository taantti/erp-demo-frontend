import type { TokenPayload } from '../types/auth';

/**
 * Decodes a JWT token and returns the payload
 * @param token The JWT token to decode
 * @returns The decoded payload or null if decoding fails
 */
export const decodeToken = (token: string): TokenPayload | null => {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch (error) {
        console.log("Failed to decode token." + error);
        return null;
    }
}