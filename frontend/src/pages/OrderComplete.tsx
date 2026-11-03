import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Section from "../components/Section";
import { useStore } from "../context/StoreContext";

export default function OrderComplete() {
  const [params] = useSearchParams();
  const { refreshCart } = useStore();
  const status = params.get("redirect_status");

  useEffect(() => {
    // The webhook clears the cart server-side; give it a moment, then sync.
    const t = window.setTimeout(() => void refreshCart(), 1500);
    return () => window.clearTimeout(t);
  }, [refreshCart]);

  const ok = status === "succeeded" || status === "processing";

  return (
    <Section className="checkout-page">
      <div className="container narrow center">
        <h1 className="h2">{ok ? "Thank you for your order" : "Payment not completed"}</h1>
        <p className="section-text">
          {ok ? "Your payment was received. A confirmation will follow." : "Your card was not charged. You can try again from your bag."}
        </p>
        <Link to={ok ? "/shop" : "/cart"} className="btn btn-primary">{ok ? "Keep shopping" : "Back to bag"}</Link>
      </div>
    </Section>
  );
}
