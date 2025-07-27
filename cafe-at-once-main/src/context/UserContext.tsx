import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/apiService';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  isEmailVerified: boolean;
  addresses: Array<{
    type: 'home' | 'work' | 'other';
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }>;
  preferences: {
    newsletter: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
  };
  subscriptions: Subscription[];
  orders: Order[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Subscription {
  id: string;
  products: Array<{
    product: string;
    quantity: number;
  }>;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  nextDelivery: string;
  status: 'active' | 'paused' | 'cancelled';
  totalAmount: number;
  discount: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'online' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = apiService.getToken();
      if (token) {
        try {
          await refreshUser();
        } catch (error) {
          console.error('Failed to refresh user:', error);
          apiService.clearToken();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiService.login({ email, password });
      
      if (response.data?.user) {
        setUser(response.data.user);
      } else {
        // If user data is not in response, fetch it
        await refreshUser();
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      apiService.clearToken();
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      setLoading(true);
      const response = await apiService.register({ name, email, password, phone });
      
      if (response.data?.user) {
        setUser(response.data.user);
      } else {
        // If user data is not in response, fetch it
        await refreshUser();
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await apiService.updateUserProfile(userData);
      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiService.getUserProfile();
      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      loading,
      login,
      logout,
      register,
      updateProfile,
      refreshUser,
      isAuthenticated: !!user && apiService.isAuthenticated(),
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};