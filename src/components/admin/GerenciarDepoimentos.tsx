"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Depoimento, Perfil } from "@/types";
import { Plus, Trash2, Quote, Camera, Save } from "lucide-react";

export function GerenciarDepoimentos({ depoimentos, perfil }: { depoimentos: Depoimento[], perfil: Perfil }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mostrarInsta, setMostrarInsta] = useState(perfil.mostrar_instagram ?? true);
  
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [texto, setTexto] = useState("");

  async function adicionarDepoimento(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("depoimentos").insert([{ nome, cargo, texto }]);
    if (error) alert("Erro ao adicionar.");
    else {
      setNome(""); setCargo(""); setTexto("");
      router.refresh();
    }
    setLoading(false);
  }

  async function removerDepoimento(id: string) {
    if (!confirm("Tem certeza que deseja excluir este depoimento?")) return;
    await supabase.from("depoimentos").delete().eq("id", id);
    router.refresh();
  }

  async function toggleInstagram() {
    const novoValor = !mostrarInsta;
    setMostrarInsta(novoValor);
    await supabase.from("perfil").update({ mostrar_instagram: novoValor }).eq("id", 1);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      
      {/* TOGGLE INSTAGRAM */}
      <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-xl text-white">
            <Camera size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Feed do Instagram na Home</h3>
            <p className="text-sm text-gray-500">Exibe um convite para seguir seu perfil no site.</p>
          </div>
        </div>
        <button
          onClick={toggleInstagram}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${mostrarInsta ? 'bg-purple-600' : 'bg-gray-300'}`}
          role="switch"
          aria-checked={mostrarInsta}
        >
          <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${mostrarInsta ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* ADICIONAR DEPOIMENTO */}
      <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Quote size={20} className="text-purple-600" /> Adicionar Novo Depoimento
        </h3>
        
        <form onSubmit={adicionarDepoimento} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text" placeholder="Nome da pessoa" value={nome} onChange={e => setNome(e.target.value)} required
              className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 focus:ring-4 focus:ring-purple-200 outline-none"
            />
            <input
              type="text" placeholder="Cargo / Profissão (Opcional)" value={cargo} onChange={e => setCargo(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 focus:ring-4 focus:ring-purple-200 outline-none"
            />
          </div>
          <textarea
            placeholder="O que a pessoa disse sobre seu trabalho..." value={texto} onChange={e => setTexto(e.target.value)} required rows={3}
            className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 focus:ring-4 focus:ring-purple-200 outline-none resize-y"
          />
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-purple-700 text-white font-bold py-2 px-6 rounded-xl hover:bg-purple-800 transition-colors">
            <Plus size={18} /> Adicionar Depoimento
          </button>
        </form>
      </div>

      {/* LISTA DE DEPOIMENTOS */}
      <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Depoimentos Cadastrados ({depoimentos.length})</h3>
        {depoimentos.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum depoimento cadastrado ainda.</p>
        ) : (
          <ul className="space-y-3">
            {depoimentos.map(dep => (
              <li key={dep.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <Quote className="text-purple-300 flex-shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-slate-800 italic text-sm mb-2">"{dep.texto}"</p>
                  <p className="text-xs font-bold text-slate-900">{dep.nome} {dep.cargo && <span className="text-gray-500 font-normal">— {dep.cargo}</span>}</p>
                </div>
                <button onClick={() => removerDepoimento(dep.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}