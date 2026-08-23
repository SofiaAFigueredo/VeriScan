const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const UPLOAD_DIR = path.resolve(__dirname, '..', 'tmp', 'uploads');
const RESULT_DIR = path.resolve(__dirname, '..', 'tmp', 'results');
const PIPELINE_PATH = path.resolve(__dirname, '..', '..', 'python', 'pipeline.py');
const PYTHON_PATH = path.resolve(__dirname, '..', '..', 'python', '.venv', 'bin', 'python');

for (const dir of [UPLOAD_DIR, RESULT_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function limparDiretorio(dir) {
  if (!fs.existsSync(dir)) {
    return 0;
  }

  const arquivos = fs.readdirSync(dir);
  arquivos.forEach((arquivo) => {
    fs.unlinkSync(path.join(dir, arquivo));
  });
  return arquivos.length;
}

function rodarPipeline(inputA, inputB, operation) {
  return new Promise((resolve, reject) => {
    const interpretador = fs.existsSync(PYTHON_PATH) ? PYTHON_PATH : 'python3';
    const processo = spawn(interpretador, [
      PIPELINE_PATH,
      '--input-a',
      inputA,
      '--input-b',
      inputB,
      '--operation',
      operation,
      '--output-dir',
      RESULT_DIR,
    ]);

    let stdout = '';
    let stderr = '';

    processo.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    processo.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    processo.on('error', (erro) => {
      reject(erro);
    });

    processo.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `Pipeline finalizado com codigo ${code}.`));
        return;
      }

      try {
        const linhas = stdout.trim().split('\n').filter(Boolean);
        const payload = JSON.parse(linhas[linhas.length - 1]);
        resolve(payload);
      } catch (erro) {
        reject(new Error(`Falha ao interpretar a saida do pipeline. ${erro.message}`));
      }
    });
  });
}

routes.post('/upload', multer(multerConfig).array('files', 2), (req, res) => {
  if (!req.files || req.files.length !== 2) {
    return res.status(400).json({ erro: 'Envie exatamente duas imagens.' });
  }

  return res.json({
    files: req.files.map((file) => ({
      fileName: file.filename,
      originalName: file.originalname,
      imageUrl: `/api/uploads/${file.filename}`,
    })),
  });
});

routes.post('/process', async (req, res) => {
  const { fileNames, operation } = req.body;

  if (!Array.isArray(fileNames) || fileNames.length !== 2 || !operation) {
    return res.status(400).json({ erro: 'fileNames com duas imagens e operation sao obrigatorios.' });
  }

  if (!['subtracao', 'ela', 'gradiente'].includes(operation)) {
    return res.status(400).json({ erro: 'Operacao invalida.' });
  }

  const inputA = path.join(UPLOAD_DIR, path.basename(fileNames[0]));
  const inputB = path.join(UPLOAD_DIR, path.basename(fileNames[1]));

  if (!fs.existsSync(inputA) || !fs.existsSync(inputB)) {
    return res.status(404).json({ erro: 'Uma ou mais imagens nao foram encontradas.' });
  }

  try {
    const resultado = await rodarPipeline(inputA, inputB, operation);
    const resultFile = path.basename(resultado.image);
    return res.json({
      operation: resultado.operation,
      imageUrl: `/api/results/${resultFile}`,
      metrics: resultado.metrics,
      summary: resultado.summary,
      fileNames,
    });
  } catch (erro) {
    console.error('Erro ao rodar pipeline:', erro);
    return res.status(500).json({ erro: 'Falha ao executar o pipeline.', detalhe: erro.message });
  }
});

routes.get('/uploads/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(UPLOAD_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ erro: 'Arquivo nao encontrado.' });
  }

  return res.sendFile(filePath);
});

routes.get('/results/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(RESULT_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ erro: 'Resultado nao encontrado.' });
  }

  return res.sendFile(filePath);
});

routes.delete('/cleanup', (req, res) => {
  try {
    const removidos = limparDiretorio(UPLOAD_DIR) + limparDiretorio(RESULT_DIR);
    return res.json({ message: `${removidos} arquivo(s) removido(s).` });
  } catch (erro) {
    console.error('Erro ao limpar arquivos:', erro);
    return res.status(500).json({ erro: 'Erro ao limpar arquivos.' });
  }
});

module.exports = routes;
