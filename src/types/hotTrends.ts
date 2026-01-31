export interface Trend {
  name: string;
  product: string;
  score: number;
  volume: number;
  top_region: string;
  tags: string[];
}

export interface TrendsResponse {
  hot_trends: Trend[];
  total: number;
  msg?: string;
}