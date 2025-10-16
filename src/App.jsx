import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header"; 
import MainPage from "./MainPage";
import FavoritesPage from "./FavoritesPage";
import PricingPage from ".//components/PricingPage";
import "./App.scss";

export default function App() {
  const [query, setQuery] = useState("");

  return (
    <Router>
      <div className="app premium full-screen">
        {/* ===== Global Header ===== */}
        <Header />

        {/* ===== Main Content ===== */}
        <main className="shell">
          <Routes>
            <Route path="/" element={<MainPage query={query} />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            {/* Optional: Add the missing routes so "Pricing" and others don’t 404 */}
            <Route
              path="/database"
              element={<div style={{ padding: "2rem" }}>Horse Database Page</div>}
            />
            <Route
              path="/notes"
              element={<div style={{ padding: "2rem" }}>Notes Page</div>}
            />
            <Route
              path="/dashboard"
              element={<div style={{ padding: "2rem" }}>Dashboard Page</div>}
            />
            <Route
              path="/pricing"
             element={<PricingPage />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
