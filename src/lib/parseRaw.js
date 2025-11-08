// client/src/lib/parseRaw.js
export function extractJsonFromRaw(raw) {
  if (!raw) return null;
  // si raw es objeto que contiene fullResp/choices, intenta navegar
  if (typeof raw === "object") {
    // probar si ya es JSON válido con las claves esperadas
    if (raw.veredicto || raw.verdict) return raw;
    // si viene un objeto fullResp con choices -> extraer contenido text
    const maybeText =
      raw?.fullResp?.choices?.[0]?.message?.content ||
      raw?.choices?.[0]?.message?.content ||
      raw?.text ||
      null;
    if (maybeText) raw = String(maybeText);
  }

  // si raw es string, buscar el bloque JSON dentro de backticks ```json ... ```
  const s = String(raw);
  // buscar el primer { que abre JSON y el último } que cierra
  const jsonMatch = s.match(/```(?:json)?\s*([\s\S]*?)```/) || s.match(/({[\s\S]*})/);
  const candidate = jsonMatch ? jsonMatch[1] : null;
  if (!candidate) return null;

  try {
    return JSON.parse(candidate);
  } catch (e) {
    // si no parsea, intentar limpiar caracteres no válidos y volver a intentar
    const cleaned = candidate.replace(/\u0000/g, "");
    try { return JSON.parse(cleaned); } catch (e2) { return null; }
  }
}
