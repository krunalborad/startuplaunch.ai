import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateStartup from "./pages/CreateStartup";
import Discover from "./pages/Discover";
import StartupDetail from "./pages/StartupDetail";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import ValidateIdea from "./pages/ValidateIdea";
import CoFounderMatch from "./pages/CoFounderMatch";
import Mentors from "./pages/Mentors";
import Progress from "./pages/Progress";
import StartupTV from "./pages/StartupTV";
import SuccessStoryDetail from "./pages/SuccessStoryDetail";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/home" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<><Navigation /><Dashboard /></>} />
            <Route path="/create" element={<><Navigation /><CreateStartup /></>} />
            <Route path="/discover" element={<><Navigation /><Discover /></>} />
            <Route path="/startup/:id" element={<><Navigation /><StartupDetail /></>} />
            <Route path="/profile" element={<><Navigation /><Profile /></>} />
            <Route path="/validate" element={<><Navigation /><ValidateIdea /></>} />
            <Route path="/match" element={<><Navigation /><CoFounderMatch /></>} />
            <Route path="/mentors" element={<><Navigation /><Mentors /></>} />
            <Route path="/progress" element={<><Navigation /><Progress /></>} />
            <Route path="/startup-tv" element={<><Navigation /><StartupTV /></>} />
            <Route path="/success-story/:id" element={<><Navigation /><SuccessStoryDetail /></>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;