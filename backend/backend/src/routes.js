// Router do Express — agrupa todas as rotas da aplicação
const routes = require('express').Router();

// Multer: middleware para processar multipart/form-data (upload de arquivos)
const multer = require('multer');

// Configurações customizadas do multer (storage, fileFilter, UPLOAD_DIR)
const multerConfig = require('./config/multer');

// Sharp: biblioteca para redimensionar imagens após o upload
const sharp = require('sharp');

// fs/promises: para operações de arquivo assíncronas (substituir arquivo redimensionado)
const fs = require('fs/promises');

// path: para montar caminhos de arquivo de forma multiplataforma
const path = require('path');

// Instancia o multer com as configurações definidas em config/multer.js
const upload = multer(multerConfig);

// URL base do servidor — usada para montar o link público de cada imagem
const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';

// Limite máximo de pixels (largura e altura) que uma imagem pode ter ao ser servida
const MAX_PIXELS = 260;

// ─────────────────────────────────────────────
// POST /posts — recebe uma imagem e faz upload
// ─────────────────────────────────────────────
routes.post('/posts', upload.single('file'), async (req, res) => {

  // Se o multer não recebeu nenhum arquivo, retorna erro 400
  if (!req.file) {
    return res.status(400).json({ erro: 'Nenhum arquivo enviado ou tipo inválido.' });
  }

  // Caminho completo do arquivo salvo em disco pelo multer
  const filePath = req.file.path;

  try {
    // Lê os metadados da imagem (largura, altura, formato) sem carregar os pixels
    const metadata = await sharp(filePath).metadata();

    const largura = metadata.width || 0;   // Largura original em pixels
    const altura = metadata.height || 0;   // Altura original em pixels

    // Verifica se a imagem ultrapassa o limite de 260px em qualquer dimensão
    const precisaRedimensionar = largura > MAX_PIXELS || altura > MAX_PIXELS;

    if (precisaRedimensionar) {
      // Redimensiona mantendo proporção: o lado maior será exatamente MAX_PIXELS
      // O lado menor é calculado automaticamente pelo sharp (fit: 'inside')
      const imagemRedimensionada = await sharp(filePath)
        .resize(MAX_PIXELS, MAX_PIXELS, {
          fit: 'inside',       // Não corta: cabe dentro do box 260x260
          withoutEnlargement: true, // Nunca amplia imagem menor que o limite
        })
        .toBuffer(); // Retorna o resultado como Buffer (bytes em memória)

      // Sobrescreve o arquivo original salvo pelo multer com a versão redimensionada
      await fs.writeFile(filePath, imagemRedimensionada);
    }

    // Relê os metadados da versão final (pode ter sido redimensionada)
    const metadataFinal = await sharp(filePath).metadata();

    console.log(
      `Arquivo recebido: ${req.file.originalname}` +
      ` → ${metadataFinal.width}x${metadataFinal.height}px` +
      ` (${precisaRedimensionar ? 'redimensionado' : 'tamanho ok'})`
    );

    // Retorna 201 Created com os dados do arquivo e a URL pública
    return res.status(201).json({
      message: 'Upload realizado com sucesso!',
      arquivo: {
        id: req.file.filename,                              // ID único gerado pelo multer (hash-nome)
        url: `${BASE_URL}/uploads/${req.file.filename}`,    // Link público para abrir a imagem
        nomeOriginal: req.file.originalname,               // Nome original enviado pelo usuário
        tamanho: req.file.size,                            // Tamanho em bytes (antes do resize)
        tipo: req.file.mimetype,                           // MIME type da imagem
        dimensoes: {
          largura: metadataFinal.width,                    // Largura final após processamento
          altura: metadataFinal.height,                    // Altura final após processamento
        },
      },
    });

  } catch (err) {
    // Erro ao processar a imagem com sharp (ex: arquivo corrompido)
    console.error('Erro ao processar imagem:', err);
    return res.status(500).json({ erro: 'Erro ao processar a imagem.' });
  }
});

// ─────────────────────────────────────────────
// DELETE /cleanup — apaga todos os arquivos da pasta uploads
// Chamado pelo frontend quando o usuário fecha/sai do site
// ─────────────────────────────────────────────
routes.delete('/cleanup', async (req, res) => {
  try {
    // Lista todos os arquivos dentro da pasta de uploads
    const arquivos = await fs.readdir(multerConfig.UPLOAD_DIR);

    // Remove cada arquivo encontrado
    await Promise.all(
      arquivos.map((nome) =>
        fs.unlink(path.join(multerConfig.UPLOAD_DIR, nome))
          .catch(() => {}) // Ignora silenciosamente arquivos que já foram removidos
      )
    );

    console.log(`Cleanup: ${arquivos.length} arquivo(s) removido(s).`);
    return res.status(200).json({ removidos: arquivos.length });

  } catch (err) {
    console.error('Erro no cleanup:', err);
    return res.status(500).json({ erro: 'Erro ao limpar arquivos.' });
  }
});

// ─────────────────────────────────────────────
// Middleware global de erro do Multer
// Captura erros lançados pelo fileFilter (tipo inválido) e outros erros do multer
// ─────────────────────────────────────────────
routes.use((err, req, res, next) => {
  if (err) {
    return res.status(422).json({ erro: err.message }); // Retorna 422 Unprocessable Entity
  }
  next(); // Se não houver erro, passa para o próximo middleware
});

// Exporta o router para ser registrado no index.js
module.exports = routes;
