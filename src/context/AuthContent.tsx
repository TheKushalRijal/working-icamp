// context/AuthContext.js
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getItem, setItem } from '../utils/asyncStorage';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('AuthProvider mounted');
    let mounted = true;

    const checkToken = async () => {
      try {
        console.log('Checking authentication token...');
        setIsLoading(true);
        const token = await getItem('token');
        console.log('Token check result:', token ? 'Token found' : 'No token');
        
        if (mounted) {
          setIsAuthenticated(!!token);
          setError(null);
        }
      } catch (error) {
        console.error('AuthProvider error:', error);
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Unknown error');
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkToken();

    return () => {
      console.log('AuthProvider unmounting');
      mounted = false;
    };
  }, []);

  const login = async (token: string) => {
    try {
      const success = await setItem('token', token);
      if (success) {
        setIsAuthenticated(true);
        setError(null);
      } else {
        setError('Failed to save authentication token');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const logout = async () => {
    try {
      await setItem('token', '');
      setIsAuthenticated(false);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    setIsAuthenticated: (value: boolean) => {
      console.log('Setting authentication state:', value);
      setIsAuthenticated(value);
    },
    login,
    logout,
    isLoading,
    error
  };

  console.log('AuthProvider render state:', { isAuthenticated, isLoading, error });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
