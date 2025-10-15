import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import MainPage from "./MainPage";
import FavoritesPage from "./FavoritesPage";
import "./App.scss";

export default function App() {
  const [query, setQuery] = useState("");

  return (
    <Router>
      <div className="app premium full-screen">
        <header className="shell header-layout">
          <div className="brand">
        
            <h1>
              <span>  Horses</span>
            </h1>
          </div>

          <div className="center-search">
            <div className="search">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M21 21l-4.2-4.2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, sire, dam, consignor…"
              />
            </div>
          </div>

          <div className="toolbar">
           
            <Link to="/favorites" className="favorites-chip">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M12 21s-7-4.534-9-8.5C1 9 3.5 6 6.5 6 8.24 6 9.91 7 12 9c2.09-2 3.76-3 5.5-3C20.5 6 23 9 21 12.5 19 16.466 12 21 12 21z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="currentColor"
                />
              </svg>
              <span>Favorites</span>
            </Link>
          </div>
        </header>

        <main className="shell">
          <Routes>
            <Route path="/" element={<MainPage query={query} />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
