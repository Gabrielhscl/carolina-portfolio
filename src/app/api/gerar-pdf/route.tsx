import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { supabase } from '@/lib/supabase';
import { Experiencia } from '@/types';
import { PdfDocument } from '@/components/pdf/PdfDocument';

export async function GET() {
  try {
    const { data: experiencias, error } = await supabase
      .from('experiencias')
      .select('*')
      .order('data_inicio', { ascending: false });

    if (error) throw error;

    const buffer = await renderToBuffer(
      <PdfDocument experiencias={(experiencias as Experiencia[]) || []} />
    );

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="curriculo-carolina-de-lemos.pdf"',
      },
    });

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar o currículo. Tente novamente.' },
      { status: 500 }
    );
  }
}