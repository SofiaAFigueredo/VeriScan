'use client'

// Componente raiz da página inicial — orquestra layout, drag-and-drop e cleanup
import { useEffect } from 'react'
import Image from 'next/image'
import IaPessoaImg from '../../../public/RobôPessoa.png'
import { useArquivos } from './hooks/useArquivos'
import { DragOverlay } from './DragOverlay'
import { UploadBox } from './UploadBox'

export function Inicial() {
  // Hook que centraliza toda a lógica de estado e upload de arquivos
  const {
    arquivos,
    isDragOver,
    temArquivos,
    podeAnalisar,
    processarArquivos,
    remover,
    limparServidor,  // Função que chama DELETE /api/cleanup para apagar imagens do servidor
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleAnalisar,
  } = useArquivos()

  // ── Efeito: registra listener para limpar imagens ao fechar/sair do site ──────
  useEffect(() => {
    // "beforeunload" é disparado quando o usuário fecha a aba, navega para fora
    // ou recarrega a página — momento ideal para limpar arquivos do servidor
    const handleBeforeUnload = () => {
      limparServidor() // Envia DELETE /api/cleanup (usa sendBeacon para garantir envio)
    }

    // Registra o listener no evento de saída da página
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Função de limpeza do useEffect: remove o listener quando o componente é desmontado
    // Evita vazamento de memória e múltiplos listeners em caso de re-render
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [limparServidor]) // Reexecuta se limparServidor mudar (não deve acontecer, mas é boa prática)

  // ── Modo drag-and-drop ativa overlay de tela inteira ─────────────────────────
  if (isDragOver) {
    return (
      // Componente de overlay exibido quando o usuário arrasta algo sobre a janela
      <DragOverlay
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      />
    )
  }

  return (
    // Seção principal — a área inteira é zona de drag-and-drop
    <section
      className="overflow-hidden relative min-h-screen"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="container mx-auto relative min-h-screen">

        {/* Imagem decorativa de fundo (robô + pessoa) */}
        <Image
          src={IaPessoaImg}
          alt="Humano com dúvidas, robô com certeza"
          quality={100}
          priority          // Carrega com prioridade (above the fold)
          sizes="(max-width: 768px) 60vw, (max-width: 1024px) 45vw, 600px"
          className="
            absolute bottom-0 left-0 z-0
            w-[99vw] max-w-[380px]
            md:w-[55vw] md:max-w-[480px]
            lg:w-[60vw] lg:max-w-[600px]
            h-auto object-contain
            opacity-30 md:opacity-100
          "
        />

        {/* Layout principal: título à esquerda, caixa de upload à direita */}
        <article className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4">

          {/* Título da página */}
          <div className="px-6 md:px-8 md:flex-1 mt-3 md:mt-20 md:ml-10">
            <h1 className="font-semibold text-3xl md:text-4xl lg:text-5xl leading-tight text-center md:text-left">
              Saiba qual imagem é real
              <span className="mt-2 flex items-center justify-center md:justify-start flex-wrap gap-2">
                e qual é{' '}
                <b className="text-white bg-[#7860E1] px-2 py-1 rounded-md text-3xl md:text-4xl lg:text-5xl">
                  modificada
                </b>
              </span>
            </h1>
          </div>

          {/* Caixa de upload — recebe dados e callbacks do hook */}
          <UploadBox
            arquivos={arquivos}        // Lista de arquivos com status atualizado
            temArquivos={temArquivos}  // Controla qual tela da UploadBox mostrar
            podeAnalisar={podeAnalisar} // Habilita/desabilita botão de análise
            onProcessar={processarArquivos} // Callback ao selecionar/soltar arquivos
            onRemover={remover}        // Callback ao clicar em ✕ em um arquivo
            onAnalisar={handleAnalisar} // Callback do botão "Fazer análise VeriScan"
          />

        </article>
      </div>
    </section>
  )
}