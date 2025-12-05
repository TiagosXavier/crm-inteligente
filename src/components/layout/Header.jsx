import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useTheme } from '@/components/ui/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sun, Moon, LogOut, User, Bell, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors = {
  online: 'bg-emerald-500',
  away: 'bg-amber-500',
  offline: 'bg-slate-500',
};

const statusLabels = {
  online: 'Online',
  away: 'Ausente',
  offline: 'Offline',
};

export default function Header({ user, collapsed }) {
  const { theme, toggleTheme } = useTheme();
  const [status, setStatus] = useState(user?.status || 'online');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await base44.auth.updateMe({ status: newStatus });
      setStatus(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleLabel = (role) => {
    const roles = {
      admin: 'Administrador',
      supervisor: 'Supervisor',
      user: 'Atendente',
    };
    return roles[role] || role;
  };

  return (
    <header className={cn(
      "fixed top-0 right-0 z-30 h-16 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6 transition-all duration-300",
      collapsed ? "left-16" : "left-64"
    )}>
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white hidden md:block">
          Bem-vindo, {user?.full_name?.split(' ')[0] || 'Usuário'}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Status Selector */}
        <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
          <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
            <div className="flex items-center gap-2">
              <Circle className={cn("w-2 h-2 fill-current", statusColors[status].replace('bg-', 'text-'))} />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value} className="text-white hover:bg-slate-700">
                <div className="flex items-center gap-2">
                  <Circle className={cn("w-2 h-2 fill-current", statusColors[value].replace('bg-', 'text-'))} />
                  {label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white hover:bg-slate-800">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-indigo-500">
                <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
                <AvatarFallback className="bg-indigo-600 text-white">
                  {getInitials(user?.full_name)}
                </AvatarFallback>
              </Avatar>
              <span className={cn(
                "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900",
                statusColors[status]
              )} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end">
            <DropdownMenuLabel className="text-white">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.full_name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
                <p className="text-xs text-indigo-400">{getRoleLabel(user?.role)}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-rose-400 hover:text-rose-300 hover:bg-slate-700 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}