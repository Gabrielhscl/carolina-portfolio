"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  url: string;
  titulo: string;
  onClose: () => void;
}

export function ModalComprovacao({ url, titulo, onClose }: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const isPDF = url.toLowerCase().endsWith(".pdf");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Visualizando comprovação de ${titulo}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden ring-1 ring-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 truncate pr-4">
            Comprovação: {titulo}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-600 focus:ring-4 focus:ring-purple-300 outline-none transition-colors"
            aria-label="Fechar visualização"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 bg-gray-100 relative">
          {isPDF ? (
            <iframe
              src={url}
              className="w-full h-full border-0"
              title={`Documento PDF: ${titulo}`}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={`Comprovação visual do trabalho ${titulo}`}
              className="w-full h-full object-contain p-4"
            />
          )}
        </div>
      </div>
    </div>
  );
}