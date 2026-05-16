(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/public/RobôPessoa.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.q("/_next/static/media/RobôPessoa.10ga3wkg0ok11.png");}),
"[project]/public/RobôPessoa.png.mjs { IMAGE => \"[project]/public/RobôPessoa.png (static in ecmascript, tag client)\" } [app-client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Rob$f4$Pessoa$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/public/RobôPessoa.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Rob$f4$Pessoa$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 1536,
    height: 1024,
    blurWidth: 8,
    blurHeight: 5,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAYAAAB4ka1VAAAAsElEQVR42gGlAFr/AHRkQhLKt4du4s2fkrGmilV+f30zT1BQExkYGAASEREAANPAnmzy4LP19+XC/vHjxPPm2b+/opSPdIyGgjKXlJEzANnBiWX55Lb56t/M/vLhv//w1Z33uZeK8dPBp7q/sJA0AIt5UB7p0Jm99uvV+/v17fz04b38wrfC/ODUveq1nmo8ACghFACIdlAoyrudaNHLwmzFtZhrkYyUa5mPgllgUzgO5ylhshpusTwAAAAASUVORK5CYII="
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/_components/hooks/useArquivos.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useArquivos",
    ()=>useArquivos
]);
// Hook customizado que gerencia todo o estado e lógica de upload de arquivos
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
// Formata bytes em string legível (KB ou MB)
function formatarTamanho(bytes) {
    return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` // Menor que 1 MB: mostra em KB
     : `${(bytes / (1024 * 1024)).toFixed(1)} MB` // Maior que 1 MB: mostra em MB
    ;
}
// MIME types aceitos pelo sistema — espelha a lista do backend (config/multer.js)
const TIPOS_ACEITOS = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
    'image/x-icon',
    'image/heif',
    'image/heic',
    'image/avif',
    'image/jp2',
    'image/jpx',
    'image/jpm',
    'image/vnd.microsoft.icon',
    'image/apng',
    'image/x-xbitmap',
    'image/x-xpixmap',
    'image/x-portable-bitmap',
    'image/x-portable-graymap',
    'image/x-portable-pixmap',
    'image/x-cmu-raster',
    'image/ief'
];
function useArquivos() {
    _s();
    // Lista de todos os arquivos sendo gerenciados (pendentes, enviando, enviados, erros)
    const [arquivos, setArquivos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Controla se o usuário está arrastando um arquivo sobre a janela
    const [isDragOver, setIsDragOver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ── Função: fazer upload de um único arquivo para o backend ──────────────────
    async function uploadArquivo(item) {
        // Monta o FormData com o campo "file" — nome esperado pelo multer no backend
        const formData = new FormData();
        formData.append('file', item.file);
        // Atualiza o status do arquivo para "enviando" enquanto a requisição ocorre
        setArquivos((prev)=>prev.map((a)=>a.id === item.id ? {
                    ...a,
                    status: 'enviando'
                } : a));
        try {
            // Faz a requisição POST para /api/posts
            // O Next.js faz proxy para http://localhost:4000/posts (configurado em next.config.ts)
            const res = await fetch('/api/posts', {
                method: 'POST',
                body: formData
            });
            // Converte a resposta para JSON
            const data = await res.json();
            // Se o servidor retornou erro HTTP, lança exceção com a mensagem do backend
            if (!res.ok) throw new Error(data.erro || `HTTP ${res.status}`);
            // Upload bem-sucedido: salva a URL e o ID retornados pelo servidor
            setArquivos((prev)=>prev.map((a)=>a.id === item.id ? {
                        ...a,
                        status: 'sucesso',
                        urlServidor: data.arquivo.url,
                        idServidor: data.arquivo.id
                    } : a));
        } catch (err) {
            // Salva a mensagem de erro no item para exibição na UI
            const msg = err instanceof Error ? err.message : 'Erro desconhecido';
            setArquivos((prev)=>prev.map((a)=>a.id === item.id ? {
                        ...a,
                        status: 'erro',
                        mensagemErro: msg
                    } : a));
        }
    }
    // ── Função: processar novos arquivos selecionados ou arrastados ───────────────
    async function processarArquivos(files) {
        // Para cada arquivo recebido, cria um ArquivoItem e valida o tipo
        const novos = Array.from(files).map((file)=>{
            const tipoValido = TIPOS_ACEITOS.includes(file.type) // Verifica MIME type
            ;
            return {
                id: crypto.randomUUID(),
                file,
                nome: file.name,
                tamanho: formatarTamanho(file.size),
                status: tipoValido ? 'validando' : 'erro',
                mensagemErro: tipoValido ? undefined : 'Tipo não suportado'
            };
        });
        // Adiciona os novos arquivos à lista de estado (antes de fazer upload)
        setArquivos((prev)=>[
                ...prev,
                ...novos
            ]);
        // Filtra apenas os arquivos com tipo válido e inicia o upload automaticamente
        const validos = novos.filter((a)=>a.status === 'validando');
        for (const item of validos){
            // Upload sequencial: aguarda cada um terminar antes de começar o próximo
            await uploadArquivo(item);
        }
    }
    // ── Função: remover um arquivo da lista ──────────────────────────────────────
    function remover(id) {
        setArquivos((prev)=>prev.filter((a)=>a.id !== id)); // Remove pelo ID local
    }
    // ── Função: chamada ao fechar/sair da página ──────────────────────────────────
    // Envia DELETE /api/cleanup para o backend apagar todos os arquivos do servidor
    async function limparServidor() {
        try {
            // sendBeacon é preferido no unload pois não é cancelado pelo browser
            const payload = JSON.stringify({
                acao: 'cleanup'
            });
            if (navigator.sendBeacon) {
                // Usa sendBeacon quando disponível — mais confiável durante o fechamento
                navigator.sendBeacon('/api/cleanup', new Blob([
                    payload
                ], {
                    type: 'application/json'
                }));
            } else {
                // Fallback com fetch keepalive para manter a requisição mesmo após unload
                fetch('/api/cleanup', {
                    method: 'DELETE',
                    keepalive: true
                });
            }
        } catch  {
        // Ignora erros no cleanup — o servidor também pode limpar periodicamente
        }
    }
    // ── Handlers de drag-and-drop ─────────────────────────────────────────────────
    // Ativado quando o usuário arrasta um arquivo sobre a área da página
    const handleDragOver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useArquivos.useCallback[handleDragOver]": (e)=>{
            e.preventDefault(); // Impede comportamento padrão do browser (abrir arquivo)
            setIsDragOver(true); // Mostra overlay de "solte aqui"
        }
    }["useArquivos.useCallback[handleDragOver]"], []);
    // Ativado quando o usuário sai da área de drop sem soltar
    const handleDragLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useArquivos.useCallback[handleDragLeave]": (e)=>{
            e.preventDefault();
            setIsDragOver(false); // Esconde o overlay
        }
    }["useArquivos.useCallback[handleDragLeave]"], []);
    // Ativado quando o usuário solta o arquivo sobre a área
    const handleDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useArquivos.useCallback[handleDrop]": (e)=>{
            e.preventDefault();
            setIsDragOver(false); // Remove overlay
            // Processa os arquivos soltados (FileList vinda do evento de drag)
            if (e.dataTransfer.files.length > 0) processarArquivos(e.dataTransfer.files);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["useArquivos.useCallback[handleDrop]"], []);
    // ── Handler: análise VeriScan ─────────────────────────────────────────────────
    // Placeholder — a lógica real será integrada com outro sistema no futuro
    // Os arquivos já foram enviados automaticamente ao serem validados
    // Aqui ficará a chamada para a API de análise quando ela for implementada
    function handleAnalisar() {
        const enviados = arquivos.filter((a)=>a.status === 'sucesso');
        // TODO: integrar com a API de análise VeriScan
        // Exemplo de como ficará:
        // const ids = enviados.map((a) => a.idServidor)
        // await fetch('/api/analise', { method: 'POST', body: JSON.stringify({ ids }) })
        console.log('Análise VeriScan iniciada para:', enviados.map((a)=>a.idServidor));
    }
    // Arquivos que foram enviados com sucesso (prontos para análise)
    const arquivosEnviados = arquivos.filter((a)=>a.status === 'sucesso');
    // O botão de análise fica disponível quando há pelo menos 2 imagens enviadas com sucesso
    const podeAnalisar = arquivosEnviados.length >= 2;
    return {
        arquivos,
        isDragOver,
        temArquivos: arquivos.length > 0,
        podeAnalisar,
        processarArquivos,
        remover,
        limparServidor,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        handleAnalisar
    };
}
_s(useArquivos, "CRMxodVF3aXBHs/9KxLdm+cKduc=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/_components/DragOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DragOverlay",
    ()=>DragOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function DragOverlay({ onDrop, onDragOver, onDragLeave }) {
    return(// Seção que ocupa a tela inteira como zona de soltura
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "min-h-screen flex items-center justify-center bg-[#D4FBFF]",
        onDrop: onDrop,
        onDragOver: onDragOver,
        onDragLeave: onDragLeave,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-[min(90vw,420px)] aspect-square rounded-3xl bg-[#D8ADEB]/30 border-2 border-dashed border-[#D8ADEB] flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[#7860E1] font-semibold text-2xl",
                children: "Solte a imagem aqui"
            }, void 0, false, {
                fileName: "[project]/src/app/_components/DragOverlay.tsx",
                lineNumber: 21,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/_components/DragOverlay.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/_components/DragOverlay.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this));
}
_c = DragOverlay;
var _c;
__turbopack_context__.k.register(_c, "DragOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/_components/ThumbnailPreview.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThumbnailPreview",
    ()=>ThumbnailPreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// Componente de miniatura: renderiza um preview da imagem local antes do upload
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function ThumbnailPreview({ file }) {
    _s();
    // Cria uma URL temporária apontando para o arquivo em memória
    // A função inicializadora do useState roda apenas uma vez (na montagem)
    // evitando recriar a URL a cada re-render do componente pai
    const [src] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ThumbnailPreview.useState": ()=>URL.createObjectURL(file)
    }["ThumbnailPreview.useState"]);
    return(// eslint-disable-next-line @next/next/no-img-element
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
        src: src,
        alt: "",
        className: "w-full h-full object-cover",
        onLoad: ()=>URL.revokeObjectURL(src)
    }, void 0, false, {
        fileName: "[project]/src/app/_components/ThumbnailPreview.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this));
}
_s(ThumbnailPreview, "7h34OBKFLUJ6IGYtt7UzbvFzzHw=");
_c = ThumbnailPreview;
var _c;
__turbopack_context__.k.register(_c, "ThumbnailPreview");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/_components/ArquivoItem.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArquivoItem",
    ()=>ArquivoItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// Componente que exibe uma linha na lista de arquivos com miniatura, status e ações
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$ThumbnailPreview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/ThumbnailPreview.tsx [app-client] (ecmascript)");
'use client';
;
;
// Mapeamento de status → cor da bolinha de status e rótulo acessível
const statusConfig = {
    validando: {
        cor: 'bg-gray-400',
        label: 'Validando'
    },
    enviando: {
        cor: 'bg-yellow-400',
        label: 'Enviando'
    },
    sucesso: {
        cor: 'bg-green-500',
        label: 'Enviado'
    },
    erro: {
        cor: 'bg-red-500',
        label: 'Erro'
    }
};
function ArquivoItem({ item, onRemover }) {
    // Busca a configuração visual para o status atual do arquivo
    const cfg = statusConfig[item.status];
    // O arquivo está em processo (não deve ser removido nem interagir)
    const emProcesso = item.status === 'validando' || item.status === 'enviando';
    return(// Linha do arquivo: miniatura | nome+status | ações
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-3 py-2 border-b border-gray-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$ThumbnailPreview$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThumbnailPreview"], {
                    file: item.file
                }, void 0, false, {
                    fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium text-gray-900 truncate",
                        children: item.nome
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-500",
                                children: item.tamanho
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                                lineNumber: 45,
                                columnNumber: 11
                            }, this),
                            item.mensagemErro && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-red-500",
                                children: item.mensagemErro
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                                lineNumber: 49,
                                columnNumber: 13
                            }, this),
                            item.status === 'enviando' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-yellow-600 animate-pulse",
                                children: "Enviando…"
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this),
                            item.status === 'validando' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-400 animate-pulse",
                                children: "Aguardando…"
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                                lineNumber: 59,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1 flex-shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        title: cfg.label,
                        className: `w-2 h-2 rounded-full ${cfg.cor} flex-shrink-0`
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    item.status === 'sucesso' && item.urlServidor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: item.urlServidor,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        title: `Abrir imagem (ID: ${item.idServidor})`,
                        className: " w-6 h-6 rounded-full bg-[#7860E1] hover:bg-[#6450c9] flex items-center justify-center text-white text-[11px] transition-colors cursor-pointer ",
                        children: "↗"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onRemover(item.id),
                        disabled: emProcesso,
                        className: " w-6 h-6 rounded-full bg-red-400 hover:bg-red-600 flex items-center justify-center text-white text-[10px] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ",
                        title: "Remover",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/ArquivoItem.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this));
}
_c = ArquivoItem;
var _c;
__turbopack_context__.k.register(_c, "ArquivoItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/_components/UploadBox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UploadBox",
    ()=>UploadBox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// Componente da caixa de upload: exibe a área de seleção e a lista de arquivos
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$ArquivoItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/ArquivoItem.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// String com todos os MIME types aceitos — usada no atributo "accept" do input
// Espelha a lista do backend (config/multer.js) para filtragem dupla (client + server)
const ACCEPT = [
    'image/jpeg'
].join(',');
function UploadBox({ arquivos, temArquivos, podeAnalisar, onProcessar, onRemover, onAnalisar }) {
    _s();
    // Ref para acionar o input file oculto ao clicar no botão visível
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Disparado quando o usuário seleciona arquivos pelo diálogo do sistema
    function handleFileChange(e) {
        if (e.target.files) onProcessar(e.target.files); // Passa os arquivos para o hook
        e.target.value = ''; // Limpa o input para permitir selecionar o mesmo arquivo novamente
    }
    // Conta quantos arquivos foram enviados com sucesso (têm URL do servidor)
    const enviados = arquivos.filter((a)=>a.status === 'sucesso').length;
    // Conta arquivos ainda em processo (validando ou enviando)
    const emProcesso = arquivos.filter((a)=>a.status === 'validando' || a.status === 'enviando').length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: " bg-white w-[min(85vw,300px)] md:w-[280px] lg:w-[420px] shrink-0 mt-0 md:mt-30 lg:mt-46 mx-auto md:mx-0 md:mr-6 lg:mr-10 rounded-3xl border-2 border-[#8F8F8F] shadow-xl flex flex-col items-center px-5 py-5 md:py-6 lg:py-8 z-10 relative ",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: inputRef,
                type: "file",
                accept: ACCEPT,
                multiple: true,
                className: "hidden",
                onChange: handleFileChange
            }, void 0, false, {
                fileName: "[project]/src/app/_components/UploadBox.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            !temArquivos ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>inputRef.current?.click(),
                        className: "bg-[#D8ADEB] rounded-3xl px-8 py-3 font-semibold text-xl lg:text-3xl text-white w-full hover:bg-[#c97aea] cursor-pointer transition-colors",
                        children: "Faça upload"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/UploadBox.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-semibold text-xl lg:text-3xl mt-3 text-center",
                        children: "Ou arraste sua imagem"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/UploadBox.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true) : /* ── Estado com arquivos: lista + ações ── */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>inputRef.current?.click(),
                        className: "w-full bg-[#D8ADEB] text-white text-sm font-semibold rounded-full py-2 px-4 text-center mb-4 hover:bg-[#c97aea] transition-colors cursor-pointer",
                        children: "+ Adicionar mais imagens"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/UploadBox.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2 w-full max-h-56 overflow-y-auto pr-1",
                        children: arquivos.map((item)=>// Cada arquivo renderizado pelo componente ArquivoItem
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$ArquivoItem$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArquivoItem"], {
                                item: item,
                                onRemover: onRemover
                            }, item.id, false, {
                                fileName: "[project]/src/app/_components/UploadBox.tsx",
                                lineNumber: 103,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/UploadBox.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-xs text-gray-400 text-center",
                        children: [
                            enviados > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-green-600 font-medium",
                                children: [
                                    enviados,
                                    " enviada",
                                    enviados !== 1 ? 's' : '',
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/_components/UploadBox.tsx",
                                lineNumber: 110,
                                columnNumber: 15
                            }, this),
                            emProcesso > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-yellow-500 animate-pulse",
                                children: [
                                    emProcesso,
                                    " enviando… "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/_components/UploadBox.tsx",
                                lineNumber: 113,
                                columnNumber: 15
                            }, this),
                            enviados === 0 && emProcesso === 0 && 'Nenhuma imagem enviada ainda'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/_components/UploadBox.tsx",
                        lineNumber: 108,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onAnalisar,
                        disabled: !podeAnalisar,
                        className: " mt-4 w-full bg-[#7860E1] text-white font-semibold rounded-full py-3 text-sm lg:text-base hover:bg-[#6450c9] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ",
                        title: podeAnalisar ? 'Iniciar análise VeriScan' : 'Envie pelo menos 2 imagens para analisar',
                        children: "Fazer análise VeriScan"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/UploadBox.tsx",
                        lineNumber: 123,
                        columnNumber: 11
                    }, this),
                    !podeAnalisar && enviados < 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-xs text-gray-400 text-center",
                        children: [
                            2 - enviados,
                            " imagem",
                            2 - enviados !== 1 ? 'ns' : '',
                            " ainda necessária",
                            2 - enviados !== 1 ? 's' : ''
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/_components/UploadBox.tsx",
                        lineNumber: 145,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/UploadBox.tsx",
                lineNumber: 89,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/UploadBox.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(UploadBox, "iD9XNNsNOlNDckBemnvlLS+aHYk=");
_c = UploadBox;
var _c;
__turbopack_context__.k.register(_c, "UploadBox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/_components/inicial.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Inicial",
    ()=>Inicial
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// Componente raiz da página inicial — orquestra layout, drag-and-drop e cleanup
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Rob$f4$Pessoa$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Rob$f4$Pessoa$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/public/RobôPessoa.png.mjs { IMAGE => "[project]/public/RobôPessoa.png (static in ecmascript, tag client)" } [app-client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$hooks$2f$useArquivos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/hooks/useArquivos.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$DragOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/DragOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$UploadBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/UploadBox.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function Inicial() {
    _s();
    // Hook que centraliza toda a lógica de estado e upload de arquivos
    const { arquivos, isDragOver, temArquivos, podeAnalisar, processarArquivos, remover, limparServidor, handleDrop, handleDragOver, handleDragLeave, handleAnalisar } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$hooks$2f$useArquivos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useArquivos"])();
    // ── Efeito: registra listener para limpar imagens ao fechar/sair do site ──────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Inicial.useEffect": ()=>{
            // "beforeunload" é disparado quando o usuário fecha a aba, navega para fora
            // ou recarrega a página — momento ideal para limpar arquivos do servidor
            const handleBeforeUnload = {
                "Inicial.useEffect.handleBeforeUnload": ()=>{
                    limparServidor(); // Envia DELETE /api/cleanup (usa sendBeacon para garantir envio)
                }
            }["Inicial.useEffect.handleBeforeUnload"];
            // Registra o listener no evento de saída da página
            window.addEventListener('beforeunload', handleBeforeUnload);
            // Função de limpeza do useEffect: remove o listener quando o componente é desmontado
            // Evita vazamento de memória e múltiplos listeners em caso de re-render
            return ({
                "Inicial.useEffect": ()=>{
                    window.removeEventListener('beforeunload', handleBeforeUnload);
                }
            })["Inicial.useEffect"];
        }
    }["Inicial.useEffect"], [
        limparServidor
    ]); // Reexecuta se limparServidor mudar (não deve acontecer, mas é boa prática)
    // ── Modo drag-and-drop ativa overlay de tela inteira ─────────────────────────
    if (isDragOver) {
        return(// Componente de overlay exibido quando o usuário arrasta algo sobre a janela
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$DragOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DragOverlay"], {
            onDrop: handleDrop,
            onDragOver: handleDragOver,
            onDragLeave: handleDragLeave
        }, void 0, false, {
            fileName: "[project]/src/app/_components/inicial.tsx",
            lineNumber: 49,
            columnNumber: 7
        }, this));
    }
    return(// Seção principal — a área inteira é zona de drag-and-drop
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "overflow-hidden relative min-h-screen",
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto relative min-h-screen",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Rob$f4$Pessoa$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Rob$f4$Pessoa$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                    alt: "Humano com dúvidas, robô com certeza",
                    quality: 100,
                    priority: true,
                    sizes: "(max-width: 768px) 60vw, (max-width: 1024px) 45vw, 600px",
                    className: " absolute bottom-0 left-0 z-0 w-[99vw] max-w-[380px] md:w-[55vw] md:max-w-[480px] lg:w-[60vw] lg:max-w-[600px] h-auto object-contain opacity-30 md:opacity-100 "
                }, void 0, false, {
                    fileName: "[project]/src/app/_components/inicial.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                    className: "relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 md:px-8 md:flex-1 mt-3 md:mt-20 md:ml-10",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "font-semibold text-3xl md:text-4xl lg:text-5xl leading-tight text-center md:text-left",
                                children: [
                                    "Saiba qual imagem é real",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mt-2 flex items-center justify-center md:justify-start flex-wrap gap-2",
                                        children: [
                                            "e qual é",
                                            ' ',
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                className: "text-white bg-[#7860E1] px-2 py-1 rounded-md text-3xl md:text-4xl lg:text-5xl",
                                                children: "modificada"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/_components/inicial.tsx",
                                                lineNumber: 93,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/_components/inicial.tsx",
                                        lineNumber: 91,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/_components/inicial.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/inicial.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$UploadBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UploadBox"], {
                            arquivos: arquivos,
                            temArquivos: temArquivos,
                            podeAnalisar: podeAnalisar,
                            onProcessar: processarArquivos,
                            onRemover: remover,
                            onAnalisar: handleAnalisar
                        }, void 0, false, {
                            fileName: "[project]/src/app/_components/inicial.tsx",
                            lineNumber: 101,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/_components/inicial.tsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/_components/inicial.tsx",
            lineNumber: 65,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/_components/inicial.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this));
}
_s(Inicial, "7hhqzHwWf6aKdDNxGlyhi03jCkA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$hooks$2f$useArquivos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useArquivos"]
    ];
});
_c = Inicial;
var _c;
__turbopack_context__.k.register(_c, "Inicial");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0ga4vx_._.js.map