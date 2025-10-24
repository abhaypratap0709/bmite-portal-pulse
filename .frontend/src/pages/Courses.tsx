import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  Clock, 
  DollarSign, 
  MapPin, 
  GraduationCap,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseSearchAndFilter from "@/components/CourseSearchAndFilter";
import { API_ENDPOINTS } from "@/config/api";
import { Course, CourseFilters } from "@/types";
import { handleApiCall, clearError } from "@/utils/errorHandler";
import { Skeleton, SkeletonCourseCard } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

interface Course {
  _id: string;
  name: string;
  code: string;
  department: string;
  duration: {
    years: number;
    semesters: number;
  };
  fees: {
    tuition: number;
    hostel: number;
    transport: number;
    other: number;
    total: number;
  };
  seats: {
    total: number;
    available: number;
  };
  admissionStatus: string;
  popularityScore: number;
  description: string;
  highlights: string[];
  prerequisites: string[];
  faculty: Array<{
    _id: string;
    profile: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  }>;
}

interface CourseFilters {
  department: string;
  admissionStatus: string;
  duration: string;
  minFees: string;
  maxFees: string;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [availableFilters, setAvailableFilters] = useState({
    departments: [] as string[],
    admissionStatuses: [] as string[],
    durations: [] as number[],
  });
  const [totalCourses, setTotalCourses] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const fetchCourses = async (searchQuery = "", filters: CourseFilters = {
    department: "",
    admissionStatus: "",
    duration: "",
    minFees: "",
    maxFees: "",
  }, isRetry = false) => {
    // Prevent infinite retries
    if (isRetry && retryCount >= 3) {
      setError("Maximum retry attempts reached. Please refresh the page.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      if (isRetry) {
        setIsRetrying(true);
        setRetryCount(prev => prev + 1);
      }
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (filters.department) params.append('department', filters.department);
      if (filters.admissionStatus) params.append('admissionStatus', filters.admissionStatus);
      if (filters.duration) params.append('duration', filters.duration);
      if (filters.minFees) params.append('minFees', filters.minFees);
      if (filters.maxFees) params.append('maxFees', filters.maxFees);
      params.append('page', currentPage.toString());
      params.append('limit', '12');

      const response = await fetch(`${API_ENDPOINTS.COURSES.LIST}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setCourses(result.data);
      setTotalCourses(result.total);
      setTotalPages(result.pages);
      setError(""); // Clear any previous errors
      setRetryCount(0); // Reset retry count on success
      
      // Set available filters from API response
      if (result.filters) {
        setAvailableFilters({
          departments: result.filters.departments || [],
          admissionStatuses: result.filters.admissionStatuses || [],
          durations: result.filters.durations || [],
        });
      }
    } catch (err) {
      setError("Failed to load courses");
      if (!isRetry) {
        toast.error("Failed to load courses");
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  const handleSearchAndFilter = useCallback(({ q, filters }: { q: string; filters: CourseFilters }) => {
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Set new debounced timer
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching/filtering
      fetchCourses(q, filters);
    }, 500); // 500ms debounce
    
    setDebounceTimer(timer);
  }, [debounceTimer]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 border-green-300';
      case 'closed': return 'bg-red-100 text-red-800 border-red-300';
      case 'coming-soon': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'closed': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'coming-soon': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-background py-8">
          <div className="container mx-auto px-4">
            {/* Header Skeleton */}
            <div className="mb-8 text-center">
              <Skeleton className="h-8 w-64 mx-auto mb-4" />
              <Skeleton className="h-4 w-96 mx-auto" />
            </div>
            
            {/* Search and Filter Skeleton */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            
            {/* Course Cards Skeleton */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCourseCard key={index} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-4">All Courses</h1>
            <p className="text-muted-foreground">
              Explore our comprehensive range of engineering programs
            </p>
            <div className="mt-4">
              <Badge variant="secondary" className="text-sm">
                {totalCourses} courses available
              </Badge>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <CourseSearchAndFilter
              onSearchAndFilter={handleSearchAndFilter}
              availableFilters={availableFilters}
            />
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                onClick={() => fetchCourses("", {}, true)} 
                disabled={isRetrying || retryCount >= 3}
              >
                {isRetrying ? "Retrying..." : "Retry"}
              </Button>
              {retryCount > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Retry attempts: {retryCount}/3
                </p>
              )}
            </div>
          )}

          {/* Courses Grid */}
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course._id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs">
                        {course.code}
                      </Badge>
                      <Badge className={getStatusColor(course.admissionStatus)}>
                        {getStatusIcon(course.admissionStatus)}
                        <span className="ml-1 capitalize">
                          {course.admissionStatus.replace('-', ' ')}
                        </span>
                      </Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{course.name}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Course Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{course.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{course.duration.years} Years</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{course.seats.available} seats</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{formatCurrency(course.fees.total)}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    {course.highlights.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          Highlights
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {course.highlights.slice(0, 3).map((highlight, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                          {course.highlights.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{course.highlights.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Faculty Count */}
                    {course.faculty.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="w-4 h-4" />
                        <span>{course.faculty.length} faculty member{course.faculty.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </CardContent>
                  
                  <div className="px-6 pb-6">
                    <Button className="w-full" disabled={course.admissionStatus === 'closed'}>
                      {course.admissionStatus === 'open' && 'Apply Now'}
                      {course.admissionStatus === 'closed' && 'Applications Closed'}
                      {course.admissionStatus === 'coming-soon' && 'Coming Soon'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 py-2 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
