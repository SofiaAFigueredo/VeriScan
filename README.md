# VeriScan — Upload Integrado

Projeto com Frontend (Next.js) e Backend (Express + Multer) integrados.

## Estrutura

```
VeriScan-Integrado/
├── backend/   → Express + Multer (porta 4000)
└── frontend/  → Next.js (porta 3001)
```

## Como rodar

### 1. Backend

```bash
cd backend
npm install
npm run dev
# Rodando em http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev -- --port 3001
# Rodando em http://localhost:3001
```

> O Next.js está configurado com **proxy reverso**: requisições para `/api/*`
> são automaticamente redirecionadas para `http://localhost:4000/*`.
> Não é necessário configurar CORS manualmente no frontend.

## O que foi integrado

### Backend
- Adicionado **CORS** liberando `localhost:3000` e `localhost:3001`
- Porta alterada para **4000** (evita conflito com o Next.js)
- Rota `POST /posts` agora retorna dados do arquivo (`nomeOriginal`, `tamanho`, `tipo`)
- Tratamento de erro do Multer via middleware (tipo inválido retorna HTTP 422)

### Frontend
- `next.config.ts`: **proxy reverso** `/api/:path*` → `http://localhost:4000/:path*`
- `useArquivos.ts`:
  - Validação de tipo no cliente antes de enviar
  - Status por arquivo: `pendente | enviando | sucesso | erro`
  - Upload sequencial com feedback individual
  - Mensagem de resultado com contagem de sucessos/erros
- `ArquivoItem.tsx`: indicador visual de status por arquivo (cinza/amarelo/verde/vermelho)
- `UploadBox.tsx`:
  - `accept` corrigido para aceitar todos os tipos suportados pelo backend
  - Contador de imagens válidas
  - Lista com scroll quando há muitos arquivos
