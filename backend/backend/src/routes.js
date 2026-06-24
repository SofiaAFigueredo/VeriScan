const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.resolve(__dirname, '..', 'tmp', 'uploads');

// Garante que a pasta de uploads existe
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// POST /posts — recebe uma imagem, salva em disco, retorna o nome do arquivo
routes.post('/posts', multer(multerConfig).single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ erro: 'Nenhum arquivo enviado.' });
    }
    console.log('Arquivo recebido:', req.file.filename);
    return res.json({ message: 'upload feito', arquivo: req.file.filename });
});

// GET /uploads/:filename — serve a imagem salva para o frontend abrir pelo link
routes.get('/uploads/:filename', (req, res) => {
    const filename = path.basename(req.params.filename); // evita path traversal
    const filePath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ erro: 'Arquivo não encontrado.' });
    }

    res.sendFile(filePath);
});

// DELETE /cleanup — apaga todos os arquivos da pasta uploads (chamado ao fechar o site)
routes.delete('/cleanup', (req, res) => {
    try {
        const arquivos = fs.readdirSync(UPLOAD_DIR);
        arquivos.forEach((arquivo) => {
            fs.unlinkSync(path.join(UPLOAD_DIR, arquivo));
        });
        console.log(`Limpeza: ${arquivos.length} arquivo(s) removido(s).`);
        return res.json({ message: `${arquivos.length} arquivo(s) removido(s).` });
    } catch (err) {
        console.error('Erro ao limpar uploads:', err);
        return res.status(500).json({ erro: 'Erro ao limpar arquivos.' });
    }
});

module.exports = routes;