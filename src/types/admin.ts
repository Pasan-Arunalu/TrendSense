import type { User, UserRole } from './index';

// User Management Types
export interface CreateUserRequest {
    username: string;
    password: string;
    role: UserRole;
}

export interface UpdateUserRequest {
    role?: UserRole;
    is_active?: boolean;
    password?: string;
}

export interface UsersResponse {
    users: User[];
    total: number;
}

export interface UserResponse {
    msg: string;
    user: User;
}

// CSV Upload Types
export interface UploadCsvResponse {
    msg: string;
    status: 'success' | 'partial_success' | 'processing_failed';
    data_summary?: DataSummary;
}

export interface DataSummary {
    total_records?: number;
    regions?: string[];
    seasons?: string[];
    categories?: string[];
}

// Admin Stats Types
export interface AdminStats {
    users: {
        total: number;
        admins: number;
        managers: number;
        owners: number;
        active: number;
    };
    predictions: {
        total_batches: number;
        total_items: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    data: DataSummary;
}
