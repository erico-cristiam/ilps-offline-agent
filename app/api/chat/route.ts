import { NextResponse } from "next/server";
import knowledge from "@/knowledge-base/chunks.json";

type KnowledgeChunk = (typeof knowledge)[number];
type ChatMessage = { role: "assistant" | "user"; content: string };

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "gemma3n:e2b";
const stopWords = new Set(["a", "ao", "aos", "as", "com", "como", "da", "das", "de", "do", "dos", "e", "em", "na", "nas", "no", "nos", "o", "os", "para", "por", "que", "um", "uma"]);

function terms(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 2 && !stopWords.has(term));
}

function retrieve(question: string, limit = 4) {
  const queryTerms = terms(question);

  return knowledge
    .map((chunk) => {
      const title = terms(chunk.title);
      const tags = terms(chunk.tags.join(" "));
      const content = terms(chunk.content);
      const score = queryTerms.reduce((total, term) => {
        return total + (title.includes(term) ? 5 : 0) + (tags.includes(term) ? 3 : 0) + content.filter((item) => item === term).length;
      }, 0) + (chunk.authority === "fonte_legal_primaria" && /lei|legal|embargo|multa|app|reserva|car|pra/i.test(question) ? 20 : 0);
      return { chunk, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ chunk }) => chunk);
}

function sourceView(chunk: KnowledgeChunk) {
  return {
    id: chunk.id,
    title: chunk.title,
    institution: chunk.institution,
    authority: chunk.authority,
    url: chunk.url,
  };
}

function retrievalFallback(chunks: KnowledgeChunk[]) {
  const extracts = chunks.slice(0, 2).map((chunk) => chunk.content).join("\n\n");
  return `O Gemma ainda não está iniciado neste computador. A busca local encontrou estas informações na base:\n\n${extracts}\n\nUse as fontes abaixo para conferir o contexto. Em questões jurídicas ou de manejo, confirme a situação concreta com o órgão competente e assistência técnica.`;
}

function buildContext(chunks: KnowledgeChunk[]) {
  return chunks.map((chunk, index) => [
    `[${index + 1}] ${chunk.title}`,
    `Instituição: ${chunk.institution}`,
    `Nível: ${chunk.authority}`,
    `Conteúdo: ${chunk.content}`,
    `URL: ${chunk.url}`,
  ].join("\n")).join("\n\n");
}

function sanitizeAnswer(value: string) {
  return value
    .replace(/\*\*/g, "")
    .replace(/^\s*\*[\s▁]+/gm, "- ")
    .trim();
}

export async function GET() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(2500) });
    if (!response.ok) throw new Error("Ollama indisponível");
    const data = await response.json() as { models?: Array<{ name: string }> };
    const available = data.models?.some(({ name }) => name === OLLAMA_MODEL || name.startsWith(`${OLLAMA_MODEL}:`)) ?? false;
    return NextResponse.json({ connected: available, model: OLLAMA_MODEL, mode: available ? "gemma" : "retrieval" });
  } catch {
    return NextResponse.json({ connected: false, model: OLLAMA_MODEL, mode: "retrieval" });
  }
}

export async function POST(request: Request) {
  const body = await request.json() as {
    question?: string;
    profile?: { propertySize?: string; activity?: string };
    history?: ChatMessage[];
  };
  const question = body.question?.trim();

  if (!question) {
    return NextResponse.json({ error: "A pergunta é obrigatória." }, { status: 400 });
  }

  const chunks = retrieve(question);
  const sources = chunks.map(sourceView);
  const system = `Você é a AGROFLORA IA, tutora educacional sobre Integração Lavoura-Pecuária-Floresta na Amazônia. Responda em português brasileiro simples, objetivo e acolhedor. Use somente o CONTEXTO recuperado. Não invente artigos, percentuais, resultados ou referências. Diferencie fonte legal primária, referência técnica e conteúdo de divulgação com revisão pendente. Não use negrito, asteriscos duplos ou títulos em Markdown; escreva em texto simples e, quando necessário, use listas iniciadas por hífen. Em perguntas jurídicas, deixe claro que a resposta é educacional, que ILPF não causa desembargo automático e que a decisão sobre cessação de embargo ou regularização cabe à autoridade ambiental competente. Para recomendações de manejo, peça validação de assistência técnica. Termine com uma seção curta "Fontes consultadas" citando os números do contexto.`;
  const profile = `Perfil informado: ${body.profile?.propertySize ?? "não informado"}; atividade principal: ${body.profile?.activity ?? "não informada"}.`;

  try {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(300000),
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        keep_alive: "30m",
        options: { temperature: 0.2, num_ctx: 4096, num_predict: 350 },
        messages: [
          { role: "system", content: system },
          ...(body.history ?? []).slice(-6),
          { role: "user", content: `${profile}\n\nCONTEXTO:\n${buildContext(chunks)}\n\nPERGUNTA:\n${question}` },
        ],
      }),
    });

    if (!response.ok) throw new Error(`Ollama respondeu com HTTP ${response.status}`);
    const data = await response.json() as { message?: { content?: string } };
    const answer = sanitizeAnswer(data.message?.content ?? "");
    if (!answer) throw new Error("Resposta vazia do modelo");

    return NextResponse.json({ answer, sources, mode: "gemma", model: OLLAMA_MODEL });
  } catch {
    return NextResponse.json({
      answer: retrievalFallback(chunks),
      sources,
      mode: "retrieval",
      model: OLLAMA_MODEL,
      warning: "Instale/inicie o Ollama e execute `ollama pull gemma3n:e2b` para ativar a geração local.",
    });
  }
}
