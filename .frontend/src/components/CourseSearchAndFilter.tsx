import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, ChevronDown, SlidersHorizontal } from "lucide-react";

interface CourseFilters {
  department: string;
  admissionStatus: string;
  duration: string;
  minFees: string;
  maxFees: string;
}

interface CourseSearchAndFilterProps {
  onSearchAndFilter: (params: { q: string; filters: CourseFilters }) => void;
  availableFilters: {
    departments: string[];
    admissionStatuses: string[];
    durations: number[];
  };
  className?: string;
}

const CourseSearchAndFilter = ({
  onSearchAndFilter,
  availableFilters,
  className = "",
}: CourseSearchAndFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<CourseFilters>({
    department: "",
    admissionStatus: "",
    duration: "",
    minFees: "",
    maxFees: "",
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Debounce search and filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchAndFilter({ q: searchQuery, filters });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filters, onSearchAndFilter]);

  const handleFilterChange = (key: keyof CourseFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilters({
      department: "",
      admissionStatus: "",
      duration: "",
      minFees: "",
      maxFees: "",
    });
  };

  const removeFilter = (key: keyof CourseFilters) => {
    setFilters(prev => ({
      ...prev,
      [key]: "",
    }));
  };

  const hasActiveFilters = 
    searchQuery.length > 0 ||
    Object.values(filters).some(value => value !== "");

  const activeFiltersCount = Object.values(filters).filter(value => value !== "").length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search courses by name, code, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Advanced Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
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
          {filters.department && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Department: {filters.department}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('department')}
              />
            </Badge>
          )}
          {filters.admissionStatus && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {filters.admissionStatus}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('admissionStatus')}
              />
            </Badge>
          )}
          {filters.duration && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Duration: {filters.duration} years
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter('duration')}
              />
            </Badge>
          )}
          {(filters.minFees || filters.maxFees) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Fees: {filters.minFees || '0'} - {filters.maxFees || '∞'}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => {
                  removeFilter('minFees');
                  removeFilter('maxFees');
                }}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Advanced Filters</h4>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {/* Department Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All Departments</option>
                {availableFilters.departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Admission Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Admission Status</label>
              <select
                value={filters.admissionStatus}
                onChange={(e) => handleFilterChange('admissionStatus', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All Statuses</option>
                {availableFilters.admissionStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <select
                value={filters.duration}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All Durations</option>
                {availableFilters.durations.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} Year{duration > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Fees Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Fees (₹)</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minFees}
                onChange={(e) => handleFilterChange('minFees', e.target.value)}
                className="text-sm"
              />
            </div>

            {/* Max Fees Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Fees (₹)</label>
              <Input
                type="number"
                placeholder="No limit"
                value={filters.maxFees}
                onChange={(e) => handleFilterChange('maxFees', e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseSearchAndFilter;
