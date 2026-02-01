// Prediction Filters
export interface PredictionFilters {
    region?: string;
    season?: string;
    gender?: string;
    age_group?: string;
}

// Prediction Item
export interface PredictionItem {
    id: number;
    uni_id: string;
    product: string;
    color: string | null;
    fabric: string | null;
    style: string | null;
    status: 'pending' | 'approved' | 'rejected';
    reviewed_at: string | null;
    reviewed_by: number | null;
}

// Prediction Batch
export interface PredictionBatch {
    uni_id: string;
    created_by: number;
    created_at: string | null;
    region: string | null;
    season: string | null;
    gender: string | null;
    age_group: string | null;
    items_count: number;
    items?: PredictionItem[];
}

// Generate Prediction Response
export interface GeneratePredictionResponse {
    msg: string;
    batch_id: string;
    items_count: number;
    filters: PredictionFilters;
    items: PredictionItem[];
}

// Preview Prediction Response
export interface PreviewPredictionResponse {
    msg: string;
    filters: PredictionFilters;
    results: Array<{
        product: string;
        color: string;
        fabric: string;
        style: string;
    }>;
    count: number;
}

// Predictions List Response
export interface PredictionsResponse {
    predictions: PredictionBatch[];
    total: number;
}

// Manager Stats
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
