import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: number;
  phone?: string;
  name?: string;
  email?: string;
  accessCode: string;
  isAdmin: boolean;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { phone?: string; email?: string; accessCode: string; isAdmin?: boolean }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('langit_digital_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials: { phone?: string; email?: string; accessCode: string; isAdmin?: boolean }) => {
    try {
      setLoading(true);
      
      if (credentials.isAdmin) {
        // Admin login using existing admins table
        const { data, error } = await supabase
          .from('admins')
          .select('*')
          .eq('email', credentials.email)
          .eq('access_code', credentials.accessCode)
          .limit(1);

        if (error || !data || data.length === 0) {
          return false;
        }

        const adminUser: User = {
          id: data[0].id,
          email: data[0].email,
          accessCode: data[0].access_code,
          isAdmin: true,
          permissions: ['all'] // Admins have all permissions
        };

        setUser(adminUser);
        localStorage.setItem('langit_digital_user', JSON.stringify(adminUser));
        return true;
      } else {
        // User login using existing users table
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', credentials.phone) // Using username field for phone
          .eq('access_code', credentials.accessCode)
          .eq('is_active', true)
          .limit(1);

        if (error || !data || data.length === 0) {
          return false;
        }

        const regularUser: User = {
          id: data[0].id,
          phone: data[0].username, // username field contains phone number
          name: data[0].name, // Add name field from database
          accessCode: data[0].access_code,
          isAdmin: false,
          permissions: ['audio', 'pdf', 'video', 'files'] // Default user permissions
        };

        setUser(regularUser);
        localStorage.setItem('langit_digital_user', JSON.stringify(regularUser));
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('langit_digital_user');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};