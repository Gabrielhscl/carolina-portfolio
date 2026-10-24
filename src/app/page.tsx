import { supabase } from "@/lib/supabase";
import { Experiencia, Depoimento } from "@/types";
import { Timeline } from "@/components/Timeline";
import { Hero } from "@/components/Hero";
import { Mic, Eye, Sparkles, HeartHandshake, MessageCircle, Quote, Camera } from "lucide-react";

export const instant = false;

export default async function Home() {
  const { data: experiencias, error } = await supabase
    .from("experiencias")
    .select("*")
    .order("data_inicio", { ascending: false });

  const { data: perfil } = await supabase.from("perfil").select("*").single();
  const { data: depoimentos } = await supabase.from("depoimentos").select("*").limit(3);
  
  if (error) console.error("Erro ao buscar experiências:", error);

  const total = experiencias?.length || 0;
  
  const fotoUrl = perfil?.foto_url || '/carolina.jpg';
  const tituloHero = perfil?.titulo_hero || 'Inclusão, Beleza e Acessibilidade.';
  const descricaoHero = perfil?.descricao_hero || 'Consultora em Audiodescrição, Maquiadora e Palestrante. Transformando desafios em oportunidades.';
  const mostrarInsta = perfil?.mostrar_instagram ?? true;

  return (
    <div className="w-full overflow-hidden bg-[#f4f4f5]">
      
      {/* HERO ANIMADO */}
      <Hero 
        fotoUrl={fotoUrl} 
        tituloHero={tituloHero} 
        descricaoHero={descricaoHero} 
      />

      {/* SEÇÃO DE SERVIÇOS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-12 border-b-2 border-zinc-950 pb-4">
            <h2 className="text-4xl md:text-6xl font-black text-zinc-950 uppercase tracking-tighter">
              O que eu faço
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-200 hover:border-purple-300 transition-colors">
              <Eye size={40} className="text-purple-600 mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold text-zinc-950 mb-2 uppercase tracking-tight">Consultoria em Audiodescrição</h3>
              <p className="text-zinc-600">Torno imagens, espetáculos e exposições acessíveis para pessoas com deficiência visual.</p>
            </div>
            
            <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-200 hover:border-purple-300 transition-colors">
              <Mic size={40} className="text-purple-600 mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold text-zinc-950 mb-2 uppercase tracking-tight">Palestras e Formações</h3>
              <p className="text-zinc-600">Compartilho vivências sobre inclusão, acessibilidade e empoderamento da pessoa com deficiência.</p>
            </div>

            <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-200 hover:border-purple-300 transition-colors">
              <Sparkles size={40} className="text-purple-600 mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold text-zinc-950 mb-2 uppercase tracking-tight">Oficinas de Automaquiagem</h3>
              <p className="text-zinc-600">Ensino técnicas adaptadas para que mulheres cegas e com baixa visão se maquiem com autonomia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE PROJETOS PRINCIPAIS */}
      <section className="py-20 bg-zinc-950 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-12 border-b-2 border-white/20 pb-4">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
              Projetos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative overflow-hidden rounded-3xl bg-zinc-800 border border-zinc-700 p-8 md:p-12 hover:border-purple-500 transition-colors">
              <HeartHandshake size={48} className="text-purple-400 mb-6" aria-hidden="true" />
              <h3 className="text-3xl font-black uppercase tracking-tight mb-4">Beleza Além da Visão</h3>
              <p className="text-zinc-400 text-lg mb-6">Idealizado em 2022, o projeto promove autonomia e autoestima para mulheres cegas e com baixa visão através de técnicas adaptadas de automaquiagem.</p>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-zinc-800 border border-zinc-700 p-8 md:p-12 hover:border-purple-500 transition-colors">
              <MessageCircle size={48} className="text-purple-400 mb-6" aria-hidden="true" />
              <h3 className="text-3xl font-black uppercase tracking-tight mb-4">Papo Sem Barreiras</h3>
              <p className="text-zinc-400 text-lg mb-6">Videocast co-criado para fomentar diálogos autênticos sobre inclusão, cultura e os desafios da pessoa com deficiência.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE EXPERIÊNCIAS (BANNERS) */}
      <section id="experiencias" className="py-20 bg-[#f4f4f5]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-12 border-b-2 border-zinc-950 pb-4 flex justify-between items-end">
            <h2 className="text-4xl md:text-6xl font-black text-zinc-950 uppercase tracking-tighter">
              Experiências
            </h2>
          </div>
          
          <Timeline 
            experiencias={experiencias as Experiencia[] || []} 
            limit={5}
            totalCount={total}
          />
        </div>
      </section>

      {/* SEÇÃO DE DEPOIMENTOS */}
      {depoimentos && depoimentos.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-12 border-b-2 border-zinc-950 pb-4">
              <h2 className="text-4xl md:text-6xl font-black text-zinc-950 uppercase tracking-tighter">O que dizem</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {depoimentos.map((dep: Depoimento) => (
                <div key={dep.id} className="bg-zinc-50 p-8 rounded-2xl border border-zinc-200">
                  <Quote size={32} className="text-purple-300 mb-4" aria-hidden="true" />
                  <p className="text-zinc-700 italic mb-6 leading-relaxed">"{dep.texto}"</p>
                  <div>
                    <p className="font-bold text-zinc-950">{dep.nome}</p>
                    {dep.cargo && <p className="text-sm text-zinc-500">{dep.cargo}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEÇÃO DO INSTAGRAM (Opcional) - Usando ícone Camera */}
      {mostrarInsta && (
        <section className="py-20 bg-zinc-950 text-white text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <Camera size={48} className="text-purple-400 mx-auto mb-6" aria-hidden="true" />
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Acompanhe o dia a dia</h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
              Bastidores, eventos e muito conteúdo sobre inclusão e arte no meu Instagram.
            </p>
            <a 
              href="https://www.instagram.com/carolinadelemos_/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white font-bold text-lg py-4 px-8 rounded-full hover:scale-105 transition-transform"
            >
              <Camera size={20} /> @carolinadelemos_
            </a>
          </div>
        </section>
      )}

    </div>
  );
}