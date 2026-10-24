"use client";

import { useState } from "react";
import Link from "next/link";
import { Experiencia } from "@/types";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { ModalTrabalho } from "./ModalTrabalho";

interface TimelineProps {
  experiencias: Experiencia[];
  limit?: number;
  totalCount?: number;
}

export function Timeline({ experiencias, limit, totalCount }: TimelineProps) {
  const [modalAberto, setModalAberto] = useState<Experiencia | null>(null);

  const exibidas = limit ? experiencias.slice(0, limit) : experiencias;
  const temMais = limit && totalCount && totalCount > exibidas.length;

  const formatarData = (data: string) => {
    return format(parseISO(data), "MMM yyyy", { locale: ptBR }).replace(".", "").toUpperCase();
  };

  if (exibidas.length === 0) {
    return (
      <p className="text-center text-lg text-zinc-500 py-12">
        Nenhuma experiência cadastrada ainda.
      </p>
    );
  }

  return (
    <>
      <section aria-label="Linha do tempo de experiências" className="w-full space-y-4">
        {exibidas.map((exp, index) => {
          // Procura o primeiro anexo que seja uma imagem (ignora PDFs)
          const primeiraImagem = exp.anexos?.find((anexo) =>
            !anexo.url.toLowerCase().endsWith(".pdf")
          );

          return (
            <motion.button
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setModalAberto(exp)}
              className="w-full group relative overflow-hidden rounded-xl bg-zinc-900 text-left transition-all duration-500 hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-purple-500"
              aria-label={`Ver detalhes do trabalho: ${exp.titulo}`}
            >
              {/* Imagem de fundo (se houver) */}
              {primeiraImagem ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={primeiraImagem.url}
                    alt={primeiraImagem.alt}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" aria-hidden="true" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-zinc-800" aria-hidden="true" />
              )}

              {/* Conteúdo do Banner */}
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-white/70 uppercase tracking-widest">
                      {formatarData(exp.data_inicio)}
                    </span>
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-widest border border-purple-300/30 px-2 py-0.5 rounded">
                      {exp.categoria}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                    {exp.titulo}
                  </h3>
                  <p className="text-white/80 font-medium text-sm md:text-base mt-2">
                    {exp.instituicao}
                  </p>
                </div>

                <div className="flex-shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 group-hover:bg-purple-600 group-hover:border-purple-500 transition-colors">
                  <ArrowUpRight size={28} className="text-white" aria-hidden="true" />
                </div>
              </div>
            </motion.button>
          );
        })}

        {temMais && (
          <div className="pt-8 text-center">
            <Link
              href="/experiencias"
              className="inline-flex items-center gap-2 border-b-2 border-zinc-950 text-zinc-950 font-bold text-xl uppercase tracking-widest pb-2 hover:text-purple-700 hover:border-purple-700 transition-colors focus:outline-none"
            >
              Ver Histórico Completo ({totalCount})
              <ArrowRight size={24} aria-hidden="true" />
            </Link>
          </div>
        )}
      </section>

      {modalAberto && (
        <ModalTrabalho
          experiencia={modalAberto}
          onClose={() => setModalAberto(null)}
        />
      )}
    </>
  );
}