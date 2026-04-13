/**
 * @description Login response interface
 */
export interface LoginResponse {
    login: string;
};

/**
 * @description Login request interface
 */
export interface LoginRequest {
    username: string;
    password: string;
};



/**
 * @description Decoded JWT token payload
 */
export interface TokenPayload {
    user_id: string;
    username: string;
    user_first_name: string;
    user_last_name: string;
    role: string;
    rolePermission: Record<string, Record<string, { access: boolean; adminTenantOnly: boolean; immutable: boolean }>>;
    issuedAt: number;
    expiresAt: number;
}
