import { useState, useEffect } from "react";
import { ClinicalButton } from "@/components/ui/clinical-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Activity, 
  Shield, 
  Users, 
  TrendingUp, 
  Eye,
  ArrowRight,
  Lock,
  Mail 
} from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = login(email, password);
    
    if (success) {
      toast({
        title: "Bienvenido",
        description: "Sesión iniciada exitosamente",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Error de autenticación",
        description: "Credenciales inválidas. Intente nuevamente.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 gradient-hero opacity-90" />
        
        <div className="relative z-10 container max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Inteligencia Artificial al Servicio de la{" "}
                <span className="bg-gradient-to-r from-accent to-accent-soft bg-clip-text text-transparent">
                  Oncología
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                OncoSimil AI potencia sus decisiones clínicas con análisis predictivos 
                y recomendaciones de tratamiento personalizadas basadas en evidencia científica.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <ClinicalButton variant="ai" size="xl">
                  Comenzar Análisis
                  <Brain className="w-5 h-5" />
                </ClinicalButton>
                <ClinicalButton variant="outline" size="xl" className="text-white border-white/30 hover:bg-white/10">
                  Ver Demo
                  <Eye className="w-5 h-5" />
                </ClinicalButton>
              </div>
            </div>

            {/* Login Form */}
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md card-elevated">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-primary mb-2">Acceso Clínico</h2>
                    <p className="text-muted-foreground">Ingrese sus credenciales profesionales</p>
                  </div>
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Institucional
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="doctor@hospital.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Contraseña
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <ClinicalButton 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Iniciando..." : "Iniciar Sesión"}
                      <ArrowRight className="w-4 h-4" />
                    </ClinicalButton>
                  </form>
                  
                  <div className="text-center mt-4">
                    <a href="#" className="text-sm text-accent hover:underline">
                      ¿Olvidó su contraseña?
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">
              Características Clave del Sistema
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Herramientas avanzadas diseñadas para optimizar el cuidado oncológico 
              y mejorar los resultados clínicos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="card-clinical text-center p-8 ai-enhanced">
              <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">
                Vista 360° del Paciente
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Centralice historiales, vitales y tratamientos en un panel 
                unificado para una visión completa del estado clínico.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="card-clinical text-center p-8 ai-enhanced">
              <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">
                Motor de Recomendación IA
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Reciba sugerencias de tratamiento basadas en evidencia 
                y perfiles genómicos personalizados para cada paciente.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="card-clinical text-center p-8 ai-enhanced">
              <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4">
                Monitoreo Proactivo
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Supervise la adherencia al tratamiento y los efectos 
                secundarios en tiempo real con alertas inteligentes.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-8">
        <div className="container max-w-6xl mx-auto px-6 text-center">
          <p className="text-primary-foreground/80">
            © 2024 OncoSimil AI. Desarrollado para mejorar el cuidado oncológico.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;