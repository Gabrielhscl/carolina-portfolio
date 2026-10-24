import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Experiencia } from '@/types';

// Estilos do PDF (similar ao Tailwind, mas em objetos JS)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    color: '#18181b', // zinc-950
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#9333ea', // purple-600
    paddingBottom: 10,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 12,
    color: '#71717a', // zinc-500
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contactRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 15,
    fontSize: 10,
    color: '#52525b',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7', // zinc-200
    paddingBottom: 4,
  },
  bio: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#3f3f46', // zinc-700
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  experienceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  experienceDate: {
    fontSize: 10,
    color: '#9333ea',
    fontWeight: 'bold',
  },
  experienceInst: {
    fontSize: 10,
    color: '#71717a',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  experienceDesc: {
    fontSize: 10,
    color: '#52525b',
    lineHeight: 1.3,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#a1a1aa',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e4e4e7',
    paddingTop: 10,
  }
});

interface PdfDocumentProps {
  experiencias: Experiencia[];
}

export function PdfDocument({ experiencias }: PdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <Text style={styles.name}>Carolina de Lemos</Text>
          <Text style={styles.subtitle}>Consultora em Audiodescrição · Maquiadora · Palestrante</Text>
          
          <View style={styles.contactRow}>
            <Text>loraclemos@gmail.com</Text>
            <Text>(81) 98323-6651</Text>
            <Text>Recife - PE</Text>
          </View>
        </View>

        {/* RESUMO */}
        <Text style={styles.sectionTitle}>Resumo Profissional</Text>
        <Text style={styles.bio}>
          Carolina de Lemos é uma mulher com deficiência visual total desde os 26 anos de idade, após enfrentar baixa visão desde os oito. Destaca-se no setor de beleza e cultura como Consultora de Beleza Multimarcas e idealizadora do projeto "Beleza Além da Visão", onde atua como formadora e maquiadora, desenvolvendo técnicas especializadas para pessoas cegas e com baixa visão. Sua abordagem visa promover autonomia, autoestima e expressão. Também é co-criadora do projeto "Papo Sem Barreiras", um videocast que fomenta diálogos sobre inclusão e cultura. Atua como consultora em audiodescrição e mobilizadora de público com deficiência visual para eventos culturais.
        </Text>

        {/* EXPERIÊNCIAS */}
        <Text style={styles.sectionTitle}>Experiências e Comprovações</Text>
        {experiencias.map((exp) => (
          <View key={exp.id} style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              <Text style={styles.experienceTitle}>{exp.titulo}</Text>
              <Text style={styles.experienceDate}>
                {format(parseISO(exp.data_inicio), "MMM 'de' yyyy", { locale: ptBR }).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.experienceInst}>{exp.instituicao}</Text>
            {exp.descricao && <Text style={styles.experienceDesc}>{exp.descricao}</Text>}
          </View>
        ))}

        {/* RODAPÉ */}
        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `Portfólio online: carolina-de-lemos.vercel.app · Página ${pageNumber} de ${totalPages}`
        )} />
        
      </Page>
    </Document>
  );
}