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
  Edit
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
      temperature: 36.8,
      oxygenSat: 95
    }
  },
  {
    id: 3,
    document_id: "11223344",
    name: "Ana Rodríguez",
    age: 45,
    gender: "Female",
    race: "Indígena",
    region: "Cali",
    urban_or_rural: "Rural",
    email: "ana.rodriguez@email.com",
    phone: "+57 302 555 8888",
    address: "Vereda El Retiro, Cali",
    created: "2024-01-03T12:00:00Z",
    edited: "2024-01-10T07:45:00Z",
    diagnosis: "Melanoma",
    stage: "IB",
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
  
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create');
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const { toast } = useToast();

  // Load patients from API on component mount
  useEffect(() => {
    loadPatients();
  }, []);

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
          vitals: mockPatients[index % mockPatients.length]?.vitals || {
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
      // Reload after initialization
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
                  variant="outline" 
                  size="sm"
                  onClick={handleNewPatientClick}
                >
                  <Plus className="w-4 h-4" />
                </ClinicalButton>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar pacientes..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
          </Card>

          {/* Mobile Patient Cards */}
          <div className="space-y-3">
            {filteredPatients.map((patient) => (
              <Card 
                key={patient.id}
                className={`card-clinical cursor-pointer transition-all ${
                  selectedPatient.id === patient.id 
                    ? 'ring-2 ring-accent bg-accent/5' 
                    : 'hover:bg-muted/30'
                }`}
                       onClick={() => setSelectedPatient(patient)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={patient.image} 
                      alt={patient.name}
                      className="w-16 h-16 rounded-full object-cover shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-primary text-base">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">{patient.age} años • {patient.gender}</p>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1 truncate">{patient.diagnosis}</p>
                      <p className="text-xs text-muted-foreground">
                        Última visita: {new Date(patient.lastVisit).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile Patient Details */}
          {selectedPatient && (
            <div className="space-y-4">
              {/* Patient Header - Mobile */}
              <Card className="card-clinical">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={selectedPatient.image} 
                      alt={selectedPatient.name}
                      className="w-20 h-20 rounded-full object-cover shadow-lg"
                    />
                     <div className="flex-1">
                       <h2 className="text-xl font-bold text-primary mb-1">{selectedPatient.name}</h2>
                       <p className="text-sm text-muted-foreground mb-2">ID: {selectedPatient.document_id}</p>
                       <Badge className={`text-xs ${getStatusColor(selectedPatient.status)}`}>
                         {selectedPatient.status}
                       </Badge>
                     </div>
                     <ClinicalButton 
                       variant="outline" 
                       size="sm"
                       onClick={() => handleEditPatient(selectedPatient)}
                       className="border-primary/20"
                     >
                       <Edit className="w-4 h-4" />
                     </ClinicalButton>
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
                      <p className="text-xs text-muted-foreground">Diagnóstico</p>
                      <p className="font-semibold text-sm">{selectedPatient.diagnosis}</p>
                      <Badge variant="outline" className="text-xs">
                        Etapa {selectedPatient.stage}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Vitals */}
              <Card className="card-clinical relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-cover bg-center"
                     style={{ backgroundImage: `url(${medicalMonitoring})` }} />
                <CardHeader className="relative z-10 pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-accent" />
                    Signos Vitales
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Heart className="w-5 h-5 text-danger" />
                        {getTrendIcon(selectedPatient.vitals.heartRate, 70)}
                      </div>
                      <div className="text-2xl font-bold text-primary">{selectedPatient.vitals.heartRate}</div>
                      <div className="text-xs text-muted-foreground">BPM</div>
                    </div>
                    <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-accent" />
                        <Activity className="w-4 h-4 text-success" />
                      </div>
                      <div className="text-lg font-bold text-primary">{selectedPatient.vitals.bloodPressure}</div>
                      <div className="text-xs text-muted-foreground">mmHg</div>
                    </div>
                    <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Thermometer className="w-5 h-5 text-warning" />
                        {getTrendIcon(selectedPatient.vitals.temperature, 36.5)}
                      </div>
                      <div className="text-2xl font-bold text-primary">{selectedPatient.vitals.temperature}°</div>
                      <div className="text-xs text-muted-foreground">Celsius</div>
                    </div>
                    <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-success" />
                        {getTrendIcon(selectedPatient.vitals.oxygenSat, 98)}
                      </div>
                      <div className="text-2xl font-bold text-primary">{selectedPatient.vitals.oxygenSat}%</div>
                      <div className="text-xs text-muted-foreground">SpO2</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          {/* Patient List - Left Column */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <Card className="card-clinical">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Lista de Pacientes</CardTitle>
                  <ClinicalButton 
                    variant="outline" 
                    size="sm"
                    onClick={handleNewPatientClick}
                  >
                    <Plus className="w-4 h-4" />
                    Nuevo Paciente
                  </ClinicalButton>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar pacientes..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`p-4 cursor-pointer transition-all border-b last:border-b-0 ${
                        selectedPatient.id === patient.id 
                          ? 'bg-accent/10 border-l-4 border-l-accent' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <img 
                          src={patient.image} 
                          alt={patient.name}
                          className="w-12 h-12 rounded-full object-cover shadow-sm"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-primary">{patient.name}</h3>
                              <p className="text-sm text-muted-foreground">ID: {patient.document_id}</p>
                            </div>
                            <Badge className={`text-xs ${getStatusColor(patient.status)}`}>
                              {patient.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1 ml-15">{patient.diagnosis}</p>
                      <p className="text-xs text-muted-foreground ml-15">
                        Última visita: {new Date(patient.lastVisit).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Details - Right Column */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="space-y-6">
              {/* Patient Header Card */}
              <Card className="card-clinical">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <img 
                        src={selectedPatient.image} 
                        alt={selectedPatient.name}
                        className="w-16 h-16 rounded-full object-cover shadow-lg"
                      />
                      <div>
                        <h2 className="text-2xl font-bold text-primary">{selectedPatient.name}</h2>
                        <p className="text-muted-foreground">Paciente ID: {selectedPatient.document_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ClinicalButton 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditPatient(selectedPatient)}
                        className="border-primary/20 hover:border-primary/40"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </ClinicalButton>
                      <Badge className={`${getStatusColor(selectedPatient.status)}`}>
                        {selectedPatient.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Edad</span>
                      </div>
                      <p className="font-semibold">{selectedPatient.age} años</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Género</span>
                      </div>
                      <p className="font-semibold">{selectedPatient.gender}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Diagnóstico</span>
                      </div>
                      <p className="font-semibold">{selectedPatient.diagnosis}</p>
                      <Badge variant="outline" className="text-xs">
                        Etapa {selectedPatient.stage}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vitals Card */}
              <Card className="card-clinical relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-cover bg-center"
                     style={{ backgroundImage: `url(${medicalMonitoring})` }} />
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent" />
                    Signos Vitales Actuales
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Heart className="w-5 h-5 text-danger" />
                        {getTrendIcon(selectedPatient.vitals.heartRate, 70)}
                      </div>
                      <div className="vital-display text-primary">{selectedPatient.vitals.heartRate}</div>
                      <div className="metric-label">BPM</div>
                    </div>
                    <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-accent" />
                        <Activity className="w-4 h-4 text-success" />
                      </div>
                      <div className="vital-display text-primary">{selectedPatient.vitals.bloodPressure}</div>
                      <div className="metric-label">mmHg</div>
                    </div>
                    <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Thermometer className="w-5 h-5 text-warning" />
                        {getTrendIcon(selectedPatient.vitals.temperature, 36.5)}
                      </div>
                      <div className="vital-display text-primary">{selectedPatient.vitals.temperature}°</div>
                      <div className="metric-label">Celsius</div>
                    </div>
                    <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-lg border">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-success" />
                        {getTrendIcon(selectedPatient.vitals.oxygenSat, 98)}
                      </div>
                      <div className="vital-display text-primary">{selectedPatient.vitals.oxygenSat}%</div>
                      <div className="metric-label">SpO2</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
            </div>
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
        onClose={() => setShowMedicalHistory(false)}
        patient={selectedPatient}
      />

    </div>
  );
};

export default Dashboard;