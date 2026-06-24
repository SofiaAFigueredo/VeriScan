'use client'

import { ThumbnailPreview } from './ThumbnailPreview'
import type { ArquivoItem as ArquivoItemType } from './hooks/useArquivos'

type Props = {
  item: ArquivoItemType
  onRemover: (id: string) => void
}

export function ArquivoItem({ item, onRemover }: Props) {
  const temErro = item.status === 'erro'
  const enviando = item.status === 'enviando'
  const enviado = item.status === 'enviado'

  return (
    <div className={`flex items-center gap-3 py-2 border-b ${temErro ? 'border-red-200 bg-red-50 rounded-lg px-2' : 'border-gray-100'}`}>

      {/* Miniatura */}
      <div className="w-14 h-14 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
        {temErro ? (
          <div className="w-full h-full flex items-center justify-center text-red-400 text-xl">✕</div>
        ) : (
          <ThumbnailPreview file={item.file} />
        )}
      </div>

      {/* Nome, tamanho e erro */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${temErro ? 'text-red-700' : 'text-gray-900'}`}>
          {item.nome}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{item.tamanho}</span>
          {!temErro && (
            <span className={`text-xs font-medium ${enviando ? 'text-yellow-500' : enviado ? 'text-green-600' : ''}`}>
              {enviando ? 'Enviando...' : enviado ? 'Enviado ✓' : ''}
            </span>
          )}
          <button
            onClick={() => onRemover(item.id)}
            className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
          >
            Excluir
          </button>
        </div>
        {temErro && item.mensagemErro && (
          <p className="text-xs text-red-600 mt-0.5">{item.mensagemErro}</p>
        )}
      </div>

      {/* Ícones de ação */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {temErro ? (
          <span className="w-5 h-5 rounded-full bg-red-400 flex items-center justify-center text-white text-[10px]">
            ✕
          </span>
        ) : enviando ? (
          /* Spinner enquanto faz upload */
          <span className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-white text-[10px] animate-spin">
            ◌
          </span>
        ) : enviado ? (
          <>
            {/* Ícone de link — abre a imagem no servidor numa nova aba */}
            <a
              href={item.urlServidor}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir imagem no servidor"
              className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-white text-[10px] hover:bg-gray-800 cursor-pointer"
            >
              🔗
            </a>
            <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px]">
              ✓
            </span>
          </>
        ) : null}

        {/* Botão de remover */}
        <button
          onClick={() => onRemover(item.id)}
          className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] cursor-pointer hover:bg-red-600"
        >
          ✕
        </button>
      </div>
    </div>
  )
}