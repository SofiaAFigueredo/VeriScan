# Backend

Este diretório contém a API do VeriScan. O backend recebe uploads, valida entradas, executa a pipeline Python oficial selecionada e expõe os resultados processados.

## Estrutura

- `src/index.js`: ponto de entrada do servidor Express.
- `src/routes.js`: rotas de upload, processamento, download de arquivos e limpeza.
- `src/config/multer.js`: configuração do Multer para armazenar imagens com nomes únicos.
- `tmp/`: pasta de trabalho para uploads e resultados gerados em tempo de execução.

## Fluxo do código

`src/index.js` inicializa o Express, habilita CORS, parsing de JSON e registra as rotas.

`src/routes.js` implementa:

- `POST /upload`: recebe uma ou duas imagens.
- `POST /process`: chama a pipeline Python oficial com a primeira imagem enviada.
- `GET /uploads/:filename`: entrega arquivos enviados.
- `GET /results/:filename`: entrega os resultados do processamento.
- `DELETE /cleanup`: remove arquivos temporários.

`src/config/multer.js` define:

- diretório de destino em `tmp/uploads`;
- geração de nome aleatório para evitar colisões;
- filtro de MIME types aceitos.

## Como executar

```bash
cd backend
npm install
npm run dev
```

O servidor sobe em `http://localhost:3001` por padrão.
