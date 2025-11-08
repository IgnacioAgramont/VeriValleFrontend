// src/components/Hero.jsx
import React from "react";

export default function Hero() {
  return (
    <section className="bg-gray-700/90 pb-12 pt-16" role="banner">
      <div className="max-w-6xl mx-auto px-6">
        {/* TITULO */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white text-center leading-tight">
          Verifica, aprende y comparte información confiable.
        </h1>

        {/* CTA */}
        <div className="flex justify-center mt-6">
          <a
            href="#chatbot"
            className="inline-block bg-white text-gray-900 font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition"
            aria-label="Ir al chatbot de verificación"
          >
            Inicia tu verificación
          </a>
        </div>

        {/* ICON PANEL (secciones) */}
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a
              href="#chatbot"
              className="flex flex-col items-center gap-3 bg-white/90 backdrop-blur rounded-2xl py-8 px-6 text-center hover:scale-[1.02] transform transition"
            >
              <div className="text-5xl">🤖</div>
              <div className="text-xl md:text-2xl font-semibold text-gray-900">Chatbot de IA</div>
              <p className="text-sm md:text-sm text-gray-600 max-w-xs">
                Verifica noticias y afirmaciones al instante con búsquedas web y análisis.
              </p>
            </a>

            <a
              href="/verificaciones"
              className="flex flex-col items-center gap-3 bg-white/90 backdrop-blur rounded-2xl py-8 px-6 text-center hover:scale-[1.02] transform transition"
            >
              <div className="text-5xl">📰</div>
              <div className="text-xl md:text-2xl font-semibold text-gray-900">Noticias verificadas</div>
              <p className="text-sm md:text-sm text-gray-600 max-w-xs">
                Consulta verificaciones recientes y lee el detalle de las fuentes usadas.
              </p>
            </a>

            <a
              href="/recursos"
              className="flex flex-col items-center gap-3 bg-white/90 backdrop-blur rounded-2xl py-8 px-6 text-center hover:scale-[1.02] transform transition"
            >
              <div className="text-5xl">📚</div>
              <div className="text-xl md:text-2xl font-semibold text-gray-900">Recursos educativos</div>
              <p className="text-sm md:text-sm text-gray-600 max-w-xs">
                Guías rápidas para aprender a detectar desinformación y evaluar fuentes.
              </p>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
