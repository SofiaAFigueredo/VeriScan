# Frontend

Interface web do VeriScan, construída com Next.js, TypeScript, Tailwind e componentes utilitários.

## Estrutura principal

- `src/app/page.tsx`: página inicial que renderiza a interface principal.
- `src/app/layout.tsx`: layout raiz, metadata e fonte global.
- `src/app/globals.css`: estilos globais e tokens de tema.
- `src/app/_components/`: componentes da tela principal.
- `src/components/ui/`: componentes de UI reutilizáveis.
- `src/lib/utils.ts`: utilitários compartilhados.

## Componentes mais relevantes

- `src/app/_components/inicial.tsx`: tela principal, seleção de imagens, upload e execução da análise.
- `src/app/_components/UploadBox.tsx`: caixa de upload e lista de arquivos.
- `src/app/_components/ArquivoItem.tsx`: linha individual de um arquivo no upload.
- `src/app/_components/ThumbnailPreview.tsx`: miniatura temporária do arquivo local.
- `src/app/_components/DragOverlay.tsx`: sobreposição de drag-and-drop.
- `src/app/_components/hooks/useArquivos.ts`: estado e lógica de envio dos arquivos.

## Como executar

```bash
cd frontend
npm install
npm run dev
```

O Next.js usa rewrites para encaminhar `/api/*` para o backend local.
