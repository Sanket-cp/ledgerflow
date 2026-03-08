import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthResponse } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: AuthResponse) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = authService.getToken();
    const savedUser = authService.getUser();
    
    if (token && savedUser) {
      setUser(savedUser);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response);
  };

  const register = async (data: any) => {
    const response = await authService.register(data);
    setUser(response);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (userData: AuthResponse) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
