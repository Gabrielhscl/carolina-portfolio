"use client";

import { createContext, useContext, useState, useEffect } from "react";

type AccessibilityContextType = {
  highContrast: boolean;
  toggleContrast: () => void;
  fontSize: number;
  increaseFont: () => void;
  decreaseFont: () => void;
  resetFont: () => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(100);

  // Carrega as preferências salvas no navegador ao abrir o site
  useEffect(() => {
    const savedContrast = localStorage.getItem("highContrast") === "true";
    const savedFontSize = Number(localStorage.getItem("fontSize")) || 100;
    
    setHighContrast(savedContrast);
    setFontSize(savedFontSize);
    
    document.documentElement.style.fontSize = `${savedFontSize}%`;
    if (savedContrast) document.documentElement.classList.add("high-contrast");
  }, []);

  function toggleContrast() {
    setHighContrast((prev) => {
      const newValue = !prev;
      localStorage.setItem("highContrast", String(newValue));
      if (newValue) document.documentElement.classList.add("high-contrast");
      else document.documentElement.classList.remove("high-contrast");
      return newValue;
    });
  }

  function changeFontSize(delta: number) {
    setFontSize((prev) => {
      const newSize = Math.min(Math.max(prev + delta, 80), 150); // Limita entre 80% e 150%
      localStorage.setItem("fontSize", String(newSize));
      document.documentElement.style.fontSize = `${newSize}%`;
      return newSize;
    });
  }

  function increaseFont() { changeFontSize(10); }
  function decreaseFont() { changeFontSize(-10); }
  function resetFont() { 
    setFontSize(100); 
    localStorage.setItem("fontSize", "100"); 
    document.documentElement.style.fontSize = "100%"; 
  }

  return (
    <AccessibilityContext.Provider value={{ highContrast, toggleContrast, fontSize, increaseFont, decreaseFont, resetFont }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error("useAccessibility deve ser usado dentro de AccessibilityProvider");
  return context;
}