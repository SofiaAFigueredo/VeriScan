// Hook customizado que gerencia todo o estado e lógica de upload de arquivos
import { useState, useCallback } from 'react'

// Possíveis estados de cada arquivo durante o ciclo de vida do upload
export type StatusUpload = 'validando' | 'enviando' | 'sucesso' | 'erro'

// Estrutura de dados de cada arquivo gerenciado pelo hook
export type ArquivoItem = {
  id: string              // ID local temporário (gerado pelo browser antes do upload)
  file: File              // Referência ao objeto File original do browser
  nome: string            // Nome original do arquivo
  tamanho: string         // Tamanho formatado para exibição (ex: "1.2 MB")
  status: StatusUpload    // Estado atual deste arquivo
  mensagemErro?: string   // Mensagem de erro caso o upload falhe
  urlServidor?: string    // URL pública retornada pelo backend após upload bem-sucedido
  idServidor?: string     // ID (filename) retornado pelo backend após upload bem-sucedido
}

// Formata bytes em string legível (KB ou MB)
function formatarTamanho(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`          // Menor que 1 MB: mostra em KB
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB` // Maior que 1 MB: mostra em MB
}

// MIME types aceitos pelo sistema — espelha a lista do backend (config/multer.js)
const TIPOS_ACEITOS = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'image/svg+xml', 'image/bmp', 'image/tiff', 'image/x-icon',
  'image/heif', 'image/heic', 'image/avif', 'image/jp2',
  'image/jpx', 'image/jpm', 'image/vnd.microsoft.icon',
  'image/apng', 'image/x-xbitmap', 'image/x-xpixmap',
  'image/x-portable-bitmap', 'image/x-portable-graymap',
  'image/x-portable-pixmap', 'image/x-cmu-raster', 'image/ief',
]

export function useArquivos() {
  // Lista de todos os arquivos sendo gerenciados (pendentes, enviando, enviados, erros)
  const [arquivos, setArquivos] = useState<ArquivoItem[]>([])

  // Controla se o usuário está arrastando um arquivo sobre a janela
  const [isDragOver, setIsDragOver] = useState(false)

  // ── Função: fazer upload de um único arquivo para o backend ──────────────────
  async function uploadArquivo(item: ArquivoItem): Promise<void> {
    // Monta o FormData com o campo "file" — nome esperado pelo multer no backend
    const formData = new FormData()
    formData.append('file', item.file)

    // Atualiza o status do arquivo para "enviando" enquanto a requisição ocorre
    setArquivos((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, status: 'enviando' } : a))
    )

    try {
      // Faz a requisição POST para /api/posts
      // O Next.js faz proxy para http://localhost:4000/posts (configurado em next.config.ts)
      const res = await fetch('/api/posts', { method: 'POST', body: formData })

      // Converte a resposta para JSON
      const data = await res.json()

      // Se o servidor retornou erro HTTP, lança exceção com a mensagem do backend
      if (!res.ok) throw new Error(data.erro || `HTTP ${res.status}`)

      // Upload bem-sucedido: salva a URL e o ID retornados pelo servidor
      setArquivos((prev) =>
        prev.map((a) =>
          a.id === item.id
            ? {
                ...a,
                status: 'sucesso',
                urlServidor: data.arquivo.url,  // Link público da imagem no servidor
                idServidor: data.arquivo.id,    // Nome do arquivo gerado pelo backend
              }
            : a
        )
      )
    } catch (err) {
      // Salva a mensagem de erro no item para exibição na UI
      const msg = err instanceof Error ? err.message : 'Erro desconhecido'
      setArquivos((prev) =>
        prev.map((a) =>
          a.id === item.id ? { ...a, status: 'erro', mensagemErro: msg } : a
        )
      )
    }
  }

  // ── Função: processar novos arquivos selecionados ou arrastados ───────────────
  async function processarArquivos(files: FileList | File[]) {
    // Para cada arquivo recebido, cria um ArquivoItem e valida o tipo
    const novos: ArquivoItem[] = Array.from(files).map((file) => {
      const tipoValido = TIPOS_ACEITOS.includes(file.type) // Verifica MIME type

      return {
        id: crypto.randomUUID(), // ID local único gerado pelo browser
        file,
        nome: file.name,
        tamanho: formatarTamanho(file.size),
        status: tipoValido ? 'validando' : 'erro',             // Inicia como validando
        mensagemErro: tipoValido ? undefined : 'Tipo não suportado',
      }
    })

    // Adiciona os novos arquivos à lista de estado (antes de fazer upload)
    setArquivos((prev) => [...prev, ...novos])

    // Filtra apenas os arquivos com tipo válido e inicia o upload automaticamente
    const validos = novos.filter((a) => a.status === 'validando')
    for (const item of validos) {
      // Upload sequencial: aguarda cada um terminar antes de começar o próximo
      await uploadArquivo(item)
    }
  }

  // ── Função: remover um arquivo da lista ──────────────────────────────────────
  function remover(id: string) {
    setArquivos((prev) => prev.filter((a) => a.id !== id)) // Remove pelo ID local
  }

  // ── Função: chamada ao fechar/sair da página ──────────────────────────────────
  // Envia DELETE /api/cleanup para o backend apagar todos os arquivos do servidor
  async function limparServidor() {
    try {
      // sendBeacon é preferido no unload pois não é cancelado pelo browser
      const payload = JSON.stringify({ acao: 'cleanup' })
      if (navigator.sendBeacon) {
        // Usa sendBeacon quando disponível — mais confiável durante o fechamento
        navigator.sendBeacon('/api/cleanup', new Blob([payload], { type: 'application/json' }))
      } else {
        // Fallback com fetch keepalive para manter a requisição mesmo após unload
        fetch('/api/cleanup', { method: 'DELETE', keepalive: true })
      }
    } catch {
      // Ignora erros no cleanup — o servidor também pode limpar periodicamente
    }
  }

  // ── Handlers de drag-and-drop ─────────────────────────────────────────────────

  // Ativado quando o usuário arrasta um arquivo sobre a área da página
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()         // Impede comportamento padrão do browser (abrir arquivo)
    setIsDragOver(true)        // Mostra overlay de "solte aqui"
  }, [])

  // Ativado quando o usuário sai da área de drop sem soltar
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)       // Esconde o overlay
  }, [])

  // Ativado quando o usuário solta o arquivo sobre a área
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)       // Remove overlay

    // Processa os arquivos soltados (FileList vinda do evento de drag)
    if (e.dataTransfer.files.length > 0) processarArquivos(e.dataTransfer.files)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Handler: análise VeriScan ─────────────────────────────────────────────────
  // Placeholder — a lógica real será integrada com outro sistema no futuro
  // Os arquivos já foram enviados automaticamente ao serem validados
  // Aqui ficará a chamada para a API de análise quando ela for implementada
  function handleAnalisar() {
    const enviados = arquivos.filter((a) => a.status === 'sucesso')
    // TODO: integrar com a API de análise VeriScan
    // Exemplo de como ficará:
    // const ids = enviados.map((a) => a.idServidor)
    // await fetch('/api/analise', { method: 'POST', body: JSON.stringify({ ids }) })
    console.log('Análise VeriScan iniciada para:', enviados.map((a) => a.idServidor))
  }

  // Arquivos que foram enviados com sucesso (prontos para análise)
  const arquivosEnviados = arquivos.filter((a) => a.status === 'sucesso')

  // O botão de análise fica disponível quando há pelo menos 2 imagens enviadas com sucesso
  const podeAnalisar = arquivosEnviados.length >= 2

  return {
    arquivos,                  // Lista completa de arquivos
    isDragOver,                // Se está em modo drag
    temArquivos: arquivos.length > 0, // Se há pelo menos um arquivo na lista
    podeAnalisar,              // Se o botão de análise deve estar habilitado
    processarArquivos,         // Adiciona e faz upload de novos arquivos
    remover,                   // Remove um arquivo da lista
    limparServidor,            // Apaga todos os arquivos do servidor (uso no unload)
    handleDrop,                // Handler de drop para drag-and-drop
    handleDragOver,            // Handler de dragover
    handleDragLeave,           // Handler de dragleave
    handleAnalisar,            // Handler do botão "Análise VeriScan"
  }
}
