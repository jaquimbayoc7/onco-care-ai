// Patients API Service - Real API Integration
const API_BASE_URL = import.meta.env.DEV ? '/patients-api' : 'https://patientoncoassist.onrender.com';

import type { 
  PatientCreate, 
  PatientRead, 
  PatientUpdate,
  ClinicalHistoryCreate,
  ClinicalHistoryRead,
  ClinicalHistoryUpdate,
  APIResponse
} from '@/types/patient';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to create headers with auth
const getHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<APIResponse<T>> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error en la solicitud' }));
    return {
      error: error.detail || `Error: ${response.status}`
    };
  }
  
  const data = await response.json();
  return {
    data,
    message: 'Success'
  };
}

export class PatientsAPI {
  // Create a new patient
  static async createPatient(patientData: PatientCreate): Promise<APIResponse<PatientRead>> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(patientData),
      });
      return handleResponse<PatientRead>(response);
    } catch (error) {
      return {
        error: 'Error de conexión al crear paciente'
      };
    }
  }

  // Get all patients (with optional pagination)
  static async getPatients(page?: number, pageSize?: number): Promise<APIResponse<PatientRead[]>> {
    try {
      const params = page && pageSize ? `?page=${page}&page_size=${pageSize}` : '';
      const response = await fetch(`${API_BASE_URL}/patients/${params}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse<PatientRead[]>(response);
    } catch (error) {
      return {
        error: 'Error de conexión al obtener pacientes'
      };
    }
  }

  // Get a single patient by document_id
  static async getPatient(documentId: string): Promise<APIResponse<PatientRead>> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${documentId}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse<PatientRead>(response);
    } catch (error) {
      return {
        error: 'Error de conexión al obtener paciente'
      };
    }
  }

  // Update a patient by document_id
  static async updatePatient(documentId: string, updateData: PatientUpdate): Promise<APIResponse<PatientRead>> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${documentId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updateData),
      });
      return handleResponse<PatientRead>(response);
    } catch (error) {
      return {
        error: 'Error de conexión al actualizar paciente'
      };
    }
  }

  // Update patient by ID (compatibility method)
  static async updatePatientById(patientId: number, updateData: PatientUpdate): Promise<APIResponse<PatientRead>> {
    try {
      // First, get the patient by ID to obtain document_id
      const patients = await this.getPatients();
      if (patients.error || !patients.data) {
        return { error: 'No se pudo obtener el paciente' };
      }
      
      const patient = patients.data.find(p => p.id === patientId);
      if (!patient) {
        return { error: 'Paciente no encontrado' };
      }
      
      // Then update using document_id
      return this.updatePatient(patient.document_id, updateData);
    } catch (error) {
      return {
        error: 'Error al actualizar paciente por ID'
      };
    }
  }

  // Get patient by ID (compatibility method)
  static async getPatientById(patientId: number): Promise<APIResponse<PatientRead>> {
    try {
      const patients = await this.getPatients();
      if (patients.error || !patients.data) {
        return { error: 'No se pudo obtener pacientes' };
      }
      
      const patient = patients.data.find(p => p.id === patientId);
      if (!patient) {
        return { error: 'Paciente no encontrado' };
      }
      
      return { data: patient };
    } catch (error) {
      return {
        error: 'Error al obtener paciente por ID'
      };
    }
  }

  // Delete a patient by document_id
  static async deletePatient(documentId: string): Promise<APIResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${documentId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Error al eliminar' }));
        return { error: error.detail || 'Error al eliminar paciente' };
      }
      
      return { message: 'Paciente eliminado exitosamente' };
    } catch (error) {
      return {
        error: 'Error de conexión al eliminar paciente'
      };
    }
  }

  // Create a clinical history entry
  static async createClinicalHistory(historyData: ClinicalHistoryCreate): Promise<APIResponse<ClinicalHistoryRead>> {
    try {
      const response = await fetch(`${API_BASE_URL}/clinical_histories/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(historyData),
      });
      return handleResponse<ClinicalHistoryRead>(response);
    } catch (error) {
      return {
        error: 'Error de conexión al crear historial clínico'
      };
    }
  }

  // Get clinical history by document_id
  static async getClinicalHistory(documentId: string): Promise<APIResponse<ClinicalHistoryRead>> {
    try {
      const response = await fetch(`${API_BASE_URL}/clinical_histories/document/${documentId}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Error al obtener historial' }));
        return { error: error.detail || 'Historial no encontrado' };
      }
      
      const data = await response.json();
      // El API retorna un array, tomamos el primer elemento
      const history = Array.isArray(data) && data.length > 0 ? data[0] : null;
      
      if (!history) {
        return { error: 'Historial clínico no encontrado' };
      }
      
      return { data: history };
    } catch (error) {
      return {
        error: 'Error de conexión al obtener historial clínico'
      };
    }
  }

  // Update a clinical history entry
  static async updateClinicalHistory(documentId: string, updateData: ClinicalHistoryUpdate): Promise<APIResponse<ClinicalHistoryRead>> {
    try {
      // First get the history to obtain the ID
      const historyResponse = await this.getClinicalHistory(documentId);
      if (historyResponse.error || !historyResponse.data) {
        return { error: 'No se pudo obtener el historial clínico' };
      }
      
      const historyId = historyResponse.data.id;
      
      const response = await fetch(`${API_BASE_URL}/clinical_histories/${historyId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updateData),
      });
      return handleResponse<ClinicalHistoryRead>(response);
    } catch (error) {
      return {
        error: 'Error de conexión al actualizar historial clínico'
      };
    }
  }

  // Delete a clinical history entry by history_id
  static async deleteClinicalHistory(historyId: number): Promise<APIResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/clinical_histories/${historyId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Error al eliminar' }));
        return { error: error.detail || 'Error al eliminar historial' };
      }
      
      return { message: 'Historial clínico eliminado exitosamente' };
    } catch (error) {
      return {
        error: 'Error de conexión al eliminar historial clínico'
      };
    }
  }

  // Auth simulation - kept for compatibility
  static async authenticate(email: string, password: string): Promise<APIResponse<{ token: string; user: any }>> {
    // This method is now deprecated, use authAPI instead
    const mockUser = {
      id: "DR001",
      name: "Dr. Ana Rodríguez",
      email: email,
      specialty: "Oncología Médica",
      hospital: "Hospital San Rafael"
    };

    const mockToken = `mock_token_${Date.now()}`;
    
    return {
      data: {
        token: mockToken,
        user: mockUser
      },
      message: 'Authentication successful'
    };
  }
}
