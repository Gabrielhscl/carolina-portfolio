<div align="center">

# 🌟 Portfólio Acessível - Carolina de Lemos

  <p align="center">
    Um site portfólio dinâmico, inclusivo e de alto padrão, desenvolvido para destacar a trajetória de uma artista da inclusão.
  </p>

  <!-- Badges -->
  <img src="https://img.shields.io/badge/Next.js-16.4-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Acessibilidade-100%25-brightgreen?style=for-the-badge" alt="Acessibilidade" />

</div>

---

## 📖 Sobre o Projeto

Este projeto nasceu da necessidade de apresentar o currículo e o portfólio de **Carolina de Lemos** — Consultora em Audiodescrição, Maquiadora, Palestrante e idealizadora do projeto "Beleza Além da Visão" — de forma moderna e atrativa para pessoas que enxergam, **sem deixar de lado a experiência de quem navega por áudio (VoiceOver e TalkBack)**.

O grande diferencial deste site é o compromisso absoluto com a **Acessibilidade (A11y)** e o **Design Editorial**, inspirado nas grandes revistas de moda e design, utilizando tipografia impactante, animações fluidas e navegação por teclado/leitor de tela impecável.

## ✨ Funcionalidades Principais

### 🎨 Para os Visitantes (Front-end)
- **Design Editorial Premium:** Layout moderno com banners imersivos, tipografia em caixa alta e animações suaves (Framer Motion).
- **Galeria Acessível:** Visualização de fotos e PDFs em modais (Lightbox), com audiodescrição (`alt`) obrigatória em cada imagem.
- **Linha do Tempo Interativa:** Visualização de experiências em formato de Lista (banners) ou Grade (cards), com filtros por categoria e busca em tempo real.
- **Compartilhamento Dinâmico:** Botão para copiar o link de um trabalho específico, que abre um modal direto na tela do usuário que receber.
- **Formulário de Contato:** Integração com a API do Resend para envio de propostas formais direto para o e-mail.
- **Open Graph:** Imagem de preview personalizada e dinâmica para compartilhamento em redes sociais e WhatsApp.

### ♿ Acessibilidade (Nível Ouro)
- **Modo de Alto Contraste:** Inversão de cores com um clique (respeitando as imagens e mídias).
- **Controle de Fonte:** Botões para aumentar, diminuir ou resetar o tamanho do texto de todo o site.
- **Skip to Content:** Link invisível no topo para pular o menu e ir direto ao conteúdo.
- **HTML Semântico:** Uso rigoroso de `nav`, `main`, `section`, `article`, além de `aria-labels` descritivos e focos visíveis (`focus-visible`) para navegação por teclado.
- **Leitor de Tela Ready:** Descrições detalhadas em botões, erros de formulário (com `role="alert"`) e controle de abas.

### 🔐 Painel Administrativo (Área Restrita)
A Carolina tem total autonomia para gerenciar o site através de um painel protegido por login:
- **Gestão de Experiências:** Adicionar, editar e excluir trabalhos, com upload de múltiplos arquivos (fotos e PDFs) e campos obrigatórios de audiodescrição.
- **Personalização:** Editar a foto principal do site, os textos do Hero (Home), e toda a página "Sobre".
- **Prova Social:** Gerenciar a seção de Depoimentos e ativar/desativar a seção de convite para o Instagram.
- **Lista Dinâmica:** Adicionar e remover itens da lista de "Formação e Especialidades".

---

## 🚀 Tecnologias Utilizadas

- **[Next.js 16](https://nextjs.org/)** (App Router, Turbopack, Cache Components)
- **[TypeScript](https://www.typescriptlang.org/)** (Tipagem estática)
- **[Tailwind CSS](https://tailwindcss.com/)** (Estilização utilitária)
- **[Supabase](https://supabase.com/)** (Banco de dados PostgreSQL, Autenticação e Storage de Arquivos)
- **[Framer Motion](https://www.framer.com/motion/)** (Animações fluidas e micro-interações)
- **[Resend](https://resend.com/)** (Envio de e-mails do formulário de contato)
- **[Lucide React](https://lucide.dev/)** (Biblioteca de ícones)
- **[react-pdf/renderer](https://react-pdf.org/)** (Geração dinâmica do currículo em PDF)

---

## 🛠️ Como rodar o projeto localmente

### Pré-requisitos
Antes de começar, você vai precisar ter instalado na sua máquina:
* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* [Git](https://git-scm.com/)
* Uma conta no [Supabase](https://supabase.com/) e [Resend](https://resend.com/).

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Gabrielhscl/carolina-portfolio.git
   cd carolina-portfolio