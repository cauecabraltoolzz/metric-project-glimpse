import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Grid2X2, FileText, Settings, Menu, X, Plus } from "lucide-react";
import { Navbar } from "./Navbar";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link to={to}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className="w-full justify-start gap-2"
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    {
      to: "/",
      icon: <Grid2X2 className="h-5 w-5" />,
      label: "Painel",
    },
    {
      to: "/reports",
      icon: <FileText className="h-5 w-5" />,
      label: "Relatórios",
    },
    {
      to: "/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Configurações",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-300 sm:static sm:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b px-6 py-4">
          <h1 className="text-xl font-semibold">Métricas de Projeto</h1>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.to}
            />
          ))}
        </nav>
        <div className="p-4 border-t">
          <Link to="/new-project">
            <Button className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Novo Projeto
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <Navbar 
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="container py-6">
          {children}
        </div>
      </main>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 sm:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  );
};

export default Layout;
