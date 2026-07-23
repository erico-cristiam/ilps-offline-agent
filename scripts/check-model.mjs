const baseUrl = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434";
const model = process.env.OLLAMA_MODEL ?? "gemma3n:e2b";
const generationTimeoutMs = Number(process.env.OLLAMA_CHECK_TIMEOUT_MS ?? 300000);

async function requireOk(response, operation) {
  if (response.ok) return response;

  const details = (await response.text()).trim();
  throw new Error(`${operation} falhou com HTTP ${response.status}${details ? `: ${details}` : ""}`);
}

try {
  const tagsResponse = await fetch(`${baseUrl}/api/tags`, {
    signal: AbortSignal.timeout(5000),
  });
  await requireOk(tagsResponse, "Consulta ao Ollama");
  const data = await tagsResponse.json();
  const names = (data.models ?? []).map((item) => item.name);
  const available = names.some((name) => name === model || name.startsWith(`${model}:`));

  if (!available) {
    console.error(`O Ollama está ativo, mas ${model} não foi encontrado.`);
    console.error(`Execute: ollama pull ${model}`);
    process.exitCode = 1;
  } else {
    console.log(`${model} encontrado. Testando uma geração local curta...`);

    const generationResponse = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(generationTimeoutMs),
      body: JSON.stringify({
        model,
        prompt: "Responda apenas a palavra OK.",
        stream: false,
        keep_alive: "5m",
        options: { temperature: 0, num_ctx: 1024, num_predict: 8 },
      }),
    });
    await requireOk(generationResponse, "Teste de geração");
    const generation = await generationResponse.json();

    if (!generation.response?.trim()) {
      throw new Error("O modelo foi carregado, mas retornou uma resposta vazia.");
    }

    console.log(`AGROFLORA IA pronta: ${model} gerou uma resposta em ${baseUrl}.`);
  }
} catch (error) {
  console.error("O teste completo do Gemma falhou.");
  console.error("Confirme que o Ollama está iniciado e execute: ollama pull gemma3n:e2b");
  console.error("Se o erro mencionar CUDA, consulte a seção de solução de problemas no README.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
