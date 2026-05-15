import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authApi } from '../api/auth.api';
import { userApi } from '../api/user.api';
import type { AuthContextType, LoginPayload, User } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    setUser(null);
    setIsLoading(false);
    return;
  }
  authApi
    .verifyAuth()
    .then(() => refreshUser())
    .catch(() => {
      localStorage.removeItem('access_token');
      setUser(null);
    })
    .finally(() => setIsLoading(false));
}, []);

  const refreshUser = async () => {
    const response = await userApi.getProfile();
    setUser(response.user);
  };

  const login = async (payload: LoginPayload) => {
    const response = await authApi.login(payload) as any;
    if (response.token) {
      localStorage.setItem('access_token', response.token);
    }
    await refreshUser();
  };

  const logout = async () => {
    await authApi.logout();
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}