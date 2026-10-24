"use client";

import { useState, useEffect } from "react";

export function FooterAno() {
  // 1. Começa com um valor fixo para não quebrar a pré-renderização
  const [ano, setAno] = useState("2026");

  // 2. Assim que a página carrega no navegador, ele atualiza para o ano real
  useEffect(() => {
    setAno(new Date().getFullYear().toString());
  }, []);

  return <>{ano}</>;
}