import api from '@/api/api';
import type {
    UsersResponse,
    UserResponse,
    CreateUserRequest,
    UpdateUserRequest,
    UploadCsvResponse,
    AdminStats,
    UserRole,
} from '@/types';

export const adminService = {
    /**
     * Get all users, optionally filtered by role
     */
    async getUsers(role?: UserRole): Promise<UsersResponse> {
        const params = role ? { role } : {};
        const response = await api.get<UsersResponse>('/admin/users', { params });
        return response.data;
    },

    /**
     * Get single user by ID
     */
    async getUser(userId: number): Promise<{ id: number; username: string; role: string }> {
        const response = await api.get(`/admin/users/${userId}`);
        return response.data;
    },

    /**
     * Create new user
     */
    async createUser(data: CreateUserRequest): Promise<UserResponse> {
        const response = await api.post<UserResponse>('/admin/users', data);
        return response.data;
    },

    /**
     * Update existing user
     */
    async updateUser(userId: number, data: UpdateUserRequest): Promise<UserResponse> {
        const response = await api.put<UserResponse>(`/admin/users/${userId}`, data);
        return response.data;
    },

    /**
     * Delete user
     */
    async deleteUser(userId: number): Promise<{ msg: string }> {
        const response = await api.delete<{ msg: string }>(`/admin/users/${userId}`);
        return response.data;
    },

    /**
     * Upload CSV data file
     */
    async uploadCsv(file: File): Promise<UploadCsvResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<UploadCsvResponse>('/admin/upload_csv', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Get admin statistics
     */
    async getStats(): Promise<AdminStats> {
        const response = await api.get<AdminStats>('/admin/stats');
        return response.data;
    },
};

export default adminService;
