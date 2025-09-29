import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PatientsAPI } from "@/services/patientsApi";
import { ClinicalHistoryCreate, ClinicalHistoryRead, ClinicalHistoryUpdate } from "@/types/patient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
});

type ClinicalHistoryFormData = z.infer<typeof clinicalHistorySchema>;

interface ClinicalHistoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  patientDocumentId: string;
  existingHistory?: ClinicalHistoryRead;
  onSuccess: () => void;
}

export default function ClinicalHistoryForm({
  isOpen,
  onClose,
  patientDocumentId,
  existingHistory,
  onSuccess
}: ClinicalHistoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
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
    if (existingHistory) {
      form.reset({
        family_history: existingHistory.family_history,
        previous_cancer_history: existingHistory.previous_cancer_history,
        stage_at_diagnosis: existingHistory.stage_at_diagnosis,
        tumor_aggressiveness: existingHistory.tumor_aggressiveness,
        colonoscopy_access: existingHistory.colonoscopy_access,
        screening_regularity: existingHistory.screening_regularity,
        diet_type: existingHistory.diet_type,
        bmi: existingHistory.bmi,
        physical_activity_level: existingHistory.physical_activity_level,
        smoking_status: existingHistory.smoking_status,
        alcohol_consumption: existingHistory.alcohol_consumption,
        fiber_consumption: existingHistory.fiber_consumption,
        insurance_coverage: existingHistory.insurance_coverage,
        time_to_diagnosis: existingHistory.time_to_diagnosis,
        treatment_access: existingHistory.treatment_access,
        treatment_id: existingHistory.treatment_id,
        chemotherapy_received: existingHistory.chemotherapy_received,
        radiotherapy_received: existingHistory.radiotherapy_received,
        surgery_received: existingHistory.surgery_received,
        treatment_recommendation: existingHistory.treatment_recommendation,
        follow_up_adherence: existingHistory.follow_up_adherence,
        recurrence: existingHistory.recurrence,
        time_to_recurrence: existingHistory.time_to_recurrence,
      });
    }
  }, [existingHistory, form]);

  const onSubmit = async (data: ClinicalHistoryFormData) => {
    setIsLoading(true);
    try {
      if (existingHistory) {
        // Update existing clinical history
        const updateData: ClinicalHistoryUpdate = data;
        const response = await PatientsAPI.updateClinicalHistory(patientDocumentId, updateData);
        
        if (response.error) {
          toast({
            title: "Error",
            description: response.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Éxito",
            description: "Historial clínico actualizado correctamente",
          });
          onSuccess();
          onClose();
        }
      } else {
        // Create new clinical history
        const createData: ClinicalHistoryCreate = {
          document_id: patientDocumentId,
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
          toast({
            title: "Éxito",
            description: "Historial clínico creado correctamente",
          });
          onSuccess();
          onClose();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingHistory ? "Editar Historial Clínico" : "Crear Historial Clínico"}
          </DialogTitle>
          <DialogDescription>
            {existingHistory 
              ? "Actualiza la información del historial clínico del paciente"
              : "Completa la información del historial clínico del paciente"
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Antecedentes */}
              <FormField
                control={form.control}
                name="family_history"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Antecedentes Familiares</FormLabel>
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
                    <FormLabel>Historial de Cáncer Previo</FormLabel>
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

              {/* Diagnóstico */}
              <FormField
                control={form.control}
                name="stage_at_diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estadio al Diagnóstico *</FormLabel>
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
                    <FormLabel>Agresividad del Tumor *</FormLabel>
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

              {/* Screening */}
              <FormField
                control={form.control}
                name="colonoscopy_access"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acceso a Colonoscopia</FormLabel>
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
                name="screening_regularity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regularidad de Screening</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Irregular">Irregular</SelectItem>
                        <SelectItem value="Never">Nunca</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Estilo de vida */}
              <FormField
                control={form.control}
                name="diet_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Dieta</FormLabel>
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
                    <FormLabel>BMI</FormLabel>
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
                    <FormLabel>Nivel de Actividad Física</FormLabel>
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
                    <FormLabel>Estado de Fumador</FormLabel>
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
                    <FormLabel>Consumo de Alcohol</FormLabel>
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
                    <FormLabel>Consumo de Fibra</FormLabel>
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

              {/* Acceso a tratamiento */}
              <FormField
                control={form.control}
                name="insurance_coverage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cobertura de Seguro</FormLabel>
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
                name="time_to_diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiempo al Diagnóstico</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Delayed">Retrasado</SelectItem>
                        <SelectItem value="Timely">Oportuno</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="treatment_access"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acceso a Tratamiento *</FormLabel>
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
                name="treatment_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID de Tratamiento</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ej: 123"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tratamientos recibidos */}
              <FormField
                control={form.control}
                name="chemotherapy_received"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quimioterapia Recibida</FormLabel>
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
                    <FormLabel>Radioterapia Recibida</FormLabel>
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
                    <FormLabel>Cirugía Recibida</FormLabel>
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
                name="follow_up_adherence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adherencia al Seguimiento *</FormLabel>
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
                    <FormLabel>Recurrencia</FormLabel>
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
                    <FormLabel>Tiempo a Recurrencia (meses)</FormLabel>
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
            </div>

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

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {existingHistory ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}