"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { UploadCloud, CheckCircle2, AlertCircle, X, FileText, Image as ImageIcon, Plus } from "lucide-react";
import Link from "next/link";

// Nova estrutura para os arquivos selecionados
type FileWithAlt = {
  file: File;
  alt: string;
};

export default function NovoItem() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [selectedFiles, setSelectedFiles] = useState<FileWithAlt[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map((file) => ({ file, alt: "" }));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function updateAlt(index: number, value: string) {
    setSelectedFiles((prev) => {
      const novos = [...prev];
      novos[index].alt = value;
      return novos;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Valida se todas as imagens têm um alt preenchido
    const temImagemSemAlt = selectedFiles.some(f => f.file.type.startsWith("image/") && !f.alt.trim());
    if (temImagemSemAlt) {
      setError("Por favor, preencha a audiodescrição para todas as imagens.");
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const titulo = formData.get("titulo") as string;
      const instituicao = formData.get("instituicao") as string;
      const categoria = formData.get("categoria") as string;
      const data_inicio = formData.get("data_inicio") as string;
      const data_fim = formData.get("data_fim") as string;
      const descricao = formData.get("descricao") as string;
      const tipo = formData.get("tipo") as string;

      const anexos: { url: string; alt: string }[] = [];

      // 1. Upload dos arquivos e montagem do array de anexos
      for (const item of selectedFiles) {
        const fileExt = item.file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("certificados")
          .upload(fileName, item.file);

        if (uploadError) throw new Error(`Erro no upload de ${item.file.name}: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage
          .from("certificados")
          .getPublicUrl(fileName);
          
        // Salva a URL e a descrição (se for PDF e o alt estiver vazio, coloca um padrão)
        const isPDF = item.file.type === "application/pdf";
        anexos.push({ 
          url: publicUrl, 
          alt: item.alt || (isPDF ? `Documento PDF: ${item.file.name}` : "") 
        });
      }

      // 2. Salva no banco
      const { error: insertError } = await supabase
        .from("experiencias")
        .insert([{
          titulo,
          instituicao,
          categoria,
          data_inicio,
          data_fim: data_fim || null,
          descricao,
          tipo,
          anexos, // <-- Nova coluna
        }]);

      if (insertError) throw new Error(`Erro no banco: ${insertError.message}`);

      setSuccess("Trabalho adicionado com sucesso!");
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/60 via-slate-50 to-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900">Adicionar Novo Trabalho</h1>
          <p className="text-gray-600 mt-1">Preencha as informações abaixo.</p>
        </div>

        {error && <div role="alert" className="bg-red-100 text-red-800 p-4 rounded-lg mb-6 flex items-center gap-2"><AlertCircle size={20} /> {error}</div>}
        {success && <div role="alert" className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 flex items-center gap-2"><CheckCircle2 size={20} /> {success}</div>}

        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-purple-100 space-y-6">
          {/* ... Campos de Título, Instituição, Categoria, Tipo, Datas, Descrição (iguais ao anterior) ... */}
          
          <div>
            <label htmlFor="titulo" className="block text-sm font-bold text-gray-700 mb-2">Título do Trabalho *</label>
            <input type="text" id="titulo" name="titulo" required className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 focus:ring-4 focus:ring-purple-200 outline-none" placeholder="Ex: Consultoria em Audiodescrição" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="instituicao" className="block text-sm font-bold text-gray-700 mb-2">Instituição / Cliente *</label>
              <input type="text" id="instituicao" name="instituicao" required className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 focus:ring-4 focus:ring-purple-200 outline-none" />
            </div>
            <div>
              <label htmlFor="categoria" className="block text-sm font-bold text-gray-700 mb-2">Categoria *</label>
              <select id="categoria" name="categoria" required className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 bg-white focus:ring-4 focus:ring-purple-200 outline-none">
                <option value="">Selecione...</option>
                <option value="Audiodescrição">Audiodescrição</option>
                <option value="Palestra">Palestra</option>
                <option value="Maquiagem">Maquiagem / Beleza</option>
                <option value="Mídia">Mídia / Reportagem</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tipo" className="block text-sm font-bold text-gray-700 mb-2">Tipo Principal *</label>
              <select id="tipo" name="tipo" required className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 bg-white focus:ring-4 focus:ring-purple-200 outline-none">
                <option value="">Selecione...</option>
                <option value="Certificado">Certificado</option>
                <option value="Declaração">Declaração</option>
                <option value="Matéria">Matéria</option>
                <option value="Foto">Foto</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div>
              <label htmlFor="data_inicio" className="block text-sm font-bold text-gray-700 mb-2">Data de Início *</label>
              <input type="date" id="data_inicio" name="data_inicio" required className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 focus:ring-4 focus:ring-purple-200 outline-none" />
            </div>
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-bold text-gray-700 mb-2">Descrição do Trabalho</label>
            <textarea id="descricao" name="descricao" rows={3} className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 focus:ring-4 focus:ring-purple-200 outline-none resize-y"></textarea>
          </div>

          {/* ÁREA DE UPLOAD COM ALT */}
          <div className="border-2 border-dashed border-purple-200 bg-purple-50 rounded-xl p-6">
            <div className="text-center mb-6">
              <UploadCloud className="mx-auto text-purple-500 mb-2" size={32} />
              <span className="block text-sm font-bold text-purple-900 mb-1">Anexos e Comprovações</span>
              <span className="block text-xs text-gray-600 mb-4">Adicione fotos ou PDFs e descreva as imagens para acessibilidade.</span>
              
              <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf" onChange={handleFileChange} className="sr-only" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 bg-purple-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-purple-700 transition-colors">
                <Plus size={18} /> Adicionar Arquivo
              </button>
            </div>

            {selectedFiles.length > 0 && (
              <ul className="space-y-4">
                {selectedFiles.map((item, index) => {
                  const isPDF = item.file.type === "application/pdf";
                  const isImage = item.file.type.startsWith("image/");
                  const previewUrl = isImage ? URL.createObjectURL(item.file) : null;

                  return (
                    <li key={index} className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                          {previewUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                          ) : isPDF ? (
                            <FileText className="text-red-500" size={24} />
                          ) : (
                            <ImageIcon className="text-gray-400" size={24} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{item.file.name}</p>
                          <p className="text-xs text-gray-500">{isPDF ? "PDF" : "Imagem"} • {(item.file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button type="button" onClick={() => removeFile(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-full" aria-label={`Remover ${item.file.name}`}>
                          <X size={18} />
                        </button>
                      </div>

                      {/* Campo de Audiodescrição (ALT) */}
                      <div>
                        <label htmlFor={`alt-${index}`} className="block text-xs font-bold text-gray-700 mb-1">
                          Audiodescrição (Para leitores de tela) {isImage && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="text"
                          id={`alt-${index}`}
                          value={item.alt}
                          onChange={(e) => updateAlt(index, e.target.value)}
                          required={isImage}
                          className="w-full border border-gray-300 p-2 text-sm rounded-lg text-slate-900 focus:ring-2 focus:ring-purple-500 outline-none"
                          placeholder={isPDF ? "Ex: Certificado de conclusão do curso" : "Ex: Carolina maquiando uma mulher cega"}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <Link href="/admin" className="text-gray-600 font-bold hover:text-gray-900 px-4 py-2 rounded-lg">Cancelar</Link>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-purple-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-800 disabled:opacity-70">
              {loading ? "Salvando..." : "Salvar Trabalho"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}