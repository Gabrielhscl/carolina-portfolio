// Define o formato exato dos dados que vêm do banco
export interface Experiencia {
  id: string;
  titulo: string;
  instituicao: string;
  categoria: string;
  data_inicio: string; // Formato YYYY-MM-DD
  data_fim: string | null; // Pode ser nulo
  descricao: string | null;
  anexos: { url: string; alt: string }[] | null;
  certificado_urls: string[] | null;
  tipo: string;
  created_at: string;
}

export interface Depoimento {
  id: string;
  nome: string;
  cargo: string | null;
  texto: string;
  created_at: string;
}

export interface Perfil {
  id: number;
  foto_url: string;
  titulo_hero: string;
  descricao_hero: string;
  sobre_titulo: string;
  sobre_subtitulo: string;
  sobre_texto_1: string;
  sobre_texto_2: string;
  sobre_texto_3: string;
  sobre_texto_4: string;
  formacao: string[];
  mostrar_instagram: boolean;
  updated_at: string;
}