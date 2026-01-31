export interface AnalysisFilters {
  sub_category?: string;
  season?: string;
  region?: string;
  [key: string]: any; 
}

export interface VelocityChartData {
  title: string;
  labels: string[];
  scores: number[];
}

export interface ForecastChartData {
  title: string;
  labels: string[];
  values: number[];
}

export interface InsightsData {
  colors: string[];
  fabrics: string[];
  styles: string[];
}

export interface AnalysisResponse {
  status: string;
  filters_applied: AnalysisFilters;
  data_points: number;
  chart_velocity: VelocityChartData;
  chart_forecast: ForecastChartData;
  insights: InsightsData;
  error?: string; 
}