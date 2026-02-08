import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FoxLogo from "../../assets/images/fox.png";

export const LoggedOutTopBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="px-6 py-4 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={FoxLogo} alt="FinQuest Logo" className="h-8 w-auto" />
        <span className="font-bold text-xl font-heading text-zinc-900 dark:text-zinc-50">FinQuest</span>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate("/login")}>
          Entrar
        </Button>
        <Button onClick={() => navigate("/register")} className="bg-gradient-to-r from-[#007ACC] to-[#28A745] hover:opacity-90 hover:no-underline text-white border-none">
          Criar Conta
        </Button>
      </div>
    </header>
  );
};
