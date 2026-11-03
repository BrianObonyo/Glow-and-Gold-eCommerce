import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Section from "../components/Section";
import { useStore } from "../context/StoreContext";
import { money } from "../lib/format";
import { api } from "../lib/api";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function PayForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setMessage(null);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/order-complete` },
    });
    // confirmPayment only returns if there was an immediate error; otherwise it redirects.
    setMessage(error.message ?? "Payment failed.");
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="pay-form">
      <PaymentElement />
      <button className="btn btn-primary w-100" disabled={busy || !stripe}>{busy ? "Processing…" : "Pay now"}</button>
      {message && <p className="error">{message}</p>}
      <p className="summary-note">Test mode: use card 4242 4242 4242 4242, any future date, any CVC.</p>
    </form>
  );
}

export default function Checkout() {
  const { loggedIn, items, totalCents } = useStore();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!loggedIn || !stripePromise || started.current) return;
    started.current = true; // guards against StrictMode double-invoking and creating two orders
    api.checkout().then((r) => setClientSecret(r.clientSecret)).catch((e) => setError(e.message));
  }, [loggedIn]);

  if (!loggedIn) return <Navigate to="/login" state={{ from: "/checkout" }} replace />;

  return (
    <Section className="checkout-page">
      <div className="container narrow">
        <h1 className="h2">Checkout</h1>
        {!stripePromise && <p className="error">Set VITE_STRIPE_PUBLISHABLE_KEY (a pk_test_ key) to enable payments.</p>}
        {error && (
          <>
            <p className="error">{error}</p>
            <Link to="/cart" className="btn btn-secondary">Back to bag</Link>
          </>
        )}
        {items.length > 0 && <p className="summary-row"><span>Order total</span><strong>{money(totalCents)}</strong></p>}
        {clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#a8455c", borderRadius: "3px" } } }}>
            <PayForm />
          </Elements>
        )}
        {!clientSecret && !error && stripePromise && <div className="skeleton pay-skeleton" />}
      </div>
    </Section>
  );
}
