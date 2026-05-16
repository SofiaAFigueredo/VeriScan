'use client'

// Componente da caixa de upload: exibe a área de seleção e a lista de arquivos
import { useRef } from 'react'
import { ArquivoItem } from './ArquivoItem'
import type { ArquivoItem as ArquivoItemType } from './hooks/useArquivos'

type Props = {
  arquivos: ArquivoItemType[]                      // Lista de arquivos gerenciada pelo hook
  temArquivos: boolean                             // Se já existe pelo menos um arquivo
  podeAnalisar: boolean                            // Habilita o botão de análise
  onProcessar: (files: FileList | File[]) => void  // Callback ao selecionar arquivos
  onRemover: (id: string) => void                  // Callback para remover um arquivo
  onAnalisar: () => void                           // Callback do botão de análise VeriScan
}

// String com todos os MIME types aceitos — usada no atributo "accept" do input
// Espelha a lista do backend (config/multer.js) para filtragem dupla (client + server)
const ACCEPT = [
  'image/jpeg'
].join(',')

export function UploadBox({
  arquivos,
  temArquivos,
  podeAnalisar,
  onProcessar,
  onRemover,
  onAnalisar,
}: Props) {
  // Ref para acionar o input file oculto ao clicar no botão visível
  const inputRef = useRef<HTMLInputElement>(null)

  // Disparado quando o usuário seleciona arquivos pelo diálogo do sistema
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) onProcessar(e.target.files) // Passa os arquivos para o hook
    e.target.value = ''  // Limpa o input para permitir selecionar o mesmo arquivo novamente
  }

  // Conta quantos arquivos foram enviados com sucesso (têm URL do servidor)
  const enviados = arquivos.filter((a) => a.status === 'sucesso').length

  // Conta arquivos ainda em processo (validando ou enviando)
  const emProcesso = arquivos.filter(
    (a) => a.status === 'validando' || a.status === 'enviando'
  ).length

  return (
    <div className="
      bg-white
      w-[min(85vw,300px)] md:w-[280px] lg:w-[420px]
      shrink-0
      mt-0 md:mt-30 lg:mt-46
      mx-auto md:mx-0 md:mr-6 lg:mr-10
      rounded-3xl border-2 border-[#8F8F8F] shadow-xl
      flex flex-col items-center
      px-5 py-5 md:py-6 lg:py-8
      z-10 relative
    ">

      {/* Input de arquivo oculto — acionado programaticamente pelo botão abaixo */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}     // Restringe tipos no diálogo do sistema operacional
        multiple             // Permite selecionar múltiplos arquivos de uma vez
        className="hidden"   // Invisível: só é acionado via ref
        onChange={handleFileChange}
      />

      {/* ── Estado inicial: nenhum arquivo ainda ── */}
      {!temArquivos ? (
        <>
          {/* Botão principal de upload — abre o seletor de arquivo do SO */}
          <button
            onClick={() => inputRef.current?.click()}
            className="bg-[#D8ADEB] rounded-3xl px-8 py-3 font-semibold text-xl lg:text-3xl text-white w-full hover:bg-[#c97aea] cursor-pointer transition-colors"
          >
            Faça upload
          </button>

          {/* Texto alternativo indicando que drag-and-drop também funciona */}
          <p className="font-semibold text-xl lg:text-3xl mt-3 text-center">
            Ou arraste sua imagem
          </p>
        </>
      ) : (
        /* ── Estado com arquivos: lista + ações ── */
        <div className="w-full">

          {/* Botão para adicionar mais arquivos à lista já existente */}
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full bg-[#D8ADEB] text-white text-sm font-semibold rounded-full py-2 px-4 text-center mb-4 hover:bg-[#c97aea] transition-colors cursor-pointer"
          >
            + Adicionar mais imagens
          </button>

          {/* Lista scrollável de arquivos — cada ArquivoItem renderiza uma linha */}
          <div className="flex flex-col gap-2 w-full max-h-56 overflow-y-auto pr-1">
            {arquivos.map((item) => (
              // Cada arquivo renderizado pelo componente ArquivoItem
              <ArquivoItem key={item.id} item={item} onRemover={onRemover} />
            ))}
          </div>

          {/* Linha de status: exibe contadores de enviados e em processo */}
          <p className="mt-2 text-xs text-gray-400 text-center">
            {enviados > 0 && (
              <span className="text-green-600 font-medium">{enviados} enviada{enviados !== 1 ? 's' : ''} </span>
            )}
            {emProcesso > 0 && (
              <span className="text-yellow-500 animate-pulse">{emProcesso} enviando… </span>
            )}
            {enviados === 0 && emProcesso === 0 && 'Nenhuma imagem enviada ainda'}
          </p>

          {/* ── Botão de análise VeriScan ──────────────────────────────────────
              Habilitado apenas quando há 2+ imagens enviadas com sucesso.
              A lógica interna (handleAnalisar) está em aberto para integração futura.
              Quando integrado, chamará a API de análise passando os IDs das imagens.
          ─────────────────────────────────────────────────────────────────────── */}
          <button
            onClick={onAnalisar}
            disabled={!podeAnalisar}  // Desabilitado se não há 2+ imagens enviadas
            className="
              mt-4 w-full
              bg-[#7860E1] text-white
              font-semibold rounded-full py-3
              text-sm lg:text-base
              hover:bg-[#6450c9] transition-colors cursor-pointer
              disabled:opacity-40 disabled:cursor-not-allowed
            "
            title={
              podeAnalisar
                ? 'Iniciar análise VeriScan'
                : 'Envie pelo menos 2 imagens para analisar'
            }
          >
            Fazer análise VeriScan
          </button>

          {/* Mensagem auxiliar quando o botão está desabilitado */}
          {!podeAnalisar && enviados < 2 && (
            <p className="mt-1 text-xs text-gray-400 text-center">
              {2 - enviados} imagem{2 - enviados !== 1 ? 'ns' : ''} ainda necessária{2 - enviados !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
