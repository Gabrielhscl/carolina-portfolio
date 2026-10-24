"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteButtonProps {
  id: string;
  titulo: string;
  certificadoUrls: string[] | null;
  variant?: "icon" | "full";
}

export function DeleteButton({ id, titulo, certificadoUrls, variant = "icon" }: DeleteButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function getFileNameFromUrl(url: string) {
    return url.split("/").pop() || "";
  }

  async function handleDelete() {
    setLoading(true);
    try {
      if (certificadoUrls && certificadoUrls.length > 0) {
        const fileNames = certificadoUrls.map(getFileNameFromUrl);
        await supabase.storage.from("certificados").remove(fileNames);
      }

      const { error } = await supabase.from("experiencias").delete().eq("id", id);
      if (error) throw error;

      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(`Erro ao excluir: ${err.message}`);
      setLoading(false);
    }
  }

  const trigger =
    variant === "full" ? (
      <button
        onClick={() => setIsOpen(true)}
        className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-bold text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-red-400 outline-none"
        aria-label={`Excluir o trabalho ${titulo}`}
      >
        <Trash2 size={16} aria-hidden="true" />
        Excluir
      </button>
    ) : (
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:ring-2 focus:ring-red-400 outline-none"
        aria-label={`Excluir o trabalho ${titulo}`}
      >
        <Trash2 size={18} aria-hidden="true" />
      </button>
    );

  return (
    <>
      {trigger}

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-confirmacao"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => !loading && setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                <AlertTriangle className="text-red-600" size={24} aria-hidden="true" />
              </div>
              <div>
                <h2 id="titulo-confirmacao" className="text-xl font-bold text-slate-900 mb-1">
                  Excluir Trabalho?
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tem certeza que deseja excluir <strong>"{titulo}"</strong>?
                  Esta ação não pode ser desfeita e os arquivos anexados também serão apagados.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="px-4 py-2 text-gray-700 font-bold rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 outline-none transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-400 outline-none disabled:opacity-70 transition-colors"
              >
                {loading ? "Excluindo..." : "Sim, Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}