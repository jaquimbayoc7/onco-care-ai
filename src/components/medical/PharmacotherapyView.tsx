import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Activity, 
  Pill,
  Clock,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Target,
  BarChart3
} from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  stage: string;
  gender: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  status: "Active" | "Completed" | "Discontinued" | "Scheduled";
  indication: string;
  contraindications?: string[];
  sideEffects?: string[];
}

interface AdherenceData {
  patientId: string;
  overallAdherence: number;
  weeklyAdherence: number[];
  missedDoses: number;
  totalDoses: number;
  lastUpdate: string;
}

interface PharmacotherapyViewProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
}

// Mock medication data
const mockMedications: Medication[] = [
  {
    id: "M001",
    name: "5-Fluorouracilo (5-FU)",
    dosage: "400 mg/m²",
    frequency: "Semanal",
    route: "IV",
    startDate: "2024-01-15",
    status: "Active",
    indication: "Quimioterapia adyuvante para carcinoma colorrectal",
    contraindications: ["Insuficiencia renal severa", "Deficiencia de DPD"],
    sideEffects: ["Mucositis", "Diarrea", "Neutropenia", "Síndrome mano-pie"]
  },
  {
    id: "M002",
    name: "Oxaliplatino",
    dosage: "85 mg/m²",
    frequency: "Cada 2 semanas",
    route: "IV",
    startDate: "2024-01-15",
    status: "Active",
    indication: "Quimioterapia combinada FOLFOX",
    contraindications: ["Neuropatía previa grado ≥2"],
    sideEffects: ["Neuropatía periférica", "Reacciones alérgicas", "Trombocitopenia"]
  },
  {
    id: "M003",
    name: "Leucovorín",
    dosage: "200 mg/m²",
    frequency: "Semanal",
    route: "IV",
    startDate: "2024-01-15",
    status: "Active",
    indication: "Modulador del 5-FU",
    sideEffects: ["Reacciones alérgicas leves"]
  },
  {
    id: "M004",
    name: "Ondansetrón",
    dosage: "8 mg",
    frequency: "Según necesidad",
    route: "Oral/IV",
    startDate: "2024-01-15",
    status: "Active",
    indication: "Antiemético preventivo",
    sideEffects: ["Cefalea", "Estreñimiento"]
  },
  {
    id: "M005",
    name: "Dexametasona",
    dosage: "12 mg",
    frequency: "Pre-quimioterapia",
    route: "IV",
    startDate: "2024-01-10",
    endDate: "2024-01-25",
    status: "Completed",
    indication: "Prevención de reacciones alérgicas",
    sideEffects: ["Hiperglucemia", "Insomnio", "Cambios de humor"]
  }
];

const mockAdherence: AdherenceData = {
  patientId: "P001",
  overallAdherence: 95,
  weeklyAdherence: [100, 95, 90, 100, 95, 85, 100, 95],
  missedDoses: 3,
  totalDoses: 60,
  lastUpdate: "2024-01-22"
};

const PharmacotherapyView: React.FC<PharmacotherapyViewProps> = ({
  isOpen,
  onClose,
  patient
}) => {
  const adherence = mockAdherence;
  const activeMedications = mockMedications.filter(med => med.status === "Active");
  const completedMedications = mockMedications.filter(med => med.status === "Completed");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="status-active">Activo</Badge>;
      case "Completed":
        return <Badge className="status-success">Completado</Badge>;
      case "Discontinued":
        return <Badge className="status-danger">Descontinuado</Badge>;
      case "Scheduled":
        return <Badge className="status-warning">Programado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAdherenceColor = (percentage: number) => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 75) return "text-warning";
    return "text-danger";
  };

  const getAdherenceStatus = (percentage: number) => {
    if (percentage >= 90) return "Excelente";
    if (percentage >= 75) return "Buena";
    if (percentage >= 60) return "Regular";
    return "Deficiente";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
              <Pill className="w-5 h-5 text-accent" />
            </div>
            Farmacoterapia - {patient.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Medicamentos Actuales
            </TabsTrigger>
            <TabsTrigger value="adherence" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Adherencia
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            <div className="grid gap-6">
              <Card className="card-clinical">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-primary" />
                    Régimen Actual de Medicamentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medicamento</TableHead>
                        <TableHead>Dosis</TableHead>
                        <TableHead>Frecuencia</TableHead>
                        <TableHead>Vía</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Indicación</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeMedications.map((medication) => (
                        <TableRow key={medication.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            {medication.name}
                          </TableCell>
                          <TableCell>{medication.dosage}</TableCell>
                          <TableCell>{medication.frequency}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{medication.route}</Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(medication.status)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs">
                            {medication.indication}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="card-clinical">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-warning" />
                    Efectos Secundarios y Contraindicaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {activeMedications.slice(0, 2).map((medication) => (
                      <div key={medication.id} className="space-y-3">
                        <h4 className="font-medium text-primary">{medication.name}</h4>
                        
                        {medication.contraindications && (
                          <div>
                            <h5 className="text-sm font-medium text-danger mb-2 flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Contraindicaciones:
                            </h5>
                            <ul className="text-sm space-y-1">
                              {medication.contraindications.map((contra, idx) => (
                                <li key={idx} className="text-muted-foreground flex items-start gap-2">
                                  <span className="w-1 h-1 bg-danger rounded-full mt-2 flex-shrink-0"></span>
                                  {contra}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {medication.sideEffects && (
                          <div>
                            <h5 className="text-sm font-medium text-warning mb-2 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Efectos Secundarios:
                            </h5>
                            <ul className="text-sm space-y-1">
                              {medication.sideEffects.map((effect, idx) => (
                                <li key={idx} className="text-muted-foreground flex items-start gap-2">
                                  <span className="w-1 h-1 bg-warning rounded-full mt-2 flex-shrink-0"></span>
                                  {effect}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="adherence" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="card-clinical md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-accent" />
                    Adherencia General
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="hsl(var(--muted))"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="hsl(var(--accent))"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${adherence.overallAdherence * 2.51}, 251`}
                          className="transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-2xl font-bold ${getAdherenceColor(adherence.overallAdherence)}`}>
                          {adherence.overallAdherence}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">
                        {getAdherenceStatus(adherence.overallAdherence)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {adherence.totalDoses - adherence.missedDoses}/{adherence.totalDoses} dosis
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Dosis perdidas:</span>
                      <span className="font-medium text-danger">{adherence.missedDoses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total dosis:</span>
                      <span className="font-medium">{adherence.totalDoses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Última actualización:</span>
                      <span className="text-sm font-medium">
                        {new Date(adherence.lastUpdate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-clinical md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Adherencia Semanal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-8 gap-2">
                      {adherence.weeklyAdherence.map((percentage, index) => (
                        <div key={index} className="text-center">
                          <div className="text-xs text-muted-foreground mb-2">
                            S{index + 1}
                          </div>
                          <div className="h-20 bg-muted/30 rounded-lg relative overflow-hidden">
                            <div
                              className="absolute bottom-0 w-full bg-gradient-to-t from-accent to-accent-soft transition-all duration-300"
                              style={{ height: `${percentage}%` }}
                            />
                          </div>
                          <div className={`text-xs font-medium mt-2 ${getAdherenceColor(percentage)}`}>
                            {percentage}%
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-accent rounded-full"></div>
                        <span className="text-sm text-muted-foreground">Adherencia semanal</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Promedio: <span className="font-medium text-accent">
                          {Math.round(adherence.weeklyAdherence.reduce((a, b) => a + b, 0) / adherence.weeklyAdherence.length)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-clinical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  Recomendaciones de Adherencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-success">Fortalezas Identificadas:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Adherencia general superior al 90%</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Consistencia en la mayoría de las semanas</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Buen seguimiento del cronograma</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-warning">Áreas de Mejora:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                        <span>Semana 6 mostró adherencia del 85%</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                        <span>Considerar recordatorios adicionales</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                        <span>Revisar barreras para la toma de medicamentos</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="card-clinical">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Historial Completo de Medicamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicamento</TableHead>
                      <TableHead>Fecha Inicio</TableHead>
                      <TableHead>Fecha Fin</TableHead>
                      <TableHead>Duración</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Indicación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMedications.map((medication) => (
                      <TableRow key={medication.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {medication.name}
                        </TableCell>
                        <TableCell>
                          {new Date(medication.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {medication.endDate 
                            ? new Date(medication.endDate).toLocaleDateString()
                            : "En curso"
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {medication.endDate 
                                ? `${Math.ceil((new Date(medication.endDate).getTime() - new Date(medication.startDate).getTime()) / (1000 * 3600 * 24))} días`
                                : `${Math.ceil((new Date().getTime() - new Date(medication.startDate).getTime()) / (1000 * 3600 * 24))} días`
                              }
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(medication.status)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs">
                          {medication.indication}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PharmacotherapyView;