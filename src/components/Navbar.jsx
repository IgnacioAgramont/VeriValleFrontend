// src/components/Navbar.jsx
import React from "react";

export default function Navbar() {
  return (
    <header className="header-top bg-red-800" role="banner">
      <div
        className="w-full mx-auto px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: 1200 }}
      >
        <div className="flex items-center justify-between gap-4 py-3">
          {/* logo (tamaño responsive) */}
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="VeriValle"
              style={{ display: "block" }}
              className="h-12 sm:h-14 md:h-16 lg:h-20 object-contain"
            />
          </div>

          {/* nav */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex gap-6 items-center"
          >
            <a
              href="#inicio"
              className="text-white text-sm font-semibold hover:underline"
            >
              Inicio
            </a>
            <a
              href="#chatbot"
              className="text-white text-sm font-semibold hover:underline"
            >
              Chatbot
            </a>
            <a
              href="#verificaciones"
              className="text-white text-sm font-semibold hover:underline"
            >
              Verificaciones
            </a>
            <a
              href="#recursos"
              className="text-white text-sm font-semibold hover:underline"
            >
              Recursos
            </a>
          </nav>

          {/* mobile menu placeholder (si no usas mobile menu, lo dejamos vacío para balance) */}
          <div className="md:hidden" aria-hidden="true" style={{ width: 44 }} />
        </div>
      </div>
    </header>
  );
}
