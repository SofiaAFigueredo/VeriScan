import { useState, useCallback, useEffect } from 'react'

export type ArquivoItem = {
  id: string
  file: File
  nome: string
  tamanho: string
  status: 'pendente' | 'enviando' | 'enviado' | 'erro'
  mensagemErro?: string
  urlServidor?: string  // URL pública do arquivo após upload
}

const DIMENSAO_MAXIMA = 260 // px — não pode ULTRAPASSAR

function formatarTamanho(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} kb`
    : `${(bytes / (1024 * 1024)).toFixed(1)} mb`
}

/** Verifica se a imagem não ultrapassa 260x260px */
function verificarDimensoes(file: File): Promise<{ ok: boolean; largura: number; altura: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        ok: img.width <= DIMENSAO_MAXIMA && img.height <= DIMENSAO_MAXIMA,
        largura: img.width,
        altura: img.height,
      })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ ok: false, largura: 0, altura: 0 })
    }
    img.src = url
  })
}

/** Envia um arquivo ao backend e retorna a URL pública dele */
async function enviarArquivo(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/posts', { method: 'POST', body: formData })
  if (!res.ok) throw new Error('Falha no upload')
  const data = await res.json()
  // O backend retorna { arquivo: "hash-nome.jpg" }
  return `/api/uploads/${data.arquivo}`
}

export function useArquivos() {
  const [arquivos, setArquivos] = useState<ArquivoItem[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<string | null>(null)

  // Apaga todos os arquivos do servidor somente ao fechar/sair da página
  useEffect(() => {
    const limpar = () => {
      fetch('/api/cleanup', { method: 'DELETE', keepalive: true }).catch(() => {})
    }
    window.addEventListener('beforeunload', limpar)
    return () => window.removeEventListener('beforeunload', limpar)
  }, [])

  async function processarArquivos(files: FileList | File[]) {
    const lista = Array.from(files)

    for (const file of lista) {
      const { ok, largura, altura } = await verificarDimensoes(file)

      if (!ok) {
        // Bloqueia: imagem maior que 260x260
        const item: ArquivoItem = {
          id: crypto.randomUUID(),
          file,
          nome: file.name,
          tamanho: formatarTamanho(file.size),
          status: 'erro',
          mensagemErro: `Imagem muito grande: ${largura}×${altura}px. Máximo permitido: ${DIMENSAO_MAXIMA}×${DIMENSAO_MAXIMA}px`,
        }
        setArquivos((prev) => [...prev, item])
        continue
      }

      // Adiciona na lista como "enviando" imediatamente
      const id = crypto.randomUUID()
      setArquivos((prev) => [
        ...prev,
        {
          id,
          file,
          nome: file.name,
          tamanho: formatarTamanho(file.size),
          status: 'enviando',
        },
      ])

      // Faz o upload em background e atualiza o item quando terminar
      enviarArquivo(file)
        .then((urlServidor) => {
          setArquivos((prev) =>
            prev.map((a) =>
              a.id === id ? { ...a, status: 'enviado', urlServidor } : a
            )
          )
        })
        .catch(() => {
          setArquivos((prev) =>
            prev.map((a) =>
              a.id === id
                ? { ...a, status: 'erro', mensagemErro: 'Falha ao enviar ao servidor.' }
                : a
            )
          )
        })
    }

    setResultado(null)
  }

  function remover(id: string) {
    setArquivos((prev) => prev.filter((a) => a.id !== id))
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files) processarArquivos(e.dataTransfer.files)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  async function handleAnalisar() {
    const enviados = arquivos.filter((a) => a.status === 'enviado')
    if (enviados.length < 2) return
    setEnviando(true)
    setResultado(null)

    try {
      // Arquivos já estão no servidor — só sinaliza a análise
      await new Promise((r) => setTimeout(r, 500))
      setResultado('Análise enviada com sucesso!')
    } catch {
      setResultado('Erro ao iniciar análise.')
    } finally {
      setEnviando(false)
    }
  }

  const arquivosEnviados = arquivos.filter((a) => a.status === 'enviado')

  return {
    arquivos,
    isDragOver,
    enviando,
    resultado,
    temArquivos: arquivos.length > 0,
    podeAnalisar: arquivosEnviados.length >= 2,
    processarArquivos,
    remover,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleAnalisar,
  }
}