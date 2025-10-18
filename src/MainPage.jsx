import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./config";

export default function MainPage({ query: initialQuery = "" }) {
  const [horses, setHorses] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState("Lot");
  const [sortOrder, setSortOrder] = useState("asc");
  const [query, setQuery] = useState(initialQuery);

  // Pagination state
  const [page, setPage] = useState(0);
  const [limit] = useState(200); // adjust if needed
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  // ===== Load horse data with pagination =====
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const offset = page * limit;
        const res = await fetch(
  `${API_BASE_URL}/source_sales?limit=${limit}&offset=${offset}`
);
        const result = await res.json();

        if (Array.isArray(result.data)) {
          setHorses((prev) =>
            page === 0 ? result.data : [...prev, ...result.data]
          );
          setTotal(result.total || 0);
        }
      } catch (e) {
        console.error("Error loading horse data:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, limit]);

  // ===== Load favorites from localStorage =====
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(saved);
    } catch {
      setFavorites([]);
    }
  }, []);

  // ===== Save favorites =====
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ===== Auto close slider when clicking outside =====
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".rec-expanded") && !e.target.closest(".btn.save")) {
        setExpandedId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const isFavorite = (lot) => favorites.some((f) => f.Lot === lot);

  const handleSort = (key) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return horses;
    return horses.filter((h) =>
      [h.Name, h.Sire, h.Dam, h.Consignor]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [horses, query]);

  const sorted = useMemo(() => {
    const sortedData = [...filtered];
    sortedData.sort((a, b) => {
      const valA = a[sortKey] || "";
      const valB = b[sortKey] || "";
      if (!isNaN(valA) && !isNaN(valB))
        return sortOrder === "asc" ? valA - valB : valB - valA;
      return sortOrder === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
    return sortedData;
  }, [filtered, sortKey, sortOrder]);

  const handleSaveClick = (horse) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.Lot === horse.Lot);
      if (exists) {
        setExpandedId(null);
        return prev.filter((f) => f.Lot !== horse.Lot);
      } else {
        generateRecommendations(horse);
        return [...prev, horse];
      }
    });
  };

  const generateRecommendations = (horse) => {
    const pool = horses.filter((h) => h.Lot !== horse.Lot);

    const scored = pool.map((h) => {
      let score = 0;
      if (h.Sire === horse.Sire) score++;
      if (h.Dam === horse.Dam) score++;
      if (h.Consignor === horse.Consignor) score++;
      if (h.Stabling === horse.Stabling) score++;
      return { ...h, score };
    });

    const sorted = scored
      .sort((a, b) => b.score - a.score || Math.random() - 0.5)
      .filter((h) => h.score > 0);

    const chosen = (sorted.length ? sorted : pool)
      .slice(0, 3)
      .map(({ score, ...rest }) => rest);

    setExpandedId(horse.Lot);
    setRecommendations(chosen);
  };

  const handleRecommendationClick = (lot) => {
    setExpandedId(null);
    const el = document.getElementById(`row-${lot}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("highlight-row");
      setTimeout(() => el.classList.remove("highlight-row"), 2000);
    }
  };

  // ===== Spinner component (Dark Brown) =====
  const Spinner = () => (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <div
        style={{
          border: "4px solid #f8f1e3",
          borderTop: "4px solid #3c2f2f",
          borderRadius: "50%",
          width: "38px",
          height: "38px",
          animation: "spin 1s linear infinite",
          margin: "0 auto",
        }}
      ></div>
      <style>
        {`@keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }`}
      </style>
    </div>
  );

  return (
    <section className="table-wrapper">
      {/* HEADER */}
      <div className="header-bar">
        <div className="header-left">
          <h1 className="page-title">Horse Database</h1>
          <p className="page-subtitle">
            Search through our comprehensive database of 150,000+ horses
          </p>
        </div>

        <div className="header-right">
          <button
            className="btn favorites-btn"
            onClick={() => navigate("/favorites")}
          >
            Favorites ⭐
          </button>
        </div>
      </div>

      {/* SEARCH BOX */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍  Search by name, sire, dam, or consignor"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* TABLE */}
      <section className="table-card full-table">
        <div className="table-head sticky">
          {[
            { key: "Lot", label: "Lot / Name" },
            { key: "Sex", label: "Sex" },
            { key: "Colour", label: "Colour" },
            { key: "Sire", label: "Sire" },
            { key: "Dam", label: "Dam" },
            { key: "Consignor", label: "Consignor" },
            { key: "Price (gns)", label: "Price" },
            { key: "Stabling", label: "Stabling" },
          ].map((col) => (
            <div
              key={col.key}
              className={`th sortable ${
                sortKey === col.key ? "active" : ""
              }`}
              onClick={() => handleSort(col.key)}
            >
              {col.label}
              {sortKey === col.key ? (
                sortOrder === "asc" ? (
                  <span className="sort-icon up">↑</span>
                ) : (
                  <span className="sort-icon down">↓</span>
                )
              ) : (
                <span className="sort-icon faded">↕</span>
              )}
            </div>
          ))}
          <div className="th ta-right">Action</div>
        </div>

        {loading && page === 0 ? (
          <Spinner />
        ) : (
          sorted.map((h, idx) => (
            <div
              id={`row-${h.Lot}`}
              className={`row ${idx % 2 ? "zebra" : ""}`}
              key={h.Lot}
            >
              <div className="cell w-64">
                <div className="lot">#{h.Lot}</div>
                <div className="title">{h.Name}</div>
              </div>
              <div className="cell w-40">
                <span className="chip subtle">{h.Sex || "—"}</span>
              </div>
              <div className="cell w-64">{h.Colour || "—"}</div>
              <div className="cell w-72">{h.Sire || "—"}</div>
              <div className="cell w-72">{h.Dam || "—"}</div>
              <div className="cell w-80">{h.Consignor || "—"}</div>
              <div className="cell w-36">{h["Price (gns)"] || "—"}</div>
              <div className="cell w-40">{h.Stabling || "—"}</div>
              <div className="cell ta-right">
                <button
                  className={`btn save ${
                    isFavorite(h.Lot) ? "active" : ""
                  }`}
                  onClick={() => handleSaveClick(h)}
                >
                  {isFavorite(h.Lot) ? "Saved" : "Save"}
                </button>
              </div>

              {expandedId === h.Lot && (
                <div className="rec-expanded">
                  <h4>Related Recommendations</h4>
                  <div className="rec-inline-grid horizontal">
                    {recommendations.map((r) => (
                      <div
                        className="rec-mini-card"
                        key={r.Lot}
                        onClick={() => handleRecommendationClick(r.Lot)}
                      >
                        <div className="rec-lot">#{r.Lot}</div>
                        <div className="rec-name">{r.Name}</div>
                        <div className="rec-info">
                          <small>
                            <b>Sire:</b> {r.Sire}
                          </small>
                          <small>
                            <b>Dam:</b> {r.Dam}
                          </small>
                          <small>
                            <b>Consignor:</b> {r.Consignor || "—"}
                          </small>
                          <small>
                            <b>Stabling:</b> {r.Stabling || "—"}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </section>

      {/* Load More Button */}
      {!loading && horses.length < total && (
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <button
            className="btn save"
            onClick={() => setPage((prev) => prev + 1)}
            style={{ fontSize: "1rem", padding: "0.6rem 1.4rem" }}
          >
            {loading ? "Loading..." : `Load More (${horses.length}/${total})`}
          </button>
        </div>
      )}

      {/* Spinner for “loading next page” */}
      {loading && page > 0 && <Spinner />}
    </section>
  );
}
