"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  ArrowLeft, Search, FolderOpen, LayoutGrid, List, 
  Calendar, Building2, ArrowUpRight, FileText 
} from "lucide-react";
import { motion } from "framer-motion";
import { Experiencia } from "@/types";
import { Timeline } from "@/components/Timeline";
import { ModalTrabalho } from "@/components/ModalTrabalho";

export function ExperienciasClient({ experiencias }: { experiencias: Experiencia[] }) {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");

  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [modalAberto, setModalAberto] = useState<Experiencia | null>(null);
  
  // ALTERADO AQUI: O padrão agora é "lista"
  const [visualizacao, setVisualizacao] = useState<"lista" | "grade">("lista");

  // Lógica para abrir o modal direto se a URL tiver ?id=...
  useEffect(() => {
    if (idParam) {
      const exp = experiencias.find(e => e.id === idParam);
      if (exp) setModalAberto(exp);
    }
  }, [idParam, experiencias]);

  const categorias = useMemo(() => {
    const cats = new Set(experiencias.map((e) => e.categoria));
    return ["todas", ...Array.from(cats).sort()];
  }, [experiencias]);

  const filtradas = useMemo(() => {
    return experiencias.filter((exp) => {
      const termo = busca.toLowerCase();
      const matchBusca =
        exp.titulo.toLowerCase().includes(termo) ||
        exp.instituicao.toLowerCase().includes(termo);
      const matchCategoria = categoria === "todas" || exp.categoria === categoria;
      return matchBusca && matchCategoria;
    });
  }, [experiencias, busca, categoria]);

  return (
    <div className="min-h-screen bg-[#f4f4f5] pb-20">
      
      <div className="container mx-auto px-4 max-w-6xl pt-10">
        
        {/* CABEÇALHO EDITORIAL */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 font-bold hover:text-zinc-950 mb-10 focus:outline-none focus:underline uppercase tracking-widest text-sm"
          aria-label="Voltar para a página inicial"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar ao início
        </Link>

        <div className="border-b-2 border-zinc-950 pb-4 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-zinc-950 uppercase tracking-tighter leading-none mb-4">
              Histórico
            </h1>
            <p className="text-lg text-zinc-600 font-medium">
              <span className="font-bold text-purple-700">{experiencias.length}</span>{" "}
              {experiencias.length === 1 ? "trabalho registrado" : "trabalhos registrados"} em toda a trajetória.
            </p>
          </div>

          {/* BOTÃO DE ALTERNAR VISUALIZAÇÃO */}
          <div className="flex bg-white border border-zinc-200 rounded-xl p-1 shadow-sm flex-shrink-0">
            <button
              onClick={() => setVisualizacao("grade")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                visualizacao === "grade" 
                  ? "bg-zinc-950 text-white shadow-md" 
                  : "text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50"
              }`}
              aria-label="Visualizar em grade"
              aria-pressed={visualizacao === "grade"}
            >
              <LayoutGrid size={18} /> Grade
            </button>
            <button
              onClick={() => setVisualizacao("lista")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                visualizacao === "lista" 
                  ? "bg-zinc-950 text-white shadow-md" 
                  : "text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50"
              }`}
              aria-label="Visualizar em lista (banners)"
              aria-pressed={visualizacao === "lista"}
            >
              <List size={18} /> Lista
            </button>
          </div>
        </div>

        {/* FILTROS */}
        <div className="bg-white rounded-xl p-4 border border-zinc-200 shadow-sm mb-10 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar por título ou instituição..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-zinc-200 rounded-lg text-zinc-950 placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-950 focus:border-zinc-950 outline-none font-medium transition-all"
              aria-label="Buscar trabalhos"
            />
          </div>

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="px-4 py-3 border border-zinc-200 rounded-lg text-zinc-950 bg-white focus:ring-2 focus:ring-zinc-950 focus:border-zinc-950 outline-none font-bold appearance-none cursor-pointer md:w-64"
            aria-label="Filtrar por categoria"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "todas" ? "Todas as categorias" : cat}
              </option>
            ))}
          </select>
        </div>

        {/* CONTADOR DE RESULTADOS */}
        {filtradas.length !== experiencias.length && (
          <p className="text-sm text-zinc-600 mb-6 px-1" aria-live="polite">
            Mostrando <strong className="text-zinc-950">{filtradas.length}</strong> de {experiencias.length} trabalhos.
          </p>
        )}

        {/* LISTA / GRADE */}
        {filtradas.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-zinc-300 p-12 text-center">
            <div className="bg-zinc-100 p-6 rounded-full w-fit mx-auto mb-4">
              <FolderOpen className="text-zinc-400" size={40} aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-zinc-800 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-zinc-600">Tente ajustar os filtros ou buscar por outro termo.</p>
          </div>
        ) : visualizacao === "lista" ? (
          
          /* MODO LISTA (Banners gigantes) */
          <Timeline experiencias={filtradas} />
          
        ) : (
          
          /* MODO GRADE (Cards menores) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtradas.map((exp, index) => {
              const primeiraImagem = exp.anexos?.find((anexo) =>
                !anexo.url.toLowerCase().endsWith(".pdf")
              );

              return (
                <motion.button
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
                  onClick={() => setModalAberto(exp)}
                  className="group relative bg-zinc-900 rounded-2xl overflow-hidden text-left transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-500 flex flex-col h-full"
                  aria-label={`Ver detalhes do trabalho: ${exp.titulo}`}
                >
                  {/* Imagem de capa */}
                  <div className="relative h-48 overflow-hidden bg-zinc-800 flex-shrink-0">
                    {primeiraImagem ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={primeiraImagem.url}
                          alt={primeiraImagem.alt}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                        <FileText className="text-zinc-600" size={48} />
                      </div>
                    )}
                    
                    {/* Badge flutuante de categoria */}
                    <span className="absolute top-3 left-3 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20">
                      {exp.categoria}
                    </span>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-5 flex flex-col flex-1 relative z-10">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-widest mb-2">
                      <Calendar size={12} aria-hidden="true" />
                      {format(parseISO(exp.data_inicio), "MMM yyyy", { locale: ptBR }).replace(".", "")}
                    </div>

                    <h3 className="text-lg font-black text-white uppercase tracking-tight leading-tight mb-2 line-clamp-2">
                      {exp.titulo}
                    </h3>

                    <p className="text-sm text-zinc-400 font-medium mb-4 flex items-center gap-1.5 line-clamp-1 mt-auto">
                      <Building2 size={14} className="flex-shrink-0" aria-hidden="true" />
                      {exp.instituicao}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800 mt-auto">
                      <span className="text-xs font-bold text-zinc-500">
                        {exp.anexos && exp.anexos.length > 0 
                          ? `${exp.anexos.length} anexo${exp.anexos.length > 1 ? "s" : ""}` 
                          : "Sem anexos"}
                      </span>
                      <div className="bg-white/10 p-2 rounded-full group-hover:bg-purple-600 transition-colors">
                        <ArrowUpRight size={18} className="text-white" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* MODAL */}
        {modalAberto && (
          <ModalTrabalho
            experiencia={modalAberto}
            onClose={() => setModalAberto(null)}
          />
        )}
      </div>
    </div>
  );
}