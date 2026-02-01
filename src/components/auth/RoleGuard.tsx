import React from 'react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole | UserRole[];
    fallback?: React.ReactNode;
}


export const RoleGuard: React.FC<RoleGuardProps> = ({
    children,
    allowedRoles,
    fallback = null
}) => {
    const { hasRole } = useAuth();

    if (hasRole(allowedRoles)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};

export default RoleGuard;
