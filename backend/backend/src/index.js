// Framework web minimalista para Node.js
const express = require('express');

// Middleware de log HTTP — exibe método, rota e status no terminal
const morgan = require('morgan');

// Middleware de CORS — permite requisições cross-origin do frontend
const cors = require('cors');

// path: para montar caminhos de forma multiplataforma
const path = require('path');

// Importa UPLOAD_DIR da config do multer para servir os arquivos estáticos
const { UPLOAD_DIR } = require('./config/multer');

// Cria a instância do servidor Express
const app = express();

// ── Middlewares globais ────────────────────────────────────────────────────────

// Permite requisições vindas do frontend Next.js nas portas 3000 e 3001
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// Interpreta corpo de requisições em JSON
app.use(express.json());

// Interpreta corpo de requisições em formato form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Registra cada requisição no terminal (método, URL, status, tempo)
app.use(morgan('dev'));

// ── Arquivos estáticos ──────────────────────────────────────────────────────────

// Serve as imagens enviadas publicamente em GET /uploads/<nomeArmazenado>
// Ex: http://localhost:4000/uploads/a3f9...b2-foto.jpg
app.use('/uploads', express.static(UPLOAD_DIR));

// ── Rotas da aplicação ──────────────────────────────────────────────────────────

// Registra todas as rotas definidas em routes.js (POST /posts, DELETE /cleanup, etc.)
app.use(require('./routes'));

// ── Inicialização do servidor ───────────────────────────────────────────────────

// Porta do servidor — usa variável de ambiente PORT ou 4000 como padrão
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`VeriScan Backend rodando em http://localhost:${PORT}`);
});
