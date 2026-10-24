"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft, Search, FolderOpen, Building2,
  ChevronDown, Calendar, ArrowRight, FileText
} from "lucide-react";
import { Experiencia } from "@/types";
import { ModalTrabalho } from "@/components/ModalTrabalho";

export function ExperienciasClient({ experiencias }: { experiencias: Experiencia[] }) {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");

  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [modalAberto, setModalAberto] = useState<Experiencia | null>(null);
  const [anosExpandidos, setAnosExpandidos] = useState<Record<string, boolean>>({});

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

  const agrupadasPorAno = useMemo(() => {
    const grupos: Record<string, Experiencia[]> = {};
    filtradas.forEach((exp) => {
      const ano = exp.data_inicio.substring(0, 4);
      if (!grupos[ano]) grupos[ano] = [];
      grupos[ano].push(exp);
    });
    return Object.entries(grupos).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtradas]);

  const filtroKey = `${busca}|${categoria}`;

  useEffect(() => {
    if (agrupadasPorAno.length > 0) {
      setAnosExpandidos({ [agrupadasPorAno[0][0]]: true });
    } else {
      setAnosExpandidos({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroKey]);

  function toggleAno(ano: string) {
    setAnosExpandidos((prev) => ({ ...prev, [ano]: !prev[ano] }));
  }

  function expandirTodos() {
    const todos: Record<string, boolean> = {};
    agrupadasPorAno.forEach(([ano]) => (todos[ano] = true));
    setAnosExpandidos(todos);
  }

  function recolherTodos() {
    setAnosExpandidos({});
  }

  return (
    <div className="min-h-screen bg-[#f4f4f5] pb-20">
      <div className="container mx-auto px-4 max-w-4xl pt-10">
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 font-bold hover:text-zinc-950 mb-6 focus:outline-none focus:underline uppercase tracking-widest text-sm"
          aria-label="Voltar para a página inicial"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar ao início
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-950 mb-3 tracking-tight">
            Histórico Completo
          </h1>
          <p className="text-lg text-gray-600">
            <span className="font-bold text-purple-700">{experiencias.length}</span>{" "}
            {experiencias.length === 1 ? "trabalho registrado" : "trabalhos registrados"}, organizados por ano.
          </p>
        </div>

        {/* FILTROS */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-100 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={20} aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar por título ou instituição..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-purple-100 bg-purple-50/30 rounded-xl text-slate-900 placeholder:text-gray-500 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:bg-white outline-none transition-all"
                aria-label="Buscar trabalhos"
              />
            </div>

            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="px-4 py-3 border border-purple-100 bg-purple-50/30 rounded-xl text-slate-900 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:bg-white outline-none transition-all font-medium"
              aria-label="Filtrar por categoria"
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "todas" ? "Todas as categorias" : cat}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-600 mt-3 px-1" aria-live="polite">
            {filtradas.length === experiencias.length ? (
              <>Mostrando todos os <strong className="text-purple-700">{filtradas.length}</strong> trabalhos</>
            ) : (
              <><strong className="text-purple-700">{filtradas.length}</strong> {filtradas.length === 1 ? "resultado" : "resultados"} de {experiencias.length}</>
            )}
          </p>
        </div>

        {/* BOTÕES EXPANDIR/RECOLHER */}
        {agrupadasPorAno.length > 1 && (
          <div className="flex gap-2 mb-4 justify-end">
            <button onClick={expandirTodos} className="text-xs font-bold text-purple-700 bg-white hover:bg-purple-50 border border-purple-100 px-3 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-purple-500 outline-none shadow-sm">
              Expandir todos
            </button>
            <button onClick={recolherTodos} className="text-xs font-bold text-purple-700 bg-white hover:bg-purple-50 border border-purple-100 px-3 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-purple-500 outline-none shadow-sm">
              Recolher todos
            </button>
          </div>
        )}

        {/* LISTA AGRUPADA POR ANO */}
        {agrupadasPorAno.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-purple-200 p-12 text-center">
            <div className="bg-purple-100 p-6 rounded-full w-fit mx-auto mb-4">
              <FolderOpen className="text-purple-400" size={40} aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou buscar por outro termo.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {agrupadasPorAno.map(([ano, itens]) => {
              const expandido = !!anosExpandidos[ano];
              return (
                <div
                  key={ano}
                  className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${
                    expandido
                      ? "border-purple-300 shadow-[0_8px_30px_-8px_rgba(147,51,234,0.25)]"
                      : "border-purple-100 shadow-sm hover:shadow-md hover:border-purple-200"
                  }`}
                >
                  <button
                    onClick={() => toggleAno(ano)}
                    aria-expanded={expandido}
                    aria-controls={`grupo-ano-${ano}`}
                    className="w-full flex items-center justify-between p-5 hover:bg-purple-50/30 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300 focus-visible:ring-inset"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-fuchsia-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-purple-500/30 flex-shrink-0 group-hover:scale-105 transition-transform">
                        {ano}
                      </div>
                      <div className="text-left">
                        <h2 className="text-xl md:text-2xl font-extrabold text-purple-950 tracking-tight">
                          {ano}
                        </h2>
                        <p className="text-sm text-gray-600 font-medium">
                          {itens.length} {itens.length === 1 ? "trabalho" : "trabalhos"}
                        </p>
                      </div>
                    </div>
                    <div className={`p-2 rounded-full bg-purple-50 text-purple-600 transition-all duration-300 ${expandido ? "rotate-180 bg-purple-100" : ""}`}>
                      <ChevronDown size={22} aria-hidden="true" />
                    </div>
                  </button>

                  {expandido && (
                    <ul
                      id={`grupo-ano-${ano}`}
                      className="divide-y divide-purple-50 border-t border-purple-100 animate-in fade-in slide-in-from-top-2 duration-300"
                    >
                      {itens.map((exp) => (
                        <li key={exp.id}>
                          <ItemCompacto exp={exp} onOpen={() => setModalAberto(exp)} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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

/* ====== ITEM COMPACTO ====== */
function ItemCompacto({ exp, onOpen }: { exp: Experiencia; onOpen: () => void }) {
  const totalAnexos = exp.anexos?.length || 0;
  const primeiraImagem = exp.anexos?.find((anexo) =>
    !anexo.url.toLowerCase().endsWith(".pdf")
  );

  return (
    <button
      onClick={onOpen}
      className="w-full text-left p-4 hover:bg-gradient-to-r hover:from-purple-50/60 hover:to-fuchsia-50/30 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300 focus-visible:ring-inset group"
      aria-label={`Ver detalhes de ${exp.titulo} em ${exp.instituicao}`}
    >
      <div className="flex items-center gap-4">
        
        {primeiraImagem ? (
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-sm ring-1 ring-purple-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primeiraImagem.url}
              alt={primeiraImagem.alt}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-fuchsia-100 flex items-center justify-center flex-shrink-0 shadow-sm">
            <FileText className="text-purple-500" size={22} aria-hidden="true" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-purple-900 transition-colors">
              {exp.titulo}
            </h3>
            <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider bg-gradient-to-r from-purple-100 to-fuchsia-100 px-2 py-0.5 rounded-full">
              {exp.categoria}
            </span>
          </div>

          <p className="text-sm text-gray-600 flex items-center gap-1.5 mb-1">
            <Building2 size={13} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{exp.instituicao}</span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1 flex-shrink-0">
              <Calendar size={13} className="text-gray-400" aria-hidden="true" />
              {format(parseISO(exp.data_inicio), "MMM yyyy", { locale: ptBR }).replace(".", "")}
            </span>
          </p>

          {exp.descricao && (
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-1">
              {exp.descricao}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {totalAnexos > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-md">
              <FileText size={12} aria-hidden="true" />
              {totalAnexos}
            </span>
          )}
          <div className="p-1.5 rounded-full text-purple-400 group-hover:bg-purple-100 group-hover:text-purple-700 transition-all">
            <ArrowRight size={16} aria-hidden="true" />
          </div>
        </div>
      </div>
    </button>
  );
}