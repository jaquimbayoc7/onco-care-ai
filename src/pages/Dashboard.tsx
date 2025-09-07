import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClinicalButton } from "@/components/ui/clinical-button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import AIRecommendationsModal from "@/components/modals/AIRecommendationsModal";
import NewPatientForm from "@/components/forms/NewPatientForm";
import MedicalHistoryView from "@/components/medical/MedicalHistoryView";
import PharmacotherapyView from "@/components/medical/PharmacotherapyView";

// Mock data for patients
const mockPatients = [
  {
    id: "P001",
    name: "María González",
    age: 54,
    gender: "Femenino",
    diagnosis: "Carcinoma de Mama",
    stage: "IIA",
    status: "Active Treatment",
    lastVisit: "2024-01-15",
    vitals: {
      heartRate: 72,
      bloodPressure: "120/80",
      temperature: 36.5,
      oxygenSat: 98
    }
  },
  {
    id: "P002", 
    name: "Carlos Mendoza",
    age: 67,
    gender: "Masculino",
    diagnosis: "Adenocarcinoma Pulmonar",
    stage: "IIIB",
    status: "Monitoring",
    lastVisit: "2024-01-12",
    vitals: {
      heartRate: 78,
      bloodPressure: "135/85",
      temperature: 36.8,
      oxygenSat: 95
    }
  },
  {
    id: "P003",
    name: "Ana Rodríguez",
    age: 45,
    gender: "Femenino", 
    diagnosis: "Melanoma",
    stage: "IB",
    status: "Remission",
    lastVisit: "2024-01-10",
    vitals: {
      heartRate: 68,
      bloodPressure: "118/75",
      temperature: 36.2,
      oxygenSat: 99
    }
  }
];

const Dashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);
  const [showPharmacotherapy, setShowPharmacotherapy] = useState(false);

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

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewPatient = (data: any) => {
    console.log("Nuevo paciente creado:", data);
    // Aquí iría la lógica para guardar el paciente en la base de datos
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">OncoSimil AI</h1>
              <p className="text-muted-foreground">Sistema de Gestión Oncológica</p>
            </div>
            <div className="flex items-center gap-4">
              <ClinicalButton variant="ai" size="sm">
                <Brain className="w-4 h-4" />
                Análisis IA
              </ClinicalButton>
              <ClinicalButton 
                variant="outline" 
                size="sm"
                onClick={() => setShowNewPatientForm(true)}
              >
                <Plus className="w-4 h-4" />
                Nuevo Paciente
              </ClinicalButton>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Patient List - Left Column */}
          <div className="lg:col-span-4">
            <Card className="card-clinical">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Lista de Pacientes</CardTitle>
                  <Filter className="w-4 h-4 text-muted-foreground" />
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
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-primary">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{patient.diagnosis}</p>
                      <p className="text-xs text-muted-foreground">
                        Última visita: {new Date(patient.lastVisit).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Details - Right Column */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* Patient Header Card */}
              <Card className="card-clinical">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-primary">{selectedPatient.name}</h2>
                        <p className="text-muted-foreground">Paciente ID: {selectedPatient.id}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(selectedPatient.status)}`}>
                      {selectedPatient.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
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
              <Card className="card-clinical">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent" />
                    Signos Vitales Actuales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Heart className="w-5 h-5 text-danger" />
                        {getTrendIcon(selectedPatient.vitals.heartRate, 70)}
                      </div>
                      <div className="vital-display text-primary">{selectedPatient.vitals.heartRate}</div>
                      <div className="metric-label">BPM</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-accent" />
                        <Activity className="w-4 h-4 text-success" />
                      </div>
                      <div className="vital-display text-primary">{selectedPatient.vitals.bloodPressure}</div>
                      <div className="metric-label">mmHg</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Thermometer className="w-5 h-5 text-warning" />
                        {getTrendIcon(selectedPatient.vitals.temperature, 36.5)}
                      </div>
                      <div className="vital-display text-primary">{selectedPatient.vitals.temperature}°</div>
                      <div className="metric-label">Celsius</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
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
              <div className="flex gap-4">
                <ClinicalButton 
                  variant="ai" 
                  size="lg"
                  onClick={() => setShowAIRecommendations(true)}
                >
                  <Brain className="w-4 h-4" />
                  Ver Recomendaciones IA
                </ClinicalButton>
                <ClinicalButton 
                  variant="clinical" 
                  size="lg"
                  onClick={() => setShowMedicalHistory(true)}
                >
                  <FileText className="w-4 h-4" />
                  Historial Médico
                </ClinicalButton>
                <ClinicalButton 
                  variant="outline" 
                  size="lg"
                  onClick={() => setShowPharmacotherapy(true)}
                >
                  <Activity className="w-4 h-4" />
                  Farmacoterapia
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
        onClose={() => setShowNewPatientForm(false)}
        onSubmit={handleNewPatient}
      />

      <MedicalHistoryView
        isOpen={showMedicalHistory}
        onClose={() => setShowMedicalHistory(false)}
        patient={selectedPatient}
      />

      <PharmacotherapyView
        isOpen={showPharmacotherapy}
        onClose={() => setShowPharmacotherapy(false)}
        patient={selectedPatient}
      />
    </div>
  );
};

export default Dashboard;