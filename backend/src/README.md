# `src`

Código-fonte do backend Express.

## Arquivos

- `index.js`: cria o servidor, aplica middlewares e registra as rotas.
- `routes.js`: define upload, processamento, download e limpeza.
- `config/multer.js`: centraliza a configuração de upload de arquivos.

## Observação

Os caminhos internos usam `backend/tmp/` para artefatos temporários e `python/` para o pipeline de análise.
