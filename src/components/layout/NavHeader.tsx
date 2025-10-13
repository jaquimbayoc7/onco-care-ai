import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ClinicalButton } from '@/components/ui/clinical-button';
import { User, LogOut, Settings, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const NavHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
  };

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
            <Stethoscope className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="hidden xs:block">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">OncoSimil AI</h1>
            <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Sistema de Gestión Oncológica</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* User Info */}
          <div className="text-right hidden lg:block">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-600">{user.specialty}</p>
          </div>

          {/* Avatar and Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ClinicalButton variant="outline" className="h-auto p-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary text-white text-sm">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </ClinicalButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.specialty}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.hospital}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default NavHeader;