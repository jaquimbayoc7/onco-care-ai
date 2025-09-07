import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClinicalButton } from "@/components/ui/clinical-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ForgotPasswordFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  isOpen,
  onClose
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setEmailSent(true);
      setIsLoading(false);
      toast({
        title: "Email enviado",
        description: "Se ha enviado un enlace de recuperación a su correo electrónico",
      });
    }, 2000);
  };

  const handleClose = () => {
    setEmail("");
    setEmailSent(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {emailSent ? "Email Enviado" : "Recuperar Contraseña"}
          </DialogTitle>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardContent className="p-6">
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-muted-foreground">
                    Ingrese su email institucional y le enviaremos un enlace para restablecer su contraseña.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-sm font-medium">
                    Email Institucional
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="doctor@hospital.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <ClinicalButton 
                    type="button"
                    variant="outline" 
                    size="lg" 
                    onClick={handleClose}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Cancelar
                  </ClinicalButton>
                  <ClinicalButton 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Enviar Enlace"}
                  </ClinicalButton>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">¡Enlace Enviado!</h3>
                  <p className="text-muted-foreground text-sm">
                    Hemos enviado un enlace de recuperación a <br />
                    <span className="font-medium">{email}</span>
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Revise su bandeja de entrada y siga las instrucciones para restablecer su contraseña.
                  </p>
                </div>
                <ClinicalButton 
                  variant="hero" 
                  size="lg" 
                  onClick={handleClose}
                  className="w-full"
                >
                  Entendido
                </ClinicalButton>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordForm;