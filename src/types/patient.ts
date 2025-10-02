// Types based on the Oncoassist Patients API contract

export interface PatientCreate {
  document_id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  race: string;
  region: string;
  urban_or_rural: 'Urban' | 'Rural';
  email: string;
  phone: string;
  address: string;
}

export interface PatientRead extends PatientCreate {
  id: number;
  created: string;
  edited: string;
}

export interface PatientUpdate {
  name?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  race?: string;
  region?: string;
  urban_or_rural?: 'Urban' | 'Rural';
  email?: string;
  phone?: string;
  address?: string;
}

export interface ClinicalHistoryCreate {
  document_id: string;
  family_history?: 'Yes' | 'No';
  previous_cancer_history?: 'Yes' | 'No';
  stage_at_diagnosis: 'I' | 'II' | 'III' | 'IV';
  tumor_aggressiveness: 'Low' | 'Medium' | 'High';
  colonoscopy_access?: 'Yes' | 'No';
  screening_regularity?: 'Regular' | 'Irregular' | 'Never';
  diet_type?: 'Vegetarian' | 'Vegan' | 'Omnivore' | 'Mediterranean' | 'Western';
  bmi?: number | string; // Backend requires string to avoid Decimal serialization error
  physical_activity_level?: 'Low' | 'Medium' | 'High';
  smoking_status?: 'Never' | 'Current' | 'Former';
  alcohol_consumption?: 'Low' | 'Medium' | 'High';
  fiber_consumption?: 'Low' | 'Medium' | 'High';
  insurance_coverage?: 'Yes' | 'No';
  time_to_diagnosis?: 'Delayed' | 'Timely';
  treatment_access: 'Adequate' | 'Limited';
  treatment_id?: number;
  chemotherapy_received?: 'Yes' | 'No';
  radiotherapy_received?: 'Yes' | 'No';
  surgery_received?: 'Yes' | 'No';
  treatment_recommendation?: string;
  follow_up_adherence: 'Good' | 'Poor';
  recurrence?: 'Yes' | 'No';
  time_to_recurrence?: number;
  // Signos vitales
  heart_rate?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  temperature?: number;
  oxygen_saturation?: number;
}

export interface ClinicalHistoryRead extends ClinicalHistoryCreate {
  id: number;
  created: string;
  edited: string;
  bmi?: number | string;
}

export interface ClinicalHistoryUpdate {
  family_history?: 'Yes' | 'No';
  previous_cancer_history?: 'Yes' | 'No';
  stage_at_diagnosis?: 'I' | 'II' | 'III' | 'IV';
  tumor_aggressiveness?: 'Low' | 'Medium' | 'High';
  colonoscopy_access?: 'Yes' | 'No';
  screening_regularity?: 'Regular' | 'Irregular' | 'Never';
  diet_type?: 'Vegetarian' | 'Vegan' | 'Omnivore' | 'Mediterranean' | 'Western';
  bmi?: number | string; // Backend requires string to avoid Decimal serialization error
  physical_activity_level?: 'Low' | 'Medium' | 'High';
  smoking_status?: 'Never' | 'Current' | 'Former';
  alcohol_consumption?: 'Low' | 'Medium' | 'High';
  fiber_consumption?: 'Low' | 'Medium' | 'High';
  insurance_coverage?: 'Yes' | 'No';
  time_to_diagnosis?: 'Delayed' | 'Timely';
  treatment_access?: 'Adequate' | 'Limited';
  treatment_id?: number;
  chemotherapy_received?: 'Yes' | 'No';
  radiotherapy_received?: 'Yes' | 'No';
  surgery_received?: 'Yes' | 'No';
  treatment_recommendation?: string;
  follow_up_adherence?: 'Good' | 'Poor';
  recurrence?: 'Yes' | 'No';
  time_to_recurrence?: number;
  // Signos vitales
  heart_rate?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  temperature?: number;
  oxygen_saturation?: number;
}

// API Response types
export interface APIResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}