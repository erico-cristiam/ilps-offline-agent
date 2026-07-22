# Base de conhecimento

A AGROFLORA IA usa recuperação de contexto (RAG) antes de enviar a pergunta ao Gemma. Os arquivos desta pasta não alteram os pesos do modelo.

## Níveis de autoridade

- `fonte_legal_primaria`: texto oficial, com prioridade em perguntas jurídicas.
- `referencia_tecnica`: publicação técnica usada para educação e planejamento.
- `artigo_cientifico` ou `livro_cientifico`: contexto conceitual e evidência científica.
- `referencia_complementar_revisao_pendente`: material fornecido pela equipe que exige validação antes de orientar uma decisão.

O arquivo `chunks.json` contém trechos curtos e metadados usados pela busca local. O PDF em `documents/` foi preservado como referência da equipe, mas não é tratado como norma jurídica.

## Regra de segurança

Respostas sobre embargo, multas, APP, Reserva Legal, CAR, PRA ou licenciamento são educacionais. A aplicação deve indicar a fonte oficial e recomendar confirmação com o órgão ambiental e um profissional habilitado.
