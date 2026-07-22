# Arquitetura da AGROFLORA IA

## Protótipo atual

```text
Interface mobile (Next.js)
  → POST /api/chat
  → busca lexical em knowledge-base/chunks.json
  → prompt com os quatro trechos mais relevantes
  → Ollama local com gemma3n:e2b
  → resposta e lista de fontes
```

O endpoint testa a disponibilidade do modelo. Sem Ollama ou sem os pesos do Gemma, ele retorna um modo de consulta RAG identificado claramente na interface. Assim, o protótipo nunca apresenta uma resposta estática como se tivesse sido criada pelo modelo.

## Por que RAG em vez de novo treinamento

Leis, publicações e recomendações mudam. Mantê-las fora dos pesos permite atualizar, remover e auditar cada fonte sem treinar o Gemma novamente. A classificação de autoridade também permite priorizar o Planalto em perguntas jurídicas e sinalizar materiais ainda não revisados.

## Aplicativo Android proposto

```text
Pergunta
  → índice local no celular
  → seleção de trechos
  → Gemma 3n E2B no dispositivo
  → resposta com fontes
```

A evolução mobile deverá usar uma versão quantizada compatível com LiteRT-LM, armazenamento local criptografado e atualização opcional da base quando houver conexão.

## Segurança

- temperatura baixa para reduzir variação factual;
- instrução para responder somente com o contexto recuperado;
- prioridade explícita para fontes legais primárias;
- indicação visual quando o Gemma não está ativo;
- alerta obrigatório para decisões legais e agronômicas;
- material fornecido pela equipe marcado como revisão pendente.
