// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  
  // Courses
  COURSES: {
    LIST: `${API_BASE_URL}/courses`,
    DETAILS: (id: string) => `${API_BASE_URL}/courses/${id}`,
    SEARCH: `${API_BASE_URL}/courses/search`,
  },
  
  // News
  NEWS: {
    LIST: `${API_BASE_URL}/news`,
    DETAILS: (id: string) => `${API_BASE_URL}/news/${id}`,
    SEARCH: `${API_BASE_URL}/news/search`,
  },
  
  // Announcements
  ANNOUNCEMENTS: {
    LIST: `${API_BASE_URL}/announcements`,
    DETAILS: (id: string) => `${API_BASE_URL}/announcements/${id}`,
  },
  
  // Applications
  APPLICATIONS: {
    LIST: `${API_BASE_URL}/applications`,
    CREATE: `${API_BASE_URL}/applications`,
    DETAILS: (id: string) => `${API_BASE_URL}/applications/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/applications/${id}`,
  },
  
  // Admin
  ADMIN: {
    DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
    USERS: `${API_BASE_URL}/admin/users`,
    STATS: `${API_BASE_URL}/admin/stats`,
  },
  
  // Student
  STUDENT: {
    PROFILE: `${API_BASE_URL}/student/profile`,
    APPLICATIONS: `${API_BASE_URL}/student/applications`,
  },
  
  // Placements
  PLACEMENTS: {
    STATS: `${API_BASE_URL}/placements/stats`,
    COMPANIES: `${API_BASE_URL}/placements/companies`,
  },
  
  // Testimonials
  TESTIMONIALS: {
    LIST: `${API_BASE_URL}/testimonials`,
    CREATE: `${API_BASE_URL}/testimonials`,
  },
  
  // Events
  EVENTS: {
    LIST: `${API_BASE_URL}/events`,
    DETAILS: (id: string) => `${API_BASE_URL}/events/${id}`,
  },
} as const;

export default API_BASE_URL;
