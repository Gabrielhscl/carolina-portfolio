import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";

export const alt = "Portfólio Carolina de Lemos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Busca o título do perfil no banco
  const { data: perfil } = await supabase.from("perfil").select("titulo_hero").single();
  const titulo = perfil?.titulo_hero || "Inclusão, Beleza e Acessibilidade.";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #f4f4f5, #e4e4e7)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "#9333ea",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "40px",
              fontWeight: "bold",
            }}
          >
            C
          </div>
          <span style={{ fontSize: "32px", fontWeight: "bold", color: "#18181b", letterSpacing: "-1px" }}>
            Carolina de Lemos
          </span>
        </div>

        <h1
          style={{
            fontSize: "80px",
            fontWeight: "900",
            color: "#18181b",
            lineHeight: 1.1,
            letterSpacing: "-3px",
            maxWidth: "900px",
          }}
        >
          {titulo}
        </h1>

        <p
          style={{
            fontSize: "32px",
            color: "#52525b",
            marginTop: "30px",
            fontWeight: "500",
          }}
        >
          Consultora em Audiodescrição · Maquiadora · Palestrante
        </p>
      </div>
    ),
    { ...size }
  );
}