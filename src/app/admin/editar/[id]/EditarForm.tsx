"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Experiencia } from "@/types";
import { CheckCircle2, AlertCircle, X, FileText, Image as ImageIcon, Plus, Save } from "lucide-react";
import Link from "next/link";

type FileWithAlt = { file: File; alt: string };
type ExistingFile = { url: string; alt: string };

export function EditarForm({ experiencia }: { experiencia: Experiencia }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [arquivosExistentes, setArquivosExistentes] = useState<ExistingFile[]>(experiencia.anexos || []);
  const [novosArquivos, setNovosArquivos] = useState<FileWithAlt[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map((file) => ({ file, alt: "" }));
    setNovosArquivos((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeNovoArquivo(index: number) {
    setNovosArquivos((prev) => prev.filter((_, i) => i !== index));
  }

  function updateNovoAlt(index: number, value: string) {
    setNovosArquivos((prev) => {
      const novos = [...prev];
      novos[index].alt = value;
      return novos;
    });
  }

  function removeArquivoExistente(url: string) {
    setArquivosExistentes((prev) => prev.filter((u) => u.url !== url));
  }

  function updateExistenteAlt(url: string, newAlt: string) {
    setArquivosExistentes((prev) => prev.map((f) => f.url === url ? { ...f, alt: newAlt } : f));
  }

  function getFileNameFromUrl(url: string) {
    return url.split("/").pop() || "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      // 1. Pega os dados dos inputs de texto
      const titulo = formData.get("titulo") as string;
      const instituicao = formData.get("instituicao") as string;
      const categoria = formData.get("categoria") as string;
      const data_inicio = formData.get("data_inicio") as string;
      const data_fim = formData.get("data_fim") as string;
      const descricao = formData.get("descricao") as string;
      const tipo = formData.get("tipo") as string;

      // 2. Descobrir arquivos excluídos para apagar do Storage
      const urlsOriginais = experiencia.anexos?.map(a => a.url) || [];
      const urlsMantidas = arquivosExistentes.map(a => a.url);
      const urlsRemovidas = urlsOriginais.filter(url => !urlsMantidas.includes(url));

      if (urlsRemovidas.length > 0) {
        const fileNames = urlsRemovidas.map(getFileNameFromUrl);
        await supabase.storage.from("certificados").remove(fileNames);
      }

      // 3. Upload dos novos arquivos
      const novosAnexos: ExistingFile[] = [];
      for (const item of novosArquivos) {
        const fileExt = item.file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from("certificados").upload(fileName, item.file);
        if (uploadError) throw new Error(`Erro no upload: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage.from("certificados").getPublicUrl(fileName);
        const isPDF = item.file.type === "application/pdf";
        
        novosAnexos.push({ 
          url: publicUrl, 
          alt: item.alt || (isPDF ? `Documento PDF: ${item.file.name}` : "") 
        });
      }

      // 4. Unir existentes e novos
      const anexosFinais = [...arquivosExistentes, ...novosAnexos];

      // 5. Atualizar o banco
      const { error: updateError } = await supabase
        .from("experiencias")
        .update({
          titulo, instituicao, categoria, data_inicio,
          data_fim: data_fim || null, descricao, tipo,
          anexos: anexosFinais,
        })
        .eq("id", experiencia.id);

      if (updateError) throw new Error(`Erro ao atualizar: ${updateError.message}`);

      setSuccess("Alterações salvas com sucesso!");
      setTimeout(() => { router.push("/admin"); router.refresh(); }, 1500);

    } catch (err: any) {
      setError(err.message || "Ocorreu um erro.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/60 via-slate-50 to-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900">Editar Trabalho</h1>
          <p className="text-gray-600 mt-1">Atualize as informações abaixo.</p>
        </div>

        {error && (
          <div role="alert" className="bg-red-100 text-red-800 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} aria-hidden="true" /> {error}
          </div>
        )}
        {success && (
          <div role="alert" className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 flex items-center gap-2">
            <CheckCircle2 size={20} aria-hidden="true" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-purple-100 space-y-6">
          
          {/* DADOS DO TRABALHO */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-bold text-gray-700 mb-2">
              Título do Trabalho <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              type="text" id="titulo" name="titulo" required
              defaultValue={experiencia.titulo}
              className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="instituicao" className="block text-sm font-bold text-gray-700 mb-2">
                Instituição / Cliente <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                type="text" id="instituicao" name="instituicao" required
                defaultValue={experiencia.instituicao}
                className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label htmlFor="categoria" className="block text-sm font-bold text-gray-700 mb-2">
                Categoria <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <select
                id="categoria" name="categoria" required
                defaultValue={experiencia.categoria}
                className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 bg-white focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none"
              >
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
              <label htmlFor="tipo" className="block text-sm font-bold text-gray-700 mb-2">
                Tipo Principal <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <select
                id="tipo" name="tipo" required
                defaultValue={experiencia.tipo}
                className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 bg-white focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none"
              >
                <option value="Certificado">Certificado</option>
                <option value="Declaração">Declaração</option>
                <option value="Matéria">Matéria / Reportagem</option>
                <option value="Troféu">Troféu / Premiação</option>
                <option value="Foto">Foto / Registro</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div>
              <label htmlFor="data_inicio" className="block text-sm font-bold text-gray-700 mb-2">
                Data de Início <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                type="date" id="data_inicio" name="data_inicio" required
                defaultValue={experiencia.data_inicio}
                className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-bold text-gray-700 mb-2">
              Descrição do Trabalho
            </label>
            <textarea
              id="descricao" name="descricao" rows={3}
              defaultValue={experiencia.descricao || ""}
              className="w-full border border-gray-300 p-3 rounded-lg text-slate-900 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none resize-y"
            ></textarea>
          </div>

          {/* GERENCIAMENTO DE ARQUIVOS */}
          <div className="border-2 border-dashed border-purple-200 bg-purple-50 rounded-xl p-6">
            <div className="text-center mb-6">
              <span className="block text-sm font-bold text-purple-900 mb-1">Anexos e Comprovações</span>
              <p className="text-xs text-gray-600 mb-4">Adicione novos arquivos ou edite as audiodescrições dos já existentes.</p>
              
              <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf" onChange={handleFileChange} className="sr-only" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 bg-purple-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-purple-700 transition-colors">
                <Plus size={18} /> Adicionar Novo Arquivo
              </button>
            </div>

            {/* Arquivos Existentes */}
            {arquivosExistentes.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-800 mb-3">Já anexados:</p>
                <ul className="space-y-3">
                  {arquivosExistentes.map((item, i) => {
                    const isPDF = item.url.toLowerCase().endsWith(".pdf");
                    return (
                      <li key={i} className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
                            {isPDF ? <FileText className="text-red-500" size={20} /> : <img src={item.url} alt="" className="w-full h-full object-cover rounded" />}
                          </div>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-purple-700 hover:underline truncate flex-1">
                            {item.url.split("/").pop()}
                          </a>
                          <button type="button" onClick={() => removeArquivoExistente(item.url)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                            <X size={16} />
                          </button>
                        </div>
                        <input 
                          type="text" 
                          value={item.alt} 
                          onChange={(e) => updateExistenteAlt(item.url, e.target.value)}
                          className="w-full border border-gray-300 p-2 text-xs rounded-lg text-slate-900 focus:ring-2 focus:ring-purple-500 outline-none"
                          placeholder="Audiodescrição da imagem (Para leitores de tela)"
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Novos Arquivos */}
            {novosArquivos.length > 0 && (
              <div>
                <p className="text-sm font-bold text-green-800 mb-3" aria-live="polite">Novos arquivos:</p>
                <ul className="space-y-3">
                  {novosArquivos.map((item, index) => {
                    const isPDF = item.file.type === "application/pdf";
                    const previewUrl = !isPDF ? URL.createObjectURL(item.file) : null;
                    return (
                      <li key={index} className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
                            {previewUrl ? <img src={previewUrl} alt="" className="w-full h-full object-cover rounded" /> : <FileText className="text-red-500" size={20} />}
                          </div>
                          <p className="text-sm font-semibold text-gray-800 truncate flex-1">{item.file.name}</p>
                          <button type="button" onClick={() => removeNovoArquivo(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                            <X size={16} />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={item.alt}
                          onChange={(e) => updateNovoAlt(index, e.target.value)}
                          className="w-full border border-gray-300 p-2 text-xs rounded-lg text-slate-900 focus:ring-2 focus:ring-purple-500 outline-none"
                          placeholder="Audiodescrição da imagem (Para leitores de tela)"
                          required={!isPDF}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* BOTÕES */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <Link href="/admin" className="text-gray-600 font-bold hover:text-gray-900 px-4 py-2 rounded-lg">
              Cancelar
            </Link>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-purple-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-800 disabled:opacity-70 transition-colors">
              <Save size={18} /> {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}