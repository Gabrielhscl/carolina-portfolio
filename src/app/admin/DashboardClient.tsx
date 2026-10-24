"use client";

import { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  PlusCircle, FileText, Pencil, Search, Calendar,
  Building2, Award, Sparkles, FolderOpen, LayoutGrid, List, 
  Settings, Briefcase, MessageSquare
} from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import { DeleteButton } from "@/components/DeleteButton";
import { GerenciarFoto } from "@/components/admin/GerenciarFoto";
import { GerenciarTextos } from "@/components/admin/GerenciarTextos";
import { GerenciarSobre } from "@/components/admin/GerenciarSobre";
import { GerenciarDepoimentos } from "@/components/admin/GerenciarDepoimentos";
import { Experiencia, Perfil, Depoimento } from "@/types";

export function DashboardClient({ 
  experiencias, 
  perfil, 
  depoimentos 
}: { 
  experiencias: Experiencia[]; 
  perfil: Perfil; 
  depoimentos: Depoimento[]; 
}) {
  // Controle da Aba Ativa
  const [abaAtiva, setAbaAtiva] = useState<"experiencias" | "personalizacao" | "depoimentos">("experiencias");

  // Estados dos Filtros
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [visualizacao, setVisualizacao] = useState<"grid" | "lista">("grid");

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
      const matchCategoria = categoriaFiltro === "todas" || exp.categoria === categoriaFiltro;
      return matchBusca && matchCategoria;
    });
  }, [experiencias, busca, categoriaFiltro]);

  const stats = useMemo(() => {
    const totalArquivos = experiencias.reduce(
      (acc, exp) => acc + (exp.anexos?.length || 0),
      0
    );
    const categoriasUnicas = new Set(experiencias.map((e) => e.categoria)).size;
    return { total: experiencias.length, arquivos: totalArquivos, categorias: categoriasUnicas };
  }, [experiencias]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/60 via-slate-50 to-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-purple-950 mb-1">
              Painel de Controle
            </h1>
            <p className="text-gray-600">
              Gerencie seu portfólio, textos e depoimentos.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <LogoutButton />
          </div>
        </div>

        {/* MENU DE ABAS */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto" role="tablist">
          <button
            role="tab"
            aria-selected={abaAtiva === "experiencias"}
            onClick={() => setAbaAtiva("experiencias")}
            className={`flex items-center gap-2 py-4 px-6 font-bold text-lg border-b-4 transition-all whitespace-nowrap ${
              abaAtiva === "experiencias"
                ? "border-purple-600 text-purple-800"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Briefcase size={20} />
            Trabalhos
          </button>
          <button
            role="tab"
            aria-selected={abaAtiva === "personalizacao"}
            onClick={() => setAbaAtiva("personalizacao")}
            className={`flex items-center gap-2 py-4 px-6 font-bold text-lg border-b-4 transition-all whitespace-nowrap ${
              abaAtiva === "personalizacao"
                ? "border-purple-600 text-purple-800"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Settings size={20} />
            Textos e Fotos
          </button>
          <button
            role="tab"
            aria-selected={abaAtiva === "depoimentos"}
            onClick={() => setAbaAtiva("depoimentos")}
            className={`flex items-center gap-2 py-4 px-6 font-bold text-lg border-b-4 transition-all whitespace-nowrap ${
              abaAtiva === "depoimentos"
                ? "border-purple-600 text-purple-800"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <MessageSquare size={20} />
            Depoimentos & Redes
          </button>
        </div>

        {/* CONTEÚDO DA ABA: EXPERIÊNCIAS */}
        {abaAtiva === "experiencias" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <Sparkles className="opacity-80" size={24} aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">Total</span>
                </div>
                <p className="text-4xl font-extrabold">{stats.total}</p>
                <p className="text-sm text-purple-100 mt-1">{stats.total === 1 ? "Trabalho cadastrado" : "Trabalhos cadastrados"}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-purple-50 p-2 rounded-lg"><FileText className="text-purple-600" size={20} aria-hidden="true" /></div>
                </div>
                <p className="text-4xl font-extrabold text-purple-950">{stats.arquivos}</p>
                <p className="text-sm text-gray-600 mt-1">{stats.arquivos === 1 ? "Arquivo anexado" : "Arquivos anexados"}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-purple-50 p-2 rounded-lg"><Award className="text-purple-600" size={20} aria-hidden="true" /></div>
                </div>
                <p className="text-4xl font-extrabold text-purple-950">{stats.categorias}</p>
                <p className="text-sm text-gray-600 mt-1">{stats.categorias === 1 ? "Categoria ativa" : "Categorias ativas"}</p>
              </div>
            </div>

            {/* Barra de Ações e Filtros */}
            <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">
              
              <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto flex-1">
                <div className="relative flex-1 md:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Buscar por título..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-slate-900 placeholder:text-gray-400 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none"
                    aria-label="Buscar trabalhos"
                  />
                </div>
                <select
                  value={categoriaFiltro}
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-slate-900 bg-white focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none"
                  aria-label="Filtrar por categoria"
                >
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>{cat === "todas" ? "Todas as categorias" : cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setVisualizacao("grid")}
                    className={`p-2 rounded-lg transition-all ${visualizacao === "grid" ? "bg-white shadow text-purple-700" : "text-gray-500 hover:text-gray-700"}`}
                    aria-label="Visualizar em grade"
                  >
                    <LayoutGrid size={20} />
                  </button>
                  <button
                    onClick={() => setVisualizacao("lista")}
                    className={`p-2 rounded-lg transition-all ${visualizacao === "lista" ? "bg-white shadow text-purple-700" : "text-gray-500 hover:text-gray-700"}`}
                    aria-label="Visualizar em lista"
                  >
                    <List size={20} />
                  </button>
                </div>
                
                <Link
                  href="/admin/novo"
                  className="inline-flex items-center gap-2 bg-purple-700 text-white font-bold py-2.5 px-5 rounded-xl hover:bg-purple-800 transition-all hover:shadow-lg focus:ring-4 focus:ring-purple-300 outline-none"
                >
                  <PlusCircle size={20} aria-hidden="true" />
                  Adicionar Novo
                </Link>
              </div>
            </div>

            {/* Resultados */}
            {filtradas.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-purple-200 p-12 text-center">
                <FolderOpen className="mx-auto text-purple-400 mb-4" size={48} aria-hidden="true" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {experiencias.length === 0 ? "Nenhum trabalho cadastrado ainda" : "Nenhum resultado encontrado"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {experiencias.length === 0 ? "Comece adicionando seu primeiro trabalho ao portfólio." : "Tente ajustar os filtros ou buscar por outro termo."}
                </p>
              </div>
            ) : visualizacao === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtradas.map((exp) => <CardExperiencia key={exp.id} exp={exp} />)}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm">
                <ul className="divide-y divide-gray-100">
                  {filtradas.map((exp) => <LinhaExperiencia key={exp.id} exp={exp} />)}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* CONTEÚDO DA ABA: PERSONALIZAÇÃO */}
        {abaAtiva === "personalizacao" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GerenciarFoto fotoAtual={perfil.foto_url} />
              <GerenciarTextos perfil={perfil} />
            </div>
            <div className="max-w-4xl">
              <GerenciarSobre perfil={perfil} />
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA: DEPOIMENTOS */}
        {abaAtiva === "depoimentos" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl">
            <GerenciarDepoimentos depoimentos={depoimentos} perfil={perfil} />
          </div>
        )}

      </div>
    </div>
  );
}

/* ====== CARD DE EXPERIÊNCIA ====== */
function CardExperiencia({ exp }: { exp: Experiencia }) {
  const primeiraImagem = exp.anexos?.find((anexo) => !anexo.url.toLowerCase().endsWith(".pdf"));

  return (
    <article className="group bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all overflow-hidden flex flex-col">
      <div className="h-40 bg-gradient-to-br from-purple-50 to-purple-100 relative overflow-hidden">
        {primeiraImagem ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={primeiraImagem.url} alt={primeiraImagem.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><FileText className="text-purple-300" size={48} /></div>
        )}
        <span className="absolute top-3 left-3 text-xs font-bold uppercase bg-white/90 backdrop-blur text-purple-800 px-2.5 py-1 rounded-full">{exp.categoria}</span>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-slate-900 mb-1 line-clamp-2" title={exp.titulo}>{exp.titulo}</h3>
        <p className="text-sm text-gray-600 mb-3 flex items-center gap-1.5 line-clamp-1">
          <Building2 size={14} className="text-gray-400 flex-shrink-0" aria-hidden="true" /> {exp.instituicao}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1"><Calendar size={14} />{format(parseISO(exp.data_inicio), "MMM 'de' yyyy", { locale: ptBR })}</span>
          {exp.anexos && exp.anexos.length > 0 && (
            <span className="flex items-center gap-1 font-bold text-purple-700"><FileText size={14} />{exp.anexos.length} anexo{exp.anexos.length > 1 ? "s" : ""}</span>
          )}
        </div>

        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
          <Link href={`/admin/editar/${exp.id}`} className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-bold text-purple-700 hover:bg-purple-50 py-2 rounded-lg transition-colors" aria-label={`Editar ${exp.titulo}`}>
            <Pencil size={16} /> Editar
          </Link>
          <DeleteButton id={exp.id} titulo={exp.titulo} certificadoUrls={exp.anexos?.map(a => a.url) || []} variant="full" />
        </div>
      </div>
    </article>
  );
}

/* ====== LINHA DE EXPERIÊNCIA ====== */
function LinhaExperiencia({ exp }: { exp: Experiencia }) {
  return (
    <li className="p-4 hover:bg-purple-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0"><FileText className="text-purple-600" size={22} /></div>
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 truncate">{exp.titulo}</h3>
          <p className="text-sm text-gray-600 truncate">{exp.instituicao} • {format(parseISO(exp.data_inicio), "MMM 'de' yyyy", { locale: ptBR })}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs font-bold uppercase tracking-wide bg-purple-100 text-purple-800 px-3 py-1 rounded-full">{exp.categoria}</span>
        <Link href={`/admin/editar/${exp.id}`} className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors" aria-label={`Editar ${exp.titulo}`}><Pencil size={18} /></Link>
        <DeleteButton id={exp.id} titulo={exp.titulo} certificadoUrls={exp.anexos?.map(a => a.url) || []} />
      </div>
    </li>
  );
}