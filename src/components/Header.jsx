import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.scss";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="eqs-header">
      <div className="eqs-inner">
        {/* Logo */}
        <div className="eqs-logo">
          <h2>Equine Data Solutions</h2>
        
        </div>

        {/* Hamburger */}
        <button
          className={`eqs-menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <nav className={`eqs-nav ${menuOpen ? "show" : ""}`}>
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/database" className="nav-link">
            Horse Database
          </NavLink>
          <NavLink to="/notes" className="nav-link">
            Notes
          </NavLink>
          <NavLink to="/dashboard" className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/pricing" className="nav-link">
            Pricing
          </NavLink>

          {/* Mobile buttons */}
          <div className="eqs-mobile-actions">
            <button className="agent-btn">Bloodstock Agent</button>
            <button className="signout-btn">Sign Out</button>
          </div>
        </nav>

        {/* Desktop buttons */}
        <div className="eqs-profile">
          <button className="agent-btn">Bloodstock Agent</button>
          <button className="signout-btn">Sign Out</button>
        </div>
      </div>
    </header>
  );
}
