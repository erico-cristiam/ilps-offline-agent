# Arquitetura planejada

## Protótipo do hackathon

O site valida a experiência mobile-first, o diagnóstico inicial, a conversa educacional e a apresentação das fontes. O Kaggle Notebook demonstrará separadamente a inferência com Gemma e a recuperação de conhecimento.

## Produto final

```text
Pergunta do produtor
        ↓
Busca semântica na base local
        ↓
Trechos técnicos e metadados
        ↓
Gemma 3n E2B no dispositivo
        ↓
Resposta educacional + fontes + alertas
```

- Aplicativo Android nativo.
- Gemma 3n E2B Instruction-Tuned.
- Inferência com LiteRT-LM.
- Base técnica e índice armazenados no celular.
- Funcionamento offline após a instalação inicial.
- Dados do produtor preservados no próprio dispositivo.

## Limites de segurança

O agente explica conceitos, cuidados e alternativas. Recomendações dependentes de solo, clima, espécies, doses, custos ou diagnóstico de campo devem ser encaminhadas à assistência técnica.
