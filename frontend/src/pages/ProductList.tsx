import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Section from "../components/Section";
import ProductCard from "../components/ProductCard";
import { CATEGORIES } from "../config";
import { api, type Product } from "../lib/api";

export default function ProductList() {
  const [params] = useSearchParams();
  const category = params.get("category") ?? "";
  const search = params.get("search") ?? "";
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProducts(null);
    setError(null);
    api
      .listProducts({ category, search })
      .then((r) => setProducts(r.products))
      .catch((e) => setError(e.message));
  }, [category, search]);

  return (
    <Section className="shop shop-page">
      <div className="container">
        <h1 className="h2 section-title">{search ? `Results for "${search}"` : "Shop"}</h1>

        <div className="chips" role="tablist" aria-label="Categories">
          <Link className={`chip${!category ? " active" : ""}`} to="/shop">All</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} className={`chip${category === c.slug ? " active" : ""}`} to={`/shop?category=${c.slug}`}>
              {c.label}
            </Link>
          ))}
        </div>

        {error && <p className="error">Couldn't load products: {error}</p>}
        {!error && products === null && (
          <ul className="product-grid">{Array.from({ length: 8 }).map((_, i) => <li key={i} className="skeleton" />)}</ul>
        )}
        {products && products.length === 0 && <p className="empty">Nothing found. Try another search.</p>}
        {products && products.length > 0 && (
          <ul className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</ul>
        )}
      </div>
    </Section>
  );
}
