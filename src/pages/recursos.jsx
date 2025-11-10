// src/pages/Recursos.jsx
import React from "react";

export default function Recursos() {
  const images = [
    "/1.png",
    "/2.png",
    "/3.png",
    "/4.png",
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Recursos</h1>
      <div className="flex flex-col gap-6 w-full max-w-lg px-4">
        {images.map((src, i) => (
          <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
            <img src={src} alt={`Recurso ${i + 1}`} className="w-full h-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
