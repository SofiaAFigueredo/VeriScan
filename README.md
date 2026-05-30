# VeriScan

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
