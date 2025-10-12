import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/services/authApi';

interface User {
  id: string;
  name: string;
  email: string;
  specialty: string;
  hospital: string;
  avatar?: string;
  rol_id: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      const storedUser = localStorage.getItem('oncosimil_user');
      const token = localStorage.getItem('auth_token');
      
      if (storedUser && token) {
        if (isMounted) {
          setUser(JSON.parse(storedUser));
          setIsLoading(false);
        }
      } else if (token) {
        // Si hay token pero no usuario, intentar obtener datos del usuario
        try {
          const { user: userData, error } = await authAPI.getCurrentUser();
          
          if (!isMounted) return;
          
          if (userData && !error) {
            const userObj: User = {
              id: userData.usuario.id,
              email: userData.usuario.email,
              name: `${userData.medico.nombres} ${userData.medico.apellidos}`.trim() || userData.usuario.email,
              specialty: userData.medico.especialidades || 'Médico',
              hospital: 'Hospital General',
              rol_id: userData.usuario.rol_id,
            };
            setUser(userObj);
            localStorage.setItem('oncosimil_user', JSON.stringify(userObj));
          } else {
            // Token inválido, limpiar
            authAPI.logout();
            localStorage.removeItem('oncosimil_user');
          }
        } catch (error) {
          if (isMounted) {
            authAPI.logout();
            localStorage.removeItem('oncosimil_user');
          }
        }
        
        if (isMounted) {
          setIsLoading(false);
        }
      } else {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Prevenir múltiples llamadas simultáneas
    if (isLoading) {
      return { success: false, error: 'Ya hay una operación en curso' };
    }
    
    setIsLoading(true);
    
    try {
      const { token, error } = await authAPI.login(email, password);
      
      if (error) {
        setIsLoading(false);
        return { success: false, error };
      }

      if (token) {
        // Obtener datos del usuario después del login
        const { user: userData, error: userError } = await authAPI.getCurrentUser();
        
        if (userData && !userError) {
          const userObj: User = {
            id: userData.usuario.id,
            email: userData.usuario.email,
            name: `${userData.medico.nombres} ${userData.medico.apellidos}`.trim() || userData.usuario.email,
            specialty: userData.medico.especialidades || 'Médico',
            hospital: 'Hospital General',
            rol_id: userData.usuario.rol_id,
          };
          
          setUser(userObj);
          localStorage.setItem('oncosimil_user', JSON.stringify(userObj));
          setIsLoading(false);
          return { success: true };
        }
        
        setIsLoading(false);
        return { success: false, error: userError || 'Error al obtener datos del usuario' };
      }
      
      setIsLoading(false);
      return { success: false, error: 'Error desconocido' };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logout = () => {
    setUser(null);
    authAPI.logout();
    localStorage.removeItem('oncosimil_user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
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