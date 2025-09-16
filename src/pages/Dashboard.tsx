
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  console.log('Dashboard - User:', user?.id, 'Role:', user?.role, 'isLoading:', isLoading);

  if (isLoading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('Redirecting based on user role:', user.role);

  // Redirect to appropriate dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'employer':
      return <Navigate to="/employer/dashboard" replace />;
    case 'applicant':
      return <Navigate to="/applicant/dashboard" replace />;
    default:
      console.log('Unknown role, redirecting to jobs page');
      return <Navigate to="/jobs" replace />;
  }
}
