import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
import MainLayout from '@/layouts/MainLayout';

const DoctorsPage = lazy(() => import('@/pages/DoctorsPage'));
const DoctorDetailsPage = lazy(() => import('@/pages/DoctorDetailsPage'));
const AppointmentsPage = lazy(() => import('@/pages/AppointmentsPage'));
const BookAppointmentPage = lazy(() => import('@/pages/BookAppointmentPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const PageLoader = () => (
  <div className='flex items-center justify-center min-h-[50vh]'>
    <div className='animate-pulse text-muted-foreground font-medium'>Loading page...</div>
  </div>
);

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  // Catch-all — no layout, full-page 404
  {
    path: '*',
    element: withSuspense(NotFoundPage),
  },

  // Root layout — all main pages live inside here
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: withSuspense(DoctorsPage),
      },
      {
        path: 'doctors/:id',
        element: withSuspense(DoctorDetailsPage),
      },
      {
        path: 'appointments',
        element: withSuspense(AppointmentsPage),
      },
      {
        path: 'appointments/new',
        element: withSuspense(BookAppointmentPage),
      },
      {
        path: 'profile',
        element: withSuspense(ProfilePage),
      },
    ],
  },
]);

export default router;
