import { useState, useEffect } from "react";
import { ClinicalButton } from "@/components/ui/clinical-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ConnectionStatus } from "@/components/ui/connection-status";
import { 
  Brain, 
  Activity, 
  Shield, 
  Users, 
  TrendingUp, 
  Eye,
  ArrowRight,
  Lock,
  Mail,
  UserPlus
} from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import doctorHero from "@/assets/doctor-hero.jpg";
import aiMedicalTech from "@/assets/ai-medical-tech.jpg";
import medicalDashboard from "@/assets/medical-dashboard.jpg";
import medicalDecorative from "@/assets/medical-decorative.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/services/authApi";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Campos de registro
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [tipoDoc, setTipoDoc] = useState("CC");
  const [doc, setDoc] = useState("");
  const [especialidades, setEspecialidades] = useState("");
  
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
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al sistema OncoSímil",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Error de autenticación",
          description: result.error || "Credenciales incorrectas. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar al servidor. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { success, error } = await authAPI.register({
        email,
        password,
        nombres,
        apellidos,
        tipo_doc: tipoDoc,
        doc,
        especialidades
      });
      
      if (success) {
        toast({
          title: "Registro exitoso",
          description: "Por favor inicia sesión con tus credenciales.",
        });
        // Cambiar a modo login
        setIsRegistering(false);
        // Limpiar campos de registro
        setNombres("");
        setApellidos("");
        setDoc("");
        setEspecialidades("");
      } else {
        toast({
          title: "Error en el registro",
          description: error || "No se pudo completar el registro. Inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar al servidor. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${medicalDecorative})` }}
        />
        <div className="absolute inset-0 gradient-hero opacity-90" />
        
        {/* Connection Status - Top Right */}
        <div className="absolute top-4 right-4 z-20">
          <ConnectionStatus />
        </div>
        
        {/* Decorative Medical Elements */}
        <div className="absolute top-20 right-20 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse hidden lg:block" />
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse hidden lg:block" />
        <div className="absolute top-1/3 left-8 w-8 h-8 bg-accent/30 rounded-full blur-lg animate-pulse hidden md:block" />
        
        <div className="relative z-10 container max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-end min-h-[80vh]">
            {/* Left Column - Doctor Image */}
            <div className="order-1 lg:order-1">
              <div className="relative">
                <img 
                  src={doctorHero} 
                  alt="Profesional médico especialista en oncología"
                  className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-accent/20 rounded-2xl" />
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-800">Sistema activo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Content and Form */}
            <div className="order-2 lg:order-2 flex flex-col justify-end">
              {/* Hero Content - Top Section */}
              <div className="text-center lg:text-left space-y-3 mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                  Inteligencia Artificial al Servicio de la{" "}
                  <span className="bg-gradient-to-r from-accent to-accent-soft bg-clip-text text-transparent">
                    Oncología
                  </span>
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed">
                  OncoSimil AI potencia sus decisiones clínicas con análisis predictivos 
                  y recomendaciones de tratamiento personalizadas basadas en evidencia científica.
                </p>
              </div>

              {/* Stats - Compact */}
              <div className="hidden sm:grid grid-cols-3 gap-4 mb-8">
                <div className="text-center lg:text-left">
                  <div className="text-lg lg:text-xl font-bold text-accent">95%</div>
                  <div className="text-xs text-white/70">Precisión diagnóstica</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-lg lg:text-xl font-bold text-accent">10k+</div>
                  <div className="text-xs text-white/70">Casos analizados</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-lg lg:text-xl font-bold text-accent">24/7</div>
                  <div className="text-xs text-white/70">Monitoreo continuo</div>
                </div>
              </div>

              {/* Login/Register Form - Compact and aligned with bottom */}
              <Card className="w-full max-w-md card-elevated backdrop-blur-sm bg-background/95 rounded-2xl">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h2 className="text-lg lg:text-xl font-bold text-primary mb-2">
                      {isRegistering ? "Registro Médico" : "Acceso Clínico"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {isRegistering 
                        ? "Complete sus datos profesionales" 
                        : "Ingrese sus credenciales profesionales"
                      }
                    </p>
                  </div>
                  
                  <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                    {isRegistering && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="nombres" className="text-sm font-medium">
                              Nombres
                            </Label>
                            <Input
                              id="nombres"
                              type="text"
                              placeholder="Juan"
                              className="h-11 rounded-xl"
                              value={nombres}
                              onChange={(e) => setNombres(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="apellidos" className="text-sm font-medium">
                              Apellidos
                            </Label>
                            <Input
                              id="apellidos"
                              type="text"
                              placeholder="Pérez"
                              className="h-11 rounded-xl"
                              value={apellidos}
                              onChange={(e) => setApellidos(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="tipoDoc" className="text-sm font-medium">
                              Tipo Doc.
                            </Label>
                            <select
                              id="tipoDoc"
                              className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              value={tipoDoc}
                              onChange={(e) => setTipoDoc(e.target.value)}
                              required
                            >
                              <option value="CC">CC</option>
                              <option value="CE">CE</option>
                              <option value="PA">Pasaporte</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="doc" className="text-sm font-medium">
                              Documento
                            </Label>
                            <Input
                              id="doc"
                              type="text"
                              placeholder="12345678"
                              className="h-11 rounded-xl"
                              value={doc}
                              onChange={(e) => setDoc(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="especialidades" className="text-sm font-medium">
                            Especialidad
                          </Label>
                          <Input
                            id="especialidades"
                            type="text"
                            placeholder="Oncología, Radiología..."
                            className="h-11 rounded-xl"
                            value={especialidades}
                            onChange={(e) => setEspecialidades(e.target.value)}
                            required
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email {isRegistering ? "Profesional" : "Institucional"}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="doctor@hospital.com"
                          className="pl-10 h-11 rounded-xl"
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
                          className="pl-10 h-11 rounded-xl"
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
                      className="w-full h-11 rounded-xl"
                      disabled={isLoading}
                    >
                      {isLoading 
                        ? (isRegistering ? "Registrando..." : "Iniciando...") 
                        : (isRegistering ? "Registrarse" : "Iniciar Sesión")
                      }
                      {isRegistering ? <UserPlus className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </ClinicalButton>
                  </form>
                  
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegistering(!isRegistering);
                        // Limpiar campos al cambiar
                        setEmail("");
                        setPassword("");
                        setNombres("");
                        setApellidos("");
                        setDoc("");
                        setEspecialidades("");
                      }}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {isRegistering 
                        ? "¿Ya tiene cuenta? Inicie sesión" 
                        : "¿No tiene cuenta? Regístrese"
                      }
                    </button>
                  </div>

                  {/* Stats for mobile */}
                  <div className="sm:hidden mt-4 pt-4 border-t border-border/20">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-lg font-bold text-accent">95%</div>
                        <div className="text-xs text-muted-foreground">Precisión</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-accent">10k+</div>
                        <div className="text-xs text-muted-foreground">Casos</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-accent">24/7</div>
                        <div className="text-xs text-muted-foreground">Activo</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4 sm:mb-6">
              Características Clave del Sistema
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Herramientas avanzadas diseñadas para optimizar el cuidado oncológico 
              y mejorar los resultados clínicos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Feature 1 - Vista 360° */}
            <Card className="card-clinical group overflow-hidden relative ai-enhanced hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 opacity-10 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                   style={{ backgroundImage: `url(${medicalDashboard})` }} />
              <div className="relative z-10 p-4 sm:p-6 md:p-8 text-center">
                <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-4">
                  Vista 360° del Paciente
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Centralice historiales, vitales y tratamientos en un panel 
                  unificado para una visión completa del estado clínico.
                </p>
              </div>
            </Card>

            {/* Feature 2 - IA */}
            <Card className="card-clinical group overflow-hidden relative ai-enhanced hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 opacity-10 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                   style={{ backgroundImage: `url(${aiMedicalTech})` }} />
              <div className="relative z-10 p-4 sm:p-6 md:p-8 text-center">
                <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-4">
                  Motor de Recomendación IA
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Reciba sugerencias de tratamiento basadas en evidencia 
                  y perfiles genómicos personalizados para cada paciente.
                </p>
              </div>
            </Card>

          </div>
          
          {/* Additional Info Section */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-8 bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5 text-accent" />
                <span className="text-sm">+500 médicos</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-sm">Certificado ISO 27001</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="w-5 h-5 text-accent" />
                <span className="text-sm">Cumple HIPAA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-6 sm:py-8">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-primary-foreground/80">
            © 2024 OncoSimil AI. Desarrollado para mejorar el cuidado oncológico.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;