import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Section from "../components/Section";
import { useStore } from "../context/StoreContext";
import { api } from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { login } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = mode === "login" ? await api.login(email, password) : await api.register(email, password);
      login(res.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Section className="auth-page">
      <div className="container narrow">
        <form onSubmit={handleSubmit} className="auth-form">
          <h1 className="h3">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary w-100" disabled={busy}>{mode === "login" ? "Log in" : "Sign up"}</button>
          <button type="button" className="btn-link switch" onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Need an account? Sign up" : "Have an account? Log in"}
          </button>
        </form>
      </div>
    </Section>
  );
}
