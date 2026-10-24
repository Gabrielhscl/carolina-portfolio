"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Download } from "lucide-react";
import Link from "next/link";

interface HeroProps {
  fotoUrl: string;
  tituloHero: string;
  descricaoHero: string;
}

export function Hero({ fotoUrl, tituloHero, descricaoHero }: HeroProps) {
  // Variantes para o container animar os filhos em sequência
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Delay entre cada elemento
        delayChildren: 0.1,
      },
    },
  };

  // Variantes para os itens individuais (surgem de baixo para cima)
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    },
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center items-center pt-10 pb-20 overflow-hidden">
      
      {/* Texto de Fundo Animado */}
      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] md:text-[15vw] font-black text-zinc-200 tracking-tighter leading-none whitespace-nowrap z-0 select-none" 
        aria-hidden="true"
      >
        CAROLINA
      </motion.h1>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 max-w-6xl relative w-full flex flex-col items-center"
      >
        
        {/* Foto Animada (Efeito de Zoom suave) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-64 h-80 md:w-80 md:h-[450px] rounded-3xl overflow-hidden shadow-2xl mb-8 border-4 border-white"
        >
          <Image
            src={fotoUrl}
            alt="Retrato profissional de Carolina de Lemos"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Textos Animados */}
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-5xl font-extrabold text-zinc-950 mb-4 tracking-tight leading-tight"
          >
            {tituloHero}
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg text-zinc-600 mb-8 font-medium"
          >
            {descricaoHero}
          </motion.p>

          {/* Botões Animados */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="/api/gerar-pdf"
              className="inline-flex items-center justify-center gap-2 bg-zinc-950 text-white font-bold text-lg py-4 px-8 rounded-full hover:bg-zinc-800 transition-transform hover:-translate-y-1"
            >
              <Download size={20} aria-hidden="true" />
              Baixar Currículo
            </a>
            <Link
              href="/sobre"
              className="inline-flex items-center justify-center gap-2 bg-white text-zinc-950 border-2 border-zinc-200 font-bold text-lg py-4 px-8 rounded-full hover:bg-zinc-50 transition-colors"
            >
              Conheça minha história
            </Link>
          </motion.div>
        </div>

      </motion.div>
    </section>
  );
}