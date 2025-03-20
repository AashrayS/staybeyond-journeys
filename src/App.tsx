
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import PropertyListing from "./pages/PropertyListing";
import PropertyDetail from "./pages/PropertyDetail";
import TransportPage from "./pages/TransportPage";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AddProperty from "./pages/AddProperty";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<PropertyListing />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/transport" element={<TransportPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
