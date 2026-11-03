import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Section from "../components/Section";
import ProductCard from "../components/ProductCard";
import Icon from "../components/Icon";
import { useStore } from "../context/StoreContext";
import { money } from "../lib/format";
import { api, type Product } from "../lib/api";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { loggedIn, addToCart, notify } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setProduct(null);
    setError(null);
    setQty(1);
    api
      .getProduct(id)
      .then(async (res) => {
        setProduct(res.product);
        const rel = await api.listProducts({ category: res.product.category });
        setRelated(rel.products.filter((p) => p.id !== res.product.id).slice(0, 4));
      })
      .catch((e) => setError(e.message));
  }, [id]);

  async function handleAdd() {
    if (!product) return;
    if (!loggedIn) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    try {
      await addToCart(product.id, qty);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Could not add to bag");
    }
  }

  if (error) return <div className="container page-pad"><p className="error">{error}</p></div>;
  if (!product) return <div className="container page-pad"><div className="skeleton detail-skeleton" /></div>;

  const soldOut = product.stock === 0;

  return (
    <>
      <Section className="product-detail-section">
        <div className="container detail-grid">
          <div className="detail-image">
            {product.imageUrl ? <img src={product.imageUrl} alt={product.name} width={600} height={600} /> : <div className="img-fallback" />}
          </div>
          <div className="detail-info">
            <p className="card-category">{product.category}</p>
            <h1 className="h2">{product.name}</h1>
            <p className="price price-lg">{money(product.priceCents)}</p>
            <p className="detail-text">{product.description}</p>
            <p className={`stock${soldOut ? " out" : ""}`}>{soldOut ? "Out of stock" : product.stock <= 5 ? `Only ${product.stock} left` : "In stock"}</p>

            <div className="detail-actions">
              <div className="qty" aria-label="Quantity">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease"><Icon name="minus" size={18} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))} aria-label="Increase"><Icon name="plus" size={18} /></button>
              </div>
              <button className="btn btn-primary" onClick={handleAdd} disabled={soldOut}>Add to bag</button>
            </div>
            <Link to="/shop" className="btn-link">Continue shopping</Link>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section className="shop">
          <div className="container">
            <h2 className="h3 section-title">You may also like</h2>
            <ul className="product-grid">{related.map((p) => <ProductCard key={p.id} product={p} />)}</ul>
          </div>
        </Section>
      )}
    </>
  );
}
