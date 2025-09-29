// Mock API service implementing the Oncoassist Patients contract locally
import { PatientCreate, PatientRead, PatientUpdate, ClinicalHistoryCreate, ClinicalHistoryRead, ClinicalHistoryUpdate, APIResponse } from '@/types/patient';

// Mock storage using localStorage for demo purposes
const PATIENTS_KEY = 'oncoassist_patients';
const HISTORIES_KEY = 'oncoassist_clinical_histories';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper functions for localStorage
const getPatients = (): PatientRead[] => {
  const patients = localStorage.getItem(PATIENTS_KEY);
  return patients ? JSON.parse(patients) : [];
};

const savePatients = (patients: PatientRead[]) => {
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
};

const getHistories = (): ClinicalHistoryRead[] => {
  const histories = localStorage.getItem(HISTORIES_KEY);
  return histories ? JSON.parse(histories) : [];
};

const saveHistories = (histories: ClinicalHistoryRead[]) => {
  localStorage.setItem(HISTORIES_KEY, JSON.stringify(histories));
};

// Generate ID
const generateId = (): number => Date.now();

export class PatientsAPI {
  // Create a new patient
  static async createPatient(patientData: PatientCreate): Promise<APIResponse<PatientRead>> {
    await delay(500); // Simulate network delay
    
    try {
      const patients = getPatients();
      
      // Check if patient with same document_id exists
      const existingPatient = patients.find(p => p.document_id === patientData.document_id);
      if (existingPatient) {
        return {
          error: 'Patient with this document ID already exists'
        };
      }

      const now = new Date().toISOString();
      const newPatient: PatientRead = {
        ...patientData,
        id: generateId(),
        created: now,
        edited: now
      };

      patients.push(newPatient);
      savePatients(patients);

      return {
        data: newPatient,
        message: 'Patient created successfully'
      };
    } catch (error) {
      return {
        error: 'Failed to create patient'
      };
    }
  }

  // Get all patients with pagination
  static async getPatients(page?: number, pageSize?: number): Promise<APIResponse<PatientRead[]>> {
    await delay(300);
    
    try {
      const patients = getPatients();
      
      if (page && pageSize) {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedPatients = patients.slice(startIndex, endIndex);
        
        return {
          data: paginatedPatients
        };
      }

      return {
        data: patients
      };
    } catch (error) {
      return {
        error: 'Failed to fetch patients'
      };
    }
  }

  // Get patient by document_id
  static async getPatient(documentId: string): Promise<APIResponse<PatientRead>> {
    await delay(200);
    
    try {
      const patients = getPatients();
      const patient = patients.find(p => p.document_id === documentId);
      
      if (!patient) {
        return {
          error: 'Patient not found'
        };
      }

      return {
        data: patient
      };
    } catch (error) {
      return {
        error: 'Failed to fetch patient'
      };
    }
  }

  // Update patient by document_id
  static async updatePatient(documentId: string, updateData: PatientUpdate): Promise<APIResponse<PatientRead>> {
    await delay(400);
    
    try {
      const patients = getPatients();
      const patientIndex = patients.findIndex(p => p.document_id === documentId);
      
      if (patientIndex === -1) {
        return {
          error: 'Patient not found'
        };
      }

      const updatedPatient = {
        ...patients[patientIndex],
        ...updateData,
        edited: new Date().toISOString()
      };

      patients[patientIndex] = updatedPatient;
      savePatients(patients);

      return {
        data: updatedPatient,
        message: 'Patient updated successfully'
      };
    } catch (error) {
      return {
        error: 'Failed to update patient'
      };
    }
  }

  // Update patient by ID (new endpoint)
  static async updatePatientById(patientId: number, updateData: PatientUpdate): Promise<APIResponse<PatientRead>> {
    await delay(400);
    
    try {
      const patients = getPatients();
      const patientIndex = patients.findIndex(p => p.id === patientId);
      
      if (patientIndex === -1) {
        return {
          error: 'Patient not found'
        };
      }

      const updatedPatient = {
        ...patients[patientIndex],
        ...updateData,
        edited: new Date().toISOString()
      };

      patients[patientIndex] = updatedPatient;
      savePatients(patients);

      return {
        data: updatedPatient,
        message: 'Patient updated successfully'
      };
    } catch (error) {
      return {
        error: 'Failed to update patient'
      };
    }
  }

  // Get patient by ID (new endpoint)
  static async getPatientById(patientId: number): Promise<APIResponse<PatientRead>> {
    await delay(200);
    
    try {
      const patients = getPatients();
      const patient = patients.find(p => p.id === patientId);
      
      if (!patient) {
        return {
          error: 'Patient not found'
        };
      }

      return {
        data: patient
      };
    } catch (error) {
      return {
        error: 'Failed to fetch patient'
      };
    }
  }

  // Delete patient
  static async deletePatient(documentId: string): Promise<APIResponse<void>> {
    await delay(300);
    
    try {
      const patients = getPatients();
      const patientIndex = patients.findIndex(p => p.document_id === documentId);
      
      if (patientIndex === -1) {
        return {
          error: 'Patient not found'
        };
      }

      patients.splice(patientIndex, 1);
      savePatients(patients);

      // Also delete associated clinical histories
      const histories = getHistories();
      const filteredHistories = histories.filter(h => h.document_id !== documentId);
      saveHistories(filteredHistories);

      return {
        message: 'Patient deleted successfully'
      };
    } catch (error) {
      return {
        error: 'Failed to delete patient'
      };
    }
  }

  // Clinical History endpoints
  static async createClinicalHistory(historyData: ClinicalHistoryCreate): Promise<APIResponse<ClinicalHistoryRead>> {
    await delay(500);
    
    try {
      // Verify patient exists
      const patients = getPatients();
      const patient = patients.find(p => p.document_id === historyData.document_id);
      if (!patient) {
        return {
          error: 'Patient not found'
        };
      }

      const histories = getHistories();
      const now = new Date().toISOString();
      
      const newHistory: ClinicalHistoryRead = {
        ...historyData,
        id: generateId(),
        created: now,
        edited: now
      };

      histories.push(newHistory);
      saveHistories(histories);

      return {
        data: newHistory,
        message: 'Clinical history created successfully'
      };
    } catch (error) {
      return {
        error: 'Failed to create clinical history'
      };
    }
  }

  static async getClinicalHistory(documentId: string): Promise<APIResponse<ClinicalHistoryRead>> {
    await delay(200);
    
    try {
      const histories = getHistories();
      const history = histories.find(h => h.document_id === documentId);
      
      if (!history) {
        return {
          error: 'Clinical history not found'
        };
      }

      return {
        data: history
      };
    } catch (error) {
      return {
        error: 'Failed to fetch clinical history'
      };
    }
  }

  static async updateClinicalHistory(documentId: string, updateData: ClinicalHistoryUpdate): Promise<APIResponse<ClinicalHistoryRead>> {
    await delay(400);
    
    try {
      const histories = getHistories();
      const historyIndex = histories.findIndex(h => h.document_id === documentId);
      
      if (historyIndex === -1) {
        return {
          error: 'Clinical history not found'
        };
      }

      const updatedHistory = {
        ...histories[historyIndex],
        ...updateData,
        edited: new Date().toISOString()
      };

      histories[historyIndex] = updatedHistory;
      saveHistories(histories);

      return {
        data: updatedHistory,
        message: 'Clinical history updated successfully'
      };
    } catch (error) {
      return {
        error: 'Failed to update clinical history'
      };
    }
  }

  // Auth simulation - returns mock token
  static async authenticate(email: string, password: string): Promise<APIResponse<{ token: string; user: any }>> {
    await delay(800);
    
    // Simple mock authentication
    if (email && password) {
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

    return {
      error: 'Invalid credentials'
    };
  }
}