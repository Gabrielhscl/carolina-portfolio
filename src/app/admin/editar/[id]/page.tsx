import { supabase } from "@/lib/supabase";
import { Experiencia } from "@/types";
import { notFound } from "next/navigation";
import { EditarForm } from "./EditarForm";

export const instant = false;

// Next.js 16 passa params como Promise
export default async function EditarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: experiencia } = await supabase
    .from("experiencias")
    .select("*")
    .eq("id", id)
    .single();

  if (!experiencia) notFound();

  return <EditarForm experiencia={experiencia as Experiencia} />;
}