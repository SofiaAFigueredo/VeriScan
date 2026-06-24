'use client'

import { useState } from 'react'

type Props = {
  file: File
}

export function ThumbnailPreview({ file }: Props) {
  const [src] = useState<string>(() => URL.createObjectURL(file))

  if (!src) return null

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="w-full h-full object-cover"
      style={{ imageRendering: 'auto' }}
      onLoad={(e) => {
        // Revoga a URL só depois que a imagem carregou completamente
        const target = e.currentTarget
        setTimeout(() => URL.revokeObjectURL(target.src), 5000)
      }}
    />
  )
}