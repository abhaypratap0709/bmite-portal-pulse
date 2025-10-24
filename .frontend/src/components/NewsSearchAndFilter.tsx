import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, ChevronDown, Star, Calendar } from "lucide-react";

interface NewsFilters {
  category: string;
  featured: string;
  sort: string;
}

interface NewsSearchAndFilterProps {
  onSearchAndFilter: (params: { q: string; filters: NewsFilters }) => void;
  availableFilters: {
    categories: string[];
    tags: string[];
  };
  className?: string;
}

const NewsSearchAndFilter = ({
  onSearchAndFilter,
  availableFilters,
  className = "",
}: NewsSearchAndFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<NewsFilters>({
    category: "",
    featured: "",
    sort: "-publishDate",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search and filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchAndFilter({ q: searchQuery, filters });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filters, onSearchAndFilter]);

  const handleFilterChange = (key: keyof NewsFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilters({
      category: "",
      featured: "",
      sort: "-publishDate",
    });
  };

  const removeFilter = (key: keyof NewsFilters) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === 'sort' ? "-publishDate" : "",
    }));
  };

  const hasActiveFilters = 
    searchQuery.length > 0 ||
    filters.category !== "" ||
    filters.featured !== "" ||
    filters.sort !== "-publishDate";

  const activeFiltersCount = [
    filters.category,
    filters.featured,
    filters.sort !== "-publishDate" ? filters.sort : ""
  ].filter(value => value !== "").length;

  const getSortLabel = (sortValue: string) => {
    switch (sortValue) {
      case "-publishDate": return "Newest First";
      case "publishDate": return "Oldest First";
      case "-views": return "Most Viewed";
      case "-likes": return "Most Liked";
      default: return "Newest First";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search news by title, content, or tags..."
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
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearAllFilters} className="text-muted-foreground">
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
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
          {filters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {filters.category}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('category')}
              />
            </Badge>
          )}
          {filters.featured && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured Only
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('featured')}
              />
            </Badge>
          )}
          {filters.sort !== "-publishDate" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {getSortLabel(filters.sort)}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('sort')}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Filter Options */}
      {showFilters && (
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Filter Options</h4>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All Categories</option>
                {availableFilters.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Featured</label>
              <select
                value={filters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All Articles</option>
                <option value="true">Featured Only</option>
                <option value="false">Non-Featured Only</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="-publishDate">Newest First</option>
                <option value="publishDate">Oldest First</option>
                <option value="-views">Most Viewed</option>
                <option value="-likes">Most Liked</option>
                <option value="title">Title A-Z</option>
                <option value="-title">Title Z-A</option>
              </select>
            </div>
          </div>

          {/* Popular Tags */}
          {availableFilters.tags.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Popular Tags</label>
              <div className="flex flex-wrap gap-2">
                {availableFilters.tags.slice(0, 10).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setSearchQuery(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsSearchAndFilter;
