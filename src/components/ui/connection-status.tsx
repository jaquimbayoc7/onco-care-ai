import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Conexión restaurada",
        description: "La aplicación está nuevamente en línea",
        variant: "default",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Sin conexión",
        description: "Trabajando en modo offline. Los datos se sincronizarán cuando vuelvas a estar en línea.",
        variant: "destructive",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [toast]);

  return (
    <Badge
      variant={isOnline ? "default" : "destructive"}
      className="flex items-center gap-1.5 transition-all duration-300"
    >
      {isOnline ? (
        <>
          <Wifi className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">En línea</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Sin conexión</span>
        </>
      )}
    </Badge>
  );
};
