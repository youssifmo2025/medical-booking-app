import { createBrowserRouter } from 'react-router';
import MainLayout from '@/layouts/MainLayout';
import DoctorsPage from '@/pages/DoctorsPage';
import DoctorDetailsPage from '@/pages/DoctorDetailsPage';
import AppointmentsPage from '@/pages/AppointmentsPage';
import BookAppointmentPage from '@/pages/BookAppointmentPage';
import ProfilePage from '@/pages/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';

const router = createBrowserRouter([
  // Catch-all — no layout, full-page 404
  {
    path: '*',
    element: <NotFoundPage />,
  },

  // Root layout — all main pages live inside here
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DoctorsPage />,
      },
      {
        path: 'doctors/:id',
        element: <DoctorDetailsPage />,
      },
      {
        path: 'appointments',
        element: <AppointmentsPage />,
      },
      {
        path: 'appointments/new',
        element: <BookAppointmentPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
]);

export default router;
