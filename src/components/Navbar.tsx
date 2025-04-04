import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link to="/" className="font-semibold">
          Metric Glimpse
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          <Button asChild>
            <Link to="/new-project">Novo Projeto</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
} 