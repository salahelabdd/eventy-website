import { useState, useRef, useEffect } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const COUNTRIES = [
  { code: "EG", dial: "+20", digits: 10, flag: "🇪🇬", name: "Egypt" },
  { code: "SA", dial: "+966", digits: 9, flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "AE", dial: "+971", digits: 9, flag: "🇦🇪", name: "UAE" },
  { code: "KW", dial: "+965", digits: 8, flag: "🇰🇼", name: "Kuwait" },
  { code: "QA", dial: "+974", digits: 8, flag: "🇶🇦", name: "Qatar" },
  { code: "BH", dial: "+973", digits: 8, flag: "🇧🇭", name: "Bahrain" },
  { code: "OM", dial: "+968", digits: 8, flag: "🇴🇲", name: "Oman" },
  { code: "JO", dial: "+962", digits: 9, flag: "🇯🇴", name: "Jordan" },
  { code: "LB", dial: "+961", digits: 8, flag: "🇱🇧", name: "Lebanon" },
  { code: "IQ", dial: "+964", digits: 10, flag: "🇮🇶", name: "Iraq" },
  { code: "LY", dial: "+218", digits: 9, flag: "🇱🇾", name: "Libya" },
  { code: "TN", dial: "+216", digits: 8, flag: "🇹🇳", name: "Tunisia" },
  { code: "MA", dial: "+212", digits: 9, flag: "🇲🇦", name: "Morocco" },
  { code: "DZ", dial: "+213", digits: 9, flag: "🇩🇿", name: "Algeria" },
  { code: "SD", dial: "+249", digits: 9, flag: "🇸🇩", name: "Sudan" },
  { code: "US", dial: "+1", digits: 10, flag: "🇺🇸", name: "United States" },
  { code: "GB", dial: "+44", digits: 10, flag: "🇬🇧", name: "United Kingdom" },
  { code: "FR", dial: "+33", digits: 9, flag: "🇫🇷", name: "France" },
  { code: "DE", dial: "+49", digits: 10, flag: "🇩🇪", name: "Germany" },
  { code: "TR", dial: "+90", digits: 10, flag: "🇹🇷", name: "Turkey" },
];

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,500&family=Cinzel:wght@400;600&family=Raleway:wght@200;300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black:      #0A0A0A;
    --obsidian:   #111118;
    --navy:       #0D1B2A;
    --gold:       #C8A951;
    --gold-light: #E2C97E;
    --gold-dim:   rgba(200,169,81,0.10);
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

  /* ── Form Panel ── */
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

  .rx-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 48px; }
  .rx-logo-mark {
    width: 32px; height: 32px;
    border: 1.5px solid var(--gold); transform: rotate(45deg);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .rx-logo-mark::after { content: ''; width: 12px; height: 12px; border: 1px solid var(--gold); opacity: 0.45; }
  .rx-logo-text { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase; }
  .rx-logo-text span { color: var(--gold); }

  .rx-eyebrow { font-size: 9px; font-weight: 300; letter-spacing: 0.42em; text-transform: uppercase; color: var(--gold); opacity: 0.8; margin-bottom: 10px; }
  .rx-title { font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 300; color: var(--cream); line-height: 1.1; margin-bottom: 6px; }
  .rx-sub { font-size: 12px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; line-height: 1.7; margin-bottom: 40px; }

  .rx-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 28px; }
  .rx-field { margin-bottom: 26px; }
  .rx-field-full { grid-column: span 2; }

  .rx-label { display: block; font-size: 9px; font-weight: 300; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); margin-bottom: 10px; opacity: 0.85; }
  .rx-input {
    width: 100%; background: transparent;
    border: none; border-bottom: 1px solid var(--border);
    padding: 10px 0 12px;
    font-family: 'Raleway', sans-serif; font-size: 14px; font-weight: 300;
    color: var(--cream); outline: none;
    transition: border-color 0.3s; letter-spacing: 0.05em;
  }
  .rx-input::placeholder { color: rgba(240,234,214,0.18); }
  .rx-input:focus { border-bottom-color: var(--gold); }

  /* Phone row */
  .rx-phone-row {
    display: flex; align-items: flex-end; gap: 0;
    border-bottom: 1px solid var(--border);
    transition: border-color 0.3s;
  }
  .rx-phone-row:focus-within { border-bottom-color: var(--gold); }
  .rx-phone-row .rx-input { border-bottom: none; flex: 1; }

  .rx-country-wrap { position: relative; flex-shrink: 0; }
  .rx-country-btn {
    background: transparent; border: none; border-right: 1px solid var(--border);
    padding: 10px 10px 12px 0;
    color: var(--cream); font-family: 'Raleway', sans-serif; font-size: 13px; font-weight: 300;
    cursor: pointer; display: flex; align-items: center; gap: 6px;
    white-space: nowrap; outline: none; letter-spacing: 0.04em;
  }
  .rx-country-btn .caret { font-size: 9px; color: var(--gold); opacity: 0.7; }

  .rx-country-dropdown {
    position: absolute; top: calc(100% + 4px); left: 0;
    width: 220px; max-height: 260px; overflow-y: auto;
    background: #18181f; border: 1px solid var(--border);
    z-index: 100; box-shadow: 0 12px 40px rgba(0,0,0,0.6);
  }
  .rx-country-dropdown::-webkit-scrollbar { width: 4px; }
  .rx-country-dropdown::-webkit-scrollbar-thumb { background: var(--border); }

  .rx-country-search {
    width: 100%; background: transparent;
    border: none; border-bottom: 1px solid var(--border);
    padding: 10px 12px;
    color: var(--cream); font-family: 'Raleway', sans-serif; font-size: 12px;
    outline: none; letter-spacing: 0.04em;
  }
  .rx-country-search::placeholder { color: var(--muted); }

  .rx-country-opt {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; cursor: pointer;
    font-size: 12px; font-weight: 300; color: var(--cream);
    letter-spacing: 0.04em; transition: background 0.15s;
  }
  .rx-country-opt:hover, .rx-country-opt.active { background: var(--gold-dim); }
  .rx-country-opt .dial { color: var(--gold); font-size: 11px; margin-left: auto; }

  .rx-phone-hint { font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.04em; margin-top: 6px; }

  /* Terms */
  .rx-terms { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 32px; }
  .rx-checkbox {
    appearance: none; -webkit-appearance: none;
    width: 15px; height: 15px; flex-shrink: 0; margin-top: 3px;
    border: 1px solid var(--border); background: transparent;
    cursor: pointer; position: relative; transition: border-color 0.2s;
  }
  .rx-checkbox:checked { border-color: var(--gold); background: var(--gold-dim); }
  .rx-checkbox:checked::after { content: '✓'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -52%); font-size: 9px; color: var(--gold); font-weight: 700; }
  .rx-terms-text { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.04em; line-height: 1.7; }
  .rx-terms-text a { color: var(--gold-light); text-decoration: none; }

  /* Button */
  .rx-btn {
    width: 100%; padding: 17px;
    background: transparent; border: 1px solid var(--gold);
    color: var(--gold); font-family: 'Cinzel', serif;
    font-size: 11px; font-weight: 400; letter-spacing: 0.35em; text-transform: uppercase;
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.4s;
  }
  .rx-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .rx-btn:hover:not(:disabled)::before { transform: scaleX(1); }
  .rx-btn:hover:not(:disabled) { color: var(--black); }
  .rx-btn span { position: relative; z-index: 1; }
  .rx-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .rx-footer { text-align: center; font-size: 12px; font-weight: 200; color: var(--muted); letter-spacing: 0.05em; margin-top: 24px; }
  .rx-footer a { color: var(--gold-light); font-weight: 300; text-decoration: none; }

  .rx-error { border: 1px solid rgba(180,50,50,0.4); background: rgba(180,50,50,0.07); color: #E08080; font-size: 12px; font-weight: 300; letter-spacing: 0.04em; padding: 12px 16px; margin-bottom: 24px; line-height: 1.5; }
  .rx-success { border: 1px solid rgba(50,150,80,0.4); background: rgba(50,150,80,0.07); color: #7EC89A; font-size: 12px; font-weight: 300; letter-spacing: 0.04em; padding: 12px 16px; margin-bottom: 24px; line-height: 1.5; }

  /* OTP Modal */
  .rx-modal-backdrop {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(10,10,10,0.85);
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.25s ease;
  }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

  .rx-modal {
    background: var(--obsidian); border: 1px solid var(--border);
    width: 440px; max-width: calc(100vw - 40px);
    padding: 48px 44px; position: relative;
    animation: slideUp 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
  .rx-modal::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), transparent);
  }

  .rx-modal-icon {
    width: 52px; height: 52px; margin: 0 auto 28px;
    border: 1.5px solid var(--gold); transform: rotate(45deg);
    display: flex; align-items: center; justify-content: center;
  }
  .rx-modal-icon-inner { transform: rotate(-45deg); font-size: 20px; }

  .rx-modal-eyebrow { font-size: 9px; letter-spacing: 0.4em; text-transform: uppercase; color: var(--gold); opacity: 0.7; margin-bottom: 10px; text-align: center; }
  .rx-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; color: var(--cream); text-align: center; margin-bottom: 8px; }
  .rx-modal-desc { font-size: 12px; font-weight: 200; color: var(--muted); text-align: center; line-height: 1.7; margin-bottom: 36px; letter-spacing: 0.04em; }
  .rx-modal-desc strong { color: var(--gold-light); font-weight: 300; }

  .rx-otp-row { display: flex; gap: 10px; justify-content: center; margin-bottom: 12px; }
  .rx-otp-box {
    width: 48px; height: 56px; background: transparent;
    border: 1px solid var(--border); color: var(--gold);
    font-family: 'Cinzel', serif; font-size: 22px; font-weight: 600;
    text-align: center; outline: none;
    transition: border-color 0.2s, background 0.2s; caret-color: var(--gold);
  }
  .rx-otp-box:focus { border-color: var(--gold); background: var(--gold-dim); }
  .rx-otp-box.filled { border-color: rgba(200,169,81,0.5); background: var(--gold-dim); }

  .rx-otp-hint { text-align: center; font-size: 11px; font-weight: 200; color: var(--muted); margin-bottom: 32px; letter-spacing: 0.04em; }
  .rx-otp-hint button { background: none; border: none; color: var(--gold); font-size: 11px; font-weight: 300; cursor: pointer; padding: 0; font-family: 'Raleway', sans-serif; letter-spacing: 0.04em; }
  .rx-otp-hint button:disabled { opacity: 0.4; cursor: not-allowed; }
  .rx-timer { font-size: 11px; color: var(--gold); opacity: 0.6; }

  .rx-modal-back { position: absolute; top: 18px; right: 18px; background: none; border: none; color: var(--muted); font-size: 18px; cursor: pointer; line-height: 1; padding: 4px 8px; transition: color 0.2s; }
  .rx-modal-back:hover { color: var(--gold); }

  /* ── Right panel — dark mode (default) ── */
  .rx-right {
    flex: 1; position: relative; overflow: hidden;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 56px 60px;
  }
  .rx-right::before {
    content: ''; position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 15% 10%, rgba(200,169,81,0.15) 0%, transparent 40%),
      radial-gradient(ellipse at 85% 90%, rgba(122,30,46,0.25) 0%, transparent 45%),
      radial-gradient(ellipse at 85% 20%, rgba(59,74,47,0.2) 0%, transparent 40%),
      linear-gradient(165deg, var(--navy) 0%, #080D15 50%, #0A0805 100%);
    z-index: 0;
  }
  .rx-right::after {
    content: ''; position: absolute; inset: 0;
    background-image: repeating-linear-gradient(-45deg, transparent, transparent 60px, rgba(200,169,81,0.02) 60px, rgba(200,169,81,0.02) 61px);
    z-index: 0;
  }

  /* ── Right panel — light mode overrides ── */
  html.light-mode .rx-right {
    background: #e8dfc8;
  }
  html.light-mode .rx-right::before {
    background: none;
    display: none;
  }
  html.light-mode .rx-right::after {
    background: none;
    background-image: none;
    display: none;
  }
  html.light-mode .rx-right-headline,
  html.light-mode .rx-right-logo-text {
    color: #0a0702;
  }
  html.light-mode .rx-right-headline em {
    color: #7a600f;
  }
  html.light-mode .rx-right-eyebrow {
    color: #7a600f;
    opacity: 1;
  }
  html.light-mode .rx-feat-title {
    color: #0a0702;
  }
  html.light-mode .rx-feat-desc {
    color: rgba(10, 7, 2, 0.62);
  }
  html.light-mode .rx-feat {
    border-bottom-color: rgba(168, 135, 42, 0.15);
  }
  html.light-mode .rx-palette {
    border-top-color: rgba(168, 135, 42, 0.22);
  }
  html.light-mode .rx-palette-label {
    color: rgba(10, 7, 2, 0.5);
    opacity: 1;
  }
  html.light-mode .rx-frame {
    border-color: rgba(168, 135, 42, 0.2);
  }
  html.light-mode .rx-corner {
    background: #7a600f;
  }
  html.light-mode .rx-right-rule {
    background: linear-gradient(90deg, #7a600f, transparent);
  }

  .rx-frame { position: absolute; top: 28px; left: 28px; right: 28px; bottom: 28px; border: 1px solid rgba(200,169,81,0.1); z-index: 1; pointer-events: none; }
  .rx-corner { position: absolute; width: 10px; height: 10px; background: var(--gold); transform: rotate(45deg); z-index: 2; pointer-events: none; }
  .rx-corner.tl { top: 22px; left: 22px; }
  .rx-corner.tr { top: 22px; right: 22px; }
  .rx-corner.bl { bottom: 22px; left: 22px; }
  .rx-corner.br { bottom: 22px; right: 22px; }

  .rx-right-top { position: relative; z-index: 2; }
  .rx-right-mid  { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .rx-right-bot  { position: relative; z-index: 2; }

  .rx-right-logo { display: flex; align-items: center; gap: 12px; }
  .rx-right-logo-mark { width: 32px; height: 32px; border: 1.5px solid var(--gold); transform: rotate(45deg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .rx-right-logo-mark::after { content: ''; width: 12px; height: 12px; border: 1px solid var(--gold); opacity: 0.45; }
  .rx-right-logo-text { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase; }
  .rx-right-logo-text span { color: var(--gold); }

  .rx-right-eyebrow { font-size: 9px; font-weight: 300; letter-spacing: 0.42em; text-transform: uppercase; color: var(--gold); margin-bottom: 18px; }
  .rx-right-headline { font-family: 'Cormorant Garamond', serif; font-size: clamp(38px, 3.8vw, 56px); font-weight: 300; color: var(--cream); line-height: 1.12; margin-bottom: 28px; }
  .rx-right-headline em { color: var(--gold-light); font-style: italic; }
  .rx-right-rule { width: 56px; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); margin-bottom: 22px; }

  .rx-features { list-style: none; }
  .rx-feat { display: flex; align-items: flex-start; gap: 16px; padding: 14px 0; border-bottom: 1px solid rgba(200,169,81,0.08); }
  .rx-feat:last-child { border-bottom: none; }
  .rx-feat-dot { width: 6px; height: 6px; flex-shrink: 0; background: var(--gold); transform: rotate(45deg); margin-top: 6px; }
  .rx-feat-title { font-size: 13px; font-weight: 300; color: var(--cream); letter-spacing: 0.04em; margin-bottom: 2px; }
  .rx-feat-desc { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.03em; line-height: 1.6; }

  .rx-palette { display: flex; gap: 10px; align-items: center; padding-top: 28px; border-top: 1px solid var(--border); }
  .rx-palette-label { font-size: 9px; font-weight: 200; letter-spacing: 0.3em; text-transform: uppercase; color: var(--muted); margin-right: 6px; }
  .rx-swatch { width: 22px; height: 22px; border: 1px solid rgba(200,169,81,0.25); }

  @media (max-width: 960px) {
    .rx-right { display: none; }
    .rx-form-panel { width: 100%; padding: 52px 28px; }
  }
`;

/* ─────────────────────────────────────────
   Country Selector
───────────────────────────────────────── */
function CountrySelect({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search),
  );

  return (
    <div className="rx-country-wrap" ref={ref}>
      <button
        type="button"
        className="rx-country-btn"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{selected.flag}</span>
        <span>{selected.dial}</span>
        <span className="caret">▾</span>
      </button>

      {open && (
        <div className="rx-country-dropdown">
          <input
            className="rx-country-search"
            placeholder="Search country…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          {filtered.map((c) => (
            <div
              key={c.code}
              className={`rx-country-opt${c.code === selected.code ? " active" : ""}`}
              onClick={() => {
                onChange(c);
                setOpen(false);
                setSearch("");
              }}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
              <span className="dial">{c.dial}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   OTP Modal
───────────────────────────────────────── */
function OtpModal({
  email,
  onVerified,
  onClose,
  onResend,
  loading,
  serverError,
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const refs = useRef([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        const d = [...digits];
        d[i] = "";
        setDigits(d);
      } else if (i > 0) {
        refs.current[i - 1]?.focus();
      }
    }
  };

  const handleChange = (i, val) => {
    const ch = val.replace(/\D/, "").slice(-1);
    const d = [...digits];
    d[i] = ch;
    setDigits(d);
    if (ch && i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const txt = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (txt.length) {
      const d = txt.split("").concat(Array(6).fill("")).slice(0, 6);
      setDigits(d);
      refs.current[Math.min(txt.length, 5)]?.focus();
    }
  };

  const code = digits.join("");

  const handleSubmit = () => {
    if (code.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    if (loading) return;
    setError("");
    onVerified(code);
  };

  const handleResend = async () => {
    setCountdown(60);
    setError("");
    setDigits(["", "", "", "", "", ""]);
    refs.current[0]?.focus();
    try {
      await onResend();
    } catch {}
  };

  return (
    <div className="rx-modal-backdrop">
      <div className="rx-modal">
        <button className="rx-modal-back" onClick={onClose} title="Go back">
          ✕
        </button>

        <div className="rx-modal-icon">
          <span className="rx-modal-icon-inner">✉</span>
        </div>

        <p className="rx-modal-eyebrow">Email Verification</p>
        <h2 className="rx-modal-title">Check your inbox</h2>
        <p className="rx-modal-desc">
          We sent a 6-digit code to
          <br />
          <strong>{email}</strong>
          <br />
          Enter it below to complete registration.
        </p>

        {error && (
          <div className="rx-error" style={{ marginBottom: 20 }}>
            {error}
          </div>
        )}

        {serverError && (
          <div className="rx-error" style={{ marginBottom: 20 }}>
            {serverError}
          </div>
        )}

        <div className="rx-otp-row" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              className={`rx-otp-box${d ? " filled" : ""}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKey(i, e)}
            />
          ))}
        </div>

        <p className="rx-otp-hint">
          {countdown > 0 ? (
            <span>
              Resend code in <span className="rx-timer">{countdown}s</span>
            </span>
          ) : (
            <button onClick={handleResend}>Resend verification code</button>
          )}
        </p>

        <button
          className="rx-btn"
          onClick={handleSubmit}
          disabled={loading || code.length < 6}
        >
          <span>{loading ? "Verifying…" : "Verify & Create Account"}</span>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Register Page
───────────────────────────────────────── */
export default function Register() {
  const [form, setForm] = useState({});
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [localPhone, setLocalPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, country.digits);
    setLocalPhone(val);
  };

  const phoneComplete = localPhone.length === country.digits;
  const fullPhone = localPhone ? `${country.dial}${localPhone}` : "";

  const handleSubmit = async () => {
    setError("");

    if (!form.fullName || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!/[A-Z]/.test(form.password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (localPhone && !phoneComplete) {
      setError(
        `Phone number must be ${country.digits} digits for ${country.name}.`,
      );
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms & Privacy Policy.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/users/send-otp", { email: form.email });
      setShowOtp(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send verification email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = async (code) => {
    setLoading(true);
    try {
      await API.post("/users/register", {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: fullPhone || undefined,
        password: form.password,
        code,
      });
      setShowOtp(false);
      setSuccess("Account created successfully. Redirecting to sign in…");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      // removed setShowOtp(false) — modal stays open to show the error
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => API.post("/users/send-otp", { email: form.email });

  return (
    <>
      <style>{style}</style>
      <div className="rx-root">
        {showOtp && (
          <OtpModal
            email={form.email}
            onVerified={handleVerified}
            onClose={() => {
              setShowOtp(false);
              setError("");
            }}
            onResend={handleResend}
            loading={loading}
            serverError={error}
          />
        )}

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
              <div className="rx-phone-row">
                <CountrySelect
                  selected={country}
                  onChange={(c) => {
                    setCountry(c);
                    setLocalPhone("");
                  }}
                />
                <input
                  className="rx-input"
                  type="tel"
                  inputMode="numeric"
                  placeholder={"0".repeat(country.digits)}
                  value={localPhone}
                  onChange={handlePhoneChange}
                />
              </div>
              <p className="rx-phone-hint">
                {country.name}: {country.dial} + {country.digits} digits
                {localPhone && !phoneComplete && (
                  <span style={{ color: "#E08080" }}>
                    {" "}
                    — {country.digits - localPhone.length} more needed
                  </span>
                )}
                {phoneComplete && <span style={{ color: "#7EC89A" }}> ✓</span>}
              </p>
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
            onClick={handleSubmit}
            disabled={loading || !!success}
          >
            <span>{loading ? "Sending Code…" : "Continue — Verify Email"}</span>
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
              {[
                [
                  "Curated Venue Selection",
                  "Filter 500+ premium venues by location, capacity & event type",
                ],
                [
                  "Bespoke Theme Customization",
                  "Choose palettes, décor styles, and visual themes to match your vision",
                ],
                [
                  "World-Class Vendor Network",
                  "Caterers, DJs, photographers & entertainers at your fingertips",
                ],
                [
                  "Digital Invitations & RSVP",
                  "Design and send bespoke invitations directly to your guests",
                ],
                [
                  "Secure Online Payments",
                  "Deposit via card, e-wallet or InstaPay with instant confirmation",
                ],
              ].map(([title, desc]) => (
                <li className="rx-feat" key={title}>
                  <div className="rx-feat-dot" />
                  <div>
                    <div className="rx-feat-title">{title}</div>
                    <div className="rx-feat-desc">{desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rx-right-bot">
            <div className="rx-palette">
              <span className="rx-palette-label">Est. 2026</span>
              {["#0D1B2A", "#C8A951", "#3B4A2F", "#7A1E2E", "#111118"].map(
                (c) => (
                  <div
                    key={c}
                    className="rx-swatch"
                    style={{ background: c }}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
