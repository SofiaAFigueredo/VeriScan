import argparse
import json
from pathlib import Path

import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
from matplotlib.patches import FancyBboxPatch

TAMANHO_RESIZE = (224, 224)

# Limiares para o veredito
LIMIAR_PCA_SUSPEITO = 1.5
LIMIAR_MAGNITUDE_SUSPEITA = 30.0

def _carregar_imagem(caminho: str) -> Image.Image:
    """
    Abre a imagem e converte para RGB.
    """
    return Image.open(caminho).convert("RGB")


def _aplicar_resize(imagem: Image.Image) -> Image.Image:
    """
    Padroniza o tamanho da imagem.
    """
    return imagem.resize(TAMANHO_RESIZE, Image.LANCZOS)


def _aplicar_grayscale(imagem: Image.Image) -> Image.Image:
    """
    Converte para escala de cinza mantendo 3 canais.
    """
    return imagem.convert("L").convert("RGB")

def _calcular_luminancia(imagem: Image.Image) -> np.ndarray:

    arr = np.array(
        imagem,
        dtype=np.float32
    )

    return (
        0.2126 * arr[:, :, 0] +
        0.7152 * arr[:, :, 1] +
        0.0722 * arr[:, :, 2]
    )


def _calcular_gradientes(
    luminancia: np.ndarray
) -> tuple:

    gx = np.diff(
        luminancia,
        axis=1
    )

    gy = np.diff(
        luminancia,
        axis=0
    )

    gx = gx[:gx.shape[0] - 1, :]

    gy = gy[:, :gy.shape[1] - 1]

    return gx, gy


def _calcular_pca(
    gx: np.ndarray,
    gy: np.ndarray
) -> tuple:
  

    M = np.column_stack([
        gx.flatten(),
        gy.flatten()
    ])

    M = M - M.mean(axis=0)

    C = (
        M.T @ M
    ) / M.shape[0]

    autovalores = np.sort(
        np.linalg.eigvalsh(C)
    )[::-1]

    razao = (
        autovalores[0] /
        (autovalores[1] + 1e-10)
    )

    magnitude = float(
        np.sqrt(
            gx**2 + gy**2
        ).mean()
    )

    return (
        round(float(razao), 2),
        round(magnitude, 2)
    )


def _gerar_imagem_gradiente(
    gx: np.ndarray,
    gy: np.ndarray
) -> Image.Image:
    """
    Gera a imagem visual do campo de gradiente.
    """

    magnitude = np.sqrt(
        gx**2 + gy**2
    )

    # Evita divisão por zero
    if magnitude.max() == 0:
        magnitude_norm = np.zeros_like(
            magnitude,
            dtype=np.uint8
        )
    else:
        magnitude_norm = (
            magnitude /
            magnitude.max() *
            255
        ).astype(np.uint8)

    return Image.fromarray(
        magnitude_norm
    )

def _calcular_veredito(
    razao: float,
    magnitude: float
) -> tuple:
    """
    Combina somente as métricas do Gradiente:

        - Razão PCA
        - Magnitude média

    Cada critério suspeito soma 1 ponto.

    0 pontos:
        POSSIVELMENTE AUTÊNTICA

    1 ponto:
        INCONCLUSIVA

    2 pontos:
        POSSIVELMENTE MANIPULADA
    """

    pontos = 0
    detalhes = []

    # PCA
    if razao < LIMIAR_PCA_SUSPEITO:

        pontos += 1

        detalhes.append(
            f"PCA baixo ({razao})"
        )

    # Magnitude
    if magnitude > LIMIAR_MAGNITUDE_SUSPEITA:

        pontos += 1

        detalhes.append(
            f"magnitude alta ({magnitude})"
        )

    # Veredito
    if pontos == 0:

        return (
            "POSSIVELMENTE\nAUTÊNTICA",
            "#2e7d32",
            pontos,
            detalhes
        )

    elif pontos == 1:

        return (
            "INCONCLUSIVA",
            "#e65100",
            pontos,
            detalhes
        )

    else:

        return (
            "POSSIVELMENTE\nMANIPULADA",
            "#b71c1c",
            pontos,
            detalhes
        )

def _gerar_figura(
    original,
    grayscale,
    gradiente,
    razao,
    magnitude,
    veredito,
    cor,
    nome
) -> plt.Figure:
    """
    Relatório visual com 4 painéis:

        original
        grayscale
        gradiente
        veredito
    """

    fig = plt.figure(
        figsize=(6, 6)
    )

    fig.patch.set_facecolor(
        "#f5f5f5"
    )

    fig.suptitle(
        f"Análise Gradiente",
        fontsize=13,
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
        gradiente,
        cmap="inferno"
    )

    ax3.set_title(
        f"Gradiente\n"
        f"PCA: {razao} | mag: {magnitude}",
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
        0.20,
        (
            f"PCA: {razao}\n"
            f"Magnitude: {magnitude}\n\n"
            "indicativo — não conclusivo"
        ),
        color="black",
        fontsize=8,
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

def processar_gradiente(
    caminho: str
) -> dict:
    """
    Processa uma imagem somente com:

        - Gradiente
        - PCA
        - Magnitude média
        - Veredito

    Retorna um dicionário com os resultados.
    """

    nome = (
        caminho
        .split("/")[-1]
        .split("\\")[-1]
    )

    # Carregamento
    imagem = _carregar_imagem(
        caminho
    )

    # Resize
    imagem = _aplicar_resize(
        imagem
    )

    # Grayscale
    grayscale = _aplicar_grayscale(
        imagem
    )

    # Luminância
    luminancia = _calcular_luminancia(
        imagem
    )

    # Gradientes
    gx, gy = _calcular_gradientes(
        luminancia
    )

    # PCA + magnitude
    razao, magnitude = _calcular_pca(
        gx,
        gy
    )

    # Imagem do gradiente
    gradiente_img = _gerar_imagem_gradiente(
        gx,
        gy
    )

    # Veredito
    veredito, cor, pontos, detalhes = (
        _calcular_veredito(
            razao,
            magnitude
        )
    )

    # Figura
    figura = _gerar_figura(
        imagem,
        grayscale,
        gradiente_img,
        razao,
        magnitude,
        veredito,
        cor,
        nome
    )

    return {
        "imagem_original": imagem,
        "imagem_gradiente": gradiente_img,
        "imagem_grayscale": grayscale,
        "razao_pca": razao,
        "magnitude_media": magnitude,
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
    destino = output_dir / f"{nome_base}_gradiente.png"
    figura.savefig(destino, dpi=200, bbox_inches="tight")
    plt.close(figura)
    return destino


def _executar_cli(caminho: str, output_dir: str) -> dict:
    caminho_resolvido = Path(caminho).resolve()
    resultado = processar_gradiente(str(caminho_resolvido))
    saida = _salvar_figura(
        resultado["figura"],
        Path(output_dir).resolve(),
        caminho_resolvido.stem.replace(" ", "_").lower(),
    )

    return {
        "operation": "gradiente",
        "image": str(saida),
        "metrics": {
            "razaoPca": resultado["razao_pca"],
            "magnitudeMedia": resultado["magnitude_media"],
            "pontos": resultado["pontos"],
        },
        "summary": (
            f"Gradiente da imagem {caminho_resolvido.name}: "
            f"{resultado['veredito']} (PCA {resultado['razao_pca']}, "
            f"magnitude {resultado['magnitude_media']})."
        ),
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Pipeline Gradiente do VeriScan")
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
            title="Escolha uma imagem para Gradiente",
            filetypes=[
                (
                    "Imagens",
                    "*.jpg *.jpeg *.png *.bmp *.webp"
                )
            ]
        )

        root.destroy()

        if caminho:

            resultado = processar_gradiente(
                caminho
            )

            print(
                f"Razão PCA       : "
                f"{resultado['razao_pca']}"
            )

            print(
                f"Magnitude média : "
                f"{resultado['magnitude_media']}"
            )

            print(
                f"Veredito        : "
                f"{resultado['veredito']}"
            )

            plt.show()
