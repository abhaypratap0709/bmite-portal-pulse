import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, ChevronDown } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Record<string, string>) => void;
  searchPlaceholder?: string;
  filters: {
    [key: string]: {
      label: string;
      options: FilterOption[];
      placeholder?: string;
    };
  };
  showAdvanced?: boolean;
  className?: string;
}

const SearchAndFilter = ({
  onSearch,
  onFilter,
  searchPlaceholder = "Search...",
  filters,
  showAdvanced = false,
  className = "",
}: SearchAndFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(showAdvanced);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        onSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  // Apply filters when they change
  useEffect(() => {
    onFilter(activeFilters);
  }, [activeFilters, onFilter]);

  const handleFilterChange = (filterKey: string, value: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (value === "" || value === "all") {
        delete newFilters[filterKey];
      } else {
        newFilters[filterKey] = value;
      }
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
  };

  const removeFilter = (filterKey: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || searchQuery.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearAllFilters} className="text-muted-foreground">
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{searchQuery}"
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => setSearchQuery("")}
              />
            </Badge>
          )}
          {Object.entries(activeFilters).map(([key, value]) => {
            const filterConfig = filters[key];
            if (!filterConfig) return null;
            
            const option = filterConfig.options.find(opt => opt.value === value);
            return (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                {filterConfig.label}: {option?.label || value}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeFilter(key)}
                />
              </Badge>
            );
          })}
        </div>
      )}

      {/* Filter Options */}
      {showFilters && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.entries(filters).map(([key, filterConfig]) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium">{filterConfig.label}</label>
              <select
                value={activeFilters[key] || ""}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">
                  {filterConfig.placeholder || `All ${filterConfig.label}`}
                </option>
                {filterConfig.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
