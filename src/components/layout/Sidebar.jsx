import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Kanban,
  FileText,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'Dashboard' },
  { name: 'Conversas', icon: MessageSquare, page: 'Conversations', badge: 5 },
  { name: 'Contatos', icon: Users, page: 'Contacts' },
  { name: 'Pipeline', icon: Kanban, page: 'Pipeline' },
  { name: 'Templates', icon: FileText, page: 'Templates', roles: ['admin', 'supervisor'] },
  { name: 'Equipe', icon: UserCog, page: 'Team', roles: ['admin', 'supervisor'] },
  { name: 'Configurações', icon: Settings, page: 'Settings' },
];

export default function Sidebar({ collapsed, setCollapsed, currentPage, userRole }) {
  const filteredItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">CRM Smart</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        <TooltipProvider delayDuration={0}>
          {filteredItems.map((item) => {
            const isActive = currentPage === item.page;
            const Icon = item.icon;

            const menuButton = (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-white")} />
                {!collapsed && (
                  <>
                    <span className="font-medium">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.page}>
                  <TooltipTrigger asChild>
                    {menuButton}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return menuButton;
          })}
        </TooltipProvider>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg p-3 border border-indigo-500/20">
            <p className="text-xs text-slate-400">Versão 1.0.0</p>
            <p className="text-xs text-indigo-400 mt-1">CRM Inteligente</p>
          </div>
        </div>
      )}
    </aside>
  );
}