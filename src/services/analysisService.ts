import api from '@/api/api';
import type { AnalysisFilters, AnalysisResponse } from '../types/analysis';

export const analyzeTrends = async (filters: AnalysisFilters = {}): Promise<AnalysisResponse> => {
  const response = await api.post<AnalysisResponse>('/analyze', filters);
  return response.data;
};