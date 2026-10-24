import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { FooterAno } from "@/components/FooterAno";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { FloatingControls } from "@/components/FloatingControls";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Carolina de Lemos | Portfólio",
  description:
    "Portfólio de Carolina de Lemos. Consultora em Audiodescrição, Maquiadora e Palestrante.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${inter.className} bg-[#f4f4f5] text-zinc-950 min-h-screen flex flex-col antialiased`}
      >
        <AccessibilityProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:p-4 focus:bg-purple-700 focus:text-white focus:rounded-full focus:outline-none"
          >
            Pular para o conteúdo principal
          </a>

          {/* MENU FLUTUANTE (Já existente) */}
          <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-5xl no-invert">
            <div className="bg-white/90 backdrop-blur-md shadow-lg shadow-black/5 rounded-full px-6 py-3 flex justify-between items-center border border-white/20">
              <Link
                href="/"
                className="text-xl font-black tracking-tighter text-zinc-950 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
              >
                Carolina.
              </Link>

              <nav aria-label="Menu Principal">
                <ul className="flex gap-4 sm:gap-8 items-center text-sm font-semibold text-zinc-600">
                  <li className="hidden sm:block">
                    <Link
                      href="/sobre"
                      className="hover:text-zinc-950 transition-colors focus:underline"
                    >
                      Sobre
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#experiencias"
                      className="hover:text-zinc-950 transition-colors focus:underline"
                    >
                      Experiências
                    </Link>
                  </li>
                  <li className="hidden sm:block">
                    <Link
                      href="/contato"
                      className="hover:text-zinc-950 transition-colors focus:underline"
                    >
                      Contato
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/login"
                      className="bg-zinc-950 text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
                    >
                      Área Restrita
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          <main id="main-content" className="flex-grow pt-24">
            {children}
          </main>

          {/* RODAPÉ (Já existente) */}
          <footer className="w-full bg-zinc-950 text-zinc-400 py-12 mt-20 no-invert">
            <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-black text-white tracking-tighter mb-2">
                  CAROLINA DE LEMOS
                </h2>
                <p className="text-zinc-500">
                  Inclusão, Arte e Acessibilidade.
                </p>
              </div>

              <div className="flex gap-6 text-sm font-bold">
                <a
                  href="mailto:loraclemos@gmail.com"
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  E-mail
                </a>
                <a
                  href="https://wa.me/5581983236651"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href="https://www.instagram.com/carolinadelemos_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  Instagram
                </a>
              </div>

              <p className="text-sm text-zinc-600">
                © <FooterAno /> Todos os direitos reservados.
              </p>
            </div>
          </footer>

          {/* CONTROLES DE ACESSIBILIDADE E VOLTAR AO TOPO */}
          <FloatingControls />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
