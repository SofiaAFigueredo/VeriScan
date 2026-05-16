'use client'

// Componente que exibe uma linha na lista de arquivos com miniatura, status e ações
import { ThumbnailPreview } from './ThumbnailPreview'
import type { ArquivoItem as ArquivoItemType } from './hooks/useArquivos'

type Props = {
  item: ArquivoItemType           // Dados do arquivo a exibir
  onRemover: (id: string) => void // Callback para remover o arquivo da lista
}

// Mapeamento de status → cor da bolinha de status e rótulo acessível
const statusConfig = {
  validando: { cor: 'bg-gray-400',   label: 'Validando' },
  enviando:  { cor: 'bg-yellow-400', label: 'Enviando'  },
  sucesso:   { cor: 'bg-green-500',  label: 'Enviado'   },
  erro:      { cor: 'bg-red-500',    label: 'Erro'      },
}

export function ArquivoItem({ item, onRemover }: Props) {
  // Busca a configuração visual para o status atual do arquivo
  const cfg = statusConfig[item.status]

  // O arquivo está em processo (não deve ser removido nem interagir)
  const emProcesso = item.status === 'validando' || item.status === 'enviando'

  return (
    // Linha do arquivo: miniatura | nome+status | ações
    <div className="flex items-center gap-3 py-2 border-b border-gray-100">

      {/* Miniatura: preview da imagem antes do upload */}
      <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
        <ThumbnailPreview file={item.file} />
      </div>

      {/* Coluna central: nome do arquivo + informações de status */}
      <div className="flex-1 min-w-0">

        {/* Nome do arquivo — truncado se for muito longo */}
        <p className="text-sm font-medium text-gray-900 truncate">{item.nome}</p>

        {/* Linha de informações secundárias */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tamanho do arquivo formatado */}
          <span className="text-xs text-gray-500">{item.tamanho}</span>

          {/* Mostra mensagem de erro caso o upload tenha falhado */}
          {item.mensagemErro && (
            <span className="text-xs text-red-500">{item.mensagemErro}</span>
          )}

          {/* Indicador animado enquanto o arquivo está sendo enviado */}
          {item.status === 'enviando' && (
            <span className="text-xs text-yellow-600 animate-pulse">Enviando…</span>
          )}

          {/* Indicador de validação antes do upload começar */}
          {item.status === 'validando' && (
            <span className="text-xs text-gray-400 animate-pulse">Aguardando…</span>
          )}
        </div>
      </div>

      {/* Coluna de ações: bolinha de status + botão de link (se enviado) + botão remover */}
      <div className="flex items-center gap-1 flex-shrink-0">

        {/* Bolinha colorida indicando o status atual do arquivo */}
        <span
          title={cfg.label}
          className={`w-2 h-2 rounded-full ${cfg.cor} flex-shrink-0`}
        />

        {/* Botão de link — só aparece quando o upload foi concluído com sucesso */}
        {item.status === 'sucesso' && item.urlServidor && (
          <a
            href={item.urlServidor}      // URL pública retornada pelo backend
            target="_blank"              // Abre em nova aba
            rel="noopener noreferrer"    // Segurança: impede acesso ao window.opener
            title={`Abrir imagem (ID: ${item.idServidor})`} // Tooltip com o ID do servidor
            className="
              w-6 h-6 rounded-full
              bg-[#7860E1] hover:bg-[#6450c9]
              flex items-center justify-center
              text-white text-[11px]
              transition-colors cursor-pointer
            "
          >
            {/* Ícone de link externo */}
            ↗
          </a>
        )}

        {/* Botão de remover arquivo da lista */}
        <button
          onClick={() => onRemover(item.id)} // Chama o callback passado pelo pai
          disabled={emProcesso}               // Desabilitado enquanto está enviando
          className="
            w-6 h-6 rounded-full
            bg-red-400 hover:bg-red-600
            flex items-center justify-center
            text-white text-[10px]
            transition-colors cursor-pointer
            disabled:opacity-30 disabled:cursor-not-allowed
          "
          title="Remover"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
