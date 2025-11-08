import React, { useState, useEffect } from "react";

export default function ChatbotCard() {
  const [input, setInput] = useState("");
  const [loadingStage, setLoadingStage] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [attemptsLog, setAttemptsLog] = useState([]);
  const [showLoader, setShowLoader] = useState(false); // controla la animación visible

  // temporalmente forzar backend público
  const baseUrl = "https://veri-valle-backend.vercel.app";


  // 🔧 Apaga loader cuando llega resultado
  useEffect(() => {
    if (result) {
      setLoadingStage(null);
      // espera 0.5s y desaparece el bloque
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
    setTimeout(() => setLoadingStage("stage2"), 2000);
    setTimeout(() => setLoadingStage("stage3"), 5000);
  }

    // pega esto dentro del componente ChatbotCard, antes del return(...)
    async function handleVerifyText(e) {
    e?.preventDefault();
    setError(null);
    setResult(null);
    setAttemptsLog([]);
    startLocalProgression();

    // AbortController para evitar loader infinito (timeout 12s)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
        console.log("[FRONT] enviando POST a:", `${baseUrl}/api/verify/text`, "input:", input);

        const resp = await fetch(`${baseUrl}/api/verify/text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
        signal: controller.signal
        });

        clearTimeout(timeout);
        console.log("[FRONT] status:", resp.status, resp.statusText);

        // leer raw en todos los casos (por si no es JSON)
        const raw = await resp.text().catch(() => null);
        console.log("[FRONT] raw response text:", raw);

        let data = null;
        try {
        data = raw ? JSON.parse(raw) : null;
        } catch (err) {
        console.warn("[FRONT] respuesta NO JSON:", err);
        setError("Respuesta del servidor no es JSON válido. Mira la consola para más info.");
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

        if (data.result) {
        setAttemptsLog(data.attemptsLog || []);
        setResult(data.result);
        setLoadingStage(null);
        setShowLoader(false);
        return;
        }

        // fallback si viene ok true pero sin result
        setAttemptsLog(data.attemptsLog || []);
        setError("Servidor respondió sin campo 'result'. Revisa backend. (Mira consola)");
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


  // ✅ Limpia los enlaces tipo Markdown o texto plano
  function parseEvidenceText(e) {
    if (!e) return { text: "", url: null };

    // Caso 1: formato [texto](url)
    const mdMatch = e.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
    if (mdMatch) return { text: mdMatch[1], url: mdMatch[2] };

    // Caso 2: contiene URL en texto plano
    const urlMatch = e.match(/https?:\/\/[^\s)]+/);
    if (urlMatch) return { text: e.replace(urlMatch[0], "").trim() || urlMatch[0], url: urlMatch[0] };

    // Caso 3: solo texto
    return { text: e, url: null };
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 -mt-20 mb-16">
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
                className={`text-lg font-semibold ${
                  result.veredicto === "VERDADERO"
                    ? "text-green-700"
                    : result.veredicto === "FALSO"
                    ? "text-red-700"
                    : "text-gray-700"
                }`}
              >
                {result.veredicto ?? "INCONCLUSO"}
              </div>
            </div>
            <div>
              <div className="px-3 py-1 rounded bg-amber-500 text-white font-semibold">
                Confianza: {result.confianza ?? "—"}%
              </div>
            </div>
          </div>

          <div className="mt-4 text-gray-700 leading-relaxed">
            {result.resumen ?? "No hay resumen disponible."}
          </div>

          {result.sources_used && (
            <div className="mt-3 text-sm text-gray-500 italic">
              {result.sources_used === "local" && "🔎 Fuentes utilizadas: Medios bolivianos."}
              {result.sources_used === "external" && "🌍 Se usaron fuentes internacionales verificadas."}
              {result.sources_used === "both" && "🌎 Se combinaron fuentes locales e internacionales."}
            </div>
          )}

            {result.evidencias?.length > 0 && (
            <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">Fuentes consultadas:</h3>
                <ul className="list-disc ml-5 text-sm text-blue-800 space-y-1">
                {result.evidencias.map((ev, i) => {
                    const title = ev.title || ev.text || ev.url || "Fuente";
                    const url = ev.url || ev.href || null;
                    return (
                    <li key={i}>
                        {url ? (
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            {title}
                        </a>
                        ) : (
                        <span className="text-gray-700">{title}</span>
                        )}
                    </li>
                    );
                })}
                </ul>
            </div>
            )}


          {attemptsLog?.length > 0 && (
            <details className="mt-4 text-sm text-gray-500">
              <summary className="cursor-pointer">
                Detalles técnicos ({attemptsLog.length} etapas)
              </summary>
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
