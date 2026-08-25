# Python

Este diretório concentra as pipelines oficiais de análise forense e os artefatos associados ao modelo.

## Conteúdo

- `pipeline_comparacao.py`: pipeline oficial de comparação entre ELA e Gradiente.
- `pipeline_ela.py`: pipeline oficial de análise ELA.
- `pipeline_gradiente.py`: pipeline oficial de análise por gradiente.
- `.venv/`: ambiente virtual local usado para executar o pipeline.
- `cnndetection_model.pth`: pesos do modelo de detecção.

## Papel no sistema

O backend chama uma das pipelines por linha de comando, passando:

- `--input`
- `--output-dir`

Cada script retorna um JSON na saída padrão com o caminho da imagem processada, métricas e resumo da análise.

## Execução

O uso normal é feito pelo backend. Se você quiser rodar manualmente, utilize o mesmo interpretador do ambiente virtual e os mesmos argumentos esperados por cada script.
