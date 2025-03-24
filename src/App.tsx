
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import PropertyListing from "./pages/PropertyListing";
import PropertyDetail from "./pages/PropertyDetail";
import TransportPage from "./pages/TransportPage";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AddProperty from "./pages/AddProperty";
import BecomeHost from "./pages/BecomeHost";
import { MotionConfig } from "framer-motion";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create App component that includes AuthProvider
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <MotionConfig reducedMotion="user">
            <TooltipProvider>
              <Toaster />
              <Sonner position="top-right" closeButton />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/properties" element={<PropertyListing />} />
                <Route path="/properties/:id" element={<PropertyDetail />} />
                <Route path="/transport" element={<TransportPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/become-host" element={<BecomeHost />} />
                <Route 
                  path="/add-property" 
                  element={
                    <ProtectedRoute>
                      <AddProperty />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </MotionConfig>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  
  return <>{children}</>;
};

// Import useAuth at the top of the file
import { useAuth } from "./contexts/AuthContext";

export default App;
