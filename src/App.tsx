import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import Dashboard from "./pages/Dashboard";
import AdminDashboardPage from "./pages/AdminDashboard"; // ✅ เปลี่ยนชื่อเป็น Page
import EmployerDashboard from "./pages/EmployerDashboard";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import Companies from "./pages/Companies";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import UserGuidePage from "./pages/UserGuide";
import AdsContact from "@/pages/AdsContact";

const queryClient = new QueryClient();

const App = () => {
  console.log("App: Rendering main application...");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <DataProvider>
              <Routes>
                {/* Routes ที่ไม่ใช้ sidebar */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Routes ที่ใช้ sidebar */}
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<Index />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route
                    path="/admin/dashboard"
                    element={<AdminDashboardPage />}
                  />
                  <Route
                    path="/employer/dashboard"
                    element={<EmployerDashboard />}
                  />
                  <Route
                    path="/applicant/dashboard"
                    element={<ApplicantDashboard />}
                  />
                  <Route path="/companies" element={<Companies />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/ads-contact" element={<AdsContact />} />

                  {/* User Guide */}
                  <Route path="/user-guide" element={<UserGuidePage />} />
                  <Route
                    path="/guide"
                    element={<Navigate to="/user-guide" replace />}
                  />

                  {/* Catch all */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </DataProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
