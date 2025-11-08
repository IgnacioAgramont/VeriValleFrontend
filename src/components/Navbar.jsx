// src/components/Navbar.jsx
import React from "react";

export default function Navbar() {
  return (
    <header className="bg-red-800 shadow-md">
      <div
        className="flex items-center justify-between mx-auto px-8"
        style={{
          maxWidth: 1280,
          height: "96px", // alto del header
        }}
      >
        {/* LOGO grande alineado a la izquierda */}
        <a
          href="#inicio"
          className="flex items-center gap-3"
          style={{ textDecoration: "none" }}
        >
          <img
            src="/logo.png"
            alt="VeriValle"
            className="object-contain"
            style={{
              height: "84px",
              width: "auto",
              display: "block",
            }}
          />
        </a>

        {/* NAV centrado visualmente */}
        <nav className="flex items-center justify-center gap-10">
          {[
            ["Inicio", "#inicio"],
            ["Chatbot", "#chatbot"],
            ["Verificaciones", "#verificaciones"],
            ["Recursos", "#recursos"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              style={{
                color: "#fff",
                fontWeight: 600,
                fontSize: "1.1rem",
                letterSpacing: "0.3px",
                textDecoration: "none",
              }}
              className="hover:underline hover:opacity-90 transition-opacity"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
