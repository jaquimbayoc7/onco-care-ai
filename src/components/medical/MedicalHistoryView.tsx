import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Activity, 
  Shield, 
  Utensils, 
  Cigarette, 
  Wine, 
  Wheat,
  CreditCard,
  Clock,
  Stethoscope,
  Syringe,
  Zap,
  Scissors,
  RefreshCw,
  Calendar,
  TrendingUp,
  Edit,
  Save,
  X,
  Loader2
} from "lucide-react";
import { PatientsAPI } from "@/services/patientsApi";
import { ClinicalHistoryCreate, ClinicalHistoryRead, ClinicalHistoryUpdate } from "@/types/patient";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: number;
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
  created: string;
  edited: string;
}

interface MedicalHistoryViewProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

const clinicalHistorySchema = z.object({
  family_history: z.enum(["Yes", "No"]).optional(),
  previous_cancer_history: z.enum(["Yes", "No"]).optional(),
  stage_at_diagnosis: z.enum(["I", "II", "III", "IV"]),
  tumor_aggressiveness: z.enum(["Low", "Medium", "High"]),
  colonoscopy_access: z.enum(["Yes", "No"]).optional(),
  screening_regularity: z.enum(["Regular", "Irregular", "Never"]).optional(),
  diet_type: z.enum(["Vegetarian", "Vegan", "Omnivore", "Mediterranean", "Western"]).optional(),
  bmi: z.union([z.number().min(10).max(60), z.string()]).optional(),
  physical_activity_level: z.enum(["Low", "Medium", "High"]).optional(),
  smoking_status: z.enum(["Never", "Current", "Former"]).optional(),
  alcohol_consumption: z.enum(["Low", "Medium", "High"]).optional(),
  fiber_consumption: z.enum(["Low", "Medium", "High"]).optional(),
  insurance_coverage: z.enum(["Yes", "No"]).optional(),
  time_to_diagnosis: z.enum(["Delayed", "Timely"]).optional(),
  treatment_access: z.enum(["Adequate", "Limited"]),
  treatment_id: z.number().optional(),
  chemotherapy_received: z.enum(["Yes", "No"]).optional(),
  radiotherapy_received: z.enum(["Yes", "No"]).optional(),
  surgery_received: z.enum(["Yes", "No"]).optional(),
  treatment_recommendation: z.string().optional(),
  follow_up_adherence: z.enum(["Good", "Poor"]),
  recurrence: z.enum(["Yes", "No"]).optional(),
  time_to_recurrence: z.number().optional(),
  // Signos vitales
  heart_rate: z.number().min(30).max(250).optional(),
  blood_pressure_systolic: z.number().min(70).max(300).optional(),
  blood_pressure_diastolic: z.number().min(40).max(200).optional(),
  temperature: z.number().min(30).max(45).optional(),
  oxygen_saturation: z.number().min(50).max(100).optional(),
});

type ClinicalHistoryFormData = z.infer<typeof clinicalHistorySchema>;

export default function MedicalHistoryView({ isOpen, onClose, patient }: MedicalHistoryViewProps) {
  const [clinicalHistory, setClinicalHistory] = useState<ClinicalHistoryRead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<ClinicalHistoryFormData>({
    resolver: zodResolver(clinicalHistorySchema),
    defaultValues: {
      stage_at_diagnosis: "I",
      tumor_aggressiveness: "Low",
      treatment_access: "Adequate",
      follow_up_adherence: "Good",
    }
  });

  useEffect(() => {
    if (isOpen && patient) {
      loadClinicalHistory();
    }
  }, [isOpen, patient]);

  useEffect(() => {
    if (clinicalHistory) {
      form.reset({
        family_history: clinicalHistory.family_history,
        previous_cancer_history: clinicalHistory.previous_cancer_history,
        stage_at_diagnosis: clinicalHistory.stage_at_diagnosis,
        tumor_aggressiveness: clinicalHistory.tumor_aggressiveness,
        colonoscopy_access: clinicalHistory.colonoscopy_access,
        screening_regularity: clinicalHistory.screening_regularity,
        diet_type: clinicalHistory.diet_type,
        bmi: clinicalHistory.bmi,
        physical_activity_level: clinicalHistory.physical_activity_level,
        smoking_status: clinicalHistory.smoking_status,
        alcohol_consumption: clinicalHistory.alcohol_consumption,
        fiber_consumption: clinicalHistory.fiber_consumption,
        insurance_coverage: clinicalHistory.insurance_coverage,
        time_to_diagnosis: clinicalHistory.time_to_diagnosis,
        treatment_access: clinicalHistory.treatment_access,
        treatment_id: clinicalHistory.treatment_id,
        chemotherapy_received: clinicalHistory.chemotherapy_received,
        radiotherapy_received: clinicalHistory.radiotherapy_received,
        surgery_received: clinicalHistory.surgery_received,
        treatment_recommendation: clinicalHistory.treatment_recommendation,
        follow_up_adherence: clinicalHistory.follow_up_adherence,
        recurrence: clinicalHistory.recurrence,
        time_to_recurrence: clinicalHistory.time_to_recurrence,
        // Signos vitales
        heart_rate: clinicalHistory.heart_rate,
        blood_pressure_systolic: clinicalHistory.blood_pressure_systolic,
        blood_pressure_diastolic: clinicalHistory.blood_pressure_diastolic,
        temperature: clinicalHistory.temperature,
        oxygen_saturation: clinicalHistory.oxygen_saturation,
      });
    }
  }, [clinicalHistory, form]);

  const loadClinicalHistory = async () => {
    if (!patient) return;
    
    setIsLoading(true);
    try {
      const response = await PatientsAPI.getClinicalHistory(patient.document_id);
      if (response.data) {
        setClinicalHistory(response.data);
      } else {
        setClinicalHistory(null);
      }
    } catch (error) {
      setClinicalHistory(null);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ClinicalHistoryFormData) => {
    if (!patient) return;
    
    setIsSaving(true);
    try {
      if (clinicalHistory) {
        // Update existing clinical history
        const updateData: ClinicalHistoryUpdate = data;
        const response = await PatientsAPI.updateClinicalHistory(patient.document_id, updateData);
        
        if (response.error) {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          });
        } else {
          setClinicalHistory(response.data || null);
          setIsEditing(false);
          toast({
            title: "Éxito",
            description: "Historial clínico actualizado correctamente",
          });
        }
      } else {
        // Create new clinical history
        const createData: ClinicalHistoryCreate = {
          document_id: patient.document_id,
          stage_at_diagnosis: data.stage_at_diagnosis,
          tumor_aggressiveness: data.tumor_aggressiveness,
          treatment_access: data.treatment_access,
          follow_up_adherence: data.follow_up_adherence,
          ...data
        };
        const response = await PatientsAPI.createClinicalHistory(createData);
        
        if (response.error) {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          });
        } else {
          setClinicalHistory(response.data || null);
          setIsEditing(false);
          toast({
            title: "Éxito",
            description: "Historial clínico creado correctamente",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    form.reset();
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (clinicalHistory) {
      form.reset({
        family_history: clinicalHistory.family_history,
        previous_cancer_history: clinicalHistory.previous_cancer_history,
        stage_at_diagnosis: clinicalHistory.stage_at_diagnosis,
        tumor_aggressiveness: clinicalHistory.tumor_aggressiveness,
        colonoscopy_access: clinicalHistory.colonoscopy_access,
        screening_regularity: clinicalHistory.screening_regularity,
        diet_type: clinicalHistory.diet_type,
        bmi: clinicalHistory.bmi,
        physical_activity_level: clinicalHistory.physical_activity_level,
        smoking_status: clinicalHistory.smoking_status,
        alcohol_consumption: clinicalHistory.alcohol_consumption,
        fiber_consumption: clinicalHistory.fiber_consumption,
        insurance_coverage: clinicalHistory.insurance_coverage,
        time_to_diagnosis: clinicalHistory.time_to_diagnosis,
        treatment_access: clinicalHistory.treatment_access,
        treatment_id: clinicalHistory.treatment_id,
        chemotherapy_received: clinicalHistory.chemotherapy_received,
        radiotherapy_received: clinicalHistory.radiotherapy_received,
        surgery_received: clinicalHistory.surgery_received,
        treatment_recommendation: clinicalHistory.treatment_recommendation,
        follow_up_adherence: clinicalHistory.follow_up_adherence,
        recurrence: clinicalHistory.recurrence,
        time_to_recurrence: clinicalHistory.time_to_recurrence,
        // Signos vitales
        heart_rate: clinicalHistory.heart_rate,
        blood_pressure_systolic: clinicalHistory.blood_pressure_systolic,
        blood_pressure_diastolic: clinicalHistory.blood_pressure_diastolic,
        temperature: clinicalHistory.temperature,
        oxygen_saturation: clinicalHistory.oxygen_saturation,
      });
    }
  };

  const getBadgeVariant = (value: string | undefined): "default" | "secondary" | "destructive" | "outline" => {
    if (!value) return "outline";
    
    switch (value.toLowerCase()) {
      case "yes":
      case "good":
      case "adequate":
      case "high":
      case "regular":
        return "default";
      case "no":
      case "poor":
      case "limited":
      case "low":
      case "never":
        return "secondary";
      case "delayed":
      case "current":
        return "destructive";
      default:
        return "outline";
    }
  };

  const translateValue = (value: string | number | undefined): string => {
    if (value === undefined || value === null) return "No especificado";
    
    const translations: Record<string, string> = {
      "Yes": "Sí",
      "No": "No",
      "Male": "Masculino",
      "Female": "Femenino",
      "Other": "Otro",
      "Urban": "Urbano",
      "Rural": "Rural",
      "Low": "Bajo",
      "Medium": "Medio",
      "High": "Alto",
      "Regular": "Regular",
      "Irregular": "Irregular",
      "Never": "Nunca",
      "Current": "Actual",
      "Former": "Anterior",
      "Vegetarian": "Vegetariana",
      "Vegan": "Vegana",
      "Omnivore": "Omnívora",
      "Mediterranean": "Mediterránea",
      "Western": "Occidental",
      "Adequate": "Adecuado",
      "Limited": "Limitado",
      "Delayed": "Retrasado",
      "Timely": "Oportuno",
      "Good": "Buena",
      "Poor": "Pobre"
    };
    
    return translations[String(value)] || String(value);
  };

  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] md:max-h-[90vh] h-screen md:h-auto overflow-y-auto p-4 md:p-6">
        <DialogHeader className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl md:text-2xl font-bold truncate">
                Historial Clínico - {patient.name}
              </DialogTitle>
              <DialogDescription className="text-sm">
                Información completa del historial clínico del paciente
              </DialogDescription>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {!isEditing && (
                <Button onClick={handleEdit} variant="outline" size="sm" className="text-xs md:text-sm">
                  <Edit className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                  <span className="hidden md:inline">{clinicalHistory ? "Editar" : "Crear"}</span>
                </Button>
              )}
              {isEditing && (
                <>
                  <Button onClick={handleCancel} variant="outline" size="sm" className="text-xs md:text-sm">
                    <X className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                    <span className="hidden md:inline">Cancelar</span>
                  </Button>
                  <Button 
                    onClick={form.handleSubmit(onSubmit)} 
                    size="sm"
                    disabled={isSaving}
                    className="text-xs md:text-sm"
                  >
                    {isSaving && <Loader2 className="w-3 h-3 md:w-4 md:h-4 md:mr-2 animate-spin" />}
                    <Save className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                    <span className="hidden md:inline">Guardar</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
              <p className="text-muted-foreground">Cargando historial clínico...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {!clinicalHistory && !isEditing ? (
              <Card className="text-center p-8">
                <CardContent>
                  <Stethoscope className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No hay historial clínico</h3>
                  <p className="text-muted-foreground mb-4">
                    Este paciente no tiene un historial clínico registrado aún.
                  </p>
                  <Button onClick={() => setIsEditing(true)}>
                    Crear Historial Clínico
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                  <Tabs defaultValue="diagnosis" className="w-full">
                    <div className="w-full overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                      <TabsList className="inline-flex md:grid w-auto md:w-full md:grid-cols-5 h-auto">
                        <TabsTrigger value="diagnosis" className="text-xs md:text-sm whitespace-nowrap px-3 md:px-4">
                          Diagnóstico
                        </TabsTrigger>
                        <TabsTrigger value="vitals" className="text-xs md:text-sm whitespace-nowrap px-3 md:px-4">
                          Signos Vitales
                        </TabsTrigger>
                        <TabsTrigger value="lifestyle" className="text-xs md:text-sm whitespace-nowrap px-3 md:px-4">
                          Estilo de Vida
                        </TabsTrigger>
                        <TabsTrigger value="treatment" className="text-xs md:text-sm whitespace-nowrap px-3 md:px-4">
                          Tratamiento
                        </TabsTrigger>
                        <TabsTrigger value="follow-up" className="text-xs md:text-sm whitespace-nowrap px-3 md:px-4">
                          Seguimiento
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="diagnosis" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isEditing ? (
                          <>
                            <FormField
                              control={form.control}
                              name="family_history"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Heart className="w-4 h-4" />
                                    Antecedentes Familiares
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Yes">Sí</SelectItem>
                                      <SelectItem value="No">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="previous_cancer_history"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Historial de Cáncer Previo
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Yes">Sí</SelectItem>
                                      <SelectItem value="No">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="stage_at_diagnosis"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Estadio al Diagnóstico *
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar estadio" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="I">Estadio I</SelectItem>
                                      <SelectItem value="II">Estadio II</SelectItem>
                                      <SelectItem value="III">Estadio III</SelectItem>
                                      <SelectItem value="IV">Estadio IV</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="tumor_aggressiveness"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    Agresividad del Tumor *
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar nivel" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Low">Bajo</SelectItem>
                                      <SelectItem value="Medium">Medio</SelectItem>
                                      <SelectItem value="High">Alto</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        ) : (
                          <>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <Heart className="w-4 h-4" />
                                  Antecedentes Familiares
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge variant={getBadgeVariant(clinicalHistory?.family_history)}>
                                  {translateValue(clinicalHistory?.family_history)}
                                </Badge>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <Shield className="w-4 h-4" />
                                  Historial de Cáncer Previo
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge variant={getBadgeVariant(clinicalHistory?.previous_cancer_history)}>
                                  {translateValue(clinicalHistory?.previous_cancer_history)}
                                </Badge>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <TrendingUp className="w-4 h-4" />
                                  Estadio al Diagnóstico
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge variant="default">
                                  Estadio {clinicalHistory?.stage_at_diagnosis}
                                </Badge>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <Activity className="w-4 h-4" />
                                  Agresividad del Tumor
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge variant={getBadgeVariant(clinicalHistory?.tumor_aggressiveness)}>
                                  {translateValue(clinicalHistory?.tumor_aggressiveness)}
                                </Badge>
                              </CardContent>
                            </Card>
                          </>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="vitals" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {isEditing ? (
                          <>
                            <FormField
                              control={form.control}
                              name="heart_rate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Heart className="w-4 h-4" />
                                    Frecuencia Cardíaca (BPM)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Ej: 72"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="blood_pressure_systolic"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    Presión Sistólica (mmHg)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Ej: 120"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="blood_pressure_diastolic"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    Presión Diastólica (mmHg)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Ej: 80"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="temperature"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    Temperatura (°C)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.1"
                                      placeholder="Ej: 36.5"
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="oxygen_saturation"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    Saturación O2 (%)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Ej: 98"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        ) : (
                          <>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <Heart className="w-4 h-4 text-danger" />
                                  Frecuencia Cardíaca
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-primary">
                                    {clinicalHistory?.heart_rate || "--"}
                                  </div>
                                  <div className="text-xs text-muted-foreground">BPM</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <Activity className="w-4 h-4 text-accent" />
                                  Presión Arterial
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-primary">
                                    {clinicalHistory?.blood_pressure_systolic && clinicalHistory?.blood_pressure_diastolic
                                      ? `${clinicalHistory.blood_pressure_systolic}/${clinicalHistory.blood_pressure_diastolic}`
                                      : "--/--"}
                                  </div>
                                  <div className="text-xs text-muted-foreground">mmHg</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <Activity className="w-4 h-4 text-warning" />
                                  Temperatura
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-primary">
                                    {clinicalHistory?.temperature ? `${clinicalHistory.temperature}°` : "--°"}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Celsius</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <Activity className="w-4 h-4 text-success" />
                                  Saturación O2
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-primary">
                                    {clinicalHistory?.oxygen_saturation ? `${clinicalHistory.oxygen_saturation}%` : "--%"}
                                  </div>
                                  <div className="text-xs text-muted-foreground">SpO2</div>
                                </div>
                              </CardContent>
                            </Card>
                          </>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="lifestyle" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {isEditing ? (
                          <>
                            <FormField
                              control={form.control}
                              name="diet_type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Utensils className="w-4 h-4" />
                                    Tipo de Dieta
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Vegetarian">Vegetariana</SelectItem>
                                      <SelectItem value="Vegan">Vegana</SelectItem>
                                      <SelectItem value="Omnivore">Omnívora</SelectItem>
                                      <SelectItem value="Mediterranean">Mediterránea</SelectItem>
                                      <SelectItem value="Western">Occidental</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="bmi"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    BMI
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.1"
                                      placeholder="Ej: 25.5"
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || e.target.value)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="physical_activity_level"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    Actividad Física
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Low">Bajo</SelectItem>
                                      <SelectItem value="Medium">Medio</SelectItem>
                                      <SelectItem value="High">Alto</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="smoking_status"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Cigarette className="w-4 h-4" />
                                    Estado de Fumador
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Never">Nunca</SelectItem>
                                      <SelectItem value="Current">Actual</SelectItem>
                                      <SelectItem value="Former">Anterior</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="alcohol_consumption"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Wine className="w-4 h-4" />
                                    Consumo de Alcohol
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Low">Bajo</SelectItem>
                                      <SelectItem value="Medium">Medio</SelectItem>
                                      <SelectItem value="High">Alto</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="fiber_consumption"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Wheat className="w-4 h-4" />
                                    Consumo de Fibra
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Low">Bajo</SelectItem>
                                      <SelectItem value="Medium">Medio</SelectItem>
                                      <SelectItem value="High">Alto</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        ) : (
                          <>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <Utensils className="w-4 h-4" />
                                  Tipo de Dieta
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge variant="outline">
                                  {translateValue(clinicalHistory?.diet_type)}
                                </Badge>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <Activity className="w-4 h-4" />
                                  BMI
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge variant="outline">
                                  {clinicalHistory?.bmi || "No especificado"}
                                </Badge>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <Activity className="w-4 h-4" />
                                  Actividad Física
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge variant={getBadgeVariant(clinicalHistory?.physical_activity_level)}>
                                  {translateValue(clinicalHistory?.physical_activity_level)}
                                </Badge>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <Cigarette className="w-4 h-4" />
                                  Estado de Fumador
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge variant={getBadgeVariant(clinicalHistory?.smoking_status)}>
                                  {translateValue(clinicalHistory?.smoking_status)}
                                </Badge>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <Wine className="w-4 h-4" />
                                  Consumo de Alcohol
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge variant={getBadgeVariant(clinicalHistory?.alcohol_consumption)}>
                                  {translateValue(clinicalHistory?.alcohol_consumption)}
                                </Badge>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <Wheat className="w-4 h-4" />
                                  Consumo de Fibra
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge variant={getBadgeVariant(clinicalHistory?.fiber_consumption)}>
                                  {translateValue(clinicalHistory?.fiber_consumption)}
                                </Badge>
                              </CardContent>
                            </Card>
                          </>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="treatment" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isEditing ? (
                          <>
                            <FormField
                              control={form.control}
                              name="treatment_access"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Stethoscope className="w-4 h-4" />
                                    Acceso a Tratamiento *
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Adequate">Adecuado</SelectItem>
                                      <SelectItem value="Limited">Limitado</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="chemotherapy_received"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Syringe className="w-4 h-4" />
                                    Quimioterapia Recibida
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Yes">Sí</SelectItem>
                                      <SelectItem value="No">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="radiotherapy_received"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    Radioterapia Recibida
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Yes">Sí</SelectItem>
                                      <SelectItem value="No">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="surgery_received"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Scissors className="w-4 h-4" />
                                    Cirugía Recibida
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Yes">Sí</SelectItem>
                                      <SelectItem value="No">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        ) : (
                          <>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <Stethoscope className="w-4 h-4" />
                                  Acceso a Tratamiento
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge variant={getBadgeVariant(clinicalHistory?.treatment_access)}>
                                  {translateValue(clinicalHistory?.treatment_access)}
                                </Badge>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <Syringe className="w-4 h-4" />
                                  Quimioterapia
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge variant={getBadgeVariant(clinicalHistory?.chemotherapy_received)}>
                                  {translateValue(clinicalHistory?.chemotherapy_received)}
                                </Badge>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <Zap className="w-4 h-4" />
                                  Radioterapia
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge variant={getBadgeVariant(clinicalHistory?.radiotherapy_received)}>
                                  {translateValue(clinicalHistory?.radiotherapy_received)}
                                </Badge>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <Scissors className="w-4 h-4" />
                                  Cirugía
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge variant={getBadgeVariant(clinicalHistory?.surgery_received)}>
                                  {translateValue(clinicalHistory?.surgery_received)}
                                </Badge>
                              </CardContent>
                            </Card>
                          </>
                        )}
                        
                        {isEditing && (
                          <div className="md:col-span-2">
                            <FormField
                              control={form.control}
                              name="treatment_recommendation"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Recomendación de Tratamiento</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Descripción detallada de la recomendación de tratamiento..."
                                      className="resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                        
                        {!isEditing && clinicalHistory?.treatment_recommendation && (
                          <Card className="md:col-span-2">
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center gap-2 text-base">
                                <Stethoscope className="w-4 h-4" />
                                Recomendación de Tratamiento
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">
                                {clinicalHistory.treatment_recommendation}
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="follow-up" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isEditing ? (
                          <>
                            <FormField
                              control={form.control}
                              name="follow_up_adherence"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4" />
                                    Adherencia al Seguimiento *
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Good">Buena</SelectItem>
                                      <SelectItem value="Poor">Pobre</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="recurrence"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4" />
                                    Recurrencia
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Yes">Sí</SelectItem>
                                      <SelectItem value="No">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="time_to_recurrence"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Tiempo a Recurrencia (meses)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Ej: 12"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        ) : (
                          <>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <RefreshCw className="w-4 h-4" />
                                  Adherencia al Seguimiento
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge variant={getBadgeVariant(clinicalHistory?.follow_up_adherence)}>
                                  {translateValue(clinicalHistory?.follow_up_adherence)}
                                </Badge>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                  <RefreshCw className="w-4 h-4" />
                                  Recurrencia
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge variant={getBadgeVariant(clinicalHistory?.recurrence)}>
                                  {translateValue(clinicalHistory?.recurrence)}
                                </Badge>
                              </CardContent>
                            </Card>
                            {clinicalHistory?.time_to_recurrence && (
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="flex items-center gap-2 text-base">
                                    <Calendar className="w-4 h-4" />
                                    Tiempo a Recurrencia
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <Badge variant="outline">
                                    {clinicalHistory.time_to_recurrence} meses
                                  </Badge>
                                </CardContent>
                              </Card>
                            )}
                          </>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </form>
              </Form>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}