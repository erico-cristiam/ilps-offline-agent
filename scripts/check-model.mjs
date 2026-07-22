const baseUrl = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434";
const model = process.env.OLLAMA_MODEL ?? "gemma3n:e2b";

try {
  const response = await fetch(`${baseUrl}/api/tags`);
  if (!response.ok) throw new Error(`Ollama respondeu com HTTP ${response.status}`);
  const data = await response.json();
  const names = (data.models ?? []).map((item) => item.name);
  const available = names.some((name) => name === model || name.startsWith(`${model}:`));

  if (!available) {
    console.error(`O Ollama está ativo, mas ${model} não foi encontrado.`);
    console.error(`Execute: ollama pull ${model}`);
    process.exitCode = 1;
  } else {
    console.log(`AGROFLORA IA pronta: ${model} disponível em ${baseUrl}.`);
  }
} catch (error) {
  console.error("Não foi possível conectar ao Ollama.");
  console.error("Instale o Ollama, inicie o serviço e execute: ollama pull gemma3n:e2b");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
