// Extended API contract types for ID-based operations
import { 
  PatientCreate, 
  PatientRead, 
  PatientUpdate, 
  ClinicalHistoryCreate, 
  ClinicalHistoryRead, 
  ClinicalHistoryUpdate 
} from './patient';

// Add the additional contract endpoints for ID-based operations
export interface PatientsAPIContract {
  // Original endpoints (by document_id)
  'POST /patients/': {
    body: PatientCreate;
    response: PatientRead;
  };
  'GET /patients/': {
    query?: { page?: number; page_size?: number };
    response: PatientRead[];
  };
  'GET /patients/{document_id}': {
    params: { document_id: string };
    response: PatientRead;
  };
  'PATCH /patients/{document_id}': {
    params: { document_id: string };
    body: PatientUpdate;
    response: PatientRead;
  };
  'DELETE /patients/{document_id}': {
    params: { document_id: string };
    response: void;
  };

  // Extended endpoints (by ID) - local extension
  'GET /patients/by-id/{id}': {
    params: { id: number };
    response: PatientRead;
  };
  'PATCH /patients/by-id/{id}': {
    params: { id: number };
    body: PatientUpdate;
    response: PatientRead;
  };

  // Clinical History endpoints
  'POST /clinical-history/': {
    body: ClinicalHistoryCreate;
    response: ClinicalHistoryRead;
  };
  'GET /clinical-history/{document_id}': {
    params: { document_id: string };
    response: ClinicalHistoryRead;
  };
  'PATCH /clinical-history/{document_id}': {
    params: { document_id: string };
    body: ClinicalHistoryUpdate;
    response: ClinicalHistoryRead;
  };

  // Auth endpoint
  'POST /auth/login': {
    body: { email: string; password: string };
    response: { token: string; user: any };
  };
}