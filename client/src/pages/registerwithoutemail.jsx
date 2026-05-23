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
    --olive:      #3B4A2F;
    --olive-soft: rgba(59,74,47,0.35);
    --crimson:    #7A1E2E;
    --crimson-soft: rgba(122,30,46,0.2);
    --gold:       #C8A951;
    --gold-light: #E2C97E;
    --gold-dim:   rgba(200,169,81,0.10);
    --gold-line:  rgba(200,169,81,0.3);
    --cream:      #F0EAD6;
    --muted:      rgba(240,234,214,0.38);
    --border:     rgba(200,169,81,0.2);
  }

  .rx-root {
    font-family: 'Raleway', sans-serif;
    min-height: 100vh;
    background: var(--black);
    display: flex;
  }

  /* ══════════════════════════════════════
     LEFT  –  Form Panel
  ══════════════════════════════════════ */
  .rx-form-panel {
    width: 560px; flex-shrink: 0;
    background: var(--obsidian);
    display: flex; flex-direction: column; justify-content: center;
    padding: 60px 56px;
    position: relative; overflow-y: auto;
    border-right: 1px solid rgba(200,169,81,0.1);
  }
  .rx-form-panel::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), transparent);
  }
  .rx-form-panel::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 180px;
    background: radial-gradient(ellipse at 50% 0%, rgba(200,169,81,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Logo */
  .rx-logo {
    display: flex; align-items: center; gap: 12px; margin-bottom: 48px;
  }
  .rx-logo-mark {
    width: 32px; height: 32px;
    border: 1.5px solid var(--gold); transform: rotate(45deg);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .rx-logo-mark::after {
    content: ''; width: 12px; height: 12px;
    border: 1px solid var(--gold); opacity: 0.45;
  }
  .rx-logo-text {
    font-family: 'Cinzel', serif;
    font-size: 18px; font-weight: 600;
    letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase;
  }
  .rx-logo-text span { color: var(--gold); }

  .rx-eyebrow {
    font-size: 9px; font-weight: 300; letter-spacing: 0.42em;
    text-transform: uppercase; color: var(--gold); opacity: 0.8; margin-bottom: 10px;
  }
  .rx-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px; font-weight: 300; color: var(--cream);
    line-height: 1.1; margin-bottom: 6px;
  }
  .rx-sub {
    font-size: 12px; font-weight: 200; color: var(--muted);
    letter-spacing: 0.06em; line-height: 1.7; margin-bottom: 40px;
  }

  /* Grid */
  .rx-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 28px; }
  .rx-field { margin-bottom: 26px; }
  .rx-field-full { grid-column: span 2; }

  .rx-label {
    display: block; font-size: 9px; font-weight: 300;
    letter-spacing: 0.32em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 10px; opacity: 0.85;
  }
  .rx-input {
    width: 100%;
    background: transparent;
    border: none; border-bottom: 1px solid var(--border);
    padding: 10px 0 12px;
    font-family: 'Raleway', sans-serif; font-size: 14px; font-weight: 300;
    color: var(--cream); outline: none;
    transition: border-color 0.3s; letter-spacing: 0.05em;
  }
  .rx-input::placeholder { color: rgba(240,234,214,0.18); }
  .rx-input:focus { border-bottom-color: var(--gold); }

  /* Links row */
  .rx-links-row {
    display: flex; justify-content: space-between;
    margin-top: -8px; margin-bottom: 32px;
  }
  .rx-text-link {
    font-size: 11px; font-weight: 300; letter-spacing: 0.06em;
    color: var(--gold); opacity: 0.6; text-decoration: none;
    transition: opacity 0.2s;
  }
  .rx-text-link:hover { opacity: 1; }

  /* Terms */
  .rx-terms {
    display: flex; align-items: flex-start; gap: 12px; margin-bottom: 32px;
  }
  .rx-checkbox {
    appearance: none; -webkit-appearance: none;
    width: 15px; height: 15px; flex-shrink: 0; margin-top: 3px;
    border: 1px solid var(--border); background: transparent;
    cursor: pointer; position: relative; transition: border-color 0.2s;
  }
  .rx-checkbox:checked { border-color: var(--gold); background: var(--gold-dim); }
  .rx-checkbox:checked::after {
    content: '✓'; position: absolute;
    top: 50%; left: 50%; transform: translate(-50%, -52%);
    font-size: 9px; color: var(--gold); font-weight: 700;
  }
  .rx-terms-text {
    font-size: 11px; font-weight: 200; color: var(--muted);
    letter-spacing: 0.04em; line-height: 1.7;
  }
  .rx-terms-text a { color: var(--gold-light); text-decoration: none; }
  .rx-terms-text a:hover { opacity: 0.7; }

  /* CTA */
  .rx-btn {
    width: 100%; padding: 17px;
    background: transparent; border: 1px solid var(--gold);
    color: var(--gold);
    font-family: 'Cinzel', serif;
    font-size: 11px; font-weight: 400;
    letter-spacing: 0.35em; text-transform: uppercase;
    cursor: pointer; position: relative; overflow: hidden;
    transition: color 0.4s;
  }
  .rx-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
    z-index: 0;
  }
  .rx-btn:hover:not(:disabled)::before { transform: scaleX(1); }
  .rx-btn:hover:not(:disabled) { color: var(--black); }
  .rx-btn span { position: relative; z-index: 1; }
  .rx-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .rx-footer {
    text-align: center; font-size: 12px; font-weight: 200;
    color: var(--muted); letter-spacing: 0.05em; margin-top: 24px;
  }
  .rx-footer a { color: var(--gold-light); font-weight: 300; text-decoration: none; }
  .rx-footer a:hover { opacity: 0.7; }

  .rx-error {
    border: 1px solid rgba(180,50,50,0.4); background: rgba(180,50,50,0.07);
    color: #E08080; font-size: 12px; font-weight: 300; letter-spacing: 0.04em;
    padding: 12px 16px; margin-bottom: 24px; line-height: 1.5;
  }
  .rx-success {
    border: 1px solid rgba(50,150,80,0.4); background: rgba(50,150,80,0.07);
    color: #7EC89A; font-size: 12px; font-weight: 300; letter-spacing: 0.04em;
    padding: 12px 16px; margin-bottom: 24px; line-height: 1.5;
  }

  /* ══════════════════════════════════════
     RIGHT  –  Visual Panel
  ══════════════════════════════════════ */
  .rx-right {
    flex: 1; position: relative; overflow: hidden;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 56px 60px;
  }

  /* Multi-tone luxury background */
  .rx-right::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 15% 10%, rgba(200,169,81,0.15) 0%, transparent 40%),
      radial-gradient(ellipse at 85% 90%, rgba(122,30,46,0.25) 0%, transparent 45%),
      radial-gradient(ellipse at 85% 20%, rgba(59,74,47,0.2) 0%, transparent 40%),
      linear-gradient(165deg, var(--navy) 0%, #080D15 50%, #0A0805 100%);
    z-index: 0;
  }
  /* diagonal texture */
  .rx-right::after {
    content: '';
    position: absolute; inset: 0;
    background-image: repeating-linear-gradient(
      -45deg,
      transparent, transparent 60px,
      rgba(200,169,81,0.02) 60px, rgba(200,169,81,0.02) 61px
    );
    z-index: 0;
  }

  /* corner frame */
  .rx-frame {
    position: absolute;
    top: 28px; left: 28px; right: 28px; bottom: 28px;
    border: 1px solid rgba(200,169,81,0.1); z-index: 1; pointer-events: none;
  }
  .rx-corner {
    position: absolute; width: 10px; height: 10px;
    background: var(--gold); transform: rotate(45deg);
    z-index: 2; pointer-events: none;
  }
  .rx-corner.tl { top: 22px; left: 22px; }
  .rx-corner.tr { top: 22px; right: 22px; }
  .rx-corner.bl { bottom: 22px; left: 22px; }
  .rx-corner.br { bottom: 22px; right: 22px; }

  .rx-right-top { position: relative; z-index: 2; }
  .rx-right-mid  { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .rx-right-bot  { position: relative; z-index: 2; }

  .rx-right-logo {
    display: flex; align-items: center; gap: 12px;
  }
  .rx-right-logo-mark {
    width: 32px; height: 32px;
    border: 1.5px solid var(--gold); transform: rotate(45deg);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .rx-right-logo-mark::after {
    content: ''; width: 12px; height: 12px; border: 1px solid var(--gold); opacity: 0.45;
  }
  .rx-right-logo-text {
    font-family: 'Cinzel', serif;
    font-size: 18px; font-weight: 600; letter-spacing: 0.28em;
    color: var(--cream); text-transform: uppercase;
  }
  .rx-right-logo-text span { color: var(--gold); }

  .rx-right-eyebrow {
    font-size: 9px; font-weight: 300; letter-spacing: 0.42em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 18px;
  }
  .rx-right-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(38px, 3.8vw, 56px); font-weight: 300;
    color: var(--cream); line-height: 1.12; margin-bottom: 28px;
  }
  .rx-right-headline em { color: var(--gold-light); font-style: italic; }
  .rx-right-rule {
    width: 56px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    margin-bottom: 22px;
  }

  /* Feature list */
  .rx-features { list-style: none; }
  .rx-feat {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(200,169,81,0.08);
  }
  .rx-feat:last-child { border-bottom: none; }
  .rx-feat-dot {
    width: 6px; height: 6px; flex-shrink: 0;
    background: var(--gold); transform: rotate(45deg);
    margin-top: 6px;
  }
  .rx-feat-title {
    font-size: 13px; font-weight: 300; color: var(--cream);
    letter-spacing: 0.04em; margin-bottom: 2px;
  }
  .rx-feat-desc {
    font-size: 11px; font-weight: 200; color: var(--muted);
    letter-spacing: 0.03em; line-height: 1.6;
  }

  /* Bottom color swatches — show brand palette */
  .rx-palette {
    display: flex; gap: 10px; align-items: center; padding-top: 28px;
    border-top: 1px solid var(--border);
  }
  .rx-palette-label {
    font-size: 9px; font-weight: 200; letter-spacing: 0.3em;
    text-transform: uppercase; color: var(--muted); margin-right: 6px;
  }
  .rx-swatch {
    width: 22px; height: 22px;
    border: 1px solid rgba(200,169,81,0.25);
  }

  @media (max-width: 960px) {
    .rx-right { display: none; }
    .rx-form-panel { width: 100%; padding: 52px 28px; }
    .rx-form-panel::after { display: none; }
  }
`;

export default function Register() {
  const [form, setForm] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    if (!form.fullName || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms & Privacy Policy.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await API.post("/users/register", {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
      });
      setSuccess("Account created successfully. Redirecting to sign in…");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{style}</style>
      <div className="rx-root">
        {/* ── Left form panel ── */}
        <div className="rx-form-panel">
          <div className="rx-logo">
            <div className="rx-logo-mark" />
            <div className="rx-logo-text" translate="no">
              Event<span>y</span>
            </div>
          </div>

          <p className="rx-eyebrow">New Member Registration</p>
          <h2 className="rx-title">Create your account</h2>
          <p className="rx-sub">
            Join Eventy and begin planning your extraordinary event — venues,
            vendors, themes and invitations, all in one place.
          </p>

          {error && <div className="rx-error">{error}</div>}
          {success && <div className="rx-success">{success}</div>}

          <div className="rx-grid">
            <div className="rx-field">
              <label className="rx-label">Full Name *</label>
              <input
                className="rx-input"
                name="fullName"
                placeholder="Ahmed Mohammed"
                onChange={handleChange}
              />
            </div>
            <div className="rx-field">
              <label className="rx-label">Phone Number</label>
              <input
                className="rx-input"
                name="phoneNumber"
                placeholder="+20 100 000 0000"
                onChange={handleChange}
              />
            </div>
            <div className="rx-field rx-field-full">
              <label className="rx-label">Email Address *</label>
              <input
                className="rx-input"
                name="email"
                type="email"
                placeholder="your@email.com"
                onChange={handleChange}
              />
            </div>
            <div className="rx-field">
              <label className="rx-label">Password *</label>
              <input
                className="rx-input"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                onChange={handleChange}
              />
            </div>
            <div className="rx-field">
              <label className="rx-label">Confirm Password *</label>
              <input
                className="rx-input"
                name="confirmPassword"
                type="password"
                placeholder="Repeat password"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="rx-terms">
            <input
              type="checkbox"
              className="rx-checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label className="rx-terms-text" htmlFor="agree">
              I agree to Eventy's <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>, and consent to receiving
              booking confirmations and event communications by email.
            </label>
          </div>

          <button
            className="rx-btn"
            onClick={handleRegister}
            disabled={loading || !!success}
          >
            <span>{loading ? "Creating Account…" : "Create Account"}</span>
          </button>

          <p className="rx-footer">
            Already a member?&ensp;<Link to="/login">Sign in here</Link>
          </p>
        </div>

        {/* ── Right visual panel ── */}
        <div className="rx-right">
          <div className="rx-frame" />
          <div className="rx-corner tl" />
          <div className="rx-corner tr" />
          <div className="rx-corner bl" />
          <div className="rx-corner br" />

          <div className="rx-right-top">
            <div className="rx-right-logo">
              <div className="rx-right-logo-mark" />
              <div className="rx-right-logo-text">
                Event<span>y</span>
              </div>
            </div>
          </div>

          <div className="rx-right-mid">
            <p className="rx-right-eyebrow">Why Choose Eventy</p>
            <h2 className="rx-right-headline">
              Craft an event
              <br />
              as <em>extraordinary</em>
              <br />
              as you are.
            </h2>
            <div className="rx-right-rule" />
            <ul className="rx-features">
              <li className="rx-feat">
                <div className="rx-feat-dot" />
                <div>
                  <div className="rx-feat-title">Curated Venue Selection</div>
                  <div className="rx-feat-desc">
                    Filter 500+ premium venues by location, capacity & event
                    type
                  </div>
                </div>
              </li>
              <li className="rx-feat">
                <div className="rx-feat-dot" />
                <div>
                  <div className="rx-feat-title">
                    Bespoke Theme Customization
                  </div>
                  <div className="rx-feat-desc">
                    Choose palettes, décor styles, and visual themes to match
                    your vision
                  </div>
                </div>
              </li>
              <li className="rx-feat">
                <div className="rx-feat-dot" />
                <div>
                  <div className="rx-feat-title">
                    World-Class Vendor Network
                  </div>
                  <div className="rx-feat-desc">
                    Caterers, DJs, photographers & entertainers at your
                    fingertips
                  </div>
                </div>
              </li>
              <li className="rx-feat">
                <div className="rx-feat-dot" />
                <div>
                  <div className="rx-feat-title">
                    Digital Invitations & RSVP
                  </div>
                  <div className="rx-feat-desc">
                    Design and send bespoke invitations directly to your guests
                  </div>
                </div>
              </li>
              <li className="rx-feat">
                <div className="rx-feat-dot" />
                <div>
                  <div className="rx-feat-title">Secure Online Payments</div>
                  <div className="rx-feat-desc">
                    Deposit via card, e-wallet or InstaPay with instant
                    confirmation
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="rx-right-bot">
            <div className="rx-palette">
              <span className="rx-palette-label">Est. 2026</span>
              <div
                className="rx-swatch"
                style={{ background: "#0D1B2A" }}
                title="Navy"
              />
              <div
                className="rx-swatch"
                style={{ background: "#C8A951" }}
                title="Gold"
              />
              <div
                className="rx-swatch"
                style={{ background: "#3B4A2F" }}
                title="Olive"
              />
              <div
                className="rx-swatch"
                style={{ background: "#7A1E2E" }}
                title="Crimson"
              />
              <div
                className="rx-swatch"
                style={{ background: "#111118" }}
                title="Obsidian"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
