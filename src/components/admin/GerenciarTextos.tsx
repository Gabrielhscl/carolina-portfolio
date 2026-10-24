"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Perfil } from "@/types";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";

export function GerenciarTextos({ perfil }: { perfil: Perfil }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [titulo, setTitulo] = useState(perfil.titulo_hero || "");
  const [descricao, setDescricao] = useState(perfil.descricao_hero || "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error: updateError } = await supabase
      .from("perfil")
      .update({
        titulo_hero: titulo,
        descricao_hero: descricao,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (updateError) {
      setError("Erro ao salvar os textos. Tente novamente.");
      setLoading(false);
    } else {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">Textos da Página Inicial</h3>
        <p className="text-sm text-gray-500">Altere o título e a descrição que aparecem no topo do site.</p>
      </div>

      {error && (
        <div role="alert" className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm font-medium">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {success && (
        <div role="alert" className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 size={16} /> Textos atualizados com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="titulo" className="block text-sm font-bold text-gray-700 mb-1">
            Título Principal (Destaque)
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none"
            placeholder="Ex: Inclusão, Beleza e Acessibilidade."
            required
          />
        </div>

        <div>
          <label htmlFor="descricao" className="block text-sm font-bold text-gray-700 mb-1">
            Descrição / Subtítulo
          </label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none resize-y"
            placeholder="Ex: Consultora em Audiodescrição, Maquiadora e Palestrante..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-purple-800 transition-colors focus:ring-4 focus:ring-purple-300 outline-none disabled:opacity-50"
        >
          <Save size={18} aria-hidden="true" />
          {loading ? "Salvando..." : "Salvar Textos"}
        </button>
      </form>
    </div>
  );
}