import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { trendService, type Trend, type CategoryBreakdown } from '@/services/trendService';

export const useAnalytics = () => {
    const [hotTrends, setHotTrends] = useState<Trend[]>([]);
    const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [trendsRes, categoriesRes] = await Promise.all([
                trendService.getHotTrends(),
                trendService.getCategoryBreakdown(),
            ]);
            setHotTrends(trendsRes.hot_trends);
            setCategories(categoriesRes.categories);
        } catch (error) {
            toast.error('Failed to load analytics data');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { hotTrends, categories, isLoading, refresh: fetchData };
};
