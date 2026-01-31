import { useState, useCallback, useEffect } from 'react';
import { analyzeTrends } from '../services/analysisService';
import type { AnalysisResponse, AnalysisFilters } from '../types/analysis';

export const useTrendAnalysis = () => {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = useCallback(async (filters: AnalysisFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeTrends(filters);
      
      if (result.error) {
         setError(result.error);
         setData(null);
      } else {
         setData(result);
      }
    } catch (err: any) {
      const msg = err.response?.data?.msg || "Analysis failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    runAnalysis({});
  }, [runAnalysis]);

  return { data, isLoading, error, runAnalysis };
};