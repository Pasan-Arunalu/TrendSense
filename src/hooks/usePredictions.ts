import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { managerService } from '@/services/managerService';
import type { PredictionBatch } from '@/types';

export const usePredictions = () => {
    const [predictions, setPredictions] = useState<PredictionBatch[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPredictions = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await managerService.getPredictions();
            setPredictions(response.predictions);
        } catch (error) {
            toast.error('Failed to fetch predictions');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPredictions();
    }, [fetchPredictions]);

    const deletePrediction = async (batchId: string) => {
        await managerService.deletePrediction(batchId);
        toast.success('Prediction batch deleted');
        fetchPredictions();
    };

    return { predictions, isLoading, refresh: fetchPredictions, deletePrediction };
};
