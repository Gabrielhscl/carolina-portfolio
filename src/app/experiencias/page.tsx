import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { Experiencia } from "@/types";
import { ExperienciasClient } from "./ExperienciasClient";

export const instant = false;

export const metadata = {
  title: "Histórico Completo | Carolina de Lemos",
  description: "Todos os trabalhos e experiências profissionais registrados.",
};

export default async function ExperienciasPage() {
  const { data, error } = await supabase
    .from("experiencias")
    .select("*")
    .order("data_inicio", { ascending: false });

  if (error) console.error("Erro ao buscar experiências:", error);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-zinc-500 font-bold">Carregando histórico...</div>}>
      <ExperienciasClient experiencias={(data as Experiencia[]) || []} />
    </Suspense>
  );
}