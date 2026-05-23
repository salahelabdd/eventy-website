import { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,500&family=Cinzel:wght@400;600&family=Raleway:wght@200;300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black:      #0A0A0A;
    --obsidian:   #111118;
    --navy:       #0D1B2A;
    --gold:       #C8A951;
    --gold-light: #E2C97E;
    --gold-dim:   rgba(200,169,81,0.12);
    --gold-glow:  rgba(200,169,81,0.22);
    --gold-line:  rgba(200,169,81,0.35);
    --cream:      #F0EAD6;
    --muted:      rgba(240,234,214,0.38);
    --border:     rgba(200,169,81,0.22);
    --red:        #E08080;
    --green:      #8DB87A;
  }

  .bk-root {
    font-family: 'Raleway', sans-serif;
    min-height: 100vh;
    color: var(--cream);
    background-color: #0A0A0A;
    background-image:
      repeating-linear-gradient(135deg, transparent, transparent 28px, rgba(200,169,81,0.03) 28px, rgba(200,169,81,0.03) 29px),
      repeating-linear-gradient(45deg,  transparent, transparent 28px, rgba(200,169,81,0.018) 28px, rgba(200,169,81,0.018) 29px),
      radial-gradient(ellipse at 15% 0%, rgba(200,169,81,0.07) 0%, transparent 50%),
      radial-gradient(ellipse at 85% 100%, rgba(13,27,42,0.6) 0%, transparent 50%);
  }
  .bk-root::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%);
  }

  /* ── Topbar ── */
  .bk-topbar {
    background: rgba(17,17,24,0.94); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 22px 56px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .bk-topbar::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .bk-logo { display: flex; align-items: center; gap: 14px; cursor: pointer; }
  .bk-logo-mark { width: 32px; height: 32px; border: 1.5px solid var(--gold); transform: rotate(45deg); flex-shrink: 0; }
  .bk-logo-text { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase; }
  .bk-logo-text span { color: var(--gold); }
  .bk-back-btn {
    font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
    padding: 9px 22px; border: 1px solid var(--border);
    background: transparent; color: var(--gold); cursor: pointer;
    position: relative; overflow: hidden; transition: color 0.3s;
    display: flex; align-items: center; gap: 10px;
  }
  .bk-back-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .bk-back-btn:hover::before { transform: scaleX(1); }
  .bk-back-btn:hover { color: var(--black); }
  .bk-back-btn span { position: relative; z-index: 1; }

  /* ── Main ── */
  .bk-main { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; padding: 64px 56px 100px; }

  .bk-breadcrumb {
    font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--gold); opacity: 0.8; margin-bottom: 32px;
    display: flex; align-items: center; gap: 14px;
  }
  .bk-breadcrumb::before { content: ''; display: block; width: 32px; height: 1px; background: var(--gold); opacity: 0.6; }

  .bk-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 50px); font-weight: 300; color: var(--cream); line-height: 1.05; margin-bottom: 8px; }
  .bk-subtitle { font-size: 12px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; margin-bottom: 48px; }

  /* ── Layout ── */
  .bk-layout { display: grid; grid-template-columns: 1fr 340px; gap: 40px; align-items: start; }

  /* ── Form Panel ── */
  .bk-panel {
    background: rgba(17,17,24,0.85); backdrop-filter: blur(10px);
    border: 1px solid var(--border); padding: 40px 44px; position: relative;
  }
  .bk-panel::before { content: ''; position: absolute; top: 0; left: 0; width: 80px; height: 1px; background: var(--gold); }
  .bk-panel-title { font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase; color: var(--gold); opacity: 0.8; margin-bottom: 28px; }

  .bk-field { margin-bottom: 22px; }
  .bk-label { font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.65; margin-bottom: 8px; display: block; }
  .bk-input {
    width: 100%; background: rgba(10,10,10,0.7); border: 1px solid var(--border);
    color: var(--cream); font-family: 'Raleway', sans-serif;
    font-size: 13px; font-weight: 200; padding: 11px 14px;
    outline: none; transition: border-color 0.2s; -webkit-appearance: none; appearance: none;
  }
  .bk-input:focus { border-color: var(--gold-line); }
  .bk-input.error { border-color: var(--red); }
  .bk-select {
    width: 100%; background: rgba(10,10,10,0.7); border: 1px solid var(--border);
    color: var(--cream); font-family: 'Raleway', sans-serif;
    font-size: 13px; font-weight: 200; padding: 11px 14px;
    outline: none; cursor: pointer; transition: border-color 0.2s; -webkit-appearance: none; appearance: none;
  }
  .bk-select:focus { border-color: var(--gold-line); }
  .bk-select.error { border-color: var(--red); }
  .bk-field-err { font-size: 9px; color: var(--red); margin-top: 5px; letter-spacing: 0.04em; }

  /* ── Multiplier badges ── */
  .bk-mult-row {
    display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; margin-bottom: 4px;
  }
  .bk-mult-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 9px; font-weight: 300; letter-spacing: 0.1em;
    padding: 5px 11px; border: 1px solid var(--gold-line);
    color: var(--gold-light); background: var(--gold-dim);
  }
  .bk-mult-badge .diamond { font-size: 6px; color: var(--gold); }
  .bk-mult-badge.neutral { border-color: var(--border); color: var(--muted); background: transparent; }

  /* ── Guest tier pills ── */
  .bk-tier-pills { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
  .bk-tier-pill {
    font-size: 9px; font-weight: 300; letter-spacing: 0.1em;
    padding: 4px 10px; border: 1px solid var(--border); color: var(--muted);
    background: transparent; transition: all 0.2s;
  }
  .bk-tier-pill.active { border-color: var(--gold-line); color: var(--gold-light); background: var(--gold-dim); }

  .bk-divider { width: 100%; height: 1px; background: var(--border); margin: 28px 0; position: relative; }
  .bk-divider::before {
    content: '◆'; position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
    font-size: 7px; color: var(--gold); background: var(--obsidian); padding: 0 10px;
  }

  /* ── Sidebar / Summary ── */
  .bk-summary { display: flex; flex-direction: column; gap: 0; }
  .bk-summary-box {
    border: 1px solid var(--border); background: rgba(17,17,24,0.85);
    backdrop-filter: blur(10px); overflow: hidden; margin-bottom: 20px; position: relative;
  }
  .bk-summary-box::before { content: ''; position: absolute; top: 0; left: 0; width: 60px; height: 1px; background: var(--gold); }
  .bk-summary-head {
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.8;
  }
  .bk-summary-row { padding: 12px 20px; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; border-bottom: 1px solid rgba(200,169,81,0.08); }
  .bk-summary-row:last-child { border-bottom: none; }
  .bk-summary-row-label { font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.04em; }
  .bk-summary-row-val { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 300; color: var(--cream); text-align: right; flex-shrink: 0; max-width: 55%; word-break: break-word; }
  .bk-summary-row-val.gold { color: var(--gold-light); }

  .bk-total-box { border: 1px solid var(--gold-line); background: var(--gold-dim); overflow: hidden; margin-bottom: 20px; }
  .bk-total-head { padding: 10px 20px; border-bottom: 1px solid var(--gold-line); font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); }
  .bk-total-row { padding: 8px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(200,169,81,0.08); }
  .bk-total-row:last-of-type { border-bottom: none; }
  .bk-total-row-label { font-size: 10px; font-weight: 200; color: var(--muted); }
  .bk-total-row-val { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 300; color: var(--cream); }
  .bk-total-row-val.strikethrough { text-decoration: line-through; opacity: 0.45; font-size: 13px; }
  .bk-grand-row { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--gold-line); }
  .bk-grand-label { font-size: 9px; font-weight: 300; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); }
  .bk-grand-val { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 300; color: var(--gold-light); transition: color 0.3s; }

  /* ── Multiplier explainer inside summary ── */
  .bk-mult-explain {
    padding: 10px 20px; border-top: 1px solid rgba(200,169,81,0.08);
    display: flex; flex-direction: column; gap: 4px;
  }
  .bk-mult-explain-row { display: flex; justify-content: space-between; align-items: center; }
  .bk-mult-explain-label { font-size: 9px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }
  .bk-mult-explain-val { font-size: 10px; font-weight: 300; color: var(--gold-light); letter-spacing: 0.06em; }

  /* ── Submit ── */
  .bk-submit {
    width: 100%; padding: 16px; background: transparent; border: 1px solid var(--gold);
    color: var(--gold); font-family: 'Cinzel', serif; font-size: 10px; font-weight: 400;
    letter-spacing: 0.32em; text-transform: uppercase;
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.35s; margin-bottom: 12px;
  }
  .bk-submit::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .bk-submit:hover:not(:disabled)::before { transform: scaleX(1); }
  .bk-submit:hover:not(:disabled) { color: var(--black); }
  .bk-submit span { position: relative; z-index: 1; }
  .bk-submit:disabled { opacity: 0.4; cursor: not-allowed; }
  .bk-submit-note { text-align: center; font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.08em; }

  .bk-global-err { font-size: 11px; font-weight: 200; color: var(--red); letter-spacing: 0.04em; padding: 12px 16px; border: 1px solid rgba(224,128,128,0.3); background: rgba(224,128,128,0.06); margin-bottom: 16px; }

  /* ── Success overlay ── */
  .bk-success-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.82); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .bk-success-box {
    background: #111118; border: 1px solid var(--gold-line);
    padding: 52px 48px; max-width: 460px; width: 100%; text-align: center; position: relative;
  }
  .bk-success-box::before { content: ''; position: absolute; top: 0; left: 0; width: 80px; height: 1px; background: var(--gold); }
  .bk-success-box::after  { content: ''; position: absolute; bottom: 0; right: 0; width: 80px; height: 1px; background: var(--gold); }
  .bk-success-icon { font-size: 42px; margin-bottom: 20px; }
  .bk-success-title { font-family: 'Cormorant Garamond', serif; font-size: 34px; font-weight: 300; color: var(--cream); margin-bottom: 12px; }
  .bk-success-sub { font-size: 12px; font-weight: 200; color: var(--muted); margin-bottom: 10px; line-height: 1.7; letter-spacing: 0.04em; }
  .bk-success-id { font-family: 'Cormorant Garamond', serif; font-size: 13px; color: var(--gold); opacity: 0.7; margin-bottom: 32px; letter-spacing: 0.08em; }
  .bk-success-btn {
    display: inline-block; padding: 13px 36px; border: 1px solid var(--gold);
    background: transparent; color: var(--gold);
    font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
  }
  .bk-success-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .bk-success-btn:hover::before { transform: scaleX(1); }
  .bk-success-btn:hover { color: var(--black); }
  .bk-success-btn span { position: relative; z-index: 1; }

  /* ── Footer ── */
  .bk-footer {
    position: relative; z-index: 1; border-top: 1px solid var(--border); padding: 32px 56px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(17,17,24,0.6); backdrop-filter: blur(8px);
  }
  .bk-footer-copy { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }
  .bk-footer-copy span { color: var(--gold); }

  /* ── Payment Method Cards ── */
  .bk-method-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .bk-method-card {
    border: 1px solid var(--border); padding: 18px 16px;
    background: rgba(10,10,10,0.5); cursor: pointer;
    transition: border-color 0.25s, background 0.25s;
    display: flex; flex-direction: column; align-items: center; gap: 10px; position: relative;
  }
  .bk-method-card:hover { border-color: var(--gold-line); background: var(--gold-dim); }
  .bk-method-card.selected { border-color: var(--gold); background: var(--gold-dim); }
  .bk-method-card.selected::before { content: '✔'; position: absolute; top: 8px; right: 10px; font-size: 9px; color: var(--gold); }
  .bk-method-icon { font-size: 26px; line-height: 1; }
  .bk-method-label { font-family: 'Cinzel', serif; font-size: 8px; font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase; color: var(--cream); text-align: center; }
  .bk-method-sub { font-size: 9px; font-weight: 200; color: var(--muted); text-align: center; letter-spacing: 0.04em; }

  /* ── Card details sub-form ── */
  .bk-card-fields { display: flex; flex-direction: column; gap: 14px; margin-top: 4px; }
  .bk-card-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* ── Deposit slider ── */
  .bk-deposit-slider {
    -webkit-appearance: none; appearance: none;
    width: 100%; height: 3px;
    background: linear-gradient(to right, var(--gold) 0%, var(--gold) var(--pct, 25%), rgba(200,169,81,0.2) var(--pct, 25%), rgba(200,169,81,0.2) 100%);
    outline: none; cursor: pointer; border: none;
  }
  .bk-deposit-slider::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 16px; height: 16px;
    background: var(--gold); border: 2px solid var(--black); transform: rotate(45deg); cursor: pointer;
  }
  .bk-deposit-slider::-moz-range-thumb {
    width: 14px; height: 14px;
    background: var(--gold); border: 2px solid var(--black); transform: rotate(45deg); cursor: pointer; border-radius: 0;
  }
  .bk-deposit-badges { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
  .bk-deposit-badge {
    font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.18em;
    padding: 5px 12px; border: 1px solid var(--border);
    background: transparent; color: var(--muted); cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .bk-deposit-badge:hover { border-color: var(--gold-line); color: var(--gold-light); }
  .bk-deposit-badge.active { border-color: var(--gold); color: var(--gold-light); background: var(--gold-dim); }

  /* ── Screenshot upload ── */
  .bk-upload-zone {
    border: 1px dashed var(--gold-line); padding: 24px 20px;
    text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s;
    background: rgba(10,10,10,0.4); position: relative; overflow: hidden;
  }
  .bk-upload-zone:hover { border-color: var(--gold); background: var(--gold-dim); }
  .bk-upload-zone.has-file { border-color: var(--gold); background: var(--gold-dim); border-style: solid; }
  .bk-upload-zone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .bk-upload-icon { font-size: 22px; color: var(--gold); opacity: 0.7; margin-bottom: 8px; }
  .bk-upload-label { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }
  .bk-upload-label strong { color: var(--gold-light); font-weight: 300; }
  .bk-upload-preview { width: 100%; max-height: 180px; object-fit: contain; margin-top: 12px; border: 1px solid var(--border); display: block; }
  .bk-upload-change { font-size: 9px; color: var(--gold); opacity: 0.7; margin-top: 6px; letter-spacing: 0.06em; cursor: pointer; }

  @media (max-width: 860px) {
    .bk-layout { grid-template-columns: 1fr; }
    .bk-topbar { padding: 18px 24px; }
    .bk-main { padding: 40px 24px 60px; }
    .bk-panel { padding: 28px 24px; }
    .bk-footer { padding: 24px; flex-direction: column; gap: 12px; text-align: center; }
    .bk-method-grid { grid-template-columns: 1fr 1fr; }
    .bk-card-row { grid-template-columns: 1fr; }
  }

  .goog-te-banner-frame, .goog-te-banner-frame.skiptranslate, body > .skiptranslate {
    display: none !important; visibility: hidden !important; height: 0 !important;
  }
  body { top: 0 !important; position: static !important; }
`;

/* ─────────────────────────────────────────────
   Pricing helpers — mirrors pricingUtils.js.
   Both multipliers are read from venue data;
   nothing is hardcoded here.
───────────────────────────────────────────── */

// Accepts venue.guestTierPricing (array from DB) + guest count
const getGuestTier = (guestTierPricing, guests) => {
  const n = Number(guests) || 0;
  const tiers = [...(guestTierPricing || [])].sort((a, b) => a.min - b.min);
  return (
    tiers.find((t) => n >= t.min && n <= t.max) ||
    tiers[tiers.length - 1] || { multiplier: 1.0, label: "" }
  );
};

const getEventTypeMultiplier = (eventTypePricing, eventType) => {
  if (!eventTypePricing || !eventType) return 1.0;
  return Number(eventTypePricing[eventType]) || 1.0;
};

// Mongoose Maps serialise to plain objects over JSON — normalise either form
const normalisePricingMap = (raw) => {
  if (!raw) return {};
  if (raw instanceof Map) return Object.fromEntries(raw);
  return raw;
};

// Human-readable labels shown in the <select>
const EVENT_TYPE_LABELS = {
  wedding: "Wedding",
  engagement: "Engagement",
  anniversary: "Anniversary",
  birthday: "Birthday Party",
  graduation: "Graduation",
  prom: "Prom",
  gala: "Gala / Fundraiser",
  concert: "Concert",
  corporate: "Corporate Event",
  conference: "Conference",
  exhibition: "Exhibition",
  business: "Business Meeting",

  baby_shower: "Baby Shower",
  bridal_shower: "Bridal Shower",
  fashion_show: "Fashion Show",
  festival: "Festival",
  charity: "Charity Event",
  networking: "Networking Event",
  seminar: "Seminar",
  workshop: "Workshop",
  product_launch: "Product Launch",
  award_ceremony: "Award Ceremony",
  photoshoot: "Photoshoot",
  private_party: "Private Party",
  retirement: "Retirement Party",
  reunion: "Reunion",
  sports_event: "Sports Event",
  cultural_event: "Cultural Event",
  religious_event: "Religious Event",
  holiday_party: "Holiday Party",
  music_festival: "Music Festival",
  gaming_event: "Gaming Event",
  vip_event: "VIP Event",
  cocktail_party: "Cocktail Party",
  dinner_party: "Dinner Party",
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
function BookingPage() {
  const { id: venueId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedServices = [],
    selectedServiceObjects = [],
    hours = 4,
    eventDate: passedDate = "",
    inviteEmails = [],
    venue = null,
  } = location.state || {};

  // Form fields
  const [eventType, setEventType] = useState("");
  const [guestCount, setGuestCount] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("");
  const [depositPct, setDepositPct] = useState(25);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [ewalletProvider, setEwalletProvider] = useState("");
  const [ewalletPhone, setEwalletPhone] = useState("");
  const [instaPayPhone, setInstaPayPhone] = useState("");

  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [screenshotErr, setScreenshotErr] = useState("");

  const [errors, setErrors] = useState({});
  const [globalErr, setGlobalErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!venue) navigate(-1);
  }, [venue, navigate]);

  /* ── Pricing (live, mirrors pricingUtils.js) ── */
  const pricingMap = useMemo(
    () => normalisePricingMap(venue?.eventTypePricing),
    [venue],
  );

  const pricing = useMemo(() => {
    const pricePerHour = (venue?.pricePerHour || 0) * 10;
    const baseCost = hours * pricePerHour;
    const eventMultiplier = getEventTypeMultiplier(pricingMap, eventType);
    const guestTier = getGuestTier(venue?.guestTierPricing, guestCount);
    const guestMultiplier = guestTier.multiplier;
    const adjustedVenueCost = Math.round(
      baseCost * eventMultiplier * guestMultiplier,
    );
    const servicesTotal = selectedServiceObjects.reduce(
      (s, sv) => s + (sv.price || 0),
      0,
    );
    const total = adjustedVenueCost + servicesTotal;
    const depositAmount = Math.round((total * depositPct) / 100);
    const remaining = total - depositAmount;

    return {
      pricePerHour,
      baseCost,
      eventMultiplier,
      guestMultiplier,
      guestTierLabel: guestTier.label,
      adjustedVenueCost,
      servicesTotal,
      total,
      depositAmount,
      remaining,
    };
  }, [
    venue,
    hours,
    eventType,
    guestCount,
    depositPct,
    selectedServiceObjects,
    pricingMap,
  ]);

  if (!venue) return null;

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    if (!eventType) errs.eventType = "Please select an event type.";
    if (!guestCount || isNaN(guestCount) || Number(guestCount) < 1)
      errs.guestCount = "Please enter a valid guest count.";
    if (venue && Number(guestCount) > venue.capacity)
      errs.guestCount = `Exceeds venue capacity of ${venue.capacity?.toLocaleString()} guests.`;
    if (!passedDate)
      errs.eventDate = "No event date selected. Go back and pick a date.";
    if (!paymentMethod) errs.paymentMethod = "Please select a deposit method.";
    if (paymentMethod === "credit_card" || paymentMethod === "debit_card") {
      if (
        !cardNumber.replace(/\s/g, "") ||
        cardNumber.replace(/\s/g, "").length < 16
      )
        errs.cardNumber = "Enter a valid 16-digit card number.";
      if (!cardName.trim()) errs.cardName = "Enter the cardholder name.";
      if (!cardExpiry.trim()) errs.cardExpiry = "Enter expiry date.";
      if (!cardCvv.trim() || cardCvv.length < 3)
        errs.cardCvv = "Enter a valid CVV.";
    }
    if (paymentMethod === "ewallet") {
      if (!ewalletProvider) errs.ewalletProvider = "Select a wallet provider.";
      if (!ewalletPhone.trim()) {
        errs.ewalletPhone = "Enter your registered phone number.";
      } else {
        const phone = ewalletPhone.replace(/\s/g, "");
        const providerPrefixes = {
          vodafone_cash: ["010"],
          orange_money: ["012"],
          etisalat_cash: ["011"],
          we_pay: ["015"],
        };
        const allowedPrefixes = providerPrefixes[ewalletProvider] || [];
        if (phone.length !== 11) {
          errs.ewalletPhone = "Phone number must be exactly 11 digits.";
        } else if (
          allowedPrefixes.length &&
          !allowedPrefixes.some((p) => phone.startsWith(p))
        ) {
          const prefixLabel = allowedPrefixes[0];
          errs.ewalletPhone = `${ewalletProvider.replace(/_/g, " ")} numbers must start with ${prefixLabel}.`;
        }
      }
      if (!screenshot) errs.screenshot = "Please upload a payment screenshot.";
    }

    if (paymentMethod === "instapay") {
      if (!instaPayPhone.trim()) {
        errs.instaPayPhone = "Enter your InstaPay phone number.";
      } else {
        const phone = instaPayPhone.replace(/\s/g, "");
        if (phone.length !== 11) {
          errs.instaPayPhone = "Phone number must be exactly 11 digits.";
        } else if (
          !["010", "011", "012", "015"].some((p) => phone.startsWith(p))
        ) {
          errs.instaPayPhone =
            "Enter a valid Egyptian phone number (010, 011, 012, or 015).";
        }
      }
      if (!screenshot) errs.screenshot = "Please upload a payment screenshot.";
    }

    return errs;
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setScreenshotErr("Please upload an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setScreenshotErr("Image must be under 5MB.");
      return;
    }
    setScreenshot(file);
    setScreenshotErr("");
    const reader = new FileReader();
    reader.onload = (ev) => setScreenshotPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    setGlobalErr("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("venue", venueId);
      formData.append("eventType", eventType);
      formData.append("guestCount", Number(guestCount));
      formData.append("eventDate", passedDate);
      formData.append("hours", hours);
      formData.append("services", JSON.stringify(selectedServices));
      formData.append("invites", JSON.stringify(inviteEmails));
      formData.append("paymentMethod", paymentMethod);
      formData.append("depositPct", depositPct);
      if (screenshot) formData.append("screenshot", screenshot);

      const res = await API.post("/bookings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBooking(res.data);
    } catch (err) {
      setGlobalErr(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ─────────────────────────────────────────
     Success Overlay
  ───────────────────────────────────────── */
  if (booking) {
    return (
      <>
        <style>{style}</style>
        <div className="bk-success-overlay">
          <div className="bk-success-box">
            <div className="bk-success-icon">✦</div>
            <div className="bk-success-title">Booking Confirmed</div>
            <p className="bk-success-sub">
              Your reservation at{" "}
              <strong style={{ color: "var(--cream)" }}>{venue?.name}</strong>{" "}
              has been received. We'll be in touch shortly to confirm the
              details.
            </p>
            {inviteEmails.length > 0 && (
              <p className="bk-success-sub" style={{ marginTop: 4 }}>
                Invitations will be sent to {inviteEmails.length} guest
                {inviteEmails.length > 1 ? "s" : ""}.
              </p>
            )}
            <p className="bk-success-id">Booking ID: {booking._id}</p>
            <button className="bk-success-btn" onClick={() => navigate("/")}>
              <span>Back to Venues</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ─────────────────────────────────────────
     Main render
  ───────────────────────────────────────── */
  const showEventMultiplier = eventType && pricing.eventMultiplier !== 1.0;
  const showGuestMultiplier =
    Number(guestCount) > 0 && pricing.guestMultiplier !== 1.0;

  return (
    <>
      <style>{style}</style>
      <div className="bk-root">
        {/* Topbar */}
        <nav className="bk-topbar">
          <div className="bk-logo" onClick={() => navigate("/")}>
            <div className="bk-logo-mark" />
            <div className="bk-logo-text" translate="no">
              Event<span>y</span>
            </div>
          </div>
          <button className="bk-back-btn" onClick={() => navigate(-1)}>
            <span>←</span>
            <span>Back to Venue</span>
          </button>
        </nav>

        <main className="bk-main">
          <p className="bk-breadcrumb">Reserve a Venue</p>
          <h1 className="bk-title">Complete Your Reservation</h1>
          <p className="bk-subtitle">
            {venue
              ? `${venue.name} — ${venue.location}`
              : "Confirm the details below to secure your booking."}
          </p>

          <div className="bk-layout">
            {/* ── Left: Form ── */}
            <div>
              <div className="bk-panel">
                <p className="bk-panel-title">◆ Event Details</p>

                {globalErr && <div className="bk-global-err">{globalErr}</div>}

                {/* Event Type */}
                <div className="bk-field">
                  <label className="bk-label">Event Type *</label>
                  <select
                    className={`bk-select${errors.eventType ? " error" : ""}`}
                    value={eventType}
                    onChange={(e) => {
                      setEventType(e.target.value);
                      setErrors((p) => ({ ...p, eventType: undefined }));
                    }}
                  >
                    <option value="">— Select event type —</option>
                    {Object.entries(pricingMap).map(([t, mult]) => {
                      const label = EVENT_TYPE_LABELS[t] || t;
                      return (
                        <option key={t} value={t}>
                          {Number(mult) !== 1.0
                            ? `${label}  (×${mult})`
                            : label}
                        </option>
                      );
                    })}
                  </select>
                  {errors.eventType && (
                    <p className="bk-field-err">{errors.eventType}</p>
                  )}

                  {/* Multiplier badge — shown once type is selected */}
                  {eventType && (
                    <div className="bk-mult-row">
                      <span
                        className={`bk-mult-badge${pricing.eventMultiplier === 1.0 ? " neutral" : ""}`}
                      >
                        <span className="diamond">◆</span>
                        {EVENT_TYPE_LABELS[eventType] || eventType} —{" "}
                        {pricing.eventMultiplier === 1.0
                          ? "Base rate (×1.0)"
                          : `×${pricing.eventMultiplier} pricing applied`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Guest Count */}
                <div className="bk-field">
                  <label className="bk-label">Number of Guests *</label>
                  <input
                    className={`bk-input${errors.guestCount ? " error" : ""}`}
                    type="number"
                    min="1"
                    max={venue?.capacity}
                    placeholder={`Up to ${venue?.capacity?.toLocaleString() ?? "—"} guests`}
                    value={guestCount}
                    onChange={(e) => {
                      setGuestCount(e.target.value);
                      setErrors((p) => ({ ...p, guestCount: undefined }));
                    }}
                  />
                  {errors.guestCount && (
                    <p className="bk-field-err">{errors.guestCount}</p>
                  )}

                  {/* Guest tier pills — from venue.guestTierPricing */}
                  <div className="bk-tier-pills">
                    {[...(venue?.guestTierPricing || [])]
                      .sort((a, b) => a.min - b.min)
                      .map((tier) => {
                        const active =
                          Number(guestCount) >= tier.min &&
                          Number(guestCount) <= tier.max;
                        return (
                          <span
                            key={tier.label}
                            className={`bk-tier-pill${active ? " active" : ""}`}
                          >
                            {tier.label} — ×{tier.multiplier}
                          </span>
                        );
                      })}
                  </div>
                </div>

                <div className="bk-divider" />

                {/* Read-only booking parameters */}
                <p className="bk-panel-title" style={{ marginBottom: 20 }}>
                  ◆ Booking Parameters
                </p>

                <div className="bk-field">
                  <label className="bk-label">Event Date</label>
                  <input
                    className="bk-input"
                    type="date"
                    value={passedDate}
                    readOnly
                    style={{ opacity: 0.7, cursor: "not-allowed" }}
                  />
                  {errors.eventDate && (
                    <p className="bk-field-err">{errors.eventDate}</p>
                  )}
                </div>

                <div className="bk-field">
                  <label className="bk-label">Duration</label>
                  <input
                    className="bk-input"
                    value={`${hours} hour${hours !== 1 ? "s" : ""}`}
                    readOnly
                    style={{ opacity: 0.7, cursor: "not-allowed" }}
                  />
                </div>

                {inviteEmails.length > 0 && (
                  <div className="bk-field">
                    <label className="bk-label">
                      Invitation Recipients ({inviteEmails.length})
                    </label>
                    <div
                      style={{
                        border: "1px solid var(--border)",
                        background: "rgba(10,10,10,0.5)",
                      }}
                    >
                      {inviteEmails.map((email) => (
                        <div
                          key={email}
                          style={{
                            padding: "9px 14px",
                            fontSize: 12,
                            fontWeight: 200,
                            color: "var(--cream)",
                            borderBottom: "1px solid rgba(200,169,81,0.08)",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span style={{ color: "var(--gold)", fontSize: 10 }}>
                            ✉
                          </span>
                          {email}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedServiceObjects.length > 0 && (
                  <div className="bk-field">
                    <label className="bk-label">
                      Selected Services ({selectedServiceObjects.length})
                    </label>
                    <div
                      style={{
                        border: "1px solid var(--border)",
                        background: "rgba(10,10,10,0.5)",
                      }}
                    >
                      {selectedServiceObjects.map((svc) => (
                        <div
                          key={svc._id}
                          style={{
                            padding: "9px 14px",
                            fontSize: 12,
                            fontWeight: 200,
                            color: "var(--cream)",
                            borderBottom: "1px solid rgba(200,169,81,0.08)",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>{svc.name}</span>
                          <span
                            style={{
                              color: "var(--gold-light)",
                              fontFamily: "Cormorant Garamond",
                              fontSize: 14,
                            }}
                          >
                            ${svc.price?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bk-divider" />

                {/* ── Deposit Amount ── */}
                <p className="bk-panel-title" style={{ marginBottom: 20 }}>
                  ◆ Deposit Amount
                </p>
                <div className="bk-field" style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 12,
                    }}
                  >
                    <label className="bk-label" style={{ marginBottom: 0 }}>
                      Deposit — {depositPct}% of total
                    </label>
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 22,
                        color: "var(--gold-light)",
                        fontWeight: 300,
                      }}
                    >
                      ${pricing.depositAmount.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="bk-deposit-slider"
                    min={25}
                    max={100}
                    step={5}
                    value={depositPct}
                    style={{ "--pct": `${depositPct}%` }}
                    onChange={(e) => setDepositPct(Number(e.target.value))}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 6,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        color: "var(--muted)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Min 25%
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        color: "var(--muted)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Full 100%
                    </span>
                  </div>
                  <div className="bk-deposit-badges">
                    {[25, 50, 75, 100].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`bk-deposit-badge${depositPct === p ? " active" : ""}`}
                        onClick={() => setDepositPct(p)}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    border: "1px solid var(--border)",
                    background: "rgba(10,10,10,0.4)",
                    marginBottom: 24,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 200,
                      color: "var(--muted)",
                    }}
                  >
                    Remaining after deposit
                  </span>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 15,
                      color: "var(--cream)",
                    }}
                  >
                    ${pricing.remaining.toLocaleString()}
                  </span>
                </div>

                {/* ── Deposit Method ── */}
                <p className="bk-panel-title" style={{ marginBottom: 20 }}>
                  ◆ Deposit Method
                </p>
                <div className="bk-method-grid">
                  {[
                    {
                      value: "ewallet",
                      icon: "◆",
                      label: "E-Wallet",
                      sub: "Vodafone / Orange / Etisalat / WE",
                    },
                    {
                      value: "instapay",
                      icon: "◆",
                      label: "InstaPay",
                      sub: "Instant bank transfer",
                    },
                  ].map((m) => (
                    <div
                      key={m.value}
                      className={`bk-method-card${paymentMethod === m.value ? " selected" : ""}`}
                      onClick={() => {
                        setPaymentMethod(m.value);
                        setScreenshot(null);
                        setScreenshotPreview("");
                        setScreenshotErr("");
                        setErrors((p) => ({ ...p, paymentMethod: undefined }));
                      }}
                    >
                      <span className="bk-method-icon">{m.icon}</span>
                      <span className="bk-method-label">{m.label}</span>
                      <span className="bk-method-sub">{m.sub}</span>
                    </div>
                  ))}
                </div>
                {errors.paymentMethod && (
                  <p
                    className="bk-field-err"
                    style={{ marginTop: -16, marginBottom: 16 }}
                  >
                    {errors.paymentMethod}
                  </p>
                )}

                {/* E-Wallet fields */}
                {paymentMethod === "ewallet" && (
                  <div className="bk-card-fields">
                    <div className="bk-field" style={{ marginBottom: 0 }}>
                      <label className="bk-label">Wallet Provider *</label>
                      <select
                        className={`bk-select${errors.ewalletProvider ? " error" : ""}`}
                        value={ewalletProvider}
                        onChange={(e) => {
                          setEwalletProvider(e.target.value);
                          setErrors((p) => ({
                            ...p,
                            ewalletProvider: undefined,
                          }));
                        }}
                      >
                        <option value="">— Select provider —</option>
                        <option value="vodafone_cash">Vodafone Cash</option>
                        <option value="orange_money">Orange Money</option>
                        <option value="etisalat_cash">Etisalat Cash</option>
                        <option value="we_pay">WE Pay</option>
                      </select>
                      {errors.ewalletProvider && (
                        <p className="bk-field-err">{errors.ewalletProvider}</p>
                      )}
                    </div>
                    <div
                      style={{
                        border: "1px solid var(--border)",
                        background: "rgba(10,10,10,0.5)",
                        padding: "16px 20px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 300,
                          letterSpacing: "0.35em",
                          textTransform: "uppercase",
                          color: "var(--gold)",
                          opacity: 0.7,
                          marginBottom: 10,
                        }}
                      >
                        Transfer to our account
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        {[
                          { label: "Vodafone Cash", number: "01012540983" },
                          { label: "Orange Money", number: "01012540983" },
                          { label: "Etisalat Cash", number: "01012540983" },
                          { label: "WE Pay", number: "01012540983" },
                        ].map((w) => (
                          <div
                            key={w.label}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "6px 0",
                              borderBottom: "1px solid rgba(200,169,81,0.08)",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 200,
                                color: "var(--muted)",
                              }}
                            >
                              {w.label}
                            </span>
                            <span
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: 15,
                                color: "var(--cream)",
                              }}
                            >
                              {w.number}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 200,
                          color: "var(--muted)",
                          marginTop: 10,
                          lineHeight: 1.6,
                          letterSpacing: "0.03em",
                        }}
                      >
                        Transfer the deposit amount then upload your screenshot
                        below.
                      </p>
                    </div>
                    <div className="bk-field" style={{ marginBottom: 0 }}>
                      <label className="bk-label">
                        Registered Phone Number *
                      </label>
                      <input
                        className={`bk-input${errors.ewalletPhone ? " error" : ""}`}
                        placeholder="01X XXXX XXXX"
                        value={ewalletPhone}
                        maxLength={11}
                        onChange={(e) => {
                          const val = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 11);
                          setEwalletPhone(val);
                          setErrors((p) => ({ ...p, ewalletPhone: undefined }));
                        }}
                      />
                      {errors.ewalletPhone && (
                        <p className="bk-field-err">{errors.ewalletPhone}</p>
                      )}
                    </div>
                    <div className="bk-field" style={{ marginBottom: 0 }}>
                      <label className="bk-label">Payment Screenshot *</label>
                      <div
                        className={`bk-upload-zone${screenshotPreview ? " has-file" : ""}`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                        />
                        {!screenshotPreview ? (
                          <>
                            <div className="bk-upload-icon">⬆</div>
                            <div className="bk-upload-label">
                              <strong>Click to upload</strong> or drag & drop
                              <br />
                              PNG, JPG, WEBP — max 5MB
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              className="bk-upload-preview"
                              src={screenshotPreview}
                              alt="Payment screenshot preview"
                            />
                            <div className="bk-upload-change">
                              Click to change image
                            </div>
                          </>
                        )}
                      </div>
                      {screenshotErr && (
                        <p className="bk-field-err">{screenshotErr}</p>
                      )}
                      {errors.screenshot && (
                        <p className="bk-field-err">{errors.screenshot}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* InstaPay fields */}
                {/* InstaPay fields */}
                {paymentMethod === "instapay" && (
                  <div className="bk-card-fields">
                    <div className="bk-field" style={{ marginBottom: 0 }}>
                      <label className="bk-label">
                        InstaPay Phone / Account *
                      </label>
                      <input
                        className={`bk-input${errors.instaPayPhone ? " error" : ""}`}
                        placeholder="01X XXXX XXXX"
                        value={instaPayPhone}
                        maxLength={11}
                        onChange={(e) => {
                          const val = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 11);
                          setInstaPayPhone(val);
                          setErrors((p) => ({
                            ...p,
                            instaPayPhone: undefined,
                          }));
                        }}
                      />
                      {errors.instaPayPhone && (
                        <p className="bk-field-err">{errors.instaPayPhone}</p>
                      )}
                    </div>
                    {/* InstaPay QR + account info */}
                    <div
                      style={{
                        border: "1px solid var(--border)",
                        background: "rgba(10,10,10,0.5)",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <img
                        src="/instapay-qr.png"
                        alt="InstaPay QR Code"
                        style={{
                          width: 160,
                          height: 160,
                          display: "block",
                          border: "4px solid #fff",
                        }}
                      />
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: 9,
                            letterSpacing: "0.28em",
                            color: "var(--gold)",
                            opacity: 0.7,
                            marginBottom: 6,
                            textTransform: "uppercase",
                          }}
                        >
                          InstaPay Account
                        </div>
                        <div
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 16,
                            color: "var(--cream)",
                            marginBottom: 4,
                          }}
                        >
                          salah.elsherif-9532@instapay
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 200,
                            color: "var(--muted)",
                            letterSpacing: "0.06em",
                          }}
                        >
                          01012540983
                        </div>
                      </div>
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 200,
                          color: "var(--muted)",
                          lineHeight: 1.6,
                          letterSpacing: "0.03em",
                          textAlign: "center",
                          marginTop: 4,
                        }}
                      >
                        Scan the QR code or transfer manually to the account
                        above, then upload your payment screenshot below.
                      </p>
                    </div>

                    <div className="bk-field" style={{ marginBottom: 0 }}>
                      <label className="bk-label">Payment Screenshot *</label>
                      <div
                        className={`bk-upload-zone${screenshotPreview ? " has-file" : ""}`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                        />
                        {!screenshotPreview ? (
                          <>
                            <div className="bk-upload-icon">⬆</div>
                            <div className="bk-upload-label">
                              <strong>Click to upload</strong> or drag & drop
                              <br />
                              PNG, JPG, WEBP — max 5MB
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              className="bk-upload-preview"
                              src={screenshotPreview}
                              alt="Payment screenshot preview"
                            />
                            <div className="bk-upload-change">
                              Click to change image
                            </div>
                          </>
                        )}
                      </div>
                      {screenshotErr && (
                        <p className="bk-field-err">{screenshotErr}</p>
                      )}
                      {errors.screenshot && (
                        <p className="bk-field-err">{errors.screenshot}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Summary + CTA ── */}
            <div className="bk-summary">
              {/* Venue snapshot */}
              <div className="bk-summary-box">
                <div className="bk-summary-head">Venue</div>
                <div className="bk-summary-row">
                  <span className="bk-summary-row-label">Name</span>
                  <span className="bk-summary-row-val">{venue?.name}</span>
                </div>
                <div className="bk-summary-row">
                  <span className="bk-summary-row-label">Location</span>
                  <span className="bk-summary-row-val">{venue?.location}</span>
                </div>
                <div className="bk-summary-row">
                  <span className="bk-summary-row-label">Capacity</span>
                  <span className="bk-summary-row-val">
                    {venue?.capacity?.toLocaleString()} guests
                  </span>
                </div>
                <div className="bk-summary-row">
                  <span className="bk-summary-row-label">Base rate</span>
                  <span className="bk-summary-row-val gold">
                    ${pricing.pricePerHour.toLocaleString()} / hr
                  </span>
                </div>
              </div>

              {/* Grand total breakdown */}
              <div className="bk-total-box">
                <div className="bk-total-head">◆ Cost Breakdown</div>

                {/* Base venue cost */}
                <div className="bk-total-row">
                  <span className="bk-total-row-label">
                    Venue ({hours}h × ${pricing.pricePerHour.toLocaleString()})
                  </span>
                  <span
                    className={`bk-total-row-val${showEventMultiplier || showGuestMultiplier ? " strikethrough" : ""}`}
                  >
                    ${pricing.baseCost.toLocaleString()}
                  </span>
                </div>

                {/* Multiplier rows — only shown when > 1 */}
                {(showEventMultiplier || showGuestMultiplier) && (
                  <div className="bk-mult-explain">
                    {showEventMultiplier && (
                      <div className="bk-mult-explain-row">
                        <span className="bk-mult-explain-label">
                          Event type (
                          {EVENT_TYPE_LABELS[eventType] || eventType})
                        </span>
                        <span className="bk-mult-explain-val">
                          ×{pricing.eventMultiplier}
                        </span>
                      </div>
                    )}
                    {showGuestMultiplier && (
                      <div className="bk-mult-explain-row">
                        <span className="bk-mult-explain-label">
                          Guests ({pricing.guestTierLabel})
                        </span>
                        <span className="bk-mult-explain-val">
                          ×{pricing.guestMultiplier}
                        </span>
                      </div>
                    )}
                    <div
                      className="bk-mult-explain-row"
                      style={{
                        marginTop: 4,
                        paddingTop: 6,
                        borderTop: "1px solid rgba(200,169,81,0.15)",
                      }}
                    >
                      <span className="bk-mult-explain-label">
                        Adjusted venue cost
                      </span>
                      <span
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 15,
                          color: "var(--gold-light)",
                        }}
                      >
                        ${pricing.adjustedVenueCost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Services */}
                {selectedServiceObjects.map((svc) => (
                  <div className="bk-total-row" key={svc._id}>
                    <span className="bk-total-row-label">{svc.name}</span>
                    <span className="bk-total-row-val">
                      ${svc.price?.toLocaleString()}
                    </span>
                  </div>
                ))}

                {/* Grand total */}
                <div
                  className="bk-grand-row"
                  style={{ borderBottom: "1px solid var(--gold-line)" }}
                >
                  <span className="bk-grand-label">Grand Total</span>
                  <span className="bk-grand-val">
                    ${pricing.total.toLocaleString()}
                  </span>
                </div>

                {/* Deposit / remaining */}
                <div className="bk-total-row" style={{ padding: "12px 20px" }}>
                  <span className="bk-total-row-label">
                    Deposit ({depositPct}%)
                  </span>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 17,
                      color: "var(--gold-light)",
                      fontWeight: 300,
                    }}
                  >
                    ${pricing.depositAmount.toLocaleString()}
                  </span>
                </div>
                <div className="bk-total-row" style={{ padding: "12px 20px" }}>
                  <span className="bk-total-row-label">Remaining</span>
                  <span className="bk-total-row-val">
                    ${pricing.remaining.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit */}
              {globalErr && (
                <div className="bk-global-err" style={{ marginBottom: 16 }}>
                  {globalErr}
                </div>
              )}
              <button
                className="bk-submit"
                onClick={handleSubmit}
                disabled={submitting}
              >
                <span>
                  {submitting
                    ? "Reserving…"
                    : `Pay Deposit — $${pricing.depositAmount.toLocaleString()}`}
                </span>
              </button>
              <p className="bk-submit-note">
                {depositPct < 100
                  ? `$${pricing.remaining.toLocaleString()} remaining due on the day`
                  : "Full payment — nothing due on the day"}
              </p>
            </div>
          </div>
        </main>

        <footer className="bk-footer">
          <p className="bk-footer-copy">
            © 2026 <span>Eventy</span> — All rights reserved.
          </p>
          <p className="bk-footer-copy" style={{ opacity: 0.5 }}>
            Luxury Event Planning Platform
          </p>
        </footer>
      </div>
    </>
  );
}

export default BookingPage;
