import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from './components/LoginForm';
import { AppLayout } from './components/AppLayout';
import { isAuthenticated } from './lib/auth';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import SalesPage from './pages/SalesPage';
import ServicesPage from './pages/ServicesPage';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthenticated(false);
  };

  if (authenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!authenticated ? (
            <LoginForm onLogin={handleLogin} />
          ) : (
            <AppLayout onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/reports" element={<div className="text-center py-12 text-muted-foreground">Relatórios - Em desenvolvimento</div>} />
                <Route path="/history" element={<div className="text-center py-12 text-muted-foreground">Histórico - Em desenvolvimento</div>} />
                <Route path="/users" element={<div className="text-center py-12 text-muted-foreground">Usuários - Em desenvolvimento</div>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
