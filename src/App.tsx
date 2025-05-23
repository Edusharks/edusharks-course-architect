
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateCourse from "./pages/CreateCourse";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import AdminSettings from "./pages/AdminSettings";
import EditCourse from "./pages/EditCourse";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Navigate to="/" replace />} />
            <Route path="create-course" element={<CreateCourse />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admin/settings" element={<AdminSettings />} />
            <Route path="courses/:courseId/edit" element={<EditCourse />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
