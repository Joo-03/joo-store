import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Helper component to handle redirects with the base URL
const RedirectWithBase = ({ to }: { to: string }) => {
  const base = import.meta.env.BASE_URL || '';
  const toPath = to.startsWith('/') ? to : `/${to}`;
  return <Navigate to={`${base}${toPath}`.replace(/\/+$/, '')} replace />;
};

const App = () => {
  const base = import.meta.env.BASE_URL || '';
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CartProvider>
          <BrowserRouter basename={base}>
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cart" element={<Cart />} />
              {/* Handle redirects for GitHub Pages 404.html fallback */}
              <Route 
                path="/404" 
                element={
                  <Navigate to={base} replace />
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route 
                path="*" 
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <NotFound />
                  </div>
                } 
              />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
