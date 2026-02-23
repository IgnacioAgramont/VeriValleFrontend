// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Hero from "./components/Hero";
import ChatbotCard from "./components/ChatbotCard";
import RecentCases from "./components/RecentCases";
import Footer from "./components/Footer";
import Recursos from "./pages/recursos";

// 🧭 Navbar actualizado con navegación entre páginas
function Navbar() {
    return (
        <header className="header-top bg-[#7b1717] text-white py-4" role="banner">
            <div className="max-w-[1200px] mx-auto px-4 md:px-5 flex flex-wrap items-center justify-center md:justify-between gap-y-4 gap-x-8">
                <div className="flex items-center gap-3">
                    <img
                        src="/logo.png"
                        alt="VeriValle"
                        className="h-10 md:h-[46px] block"
                    />
                    <span className="text-white font-[800] text-xl md:text-[22px] tracking-wide">
                        VeriValle
                    </span>
                </div>

                <nav
                    aria-label="Main navigation"
                    className="flex flex-wrap items-center justify-center gap-4 md:gap-5 text-sm md:text-base"
                >
                    <Link to="/" style={linkStyle}>
                        Inicio
                    </Link>
                    <a href="/#chatbot" style={linkStyle}>
                        Chatbot
                    </a>
                    <a href="/#verificaciones" style={linkStyle}>
                        Verificaciones
                    </a>
                    <Link to="/recursos" style={linkStyle}>
                        Recursos
                    </Link>
                </nav>
            </div>
        </header>
    );
}

// 🎨 estilos reutilizables
const linkStyle = {
    color: "rgba(255,255,255,0.95)",
    textDecoration: "none",
    fontWeight: 600,
};

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
