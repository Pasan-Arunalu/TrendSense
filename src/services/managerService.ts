import api from '@/api/api';
import type {
    PredictionFilters,
    PredictionBatch,
    GeneratePredictionResponse,
    PreviewPredictionResponse,
    PredictionsResponse,
    ManagerStats,
} from '@/types';

export const managerService = {
    /**
     * Generate and store predictions with filters
     */
    async generatePrediction(filters: PredictionFilters): Promise<GeneratePredictionResponse> {
        const response = await api.post<GeneratePredictionResponse>(
            '/manager/generate_prediction',
            filters
        );
        return response.data;
    },

    /**
     * Preview predictions without saving
     */
    async previewPrediction(filters: PredictionFilters): Promise<PreviewPredictionResponse> {
        const response = await api.post<PreviewPredictionResponse>(
            '/manager/preview_prediction',
            filters
        );
        return response.data;
    },

    /**
     * Get all prediction batches
     */
    async getPredictions(status?: string): Promise<PredictionsResponse> {
        const params = status ? { status } : {};
        const response = await api.get<PredictionsResponse>('/manager/predictions', { params });
        return response.data;
    },

    /**
     * Get single prediction batch details
     */
    async getPredictionDetails(batchId: string): Promise<PredictionBatch> {
        const response = await api.get<PredictionBatch>(`/manager/predictions/${batchId}`);
        return response.data;
    },

    /**
     * Delete prediction batch
     */
    async deletePrediction(batchId: string): Promise<{ msg: string }> {
        const response = await api.delete<{ msg: string }>(`/manager/predictions/${batchId}`);
        return response.data;
    },

    /**
     * Get manager statistics
     */
    async getStats(): Promise<ManagerStats> {
        const response = await api.get<ManagerStats>('/manager/stats');
        return response.data;
    },
};

export default managerService;
