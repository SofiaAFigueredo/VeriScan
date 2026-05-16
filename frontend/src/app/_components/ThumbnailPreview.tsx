'use client'

// Componente de miniatura: renderiza um preview da imagem local antes do upload
import { useState } from 'react'

type Props = {
  file: File // Arquivo local selecionado pelo usuário (ainda não está no servidor)
}

export function ThumbnailPreview({ file }: Props) {
  // Cria uma URL temporária apontando para o arquivo em memória
  // A função inicializadora do useState roda apenas uma vez (na montagem)
  // evitando recriar a URL a cada re-render do componente pai
  const [src] = useState<string>(() => URL.createObjectURL(file))

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}                       // URL temporária do arquivo local (blob:...)
      alt=""                          // Alt vazio pois é decorativo/preview
      className="w-full h-full object-cover" // Preenche o container mantendo proporção
      onLoad={() => URL.revokeObjectURL(src)} // Libera a URL da memória após carregamento
    />
  )
}
