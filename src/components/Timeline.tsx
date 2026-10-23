import { Experiencia } from "@/types";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Award, Briefcase } from "lucide-react";

interface TimelineProps {
  experiencias: Experiencia[];
}

export function Timeline({ experiencias }: TimelineProps) {
  // Função simples para formatar a data (ex: "Janeiro de 2025")
  const formatarData = (data: string) => {
    return format(parseISO(data), "MMMM 'de' yyyy", { locale: ptBR });
  };

  if (experiencias.length === 0) {
    return (
      <p className="text-center text-lg text-gray-600 mt-8">
        Nenhuma experiência cadastrada ainda. Acesse a área administrativa para adicionar.
      </p>
    );
  }

  return (
    // A tag <section> ajuda o VoiceOver a identificar uma seção de conteúdo
    <section aria-label="Linha do tempo de experiências profissionais" className="max-w-4xl mx-auto mt-12 space-y-8">
      {experiencias.map((exp, index) => (
        // Cada experiência é um <article>. Isso diz ao leitor de tela: 
        // "Aqui começa um conteúdo independente".
        <article 
          key={exp.id} 
          className="relative pl-8 md:pl-0"
        >
          {/* Linha vertical decorativa (oculta para leitores de tela) */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-purple-200" aria-hidden="true"></div>

          <div className="md:flex md:items-start md:gap-8">
            {/* Data */}
            <div className="md:w-48 md:text-right md:pt-2 flex items-center md:justify-end gap-2 text-purple-700 font-semibold mb-2 md:mb-0">
              <Calendar size={18} aria-hidden="true" />
              {/* A tag <time> é excelente para acessibilidade de datas */}
              <time dateTime={exp.data_inicio}>
                {formatarData(exp.data_inicio)}
              </time>
            </div>

            {/* Conteúdo do Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 flex-1 hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-purple-500">
              <div className="flex items-center gap-2 mb-2">
                {/* Ícone baseado na categoria (opcional) */}
                <Award className="text-purple-600" size={20} aria-hidden="true" />
                <span className="text-sm font-bold text-purple-800 uppercase tracking-wide">
                  {exp.categoria}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {exp.titulo}
              </h3>
              
              <p className="text-gray-600 font-medium mb-3 flex items-center gap-2">
                <Briefcase size={16} aria-hidden="true" />
                {exp.instituicao}
              </p>

              {exp.descricao && (
                <p className="text-gray-700 leading-relaxed text-lg">
                  {exp.descricao}
                </p>
              )}
              
              {/* Botão para ver o certificado (se existir) */}
              {exp.certificado_url && (
                <a 
                  href={exp.certificado_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-purple-700 font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded p-1"
                  aria-label={`Abrir comprovação do trabalho ${exp.titulo} em nova aba`}
                >
                  Ver Comprovação →
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}