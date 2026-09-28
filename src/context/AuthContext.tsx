import { createContext, useEffect, useState, ReactNode } from 'react';
import { Driver } from '@/types/driver';
import { api } from '@/services/api';

interface AuthContextType {
  user: Driver | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (data: any) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Driver | null>(() => {
    const savedUser = localStorage.getItem('user');

    if (!savedUser) return null;

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('accessToken') || localStorage.getItem('token'));
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const profileRes = await api.getDriverProfile();
        const profileData = profileRes?.data || profileRes;

        if (profileData) {
          const userData: Driver = {
            ...profileData,
            id: profileData._id || profileData.id,
            name: profileData.fullName || profileData.name || '',
            phone: profileData.phoneNumber || profileData.phone || '',
            email: profileData.email || localStorage.getItem('email') || '',
          };

          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          if (userData.email) {
            localStorage.setItem('email', userData.email);
          }
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Keep cached user if available rather than forcing logout on network flicker
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
          } catch {
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);

    const responseObj = response?.data || response;
    const token = responseObj?.token || response?.token;

    if (!token) {
      throw new Error(response?.message || 'Login token not received');
    }

    const userData: Driver = {
      ...responseObj,
      id: responseObj._id || responseObj.id,
      email: responseObj.email || email,
    };

    localStorage.setItem('accessToken', token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('email', userData.email);

    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('email');

    setUser(null);
    setIsAuthenticated(false);
  };

  const signup = async (data: any) => {
    await api.signup(data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}