import argparse
import json
from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec
from matplotlib.patches import FancyBboxPatch

from pipeline_ela import processar_ela
from pipeline_gradiente import processar_gradiente


def processar_comparacao(
    caminho: str
) -> dict:


    nome = (
        caminho
        .split("/")[-1]
        .split("\\")[-1]
    )

    ela = processar_ela(
        caminho
    )

    gradiente = processar_gradiente(
        caminho
    )

    # Fecha as figuras individuais
    # para mostrar somente a comparação final.
    plt.close("all")

    fig = plt.figure(
        figsize=(16, 10)
    )

    fig.patch.set_facecolor(
        "#f5f5f5"
    )

    fig.suptitle(
        f"Comparação ELA × Gradiente",
        fontsize=20,
        fontweight="bold",
        color="black"
    )

    grid = GridSpec(
        2,
        3,
        figure=fig,
        width_ratios=[1.35, 1.35, 0.9],
        hspace=0.26,
        wspace=0.08
    )

    ax1 = fig.add_subplot(
        grid[0, 0]
    )

    ax1.imshow(
        ela["imagem_original"]
    )

    ax1.set_title(
        "Original",
        fontsize=10,
        color="black"
    )

    ax1.axis("off")

    ax2 = fig.add_subplot(
        grid[0, 1]
    )

    ax2.imshow(
        ela["imagem_ela"]
    )

    ax2.set_title(
        f"ELA\n"
        f"brilho: {ela['brilho_medio']}",
        fontsize=10,
        color="black"
    )

    ax2.axis("off")

    ax3 = fig.add_subplot(
        grid[0, 2]
    )

    ax3.set_facecolor(
        ela["cor_veredito"]
    )

    ax3.set_xlim(
        0,
        1
    )

    ax3.set_ylim(
        0,
        1
    )

    ax3.add_patch(
        FancyBboxPatch(
            (0, 0),
            1,
            1,
            boxstyle="square,pad=0",
            facecolor=ela["cor_veredito"],
            transform=ax3.transAxes,
            zorder=0
        )
    )

    ax3.text(
        0.5,
        0.55,
        ela["veredito"],
        color="black",
        fontsize=10,
        fontweight="bold",
        ha="center",
        va="center",
        multialignment="center",
        zorder=1
    )

    ax3.text(
        0.5,
        0.20,
        f"Brilho ELA: "
        f"{ela['brilho_medio']}",
        color="black",
        fontsize=8,
        ha="center",
        va="center",
        zorder=1
    )

    ax3.set_title(
        "Veredito ELA",
        fontsize=10,
        color="black"
    )

    ax3.axis("off")

    ax4 = fig.add_subplot(
        grid[1, 0]
    )

    ax4.imshow(
        gradiente["imagem_gradiente"],
        cmap="inferno"
    )

    ax4.set_title(
        f"Gradiente\n"
        f"PCA: {gradiente['razao_pca']}\n"
        f"Mag.: {gradiente['magnitude_media']}",
        fontsize=10,
        color="black"
    )

    ax4.axis("off")

    ax5 = fig.add_subplot(
        grid[1, 1]
    )

    ax5.set_facecolor(
        gradiente["cor_veredito"]
    )

    ax5.set_xlim(
        0,
        1
    )

    ax5.set_ylim(
        0,
        1
    )

    ax5.add_patch(
        FancyBboxPatch(
            (0, 0),
            1,
            1,
            boxstyle="square,pad=0",
            facecolor=gradiente["cor_veredito"],
            transform=ax5.transAxes,
            zorder=0
        )
    )

    ax5.text(
        0.5,
        0.55,
        gradiente["veredito"],
        color="black",
        fontsize=10,
        fontweight="bold",
        ha="center",
        va="center",
        multialignment="center",
        zorder=1
    )

    ax5.text(
        0.5,
        0.20,
        (
            f"PCA: {gradiente['razao_pca']}\n"
            f"Mag.: {gradiente['magnitude_media']}"
        ),
        color="black",
        fontsize=8,
        ha="center",
        va="center",
        zorder=1
    )

    ax5.set_title(
        "Veredito Gradiente",
        fontsize=10,
        color="black"
    )

    ax5.axis("off")

    votos_manipulada = sum([
        "MANIPULADA" in ela["veredito"],
        "MANIPULADA" in gradiente["veredito"]
    ])

    votos_autentica = sum([
        "AUTÊNTICA" in ela["veredito"],
        "AUTÊNTICA" in gradiente["veredito"]
    ])

    if votos_manipulada == 2:

        consenso = (
            "AMBOS INDICAM\n"
            "MANIPULAÇÃO"
        )

        cor_c = "#b71c1c"

    elif votos_autentica == 2:

        consenso = (
            "AMBOS INDICAM\n"
            "AUTENTICIDADE"
        )

        cor_c = "#2e7d32"

    else:

        consenso = (
            "MÉTODOS\n"
            "DIVERGEM"
        )

        cor_c = "#1565c0"

    ax6 = fig.add_subplot(
        grid[1, 2]
    )

    ax6.set_facecolor(
        cor_c
    )

    ax6.set_xlim(
        0,
        1
    )

    ax6.set_ylim(
        0,
        1
    )

    ax6.add_patch(
        FancyBboxPatch(
            (0, 0),
            1,
            1,
            boxstyle="square,pad=0",
            facecolor=cor_c,
            transform=ax6.transAxes,
            zorder=0
        )
    )

    ax6.text(
        0.5,
        0.55,
        consenso,
        color="black",
        fontsize=10,
        fontweight="bold",
        ha="center",
        va="center",
        multialignment="center",
        zorder=1
    )

    ax6.text(
        0.5,
        0.20,
        "consenso",
        color="black",
        fontsize=8,
        ha="center",
        va="center",
        zorder=1
    )

    ax6.set_title(
        "Consenso",
        fontsize=10,
        color="black"
    )

    ax6.axis("off")

    plt.tight_layout(rect=(0, 0, 1, 0.96))

    return {
        "ela": ela,
        "gradiente": gradiente,
        "figura": fig
    }

def _obter_consenso(ela: dict, gradiente: dict) -> str:
    if "MANIPULADA" in ela["veredito"] and "MANIPULADA" in gradiente["veredito"]:
        return "AMBOS INDICAM MANIPULACAO"

    if "AUTÊNTICA" in ela["veredito"] and "AUTÊNTICA" in gradiente["veredito"]:
        return "AMBOS INDICAM AUTENTICIDADE"

    return "METODOS DIVERGEM"


def _salvar_figura(figura: plt.Figure, output_dir: Path, nome_base: str) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    destino = output_dir / f"{nome_base}_comparacao.png"
    figura.savefig(destino, dpi=200, bbox_inches="tight")
    plt.close(figura)
    return destino


def _executar_cli(caminho: str, output_dir: str) -> dict:
    caminho_resolvido = Path(caminho).resolve()
    resultado = processar_comparacao(str(caminho_resolvido))
    consenso = _obter_consenso(resultado["ela"], resultado["gradiente"])
    saida = _salvar_figura(
        resultado["figura"],
        Path(output_dir).resolve(),
        caminho_resolvido.stem.replace(" ", "_").lower(),
    )

    return {
        "operation": "comparacao",
        "image": str(saida),
        "metrics": {
            "brilhoEla": resultado["ela"]["brilho_medio"],
            "razaoPcaGradiente": resultado["gradiente"]["razao_pca"],
            "magnitudeGradiente": resultado["gradiente"]["magnitude_media"],
        },
        "summary": (
            f"Comparacao ELA x Gradiente da imagem {caminho_resolvido.name}: "
            f"{consenso}."
        ),
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Pipeline Comparacao do VeriScan")
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
            title="Escolha uma imagem para comparar",
            filetypes=[
                (
                    "Imagens",
                    "*.jpg *.jpeg *.png *.bmp *.webp"
                )
            ]
        )

        root.destroy()

        if caminho:

            resultado = processar_comparacao(
                caminho
            )

            print(
                f"ELA       : "
                f"{resultado['ela']['veredito']}"
            )

            print(
                f"Gradiente : "
                f"{resultado['gradiente']['veredito']}"
            )

            plt.show()
