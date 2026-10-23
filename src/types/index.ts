// Define o formato exato dos dados que vêm do banco
export interface Experiencia {
  id: string;
  titulo: string;
  instituicao: string;
  categoria: string;
  data_inicio: string; // Formato YYYY-MM-DD
  data_fim: string | null; // Pode ser nulo
  descricao: string | null;
  certificado_url: string | null;
  tipo: string;
  created_at: string;
}