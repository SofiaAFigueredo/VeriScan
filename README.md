# VeriScan: Inteligência Computacional Aplicada à Detecção de Imagens Manipuladas

O **VeriScan** é um projeto de pesquisa aplicada desenvolvido no **Núcleo de Estudos em Robótica e Automação (NERA)** do **Instituto Federal do Espírito Santo (Ifes) - Campus Serra**.O objetivo central é o desenvolvimento e a avaliação de métodos automatizados para a detecção passiva de manipulações em imagens digitais (como *copy-move*, *splicing*, *retouching* e *object removal*), combinando técnicas forenses tradicionais (como *Error Level Analysis - ELA*) com modelos modernos de *Deep Learning*

Este repositório contém a implementação da solução completa da plataforma, dividida em uma API de processamento (Backend) e uma interface interativa de usuário (Frontend).

## Arquitetura do Projeto

O ecossistema é distribuído de forma modular:
* **`/backend`**: API desenvolvida em Express responsável pelo recebimento, armazenamento temporário e processamento analítico das imagens.
* **`/frontend`**: Interface interativa em Next.js para upload de arquivos, exibição de máscaras de adulteração e relatórios visuais.

## Como Executar o Projeto Completo

Certifique-se de possuir o [Node.js](https://nodejs.org/) instalado em sua máquina.

### 1. Inicializando o Backend
```bash
cd backend
npm install
npm run dev
# API rodando em http://localhost:4000

```

### 2. Inicializando o Frontend

```bash
cd frontend
npm install
npm run dev
# Interface rodando em http://localhost:3001

```

> ⚙️ **Configuração de Rede:** O Next.js está configurado com **proxy reverso**: requisições para `/api/*` são automaticamente redirecionadas para `http://localhost:4000/*`. Não é necessário configurar CORS manualmente no frontend.

## 🎓 Contexto Científico (PICTI Ifes)

O desenvolvimento deste software foi segmentado e viabilizado por meio dos seguintes planos de trabalho de iniciação científica:

1. **Avaliação de Técnicas Forenses Clássicas em Imagens Digitais:** Atua na implementação de algoritmos de ELA, análise de ruído e transformadas de frequência.


2. **Avaliação de Redes Neurais Profundas na Detecção de Manipulação de Imagens:** Atua na implementação, treinamento e avaliação de modelos baseados em redes neurais profundas.


3. **Preparação de Bases de Imagens Manipuladas para Sistemas de Detecção Automatizada:** Atua no levantamento, organização e preparação dos dados visuais e pipelines de pré-processamento.


4. **Interface Gráfica para Análise de Detecção de Imagens Manipuladas do VeriScan:** Atua no desenvolvimento de uma interface gráfica interativa para visualização e comparação clara dos resultados.



---

📍 **Laboratório:** Núcleo de Estudos em Robótica e Automação (NERA) - Ifes Campus Serra.
