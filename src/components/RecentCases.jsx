// src/components/RecentCases.jsx
import React, { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function RecentCases(){
  const [items, setItems] = useState([]);
  useEffect(()=>{ fetchRecent(); }, []);
  async function fetchRecent(){
    try{
      const res = await fetch(`${API}/api/recent`);
      const data = await res.json();
      if(data.ok) setItems(data.items || []);
    }catch(e){ console.error(e); }
  }

  return (
    <section className="mt-10 max-w-5xl mx-auto">
      {/* <h3 className="text-2xl font-bold mb-4">Casos recientes de verificación</h3> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.length ? items.map(it => (
          <div key={it.id} className="recent-card">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-red-700">{it.tags?.[0] ?? "GENERAL"}</span>
              <span className={`text-sm font-bold ${it.result?.veredicto==='VERDADERO'?'text-green-600':it.result?.veredicto==='FALSO'?'text-red-600':'text-yellow-600'}`}>{it.result?.veredicto ?? 'INCONCLUSO'}</span>
            </div>
            <h4 className="mt-2 font-semibold">{it.title ?? (it.input_text || '').slice(0,80)}</h4>
            <p className="text-xs text-gray-600 mt-2">{it.excerpt ?? ''}</p>
          </div>
        )) : (
          <div className="text-sm text-gray-500 col-span-3"></div>
        )}
      </div>
    </section>
  );
}
