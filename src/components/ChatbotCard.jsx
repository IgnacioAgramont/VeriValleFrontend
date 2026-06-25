// src/components/ChatbotCard.jsx
import React, { useState, useEffect } from "react";

// Función helper para parsear enlaces en formato markdown [Texto](url) y evitar desbordamientos
function renderTextWithLinks(text) {
    if (!text) return "";
    const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const [fullMatch, linkText, linkUrl] = match;
        const startIndex = match.index;

        // Agregar texto previo
        if (startIndex > lastIndex) {
            parts.push(text.substring(lastIndex, startIndex));
        }

        // Agregar enlace como componente React
        parts.push(
            <a 
                key={startIndex} 
                href={linkUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-red-800 hover:text-red-600 hover:underline font-semibold break-all"
            >
                {linkText}
            </a>
        );

        lastIndex = regex.lastIndex;
    }

    // Agregar el resto del texto
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
}

export default function ChatbotCard({ onVerificationComplete }) {
    const [input, setInput] = useState("");
    const [loadingStage, setLoadingStage] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [attemptsLog, setAttemptsLog] = useState([]);
    const [showLoader, setShowLoader] = useState(false);

    // FRONT: URL del backend (preferible: definir VITE_API_BASE en Netlify)
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    const baseUrl = import.meta.env.VITE_API_BASE || (isLocal ? "http://localhost:3001" : "https://veri-valle-backend.vercel.app");

    useEffect(() => {
        if (result) {
            setLoadingStage(null);
            setTimeout(() => setShowLoader(false), 500);
        }
    }, [result]);

    function stageMessage(stage) {
        switch (stage) {
            case "stage1":
                return "Buscando coincidencias en fuentes bolivianas confiables...";
            case "stage2":
                return "Ampliando búsqueda a fuentes internacionales verificadas...";
            case "stage3":
                return "Analizando resultados y generando veredicto...";
            default:
                return null;
        }
    }

    function startLocalProgression() {
        setShowLoader(true);
        setLoadingStage("stage1");
        setTimeout(() => setLoadingStage("stage2"), 1800);
        setTimeout(() => setLoadingStage("stage3"), 4300);
    }

    // ------------------ handleVerifyText (front) ------------------
    async function handleVerifyText(e) {
        e?.preventDefault();
        setError(null);
        setResult(null);
        setAttemptsLog([]);
        startLocalProgression();

        // Timeout (20s)
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);

        try {
            console.log("[FRONT] Enviando POST a:", `${baseUrl}/api/verify/text`, "input:", input);

            const resp = await fetch(`${baseUrl}/api/verify/text`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: input }),
                signal: controller.signal,
                // credentials: "include" // activar si tu backend requiere cookies
            });

            clearTimeout(timeout);

            console.log("[FRONT] STATUS", resp.status, resp.statusText);

            // Leemos raw (por si no es JSON)
            const raw = await resp.text().catch(() => null);
            console.log("[FRONT] RAW TEXT:", raw);

            let data = null;
            try {
                data = raw ? JSON.parse(raw) : null;
            } catch (err) {
                console.warn("[FRONT] respuesta NO JSON:", err);
                setError("Respuesta del servidor no es JSON válido. Revisa la consola (RAW TEXT).");
                setLoadingStage(null);
                setShowLoader(false);
                return;
            }

            if (!data) {
                setError("Respuesta vacía del servidor.");
                setLoadingStage(null);
                setShowLoader(false);
                return;
            }

            console.log("[FRONT] parsed data:", data);

            if (data.ok === false) {
                setError(data.error || "Error retornado por servidor.");
                setLoadingStage(null);
                setShowLoader(false);
                return;
            }

            // Si backend devuelve `result`
            if (data.result) {
                setAttemptsLog(data.attemptsLog || []);
                setResult(data.result);
                setLoadingStage(null);
                setShowLoader(false);
                if (onVerificationComplete) onVerificationComplete();
                return;
            }

            // Fallback: si viene ok true pero sin result
            setAttemptsLog(data.attemptsLog || []);
            setError("Servidor respondió sin campo 'result'. Mira consola para más detalles.");
            setLoadingStage(null);
            setShowLoader(false);
        } catch (err) {
            clearTimeout(timeout);
            console.error("[FRONT] fetch error:", err);
            if (err.name === "AbortError") {
                setError("La petición tardó demasiado y fue abortada (timeout).");
            } else {
                setError("Error al verificar la información. Revisa tu conexión o el servidor.");
            }
            setLoadingStage(null);
            setShowLoader(false);
        }
    }
    // ---------------------------------------------------------------

    // Limpia enlaces / formatea evidencia para mostrar
    function parseEvidenceText(e) {
        if (!e) return { text: "", url: null };
        if (typeof e === "object") {
            // objeto { title, url, href, text, ... }
            const url = e.url || e.href || e.link || null;
            // Try to find a text representation
            let txt = e.title || e.text || e.name || e.source || e.fuente || url || "";

            // If text is still empty, try to use the domain from the URL
            if (!txt && url) {
                try {
                    txt = new URL(url).hostname;
                } catch {
                    txt = url;
                }
            }

            return { text: txt, url };
        }
        // string
        const mdMatch = e.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
        if (mdMatch) return { text: mdMatch[1], url: mdMatch[2] };
        const urlMatch = e.match(/https?:\/\/[^\s)]+/);
        if (urlMatch) return { text: e.replace(urlMatch[0], "").trim() || urlMatch[0], url: urlMatch[0] };
        return { text: e, url: null };
    }

    // Normaliza confianza: si viene 0..1 lo transforma a 0..100, si viene >1 lo redondea
    function normalizeConfidence(c) {
        if (c === undefined || c === null) return "—";
        const n = Number(c);
        if (Number.isNaN(n)) return "—";
        let val = n;
        if (val > 0 && val <= 1) val = Math.round(val * 100);
        else val = Math.round(val);
        return `${val}%`;
    }

    return (
        <div id="chatbot" className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 -mt-20 mb-16">
            <h2 className="text-2xl font-semibold mb-4 text-red-800">
                Chatbot de Verificación (IA + Búsqueda Web)
            </h2>

            <div className="flex gap-4">
                <div className="flex-1">
                    <textarea
                        className="w-full border rounded p-4 min-h-[140px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-800"
                        placeholder="Pega aquí una noticia, enlace o afirmación..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                <div className="w-40 flex flex-col gap-3">
                    <button
                        onClick={handleVerifyText}
                        disabled={!input || loadingStage !== null}
                        className="bg-red-800 text-white py-3 rounded-md shadow hover:opacity-90 disabled:opacity-50"
                    >
                        Verificar
                    </button>

                    <button
                        onClick={() => {
                            setInput("");
                            setResult(null);
                            setError(null);
                            setAttemptsLog([]);
                            setLoadingStage(null);
                            setShowLoader(false);
                        }}
                        className="border py-2 rounded hover:bg-gray-50"
                    >
                        Limpiar
                    </button>
                </div>
            </div>

            {/* loader */}
            {showLoader && loadingStage && (
                <div className="mt-6 flex items-center gap-3 p-3 rounded border bg-gray-50 animate-fade-in">
                    <div className="w-6 h-6 border-4 border-red-800 border-t-transparent rounded-full animate-spin" />
                    <div>
                        <div className="font-medium">{stageMessage(loadingStage)}</div>
                        <div className="text-sm text-gray-600">
                            Esto puede tardar unos segundos mientras la IA busca evidencias reales.
                        </div>
                    </div>
                </div>
            )}

            {/* error */}
            {error && <div className="mt-6 p-4 bg-red-100 text-red-800 rounded">{error}</div>}

            {/* resultado */}
            {result && (
                <div className="mt-6 border rounded p-4 bg-white animate-fade-in">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-sm text-gray-600">Veredicto</div>
                            <div
                                className={`text-lg font-semibold ${(result.veredicto || "").toUpperCase() === "VERDADERO"
                                    ? "text-green-700"
                                    : (result.veredicto || "").toUpperCase() === "FALSO"
                                        ? "text-red-700"
                                        : "text-gray-700"
                                    }`}
                            >
                                {result.veredicto ?? "INCONCLUSO"}
                            </div>
                        </div>

                        <div>
                            <div className="px-3 py-1 rounded bg-amber-500 text-white font-semibold">
                                Confianza: {normalizeConfidence(result.confianza)}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-gray-700 leading-relaxed break-words whitespace-pre-line">
                        {result.resumen ? renderTextWithLinks(result.resumen) : "No hay resumen disponible."}
                    </div>

                    {result.sources_used && (
                        <div className="mt-3 text-sm text-gray-500 italic">
                            {result.sources_used === "local" && "🔎 Fuentes utilizadas: Medios bolivianos."}
                            {result.sources_used === "external" && "🌍 Se usaron fuentes internacionales verificadas."}
                            {result.sources_used === "both" && "🌎 Se combinaron fuentes locales e internacionales."}
                        </div>
                    )}

                    {Array.isArray(result.evidencias) && result.evidencias.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-medium text-gray-700 mb-2">Fuentes consultadas:</h3>
                            <ul className="list-disc ml-5 text-sm text-blue-800 space-y-1">
                                {result.evidencias.map((ev, i) => {
                                    const parsed = parseEvidenceText(ev);
                                    return (
                                        <li key={i}>
                                            {parsed.url ? (
                                                <a href={parsed.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                    {parsed.text || parsed.url}
                                                </a>
                                            ) : (
                                                <span className="text-gray-700">{parsed.text}</span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {attemptsLog?.length > 0 && (
                        <details className="mt-4 text-sm text-gray-500">
                            <summary className="cursor-pointer">Detalles técnicos ({attemptsLog.length} etapas)</summary>
                            <pre className="bg-gray-50 p-2 rounded mt-2 overflow-auto text-xs">
                                {JSON.stringify(attemptsLog, null, 2)}
                            </pre>
                        </details>
                    )}
                </div>
            )}
        </div>
    );
}
