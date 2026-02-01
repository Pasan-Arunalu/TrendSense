// Local type definitions to avoid circular imports
export type UserRole = 'admin' | 'manager' | 'owner';

export interface User {
    id: number;
    username: string;
    role: UserRole;
    created_at: string | null;
    is_active: boolean;
}

// Auth Request Types
export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    role: UserRole;
}

// Auth Response Types
export interface LoginResponse {
    access_token: string;
    user: User;
}

export interface RegisterResponse {
    msg: string;
    user: User;
}

export interface ValidateResponse {
    valid: boolean;
    user?: {
        id: string;
        username: string;
        role: UserRole;
    };
    msg?: string;
}

// Token Payload (decoded JWT)
export interface TokenPayload {
    sub: string; // user id
    username: string;
    role: UserRole;
    exp: number;
    iat: number;
}

// Auth Context State
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
