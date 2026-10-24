"use client";

import { useEffect, useRef, useState } from "react";
import {
  X, FileText, Image as ImageIcon,
  Calendar, Building2, Award, ExternalLink, Inbox, ZoomIn, ChevronLeft, ChevronRight, Share2, Check
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Experiencia } from "@/types";

interface ModalTrabalhoProps {
  experiencia: Experiencia;
  onClose: () => void;
}

type Anexo = { url: string; alt: string };

export function ModalTrabalho({ experiencia, onClose }: ModalTrabalhoProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [copiado, setCopiado] = useState(false);

  // Separa os arquivos
  const files = experiencia.anexos || [];
  const fotos = files.filter((f) => !f.url.toLowerCase().endsWith(".pdf"));
  const documentos = files.filter((f) => f.url.toLowerCase().endsWith(".pdf"));

  const [abaAtiva, setAbaAtiva] = useState<"fotos" | "documentos">(
    fotos.length > 0 ? "fotos" : "documentos"
  );

  const [fotoAberta, setFotoAberta] = useState<Anexo | null>(null);

  // Função para copiar o link específico
  async function handleCopyLink() {
    const url = `${window.location.origin}/experiencias?id=${experiencia.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      alert("Não foi possível copiar o link.");
    }
  }

  useEffect(() => {
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (fotoAberta) setFotoAberta(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, fotoAberta]);

  const temArquivos = fotos.length > 0 || documentos.length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-modal-trabalho"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden border border-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-start p-6 md:p-8 border-b border-zinc-200 flex-shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <h2
              id="titulo-modal-trabalho"
              className="text-2xl md:text-4xl font-black text-zinc-950 mb-2 uppercase tracking-tighter leading-none"
            >
              {experiencia.titulo}
            </h2>
            <p className="text-sm md:text-base font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Building2 size={14} aria-hidden="true" className="flex-shrink-0" />
              <span className="truncate">{experiencia.instituicao}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* BOTÃO COMPARTILHAR */}
            <button
              onClick={handleCopyLink}
              className={`p-2 rounded-full transition-colors flex-shrink-0 focus:ring-2 outline-none ${
                copiado ? "bg-green-100 text-green-700 focus:ring-green-500" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 focus:ring-zinc-950"
              }`}
              aria-label={copiado ? "Link copiado!" : "Copiar link deste trabalho"}
            >
              {copiado ? <Check size={24} strokeWidth={2.5} /> : <Share2 size={24} strokeWidth={2.5} />}
            </button>

            {/* BOTÃO FECHAR */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 text-zinc-800 focus:ring-2 focus:ring-zinc-950 outline-none transition-colors flex-shrink-0"
              aria-label="Fechar"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* INFO COMPACTA */}
        <div className="px-6 md:px-8 py-4 bg-zinc-50 border-b border-zinc-200 flex flex-wrap gap-x-8 gap-y-2 text-xs md:text-sm font-bold uppercase tracking-wider flex-shrink-0 text-zinc-700">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-purple-600" aria-hidden="true" />
            {format(parseISO(experiencia.data_inicio), "MMMM 'de' yyyy", { locale: ptBR })}
          </span>
          <span className="flex items-center gap-1.5">
            <Award size={14} className="text-purple-600" aria-hidden="true" />
            {experiencia.categoria}
          </span>
          <span className="flex items-center gap-1.5">
            <FileText size={14} className="text-purple-600" aria-hidden="true" />
            {experiencia.tipo}
          </span>
        </div>

        {/* DESCRIÇÃO */}
        {experiencia.descricao && (
          <div className="px-6 md:px-8 py-5 border-b border-zinc-200 flex-shrink-0 max-h-40 overflow-y-auto">
            <p className="text-base text-zinc-800 leading-relaxed font-medium">
              {experiencia.descricao}
            </p>
          </div>
        )}

        {/* ABAS */}
        {temArquivos && (
          <div className="px-6 md:px-8 mt-2 flex-shrink-0">
            <div className="flex gap-6 border-b border-zinc-200" role="tablist">
              {fotos.length > 0 && (
                <button
                  role="tab"
                  aria-selected={abaAtiva === "fotos"}
                  onClick={() => setAbaAtiva("fotos")}
                  className={`flex items-center gap-2 pb-3 font-black uppercase tracking-wider text-sm transition-all border-b-2 -mb-px ${
                    abaAtiva === "fotos" ? "text-zinc-950 border-zinc-950" : "text-zinc-400 border-transparent hover:text-zinc-600"
                  }`}
                >
                  <ImageIcon size={16} aria-hidden="true" />
                  Fotos
                  <span className="bg-zinc-100 text-zinc-600 text-xs px-2 py-0.5 rounded-full">{fotos.length}</span>
                </button>
              )}
              {documentos.length > 0 && (
                <button
                  role="tab"
                  aria-selected={abaAtiva === "documentos"}
                  onClick={() => setAbaAtiva("documentos")}
                  className={`flex items-center gap-2 pb-3 font-black uppercase tracking-wider text-sm transition-all border-b-2 -mb-px ${
                    abaAtiva === "documentos" ? "text-zinc-950 border-zinc-950" : "text-zinc-400 border-transparent hover:text-zinc-600"
                  }`}
                >
                  <FileText size={16} aria-hidden="true" />
                  Documentos
                  <span className="bg-zinc-100 text-zinc-600 text-xs px-2 py-0.5 rounded-full">{documentos.length}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-zinc-50/50">
          {!temArquivos ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-center">
              <Inbox size={48} strokeWidth={1} className="mb-3" aria-hidden="true" />
              <p className="text-lg font-bold uppercase tracking-widest">Nenhum arquivo anexado</p>
            </div>
          ) : abaAtiva === "fotos" ? (
            <GaleriaFotos fotos={fotos} onAmpliar={setFotoAberta} />
          ) : (
            <DocumentosLista documentos={documentos} />
          )}
        </div>
      </div>

      {/* LIGHTBOX */}
      {fotoAberta && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/95 animate-in fade-in duration-200"
          onClick={() => setFotoAberta(null)}
        >
          <button
            onClick={() => setFotoAberta(null)}
            className="absolute top-6 right-6 p-3 bg-white text-zinc-950 rounded-full hover:bg-zinc-200 transition-colors focus:ring-4 focus:ring-zinc-500 outline-none"
            aria-label="Fechar foto ampliada"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fotoAberta.url}
            alt={fotoAberta.alt}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

/* ====== GALERIA ====== */
function GaleriaFotos({ fotos, onAmpliar }: { fotos: Anexo[]; onAmpliar: (foto: Anexo) => void }) {
  const [indexAtivo, setIndexAtivo] = useState(0);
  const fotoAtual = fotos[indexAtivo];

  function next() { setIndexAtivo((i) => (i + 1) % fotos.length); }
  function prev() { setIndexAtivo((i) => (i - 1 + fotos.length) % fotos.length); }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative bg-zinc-200 rounded-lg overflow-hidden mb-4 group border border-zinc-300">
        <div className="aspect-[4/3] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fotoAtual.url} alt={fotoAtual.alt} className="w-full h-full object-contain" />
        </div>

        <button
          onClick={() => onAmpliar(fotoAtual)}
          className="absolute top-4 right-4 p-3 bg-white text-zinc-950 rounded-full shadow-lg hover:scale-110 transition-transform focus:ring-2 focus:ring-zinc-950 outline-none"
          aria-label={`Ampliar foto: ${fotoAtual.alt || 'Sem descrição'}`}
        >
          <ZoomIn size={20} strokeWidth={2.5} />
        </button>

        {fotos.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur text-zinc-950 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 focus:ring-2 focus:ring-zinc-950 outline-none" aria-label="Foto anterior">
              <ChevronLeft size={24} strokeWidth={3} />
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur text-zinc-950 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 focus:ring-2 focus:ring-zinc-950 outline-none" aria-label="Próxima foto">
              <ChevronRight size={24} strokeWidth={3} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-950/80 backdrop-blur text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-widest">
              {indexAtivo + 1} / {fotos.length}
            </div>
          </>
        )}
      </div>

      {fotos.length > 1 && (
        <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
          {fotos.map((foto, i) => (
            <button
              key={i}
              onClick={() => setIndexAtivo(i)}
              aria-label={`Ver foto ${i + 1}: ${foto.alt || 'Sem descrição'}`}
              aria-current={i === indexAtivo ? "true" : undefined}
              className={`relative aspect-square overflow-hidden border-2 transition-all focus:ring-2 focus:ring-zinc-950 outline-none ${
                i === indexAtivo ? "border-zinc-950 scale-105" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ====== DOCUMENTOS ====== */
function DocumentosLista({ documentos }: { documentos: Anexo[] }) {
  return (
    <div className="max-w-3xl mx-auto">
      <ul className="space-y-3">
        {documentos.map((doc, i) => {
          const nomeArquivo = doc.url.split("/").pop() || `Documento ${i + 1}.pdf`;
          const titulo = doc.alt || nomeArquivo; 
          
          return (
            <li key={i} className="flex items-center gap-4 p-4 bg-white border border-zinc-200 hover:border-zinc-950 transition-colors rounded-lg group">
              <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center flex-shrink-0 rounded">
                <FileText className="text-zinc-950" size={24} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-zinc-950 truncate uppercase tracking-tight" title={titulo}>{titulo}</p>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-1">Documento PDF</p>
              </div>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-zinc-950 hover:bg-purple-700 px-4 py-2.5 rounded-full transition-colors focus:ring-2 focus:ring-zinc-950 outline-none flex-shrink-0"
                aria-label={`Abrir ${titulo} em nova aba`}
              >
                <ExternalLink size={16} aria-hidden="true" /> Abrir
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}