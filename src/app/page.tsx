import { supabase } from "@/lib/supabase";
import { Experiencia } from "@/types";
import { Timeline } from "@/components/Timeline";
import { Download } from "lucide-react";

export const instant = false;

// A palavra "async" aqui permite buscar dados no servidor antes da página renderizar.
export default async function Home() {
  
  // Busca os dados no Supabase, ordenando pela data de início (do mais recente para o mais antigo)
  const { data: experiencias, error } = await supabase
    .from("experiencias")
    .select("*")
    .order("data_inicio", { ascending: false });

  if (error) {
    console.error("Erro ao buscar experiências:", error);
  }

  return (
    <div className="w-full">
      {/* SEÇÃO HERO - A primeira coisa que o visitante vê */}
      <section className="text-center max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-900 mb-6 tracking-tight">
          Carolina de Lemos
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
          Consultora em Audiodescrição, Maquiadora e Palestrante. 
          Mulher com deficiência visual total, transformando desafios em oportunidades 
          e promovendo a inclusão através da arte e da cultura.
        </p>

        {/* Botão de Download do PDF */}
        <a
          href="/api/gerar-pdf"
          className="inline-flex items-center justify-center gap-2 bg-purple-700 text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg hover:bg-purple-800 transition-colors focus:outline-none focus:ring-4 focus:ring-purple-300"
          aria-label="Baixar currículo completo em formato PDF"
        >
          <Download size={24} aria-hidden="true" />
          Baixar Currículo em PDF
        </a>
      </section>

      {/* SEÇÃO DA LINHA DO TEMPO */}
      <section className="mt-12 px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-purple-900 border-b-4 border-purple-300 inline-block pb-2">
            Experiências e Comprovações
          </h2>
        </div>
        
        {/* Passa os dados buscados do banco para o componente Timeline */}
        <Timeline experiencias={experiencias as Experiencia[] || []} />
      </section>
    </div>
  );
}