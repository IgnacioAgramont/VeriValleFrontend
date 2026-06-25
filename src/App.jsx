// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Hero from "./components/Hero";
import ChatbotCard from "./components/ChatbotCard";
import RecentCases from "./components/RecentCases";
import Footer from "./components/Footer";
import Recursos from "./pages/recursos";

// 🧭 Navbar rediseñado para hacer el logo más grande y con detalles diagonales en color carmesí
function Navbar() {
    return (
        <header className="w-full flex flex-col" role="banner">
            {/* Sección superior blanca con logo grande y cortes diagonales simétricos */}
            <div className="relative bg-white pt-6 sm:pt-8 pb-0 overflow-hidden border-b border-gray-100 flex items-end justify-center">
                {/* Detalle diagonal carmesí izquierdo (simétrico) */}
                <div 
                    className="absolute top-0 left-0 w-[30%] sm:w-[25%] md:w-[20%] h-full bg-[#7b1717]" 
                    style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
                />
                
                {/* Detalle diagonal carmesí derecho (simétrico) */}
                <div 
                    className="absolute top-0 right-0 w-[30%] sm:w-[25%] md:w-[20%] h-full bg-[#7b1717]" 
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                />

                {/* Contenedor del logo centrado apoyado en el borde inferior */}
                <div className="relative z-10 flex flex-col items-center">
                    <Link to="/" className="block">
                        <img
                            src="/logo.png"
                            alt="VeriValle Logo"
                            className="h-20 sm:h-28 md:h-36 w-auto object-contain transition-transform duration-300 hover:scale-105 -mb-3 sm:-mb-4 md:-mb-5"
                        />
                    </Link>
                </div>
            </div>

            {/* Barra de navegación inferior oscura con enlaces */}
            <div className="bg-[#222] text-white py-3 shadow-md">
                <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-center">
                    <nav
                        aria-label="Main navigation"
                        className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider"
                    >
                        <Link to="/" className="hover:text-red-400 transition-colors py-1 px-2">
                            Inicio
                        </Link>
                        <a href="/#chatbot" className="hover:text-red-400 transition-colors py-1 px-2">
                            Chatbot
                        </a>
                        <a href="/#verificaciones" className="hover:text-red-400 transition-colors py-1 px-2">
                            Verificaciones
                        </a>
                        <Link to="/recursos" className="hover:text-red-400 transition-colors py-1 px-2">
                            Recursos
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}

// 🧩 Componente principal con rutas
export default function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <Routes>
                    {/* Página principal */}
                    <Route
                        path="/"
                        element={<Home />}
                    />

                    {/* Página de recursos */}
                    <Route path="/recursos" element={<Recursos />} />
                </Routes>
            </div>
        </Router>
    );
}

function Home() {
    const [refreshKey, setRefreshKey] = React.useState(0);

    const handleVerificationComplete = () => {
        // Increment key to force re-fetch in RecentCases
        setRefreshKey(prev => prev + 1);
    };

    return (
        <>
            <Hero />
            <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32">
                <ChatbotCard onVerificationComplete={handleVerificationComplete} />
                <RecentCases key={refreshKey} />
            </main>
            <Footer />
        </>
    );
}
