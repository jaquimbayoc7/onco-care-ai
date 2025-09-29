import React, { createContext, useContext, useState, useEffect } from 'react';
import { PatientsAPI } from '@/services/patientsApi';

interface User {
  id: string;
  name: string;
  email: string;
  specialty: string;
  hospital: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUser: User = {
  id: "DR001",
  name: "Dr. Ana Rodríguez",
  email: "ana.rodriguez@hospital.com",
  specialty: "Oncología Médica",
  hospital: "Hospital San Rafael"
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user was previously logged in
    const storedUser = localStorage.getItem('oncosimil_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await PatientsAPI.authenticate(email, password);
      
      if (result.error) {
        return false;
      }

      if (result.data) {
        setUser(result.data.user);
        localStorage.setItem('oncosimil_user', JSON.stringify(result.data.user));
        localStorage.setItem('oncosimil_token', result.data.token);
        return true;
      }
    } catch (error) {
      return false;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('oncosimil_user');
    localStorage.removeItem('oncosimil_token');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};