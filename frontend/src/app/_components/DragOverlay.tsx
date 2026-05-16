'use client'

// Componente overlay de drag-and-drop — cobre a tela inteira quando o usuário arrasta um arquivo
type Props = {
  onDrop: (e: React.DragEvent) => void       // Chamado ao soltar o arquivo
  onDragOver: (e: React.DragEvent) => void   // Chamado enquanto mantém o arquivo em cima
  onDragLeave: (e: React.DragEvent) => void  // Chamado ao sair da área sem soltar
}

export function DragOverlay({ onDrop, onDragOver, onDragLeave }: Props) {
  return (
    // Seção que ocupa a tela inteira como zona de soltura
    <section
      className="min-h-screen flex items-center justify-center bg-[#D4FBFF]"
      onDrop={onDrop}           // Processa os arquivos ao soltar
      onDragOver={onDragOver}   // Mantém o overlay visível enquanto arrasta
      onDragLeave={onDragLeave} // Remove o overlay ao sair da área
    >
      {/* Área visual destacada indicando onde soltar */}
      <div className="w-[min(90vw,420px)] aspect-square rounded-3xl bg-[#D8ADEB]/30 border-2 border-dashed border-[#D8ADEB] flex items-center justify-center">
        <p className="text-[#7860E1] font-semibold text-2xl">Solte a imagem aqui</p>
      </div>
    </section>
  )
}
