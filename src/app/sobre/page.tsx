import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Quote, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Perfil } from "@/types";

export const metadata = {
  title: "Sobre | Carolina de Lemos",
  description: "Conheça a história de Carolina de Lemos.",
};

export const instant = false;

export default async function SobrePage() {
  const { data: perfil } = await supabase.from("perfil").select("*").single();
  
  const fotoUrl = perfil?.foto_url || '/carolina.jpg';
  const titulo = perfil?.sobre_titulo || 'Minha História';
  const subtitulo = perfil?.sobre_subtitulo || 'Transformando a perda da visão em uma oportunidade...';
  const t1 = perfil?.sobre_texto_1 || '';
  const t2 = perfil?.sobre_texto_2 || '';
  const t3 = perfil?.sobre_texto_3 || '';
  const t4 = perfil?.sobre_texto_4 || '';
  
  // Lista de formação dinâmica
  const formacao = perfil?.formacao || [
    "Graduanda em Recursos Humanos",
    "Consultora em Audiodescrição",
    "Maquiadora e Formadora"
  ];

  return (
    <div className="bg-[#f4f4f5] min-h-screen pb-20">
      
      <div className="container mx-auto px-4 max-w-5xl pt-10">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 font-bold hover:text-zinc-950 mb-10 focus:outline-none focus:underline uppercase tracking-widest text-sm">
          <ArrowLeft size={16} aria-hidden="true" /> Voltar ao início
        </Link>

        {/* HERO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20">
          <div className="order-2 md:order-1">
            <h1 className="text-5xl md:text-7xl font-black text-zinc-950 uppercase tracking-tighter leading-none mb-6">
              {titulo}
            </h1>
            <div className="w-20 h-2 bg-purple-600 mb-6" aria-hidden="true"></div>
            <p className="text-xl md:text-2xl text-zinc-600 font-medium leading-relaxed">
              {subtitulo}
            </p>
          </div>
          <div className="order-1 md:order-2 relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
            <Image src={fotoUrl} alt="Carolina de Lemos" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
          </div>
        </div>

        {/* TEXTO DA HISTÓRIA */}
        <div className="max-w-3xl mx-auto space-y-8 text-lg text-zinc-700 leading-relaxed">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-zinc-200 relative">
            <Quote className="absolute top-6 left-6 text-purple-100 w-16 h-16 -z-0" aria-hidden="true" />
            
            <div className="relative z-10 space-y-6">
              <p className="font-medium text-xl md:text-2xl text-zinc-900 mb-6">
                "Minha jornada é marcada pela superação e pela vontade de ajudar os outros a verem além das limitações físicas."
              </p>
              <p>{t1}</p>
              <p>{t2}</p>
              <p>{t3}</p>
              <p>{t4}</p>
            </div>
          </div>

          {/* FORMAÇÃO E ESPECIALIDADES DINÂMICA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            <div className="bg-zinc-900 text-white p-8 rounded-3xl">
              <Sparkles className="text-purple-400 mb-4" size={32} aria-hidden="true" />
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Formação & Especialidades</h2>
              <ul className="space-y-3 text-zinc-300">
                {formacao.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-purple-400 font-bold">•</span> 
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-purple-100 text-purple-950 p-8 rounded-3xl flex flex-col justify-center items-start">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none">Pronta para novos desafios?</h2>
              <p className="mb-6 font-medium">Vamos conversar sobre como posso agregar valor ao seu projeto ou evento.</p>
              <a href="https://wa.me/5581983236651" target="_blank" rel="noopener noreferrer" className="bg-purple-700 text-white font-bold py-3 px-6 rounded-full hover:bg-purple-800 transition-colors uppercase tracking-widest text-sm">
                Entrar em contato
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}