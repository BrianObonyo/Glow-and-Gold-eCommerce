import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Section from "../components/Section";
import Icon from "../components/Icon";
import { useStore } from "../context/StoreContext";
import { money } from "../lib/format";

export default function Cart() {
  const { loggedIn, items, totalCents, setQuantity, refreshCart, notify } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  async function change(productId: string, quantity: number) {
    try {
      await setQuantity(productId, quantity);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Could not update bag");
    }
  }

  if (!loggedIn) {
    return (
      <Section className="cart-page">
        <div className="container narrow">
          <h1 className="h2">Your bag</h1>
          <p className="empty">Log in to see your bag.</p>
          <Link to="/login" state={{ from: "/cart" }} className="btn btn-primary">Log in</Link>
        </div>
      </Section>
    );
  }

  return (
    <Section className="cart-page">
      <div className="container">
        <h1 className="h2">Your bag</h1>

        {items.length === 0 ? (
          <>
            <p className="empty">Your bag is empty.</p>
            <Link to="/shop" className="btn btn-primary">Start shopping</Link>
          </>
        ) : (
          <div className="cart-grid">
            <ul className="cart-list">
              {items.map((item) => (
                <li key={item.productId} className="cart-row">
                  <Link to={`/products/${item.productId}`} className="cart-thumb">
                    {item.product.imageUrl && <img src={item.product.imageUrl} alt="" width={96} height={96} />}
                  </Link>
                  <div className="cart-info">
                    <Link to={`/products/${item.productId}`} className="card-title">{item.product.name}</Link>
                    <span className="price">{money(item.product.priceCents)}</span>
                  </div>
                  <div className="qty">
                    <button onClick={() => change(item.productId, item.quantity - 1)} aria-label="Decrease"><Icon name="minus" size={16} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => change(item.productId, item.quantity + 1)} aria-label="Increase"><Icon name="plus" size={16} /></button>
                  </div>
                  <strong className="line-total">{money(item.product.priceCents * item.quantity)}</strong>
                  <button className="remove" onClick={() => change(item.productId, 0)} aria-label={`Remove ${item.product.name}`}>
                    <Icon name="close" size={18} />
                  </button>
                </li>
              ))}
            </ul>

            <aside className="summary">
              <h2 className="h4">Summary</h2>
              <p className="summary-row"><span>Subtotal</span><strong>{money(totalCents)}</strong></p>
              <p className="summary-note">Shipping and taxes are calculated at checkout.</p>
              <button className="btn btn-primary w-100" onClick={() => navigate("/checkout")}>Checkout</button>
            </aside>
          </div>
        )}
      </div>
    </Section>
  );
}
