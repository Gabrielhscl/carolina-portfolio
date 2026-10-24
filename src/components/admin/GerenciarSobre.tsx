"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Perfil } from "@/types";
import { Save, CheckCircle2, AlertCircle, Plus, X, GripVertical } from "lucide-react";

export function GerenciarSobre({ perfil }: { perfil: Perfil }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    sobre_titulo: perfil.sobre_titulo || "",
    sobre_subtitulo: perfil.sobre_subtitulo || "",
    sobre_texto_1: perfil.sobre_texto_1 || "",
    sobre_texto_2: perfil.sobre_texto_2 || "",
    sobre_texto_3: perfil.sobre_texto_3 || "",
    sobre_texto_4: perfil.sobre_texto_4 || "",
  });

  // Estado para a lista de formação
  const [formacao, setFormacao] = useState<string[]>(perfil.formacao || []);
  const [novoItem, setNovoItem] = useState("");

  function handleChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  // Adicionar item à lista
  function adicionarItem() {
    if (novoItem.trim() === "") return;
    setFormacao([...formacao, novoItem.trim()]);
    setNovoItem("");
  }

  // Remover item da lista
  function removerItem(index: number) {
    setFormacao(formacao.filter((_, i) => i !== index));
  }

  // Editar item específico da lista
  function editarItem(index: number, value: string) {
    const novaLista = [...formacao];
    novaLista[index] = value;
    setFormacao(novaLista);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error: updateError } = await supabase
      .from("perfil")
      .update({ 
        ...formData, 
        formacao, 
        updated_at: new Date().toISOString() 
      })
      .eq("id", 1);

    if (updateError) {
      setError("Erro ao salvar. Tente novamente.");
      setLoading(false);
    } else {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">Textos da Página "Sobre"</h3>
        <p className="text-sm text-gray-500">Edite o conteúdo que aparece na sua história.</p>
      </div>

      {error && (
        <div role="alert" className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm font-medium">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {success && (
        <div role="alert" className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 size={16} /> Página Sobre atualizada com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SEÇÃO 1: TEXTOS PRINCIPAIS */}
        <div className="space-y-4">
          <div>
            <label htmlFor="sobre_titulo" className="block text-sm font-bold text-gray-700 mb-1">
              Título Principal
            </label>
            <input
              type="text"
              id="sobre_titulo"
              value={formData.sobre_titulo}
              onChange={(e) => handleChange("sobre_titulo", e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 focus:ring-4 focus:ring-purple-200 outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="sobre_subtitulo" className="block text-sm font-bold text-gray-700 mb-1">
              Subtítulo (Destaque em itálico)
            </label>
            <textarea
              id="sobre_subtitulo"
              value={formData.sobre_subtitulo}
              onChange={(e) => handleChange("sobre_subtitulo", e.target.value)}
              rows={2}
              className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 focus:ring-4 focus:ring-purple-200 outline-none"
              required
            />
          </div>

          {[1, 2, 3, 4].map((num) => (
            <div key={num}>
              <label htmlFor={`sobre_texto_${num}`} className="block text-sm font-bold text-gray-700 mb-1">
                Parágrafo {num}
              </label>
              <textarea
                id={`sobre_texto_${num}`}
                value={formData[`sobre_texto_${num}` as keyof typeof formData]}
                onChange={(e) => handleChange(`sobre_texto_${num}` as keyof typeof formData, e.target.value)}
                rows={3}
                className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 focus:ring-4 focus:ring-purple-200 outline-none"
                required
              />
            </div>
          ))}
        </div>

        {/* SEÇÃO 2: FORMAÇÃO E ESPECIALIDADES */}
        <div className="pt-6 border-t border-gray-100">
          <h4 className="text-base font-bold text-slate-900 mb-1">Formação & Especialidades</h4>
          <p className="text-sm text-gray-500 mb-4">Adicione, edite ou remova os itens da lista.</p>

          <ul className="space-y-2 mb-4">
            {formacao.map((item, index) => (
              <li key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                <GripVertical size={16} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  value={item}
                  onChange={(e) => editarItem(index, e.target.value)}
                  className="flex-1 bg-transparent border-none p-1 text-sm font-medium text-slate-900 focus:ring-0 outline-none"
                  aria-label={`Editar item ${index + 1} da formação`}
                />
                <button
                  type="button"
                  onClick={() => removerItem(index)}
                  className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition-colors"
                  aria-label={`Remover item ${item}`}
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex gap-2">
            <input
              type="text"
              value={novoItem}
              onChange={(e) => setNovoItem(e.target.value)}
              placeholder="Ex: Especialista em Audiodescrição"
              className="flex-1 border border-gray-300 p-2.5 text-sm rounded-lg text-slate-900 focus:ring-4 focus:ring-purple-200 outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  adicionarItem();
                }
              }}
            />
            <button
              type="button"
              onClick={adicionarItem}
              className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 font-bold px-4 py-2.5 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Plus size={16} /> Adicionar
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto inline-flex justify-center items-center gap-2 bg-purple-700 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-800 transition-colors focus:ring-4 focus:ring-purple-300 outline-none disabled:opacity-50 mt-4"
        >
          <Save size={18} aria-hidden="true" />
          {loading ? "Salvando..." : "Salvar Toda a Página Sobre"}
        </button>
      </form>
    </div>
  );
}