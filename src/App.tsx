import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatedBackground } from "@/components/ui/animated-background";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CareerMap from "./pages/CareerMap";
import Jobs from "./pages/Jobs";
import AIMentor from "./pages/AIMentor";
import Learning from "./pages/Learning";
import Profile from "./pages/Profile";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AnimatedBackground />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/career-map" element={<CareerMap />} />
          <Route path="/dashboard/jobs" element={<Jobs />} />
          <Route path="/dashboard/mentor" element={<AIMentor />} />
          <Route path="/dashboard/learning" element={<Learning />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/resume" element={<ResumeAnalysis />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
