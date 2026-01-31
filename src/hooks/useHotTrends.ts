import { useState, useEffect } from 'react';
import api from '@/api/api'; 
import type { Trend, TrendsResponse } from '../types/hotTrends';

export const useHotTrends = () => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<TrendsResponse>('/hot_trends');
        setTrends(response.data.hot_trends || []);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching trends:", err);
        setError(err.message || "Failed to load trends");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrends();
  }, []);

  return { trends, isLoading, error };
};