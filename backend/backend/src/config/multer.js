// Importações necessárias para configuração do multer
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp'); // Biblioteca para manipulação de imagens (resize)

// Caminho da pasta onde os arquivos serão salvos temporariamente
const UPLOAD_DIR = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');

module.exports = {
  // Pasta de destino padrão (usada como fallback)
  dest: UPLOAD_DIR,

  // Configuração de armazenamento em disco
  storage: multer.diskStorage({

    // Define a pasta de destino para cada arquivo recebido
    destination: (req, file, cb) => {
      cb(null, UPLOAD_DIR); // Salva em backend/tmp/uploads/
    },

    // Define o nome do arquivo salvo em disco
    filename: (req, file, cb) => {
      // Gera 16 bytes aleatórios para criar um ID único e evitar colisões de nome
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err); // Repassa o erro se a geração falhar

        // Formato final: <hash_hex>-<nome_original>  ex: "a3f9...b2-foto.jpg"
        const fileName = `${hash.toString('hex')}-${file.originalname}`;
        cb(null, fileName);
      });
    },
  }),

  // Filtro de tipos permitidos — rejeita arquivos que não sejam imagens
  fileFilter: (req, file, cb) => {
    // Lista de MIME types aceitos pelo sistema
    const allowedMimes = ['image/jpeg'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); // Tipo válido: permite o upload
    } else {
      cb(new Error('Tipo de arquivo inválido.')); // Tipo inválido: rejeita
    }
  },

  // Expõe o caminho da pasta para uso externo (ex: limpeza de arquivos)
  UPLOAD_DIR,
};
