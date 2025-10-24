// Common types used across the application

export interface LocationState {
  from?: {
    pathname: string;
  };
}

export interface UserData {
  id: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
}

export interface Course {
  _id: string;
  name: string;
  code: string;
  description: string;
  duration: number;
  fees: number;
  seats: number;
  category: string;
  level: string;
  image?: string;
  requirements: string[];
  curriculum: string[];
  faculty: string[];
  createdAt: string;
  updatedAt: string;
}

export interface News {
  _id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  image?: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  targetAudience: string[];
  publishedAt: string;
  expiresAt?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  studentId: string;
  courseId: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  documents: string[];
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  academicInfo: {
    previousEducation: string;
    gpa: number;
    testScores: {
      sat?: number;
      act?: number;
      gre?: number;
      gmat?: number;
    };
  };
}

export interface DashboardStats {
  totalStudents: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  totalCourses: number;
  totalNews: number;
  totalAnnouncements: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}

export interface SearchFilters {
  search?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CourseFilters extends SearchFilters {
  minFees?: number;
  maxFees?: number;
  duration?: number;
  level?: string;
}

export interface NewsFilters extends SearchFilters {
  author?: string;
  tags?: string[];
  isPublished?: boolean;
}

export interface AnnouncementFilters extends SearchFilters {
  priority?: string;
  targetAudience?: string[];
  isActive?: boolean;
}
