import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClinicalButton } from "@/components/ui/clinical-button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Activity, 
  Heart, 
  Thermometer,
  TrendingUp,
  TrendingDown,
  Brain,
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import AIRecommendationsModal from "@/components/modals/AIRecommendationsModal";
import NewPatientForm from "@/components/forms/NewPatientForm";
import MedicalHistoryView from "@/components/medical/MedicalHistoryView";

import NavHeader from "@/components/layout/NavHeader";
import patientMaria from "@/assets/patient-maria.jpg";
import patientCarlos from "@/assets/patient-carlos.jpg";
import patientAna from "@/assets/patient-ana.jpg";
import medicalMonitoring from "@/assets/medical-monitoring.jpg";
import faviconIcon from "@/assets/favicon.png";
import { PatientRead, ClinicalHistoryRead } from "@/types/patient";
import { PatientsAPI } from "@/services/patientsApi";
import { useToast } from "@/hooks/use-toast";

// Extended patient type for UI (includes PatientRead + additional UI fields)
interface UIPatient extends PatientRead {
  diagnosis: string;
  stage: string;
  status: string;
  lastVisit: string;
  image: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSat: number;
  };
}

// Mock data for patients - now with proper IDs and contract fields
const mockPatients: UIPatient[] = [
  {
    id: 1,
    document_id: "12345678",
    name: "María González",
    age: 54,
    gender: "Female",
    race: "Mestizo",
    region: "Bogotá",
    urban_or_rural: "Urban",
    email: "maria.gonzalez@email.com",
    phone: "+57 300 123 4567",
    address: "Calle 123 #45-67, Bogotá",
    created: "2024-01-01T10:00:00Z",
    edited: "2024-01-15T08:30:00Z",
    diagnosis: "Carcinoma de Mama",
    stage: "IIA",
    status: "Active Treatment",
    lastVisit: "2024-01-15",
    image: patientMaria,
    vitals: {
      heartRate: 72,
      bloodPressure: "120/80",
      temperature: 36.5,
      oxygenSat: 98
    }
  },
  {
    id: 2,
    document_id: "87654321",
    name: "Carlos Mendoza",
    age: 67,
    gender: "Male",
    race: "Afrodescendiente",
    region: "Medellín",
    urban_or_rural: "Urban",
    email: "carlos.mendoza@email.com",
    phone: "+57 301 987 6543",
    address: "Carrera 50 #30-20, Medellín",
    created: "2024-01-02T11:00:00Z",
    edited: "2024-01-12T09:15:00Z",
    diagnosis: "Adenocarcinoma Pulmonar",
    stage: "IIIB",
    status: "Monitoring",
    lastVisit: "2024-01-12",
    image: patientCarlos,
    vitals: {
      heartRate: 78,
      bloodPressure: "135/85",
      temperature: 37.1,
      oxygenSat: 96
    }
  },
  {
    id: 3,
    document_id: "11223344",
    name: "Ana María López",
    age: 45,
    gender: "Female",
    race: "Indígena",
    region: "Cali",
    urban_or_rural: "Rural",
    email: "ana.lopez@email.com",
    phone: "+57 302 555 1234",
    address: "Vereda El Carmen, Cali",
    created: "2024-01-03T12:00:00Z",
    edited: "2024-01-10T14:20:00Z",
    diagnosis: "Cáncer Colorrectal",
    stage: "IIIA",
    status: "Remission",
    lastVisit: "2024-01-10",
    image: patientAna,
    vitals: {
      heartRate: 68,
      bloodPressure: "118/75",
      temperature: 36.2,
      oxygenSat: 99
    }
  }
];

const Dashboard = () => {
  const [patients, setPatients] = useState<UIPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<UIPatient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [patientClinicalHistories, setPatientClinicalHistories] = useState<Record<string, ClinicalHistoryRead>>({});
  const [deletingPatient, setDeletingPatient] = useState<string | null>(null);
  
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create');
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const { toast } = useToast();

  // Load patients from API on component mount
  useEffect(() => {
    loadPatients();
  }, []);

  // Load clinical histories for all patients
  const loadClinicalHistories = async (patients: UIPatient[]) => {
    const histories: Record<string, ClinicalHistoryRead> = {};
    
    for (const patient of patients) {
      try {
        const response = await PatientsAPI.getClinicalHistory(patient.document_id);
        if (response.data) {
          histories[patient.document_id] = response.data;
        }
      } catch (error) {
        // History doesn't exist for this patient
      }
    }
    
    setPatientClinicalHistories(histories);
  };

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await PatientsAPI.getPatients();
      
      if (response.data && response.data.length > 0) {
        // Convert API patients to UI patients with additional fields
        const uiPatients: UIPatient[] = response.data.map((patient, index) => ({
          ...patient,
          diagnosis: mockPatients[index % mockPatients.length]?.diagnosis || "Diagnóstico pendiente",
          stage: mockPatients[index % mockPatients.length]?.stage || "Sin definir",
          status: mockPatients[index % mockPatients.length]?.status || "En evaluación",
          lastVisit: new Date().toISOString().split('T')[0],
          image: mockPatients[index % mockPatients.length]?.image || patientMaria,
          vitals: {
            heartRate: 72,
            bloodPressure: "120/80",
            temperature: 36.5,
            oxygenSat: 98
          }
        }));
        setPatients(uiPatients);
        if (!selectedPatient && uiPatients.length > 0) {
          setSelectedPatient(uiPatients[0]);
        }
        // Load clinical histories for vital signs
        await loadClinicalHistories(uiPatients);
      } else {
        // Initialize with mock data if no patients exist
        await initializeMockData();
      }
    } catch (error) {
      console.error("Error loading patients:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los pacientes",
        variant: "destructive"
      });
      // Fallback to mock data
      setPatients(mockPatients);
      setSelectedPatient(mockPatients[0]);
    } finally {
      setLoading(false);
    }
  };

  const initializeMockData = async () => {
    try {
      // Create the mock patients in the API
      for (const mockPatient of mockPatients) {
        const { diagnosis, stage, status, lastVisit, image, vitals, ...patientData } = mockPatient;
        await PatientsAPI.createPatient(patientData);
      }
      // Reload patients after initialization
      await loadPatients();
    } catch (error) {
      console.error("Error initializing mock data:", error);
      // Use mock data as fallback
      setPatients(mockPatients);
      setSelectedPatient(mockPatients[0]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active Treatment":
        return "status-active";
      case "Monitoring":
        return "status-warning";
      case "Remission":
        return "status-success";
      default:
        return "bg-muted";
    }
  };

  const getTrendIcon = (value: number, normal: number) => {
    if (value > normal) return <TrendingUp className="w-4 h-4 text-danger" />;
    if (value < normal * 0.9) return <TrendingDown className="w-4 h-4 text-warning" />;
    return <Activity className="w-4 h-4 text-success" />;
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewPatient = async (patientData: any) => {
    if (patientData) {
      await loadPatients(); // Reload patients after creation/update
      toast({
        title: "Éxito",
        description: editMode === 'create' ? "Paciente creado exitosamente" : "Paciente actualizado exitosamente"
      });
    }
    setEditMode('create');
    setEditingPatient(null);
    setShowNewPatientForm(false);
  };

  const handleEditPatient = (patient: any) => {
    setEditingPatient(patient);
    setEditMode('edit');
    setShowNewPatientForm(true);
  };

  const handleDeletePatient = async (patient: UIPatient) => {
    if (!confirm(`¿Está seguro que desea eliminar al paciente ${patient.name}? Esta acción no se puede deshacer.`)) {
      return;
    }

    setDeletingPatient(patient.document_id);
    try {
      const response = await PatientsAPI.deletePatient(patient.document_id);
      
      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Éxito",
          description: "Paciente eliminado correctamente",
        });
        
        // Reload patients list
        await loadPatients();
        
        // If the deleted patient was selected, clear selection and close modals
        if (selectedPatient?.document_id === patient.document_id) {
          setSelectedPatient(null);
          setShowAIRecommendations(false);
          setShowMedicalHistory(false);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setDeletingPatient(null);
    }
  };

  // Get vital signs for selected patient from clinical history
  const getVitalSigns = (patient: UIPatient | null) => {
    if (!patient) return { heartRate: 72, bloodPressure: "120/80", temperature: 36.5, oxygenSat: 98 };
    
    const clinicalHistory = patientClinicalHistories[patient.document_id];
    if (clinicalHistory) {
      return {
        heartRate: clinicalHistory.heart_rate || 72,
        bloodPressure: (clinicalHistory.blood_pressure_systolic && clinicalHistory.blood_pressure_diastolic) 
          ? `${clinicalHistory.blood_pressure_systolic}/${clinicalHistory.blood_pressure_diastolic}` 
          : "120/80",
        temperature: clinicalHistory.temperature || 36.5,
        oxygenSat: clinicalHistory.oxygen_saturation || 98
      };
    }
    
    return patient.vitals;
  };

  const handleNewPatientClick = () => {
    setEditMode('create');
    setEditingPatient(null);
    setShowNewPatientForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader />
        <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
              <p className="text-muted-foreground">Cargando pacientes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />

      <div className="container max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-4">
          {/* Mobile Header */}
          <Card className="card-clinical">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg">Dashboard Clínico</CardTitle>
                <ClinicalButton 
                  onClick={handleNewPatientClick}
                  variant="clinical" 
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo
                </ClinicalButton>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar pacientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.document_id}
                    onClick={() => setSelectedPatient(patient as UIPatient)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedPatient?.id === patient.id 
                        ? "bg-primary/10 border-primary/20" 
                        : "bg-card hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={patient.image} 
                        alt={patient.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">{patient.diagnosis}</p>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mobile Patient Details */}
          {selectedPatient && (
            <>
              <Card className="card-clinical">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={selectedPatient.image} 
                        alt={selectedPatient.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <CardTitle className="text-lg">{selectedPatient.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">ID: {selectedPatient.document_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClinicalButton 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditPatient(selectedPatient)}
                        className="border-primary/20"
                      >
                        <Edit className="w-4 h-4" />
                      </ClinicalButton>
                      <ClinicalButton 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeletePatient(selectedPatient)}
                        disabled={deletingPatient === selectedPatient.document_id}
                        className="border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </ClinicalButton>
                    </div>
                  </div>
                  
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                       <p className="text-xs text-muted-foreground">Edad</p>
                       <p className="font-semibold text-sm">{selectedPatient.age} años</p>
                     </div>
                     <div className="space-y-1">
                       <p className="text-xs text-muted-foreground">Género</p>
                       <p className="font-semibold text-sm">{selectedPatient.gender === 'Female' ? 'Femenino' : selectedPatient.gender === 'Male' ? 'Masculino' : 'Otro'}</p>
                     </div>
                    <div className="space-y-1 col-span-2">
                      <p className="text-xs text-muted-foreground font-semibold">DIAGNÓSTICO PRINCIPAL</p>
                      {patientClinicalHistories[selectedPatient.document_id] && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">Tiempo al Diagnóstico:</p>
                          <p className="text-sm font-semibold">
                            {patientClinicalHistories[selectedPatient.document_id].time_to_diagnosis === 'Delayed' ? 'Retrasado' :
                             patientClinicalHistories[selectedPatient.document_id].time_to_diagnosis === 'Timely' ? 'Oportuno' :
                             patientClinicalHistories[selectedPatient.document_id].time_to_diagnosis || 'No registrado'}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 col-span-2">
                      <p className="text-xs text-muted-foreground font-semibold">ÚLTIMA VISITA</p>
                      <p className="text-sm flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {patientClinicalHistories[selectedPatient.document_id]?.edited 
                          ? new Date(patientClinicalHistories[selectedPatient.document_id].edited).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : new Date(selectedPatient.edited).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                </CardContent>
              </Card>

              {/* Mobile Clinical Data */}
              {patientClinicalHistories[selectedPatient.document_id] && (
                <Card className="card-clinical">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <img src={faviconIcon} alt="OncoSímil" className="w-4 h-4" />
                      <FileText className="w-4 h-4 text-primary" />
                      Historial Clínico
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-1 p-3 rounded-lg bg-muted/50 border">
                        <div className="text-xs text-muted-foreground font-medium">Estadio al Diagnóstico</div>
                        <div className="text-base font-semibold">
                          {patientClinicalHistories[selectedPatient.document_id].stage_at_diagnosis 
                            ? `Estadio ${patientClinicalHistories[selectedPatient.document_id].stage_at_diagnosis}` 
                            : 'No especificado'}
                        </div>
                      </div>

                      <div className="space-y-1 p-3 rounded-lg bg-muted/50 border">
                        <div className="text-xs text-muted-foreground font-medium">IMC (BMI)</div>
                        <div className="text-base font-semibold">
                          {patientClinicalHistories[selectedPatient.document_id].bmi 
                            ? `${patientClinicalHistories[selectedPatient.document_id].bmi} kg/m²` 
                            : 'No registrado'}
                        </div>
                      </div>

                      <div className="space-y-1 p-3 rounded-lg bg-muted/50 border">
                        <div className="text-xs text-muted-foreground font-medium">Recurrencia</div>
                        <div className="text-base font-semibold">
                          {patientClinicalHistories[selectedPatient.document_id].recurrence === 'Yes' ? (
                            <span className="text-destructive">Positiva</span>
                          ) : patientClinicalHistories[selectedPatient.document_id].recurrence === 'No' ? (
                            <span className="text-green-600">Negativa</span>
                          ) : (
                            'No evaluada'
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 p-3 rounded-lg bg-muted/50 border">
                        <div className="text-xs text-muted-foreground font-medium">Adherencia al Seguimiento</div>
                        <div className="text-base font-semibold">
                          {patientClinicalHistories[selectedPatient.document_id].follow_up_adherence === 'Good' ? (
                            <span className="text-green-600">Buena</span>
                          ) : patientClinicalHistories[selectedPatient.document_id].follow_up_adherence === 'Poor' ? (
                            <span className="text-amber-600">Pobre</span>
                          ) : (
                            'No evaluada'
                          )}
                        </div>
                      </div>

                      {patientClinicalHistories[selectedPatient.document_id].treatment_recommendation && (
                        <div className="space-y-1 p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                            <Brain className="w-3 h-3" />
                            Recomendación de Tratamiento (IA)
                          </div>
                          <div className="text-base font-semibold text-primary">
                            {patientClinicalHistories[selectedPatient.document_id].treatment_recommendation}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mobile Action Buttons */}
             <div className="grid grid-cols-1 gap-3">
               <ClinicalButton 
                 variant="ai" 
                 size="lg"
                 onClick={() => setShowAIRecommendations(true)}
                 className="h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-accent to-accent-soft hover:shadow-lg"
               >
                 <Brain className="w-5 h-5" />
                 <span className="font-semibold">Recomendaciones IA</span>
               </ClinicalButton>
               <ClinicalButton 
                 variant="clinical" 
                 size="lg"
                 onClick={() => setShowMedicalHistory(true)}
                 className="h-12 flex-col gap-1"
               >
                 <FileText className="w-5 h-5" />
                 <span className="text-sm">Historial Clínico</span>
               </ClinicalButton>
             </div>
           </>
         )}
       </div>

       {/* Desktop Layout */}
       <div className="hidden lg:grid lg:grid-cols-4 gap-6">
         {/* Patient List */}
         <div className="lg:col-span-1">
           <Card className="card-clinical h-fit">
             <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <img src={faviconIcon} alt="OncoSímil" className="w-6 h-6" />
                    Pacientes
                  </CardTitle>
                  <ClinicalButton
                   onClick={handleNewPatientClick}
                   variant="clinical" 
                   size="sm"
                   className="shrink-0"
                 >
                   <Plus className="w-4 h-4 mr-2" />
                   Nuevo
                 </ClinicalButton>
               </div>
               
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <Input
                   placeholder="Buscar pacientes..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-10"
                 />
               </div>
             </CardHeader>
             <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.document_id}
                      onClick={() => setSelectedPatient(patient as UIPatient)}
                     className={`p-4 border-b cursor-pointer transition-all hover:bg-muted/50 ${
                       selectedPatient?.id === patient.id ? "bg-primary/10 border-r-4 border-r-primary" : ""
                     }`}
                   >
                     <div className="flex items-center gap-3">
                       <img 
                         src={patient.image} 
                         alt={patient.name}
                         className="w-10 h-10 rounded-full object-cover"
                       />
                       <div className="flex-1 min-w-0">
                         <p className="font-semibold text-sm truncate">{patient.name}</p>
                         <p className="text-xs text-muted-foreground truncate">{patient.diagnosis}</p>
                         <div className="flex items-center gap-2 mt-1">
                           <Badge className={`text-xs ${getStatusColor(patient.status)}`}>
                             {patient.status}
                           </Badge>
                         </div>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
         </div>

         {/* Main Content */}
         <div className="lg:col-span-3 space-y-6">
           {selectedPatient ? (
             <>
               {/* Patient Header */}
               <Card className="card-clinical relative overflow-hidden">
                 <div className="absolute inset-0 opacity-5 bg-cover bg-center"
                      style={{ backgroundImage: `url(${selectedPatient.image})` }} />
                 <CardHeader className="relative z-10">
                   <div className="flex items-start justify-between">
                     <div className="flex items-center gap-4">
                       <img 
                         src={selectedPatient.image} 
                         alt={selectedPatient.name}
                         className="w-16 h-16 rounded-full object-cover border-4 border-background shadow-lg"
                       />
                       <div>
                         <CardTitle className="text-2xl font-bold">{selectedPatient.name}</CardTitle>
                          <p className="text-muted-foreground">ID: {selectedPatient.document_id}</p>
                           <div className="flex items-center gap-4 mt-2">
                             <span className="flex items-center gap-1 text-sm">
                               <User className="w-4 h-4" />
                               {selectedPatient.age} años, {selectedPatient.gender === 'Female' ? 'Femenino' : selectedPatient.gender === 'Male' ? 'Masculino' : 'Otro'}
                             </span>
                             <span className="flex items-center gap-1 text-sm">
                               <MapPin className="w-4 h-4" />
                               {selectedPatient.region}
                             </span>
                             <span className="flex items-center gap-1 text-sm">
                               <Phone className="w-4 h-4" />
                               {selectedPatient.phone}
                             </span>
                           </div>
                       </div>
                     </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(selectedPatient.status)} text-sm px-3 py-1`}>
                          {selectedPatient.status}
                        </Badge>
                        <ClinicalButton 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditPatient(selectedPatient)}
                          className="border-primary/20"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </ClinicalButton>
                        <ClinicalButton 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeletePatient(selectedPatient)}
                          disabled={deletingPatient === selectedPatient.document_id}
                          className="border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </ClinicalButton>
                      </div>
                   </div>
                 </CardHeader>
                  <CardContent className="relative z-10">
                   <div className="grid grid-cols-2 gap-6">
                     <div>
                       <h4 className="font-semibold text-sm text-muted-foreground mb-2">DIAGNÓSTICO PRINCIPAL</h4>
                       {patientClinicalHistories[selectedPatient.document_id] && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Tiempo al Diagnóstico:</p>
                          <p className="font-bold text-lg">
                            {patientClinicalHistories[selectedPatient.document_id].time_to_diagnosis === 'Delayed' ? 'Retrasado' :
                             patientClinicalHistories[selectedPatient.document_id].time_to_diagnosis === 'Timely' ? 'Oportuno' :
                             patientClinicalHistories[selectedPatient.document_id].time_to_diagnosis || 'No registrado'}
                          </p>
                        </div>
                       )}
                     </div>
                     <div>
                       <h4 className="font-semibold text-sm text-muted-foreground mb-2">ÚLTIMA VISITA</h4>
                       <p className="flex items-center gap-2">
                         <Calendar className="w-4 h-4" />
                         {patientClinicalHistories[selectedPatient.document_id]?.edited 
                           ? new Date(patientClinicalHistories[selectedPatient.document_id].edited).toLocaleDateString('es-ES', {
                               year: 'numeric',
                               month: 'long',
                               day: 'numeric',
                               hour: '2-digit',
                               minute: '2-digit'
                             })
                           : new Date(selectedPatient.edited).toLocaleDateString('es-ES', {
                               year: 'numeric',
                               month: 'long',
                               day: 'numeric',
                               hour: '2-digit',
                               minute: '2-digit'
                             })}
                       </p>
                     </div>
                   </div>
                  </CardContent>
                </Card>

                {/* Desktop Clinical Data */}
                {patientClinicalHistories[selectedPatient.document_id] && (
                  <Card className="card-clinical">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <img src={faviconIcon} alt="OncoSímil" className="w-6 h-6" />
                        <FileText className="w-5 h-5 text-primary" />
                        Historial Clínico
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 p-4 rounded-lg bg-muted/50 border">
                          <div className="text-sm text-muted-foreground font-medium">Estadio al Diagnóstico</div>
                          <div className="text-lg font-semibold">
                            {patientClinicalHistories[selectedPatient.document_id].stage_at_diagnosis 
                              ? `Estadio ${patientClinicalHistories[selectedPatient.document_id].stage_at_diagnosis}` 
                              : 'No especificado'}
                          </div>
                        </div>

                        <div className="space-y-2 p-4 rounded-lg bg-muted/50 border">
                          <div className="text-sm text-muted-foreground font-medium">IMC (BMI)</div>
                          <div className="text-lg font-semibold">
                            {patientClinicalHistories[selectedPatient.document_id].bmi 
                              ? `${patientClinicalHistories[selectedPatient.document_id].bmi} kg/m²` 
                              : 'No registrado'}
                          </div>
                        </div>

                        <div className="space-y-2 p-4 rounded-lg bg-muted/50 border">
                          <div className="text-sm text-muted-foreground font-medium">Recurrencia</div>
                          <div className="text-lg font-semibold">
                            {patientClinicalHistories[selectedPatient.document_id].recurrence === 'Yes' ? (
                              <span className="text-destructive">Positiva</span>
                            ) : patientClinicalHistories[selectedPatient.document_id].recurrence === 'No' ? (
                              <span className="text-green-600">Negativa</span>
                            ) : (
                              'No evaluada'
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 p-4 rounded-lg bg-muted/50 border">
                          <div className="text-sm text-muted-foreground font-medium">Adherencia al Seguimiento</div>
                          <div className="text-lg font-semibold">
                            {patientClinicalHistories[selectedPatient.document_id].follow_up_adherence === 'Good' ? (
                              <span className="text-green-600">Buena</span>
                            ) : patientClinicalHistories[selectedPatient.document_id].follow_up_adherence === 'Poor' ? (
                              <span className="text-amber-600">Pobre</span>
                            ) : (
                              'No evaluada'
                            )}
                          </div>
                        </div>

                        {patientClinicalHistories[selectedPatient.document_id].treatment_recommendation && (
                          <div className="space-y-2 p-4 rounded-lg bg-primary/5 border border-primary/20 md:col-span-2">
                            <div className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                              <Brain className="w-4 h-4" />
                              Recomendación de Tratamiento (IA)
                            </div>
                            <div className="text-lg font-semibold text-primary">
                              {patientClinicalHistories[selectedPatient.document_id].treatment_recommendation}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                 )}

                {/* Action Buttons */}
               <div className="grid sm:grid-cols-2 gap-4">
                 <ClinicalButton 
                   variant="ai" 
                   size="lg"
                   onClick={() => setShowAIRecommendations(true)}
                   className="h-16 flex-col gap-2 bg-gradient-to-br from-accent to-accent-soft hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                 >
                   <Brain className="w-6 h-6" />
                   <span className="font-semibold">Recomendaciones IA</span>
                 </ClinicalButton>
                 <ClinicalButton 
                   variant="clinical" 
                   size="lg"
                   onClick={() => setShowMedicalHistory(true)}
                   className="h-16 flex-col gap-2"
                 >
                   <FileText className="w-6 h-6" />
                   <span>Historial Clínico</span>
                 </ClinicalButton>
               </div>
             </>
           ) : (
             <Card className="card-clinical">
               <CardContent className="flex items-center justify-center h-64">
                 <div className="text-center">
                   <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                   <h3 className="text-lg font-semibold mb-2">Selecciona un Paciente</h3>
                   <p className="text-muted-foreground">
                     Elige un paciente de la lista para ver su información detallada
                   </p>
                 </div>
               </CardContent>
             </Card>
           )}
         </div>
       </div>
     </div>

     {/* Modals */}
     <AIRecommendationsModal
       isOpen={showAIRecommendations}
       onClose={() => setShowAIRecommendations(false)}
       patient={selectedPatient}
     />

     <NewPatientForm
       isOpen={showNewPatientForm}
       onClose={() => {
         setShowNewPatientForm(false);
         setEditMode('create');
         setEditingPatient(null);
       }}
       onSubmit={handleNewPatient}
       editPatient={editingPatient}
       mode={editMode}
     />

     <MedicalHistoryView
       isOpen={showMedicalHistory}
       onClose={() => {
         setShowMedicalHistory(false);
         // Reload clinical histories after potential updates
         if (patients.length > 0) {
           loadClinicalHistories(patients);
         }
       }}
       patient={selectedPatient}
     />

   </div>
 );
};

export default Dashboard;