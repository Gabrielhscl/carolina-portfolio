"use client";

import { useState, useEffect } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Sun, Moon, Plus, Minus, ArrowUp, Accessibility } from "lucide-react";

export function FloatingControls() {
  const { highContrast, toggleContrast, increaseFont, decreaseFont, resetFont } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Lógica para mostrar o botão "Voltar ao Topo" após rolar 300px
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      
      {/* Botão Voltar ao Topo */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="p-3 bg-zinc-950 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors focus:ring-4 focus:ring-purple-300 outline-none"
          aria-label="Voltar para o topo da página"
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* Painel de Acessibilidade */}
      {isOpen && (
        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-200 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center mb-1">Acessibilidade</p>
          
          <div className="flex gap-2 justify-center">
            <button
              onClick={decreaseFont}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-zinc-900 font-bold"
              aria-label="Diminuir tamanho do texto"
            >
              <Minus size={18} />
            </button>
            <button
              onClick={resetFont}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-zinc-900 text-xs font-bold uppercase"
              aria-label="Restaurar tamanho padrão do texto"
            >
              A
            </button>
            <button
              onClick={increaseFont}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-zinc-900 font-bold"
              aria-label="Aumentar tamanho do texto"
            >
              <Plus size={18} />
            </button>
          </div>

          <button
            onClick={toggleContrast}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg font-bold text-sm hover:bg-zinc-800 transition-colors"
            aria-pressed={highContrast}
          >
            {highContrast ? <Sun size={16} /> : <Moon size={16} />}
            {highContrast ? "Modo Normal" : "Alto Contraste"}
          </button>
        </div>
      )}

      {/* Botão principal que abre o painel */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-purple-700 text-white rounded-full shadow-xl hover:bg-purple-800 transition-transform hover:scale-105 focus:ring-4 focus:ring-purple-300 outline-none"
        aria-label={isOpen ? "Fechar menu de acessibilidade" : "Abrir menu de acessibilidade"}
        aria-expanded={isOpen}
      >
        <Accessibility size={28} />
      </button>
    </div>
  );
}