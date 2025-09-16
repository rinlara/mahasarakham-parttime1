
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ApplicantDashboard from '@/components/dashboards/ApplicantDashboard';
import { Navigate } from 'react-router-dom';

export default function ApplicantDashboardPage() {
  console.log('ApplicantDashboardPage rendering...');
  
  try {
    const { user, isLoading } = useAuth();
    
    console.log('ApplicantDashboard - User:', user);
    console.log('ApplicantDashboard - isLoading:', isLoading);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-xl text-gray-600">กำลังโหลด...</div>
          </div>
        </div>
      );
    }

    if (!user) {
      console.log('No user found, redirecting to login');
      return <Navigate to="/login" replace />;
    }

    if (user.role !== 'applicant') {
      console.log('User is not applicant, redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    }

    return <ApplicantDashboard />;
  } catch (error) {
    console.error('Error in ApplicantDashboardPage:', error);
    return <Navigate to="/login" replace />;
  }
}
