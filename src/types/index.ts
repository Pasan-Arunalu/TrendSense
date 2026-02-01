// ==========================================
// User and Role Types
// ==========================================
export type UserRole = 'admin' | 'manager' | 'owner';

export interface User {
    id: number;
    username: string;
    role: UserRole;
    created_at: string | null;
    is_active: boolean;
}

// API Response Types
export interface ApiError {
    msg: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    role: UserRole;
}

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

export interface TokenPayload {
    sub: string;
    username: string;
    role: UserRole;
    exp: number;
    iat: number;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}


export interface UsersResponse {
    users: User[];
    total: number;
}

export interface UserResponse {
    user: User;
    msg?: string;
}

export interface CreateUserRequest {
    username: string;
    password: string;
    role: UserRole;
}

export interface UpdateUserRequest {
    password?: string;
    role?: UserRole;
    is_active?: boolean;
}

export interface UploadCsvResponse {
    msg: string;
    status: 'success' | 'error';
    data_summary?: {
        total_records?: number;
        regions?: string[];
        seasons?: string[];
        categories?: string[];
    };
}

export interface AdminStats {
    users: {
        total: number;
        active: number;
        by_role: Record<UserRole, number>;
    };
    predictions: {
        total_batches: number;
        total_items: number;
        pending: number;
        approved: number;
        rejected: number;
    };
}


export interface PredictionFilters {
    region?: string;
    season?: string;
    gender?: string;
    age_group?: string;
    category?: string;
}

export interface PredictionItem {
    id: number;
    product: string;
    color?: string;
    fabric?: string;
    style?: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at?: string;
    reviewed_at?: string;
    reviewed_by?: string;
}

export interface PredictionBatch {
    id: number;
    uni_id: string;
    created_by: number;
    created_at: string;
    region?: string;
    season?: string;
    gender?: string;
    age_group?: string;
    category?: string;
    items?: PredictionItem[];
}

export interface GeneratePredictionResponse {
    msg: string;
    batch_id: string;
    items_count: number;
    items: PredictionItem[];
}

export interface PreviewPredictionResponse {
    count: number;
    filters: PredictionFilters;
    results: Array<{
        product: string;
        color: string;
        fabric: string;
        style: string;
    }>;
}

export interface PredictionsResponse {
    predictions: PredictionBatch[];
    total: number;
}

export interface ManagerStats {
    total_batches: number;
    total_items: number;
    items_by_status: {
        pending: number;
        approved: number;
        rejected: number;
    };
    approval_rate: number;
}


export interface PendingItem {
    item_id: number;
    product: string;
    color?: string;
    fabric?: string;
    style?: string;
    batch_id: string;
    created_by: string;
    context: {
        region: string;
        season: string;
        gender?: string;
        age_group?: string;
    };
}

export interface PendingItemsResponse {
    pending_items: PendingItem[];
    total: number;
}

export interface PendingBatch {
    batch_id: string;
    created_by: string;
    created_at: string;
    pending_count: number;
    filters: PredictionFilters;
}

export interface PendingBatchesResponse {
    pending_batches: PendingBatch[];
    total: number;
}

export interface UpdateStatusRequest {
    item_id: number;
    action: 'approve' | 'reject';
}

export interface UpdateStatusResponse {
    msg: string;
    item_id: number;
    new_status: 'approved' | 'rejected';
}

export interface BatchUpdateStatusRequest {
    item_ids: number[];
    action: 'approve' | 'reject';
}

export interface BatchUpdateResponse {
    msg: string;
    updated_count: number;
    action: 'approve' | 'reject';
}

export interface ApproveBatchResponse {
    msg: string;
    batch_id: string;
    approved_count: number;
}

export interface ReviewHistoryItem {
    item_id: number;
    product: string;
    color?: string;
    fabric?: string;
    style?: string;
    status: 'approved' | 'rejected';
    batch_id: string;
    reviewed_by: string;
    reviewed_at: string;
}

export interface ReviewHistoryResponse {
    review_history: ReviewHistoryItem[];
    total: number;
}

export interface OwnerStats {
    total_items: number;
    items_by_status: {
        pending: number;
        approved: number;
        rejected: number;
    };
    approval_rate: number;
    rejection_rate: number;
}


export interface AnalysisFilters {
    region?: string;
    season?: string;
    gender?: string;
    age_group?: string;
    sub_category?: string;
}

export interface ChartForecast {
    labels: string[];
    title: string;
    values: number[];
}

export interface ChartVelocity {
    labels: string[];
    scores: number[];
    title: string;
}

export interface InsightsData {
    colors: string[];
    fabrics: string[];
    styles: string[];
}

export interface AnalysisResponse {
    chart_forecast: ChartForecast;
    chart_velocity: ChartVelocity;
    insights: InsightsData;
    data_points: number;
    filters_applied: AnalysisFilters;
    status: string;
    error?: string;
}

