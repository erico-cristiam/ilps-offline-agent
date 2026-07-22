# ILPS no Campo

Agente educacional offline-first sobre Integração Lavoura-Pecuária-Silvicultura para pequenos e médios produtores da Amazônia.

Projeto desenvolvido para o **Build with Gemma: Amazon Eco-Hack**, realizado na Universidade Federal do Acre (UFAC).

## O que este repositório contém

- Protótipo web mobile-first da experiência do produtor.
- Estrutura para o notebook técnico do Kaggle.
- Catálogo inicial da base de conhecimento sobre ILPS/ILPF.
- Documentação da arquitetura planejada para o aplicativo Android offline.

## Executar o protótipo

Requisitos: Node.js 22 ou superior.

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Estado atual

A interface possui respostas demonstrativas para validar o fluxo educacional. O pipeline real **Gemma 3n E2B + RAG** será apresentado em um Kaggle Notebook e, na evolução do produto, executado localmente no Android por meio do LiteRT-LM.

## Princípios

1. Funcionar em ambientes com conectividade limitada.
2. Traduzir conhecimento técnico para uma linguagem acessível.
3. Apresentar fontes verificáveis junto às respostas.
4. Apoiar a aprendizagem sem substituir assistência agronômica.

## Aviso

Este é um protótipo educacional. As respostas não constituem prescrição agronômica e não substituem diagnóstico de campo ou assistência técnica qualificada.
