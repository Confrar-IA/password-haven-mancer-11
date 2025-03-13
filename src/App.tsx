
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import { useState, useEffect } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { StorageFactory } from "./services/storage/StorageFactory";
import { toast } from "./components/ui/use-toast";

// Initialize the query client
const queryClient = new QueryClient();

// Ensure that the StorageFactory is initialized
StorageFactory.getStorage();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check server connection on startup
  useEffect(() => {
    const checkServer = async () => {
      try {
        await StorageFactory.checkServerConnection();
      } catch (error) {
        console.error("Server connection check failed:", error);
        toast({
          title: "Informação",
          description: "Servidor MySQL não encontrado. Usando modo de simulação.",
          variant: "default"
        });
      }
    };
    
    checkServer();
  }, []);

  // Check if the user is logged in
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = localStorage.getItem('currentUser');
      setIsAuthenticated(!!currentUser);
      setIsLoading(false);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  // Show a loading state until we've checked authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route 
                path="/" 
                element={isAuthenticated ? <Index /> : <Navigate to="/login" />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
