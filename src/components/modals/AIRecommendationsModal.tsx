import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClinicalButton } from "@/components/ui/clinical-button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Target,
  Activity,
  Shield
} from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  stage: string;
  gender: string;
}

interface Treatment {
  id: string;
  name: string;
  type: string;
  confidence: number;
  rationale: string[];
  contraindications?: string[];
  expectedOutcome: string;
}

interface AIRecommendationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
}

const mockRecommendations: Treatment[] = [
  {
    id: "T001",
    name: "Protocolo FOLFIRINOX",
    type: "Quimioterapia Combinada",
    confidence: 92,
    rationale: [
      "Alta tasa de eficacia en pacientes con perfil similar (87%)",
      "Bajo riesgo de interacción con comorbilidades existentes",
      "Alineado con las guías clínicas de la NCCN 2024",
      "Perfil genético compatible (KRAS wild-type)"
    ],
    contraindications: ["Insuficiencia renal severa", "Edad >75 años con fragilidad"],
    expectedOutcome: "Reducción tumoral esperada: 65-80%"
  },
  {
    id: "T002", 
    name: "Gemcitabina + nab-Paclitaxel",
    type: "Quimioterapia Alternativa",
    confidence: 78,
    rationale: [
      "Menor toxicidad para el perfil del paciente",
      "Experiencia institucional favorable",
      "Protocolo bien tolerado en edad similar"
    ],
    contraindications: ["Neuropatía previa"],
    expectedOutcome: "Reducción tumoral esperada: 45-60%"
  }
];

const AIRecommendationsModal: React.FC<AIRecommendationsModalProps> = ({
  isOpen,
  onClose,
  patient
}) => {
  const handleAcceptRecommendation = (treatmentId: string) => {
    console.log(`Recomendación aceptada: ${treatmentId} para paciente ${patient.id}`);
    // Aquí iría la lógica para crear el plan de tratamiento
  };

  const handleRejectRecommendation = (treatmentId: string) => {
    console.log(`Recomendación rechazada: ${treatmentId}`);
    // Aquí iría la lógica para registrar el rechazo
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-accent" />
            </div>
            Recomendaciones IA para {patient.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Contexto del Paciente */}
          <div className="lg:col-span-2">
            <Card className="card-clinical">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Perfil del Paciente para Análisis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diagnóstico:</span>
                    <span className="font-medium">{patient.diagnosis}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Etapa:</span>
                    <Badge variant="outline">{patient.stage}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Edad:</span>
                    <span className="font-medium">{patient.age} años</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Género:</span>
                    <span className="font-medium">{patient.gender}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent" />
                    Marcadores Genéticos
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">KRAS:</span>
                      <Badge className="status-success text-xs">Wild-type</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">BRAF:</span>
                      <Badge className="status-success text-xs">Wild-type</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">MSI:</span>
                      <Badge className="status-warning text-xs">Estable</Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Factores de Riesgo
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      <span>Función renal normal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      <span>ECOG Performance Status: 0</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3 h-3 text-warning" />
                      <span>Historia familiar de cáncer</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recomendaciones */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-accent" />
                  Recomendaciones de Tratamiento
                </h3>
              </div>

              {mockRecommendations.map((treatment, index) => (
                <Card 
                  key={treatment.id} 
                  className={`card-clinical ${index === 0 ? 'ring-2 ring-accent/20' : ''}`}
                >
                  {index === 0 && (
                    <div className="bg-accent/10 px-4 py-2 rounded-t-lg">
                      <span className="text-sm font-medium text-accent">
                        🏆 Recomendación Principal
                      </span>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{treatment.name}</CardTitle>
                        <p className="text-muted-foreground">{treatment.type}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">Confianza</div>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={treatment.confidence} 
                            className="w-20 h-2" 
                          />
                          <span className="text-sm font-semibold text-accent">
                            {treatment.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Justificación:</h4>
                      <ul className="space-y-1">
                        {treatment.rationale.map((reason, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle2 className="w-3 h-3 text-success mt-0.5 flex-shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-accent">
                        {treatment.expectedOutcome}
                      </p>
                    </div>

                    {treatment.contraindications && (
                      <div>
                        <h4 className="font-medium mb-2 text-warning flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Contraindicaciones:
                        </h4>
                        <ul className="space-y-1">
                          {treatment.contraindications.map((contra, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <XCircle className="w-3 h-3 text-danger mt-0.5 flex-shrink-0" />
                              {contra}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <ClinicalButton 
                        variant="ai" 
                        size="sm"
                        onClick={() => handleAcceptRecommendation(treatment.id)}
                        className="flex-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Aceptar y Crear Plan
                      </ClinicalButton>
                      <ClinicalButton 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRejectRecommendation(treatment.id)}
                      >
                        <XCircle className="w-4 h-4" />
                        Rechazar
                      </ClinicalButton>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIRecommendationsModal;