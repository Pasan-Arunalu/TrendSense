import { createContext, useContext, useState, type ReactNode } from "react";

// Define the shape of our filters
export interface FilterState {
  gender: string;   // e.g., "All", "Male", "Female", "Others"
  region: string;   // e.g., "All", "Europe", "Asia"
  minAge: number;   // Slider value
  maxAge: number;   // Slider value
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // New Filter State
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Default Filter State
  const [filters, setFilters] = useState<FilterState>({
    gender: "All",
    region: "",
    minAge: 18,
    maxAge: 60,
  });

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, filters, setFilters }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};