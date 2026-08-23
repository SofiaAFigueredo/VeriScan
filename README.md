# VeriScan

VeriScan é uma aplicação web para apoio à análise forense de imagens. O projeto combina uma interface em Next.js, um backend em Node.js/Express e um módulo Python responsável pelo processamento das imagens.

O fluxo principal é:

1. O usuário envia duas imagens pelo frontend.
2. O frontend encaminha os arquivos para o backend via `/api/upload`.
3. O backend armazena temporariamente os arquivos em `backend/tmp/` e executa o pipeline Python.
4. O resultado é retornado como imagem processada e metadados de análise.

## Estrutura

- `frontend/`: interface web, componentes e tela principal.
- `backend/`: API em Express, upload de arquivos e execução do pipeline.
- `python/`: scripts de análise forense e artefatos do modelo.

## Como rodar

Pré-requisitos:

- Node.js 18+.
- npm.
- Python 3.10+ se você for executar o pipeline localmente.

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

O frontend usa rewrites em `frontend/next.config.ts` para encaminhar `/api/*` para o backend em `http://localhost:3001`.

## Observações

- O backend espera o pipeline em `python/pipeline3_corrigido.py`.
- Arquivos temporários ficam em `backend/tmp/`.
- O endpoint de limpeza é acionado ao sair da página para remover uploads e resultados temporários.
