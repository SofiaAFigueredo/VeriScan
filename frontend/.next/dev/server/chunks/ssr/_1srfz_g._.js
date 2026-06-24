module.exports = [
"[project]/public/RobôPessoa.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/RobôPessoa.3hhnt0ye0xeak.png" + (globalThis["NEXT_CLIENT_ASSET_SUFFIX"] || ''));}),
"[project]/public/RobôPessoa.png.mjs { IMAGE => \"[project]/public/RobôPessoa.png (static in ecmascript, tag client)\" } [app-ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/app/_components/hooks/useArquivos.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useArquivos",
    ()=>useArquivos
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
const DIMENSAO_MAXIMA = 260 // px — não pode ULTRAPASSAR
;
function formatarTamanho(bytes) {
    return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} kb` : `${(bytes / (1024 * 1024)).toFixed(1)} mb`;
}
/** Verifica se a imagem não ultrapassa 260x260px */ function verificarDimensoes(file) {
    return new Promise((resolve)=>{
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = ()=>{
            URL.revokeObjectURL(url);
            resolve({
                ok: img.width <= DIMENSAO_MAXIMA && img.height <= DIMENSAO_MAXIMA,
                largura: img.width,
                altura: img.height
            });
        };
        img.onerror = ()=>{
            URL.revokeObjectURL(url);
            resolve({
                ok: false,
                largura: 0,
                altura: 0
            });
        };
        img.src = url;
    });
}
/** Envia um arquivo ao backend e retorna a URL pública dele */ async function enviarArquivo(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData
    });
    if (!res.ok) throw new Error('Falha no upload');
    const data = await res.json();
    // O backend retorna { arquivo: "hash-nome.jpg" }
    return `/api/uploads/${data.arquivo}`;
}
function useArquivos() {
    const [arquivos, setArquivos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isDragOver, setIsDragOver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [enviando, setEnviando] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [resultado, setResultado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Apaga todos os arquivos do servidor somente ao fechar/sair da página
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const limpar = ()=>{
            fetch('/api/cleanup', {
                method: 'DELETE',
                keepalive: true
            }).catch(()=>{});
        };
        window.addEventListener('beforeunload', limpar);
        return ()=>window.removeEventListener('beforeunload', limpar);
    }, []);
    async function processarArquivos(files) {
        const lista = Array.from(files);
        for (const file of lista){
            const { ok, largura, altura } = await verificarDimensoes(file);
            if (!ok) {
                // Bloqueia: imagem maior que 260x260
                const item = {
                    id: crypto.randomUUID(),
                    file,
                    nome: file.name,
                    tamanho: formatarTamanho(file.size),
                    status: 'erro',
                    mensagemErro: `Imagem muito grande: ${largura}×${altura}px. Máximo permitido: ${DIMENSAO_MAXIMA}×${DIMENSAO_MAXIMA}px`
                };
                setArquivos((prev)=>[
                        ...prev,
                        item
                    ]);
                continue;
            }
            // Adiciona na lista como "enviando" imediatamente
            const id = crypto.randomUUID();
            setArquivos((prev)=>[
                    ...prev,
                    {
                        id,
                        file,
                        nome: file.name,
                        tamanho: formatarTamanho(file.size),
                        status: 'enviando'
                    }
                ]);
            // Faz o upload em background e atualiza o item quando terminar
            enviarArquivo(file).then((urlServidor)=>{
                setArquivos((prev)=>prev.map((a)=>a.id === id ? {
                            ...a,
                            status: 'enviado',
                            urlServidor
                        } : a));
            }).catch(()=>{
                setArquivos((prev)=>prev.map((a)=>a.id === id ? {
                            ...a,
                            status: 'erro',
                            mensagemErro: 'Falha ao enviar ao servidor.'
                        } : a));
            });
        }
        setResultado(null);
    }
    function remover(id) {
        setArquivos((prev)=>prev.filter((a)=>a.id !== id));
    }
    const handleDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files) processarArquivos(e.dataTransfer.files);
    }, []);
    const handleDragOver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.preventDefault();
        setIsDragOver(true);
    }, []);
    const handleDragLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.preventDefault();
        setIsDragOver(false);
    }, []);
    async function handleAnalisar() {
        const enviados = arquivos.filter((a)=>a.status === 'enviado');
        if (enviados.length < 2) return;
        setEnviando(true);
        setResultado(null);
        try {
            // Arquivos já estão no servidor — só sinaliza a análise
            await new Promise((r)=>setTimeout(r, 500));
            setResultado('Análise enviada com sucesso!');
        } catch  {
            setResultado('Erro ao iniciar análise.');
        } finally{
            setEnviando(false);
        }
    }
    const arquivosEnviados = arquivos.filter((a)=>a.status === 'enviado');
    return {
        arquivos,
        isDragOver,
        enviando,
        resultado,
        temArquivos: arquivos.length > 0,
        podeAnalisar: arquivosEnviados.length >= 2,
        processarArquivos,
        remover,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        handleAnalisar
    };
}
}),
"[project]/src/app/_components/DragOverlay.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DragOverlay",
    ()=>DragOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
'use client';
;
function DragOverlay({ onDrop, onDragOver, onDragLeave }) {
    return(// Seção que ocupa a tela inteira como zona de soltura
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "min-h-screen flex items-center justify-center bg-[#D4FBFF]",
        onDrop: onDrop,
        onDragOver: onDragOver,
        onDragLeave: onDragLeave,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-[min(90vw,420px)] aspect-square rounded-3xl bg-[#D8ADEB]/30 border-2 border-dashed border-[#D8ADEB] flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
}),
"[project]/src/app/_components/ThumbnailPreview.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThumbnailPreview",
    ()=>ThumbnailPreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function ThumbnailPreview({ file }) {
    const [src] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>URL.createObjectURL(file));
    if (!src) return null;
    return(// eslint-disable-next-line @next/next/no-img-element
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
        src: src,
        alt: "",
        className: "w-full h-full object-cover",
        style: {
            imageRendering: 'auto'
        },
        onLoad: (e)=>{
            // Revoga a URL só depois que a imagem carregou completamente
            const target = e.currentTarget;
            setTimeout(()=>URL.revokeObjectURL(target.src), 5000);
        }
    }, void 0, false, {
        fileName: "[project]/src/app/_components/ThumbnailPreview.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this));
}
}),
"[project]/src/app/_components/ArquivoItem.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArquivoItem",
    ()=>ArquivoItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$ThumbnailPreview$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/ThumbnailPreview.tsx [app-ssr] (ecmascript)");
'use client';
;
;
function ArquivoItem({ item, onRemover }) {
    const temErro = item.status === 'erro';
    const enviando = item.status === 'enviando';
    const enviado = item.status === 'enviado';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center gap-3 py-2 border-b ${temErro ? 'border-red-200 bg-red-50 rounded-lg px-2' : 'border-gray-100'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-14 h-14 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden",
                children: temErro ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full h-full flex items-center justify-center text-red-400 text-xl",
                    children: "✕"
                }, void 0, false, {
                    fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                    lineNumber: 22,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$ThumbnailPreview$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThumbnailPreview"], {
                    file: item.file
                }, void 0, false, {
                    fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                    lineNumber: 24,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `text-sm font-medium truncate ${temErro ? 'text-red-700' : 'text-gray-900'}`,
                        children: item.nome
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-500",
                                children: item.tamanho
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, this),
                            !temErro && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-xs font-medium ${enviando ? 'text-yellow-500' : enviado ? 'text-green-600' : ''}`,
                                children: enviando ? 'Enviando...' : enviado ? 'Enviado ✓' : ''
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                                lineNumber: 36,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onRemover(item.id),
                                className: "text-xs text-red-500 hover:text-red-700 cursor-pointer",
                                children: "Excluir"
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    temErro && item.mensagemErro && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-red-600 mt-0.5",
                        children: item.mensagemErro
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                        lineNumber: 48,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1 flex-shrink-0",
                children: [
                    temErro ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-5 h-5 rounded-full bg-red-400 flex items-center justify-center text-white text-[10px]",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                        lineNumber: 55,
                        columnNumber: 11
                    }, this) : enviando ? /* Spinner enquanto faz upload */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-white text-[10px] animate-spin",
                        children: "◌"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                        lineNumber: 60,
                        columnNumber: 11
                    }, this) : enviado ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: item.urlServidor,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                title: "Abrir imagem no servidor",
                                className: "w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-white text-[10px] hover:bg-gray-800 cursor-pointer",
                                children: "🔗"
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px]",
                                children: "✓"
                            }, void 0, false, {
                                fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onRemover(item.id),
                        className: "w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] cursor-pointer hover:bg-red-600",
                        children: "✕"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/_components/ArquivoItem.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/_components/ArquivoItem.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/_components/UploadBox.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UploadBox",
    ()=>UploadBox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
// Componente da caixa de upload: exibe a área de seleção e a lista de arquivos
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$ArquivoItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/ArquivoItem.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
// String com todos os MIME types aceitos — usada no atributo "accept" do input
// Espelha a lista do backend (config/multer.js) para filtragem dupla (client + server)
const ACCEPT = [
    'image/jpeg'
].join(',');
function UploadBox({ arquivos, temArquivos, podeAnalisar, onProcessar, onRemover, onAnalisar }) {
    // Ref para acionar o input file oculto ao clicar no botão visível
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Disparado quando o usuário seleciona arquivos pelo diálogo do sistema
    function handleFileChange(e) {
        if (e.target.files) onProcessar(e.target.files); // Passa os arquivos para o hook
        e.target.value = ''; // Limpa o input para permitir selecionar o mesmo arquivo novamente
    }
    // Conta quantos arquivos foram enviados com sucesso (têm URL do servidor)
    const enviados = arquivos.filter((a)=>a.status === 'sucesso').length;
    // Conta arquivos ainda em processo (validando ou enviando)
    const emProcesso = arquivos.filter((a)=>a.status === 'validando' || a.status === 'enviando').length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: " bg-white w-[min(85vw,300px)] md:w-[280px] lg:w-[420px] shrink-0 mt-0 md:mt-30 lg:mt-46 mx-auto md:mx-0 md:mr-6 lg:mr-10 rounded-3xl border-2 border-[#8F8F8F] shadow-xl flex flex-col items-center px-5 py-5 md:py-6 lg:py-8 z-10 relative ",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            !temArquivos ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>inputRef.current?.click(),
                        className: "bg-[#D8ADEB] rounded-3xl px-8 py-3 font-semibold text-xl lg:text-3xl text-white w-full hover:bg-[#c97aea] cursor-pointer transition-colors",
                        children: "Faça upload"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/UploadBox.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-semibold text-xl lg:text-3xl mt-3 text-center",
                        children: "Ou arraste sua imagem"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/UploadBox.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true) : /* ── Estado com arquivos: lista + ações ── */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>inputRef.current?.click(),
                        className: "w-full bg-[#D8ADEB] text-white text-sm font-semibold rounded-full py-2 px-4 text-center mb-4 hover:bg-[#c97aea] transition-colors cursor-pointer",
                        children: "+ Adicionar mais imagens"
                    }, void 0, false, {
                        fileName: "[project]/src/app/_components/UploadBox.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2 w-full max-h-56 overflow-y-auto pr-1",
                        children: arquivos.map((item)=>// Cada arquivo renderizado pelo componente ArquivoItem
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$ArquivoItem$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ArquivoItem"], {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-xs text-gray-400 text-center",
                        children: [
                            enviados > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            emProcesso > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                    !podeAnalisar && enviados < 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
}),
"[project]/src/app/_components/inicial.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Inicial",
    ()=>Inicial
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
// Componente raiz da página inicial — orquestra layout, drag-and-drop e cleanup
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Rob$f4$Pessoa$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Rob$f4$Pessoa$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/public/RobôPessoa.png.mjs { IMAGE => "[project]/public/RobôPessoa.png (static in ecmascript, tag client)" } [app-ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$hooks$2f$useArquivos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/hooks/useArquivos.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$DragOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/DragOverlay.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$UploadBox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/_components/UploadBox.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function Inicial() {
    // Hook que centraliza toda a lógica de estado e upload de arquivos
    const { arquivos, isDragOver, temArquivos, podeAnalisar, processarArquivos, remover, limparServidor, handleDrop, handleDragOver, handleDragLeave, handleAnalisar } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$hooks$2f$useArquivos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useArquivos"])();
    // ── Efeito: registra listener para limpar imagens ao fechar/sair do site ──────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // "beforeunload" é disparado quando o usuário fecha a aba, navega para fora
        // ou recarrega a página — momento ideal para limpar arquivos do servidor
        const handleBeforeUnload = ()=>{
            limparServidor(); // Envia DELETE /api/cleanup (usa sendBeacon para garantir envio)
        };
        // Registra o listener no evento de saída da página
        window.addEventListener('beforeunload', handleBeforeUnload);
        // Função de limpeza do useEffect: remove o listener quando o componente é desmontado
        // Evita vazamento de memória e múltiplos listeners em caso de re-render
        return ()=>{
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [
        limparServidor
    ]); // Reexecuta se limparServidor mudar (não deve acontecer, mas é boa prática)
    // ── Modo drag-and-drop ativa overlay de tela inteira ─────────────────────────
    if (isDragOver) {
        return(// Componente de overlay exibido quando o usuário arrasta algo sobre a janela
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$DragOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DragOverlay"], {
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
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "overflow-hidden relative min-h-screen",
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto relative min-h-screen",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    src: __TURBOPACK__imported__module__$5b$project$5d2f$public$2f$Rob$f4$Pessoa$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$public$2f$Rob$f4$Pessoa$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                    className: "relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 md:px-8 md:flex-1 mt-3 md:mt-20 md:ml-10",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "font-semibold text-3xl md:text-4xl lg:text-5xl leading-tight text-center md:text-left",
                                children: [
                                    "Saiba qual imagem é real",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mt-2 flex items-center justify-center md:justify-start flex-wrap gap-2",
                                        children: [
                                            "e qual é",
                                            ' ',
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$_components$2f$UploadBox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UploadBox"], {
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
}),
];

//# sourceMappingURL=_1srfz_g._.js.map