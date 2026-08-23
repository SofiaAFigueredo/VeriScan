'use client'

import { useEffect, useRef, useState } from 'react'

type OperationKey = 'subtracao' | 'ela' | 'gradiente'

type ArquivoLocal = {
  id: string
  file: File
  previewUrl: string
}

type ArquivoServidor = {
  fileName: string
  originalName: string
  imageUrl: string
}

type ResultadoProcessamento = {
  operation: OperationKey
  imageUrl: string
  metrics: Record<string, string | number>
  summary: string
  fileNames: string[]
}

const operationLabels: Record<OperationKey, string> = {
  subtracao: 'Teste de subtração',
  ela: 'Teste ELA',
  gradiente: 'Teste gradiente',
}

async function parseResponse(response: Response) {
  const text = await response.text()

  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`Resposta inválida do servidor: ${text.slice(0, 120)}`)
  }
}

export function Inicial() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [arquivos, setArquivos] = useState<ArquivoLocal[]>([])
  const [arquivosServidor, setArquivosServidor] = useState<ArquivoServidor[]>([])
  const [resultado, setResultado] = useState<ResultadoProcessamento | null>(null)
  const [status, setStatus] = useState('Selecione duas imagens para iniciar.')
  const [carregandoUpload, setCarregandoUpload] = useState(false)
  const [carregandoTeste, setCarregandoTeste] = useState<OperationKey | null>(null)
  const [arrastando, setArrastando] = useState(false)

  useEffect(() => {
    return () => {
      arquivos.forEach((arquivo) => URL.revokeObjectURL(arquivo.previewUrl))
    }
  }, [arquivos])

  useEffect(() => {
    const limpar = () => {
      fetch('/api/cleanup', { method: 'DELETE', keepalive: true }).catch(() => {})
    }

    window.addEventListener('beforeunload', limpar)
    return () => window.removeEventListener('beforeunload', limpar)
  }, [])

  function abrirSeletor() {
    inputRef.current?.click()
  }

  function adicionarArquivos(selecionados: File[]) {
    if (selecionados.length === 0) return

    setArquivos((prev) => {
      const atualizados = [...prev]

      for (const file of selecionados) {
        if (atualizados.length >= 2) break

        atualizados.push({
          id: `${file.name}-${atualizados.length}-${crypto.randomUUID()}`,
          file,
          previewUrl: URL.createObjectURL(file),
        })
      }

      setArquivosServidor([])
      setResultado(null)
      setStatus(
        atualizados.length === 2
          ? 'Duas imagens selecionadas. Agora envie para o backend.'
          : 'Imagem adicionada. Selecione mais uma imagem para liberar o envio.'
      )

      return atualizados
    })
  }

  function handleArquivos(event: React.ChangeEvent<HTMLInputElement>) {
    const selecionados = Array.from(event.target.files ?? [])
    adicionarArquivos(selecionados)
    event.target.value = ''
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setArrastando(false)
    adicionarArquivos(Array.from(event.dataTransfer.files ?? []))
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setArrastando(true)
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setArrastando(false)
  }

  function removerArquivo(indice: number) {
    setArquivos((prev) => {
      const arquivo = prev[indice]
      if (!arquivo) return prev

      URL.revokeObjectURL(arquivo.previewUrl)
      return prev.filter((_, currentIndex) => currentIndex !== indice)
    })

    setArquivosServidor([])
    setResultado(null)
    setStatus('Slot liberado. Selecione duas imagens para iniciar.')
  }

  async function carregarArquivos() {
    if (arquivos.length !== 2) {
      setStatus('Selecione exatamente duas imagens antes de carregar.')
      return
    }

    setCarregandoUpload(true)
    setResultado(null)

    try {
      const formData = new FormData()
      arquivos.forEach((arquivo) => formData.append('files', arquivo.file))

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await parseResponse(response)
      if (!response.ok) {
        throw new Error(data.erro || 'Falha ao carregar as imagens.')
      }

      setArquivosServidor(data.files)
      setStatus('As duas imagens foram carregadas para o espaço de análise.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao carregar as imagens.'
      setStatus(message)
    } finally {
      setCarregandoUpload(false)
    }
  }

  async function executarTeste(operation: OperationKey) {
    if (arquivosServidor.length !== 2) {
      setStatus('Carregue as duas imagens antes de executar um teste.')
      return
    }

    setCarregandoTeste(operation)

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileNames: arquivosServidor.map((arquivo) => arquivo.fileName),
          operation,
        }),
      })

      const data = await parseResponse(response)
      if (!response.ok) {
        throw new Error(data.erro || 'Falha ao executar o teste.')
      }

      setResultado(data)
      setStatus(`${operationLabels[operation]} concluído.`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao executar o teste.'
      setStatus(message)
    } finally {
      setCarregandoTeste(null)
    }
  }

  const prontoParaUpload = arquivos.length === 2
  const prontoParaTeste = arquivosServidor.length === 2

  return (
    <main
      className={`h-screen w-full overflow-hidden bg-[linear-gradient(180deg,#f5f7fb_0%,#e8edf8_100%)] text-slate-900 ${arrastando ? 'ring-4 ring-sky-300 ring-inset' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleArquivos}
      />

      <div className="relative mx-auto flex h-full w-full max-w-[1600px] flex-col px-4 py-4 sm:px-6 md:px-8 lg:px-10 xl:px-14">
        <div className="pointer-events-none absolute inset-0 hidden opacity-55 lg:block">
          <div className="absolute -left-10 top-44 h-56 w-56 border border-slate-300/70" />
          <div className="absolute right-0 top-6 h-32 w-60">
            <div className="absolute left-0 top-5 h-px w-24 bg-slate-400" />
            <div className="absolute left-24 top-5 h-10 w-px bg-slate-400" />
            <div className="absolute left-24 top-15 h-px w-24 bg-slate-400" />
            <div className="absolute left-48 top-15 h-12 w-px bg-slate-400" />
            <div className="absolute left-48 top-27 h-px w-24 bg-slate-400" />
            <div className="absolute right-0 top-27 h-12 w-px bg-slate-400" />
          </div>
        </div>

        <header className="relative z-10 mb-4 flex shrink-0 flex-col gap-2 sm:mb-6">
          <p className="inline-flex w-fit rounded-full border border-slate-300 bg-white/70 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-600">
            VeriScan
          </p>
          <div className="flex items-start justify-between gap-6">
            <h1 className="max-w-5xl text-[1.9rem] font-light leading-[1] tracking-[-0.035em] text-slate-800 sm:text-[2.3rem] lg:text-[2.9rem] lg:leading-[0.95] lg:tracking-[-0.045em]">
              Visão Computacional, Deep Learning e Padrões
            </h1>
          </div>
        </header>

        <section className="relative z-10 grid min-h-0 flex-1 gap-4 grid-cols-1 lg:grid-cols-2 lg:gap-6">
          <article className="flex min-h-0 flex-col rounded-[1.8rem] border border-slate-200 bg-white/88 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-4 lg:p-5">
            <div className="mb-4 shrink-0 rounded-[0.95rem] bg-[linear-gradient(90deg,#3d86d9_0%,#244a7c_100%)] px-5 py-2.5 text-center text-[1rem] font-medium text-white shadow-[0_14px_35px_rgba(25,65,130,0.14)]">
              Projeto VeriScan: Forense Digital
            </div>

            <div className="grid min-h-0 flex-1 gap-3 grid-cols-1 overflow-y-auto sm:grid-cols-[1.15fr_0.85fr] lg:gap-4">
              <div className="flex min-h-0 flex-col">
                <div className="mb-4 rounded-[1.15rem] border border-slate-200 bg-slate-50 p-3">
                  <div className="grid gap-3 grid-cols-2">
                    {[0, 1].map((indice) => {
                      const arquivo = arquivos[indice]
                      return (
                        <div
                          key={indice}
                          className={`relative flex h-[8.5rem] items-center justify-center overflow-hidden rounded-[0.95rem] border bg-white sm:h-[9.5rem] lg:h-[10.5rem] ${
                            arrastando && indice === arquivos.length ? 'border-sky-400 bg-sky-50' : 'border-slate-200'
                          }`}
                        >
                          {arquivo ? (
                            <>
                              <img
                                src={arquivo.previewUrl}
                                alt={`Preview da imagem ${indice + 1}`}
                                className="h-full w-full rounded-[0.95rem] object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removerArquivo(indice)}
                                className="absolute right-2 top-2 rounded-full bg-slate-900/82 px-2 py-1 text-[11px] font-semibold text-white transition hover:bg-slate-700"
                              >
                                Remover
                              </button>
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-2 px-3 text-center">
                              <p className="max-w-[8rem] text-[14px] leading-6 text-slate-500">
                                Solte a imagem {indice + 1}
                              </p>
                              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                                ou clique para enviar
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                <p className="mb-4 text-[13px] leading-6 text-slate-500">
                  Envie duas imagens, carregue no backend e escolha o tipo de análise para obter o resultado.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={abrirSeletor}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-sky-500 hover:text-sky-700"
                  >
                    Procurar arquivo
                  </button>
                  <button
                    type="button"
                    onClick={carregarArquivos}
                    disabled={!prontoParaUpload || carregandoUpload}
                    className="rounded-full bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {carregandoUpload ? 'Carregando...' : 'Carregar o arquivo (espaço de imagens)'}
                  </button>
                </div>
              </div>

              <div className="flex min-h-full flex-col gap-2 rounded-[1.3rem] border border-slate-200 bg-white p-3">
                <button
                  type="button"
                  onClick={() => executarTeste('subtracao')}
                  disabled={!prontoParaTeste || carregandoTeste !== null}
                  className="rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition enabled:hover:bg-sky-600 enabled:hover:text-white disabled:cursor-not-allowed disabled:bg-slate-200"
                >
                  {carregandoTeste === 'subtracao' ? 'Executando...' : 'Teste de subtração'}
                </button>
                <button
                  type="button"
                  onClick={() => executarTeste('ela')}
                  disabled={!prontoParaTeste || carregandoTeste !== null}
                  className="rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition enabled:hover:bg-slate-800 enabled:hover:text-white disabled:cursor-not-allowed disabled:bg-slate-200"
                >
                  {carregandoTeste === 'ela' ? 'Executando...' : 'Teste ELA'}
                </button>
                <button
                  type="button"
                  onClick={() => executarTeste('gradiente')}
                  disabled={!prontoParaTeste || carregandoTeste !== null}
                  className="rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition enabled:hover:bg-emerald-700 enabled:hover:text-white disabled:cursor-not-allowed disabled:bg-slate-200"
                >
                  {carregandoTeste === 'gradiente' ? 'Executando...' : 'Teste gradiente'}
                </button>

                <div className="rounded-[1rem] border border-emerald-100 bg-emerald-50/90 px-4 py-3 text-sm leading-5 text-emerald-900">
                  <span className="font-semibold">Status:</span> {status}
                </div>

                <p className="text-[13px] leading-6 text-slate-500">
                  Captura dos resultados em tempo real, integrando as duas imagens e as saídas dos algoritmos para uma avaliação técnica centralizada.
                </p>
              </div>
            </div>
          </article>

          <article className="flex min-h-0 flex-col rounded-[1.8rem] border border-slate-200 bg-white/88 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-4 lg:p-5">
            <div className="mb-4 shrink-0 rounded-[0.95rem] bg-[linear-gradient(90deg,#3d86d9_0%,#244a7c_100%)] px-5 py-2.5 text-center text-[1rem] font-medium text-white shadow-[0_14px_35px_rgba(25,65,130,0.14)]">
              Air-Writing Inteligente
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
              <div className="flex min-h-[12rem] shrink-0 items-center justify-center rounded-[1.3rem] border border-slate-200 bg-[radial-gradient(circle_at_top,#eef7ff_0%,#ffffff_62%)] p-4">
                {resultado ? (
                  <img
                    src={resultado.imageUrl}
                    alt={`Resultado do ${operationLabels[resultado.operation]}`}
                    className="max-h-[15.25rem] w-full rounded-[1rem] object-contain lg:max-h-[18rem]"
                  />
                ) : (
                  <div className="max-w-sm text-center text-slate-500">
                    <p className="text-sm leading-6">
                      O resultado aparece aqui depois que as duas imagens forem enviadas e um dos
                      testes for executado.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-[1.05rem] font-semibold text-slate-900">Resumo da análise</h2>
                <p className="mt-2 text-sm leading-5 text-slate-500">
                  {resultado?.summary ??
                    'Depois do upload das duas imagens, execute um dos testes para ver o resumo técnico e as métricas.'}
                </p>

                <div className="mt-3 grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {resultado ? (
                    Object.entries(resultado.metrics).map(([chave, valor]) => (
                      <div
                        key={chave}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2"
                      >
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{chave}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">{String(valor)}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">imagem A</p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {arquivos[0]?.file.name ?? 'Não selecionada'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">imagem B</p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {arquivos[1]?.file.name ?? 'Não selecionada'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}
