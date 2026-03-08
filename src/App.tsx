import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Customers from "@/pages/Customers";
import CustomerDetail from "@/pages/CustomerDetail";
import Ledger from "@/pages/Ledger";
import Sales from "@/pages/Sales";
import Inventory from "@/pages/Inventory";
import Reports from "@/pages/Reports";
import Reminders from "@/pages/Reminders";
import Settings from "@/pages/Settings";
import Install from "@/pages/Install";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/customers" element={<Customers />} />
                          <Route path="/customers/:id" element={<CustomerDetail />} />
                          <Route path="/ledger" element={<Ledger />} />
                          <Route path="/sales" element={<Sales />} />
                          <Route path="/inventory" element={<Inventory />} />
                          <Route path="/reports" element={<Reports />} />
                          <Route path="/reminders" element={<Reminders />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/install" element={<Install />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </AppLayout>
                    </ProtectedRoute>
                  } />
                </Routes>
              </BrowserRouter>
            </AppProvider>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
