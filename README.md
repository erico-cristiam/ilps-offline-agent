# ILPS no Campo

Protótipo de um aplicativo educacional sobre Integração Lavoura-Pecuária-Silvicultura, criado para o **Build with Gemma: Amazon Eco-Hack**, na Universidade Federal do Acre.

![Capa do projeto](public/og.png)

## O problema

Pequenos e médios produtores da Amazônia nem sempre têm conexão estável ou acesso imediato a materiais técnicos. Ao mesmo tempo, sistemas integrados exigem planejamento e não podem ser tratados como uma receita única para qualquer propriedade.

O ILPS no Campo foi pensado como uma ponte entre o produtor e o conhecimento técnico: explica conceitos em linguagem direta, organiza uma trilha de aprendizagem e mostra de onde vem cada informação.

## O que construímos no hackathon

Esta versão é um protótipo web que simula a experiência do futuro aplicativo Android. Ela permite:

- cadastrar um perfil básico da propriedade;
- conversar com um tutor de ILPS;
- consultar respostas demonstrativas acompanhadas de fontes;
- seguir uma trilha curta de aprendizagem;
- responder a um quiz;
- navegar por uma biblioteca técnica local.

As respostas da interface ainda são pré-configuradas. A execução real do **Gemma 3n E2B com RAG** será demonstrada no notebook do Kaggle.

## Como executar

Requisitos:

- Node.js 22.13 ou superior;
- npm.

```bash
git clone https://github.com/erico-cristiam/ilps-offline-agent.git
cd ilps-offline-agent
npm install
npm run dev
```

Abra `http://localhost:3000`.

Para validar a versão de produção:

```bash
npm test
```

## Arquitetura proposta

```text
Pergunta do produtor
        ↓
Busca na base técnica armazenada no celular
        ↓
Trechos relevantes e referências
        ↓
Gemma 3n E2B executado no dispositivo
        ↓
Resposta educacional, fonte e alerta técnico
```

O notebook do Kaggle será usado para carregar o modelo, preparar os documentos, demonstrar o RAG e registrar os testes. A evolução para Android prevê inferência local com LiteRT-LM.

Mais detalhes estão em [`docs/architecture.md`](docs/architecture.md).

## Organização do repositório

```text
app/                 interface do protótipo
docs/                decisões técnicas e arquitetura
evaluation/          perguntas usadas nos testes
kaggle-notebooks/    roteiro do notebook público
knowledge-base/      catálogo das fontes selecionadas
public/              mídia do projeto
worker/              entrada da aplicação para execução web
```

## Limitações atuais

- O modelo Gemma ainda não está conectado à interface web.
- As respostas do chat são exemplos controlados para demonstrar a experiência.
- A base de documentos ainda será revisada e ampliada.
- O protótipo não fornece prescrição agronômica nem substitui assistência técnica.

## Próximas entregas

1. Notebook Kaggle com Gemma 3n E2B e recuperação de documentos.
2. Avaliação das respostas em português com perguntas de ILPS.
3. Vídeo público de até três minutos.
4. Writeup técnico da submissão.
5. Prova de conceito Android com inferência no dispositivo.

## Fontes iniciais

- Embrapa — Integração Lavoura-Pecuária-Floresta: perguntas e respostas.
- Embrapa — Sistemas de ILPF na Região Norte do Brasil.
- Embrapa Florestas — Integração Lavoura-Pecuária-Floresta.

O catálogo com os endereços e o estado de revisão está em [`knowledge-base/sources.csv`](knowledge-base/sources.csv).
