import argparse
import io
import json
from pathlib import Path

import numpy as np
import matplotlib.pyplot as plt

from PIL import Image, ImageChops, ImageEnhance
from matplotlib.patches import FancyBboxPatch

QUALIDADE_ELA  = 90
AMPLIFICACAO   = 10
TAMANHO_RESIZE = (224, 224)

LIMIAR_BRILHO_SUSPEITO = 4.5


def _carregar_imagem(caminho: str) -> Image.Image:
    """
    Abre a imagem e converte para RGB.
    """
    return Image.open(caminho).convert("RGB")


def _aplicar_resize(imagem: Image.Image) -> Image.Image:
    """
    Padroniza o tamanho da imagem.
    """
    return imagem.resize(
        TAMANHO_RESIZE,
        Image.LANCZOS
    )


def _aplicar_grayscale(imagem: Image.Image) -> Image.Image:
    """
    Converte para escala de cinza mantendo 3 canais.
    """
    return imagem.convert("L").convert("RGB")

def _calcular_ela(
    imagem: Image.Image
) -> tuple:
    """
    Recomprime a imagem em JPEG e calcula
    a diferença pixel a pixel.

    Regiões com diferenças maiores aparecem
    mais destacadas na imagem ELA.

    Retorna:
        ela_visivel  — diferença amplificada visualmente
        brilho_medio — média do brilho da diferença
    """

    buffer = io.BytesIO()

    imagem.save(
        buffer,
        format="JPEG",
        quality=QUALIDADE_ELA
    )

    buffer.seek(0)

    recomprimida = Image.open(
        buffer
    ).convert("RGB")

    diferenca = ImageChops.difference(
        imagem,
        recomprimida
    )

    brilho_medio = float(
        np.array(diferenca).mean()
    )

    ela_visivel = ImageEnhance.Brightness(
        diferenca
    ).enhance(
        AMPLIFICACAO
    )

    return (
        ela_visivel,
        round(brilho_medio, 2)
    )

def _calcular_veredito(
    brilho: float
) -> tuple:
    """
    O veredito é baseado somente no brilho médio do ELA.

    Brilho baixo:
        POSSIVELMENTE AUTÊNTICA

    Brilho intermediário:
        INCONCLUSIVA

    Brilho alto:
        POSSIVELMENTE MANIPULADA

    Retorna:
        veredito
        cor
        pontos
        detalhes
    """

    if brilho < 4.0:

        return (
            "POSSIVELMENTE\nAUTÊNTICA",
            "#2e7d32",
            0,
            []
        )

    elif brilho < 6.0:

        return (
            "INCONCLUSIVA",
            "#e65100",
            1,
            [f"ELA intermediário ({brilho})"]
        )

    else:

        return (
            "POSSIVELMENTE\nMANIPULADA",
            "#b71c1c",
            2,
            [f"ELA elevado ({brilho})"]
        )

def _gerar_figura(
    original,
    grayscale,
    ela,
    brilho,
    veredito,
    cor,
    nome
) -> plt.Figure:
    """
    Gera relatório visual com 4 painéis:

        original
        grayscale
        ELA
        veredito
    """

    fig = plt.figure(
        figsize=(4, 4)
    )

    fig.patch.set_facecolor(
        "#f5f5f5"
    )

    fig.suptitle(
        f"Análise ELA",
        fontsize=10,
        fontweight="bold",
        color="black"
    )

    ax1 = fig.add_subplot(
        2,
        2,
        1
    )

    ax1.imshow(
        original
    )

    ax1.set_title(
        "Original",
        fontsize=10,
        color="black"
    )

    ax1.axis("off")

    ax2 = fig.add_subplot(
        2,
        2,
        2
    )

    ax2.imshow(
        grayscale,
        cmap="gray"
    )

    ax2.set_title(
        "Grayscale",
        fontsize=10,
        color="black"
    )

    ax2.axis("off")

    ax3 = fig.add_subplot(
        2,
        2,
        3
    )

    ax3.imshow(
        ela
    )

    ax3.set_title(
        f"ELA\nbrilho: {brilho}",
        fontsize=10,
        color="black"
    )

    ax3.axis("off")

    ax4 = fig.add_subplot(
        2,
        2,
        4
    )

    ax4.set_facecolor(
        cor
    )

    ax4.set_xlim(
        0,
        1
    )

    ax4.set_ylim(
        0,
        1
    )

    ax4.add_patch(
        FancyBboxPatch(
            (0, 0),
            1,
            1,
            boxstyle="square,pad=0",
            facecolor=cor,
            transform=ax4.transAxes,
            zorder=0
        )
    )

    ax4.text(
        0.5,
        0.60,
        veredito,
        color="black",
        fontsize=11,
        fontweight="bold",
        ha="center",
        va="center",
        multialignment="center",
        zorder=1
    )

    ax4.text(
        0.5,
        0.25,
        f"Brilho ELA: {brilho}",
        color="black",
        fontsize=8,
        ha="center",
        va="center",
        zorder=1
    )

    ax4.text(
        0.5,
        0.12,
        "indicativo — não conclusivo",
        color="black",
        fontsize=7,
        ha="center",
        va="center",
        zorder=1
    )

    ax4.set_title(
        "Veredito",
        fontsize=10,
        color="black"
    )

    ax4.axis("off")

    plt.tight_layout(rect=(0, 0, 1, 0.96))

    return fig

def processar_ela(
    caminho: str
) -> dict:
    """
    Processa uma imagem somente com:

        - Resize
        - Grayscale
        - ELA
        - Brilho médio
        - Veredito

    Retorna um dicionário com os resultados.
    """

    nome = (
        caminho
        .split("/")[-1]
        .split("\\")[-1]
    )

    imagem = _carregar_imagem(
        caminho
    )

    imagem = _aplicar_resize(
        imagem
    )

    grayscale = _aplicar_grayscale(
        imagem
    )

    ela, brilho = _calcular_ela(
        imagem
    )

    veredito, cor, pontos, detalhes = (
        _calcular_veredito(
            brilho
        )
    )

    figura = _gerar_figura(
        imagem,
        grayscale,
        ela,
        brilho,
        veredito,
        cor,
        nome
    )

    return {
        "imagem_original": imagem,
        "imagem_ela": ela,
        "imagem_grayscale": grayscale,
        "brilho_medio": brilho,
        "veredito": veredito.replace(
            "\n",
            " "
        ),
        "cor_veredito": cor,
        "pontos": pontos,
        "detalhes": detalhes,
        "figura": figura
    }

def _salvar_figura(figura: plt.Figure, output_dir: Path, nome_base: str) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    destino = output_dir / f"{nome_base}_ela.png"
    figura.savefig(destino, dpi=200, bbox_inches="tight")
    plt.close(figura)
    return destino


def _executar_cli(caminho: str, output_dir: str) -> dict:
    caminho_resolvido = Path(caminho).resolve()
    resultado = processar_ela(str(caminho_resolvido))
    saida = _salvar_figura(
        resultado["figura"],
        Path(output_dir).resolve(),
        caminho_resolvido.stem.replace(" ", "_").lower(),
    )

    return {
        "operation": "ela",
        "image": str(saida),
        "metrics": {
            "brilhoMedio": resultado["brilho_medio"],
            "pontos": resultado["pontos"],
        },
        "summary": (
            f"ELA da imagem {caminho_resolvido.name}: "
            f"{resultado['veredito']} (brilho medio {resultado['brilho_medio']})."
        ),
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Pipeline ELA do VeriScan")
    parser.add_argument("--input", help="Caminho da imagem a ser analisada")
    parser.add_argument("--output-dir", help="Pasta para salvar o resultado")
    args = parser.parse_args()

    if args.input and args.output_dir:
        print(json.dumps(_executar_cli(args.input, args.output_dir), ensure_ascii=True))
    else:

        import tkinter as tk
        from tkinter import filedialog

        root = tk.Tk()
        root.withdraw()

        caminho = filedialog.askopenfilename(
            title="Escolha uma imagem para ELA",
            filetypes=[
                (
                    "Imagens",
                    "*.jpg *.jpeg *.png *.bmp *.webp"
                )
            ]
        )

        root.destroy()

        if caminho:

            resultado = processar_ela(
                caminho
            )

            print(
                f"Brilho ELA : "
                f"{resultado['brilho_medio']}"
            )

            print(
                f"Veredito   : "
                f"{resultado['veredito']}"
            )

            plt.show()
