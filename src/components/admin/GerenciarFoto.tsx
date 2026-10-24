"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Camera, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function GerenciarFoto({ fotoAtual }: { fotoAtual: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `perfil-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("certificados")
        .upload(fileName, file);

      if (uploadError) throw new Error("Erro no upload da imagem.");

      const { data: { publicUrl } } = supabase.storage
        .from("certificados")
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("perfil")
        .update({ foto_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", 1);

      if (updateError) throw new Error("Erro ao atualizar o banco de dados.");

      setSuccess(true);
      router.refresh();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 h-full">
      
      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-purple-50 shadow-inner flex-shrink-0 bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fotoAtual} alt="Foto de perfil atual" className="w-full h-full object-cover" />
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="animate-spin text-white" size={24} />
          </div>
        )}
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-lg font-bold text-slate-900">Foto de Perfil do Site</h3>
        <p className="text-sm text-gray-500 mb-4">Imagem exibida na Home e na página Sobre.</p>
        
        {error && (
          <p role="alert" className="text-sm text-red-600 flex items-center justify-center sm:justify-start gap-1 mb-3">
            <AlertCircle size={14} /> {error}
          </p>
        )}
        {success && (
          <p role="alert" className="text-sm text-green-600 flex items-center justify-center sm:justify-start gap-1 mb-3">
            <CheckCircle2 size={14} /> Foto atualizada com sucesso!
          </p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleUpload}
          aria-label="Selecionar nova foto de perfil"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 font-bold py-2.5 px-5 rounded-xl hover:bg-purple-200 transition-colors focus:ring-4 focus:ring-purple-300 outline-none disabled:opacity-50"
        >
          <Camera size={18} aria-hidden="true" />
          {loading ? "Enviando..." : "Alterar Foto"}
        </button>
      </div>
    </div>
  );
}