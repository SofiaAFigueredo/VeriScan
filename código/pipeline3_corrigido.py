import argparse
import io
import json
from pathlib import Path

import numpy as np
import piexif
from PIL import Image, ImageChops, ImageDraw, ImageEnhance


TAMANHO_RESIZE = (224, 224)
QUALIDADE_ELA = 90
AMPLIFICACAO = 10
ESPESSURA_TRACO = 4


def carregar_imagem(caminho):
    return Image.open(caminho).convert("RGB")


def aplicar_resize(imagem):
    return imagem.resize(TAMANHO_RESIZE, Image.LANCZOS)


def aplicar_grayscale(imagem):
    return imagem.convert("L").convert("RGB")


def aplicar_ela(imagem):
    buffer = io.BytesIO()
    imagem.save(buffer, format="JPEG", quality=QUALIDADE_ELA)
    buffer.seek(0)
    recomprimida = Image.open(buffer).convert("RGB")
    diferenca = ImageChops.difference(imagem, recomprimida)
    brilho_medio = float(np.array(diferenca).mean())
    ela_visivel = ImageEnhance.Brightness(diferenca).enhance(AMPLIFICACAO)
    return ela_visivel, round(brilho_medio, 2)


def calcular_luminancia(imagem):
    arr = np.array(imagem, dtype=np.float32)
    return (
        0.2126 * arr[:, :, 0]
        + 0.7152 * arr[:, :, 1]
        + 0.0722 * arr[:, :, 2]
    )


def calcular_gradientes(luminancia):
    gx = np.diff(luminancia, axis=1)
    gy = np.diff(luminancia, axis=0)
    gx = gx[: gx.shape[0] - 1, :]
    gy = gy[:, : gy.shape[1] - 1]
    return gx, gy


def calcular_pca_gradientes(gx, gy):
    M = np.column_stack([gx.flatten(), gy.flatten()])
    M = M - M.mean(axis=0)
    C = (M.T @ M) / M.shape[0]
    autovalores = np.sort(np.linalg.eigvalsh(C))[::-1]
    razao = autovalores[0] / (autovalores[1] + 1e-10)
    magnitude = float(np.sqrt(gx**2 + gy**2).mean())
    return razao, magnitude


def analisar_exif(caminho):
    resultado = {
        "tem_camera": False,
        "software": "desconhecido",
        "suspeito": False,
        "resumo": "",
    }

    nome_arquivo = str(caminho).lower()
    nomes_suspeitos = [
        "gemini", "dall-e", "dalle", "midjourney", "generated", "ai_generated",
        "stable_diffusion", "firefly", "leonardo", "ideogram", "novelai",
        "bing", "imagen", "canva", "chatgpt",
    ]
    for termo in nomes_suspeitos:
        if termo in nome_arquivo:
            resultado["suspeito"] = True
            resultado["resumo"] = f"nome suspeito: {termo}"
            break

    try:
        exif_data = piexif.load(str(caminho))
        ifd = exif_data.get("0th", {})
        fabricante = ifd.get(piexif.ImageIFD.Make, b"")
        modelo = ifd.get(piexif.ImageIFD.Model, b"")
        software = ifd.get(piexif.ImageIFD.Software, b"")

        if isinstance(fabricante, bytes):
            fabricante = fabricante.decode("utf-8", errors="ignore").strip()
        if isinstance(modelo, bytes):
            modelo = modelo.decode("utf-8", errors="ignore").strip()
        if isinstance(software, bytes):
            software = software.decode("utf-8", errors="ignore").strip()

        if fabricante or modelo:
            resultado["tem_camera"] = True
            resultado["resumo"] += f"camera: {fabricante} {modelo}".strip()
        if software:
            resultado["software"] = software
            if resultado["resumo"]:
                resultado["resumo"] += " | "
            resultado["resumo"] += f"software: {software}"
        if not resultado["tem_camera"] and not software and not resultado["resumo"]:
            resultado["resumo"] = "sem metadados de camera"
    except Exception:
        if not resultado["resumo"]:
            resultado["resumo"] = "EXIF ausente"

    return resultado


def desenhar_tracos(imagem):
    modificada = imagem.copy()
    draw = ImageDraw.Draw(modificada)
    w, h = imagem.size
    draw.line([(0, 0), (w, h)], fill=(220, 50, 50), width=ESPESSURA_TRACO)
    draw.line([(0, h // 2), (w, h // 2)], fill=(50, 100, 220), width=ESPESSURA_TRACO)
    draw.rectangle(
        [(w - 60, 10), (w - 10, 60)],
        outline=(30, 180, 80),
        width=ESPESSURA_TRACO,
    )
    return modificada


def subtrair_imagens(original, comparacao):
    arr_orig = np.array(original, dtype=np.int32)
    arr_comp = np.array(comparacao, dtype=np.int32)
    diferenca = np.abs(arr_orig - arr_comp)
    diferenca_visivel = np.clip(diferenca * 5, 0, 255).astype(np.uint8)
    pixels_alterados = int(np.sum(diferenca.mean(axis=2) > 10))
    total_pixels = TAMANHO_RESIZE[0] * TAMANHO_RESIZE[1]
    percentual = round((pixels_alterados / total_pixels) * 100, 1)
    return Image.fromarray(diferenca_visivel), pixels_alterados, percentual


def desenhar_texto(draw, posicao, texto, cor):
    draw.text(posicao, texto, fill=cor)


def criar_painel(titulo, itens, texto_rodape):
    largura_item = TAMANHO_RESIZE[0]
    altura_item = TAMANHO_RESIZE[1]
    margem = 24
    topo = 74
    rodape = 120
    largura = margem + len(itens) * largura_item + (len(itens) - 1) * margem + margem
    altura = topo + altura_item + rodape

    painel = Image.new("RGB", (largura, altura), (248, 250, 252))
    draw = ImageDraw.Draw(painel)
    draw.rounded_rectangle(
        [(8, 8), (largura - 8, altura - 8)],
        radius=26,
        outline=(182, 196, 214),
        width=2,
        fill=(248, 250, 252),
    )
    desenhar_texto(draw, (margem, 24), titulo, (15, 23, 42))

    for indice, (legenda, imagem) in enumerate(itens):
        x = margem + indice * (largura_item + margem)
        y = topo
        painel.paste(imagem.resize((largura_item, altura_item), Image.LANCZOS), (x, y))
        draw.rounded_rectangle(
            [(x - 4, y - 4), (x + largura_item + 4, y + altura_item + 4)],
            radius=18,
            outline=(148, 163, 184),
            width=2,
        )
        desenhar_texto(draw, (x, y + altura_item + 16), legenda, (51, 65, 85))

    desenhar_texto(draw, (margem, topo + altura_item + 52), texto_rodape, (71, 85, 105))
    return painel


def salvar_imagem(imagem, output_dir, nome_base):
    output_dir.mkdir(parents=True, exist_ok=True)
    destino = output_dir / f"{nome_base}.png"
    imagem.save(destino)
    return destino


def executar_subtracao(imagem_a, imagem_b, output_dir, nome_base):
    imagem_a = aplicar_resize(imagem_a)
    imagem_b = aplicar_resize(imagem_b)
    diferenca, pixels, percentual = subtrair_imagens(imagem_a, imagem_b)
    resumo = f"{pixels} pixels alterados ({percentual}%)."
    painel = criar_painel(
        "Teste de subtracao entre duas imagens",
        [("Imagem A", imagem_a), ("Imagem B", imagem_b), ("Diferenca", diferenca)],
        resumo,
    )
    saida = salvar_imagem(painel, output_dir, f"{nome_base}_subtracao")
    return {
        "operation": "subtracao",
        "image": str(saida),
        "metrics": {
            "pixelsAlterados": pixels,
            "percentualAlterado": percentual,
        },
        "summary": resumo,
    }


def executar_ela(imagem_a, imagem_b, output_dir, nome_base):
    imagem_a = aplicar_resize(imagem_a)
    imagem_b = aplicar_resize(imagem_b)
    ela_a, brilho_a = aplicar_ela(imagem_a)
    ela_b, brilho_b = aplicar_ela(imagem_b)
    resumo = f"Imagem A brilho ELA: {brilho_a} | Imagem B brilho ELA: {brilho_b}."
    painel = criar_painel(
        "Teste ELA nas duas imagens",
        [("ELA imagem A", ela_a), ("ELA imagem B", ela_b)],
        resumo,
    )
    saida = salvar_imagem(painel, output_dir, f"{nome_base}_ela")
    return {
        "operation": "ela",
        "image": str(saida),
        "metrics": {
            "brilhoImagemA": brilho_a,
            "brilhoImagemB": brilho_b,
        },
        "summary": resumo,
    }


def gerar_gradiente(imagem):
    imagem = aplicar_resize(imagem)
    grayscale = aplicar_grayscale(imagem)
    luminancia = calcular_luminancia(imagem)
    gx, gy = calcular_gradientes(luminancia)
    razao_pca, magnitude = calcular_pca_gradientes(gx, gy)
    magnitude_img = np.sqrt(gx**2 + gy**2)
    maximo = float(magnitude_img.max()) or 1.0
    magnitude_norm = (magnitude_img / maximo * 255).astype(np.uint8)
    gradiente = Image.fromarray(magnitude_norm).convert("RGB")
    return grayscale, gradiente, round(float(razao_pca), 2), round(float(magnitude), 2)


def executar_gradiente(imagem_a, imagem_b, caminho_a, caminho_b, output_dir, nome_base):
    _, grad_a, pca_a, mag_a = gerar_gradiente(imagem_a)
    _, grad_b, pca_b, mag_b = gerar_gradiente(imagem_b)
    exif_a = analisar_exif(caminho_a)
    exif_b = analisar_exif(caminho_b)
    resumo = (
        f"Imagem A PCA: {pca_a}, mag: {mag_a}, EXIF: {exif_a['resumo']} | "
        f"Imagem B PCA: {pca_b}, mag: {mag_b}, EXIF: {exif_b['resumo']}."
    )
    painel = criar_painel(
        "Teste gradiente nas duas imagens",
        [("Gradiente A", grad_a), ("Gradiente B", grad_b)],
        resumo,
    )
    saida = salvar_imagem(painel, output_dir, f"{nome_base}_gradiente")
    return {
        "operation": "gradiente",
        "image": str(saida),
        "metrics": {
            "razaoPcaImagemA": pca_a,
            "razaoPcaImagemB": pca_b,
            "magnitudeImagemA": mag_a,
            "magnitudeImagemB": mag_b,
        },
        "summary": resumo,
    }


def main():
    parser = argparse.ArgumentParser(description="Pipeline do VeriScan")
    parser.add_argument("--input-a", required=True, help="Caminho da imagem A")
    parser.add_argument("--input-b", required=True, help="Caminho da imagem B")
    parser.add_argument(
        "--operation",
        required=True,
        choices=["subtracao", "ela", "gradiente"],
        help="Operacao a executar",
    )
    parser.add_argument("--output-dir", required=True, help="Pasta de saida")
    args = parser.parse_args()

    caminho_a = Path(args.input_a).resolve()
    caminho_b = Path(args.input_b).resolve()
    output_dir = Path(args.output_dir).resolve()

    imagem_a = carregar_imagem(caminho_a)
    imagem_b = carregar_imagem(caminho_b)
    nome_base = f"{caminho_a.stem}_{caminho_b.stem}".replace(" ", "_").lower()

    if args.operation == "subtracao":
        resultado = executar_subtracao(imagem_a, imagem_b, output_dir, nome_base)
    elif args.operation == "ela":
        resultado = executar_ela(imagem_a, imagem_b, output_dir, nome_base)
    else:
        resultado = executar_gradiente(imagem_a, imagem_b, caminho_a, caminho_b, output_dir, nome_base)

    print(json.dumps(resultado, ensure_ascii=True))


if __name__ == "__main__":
    main()
