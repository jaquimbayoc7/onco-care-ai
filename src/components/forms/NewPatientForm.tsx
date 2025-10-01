import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { UserPlus } from "lucide-react";
import { PatientCreate, PatientUpdate } from "@/types/patient";
import { PatientsAPI } from "@/services/patientsApi";
import { useToast } from "@/hooks/use-toast";

interface NewPatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editPatient?: any; // Patient data for editing mode
  mode?: 'create' | 'edit'; // Form mode
}

// Validation schema based on API contract
const patientSchema = z.object({
  document_id: z.string().min(1, "Document ID is required"),
  name: z.string().min(1, "Name is required"),
  age: z.union([z.number().min(0, "Age must be positive"), z.nan()]).transform(val => isNaN(val) ? undefined : val).pipe(z.number().min(0, "Age must be positive")),
  gender: z.enum(['Male', 'Female', 'Other'], {
    required_error: "Gender is required",
  }),
  race: z.string().min(1, "Race is required"),
  region: z.string().min(1, "Region is required"),
  urban_or_rural: z.enum(['Urban', 'Rural'], {
    required_error: "Area type is required",
  }),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
});

type PatientFormData = z.infer<typeof patientSchema>;

const NewPatientForm: React.FC<NewPatientFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editPatient,
  mode = 'create'
}) => {
  const isEditMode = mode === 'edit';
  const { toast } = useToast();
  
  const getDefaultValues = (): PatientFormData => {
    if (isEditMode && editPatient) {
      return {
        document_id: editPatient.document_id || "",
        name: editPatient.name || "",
        age: editPatient.age || ("" as any),
        gender: editPatient.gender || "Male",
        race: editPatient.race || "",
        region: editPatient.region || "",
        urban_or_rural: editPatient.urban_or_rural || "Urban",
        email: editPatient.email || "",
        phone: editPatient.phone || "",
        address: editPatient.address || "",
      };
    }
    return {
      document_id: "",
      name: "",
      age: "" as any,
      gender: "Male",
      race: "",
      region: "",
      urban_or_rural: "Urban",
      email: "",
      phone: "",
      address: "",
    };
  };

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: getDefaultValues()
  });

  // Reset form when opening/closing or changing patient
  React.useEffect(() => {
    if (isOpen) {
      const defaultValues = getDefaultValues();
      form.reset(defaultValues);
    }
  }, [isOpen, editPatient, mode]);

  const handleSubmit = async (data: PatientFormData) => {
    try {
      let result;
      
      if (isEditMode && editPatient) {
        const updateData: PatientUpdate = { ...data };
        // Use patient ID for editing instead of document_id
        result = await PatientsAPI.updatePatientById(editPatient.id, updateData);
      } else {
        const createData: PatientCreate = data as PatientCreate;
        result = await PatientsAPI.createPatient(createData);
      }

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: isEditMode ? "Patient Updated" : "Patient Created",
        description: result.message,
      });

      onSubmit(result.data);
      form.reset();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
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
            <Card className="card-clinical">
              <CardHeader>
                <CardTitle>Información del Paciente</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="document_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documento de Identidad</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Número de documento" 
                          {...field}
                          disabled={isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre completo del paciente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? "" : parseInt(value));
                          }}
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar género" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Masculino</SelectItem>
                          <SelectItem value="Female">Femenino</SelectItem>
                          <SelectItem value="Other">Otro</SelectItem>
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
                      <FormControl>
                        <Input placeholder="Ej: Mestizo, Afrodescendiente, Indígena" {...field} />
                      </FormControl>
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar zona" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Urban">Urbano</SelectItem>
                          <SelectItem value="Rural">Rural</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="correo@ejemplo.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+57 300 123 4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Dirección completa del paciente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4 pt-4">
              <ClinicalButton variant="outline" onClick={onClose}>
                Cancelar
              </ClinicalButton>
              <ClinicalButton type="submit" variant="clinical">
                {isEditMode ? 'Actualizar Paciente' : 'Crear Paciente'}
              </ClinicalButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewPatientForm;