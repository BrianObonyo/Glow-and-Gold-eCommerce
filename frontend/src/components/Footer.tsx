import { Link } from "react-router-dom";
import { CATEGORIES, STORE } from "../config";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="logo">
            {STORE.name}
          </Link>
          <p className="footer-text">{STORE.tagline}. Thoughtfully made, beautifully finished.</p>
        </div>
        <div>
          <p className="footer-title">Shop</p>
          <ul>
            <li><Link to="/shop">All products</Link></li>
            {CATEGORIES.map((c) => (
              <li key={c.slug}><Link to={`/shop?category=${c.slug}`}>{c.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="footer-title">Account</p>
          <ul>
            <li><Link to="/login">Log in</Link></li>
            <li><Link to="/cart">Your bag</Link></li>
          </ul>
        </div>
        <div>
          <p className="footer-title">Help</p>
          <ul>
            <li><a href={`mailto:${STORE.supportEmail}`}>{STORE.supportEmail}</a></li>
            <li>Test-mode store: no real payments</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} {STORE.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
