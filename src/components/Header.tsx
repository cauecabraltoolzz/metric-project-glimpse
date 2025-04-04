import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function Header() {
  return (
    <div className="flex h-16 items-center px-4 border-b">
      <div className="flex flex-1 items-center space-x-4">
        <form className="flex-1 flex items-center space-x-2">
          <Input
            type="search"
            placeholder="Buscar..."
            className="h-9 md:w-[300px] lg:w-[400px]"
          />
          <Button type="submit" size="sm" variant="ghost">
            <Search className="h-4 w-4" />
            <span className="sr-only">Buscar</span>
          </Button>
        </form>
      </div>
    </div>
  );
} 