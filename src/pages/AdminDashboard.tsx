
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import { Navigate } from 'react-router-dom';

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();

  console.log('AdminDashboardPage - user:', user, 'isLoading:', isLoading);

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
    console.log('No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin - be more flexible with role checking
  const isAdmin = user.role === 'admin' || user.role === 'ผู้ดูแลระบบ';
  console.log('User role:', user.role, 'isAdmin:', isAdmin);

  if (!isAdmin) {
    console.log('User is not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return <AdminDashboard />;
}
