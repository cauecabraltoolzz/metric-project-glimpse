import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}

export function Navbar({ sidebarOpen, onSidebarToggle }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-10 border-b bg-background">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={onSidebarToggle}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <div className="sm:hidden">
            <h1 className="text-xl font-semibold">Métricas de Projeto</h1>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
} 