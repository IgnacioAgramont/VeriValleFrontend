// src/components/Navbar.jsx
import React from "react";

export default function Navbar() {
  return (
    <header className="bg-[#7a1414] text-white py-4 fixed top-0 left-0 w-full shadow z-50">
      <nav className="max-w-6xl mx-auto flex flex-wrap items-center justify-between px-4">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="VeriValle"
            className="h-11 sm:h-12 w-auto object-contain"
          />
        </a>

        {/* Botones del menú */}
        <div className="flex flex-wrap gap-5 text-sm sm:text-base font-semibold">
          <a href="#inicio" className="hover:text-gray-200 transition-colors">
            Inicio
          </a>
          <a href="#chatbot" className="hover:text-gray-200 transition-colors">
            Chatbot
          </a>
          <a href="#verificaciones" className="hover:text-gray-200 transition-colors">
            Verificaciones
          </a>
          <a href="#recursos" className="hover:text-gray-200 transition-colors">
            Recursos
          </a>
        </div>
      </nav>
    </header>
  );
}
