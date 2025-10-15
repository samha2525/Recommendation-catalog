import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  const handleRemove = (lot) => {
    const updated = favorites.filter((f) => f.Lot !== lot);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (!favorites.length) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px", color: "#94a3b8" }}>
        <h2>No saved horses yet</h2>
        <p>
          Go back to <Link to="/">Home</Link> and click “Save” on any horse.
        </p>
      </div>
    );
  }

  return (
    <section className="table-card full-table">
      <div className="table-head sticky">
        <div className="th">Lot / Name</div>
        <div className="th">Sex</div>
        <div className="th">Colour</div>
        <div className="th">Sire</div>
        <div className="th">Dam</div>
        <div className="th">Consignor</div>
        <div className="th">Price</div>
        <div className="th">Stabling</div>
        <div className="th ta-right">Action</div>
      </div>

      {favorites.map((h, idx) => (
        <div key={h.Lot} className={`row ${idx % 2 ? "zebra" : ""}`}>
          <div className="cell w-64">
            <div className="lot">#{h.Lot}</div>
            <div className="title">{h.Name}</div>
          </div>
          <div className="cell w-40">{h.Sex || "—"}</div>
          <div className="cell w-64">{h.Colour || "—"}</div>
          <div className="cell w-72">{h.Sire || "—"}</div>
          <div className="cell w-72">{h.Dam || "—"}</div>
          <div className="cell w-80">{h.Consignor || "—"}</div>
          <div className="cell w-36">{h["Price (gns)"] || "—"}</div>
          <div className="cell w-40">{h.Stabling || "—"}</div>
          <div className="cell ta-right">
            <button
              className="btn save active"
              onClick={() => handleRemove(h.Lot)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <Link to="/" className="btn ghost">
          ← Back to Home
        </Link>
      </div>
    </section>
  );
}
