import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "AGROFLORA IA — conhecimento e capacitação ILPF na Amazônia",
    description: "Tutora educacional offline com Gemma 3n e base verificável sobre ILPF para produtores da Amazônia.",
    openGraph: {
      title: "AGROFLORA IA",
      description: "Conhecimento e capacitação ILPF na Amazônia.",
      images: [{ url: `${origin}/agroflora-cover.jpeg`, width: 1440, height: 768, alt: "AGROFLORA IA — conhecimento e capacitação ILPF na Amazônia" }],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "AGROFLORA IA",
      description: "Conhecimento e capacitação ILPF na Amazônia.",
      images: [`${origin}/agroflora-cover.jpeg`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
