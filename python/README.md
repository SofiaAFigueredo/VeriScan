# Python

Este diretório concentra o pipeline de análise forense e os artefatos associados ao modelo.

## Conteúdo

- `pipeline3_corrigido.py`: script principal chamado pelo backend para processar duas imagens e gerar o resultado.
- `.venv/`: ambiente virtual local usado para executar o pipeline.
- `cnndetection_model.pth`: pesos do modelo de detecção.

## Papel no sistema

O backend chama este script por linha de comando, passando:

- `--input-a`
- `--input-b`
- `--operation`
- `--output-dir`

O script retorna um JSON na saída padrão com o caminho da imagem processada, métricas e resumo da análise.

## Execução

O uso normal é feito pelo backend. Se você quiser rodar manualmente, utilize o mesmo interpretador do ambiente virtual e os mesmos argumentos esperados pelo script.
