import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClinicalButton } from "@/components/ui/clinical-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, User, FileText, ActivitySquare } from "lucide-react";

interface NewPatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editPatient?: any; // Patient data for editing mode
  mode?: 'create' | 'edit'; // Form mode
}

interface PatientFormData {
  // Patient basic info
  age: number;
  gender: string;
  race: string;
  region: string;
  urban_or_rural: string;
  socio_economic_status: string;
  insurance_coverage: string;
  
  // Medical record
  has_family_history: boolean;
  has_previous_cancer: boolean;
  diagnosis_stage: string;
  tumor_aggressiveness: string;
  has_colonoscopy_access: boolean;
  screening_regularity: string;
  diet_type: string;
  bmi_value: number;
  physical_activity_level: string;
  is_smoker: boolean;
  alcohol_consumption: string;
  red_meat_consumption: string;
  fiber_consumption: string;
  has_treatment_access: boolean;
  follow_up_adherence: string;
  survival_status: string;
}

const NewPatientForm: React.FC<NewPatientFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editPatient,
  mode = 'create'
}) => {
  const isEditMode = mode === 'edit';
  
  const getDefaultValues = () => {
    if (isEditMode && editPatient) {
      return {
        age: editPatient.age || 0,
        gender: editPatient.gender || "",
        race: editPatient.race || "",
        region: editPatient.region || "",
        urban_or_rural: editPatient.urban_or_rural || "",
        socio_economic_status: editPatient.socio_economic_status || "",
        insurance_coverage: editPatient.insurance_coverage || "",
        has_family_history: editPatient.has_family_history || false,
        has_previous_cancer: editPatient.has_previous_cancer || false,
        diagnosis_stage: editPatient.stage || "",
        tumor_aggressiveness: editPatient.tumor_aggressiveness || "",
        has_colonoscopy_access: editPatient.has_colonoscopy_access || false,
        screening_regularity: editPatient.screening_regularity || "",
        diet_type: editPatient.diet_type || "",
        bmi_value: editPatient.bmi_value || 0,
        physical_activity_level: editPatient.physical_activity_level || "",
        is_smoker: editPatient.is_smoker || false,
        alcohol_consumption: editPatient.alcohol_consumption || "",
        red_meat_consumption: editPatient.red_meat_consumption || "",
        fiber_consumption: editPatient.fiber_consumption || "",
        has_treatment_access: editPatient.has_treatment_access || false,
        follow_up_adherence: editPatient.follow_up_adherence || "",
        survival_status: editPatient.status || "Active"
      };
    }
    return {
      age: 0,
      gender: "",
      race: "",
      region: "",
      urban_or_rural: "",
      socio_economic_status: "",
      insurance_coverage: "",
      has_family_history: false,
      has_previous_cancer: false,
      diagnosis_stage: "",
      tumor_aggressiveness: "",
      has_colonoscopy_access: false,
      screening_regularity: "",
      diet_type: "",
      bmi_value: 0,
      physical_activity_level: "",
      is_smoker: false,
      alcohol_consumption: "",
      red_meat_consumption: "",
      fiber_consumption: "",
      has_treatment_access: false,
      follow_up_adherence: "",
      survival_status: "Active"
    };
  };

  const form = useForm<PatientFormData>({
    defaultValues: getDefaultValues()
  });

  // Reset form when opening/closing or changing patient
  React.useEffect(() => {
    if (isOpen) {
      const defaultValues = getDefaultValues();
      form.reset(defaultValues);
    }
  }, [isOpen, editPatient, mode]);

  const handleSubmit = (data: PatientFormData) => {
    const submitData = isEditMode ? { ...data, id: editPatient?.id } : data;
    onSubmit(submitData);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-primary" />
              </div>
              {isEditMode ? 'Editar Paciente' : 'Nuevo Paciente'}
            </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="demographics" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="demographics" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Demografía
                </TabsTrigger>
                <TabsTrigger value="medical" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Historia Médica
                </TabsTrigger>
                <TabsTrigger value="lifestyle" className="flex items-center gap-2">
                  <ActivitySquare className="w-4 h-4" />
                  Estilo de Vida
                </TabsTrigger>
              </TabsList>

              <TabsContent value="demographics" className="space-y-6">
                <Card className="card-clinical">
                  <CardHeader>
                    <CardTitle>Información Demográfica</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Edad</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Años" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Género</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar género" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Masculino">Masculino</SelectItem>
                              <SelectItem value="Femenino">Femenino</SelectItem>
                              <SelectItem value="Otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="race"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Raza/Etnia</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar raza/etnia" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Hispano/Latino">Hispano/Latino</SelectItem>
                              <SelectItem value="Blanco">Blanco</SelectItem>
                              <SelectItem value="Afroamericano">Afroamericano</SelectItem>
                              <SelectItem value="Asiático">Asiático</SelectItem>
                              <SelectItem value="Nativo Americano">Nativo Americano</SelectItem>
                              <SelectItem value="Otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Región</FormLabel>
                          <FormControl>
                            <Input placeholder="Ciudad, Estado/Provincia" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="urban_or_rural"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zona de Residencia</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar zona" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Urbano">Urbano</SelectItem>
                              <SelectItem value="Suburbano">Suburbano</SelectItem>
                              <SelectItem value="Rural">Rural</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socio_economic_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estatus Socioeconómico</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar nivel" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Estrato 1">Estrato 1 (Bajo-bajo)</SelectItem>
                              <SelectItem value="Estrato 2">Estrato 2 (Bajo)</SelectItem>
                              <SelectItem value="Estrato 3">Estrato 3 (Medio-bajo)</SelectItem>
                              <SelectItem value="Estrato 4">Estrato 4 (Medio)</SelectItem>
                              <SelectItem value="Estrato 5">Estrato 5 (Medio-alto)</SelectItem>
                              <SelectItem value="Estrato 6">Estrato 6 (Alto)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="insurance_coverage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cobertura de Seguro</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Tipo de seguro" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="EPS Contributivo">EPS Contributivo</SelectItem>
                              <SelectItem value="EPS Subsidiado">EPS Subsidiado</SelectItem>
                              <SelectItem value="Medicina Prepagada">Medicina Prepagada</SelectItem>
                              <SelectItem value="Particular">Particular</SelectItem>
                              <SelectItem value="Régimen Especial">Régimen Especial</SelectItem>
                              <SelectItem value="Sin Afiliación">Sin Afiliación</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medical" className="space-y-6">
                <Card className="card-clinical">
                  <CardHeader>
                    <CardTitle>Historia Médica y Diagnóstico</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="diagnosis_stage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Etapa del Diagnóstico</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar etapa" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">Etapa 0 (In situ)</SelectItem>
                              <SelectItem value="I">Etapa I</SelectItem>
                              <SelectItem value="IIA">Etapa IIA</SelectItem>
                              <SelectItem value="IIB">Etapa IIB</SelectItem>
                              <SelectItem value="IIIA">Etapa IIIA</SelectItem>
                              <SelectItem value="IIIB">Etapa IIIB</SelectItem>
                              <SelectItem value="IIIC">Etapa IIIC</SelectItem>
                              <SelectItem value="IV">Etapa IV</SelectItem>
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
                          <FormLabel>Agresividad del Tumor</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Nivel de agresividad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Bajo">Bajo</SelectItem>
                              <SelectItem value="Moderado">Moderado</SelectItem>
                              <SelectItem value="Alto">Alto</SelectItem>
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
                          <FormLabel>Regularidad de Tamizaje</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Frecuencia de tamizaje" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Regular">Regular</SelectItem>
                              <SelectItem value="Irregular">Irregular</SelectItem>
                              <SelectItem value="Nunca">Nunca</SelectItem>
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
                          <FormLabel>Adherencia al Seguimiento</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Nivel de adherencia" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Alta">Alta (&gt;90%)</SelectItem>
                              <SelectItem value="Moderada">Moderada (70-90%)</SelectItem>
                              <SelectItem value="Baja">Baja (&lt;70%)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="lifestyle" className="space-y-6">
                <Card className="card-clinical">
                  <CardHeader>
                    <CardTitle>Estilo de Vida y Factores de Riesgo</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bmi_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IMC (Índice de Masa Corporal)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              placeholder="kg/m²" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Nivel de actividad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Sedentario">Sedentario</SelectItem>
                              <SelectItem value="Ligero">Ligero</SelectItem>
                              <SelectItem value="Moderado">Moderado</SelectItem>
                              <SelectItem value="Intenso">Intenso</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="diet_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Dieta</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Tipo de alimentación" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mediterránea">Mediterránea</SelectItem>
                              <SelectItem value="Occidental">Occidental</SelectItem>
                              <SelectItem value="Vegetariana">Vegetariana</SelectItem>
                              <SelectItem value="Vegana">Vegana</SelectItem>
                              <SelectItem value="Otra">Otra</SelectItem>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Frecuencia de consumo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Nunca">Nunca</SelectItem>
                              <SelectItem value="Ocasional">Ocasional</SelectItem>
                              <SelectItem value="Moderado">Moderado</SelectItem>
                              <SelectItem value="Excesivo">Excesivo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="red_meat_consumption"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consumo de Carne Roja</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Frecuencia semanal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Nunca">Nunca</SelectItem>
                              <SelectItem value="1-2 veces">1-2 veces/semana</SelectItem>
                              <SelectItem value="3-4 veces">3-4 veces/semana</SelectItem>
                              <SelectItem value="Diario">Diario</SelectItem>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Nivel de consumo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Bajo">Bajo</SelectItem>
                              <SelectItem value="Moderado">Moderado</SelectItem>
                              <SelectItem value="Alto">Alto</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <ClinicalButton
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </ClinicalButton>
              <ClinicalButton type="submit" variant="default">
                {isEditMode ? <User className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {isEditMode ? 'Editar Paciente' : 'Crear Paciente'}
              </ClinicalButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewPatientForm;