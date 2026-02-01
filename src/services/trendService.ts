import api from '@/api/api';
import type { AnalysisFilters, AnalysisResponse } from '@/types';

// Trend interface
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

// Taxonomy response
interface TaxonomyResponse {
  taxonomy: Record<string, string[]>;
  categories: string[];
}

// Category breakdown
interface CategoryBreakdown {
  category: string;
  velocity: number;
  volume: number;
}

interface CategoryBreakdownResponse {
  categories: CategoryBreakdown[];
  total: number;
  msg?: string;
}

// Search result
interface SearchResult {
  name: string;
  product: string;
  color: string;
  style: string;
  velocity: number;
  volume: number;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
}

// Available filters
interface AvailableFilters {
  regions: string[];
  seasons: string[];
  categories: string[];
  genders: string[];
  age_groups: string[];
  msg?: string;
}

export const trendService = {
  /**
   * Get hot/trending items
   */
  async getHotTrends(): Promise<TrendsResponse> {
    const response = await api.get<TrendsResponse>('/hot_trends');
    return response.data;
  },

  /**
   * Get product taxonomy
   */
  async getTaxonomy(): Promise<TaxonomyResponse> {
    const response = await api.get<TaxonomyResponse>('/taxonomy');
    return response.data;
  },

  /**
   * Analyze trends with filters
   */
  async analyzeTrends(filters: AnalysisFilters): Promise<AnalysisResponse> {
    const response = await api.post<AnalysisResponse>('/analyze', filters);
    return response.data;
  },

  /**
   * Get category breakdown
   */
  async getCategoryBreakdown(): Promise<CategoryBreakdownResponse> {
    const response = await api.get<CategoryBreakdownResponse>('/category_breakdown');
    return response.data;
  },

  /**
   * Search trends
   */
  async searchTrends(query: string): Promise<SearchResponse> {
    const response = await api.get<SearchResponse>('/search', {
      params: { q: query },
    });
    return response.data;
  },

  /**
   * Get available filter options
   */
  async getAvailableFilters(): Promise<AvailableFilters> {
    const response = await api.get<AvailableFilters>('/available_filters');
    return response.data;
  },
};

export default trendService;
export type {
  TrendsResponse,
  TaxonomyResponse,
  CategoryBreakdown,
  CategoryBreakdownResponse,
  SearchResult,
  SearchResponse,
  AvailableFilters,
};