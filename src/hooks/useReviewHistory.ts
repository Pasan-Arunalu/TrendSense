import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ownerService } from '@/services/ownerService';
import type { ReviewHistoryItem } from '@/types';

type StatusFilter = 'all' | 'approved' | 'rejected';

export const useReviewHistory = () => {
    const [history, setHistory] = useState<ReviewHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<StatusFilter>('all');

    const fetchHistory = useCallback(async (status?: 'approved' | 'rejected') => {
        try {
            setIsLoading(true);
            const response = await ownerService.getReviewHistory(status);
            setHistory(response.review_history);
        } catch (error) {
            toast.error('Failed to fetch review history');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory(filter === 'all' ? undefined : filter);
    }, [filter, fetchHistory]);

    const handleFilterChange = (value: StatusFilter) => {
        setFilter(value);
    };

    return {
        history,
        isLoading,
        filter,
        handleFilterChange,
        refresh: () => fetchHistory(filter === 'all' ? undefined : filter),
    };
};
