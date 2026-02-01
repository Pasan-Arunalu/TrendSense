import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole, AuthState } from '@/types';
import authService from '@/services/authService';

interface AuthContextType extends AuthState {
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string, role: UserRole) => Promise<void>;
    logout: () => void;
    hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Validate token on mount
    useEffect(() => {
        const validateSession = async () => {
            const storedToken = authService.getToken();

            if (!storedToken) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await authService.validateToken();

                if (response.valid && response.user) {
                    setToken(storedToken);
                    setUser({
                        id: parseInt(response.user.id),
                        username: response.user.username,
                        role: response.user.role,
                        created_at: null,
                        is_active: true,
                    });
                } else {
                    authService.clearAuthData();
                }
            } catch (error) {
                console.error('Token validation failed:', error);
                authService.clearAuthData();
            } finally {
                setIsLoading(false);
            }
        };

        validateSession();
    }, []);

    const login = useCallback(async (username: string, password: string) => {
        const response = await authService.login({ username, password });

        authService.storeAuthData(response.access_token, response.user);
        setToken(response.access_token);
        setUser(response.user);
    }, []);

    const register = useCallback(async (username: string, password: string, role: UserRole) => {
        await authService.register({ username, password, role });
    }, []);

    const logout = useCallback(() => {
        authService.clearAuthData();
        setToken(null);
        setUser(null);
    }, []);

    const hasRole = useCallback((roles: UserRole | UserRole[]) => {
        if (!user) return false;

        const roleArray = Array.isArray(roles) ? roles : [roles];
        return roleArray.includes(user.role);
    }, [user]);

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
