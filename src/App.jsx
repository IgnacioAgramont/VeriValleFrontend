// src/App.jsx
import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ChatbotCard from "./components/ChatbotCard";
import RecentCases from "./components/RecentCases";
import Footer from "./components/Footer";


export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero queda por debajo (fondo grande). Los panels blancos del Hero
          pueden flotar sobre el contenido gracias al z-index del main */}
      <Hero />

      {/* <-- CAMBIO IMPORTANTE: eliminé el -mt-12 y añadí padding-top para separar */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <ChatbotCard />
        <RecentCases />
      </main>

      <Footer />
    </div>
  );
}
