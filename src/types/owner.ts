// Pending Item with Context
export interface PendingItem {
    item_id: number;
    batch_id: string;
    product: string;
    color: string | null;
    fabric: string | null;
    style: string | null;
    status: string;
    context: {
        season: string | null;
        region: string | null;
        gender: string | null;
        age_group: string | null;
    };
    created_by: string;
    created_at: string | null;
}

// Pending Batch
export interface PendingBatch {
    batch_id: string;
    created_by: string;
    created_at: string | null;
    parameters: {
        region: string | null;
        season: string | null;
        gender: string | null;
        age_group: string | null;
    };
    pending_count: number;
    total_items: number;
}

// Review Action Types
export type ReviewAction = 'approve' | 'reject';

export interface UpdateStatusRequest {
    item_id: number;
    action: ReviewAction;
}

export interface BatchUpdateStatusRequest {
    item_ids: number[];
    action: ReviewAction;
}

// Response Types
export interface PendingItemsResponse {
    pending_items: PendingItem[];
    total: number;
}

export interface PendingBatchesResponse {
    pending_batches: PendingBatch[];
    total: number;
}

export interface UpdateStatusResponse {
    msg: string;
    item: {
        id: number;
        status: string;
    };
}

export interface BatchUpdateResponse {
    msg: string;
    updated: number[];
    errors: string[] | null;
}

export interface ApproveBatchResponse {
    msg: string;
    batch_id: string;
    items_approved: number;
}

// Review History Item
export interface ReviewHistoryItem {
    item_id: number;
    batch_id: string;
    product: string;
    color: string | null;
    fabric: string | null;
    style: string | null;
    status: 'approved' | 'rejected';
    reviewed_at: string | null;
    reviewed_by: string;
    created_by: string;
    context: {
        season: string | null;
        region: string | null;
    };
}

export interface ReviewHistoryResponse {
    review_history: ReviewHistoryItem[];
    total: number;
}

// Owner Stats
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
