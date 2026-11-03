import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Section from "../components/Section";
import ProductCard from "../components/ProductCard";
import Icon from "../components/Icon";
import { api, type Product } from "../lib/api";

const COLLECTIONS = [
  { title: "Lips", to: "/shop?search=lip", img: "/images/hero/liips.jfif" },
  { title: "Eyes & Face", to: "/shop?category=makeup", img: "/images/hero/eyes%20and%20face.jfif" },
  { title: "Jewelry", to: "/shop?category=jewelry", img: "/images/hero/jewelry.jfif" },
];

const FEATURES = [
  { icon: "truck", title: "Free shipping", text: "On every order over $50." },
  { icon: "shield", title: "Secure checkout", text: "Payments handled by Stripe." },
  { icon: "refresh", title: "Easy returns", text: "30 days, no questions asked." },
] as const;

export default function Home() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    api.listProducts().then((r) => setProducts(r.products.slice(0, 8))).catch(() => setProducts([]));
  }, []);

  return (
    <>
      <Section className="hero">
        <div className="container">
          <div className="hero-card">
            <div className="hero-copy">
              <h1 className="hero-title">Rouge and gold, worn together.</h1>
              <p className="hero-text">Everyday makeup and fine jewelry, made to be mixed, layered and loved.</p>
              <div className="hero-cta">
                <Link to="/shop?category=makeup" className="btn btn-primary">Shop makeup</Link>
                <Link to="/shop?category=jewelry" className="btn btn-secondary">Shop jewelry</Link>
              </div>
            </div>
            <Link to="/shop" className="hero-art hover-shine has-before" aria-label="Shop all products">
              <div className="has-bg-image" style={{ backgroundImage: 'url("/images/hero/a%20lipstick%20beside%20gold%20jewelry.jfif")' }} />
            </Link>
          </div>
        </div>
      </Section>

      <Section className="collection">
        <div className="container">
          <ul className="collection-list">
            {COLLECTIONS.map((c) => (
              <li key={c.title}>
                <Link to={c.to} className="collection-card hover-shine has-before">
                  <div className="has-bg-image" style={{ backgroundImage: `url(${c.img})` }} />
                  <h3 className="h4 card-title">{c.title}</h3>
                  <span className="btn-link">Explore <Icon name="arrow" size={18} /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="shop">
        <div className="container">
          <h2 className="h2 section-title">Bestsellers</h2>
          <p className="section-text">Our most-loved pieces this month.</p>
          {products === null ? (
            <ul className="product-grid">
              {Array.from({ length: 4 }).map((_, i) => <li key={i} className="skeleton" />)}
            </ul>
          ) : products.length === 0 ? (
            <p className="empty">No products yet. Run <code>npm run db:seed</code> in the backend.</p>
          ) : (
            <ul className="product-grid">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </ul>
          )}
        </div>
      </Section>

      <Section className="offer" id="offer">
        <div className="container">
          <div className="offer-card hover-shine has-before">
            <div className="has-bg-image" style={{ backgroundImage: 'url("/images/hero/sparkle.jfif")' }} />
            <h2 className="h2">Gifts that sparkle</h2>
            <p className="hero-text">Pair a signature lip with our pearl earrings.</p>
            <Link to="/shop?category=jewelry" className="btn btn-secondary">Shop jewelry</Link>
          </div>
        </div>
      </Section>

      <Section className="features">
        <div className="container">
          <ul className="feature-list">
            {FEATURES.map((f) => (
              <li key={f.title} className="feature-card">
                <Icon name={f.icon} size={34} />
                <h3 className="card-title">{f.title}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
