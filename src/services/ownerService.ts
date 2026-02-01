import api from '@/api/api';
import type {
    PendingItemsResponse,
    PendingBatchesResponse,
    UpdateStatusRequest,
    UpdateStatusResponse,
    BatchUpdateStatusRequest,
    BatchUpdateResponse,
    ApproveBatchResponse,
    ReviewHistoryResponse,
    OwnerStats,
} from '@/types';

export const ownerService = {
    /**
     * Get pending items for review
     */
    async getPendingItems(batchId?: string): Promise<PendingItemsResponse> {
        const params = batchId ? { batch_id: batchId } : {};
        const response = await api.get<PendingItemsResponse>('/owner/pending_items', { params });
        return response.data;
    },

    /**
     * Get pending batches overview
     */
    async getPendingBatches(): Promise<PendingBatchesResponse> {
        const response = await api.get<PendingBatchesResponse>('/owner/pending_batches');
        return response.data;
    },

    /**
     * Update single item status (approve/reject)
     */
    async updateStatus(data: UpdateStatusRequest): Promise<UpdateStatusResponse> {
        const response = await api.post<UpdateStatusResponse>('/owner/update_status', data);
        return response.data;
    },

    /**
     * Batch update multiple items
     */
    async batchUpdateStatus(data: BatchUpdateStatusRequest): Promise<BatchUpdateResponse> {
        const response = await api.post<BatchUpdateResponse>('/owner/batch_update_status', data);
        return response.data;
    },

    /**
     * Approve all pending items in a batch
     */
    async approveBatch(batchId: string): Promise<ApproveBatchResponse> {
        const response = await api.post<ApproveBatchResponse>(`/owner/approve_batch/${batchId}`);
        return response.data;
    },

    /**
     * Get review history
     */
    async getReviewHistory(status?: 'approved' | 'rejected'): Promise<ReviewHistoryResponse> {
        const params = status ? { status } : {};
        const response = await api.get<ReviewHistoryResponse>('/owner/review_history', { params });
        return response.data;
    },

    /**
     * Get owner statistics
     */
    async getStats(): Promise<OwnerStats> {
        const response = await api.get<OwnerStats>('/owner/stats');
        return response.data;
    },
};

export default ownerService;
