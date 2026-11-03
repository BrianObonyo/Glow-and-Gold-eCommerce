import { useEffect, useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { CATEGORIES, STORE } from "../config";
import { useHeaderScroll } from "../hooks/useHeaderScroll";
import { useStore } from "../context/StoreContext";
import { money } from "../lib/format";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop", end: true },
  ...CATEGORIES.map((c) => ({ to: `/shop?category=${c.slug}`, label: c.label, end: false })),
];

export default function Header() {
  const { active, hidden } = useHeaderScroll();
  const { loggedIn, count, totalCents, logout } = useStore();
  const [navOpen, setNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setNavOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    navigate(`/shop${query.trim() ? `?search=${encodeURIComponent(query.trim())}` : ""}`);
    setQuery("");
  }

  const navLinks = (onClick?: () => void) =>
    LINKS.map((l) => (
      <li key={l.label}>
        <NavLink to={l.to} end={l.end} className="navbar-link" onClick={onClick}>
          {l.label}
        </NavLink>
      </li>
    ));

  return (
    <header className="header" id="top">
      <div className="alert">Free shipping on orders ${STORE.freeShippingOver}+</div>

      <div className={`header-top${active ? " active" : ""}${hidden ? " header-hide" : ""}`}>
        <div className="container">
          <button className="nav-open-btn" aria-label="Open menu" onClick={() => setNavOpen(true)}>
            <Icon name="menu" size={28} />
          </button>

          <form className="input-wrapper" onSubmit={onSearch} role="search">
            <input
              type="search"
              className="search-field"
              placeholder="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
            <button type="submit" className="search-submit" aria-label="Search">
              <Icon name="search" size={20} />
            </button>
          </form>

          <Link to="/" className="logo">
            {STORE.name}
          </Link>

          <div className="header-actions">
            {loggedIn ? (
              <button className="header-action-btn" aria-label="Log out" title="Log out" onClick={logout}>
                <Icon name="user" size={26} />
              </button>
            ) : (
              <Link to="/login" className="header-action-btn" aria-label="Log in" title="Log in">
                <Icon name="user" size={26} />
              </Link>
            )}

            <Link to="/cart" className="header-action-btn cart-btn" aria-label={`Bag, ${count} items`}>
              <span className="btn-text">{money(totalCents)}</span>
              <Icon name="bag" size={26} />
              <span className="btn-badge">{count}</span>
            </Link>
          </div>
        </div>

        <nav className="navbar" aria-label="Primary">
          <ul className="navbar-list">{navLinks()}</ul>
        </nav>
      </div>

      <div className="sidebar">
        <div className={`mobile-navbar${navOpen ? " active" : ""}`} aria-hidden={!navOpen}>
          <div className="wrapper">
            <Link to="/" className="logo" onClick={() => setNavOpen(false)}>
              {STORE.name}
            </Link>
            <button className="nav-close-btn" aria-label="Close menu" onClick={() => setNavOpen(false)}>
              <Icon name="close" size={28} />
            </button>
          </div>
          <ul className="navbar-list">{navLinks(() => setNavOpen(false))}</ul>
        </div>
        <div className={`overlay${navOpen ? " active" : ""}`} onClick={() => setNavOpen(false)} />
      </div>
    </header>
  );
}
