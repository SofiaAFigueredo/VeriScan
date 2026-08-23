# 🔍 VeriScan: Web Application for Digital Image Forensics
> **VeriScan: Aplicação Web e Inteligência Computacional Aplicada à Análise Forense de Imagens**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-green?logo=node.js)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Pipeline-Python%203.10%2B-blue?logo=python)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/ML-PyTorch-ee4c2c?logo=pytorch)](https://pytorch.org/)
[![Institution](https://img.shields.io/badge/Institution-Ifes--Campus--Serra-006633)](https://www.ifes.edu.br/)

---

## 📄 Table of Contents / Sumário
* [English](#-english)
  * [Overview & Purpose](#-overview--purpose)
  * [Key Operations](#-key-operations)
  * [System Architecture & Flow](#-system-architecture--flow)
  * [Project Structure](#-project-structure)
  * [API Endpoints](#-api-endpoints)
  * [How to Run](#-how-to-run)
* [Português (Brasil)](#-português-brasil)
  * [Visão Geral e Propósito](#-visão-geral-e-propósito)
  * [Operações Suportadas](#-operações-suportadas)
  * [Arquitetura do Sistema e Fluxo](#-arquitetura-do-sistema-e-fluxo)
  * [Estrutura do Projeto](#-estrutura-do-projeto)
  * [Endpoints da API](#-endpoints-da-api)
  * [Como Rodar](#-como-rodar-o-projeto)
* [Academic Context & Credits](#-academic-context--credits)

---

## 🇬🇧 English

### 🎯 Overview & Purpose
**VeriScan** is a full-stack web application designed for digital image forensic analysis and visual comparison. Built under an academic research initiative, the application allows users to upload pair-wise images, run computational tests (such as subtraction, ELA, and gradient operations), and inspect the resulting heatmaps/outputs directly from an intuitive web interface.

The platform links a modern web stack (Next.js & Express) with a local Python environment equipped with deep learning models to support digital forensics and forgery analysis.

---

### ⚙️ Key Operations

VeriScan currently supports three primary image comparison operations:

* **`subtracao` (Subtraction):** Calculates pixel-level difference between two target images to detect visual discrepancies.
* **`ela` (Error Level Analysis):** Analyzes JPEG compression artifacts across different levels to highlight modified regions.
* **`gradiente` (Gradient):** Evaluates image intensity gradients to identify structural edge anomalies and tampered areas.

---

### 🔬 System Architecture & Flow

The project consists of three core components:

1. **`frontend/`**: Next.js (TypeScript) interface offering drag-and-drop file uploads, image previews, operation selection, and interactive result rendering.
2. **`backend/`**: Node.js REST API using Express and Multer to handle temporary uploads, spawn child Python processes, serve output images, and clean up temporary storage.
3. **`python/`**: Python virtual environment (`.venv`) hosting trained model weights (`cnndetection_model.pth`) and execution scripts (`pipeline3.py`).

```text
[User] ──(Drag & Drop / Select 2 Images)──► [Next.js Frontend]
                                                  │
                                           (POST /api/upload)
                                                  ▼
                                        [Express Backend API] ──(Saves to backend/tmp/uploads)
                                                  │
                                           (POST /api/process)
                                                  ▼
                                      [Python Pipeline Process]
                                  (Runs pipeline3.py)
                                                  │
                                     (Outputs to backend/tmp/results)
                                                  ▼
[User] ◄──(Displays Image & Summary)─── [Next.js Frontend]

```

#### Detailed Execution Workflow:

1. The user selects or drags two images into the web UI (`frontend/src/app/_components/inicial.tsx`).
2. The frontend sends both images to `POST /api/upload`.
3. The backend validates and temporarily stores the images in `backend/tmp/uploads`.
4. The user selects an operation (`subtracao`, `ela`, or `gradiente`) and triggers `POST /api/process`.
5. The Express backend spawns `python/pipeline3.py` via `python/.venv/bin/python`.
6. The resulting visual output is generated in `backend/tmp/results` and served back to the UI.

---

### 📁 Project Structure

```text
VeriScan/
├── frontend/                     # Next.js Frontend Application
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx          # Main entry route
│   │       ├── layout.tsx        # Root layout & app metadata
│   │       ├── globals.css       # Global styles & CSS variables
│   │       └── _components/
│   │           └── inicial.tsx   # Core UI (drag & drop, upload, test execution)
│   ├── next.config.ts            # Rewrites (/api/* -> http://localhost:3001)
│   └── package.json
│
├── backend/                      # Node.js/Express REST API
│   ├── src/
│   │   ├── index.js              # Express server setup
│   │   ├── routes.js             # API route definitions & child process logic
│   │   └── config/
│   │       └── multer.js         # Multer upload & image MIME validation
│   ├── tmp/                      # Temporary storage
│   │   ├── uploads/              # Uploaded input images
│   │   └── results/              # Processed output images
│   └── package.json
│
└── python/                       # Machine Learning & Forensic Execution
    ├── .venv/                    # Local Python virtual environment
    ├── cnndetection_model.pth    # PyTorch model weights artifact
    └── pipeline3.py    # Forensic pipeline execution script

```

---

### 🔌 API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/upload` | Uploads exactly two target images (`jpeg`, `png`, `webp`, `bmp`, `tiff`). |
| `POST` | `/api/process` | Executes the forensic pipeline (`fileNames` array & `operation`). |
| `GET` | `/api/uploads/:filename` | Serves an uploaded input image. |
| `GET` | `/api/results/:filename` | Serves a processed result/heatmap image. |
| `DELETE` | `/api/cleanup` | Removes temporary files from `backend/tmp/uploads` and `backend/tmp/results`. |

---

### 🚀 How to Run

#### Prerequisites

* **Node.js**: v18.0.0 or higher
* **npm**: Node package manager
* **Python**: v3.10 or higher (for local pipeline execution)

#### 1. Start the Backend API

```bash
cd backend
npm install
npm run dev

```

*The Express server will launch on `http://localhost:3001`.*

#### 2. Configure the Python Environment

Ensure your virtual environment and dependencies are set up inside `python/`:

```bash
cd python
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install torch torchvision opencv-python pillow numpy matplotlib

```

> **Note:** The backend executes `python/pipeline3.py` using arguments `--input-a`, `--input-b`, `--operation`, and `--output-dir`. Ensure this script exists in the `python/` folder.

#### 3. Start the Frontend Application

```bash
cd frontend
npm install
npm run dev

```

*Open `http://localhost:3000` in your browser. Next.js automatically rewrites `/api/*` to `http://localhost:3001`.*

---

## 🇧🇷 Português (Brasil)

### 🎯 Visão Geral e Propósito

O **VeriScan** é uma aplicação web full-stack desenvolvida para análise forense digital e comparação de imagens. Construído em contexto de pesquisa acadêmica, o sistema permite que o usuário envie duas imagens, execute exames computacionais (como subtração, ELA e gradiente) e visualize os mapas de calor e resultados processados diretamente na interface web.

A plataforma integra uma stack moderna (Next.js e Express) a um ambiente local em Python equipado com modelos de aprendizado profundo para apoiar a investigação de fraudes e manipulações visuais.

---

### ⚙️ Operações Suportadas

Atualmente, o VeriScan suporta três operações principais de análise:

* **`subtracao`:** Realiza a diferença direta entre os pixels de duas imagens para destacar discrepâncias visuais.
* **`ela` (Error Level Analysis):** Analisa as diferenças nos níveis de compressão JPEG para identificar áreas modificadas.
* **`gradiente`:** Avalia variações na intensidade da imagem para identificar anomalias nas bordas e estruturas da cena.

---

### 🔬 Arquitetura do Sistema e Fluxo

O projeto está dividido em três módulos principais:

1. **`frontend/`**: Interface em Next.js (TypeScript) com drag-and-drop, preview de imagens, seleção de exames e exibição interativa de resultados.
2. **`backend/`**: API REST em Node.js com Express e Multer. Recebe os uploads, gerencia os arquivos temporários, dispara o processo Python e entrega os arquivos processados.
3. **`python/`**: Ambiente virtual Python (`.venv`) contendo os pesos do modelo pré-treinado (`cnndetection_model.pth`) e o script do pipeline (`pipeline3.py`).

```text
[Usuário] ──(Arrasta / Seleciona 2 Imagens)──► [Frontend Next.js]
                                                      │
                                               (POST /api/upload)
                                                      ▼
                                            [Backend Express API] ──(Salva em backend/tmp/uploads)
                                                      │
                                               (POST /api/process)
                                                      ▼
                                           [Execução do Pipeline Python]
                                          (Roda pipeline3.py)
                                                      │
                                         (Salva em backend/tmp/results)
                                                      ▼
[Usuário] ◄──(Exibe Imagem & Resumo)────── [Frontend Next.js]

```

#### Fluxo Detalhado do Código:

1. O usuário seleciona ou arrasta duas imagens na interface (`frontend/src/app/_components/inicial.tsx`).
2. O frontend envia os arquivos para `POST /api/upload`.
3. O backend armazena as imagens temporariamente na pasta `backend/tmp/uploads`.
4. O usuário escolhe a operação desejada (`subtracao`, `ela` ou `gradiente`) e aciona a requisição `POST /api/process`.
5. O Express dispara o script `python/pipeline3.py` utilizando o executável `python/.venv/bin/python`.
6. A imagem resultante é salva em `backend/tmp/results` e enviada para exibição na tela do usuário.

---

### 📁 Estrutura do Projeto

```text
VeriScan/
├── frontend/                     # Aplicação Web Next.js
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx          # Rota principal
│   │       ├── layout.tsx        # Layout raiz e metadados
│   │       ├── globals.css       # Estilos globais e variáveis de tema
│   │       └── _components/
│   │           └── inicial.tsx   # Componente da interface (upload, testes e preview)
│   ├── next.config.ts            # Redirecionamento de rotas (/api/* -> localhost:3001)
│   └── package.json
│
├── backend/                      # API REST em Node.js / Express
│   ├── src/
│   │   ├── index.js              # Inicialização do servidor Express
│   │   ├── routes.js             # Rotas e chamadas do processo Python
│   │   └── config/
│   │       └── multer.js         # Validação de tipos MIME e salvamento de uploads
│   ├── tmp/                      # Diretório de armazenamento temporário
│   │   ├── uploads/              # Imagens enviadas pelo usuário
│   │   └── results/              # Resultados gerados pela análise
│   └── package.json
│
└── python/                       # Pipeline Forense em Python
    ├── .venv/                    # Ambiente virtual Python local
    ├── cnndetection_model.pth    # Pesos do modelo de aprendizado profundo
    └── pipeline3.py    # Script principal do pipeline de análise

```

---

### 🔌 Endpoints da API

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/api/upload` | Recebe exatamente duas imagens (`jpeg`, `png`, `webp`, `bmp`, `tiff`). |
| `POST` | `/api/process` | Executa o pipeline de análise recebendo o array `fileNames` e a `operation`. |
| `GET` | `/api/uploads/:filename` | Entrega uma imagem original enviada. |
| `GET` | `/api/results/:filename` | Entrega o arquivo de resultado/mapa de calor gerado. |
| `DELETE` | `/api/cleanup` | Remove os arquivos temporários de `backend/tmp/uploads` e `backend/tmp/results`. |

---

### 🚀 Como Rodar o Projeto

#### Pré-requisitos

* **Node.js**: Versão 18.0 ou superior
* **npm**: Gerenciador de pacotes do Node
* **Python**: Versão 3.10 ou superior

#### 1. Configurando e Rodando o Backend

```bash
cd backend
npm install
npm run dev

```

*O servidor Express estará ativo em `http://localhost:3001`.*

#### 2. Configurando o Ambiente Python

Certifique-se de configurar o ambiente virtual e instalar as dependências na pasta `python/`:

```bash
cd python
python3 -m venv .venv
source .venv/bin/activate  # No Windows: .venv\Scripts\activate
pip install torch torchvision opencv-python pillow numpy matplotlib

```

> **Aviso:** O backend invoca o script `python/pipeline3.py` aceitando os argumentos `--input-a`, `--input-b`, `--operation` e `--output-dir`. Certifique-se de que o script esteja presente com essa nomenclatura.

#### 3. Configurando e Rodando o Frontend

```bash
cd frontend
npm install
npm run dev

```

*Acesse `http://localhost:3000` no seu navegador. O Next.js utiliza o rewrite configurado em `next.config.ts` para redirecionar `/api/*` automaticamente para a porta `3001`.*

---

### 💡 Observações Importantes

* **Limpeza de Temporários:** Ao fechar ou sair da página no frontend, o sistema envia uma requisição automática para `DELETE /api/cleanup`, mantendo o servidor limpo.
* **Formatos de Arquivo:** O Multer aceita exclusivamente os tipos `image/jpeg`, `image/png`, `image/webp`, `image/bmp` e `image/tiff`.

---

## 🏛 Academic Context & Credits

* **Institution:** Instituto Federal do Espírito Santo (Ifes) - Campus Serra
* **Program:** Programa de Iniciação Científica, Tecnológica e de Inovação (PICTI)
* **Research Group:** NERA (Núcleo de Estudos em Robótica e Automação)
* **Project Title:** VeriScan: Inteligência Computacional Aplicada à Detecção de Imagens Manipuladas
