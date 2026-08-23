
# 🔍 VeriScan: Inteligência Computacional Aplicada à Detecção de Imagens Manipuladas

[![Deploy no GitHub Pages](https://github.com/SofiaAFigueredo/VeriScan/actions/workflows/deploy.yml/badge.svg)](https://github.com/SofiaAFigueredo/VeriScan/actions) 
[![React](https://img.shields.io/badge/Frontend-React%20%2F%20Vite-61DAFB?logo=react)](https://react.dev/) 
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?logo=node.js)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/AI%2FAnalysis-Python%20%2F%20OpenCV-3776AB?logo=python)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

O **VeriScan** é uma plataforma desenvolvida para a verificação automatizada e análise forense da autenticidade de imagens digitais. O projeto alia técnicas clássicas de computação gráfica (como *Error Level Analysis* - ELA e análise de ruído) a modelos avançados de Aprendizado Profundo (*Deep Learning* / CNNs) para identificar e localizar manipulações visuais como **Copy-Move**, **Splicing** (emendas), **Retouching** (retoques) e **Object Removal** (remoção de objetos).

> 🎓 **Projeto de Iniciação Científica (PIBIC-Jr / IFES Campus Serra)**  
> **Núcleo de Estudos em Robótica e Automação (NERA)**  
> **Estudante:** Sofia Alves Figueredo  
> **Orientador:** Prof. Dr. Richard Junior Manuel Godinez Tello  

---

## 📋 Sumário

- [Visão Geral e Arquitetura](#-visão-geral-e-arquitetura)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Repositório](#-estrutura-do-repositório)
- [Como Rodar o Projeto Localmente](#-como-rodar-o-projeto-localmente)
  - [Pré-requisitos](#pré-requisitos)
  - [1. Configurando o Frontend](#1-configurando-o-frontend)
  - [2. Configurando o Backend (Servidor de Upload & Análise)](#2-configurando-o-backend-servidor-de-upload--análise)
- [Simulação de Backend (Modo Demo no Frontend)](#-simulação-de-backend-modo-demo-no-frontend)
- [Publicação e Deploy no GitHub Pages (GitHub Actions)](#-publicação-e-deploy-no-github-pages-github-actions)
- [Referências Científicas](#-referências-científicas)
- [Licença](#-licença)

---

## 🌐 Visão Geral e Arquitetura

A arquitetura do VeriScan é dividida em três módulos principais e integrados:


```

[ Frontend (React/Next.js) ]
│
▼ (HTTP POST / Upload multipart)
[ Backend API (Node.js/Express) ]
│
▼ (Processamento de Imagens e Infeferência de IA)
[ Módulo de Análise Forense (Python + OpenCV / PyTorch / TensorFlow) ]

```

1. **Frontend (`VeriScan-Upload-FroentEnd`)**: Interface web intuitiva e responsiva desenvolvida em React para upload de arquivos por *drag-and-drop*, seleção de parâmetros e exibição interativa do mapa de manipulação.
2. **Backend (`VeriScan-Upload-BackEnd`)**: Servidor em Node.js com Express responsável por gerenciar as rotas de API, recebimento dos uploads, armazenamento temporário e comunicação com os scripts de análise.
3. **Módulo de Análise Forense**: Algoritmos de visão computacional em Python que geram máscaras ELA, mapas de calor e predições por redes convolucionais (CNNs).

---

## ✨ Funcionalidades

- 📤 **Upload Inteligente de Imagens:** Suporte aos formatos JPG, PNG e WEBP com pré-visualização instantânea.
- 🔬 **Error Level Analysis (ELA):** Destaca discrepâncias na taxa de compressão JPEG para indicar áreas alteradas ou inseridas.
- 🧠 **Detecção por Aprendizado Profundo:** Classificação automatizada entre imagem *Autêntica* ou *Manipulada* com nível de confiança (Score).
- 📊 **Comparador Visual:** Exibição lado a lado (Imagem Original vs. Mapa de Calor do Erro).
- ⚡ **Modo de Simulação (Mock):** Permite rodar o frontend de forma 100% estática (ex: GitHub Pages) simulando as respostas da API sem a necessidade de um backend ativo.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React.js** (com Vite ou Next.js)
- **TypeScript / JavaScript (ES6+)**
- **Lucide React / Tailwind CSS / shadcn/ui** (para componentes de interface)
- **Axios** (para chamadas HTTP)

### Backend
- **Node.js** & **Express**
- **Multer** (manipulação e upload de arquivos)
- **Cors** & **dotenv**

### Módulo de Análise & IA
- **Python 3.10+**
- **OpenCV**, **Pillow (PIL)**, **NumPy**
- **PyTorch / TensorFlow / Scikit-Learn**

---

## 📁 Estrutura do Repositório

```bash
VeriScan/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline CI/CD para deploy automático no GitHub Pages
├── frontend/                   # Interface Web em React (VeriScan-Upload-FroentEnd)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Componentes de Upload, Resultado e Comparador
│   │   ├── services/
│   │   │   └── api.js          # Conexão com API e Simulação (Mock)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/                    # Servidor REST em Node.js (VeriScan-Upload-BackEnd)
│   ├── uploads/                # Armazenamento temporário das imagens
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
└── README.md

```

---

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos

* **Node.js** (v18.0.0 ou superior)
* **npm** ou **yarn**
* **Python 3.10+** (caso queira rodar os modelos de IA nativamente)

---

### 1. Configurando o Frontend

```bash
# Clone este repositório
git clone [https://github.com/SofiaAFigueredo/VeriScan.git](https://github.com/SofiaAFigueredo/VeriScan.git)

# Acesse a pasta do frontend
cd VeriScan/frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

```

A aplicação abrirá no seu navegador no endereço: `http://localhost:5173`.

---

### 2. Configurando o Backend (Servidor de Upload & Análise)

Em uma nova janela do terminal:

```bash
# Acesse a pasta do backend
cd VeriScan/backend

# Instale as dependências
npm install

# Inicie o servidor Node.js
npm start

```

O servidor estará rodando no endereço: `http://localhost:3000`.


---


## 📚 Referências Científicas

* **AHIRWAR, S.; PANDEY, A.** *Digital Image Forgery Detection using Convolutional Neural Network (CNN): A Survey.* IEEE SCEECS, 2024.
* **SINGH, A. K.; SHARMA, C.; SINGH, B. K.** *Image forgery localization and detection using multiple deep learning algorithm with ELA.* ICFIRTP, IEEE, 2022.
* **PATEL, et al.** *Image Manipulation Detection using Deep Learning and Error Level Analysis.* 2023.

---

## 📄 Licença

Este projeto é desenvolvido para fins educacionais e científicos no **Instituto Federal do Espírito Santo (IFES)** sob a licença [MIT](https://www.google.com/search?q=LICENSE).

```
