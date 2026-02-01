import api from '@/api/api';
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    ValidateResponse,
} from '@/types';

export const authService = {
    /**
     * Login user with credentials
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },

    /**
     * Register new user
     */
    async register(data: RegisterRequest): Promise<RegisterResponse> {
        const response = await api.post<RegisterResponse>('/auth/register', data);
        return response.data;
    },

    /**
     * Validate current JWT token
     */
    async validateToken(): Promise<ValidateResponse> {
        const response = await api.get<ValidateResponse>('/auth/validate');
        return response.data;
    },

    /**
     * Store auth data in localStorage
     */
    storeAuthData(token: string, user: { id: number; username: string; role: string }): void {
        localStorage.setItem('access_token', token);
        localStorage.setItem('username', user.username);
        localStorage.setItem('role', user.role);
        localStorage.setItem('userId', String(user.id));
    },

    /**
     * Clear auth data from localStorage
     */
    clearAuthData(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
    },

    /**
     * Get stored token
     */
    getToken(): string | null {
        return localStorage.getItem('access_token');
    },

    /**
     * Check if user is authenticated (has token)
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('access_token');
    },

    /**
     * Get stored user role
     */
    getRole(): string | null {
        return localStorage.getItem('role');
    },
};

export default authService;
