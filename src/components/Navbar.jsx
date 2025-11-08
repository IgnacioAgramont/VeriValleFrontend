// src/components/Navbar.jsx
import React from "react";

export default function Navbar() {
  return (
    <header className="header-top" role="banner">
      <div className="container" style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Usa una ruta simple al logo; si no existe, no rompe (alt mostrado) */}
          <img src="/logo.png" alt="VeriValle" style={{ height: 42, display: "block" }} />
          <span style={{ color: "#fff", fontWeight: 800, letterSpacing: 0.6, fontSize: 20 }}>
            VeriValle
          </span>
        </div>

        <nav aria-label="Main navigation" style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <a href="#inicio" style={{ color: "rgba(255,255,255,0.95)", textDecoration: "none", fontWeight: 600 }}>Inicio</a>
          <a href="#chatbot" style={{ color: "rgba(255,255,255,0.95)", textDecoration: "none", fontWeight: 600 }}>Chatbot</a>
          <a href="#verificaciones" style={{ color: "rgba(255,255,255,0.95)", textDecoration: "none", fontWeight: 600 }}>Verificaciones</a>
          <a href="#recursos" style={{ color: "rgba(255,255,255,0.95)", textDecoration: "none", fontWeight: 600 }}>Recursos</a>
        </nav>

        {/* placeholder para balancear layout; evita elementos vacíos problemáticos */}
        <div style={{ width: 92, height: 1 }} aria-hidden="true" />
      </div>
    </header>
  );
}
