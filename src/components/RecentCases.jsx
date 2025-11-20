// src/components/RecentCases.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE || "https://veri-valle-backend.vercel.app";

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch { return iso; }
}

export default function RecentCases({ limit = 6 }) {
  const [items, setItems] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const res = await axios.get(`${BASE_URL}/api/recent?t=${Date.now()}`, {
          // no withCredentials by default; si usas cookies set withCredentials:true y config en backend
          headers: { Accept: "application/json" },
          timeout: 10000
        });

        if (!mounted) return;
        const data = res.data;
        if (!data || !data.ok) throw new Error(data?.error || "Respuesta inválida del servidor");
        // tu backend devolvía items en varios keys; en mi versión devuelve items o verifications_sample
        const itemsArr = data.items || data.verifications_sample || data.verifications || [];
        setItems((itemsArr || []).slice(0, limit));
      } catch (e) {
        // axios error handling
        const msg = e?.response ? `HTTP ${e.response.status}` : (e.message || String(e));
        setErr(msg);
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [limit]);

  if (loading) return <div className="mt-6 p-6 bg-white rounded shadow">Cargando verificaciones recientes…</div>;
  if (err) return <div className="mt-6 p-6 bg-red-100 text-red-800 rounded">Error al cargar: {err}</div>;
  if (!items || items.length === 0) return <div className="mt-6 p-6 bg-white rounded shadow">No hay verificaciones publicadas aún.</div>;

  return (
    <section className="mt-8 grid gap-6">
      {items.map(it => (
        <article key={it.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{it.title || it.input_text || "Verificación"}</h3>
              <p className="text-sm text-gray-600 mt-1">{it.excerpt || (it.summary ? it.summary.slice(0, 200) + "…" : "")}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Veredicto</div>
              <div className={`font-bold ${it.verdict === "VERDADERO" ? "text-green-700" : it.verdict === "FALSO" ? "text-red-700" : "text-gray-700"}`}>
                {it.verdict ?? "INCONCLUSO"}
              </div>
              <div className="mt-2 px-2 py-1 bg-amber-500 text-white rounded text-xs font-semibold">
                Confianza: {typeof it.confidence === "number" ? it.confidence : (it.confidence ?? "—")}%
              </div>
            </div>
          </div>

          {it.evidences?.length > 0 && (
            <ul className="mt-4 list-disc ml-5 text-sm text-blue-800">
              {it.evidences.map((e, i) => {
                if (typeof e === "string") {
                  const match = e.match(/https?:\/\/[^\s)]+/);
                  const url = match ? match[0] : null;
                  const label = url ? e.replace(url, "").trim() || url : e;
                  return (
                    <li key={i}>
                      {url ? <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">{label}</a> : <span>{label}</span>}
                    </li>
                  );
                } else if (e && e.url) {
                  return <li key={i}><a href={e.url} target="_blank" rel="noopener noreferrer">{e.title || e.url}</a></li>;
                } else {
                  return <li key={i}><span>{JSON.stringify(e)}</span></li>;
                }
              })}
            </ul>
          )}

          <div className="mt-4 text-xs text-gray-400">Publicado: {formatDate(it.published_at || it.created_at)}</div>
        </article>
      ))}
    </section>
  );
}
