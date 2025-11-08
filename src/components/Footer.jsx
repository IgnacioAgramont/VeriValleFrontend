import React from "react";

export default function Footer(){
  return (
    <footer className="mt-12 bg-white border-t">
      <div className="max-w-5xl mx-auto p-6 text-sm text-gray-600">
        <div>VeriValle — Proyecto académico · Universidad del Valle</div>
        <div className="mt-2">© {new Date().getFullYear()}</div>
      </div>
    </footer>
  );
}
