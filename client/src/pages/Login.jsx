import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,500&family=Cinzel:wght@400;600&family=Raleway:wght@200;300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black:      #0A0A0A;
    --obsidian:   #111118;
    --navy:       #0D1B2A;
    --navy-mid:   #162235;
    --gold:       #C8A951;
    --gold-light: #E2C97E;
    --gold-dim:   rgba(200,169,81,0.12);
    --gold-glow:  rgba(200,169,81,0.22);
    --gold-line:  rgba(200,169,81,0.35);
    --cream:      #F0EAD6;
    --muted:      rgba(240,234,214,0.38);
    --border:     rgba(200,169,81,0.22);
  }

  .lx-root {
    font-family: 'Raleway', sans-serif;
    min-height: 100vh;
    background: var(--black);
    display: flex;
  }

  /* ══════════════════════════════════════
     LEFT  –  Visual / Brand Panel
  ══════════════════════════════════════ */
  .lx-left {
    flex: 1;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 56px 60px;
  }

  /* Deep layered background — dark mode */
  .lx-left::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 20% 15%, rgba(200,169,81,0.18) 0%, transparent 45%),
      radial-gradient(ellipse at 80% 85%, rgba(13,27,42,0.9) 0%, transparent 55%),
      linear-gradient(175deg, var(--navy) 0%, #080C12 55%, #0A0A0A 100%);
    z-index: 0;
  }

  /* Gold texture overlay — dark mode */
  .lx-left::after {
    content: '';
    position: absolute; inset: 0;
    background-image:
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 80px,
        rgba(200,169,81,0.025) 80px,
        rgba(200,169,81,0.025) 81px
      );
    z-index: 0;
  }

  /* ── Light mode: left visual panel ── */
  html.light-mode .lx-left {
    background: #d8cebc;
  }
  html.light-mode .lx-left::before {
    background: none;
    display: none;
  }
  html.light-mode .lx-left::after {
    background: none;
    background-image: none;
    display: none;
  }
  html.light-mode .lx-headline,
  html.light-mode .lx-logo-text {
    color: #0a0702;
  }
  html.light-mode .lx-headline em {
    color: #7a600f;
  }
  html.light-mode .lx-eyebrow {
    color: #7a600f;
    opacity: 1;
  }
  html.light-mode .lx-sub {
    color: rgba(10, 7, 2, 0.62);
  }
  html.light-mode .lx-rule {
    background: linear-gradient(90deg, #7a600f, transparent);
  }
  html.light-mode .lx-stat-n {
    color: #7a600f;
  }
  html.light-mode .lx-stat-l {
    color: rgba(10, 7, 2, 0.55);
  }
  html.light-mode .lx-stats {
    border-top-color: rgba(122, 96, 15, 0.25);
  }
  html.light-mode .lx-stat + .lx-stat {
    border-left-color: rgba(122, 96, 15, 0.25);
  }
  html.light-mode .lx-frame {
    border-color: rgba(122, 96, 15, 0.2);
  }
  html.light-mode .lx-corner {
    background: #7a600f;
  }

  /* ── Light mode: right form panel ── */
  html.light-mode .lx-root {
    background: #ede5d0;
  }
  html.light-mode .lx-form-panel {
    background: #ede5d0;
    border-left-color: rgba(122, 96, 15, 0.18);
  }
  html.light-mode .lx-form-panel::after {
    background: none;
    display: none;
  }
  html.light-mode .lx-form-title {
    color: #0a0702;
  }
  html.light-mode .lx-form-eyebrow {
    color: #7a600f;
    opacity: 1;
  }
  html.light-mode .lx-form-sub {
    color: rgba(10, 7, 2, 0.62);
  }
  html.light-mode .lx-label {
    color: #7a600f;
    opacity: 1;
  }
  html.light-mode .lx-input {
    color: #0a0702;
    border-bottom-color: rgba(122, 96, 15, 0.3);
  }
  html.light-mode .lx-input::placeholder {
    color: rgba(10, 7, 2, 0.28);
  }
  html.light-mode .lx-input:focus {
    border-bottom-color: #7a600f;
  }
  html.light-mode .lx-text-link {
    color: #7a600f;
  }
  html.light-mode .lx-div-line {
    background: rgba(122, 96, 15, 0.22);
  }
  html.light-mode .lx-div-text {
    color: rgba(10, 7, 2, 0.42);
  }
  html.light-mode .lx-footer {
    color: rgba(10, 7, 2, 0.55);
  }
  html.light-mode .lx-footer a {
    color: #7a600f;
  }
  html.light-mode .lx-error {
    background: rgba(122, 34, 34, 0.07);
    border-color: rgba(122, 34, 34, 0.35);
    color: #6a1e1e;
  }

  /* decorative corner frame */
  .lx-frame {
    position: absolute;
    top: 28px; left: 28px; right: 28px; bottom: 28px;
    border: 1px solid rgba(200,169,81,0.12);
    z-index: 1; pointer-events: none;
  }
  .lx-frame::before {
    content: '';
    position: absolute;
    top: 8px; left: 8px; right: 8px; bottom: 8px;
    border: 1px solid rgba(200,169,81,0.06);
  }
  .lx-corner {
    position: absolute;
    width: 10px; height: 10px;
    background: var(--gold);
    transform: rotate(45deg);
    z-index: 2; pointer-events: none;
  }
  .lx-corner.tl { top: 22px; left: 22px; }
  .lx-corner.tr { top: 22px; right: 22px; }
  .lx-corner.bl { bottom: 22px; left: 22px; }
  .lx-corner.br { bottom: 22px; right: 22px; }

  .lx-left-top { position: relative; z-index: 2; }
  .lx-left-mid  { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .lx-left-bot  { position: relative; z-index: 2; }

  /* Logo */
  .lx-logo { display: flex; align-items: center; gap: 14px; }
  .lx-logo-mark {
    width: 38px; height: 38px;
    border: 1.5px solid var(--gold);
    transform: rotate(45deg);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .lx-logo-mark::after {
    content: '';
    width: 16px; height: 16px;
    border: 1px solid var(--gold);
    opacity: 0.5;
  }
  .lx-logo-text {
    font-family: 'Cinzel', serif;
    font-size: 22px; font-weight: 600;
    letter-spacing: 0.28em;
    color: var(--cream);
    text-transform: uppercase;
  }
  .lx-logo-text span { color: var(--gold); }

  /* Headline */
  .lx-eyebrow {
    font-size: 9px; font-weight: 300;
    letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 20px;
  }
  .lx-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(42px, 4vw, 62px);
    font-weight: 300; color: var(--cream);
    line-height: 1.1; margin-bottom: 28px;
  }
  .lx-headline em { color: var(--gold-light); font-style: italic; }

  .lx-rule {
    width: 60px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    margin-bottom: 22px;
  }
  .lx-sub {
    font-size: 13px; font-weight: 200;
    color: var(--muted); line-height: 1.9;
    max-width: 380px; letter-spacing: 0.04em;
  }

  /* Stats */
  .lx-stats {
    display: flex; gap: 0;
    border-top: 1px solid var(--border);
    padding-top: 32px;
  }
  .lx-stat { flex: 1; padding-right: 24px; }
  .lx-stat + .lx-stat {
    padding-left: 24px;
    border-left: 1px solid var(--border);
  }
  .lx-stat-n {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; font-weight: 400; color: var(--gold-light);
    line-height: 1;
  }
  .lx-stat-l {
    font-size: 10px; font-weight: 200;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--muted); margin-top: 6px;
  }

  /* ══════════════════════════════════════
     RIGHT  –  Form Panel
  ══════════════════════════════════════ */
  .lx-form-panel {
    width: 500px; flex-shrink: 0;
    background: var(--obsidian);
    display: flex; flex-direction: column; justify-content: center;
    padding: 72px 56px;
    position: relative;
    border-left: 1px solid rgba(200,169,81,0.1);
  }
  .lx-form-panel::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent 0%, var(--gold) 40%, var(--gold-light) 60%, transparent 100%);
  }
  .lx-form-panel::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 200px;
    background: radial-gradient(ellipse at 50% 0%, rgba(200,169,81,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .lx-form-eyebrow {
    font-size: 9px; font-weight: 300;
    letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 12px; opacity: 0.8;
  }
  .lx-form-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px; font-weight: 300;
    color: var(--cream); margin-bottom: 6px; line-height: 1.1;
  }
  .lx-form-sub {
    font-size: 12px; font-weight: 200;
    color: var(--muted); margin-bottom: 44px;
    letter-spacing: 0.06em; line-height: 1.7;
  }

  .lx-field { margin-bottom: 28px; }
  .lx-label {
    display: block;
    font-size: 9px; font-weight: 300;
    letter-spacing: 0.32em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 10px; opacity: 0.9;
  }

  .lx-input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--border);
    padding: 10px 0 12px;
    font-family: 'Raleway', sans-serif;
    font-size: 14px; font-weight: 300;
    color: var(--cream); outline: none;
    transition: border-color 0.3s;
    letter-spacing: 0.05em;
  }
  .lx-input::placeholder { color: rgba(240,234,214,0.2); }
  .lx-input:focus { border-bottom-color: var(--gold); }

  .lx-forgot-row {
    display: flex; justify-content: flex-end;
    margin-top: -12px; margin-bottom: 36px;
  }
  .lx-text-link {
    font-size: 11px; font-weight: 300;
    letter-spacing: 0.06em;
    color: var(--gold); opacity: 0.65;
    text-decoration: none; transition: opacity 0.2s;
  }
  .lx-text-link:hover { opacity: 1; }

  .lx-btn {
    width: 100%; padding: 17px;
    background: transparent;
    border: 1px solid var(--gold);
    color: var(--gold);
    font-family: 'Cinzel', serif;
    font-size: 11px; font-weight: 400;
    letter-spacing: 0.35em; text-transform: uppercase;
    cursor: pointer;
    position: relative; overflow: hidden;
    transition: color 0.4s;
  }
  .lx-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
    z-index: 0;
  }
  .lx-btn:hover:not(:disabled)::before { transform: scaleX(1); }
  .lx-btn:hover:not(:disabled) { color: var(--black); }
  .lx-btn span { position: relative; z-index: 1; }
  .lx-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .lx-divider {
    display: flex; align-items: center; gap: 16px;
    margin: 28px 0;
  }
  .lx-div-line { flex: 1; height: 1px; background: var(--border); }
  .lx-div-text {
    font-size: 10px; font-weight: 200;
    letter-spacing: 0.2em; color: var(--muted);
    text-transform: uppercase;
  }

  .lx-footer {
    text-align: center; font-size: 12px;
    font-weight: 200; color: var(--muted);
    letter-spacing: 0.05em;
  }
  .lx-footer a {
    color: var(--gold-light); font-weight: 300;
    text-decoration: none; letter-spacing: 0.08em;
    transition: opacity 0.2s;
  }
  .lx-footer a:hover { opacity: 0.7; }

  .lx-error {
    border: 1px solid rgba(180,50,50,0.4);
    background: rgba(180,50,50,0.07);
    color: #E08080;
    font-size: 12px; font-weight: 300; letter-spacing: 0.04em;
    padding: 12px 16px; margin-bottom: 28px;
    line-height: 1.5;
  }

  @media (max-width: 900px) {
    .lx-left { display: none; }
    .lx-form-panel { width: 100%; padding: 56px 32px; }
  }
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email address and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{style}</style>
      <div className="lx-root">
        {/* ── Left visual panel ── */}
        <div className="lx-left">
          <div className="lx-frame" />
          <div className="lx-corner tl" />
          <div className="lx-corner tr" />
          <div className="lx-corner bl" />
          <div className="lx-corner br" />

          <div className="lx-left-top">
            <div className="lx-logo">
              <div className="lx-logo-mark" />
              <div className="lx-logo-text" translate="no">
                Event<span>y</span>
              </div>
            </div>
          </div>

          <div className="lx-left-mid">
            <p className="lx-eyebrow">Luxury Event Planning</p>
            <h1 className="lx-headline">
              Where every
              <br />
              moment becomes
              <br />
              <em>legend.</em>
            </h1>
            <div className="lx-rule" />
            <p className="lx-sub">
              A curated platform connecting discerning hosts with exceptional
              venues, world-class vendors, and bespoke event experiences — all
              in one place.
            </p>
          </div>

          <div className="lx-left-bot">
            <div className="lx-stats">
              <div className="lx-stat">
                <div className="lx-stat-n">500+</div>
                <div className="lx-stat-l">Premium Venues</div>
              </div>
              <div className="lx-stat">
                <div className="lx-stat-n">12k+</div>
                <div className="lx-stat-l">Events Executed</div>
              </div>
              <div className="lx-stat">
                <div className="lx-stat-n">98%</div>
                <div className="lx-stat-l">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="lx-form-panel">
          <p className="lx-form-eyebrow">Member Access</p>
          <h2 className="lx-form-title">Welcome back</h2>
          <p className="lx-form-sub">
            Sign in to your Eventy account and continue
            <br />
            crafting your perfect event.
          </p>

          {error && <div className="lx-error">{error}</div>}

          <div className="lx-field">
            <label className="lx-label">Email Address</label>
            <input
              className="lx-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <div className="lx-field">
            <label className="lx-label">Password</label>
            <input
              className="lx-input"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <div className="lx-forgot-row">
            <Link to="/forgot-password" className="lx-text-link">
              Forgot password?
            </Link>
          </div>

          <button className="lx-btn" onClick={handleLogin} disabled={loading}>
            <span>{loading ? "Signing In…" : "Sign In"}</span>
          </button>

          <div className="lx-divider">
            <div className="lx-div-line" />
            <span className="lx-div-text">or</span>
            <div className="lx-div-line" />
          </div>

          <p className="lx-footer">
            New to Eventy?&ensp;<Link to="/register">Create your account</Link>
          </p>
        </div>
      </div>
    </>
  );
}
