// Authentication API Service
const API_BASE_URL = '/api';

export interface RegisterData {
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  tipo_doc: string;
  doc: string;
  especialidades: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface UserData {
  id: string;
  email: string;
  rol_id: number;
  created_at: string;
}

export interface MedicoData {
  id: number;
  user_id: string;
  nombres: string;
  apellidos: string;
  tipo_doc: string;
  doc: string;
  especialidades: string;
  created_at: string;
}

export interface UserMedicoData {
  usuario: UserData;
  medico: MedicoData;
}

class AuthAPI {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async register(data: RegisterData): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (response.status === 422) {
          return { success: false, error: 'Datos de registro inválidos. Verifica todos los campos.' };
        }
        return { success: false, error: errorData?.detail || 'Error al registrar usuario' };
      }

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Error de conexión. Por favor intenta de nuevo.' };
    }
  }

  async login(email: string, password: string): Promise<{ token?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          return { error: 'Credenciales inválidas' };
        }
        if (response.status === 422) {
          return { error: 'Email o contraseña inválidos' };
        }
        return { error: 'Error al iniciar sesión' };
      }

      const data: AuthToken = await response.json();
      localStorage.setItem('auth_token', data.access_token);
      return { token: data.access_token };
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Error de conexión. Por favor intenta de nuevo.' };
    }
  }

  async getCurrentUser(): Promise<{ user?: UserMedicoData; error?: string }> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return { error: 'No hay sesión activa' };
      }

      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          return { error: 'Sesión expirada' };
        }
        return { error: 'Error al obtener datos del usuario' };
      }

      const userData: UserData = await response.json();
      
      // Crear un objeto MedicoData con los datos del usuario
      // (la API /me solo devuelve UserOut, no incluye datos de médico completos)
      const mockMedicoData: MedicoData = {
        id: 0,
        user_id: userData.id,
        nombres: '',
        apellidos: '',
        tipo_doc: '',
        doc: '',
        especialidades: 'Oncología',
        created_at: userData.created_at,
      };

      return {
        user: {
          usuario: userData,
          medico: mockMedicoData
        }
      };
    } catch (error) {
      console.error('Get user error:', error);
      return { error: 'Error de conexión' };
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }
}

export const authAPI = new AuthAPI();
