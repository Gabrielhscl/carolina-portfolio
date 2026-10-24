import { supabase } from "@/lib/supabase";
import { Experiencia, Perfil, Depoimento } from "@/types";
import { DashboardClient } from "./DashboardClient";

export const instant = false;

export default async function AdminDashboard() {
  const { data: experiencias } = await supabase
    .from("experiencias")
    .select("*")
    .order("data_inicio", { ascending: false });
  const { data: perfil } = await supabase.from("perfil").select("*").single();
  const { data: depoimentos } = await supabase
    .from("depoimentos")
    .select("*")
    .order("created_at", { ascending: false });

  const perfilSeguro: Perfil = (perfil as Perfil) || {
    id: 1,
    foto_url: "/carolina.jpg",
    titulo_hero: "Inclusão...",
    descricao_hero: "...",
    sobre_titulo: "Minha História",
    sobre_subtitulo: "...",
    sobre_texto_1: "...",
    sobre_texto_2: "...",
    sobre_texto_3: "...",
    sobre_texto_4: "...",
    formacao: [],
    mostrar_instagram: true,
    updated_at: new Date().toISOString(),
  };

  return (
    <DashboardClient
      experiencias={(experiencias as Experiencia[]) || []}
      perfil={perfilSeguro}
      depoimentos={(depoimentos as Depoimento[]) || []}
    />
  );
}
