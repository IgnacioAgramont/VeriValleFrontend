// src/App.jsx
import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ChatbotCard from "./components/ChatbotCard";
import RecentCases from "./components/RecentCases";
import Footer from "./components/Footer";

export default function App() {
  // Maneja clicks en enlaces #... y hace scroll suave
  useEffect(() => {
    function onClick(e) {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();
      // altura del header (si tu header es fijo, esto evita que tape el objetivo)
      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight : 80;
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
      window.scrollTo({ top, behavior: "smooth" });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header>
        <Navbar />
      </header>

      {/* HERO */}
      <section id="inicio">
        <Hero />
      </section>

      {/* CHATBOT */}
      <main
        id="chatbot"
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32"
      >
        <ChatbotCard />
      </main>

      {/* VERIFICACIONES */}
      <section id="verificaciones" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <RecentCases />
      </section>

      {/* RECURSOS (opcional) */}
      <section id="recursos" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* contenido futuro */}
      </section>

      <Footer />
    </div>
  );
}
