import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { useStore } from "../context/StoreContext";
import { money } from "../lib/format";
import type { Product } from "../lib/api";

export default function ProductCard({ product }: { product: Product }) {
  const { loggedIn, addToCart, notify } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const soldOut = product.stock === 0;

  async function handleAdd() {
    if (!loggedIn) {
      navigate("/login", { state: { from: location.pathname + location.search } });
      return;
    }
    try {
      await addToCart(product.id, 1);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Could not add to bag");
    }
  }

  return (
    <li className="shop-card">
      <div className="card-banner">
        <Link to={`/products/${product.id}`} className="card-image-link" tabIndex={-1} aria-hidden="true">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt="" loading="lazy" width={600} height={600} />
          ) : (
            <div className="img-fallback" />
          )}
        </Link>

        {soldOut && <span className="badge">Sold out</span>}
        {!soldOut && product.stock <= 5 && <span className="badge">Low stock</span>}

        <ul className="card-actions">
          <li>
            <button className="action-btn" aria-label={`Add ${product.name} to bag`} onClick={handleAdd} disabled={soldOut}>
              <Icon name="bag" size={22} />
            </button>
          </li>
          <li>
            <Link className="action-btn" aria-label={`View ${product.name}`} to={`/products/${product.id}`}>
              <Icon name="eye" size={22} />
            </Link>
          </li>
        </ul>
      </div>

      <div className="card-content">
        <p className="card-category">{product.category}</p>
        <h3 className="card-title">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="price">{money(product.priceCents)}</p>
      </div>
    </li>
  );
}
