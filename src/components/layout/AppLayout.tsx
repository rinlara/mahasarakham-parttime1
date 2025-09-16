import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}