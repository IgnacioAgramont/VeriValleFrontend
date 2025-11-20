// src/pages/Recursos.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Recursos() {
  const images = [
    { src: "/1.png", title: "Recurso 1" },
    { src: "/2.png", title: "Recurso 2" },
    { src: "/3.png", title: "Recurso 3" },
    { src: "/4.png", title: "Recurso 4" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Header for this page */}
      <header className="bg-[#7b1717] text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between max-w-5xl">
          <h1 className="text-xl font-bold">Recursos Educativos</h1>
          <Link
            to="/"
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            ← Volver al Inicio
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Material de Apoyo
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Explora nuestra colección de infografías y guías para combatir la desinformación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="p-2">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-auto rounded-xl"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#7b1717] hover:bg-[#5e1111] transition-colors"
          >
            Volver al Verificador
          </Link>
        </div>
      </main>
    </div>
  );
}
