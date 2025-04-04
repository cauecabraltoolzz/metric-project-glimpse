import React from "react";
import { useNavigate } from "react-router-dom";
import { NewProjectForm } from "@/components/NewProjectForm";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NewProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    // Aqui você implementaria a lógica para salvar o projeto
    // Por enquanto, vamos apenas mostrar uma mensagem de sucesso
    toast({
      title: "Projeto criado com sucesso!",
      description: "O projeto foi adicionado à sua lista de projetos.",
    });
    
    // Redirecionar para a dashboard
    navigate("/");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Novo Projeto</h1>
      </div>

      <NewProjectForm onSubmit={handleSubmit} />
    </div>
  );
};

export default NewProject; 