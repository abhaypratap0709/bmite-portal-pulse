import { Suspense, lazy, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Higher-order component for lazy loading with fallback
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  fallback?: React.ReactNode
) {
  return function LazyComponent(props: T) {
    return (
      <Suspense fallback={fallback || <Skeleton className="h-32 w-full" />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

// Lazy load heavy components
export const LazyAdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
export const LazyStudentProfile = lazy(() => import('@/pages/StudentProfile'));
export const LazyCourses = lazy(() => import('@/pages/Courses'));
export const LazyNews = lazy(() => import('@/pages/News'));
export const LazyAnnouncements = lazy(() => import('@/pages/Announcements'));
export const LazyAbout = lazy(() => import('@/pages/About'));
export const LazyContact = lazy(() => import('@/pages/Contact'));
export const LazyAdmissions = lazy(() => import('@/pages/Admissions'));

// Wrapped components with loading fallbacks
export const AdminDashboard = withLazyLoading(LazyAdminDashboard, <Skeleton className="h-96 w-full" />);
export const StudentProfile = withLazyLoading(LazyStudentProfile, <Skeleton className="h-96 w-full" />);
export const Courses = withLazyLoading(LazyCourses, <Skeleton className="h-96 w-full" />);
export const News = withLazyLoading(LazyNews, <Skeleton className="h-96 w-full" />);
export const Announcements = withLazyLoading(LazyAnnouncements, <Skeleton className="h-96 w-full" />);
export const About = withLazyLoading(LazyAbout, <Skeleton className="h-96 w-full" />);
export const Contact = withLazyLoading(LazyContact, <Skeleton className="h-96 w-full" />);
export const Admissions = withLazyLoading(LazyAdmissions, <Skeleton className="h-96 w-full" />);
