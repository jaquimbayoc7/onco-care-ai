import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  TrendingUp,
  Stethoscope,
  Heart,
  Shield
} from "lucide-react";

interface Patient {
  id: number;
  name: string;
  age: number;
  diagnosis: string;
  stage: string;
  gender: string;
}

interface MedicalRecord {
  recordId: string;
  patientId: string;
  hasFamilyHistory: boolean;
  hasPreviousCancer: boolean;
  diagnosisStage: string;
  tumorAggressiveness: string;
  hasColonoscopyAccess: boolean;
  screeningRegularity: string;
  dietType: string;
  bmiValue: number;
  physicalActivityLevel: string;
  isSmoker: boolean;
  alcoholConsumption: string;
  redMeatConsumption: string;
  fiberConsumption: string;
  timeToDiagnosisDays: number;
  hasTreatmentAccess: boolean;
  receivedChemotherapy: boolean;
  receivedRadiotherapy: boolean;
  receivedSurgery: boolean;
  followUpAdherence: string;
  survivalStatus: string;
  hasRecurrence: boolean;
  timeToRecurrenceDays: number | null;
  treatmentId: string;
}

interface MedicalHistoryViewProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
}

// Mock medical record data
const mockMedicalRecord: MedicalRecord = {
  recordId: "MR001",
  patientId: "P001",
  hasFamilyHistory: true,
  hasPreviousCancer: false,
  diagnosisStage: "IIA",
  tumorAggressiveness: "Moderado",
  hasColonoscopyAccess: true,
  screeningRegularity: "Regular",
  dietType: "Mediterránea",
  bmiValue: 24.5,
  physicalActivityLevel: "Moderado",
  isSmoker: false,
  alcoholConsumption: "Ocasional",
  redMeatConsumption: "1-2 veces",
  fiberConsumption: "Alto",
  timeToDiagnosisDays: 45,
  hasTreatmentAccess: true,
  receivedChemotherapy: true,
  receivedRadiotherapy: false,
  receivedSurgery: true,
  followUpAdherence: "Alta",
  survivalStatus: "Active",
  hasRecurrence: false,
  timeToRecurrenceDays: null,
  treatmentId: "T001"
};

const MedicalHistoryView: React.FC<MedicalHistoryViewProps> = ({
  isOpen,
  onClose,
  patient
}) => {
  const record = mockMedicalRecord;

  const getRiskBadge = (value: boolean | string, isRisk = true) => {
    if (typeof value === 'boolean') {
      return value === isRisk ? (
        <Badge className="status-warning">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Presente
        </Badge>
      ) : (
        <Badge className="status-success">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Ausente
        </Badge>
      );
    }
    return <Badge variant="outline">{value}</Badge>;
  };

  const getTreatmentBadge = (received: boolean) => {
    return received ? (
      <Badge className="status-success">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Recibido
      </Badge>
    ) : (
      <Badge className="status-danger">
        <XCircle className="w-3 h-3 mr-1" />
        No Recibido
      </Badge>
    );
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: "status-warning", text: "Bajo peso" };
    if (bmi < 25) return { status: "status-success", text: "Normal" };
    if (bmi < 30) return { status: "status-warning", text: "Sobrepeso" };
    return { status: "status-danger", text: "Obesidad" };
  };

  const bmiStatus = getBMIStatus(record.bmiValue);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            Historial Médico - {patient.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="diagnosis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1 h-auto p-1">
            <TabsTrigger value="diagnosis" className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 p-2 lg:p-3 text-xs lg:text-sm">
              <Stethoscope className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline lg:inline">Diagnóstico</span>
              <span className="sm:hidden">Diag.</span>
            </TabsTrigger>
            <TabsTrigger value="risk-factors" className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 p-2 lg:p-3 text-xs lg:text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline lg:inline">Factores de Riesgo</span>
              <span className="sm:hidden">Riesgo</span>
            </TabsTrigger>
            <TabsTrigger value="lifestyle" className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 p-2 lg:p-3 text-xs lg:text-sm">
              <Heart className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline lg:inline">Estilo de Vida</span>
              <span className="sm:hidden">Estilo</span>
            </TabsTrigger>
            <TabsTrigger value="treatment" className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 p-2 lg:p-3 text-xs lg:text-sm">
              <Target className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline lg:inline">Tratamientos</span>
              <span className="sm:hidden">Trat.</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagnosis" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-clinical">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                    <Stethoscope className="w-5 h-5 text-primary shrink-0" />
                    <span>Información del Diagnóstico</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Etapa del Diagnóstico:</span>
                      <Badge className="status-active">{record.diagnosisStage}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Agresividad del Tumor:</span>
                      <Badge variant="outline">{record.tumorAggressiveness}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tiempo hasta Diagnóstico:</span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{record.timeToDiagnosisDays} días</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Estado de Supervivencia:</span>
                      <Badge className="status-success">{record.survivalStatus}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-clinical">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                    <Shield className="w-5 h-5 text-primary shrink-0" />
                    <span>Acceso y Seguimiento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Acceso a Colonoscopía:</span>
                      {getRiskBadge(record.hasColonoscopyAccess, false)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Regularidad de Tamizaje:</span>
                      <Badge variant="outline">{record.screeningRegularity}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Acceso a Tratamiento:</span>
                      {getRiskBadge(record.hasTreatmentAccess, false)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Adherencia al Seguimiento:</span>
                      <Badge className="status-success">{record.followUpAdherence}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-clinical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                  <TrendingUp className="w-5 h-5 text-accent shrink-0" />
                  <span>Estado de Recurrencia</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {record.hasRecurrence ? (
                      <>
                        <AlertTriangle className="w-5 h-5 text-danger" />
                        <span className="font-medium">Recurrencia Detectada</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        <span className="font-medium">Sin Recurrencia</span>
                      </>
                    )}
                  </div>
                  {record.hasRecurrence ? (
                    <Badge className="status-danger">
                      Tiempo: {record.timeToRecurrenceDays} días
                    </Badge>
                  ) : (
                    <Badge className="status-success">Estado Estable</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk-factors" className="space-y-6">
            <Card className="card-clinical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                  <AlertTriangle className="w-5 h-5 text-danger shrink-0" />
                  <span>Factores de Riesgo Genéticos y Familiares</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">Historia Familiar de Cáncer:</span>
                      {getRiskBadge(record.hasFamilyHistory)}
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">Cáncer Previo:</span>
                      {getRiskBadge(record.hasPreviousCancer)}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 border border-warning/20 bg-warning/5 rounded-lg">
                      <h4 className="font-medium text-warning mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Evaluación de Riesgo
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {record.hasFamilyHistory 
                          ? "Paciente con historia familiar positiva requiere seguimiento más frecuente."
                          : "Sin factores de riesgo genético significativos identificados."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lifestyle" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-clinical">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                    <Activity className="w-5 h-5 text-success shrink-0" />
                    <span>Métricas de Salud</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">IMC:</span>
                    <div className="text-right">
                      <div className="font-semibold">{record.bmiValue} kg/m²</div>
                      <Badge className={bmiStatus.status}>{bmiStatus.text}</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">Actividad Física:</span>
                    <Badge variant="outline">{record.physicalActivityLevel}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">Fumador:</span>
                    {getRiskBadge(record.isSmoker)}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-clinical">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                    <Heart className="w-5 h-5 text-accent shrink-0" />
                    <span>Hábitos Alimentarios</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">Tipo de Dieta:</span>
                    <Badge variant="outline">{record.dietType}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">Consumo de Alcohol:</span>
                    <Badge variant="outline">{record.alcoholConsumption}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">Carne Roja:</span>
                    <Badge variant="outline">{record.redMeatConsumption}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="font-medium">Fibra:</span>
                    <Badge className="status-success">{record.fiberConsumption}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="treatment" className="space-y-6">
            <Card className="card-clinical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                  <Target className="w-5 h-5 text-primary shrink-0" />
                  <span>Historial de Tratamientos Recibidos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-center mb-3">
                      <Activity className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-medium mb-2">Quimioterapia</h4>
                    {getTreatmentBadge(record.receivedChemotherapy)}
                  </div>
                  
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-center mb-3">
                      <Target className="w-8 h-8 text-accent" />
                    </div>
                    <h4 className="font-medium mb-2">Radioterapia</h4>
                    {getTreatmentBadge(record.receivedRadiotherapy)}
                  </div>
                  
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-center mb-3">
                      <Shield className="w-8 h-8 text-success" />
                    </div>
                    <h4 className="font-medium mb-2">Cirugía</h4>
                    {getTreatmentBadge(record.receivedSurgery)}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                  <h4 className="font-medium text-accent mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Plan de Tratamiento Actual
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    ID del Tratamiento: <span className="font-mono">{record.treatmentId}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Estado: <Badge className="status-active ml-1">Activo</Badge>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalHistoryView;