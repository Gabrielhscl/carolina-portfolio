"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContatoPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      nome: formData.get("nome"),
      email: formData.get("email"),
      mensagem: formData.get("mensagem"),
    };

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f4f5] py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 font-bold hover:text-zinc-950 mb-10 uppercase tracking-widest text-sm">
          <ArrowLeft size={16} /> Voltar ao início
        </Link>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-zinc-200">
          <h1 className="text-4xl md:text-5xl font-black text-zinc-950 uppercase tracking-tighter mb-4">
            Fale Comigo
          </h1>
          <p className="text-zinc-600 mb-8 font-medium">
            Preencha o formulário abaixo para propostas, convites ou dúvidas.
          </p>

          {status === "success" && (
            <div role="alert" className="bg-green-50 text-green-800 p-4 rounded-xl mb-6 flex items-center gap-2 font-bold">
              <CheckCircle2 size={20} /> Mensagem enviada com sucesso! Retornarei em breve.
            </div>
          )}

          {status === "error" && (
            <div role="alert" className="bg-red-50 text-red-800 p-4 rounded-xl mb-6 flex items-center gap-2 font-bold">
              <AlertCircle size={20} /> Ocorreu um erro ao enviar. Tente novamente ou use o WhatsApp.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nome" className="block text-sm font-bold text-zinc-700 mb-2">Seu Nome *</label>
              <input type="text" id="nome" name="nome" required className="w-full border-2 border-zinc-200 p-4 rounded-xl text-zinc-900 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all" placeholder="Como devo te chamar?" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-zinc-700 mb-2">Seu E-mail *</label>
              <input type="email" id="email" name="email" required className="w-full border-2 border-zinc-200 p-4 rounded-xl text-zinc-900 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all" placeholder="seu@email.com" />
            </div>

            <div>
              <label htmlFor="mensagem" className="block text-sm font-bold text-zinc-700 mb-2">Mensagem *</label>
              <textarea id="mensagem" name="mensagem" required rows={5} className="w-full border-2 border-zinc-200 p-4 rounded-xl text-zinc-900 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-y" placeholder="Conte-me sobre seu projeto ou evento..." />
            </div>

            <button type="submit" disabled={status === "loading"} className="w-full flex items-center justify-center gap-2 bg-purple-700 text-white font-bold text-lg py-4 px-8 rounded-xl hover:bg-purple-800 transition-colors focus:ring-4 focus:ring-purple-300 disabled:opacity-50">
              <Send size={20} /> {status === "loading" ? "Enviando..." : "Enviar Mensagem"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}