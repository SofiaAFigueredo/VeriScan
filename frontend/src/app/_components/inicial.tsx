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

  function handleArquivos(event: React.ChangeEvent<HTMLInputElement>) {
    const selecionados = Array.from(event.target.files ?? []).slice(0, 2)
    if (selecionados.length === 0) return

    arquivos.forEach((arquivo) => URL.revokeObjectURL(arquivo.previewUrl))

    const novosArquivos = selecionados.map((file, index) => ({
      id: `${file.name}-${index}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    setArquivos(novosArquivos)
    setArquivosServidor([])
    setResultado(null)
    setStatus(
      novosArquivos.length === 2
        ? 'Duas imagens selecionadas. Agora envie para o backend.'
        : 'Selecione exatamente duas imagens.'
    )
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
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f5f7fb_0%,#e8edf8_100%)] text-slate-900">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleArquivos}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6">
        <div className="pointer-events-none absolute inset-0 opacity-55">
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

        <header className="relative z-10 mb-5 flex flex-col gap-3 lg:mb-6">
          <p className="inline-flex w-fit rounded-full border border-slate-300 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            VeriScan
          </p>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <h1 className="max-w-3xl text-3xl font-light leading-tight tracking-[-0.04em] md:text-4xl xl:text-5xl">
              Visão Computacional,
              <br />
              Deep Learning e Padrões
            </h1>
            <p className="max-w-lg text-sm leading-5 text-slate-600 md:text-[15px]">
              Envie duas imagens, carregue no backend e escolha o tipo de análise para obter o resultado.
            </p>
          </div>
        </header>

        <section className="relative z-10 grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <article className="rounded-[2rem] border border-slate-300 bg-white/80 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur md:p-5">
            <div className="mb-4 rounded-[1.25rem] bg-[linear-gradient(90deg,#3d86d9_0%,#27518a_100%)] px-5 py-3 text-center text-xl font-medium text-white md:text-2xl">
              Projeto VeriScan: Forense Digital
            </div>

            <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3">
                <div className="mb-3 grid gap-3 rounded-[1.25rem] border border-dashed border-slate-300 bg-white p-3 md:grid-cols-2">
                  {[0, 1].map((indice) => {
                    const arquivo = arquivos[indice]
                    return (
                      <div
                        key={indice}
                        className="flex min-h-44 items-center justify-center rounded-[1rem] border border-slate-200 bg-slate-50 lg:min-h-52"
                      >
                        {arquivo ? (
                          <img
                            src={arquivo.previewUrl}
                            alt={`Preview da imagem ${indice + 1}`}
                            className="max-h-60 w-full rounded-[1rem] object-contain"
                          />
                        ) : (
                          <p className="max-w-[11rem] text-center text-sm leading-6 text-slate-500">
                            Espaço da imagem {indice + 1}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={abrirSeletor}
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-left text-sm font-semibold text-slate-800 transition hover:border-sky-500 hover:text-sky-700"
                  >
                    Procurar arquivo
                  </button>
                  <button
                    type="button"
                    onClick={carregarArquivos}
                    disabled={!prontoParaUpload || carregandoUpload}
                    className="rounded-2xl bg-slate-900 px-4 py-2.5 text-left text-sm font-semibold text-white transition enabled:hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {carregandoUpload ? 'Carregando...' : 'Carregar o arquivo espaço de imagem'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 rounded-[1.5rem] border border-slate-200 bg-white p-3">
                <button
                  type="button"
                  onClick={() => executarTeste('subtracao')}
                  disabled={!prontoParaTeste || carregandoTeste !== null}
                  className="rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition enabled:hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {carregandoTeste === 'subtracao' ? 'Executando...' : 'Teste de subtração'}
                </button>
                <button
                  type="button"
                  onClick={() => executarTeste('ela')}
                  disabled={!prontoParaTeste || carregandoTeste !== null}
                  className="rounded-2xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition enabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {carregandoTeste === 'ela' ? 'Executando...' : 'Teste ELA'}
                </button>
                <button
                  type="button"
                  onClick={() => executarTeste('gradiente')}
                  disabled={!prontoParaTeste || carregandoTeste !== null}
                  className="rounded-2xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition enabled:hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {carregandoTeste === 'gradiente' ? 'Executando...' : 'Teste gradiente'}
                </button>

                <div className="mt-auto rounded-[1.25rem] border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-900">
                  <span className="font-semibold">Status:</span> {status}
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-700 md:text-base">
              Detecção automatizada de manipulações em imagens com upload duplo, visualização
              lado a lado e execução dos testes do projeto.
            </p>
          </article>

          <article className="rounded-[2rem] border border-slate-300 bg-white/80 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur md:p-5">
            <div className="mb-4 rounded-[1.25rem] bg-[linear-gradient(90deg,#3d86d9_0%,#183a64_100%)] px-5 py-3 text-center text-xl font-medium text-white md:text-2xl">
              Air-Writing Inteligente
            </div>

            <div className="flex min-h-[14rem] items-center justify-center rounded-[1.5rem] border border-slate-200 bg-[radial-gradient(circle_at_top,#eef7ff_0%,#ffffff_62%)] p-3 lg:min-h-[18rem]">
              {resultado ? (
                <img
                  src={resultado.imageUrl}
                  alt={`Resultado do ${operationLabels[resultado.operation]}`}
                  className="max-h-[20rem] w-full rounded-[1rem] object-contain lg:max-h-[22rem]"
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

            <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3">
              <h2 className="text-lg font-semibold text-slate-900">Resumo da análise</h2>
              <p className="mt-2 text-sm leading-5 text-slate-600">
                {resultado?.summary ??
                  'Depois do upload das duas imagens, execute um dos testes para ver o resumo técnico e as métricas.'}
              </p>

              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {resultado ? (
                  Object.entries(resultado.metrics).map(([chave, valor]) => (
                    <div
                      key={chave}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{chave}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{String(valor)}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">imagem A</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {arquivos[0]?.file.name ?? 'Não selecionada'}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">imagem B</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {arquivos[1]?.file.name ?? 'Não selecionada'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-700 md:text-base">
              Captura dos resultados em tempo real, integrando as duas imagens e as saídas dos
              algoritmos para uma avaliação técnica centralizada.
            </p>
          </article>
        </section>
      </div>
    </main>
  )
}
