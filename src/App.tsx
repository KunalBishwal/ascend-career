import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CareerMap from "./pages/CareerMap";
import Jobs from "./pages/Jobs";
import AIMentor from "./pages/AIMentor";
import Learning from "./pages/Learning";
import Profile from "./pages/Profile";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <AnimatedBackground />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/career-map" element={<ProtectedRoute><CareerMap /></ProtectedRoute>} />
            <Route path="/dashboard/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
            <Route path="/dashboard/mentor" element={<ProtectedRoute><AIMentor /></ProtectedRoute>} />
            <Route path="/dashboard/learning" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/dashboard/resume" element={<ProtectedRoute><ResumeAnalysis /></ProtectedRoute>} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
