import { NextResponse } from "next/server";
import { Resend } from "resend";

// A chave virá do arquivo .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { nome, email, mensagem } = await request.json();

    if (!nome || !email || !mensagem) {
      return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
    }

    // Envia o e-mail (Substitua 'seu-email@dominio.com' pelo e-mail verificado no Resend)
    const data = await resend.emails.send({
      from: "Portfolio Carolina <onboarding@resend.dev>", // Use este para testes
      to: ["loraclemos@gmail.com"], // O e-mail da Carolina
      subject: `Novo contato de ${nome} pelo site`,
      html: `
        <h2>Nova mensagem do site</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${mensagem}</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao enviar e-mail" }, { status: 500 });
  }
}