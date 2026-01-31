import api from '@/api/api'; 

export interface Trend {
  name: string;
  product: string;
  score: number;
  volume: number;
  top_region: string;
  tags: string[];
}

interface TrendsResponse {
  hot_trends: Trend[];
  total: number;
  msg?: string;
}

export const getHotTrends = async (): Promise<TrendsResponse> => {
  const response = await api.get<TrendsResponse>('/hot_trends');
  return response.data;
};