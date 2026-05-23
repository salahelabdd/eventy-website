import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,500&family=Cinzel:wght@400;600&family=Raleway:wght@200;300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { background-color: #0A0A0A !important; min-height: 100vh; }

  :root {
    --black:      #0A0A0A;
    --obsidian:   #111118;
    --gold:       #C8A951;
    --gold-light: #E2C97E;
    --gold-dim:   rgba(200,169,81,0.12);
    --gold-line:  rgba(200,169,81,0.35);
    --cream:      #F0EAD6;
    --muted:      rgba(240,234,214,0.38);
    --border:     rgba(200,169,81,0.22);
    --red:        #E08080;
    --green:      #8DB87A;
  }

  .hbk-root {
    font-family: 'Raleway', sans-serif;
    min-height: 100vh; color: var(--cream);
    background-color: #0A0A0A;
    background-image:
      repeating-linear-gradient(135deg, transparent, transparent 28px, rgba(200,169,81,0.03) 28px, rgba(200,169,81,0.03) 29px),
      repeating-linear-gradient(45deg,  transparent, transparent 28px, rgba(200,169,81,0.018) 28px, rgba(200,169,81,0.018) 29px),
      radial-gradient(ellipse at 15% 0%, rgba(200,169,81,0.07) 0%, transparent 50%),
      radial-gradient(ellipse at 85% 100%, rgba(13,27,42,0.6) 0%, transparent 50%);
  }
  .hbk-root::before {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%);
  }

  /* ── Topbar ── */
  .hbk-topbar {
    background: rgba(17,17,24,0.94); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border); padding: 22px 56px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .hbk-topbar::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .hbk-logo { display: flex; align-items: center; gap: 14px; cursor: pointer; }
  .hbk-logo-mark { width: 32px; height: 32px; border: 1.5px solid var(--gold); transform: rotate(45deg); flex-shrink: 0; }
  .hbk-logo-text { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase; }
  .hbk-logo-text span { color: var(--gold); }
  .hbk-back-btn {
    font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
    padding: 9px 22px; border: 1px solid var(--border); background: transparent; color: var(--gold);
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
    display: flex; align-items: center; gap: 10px;
  }
  .hbk-back-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .hbk-back-btn:hover::before { transform: scaleX(1); }
  .hbk-back-btn:hover { color: var(--black); }
  .hbk-back-btn span { position: relative; z-index: 1; }

  /* ── Main ── */
  .hbk-main { position: relative; z-index: 1; max-width: 1000px; margin: 0 auto; padding: 64px 56px 100px; }
  .hbk-breadcrumb {
    font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--gold); opacity: 0.8; margin-bottom: 32px;
    display: flex; align-items: center; gap: 14px;
  }
  .hbk-breadcrumb::before { content: ''; display: block; width: 32px; height: 1px; background: var(--gold); opacity: 0.6; }
  .hbk-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 50px); font-weight: 300; color: var(--cream); line-height: 1.05; margin-bottom: 8px; }
  .hbk-subtitle { font-size: 12px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; margin-bottom: 48px; }

  /* ── Layout ── */
  .hbk-layout { display: grid; grid-template-columns: 1fr 340px; gap: 40px; align-items: start; }

  /* ── Panel ── */
  .hbk-panel {
    background: rgba(17,17,24,0.85); backdrop-filter: blur(10px);
    border: 1px solid var(--border); padding: 40px 44px;
    position: relative; margin-bottom: 24px;
  }
  .hbk-panel::before { content: ''; position: absolute; top: 0; left: 0; width: 80px; height: 1px; background: var(--gold); }
  .hbk-panel-title { font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase; color: var(--gold); opacity: 0.8; margin-bottom: 28px; }

  .hbk-field { margin-bottom: 22px; }
  .hbk-label { font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.65; margin-bottom: 8px; display: block; }
  .hbk-input {
    width: 100%; background: rgba(10,10,10,0.7); border: 1px solid var(--border);
    color: var(--cream); font-family: 'Raleway', sans-serif;
    font-size: 13px; font-weight: 200; padding: 11px 14px;
    outline: none; transition: border-color 0.2s; appearance: none;
  }
  .hbk-input:focus { border-color: var(--gold-line); }
  .hbk-input.error { border-color: var(--red); }
  .hbk-input[type="date"] { color-scheme: dark; }
  .hbk-input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.8) sepia(1) saturate(2) hue-rotate(5deg); cursor: pointer; opacity: 0.6; }
  .hbk-select {
    width: 100%; background: rgba(10,10,10,0.7); border: 1px solid var(--border);
    color: var(--cream); font-family: 'Raleway', sans-serif;
    font-size: 13px; font-weight: 200; padding: 11px 14px;
    outline: none; cursor: pointer; transition: border-color 0.2s; appearance: none;
  }
  .hbk-select:focus { border-color: var(--gold-line); }
  .hbk-select.error { border-color: var(--red); }
  .hbk-select option { background: var(--obsidian); }
  .hbk-field-err { font-size: 9px; color: var(--red); margin-top: 5px; letter-spacing: 0.04em; }
  .hbk-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .hbk-divider { width: 100%; height: 1px; background: var(--border); margin: 28px 0; position: relative; }
  .hbk-divider::before {
    content: '◆'; position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
    font-size: 7px; color: var(--gold); background: var(--obsidian); padding: 0 10px;
  }

  /* ── Room Category Cards ── */
  .hbk-room-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .hbk-room-card {
    border: 1px solid var(--border); padding: 20px 18px;
    background: rgba(10,10,10,0.5); cursor: pointer;
    transition: border-color 0.25s, background 0.25s;
    display: flex; flex-direction: column; gap: 6px; position: relative;
  }
  .hbk-room-card:hover { border-color: var(--gold-line); background: var(--gold-dim); }
  .hbk-room-card.selected { border-color: var(--gold); background: var(--gold-dim); }
  .hbk-room-card.selected::before { content: '✔'; position: absolute; top: 10px; right: 12px; font-size: 9px; color: var(--gold); }
  .hbk-room-card.unavailable { opacity: 0.4; cursor: not-allowed; }
  .hbk-room-name { font-family: 'Cinzel', serif; font-size: 9px; font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase; color: var(--cream); }
  .hbk-room-desc { font-size: 9px; font-weight: 200; color: var(--muted); letter-spacing: 0.03em; line-height: 1.5; }
  .hbk-room-price { font-family: 'Cormorant Garamond', serif; font-size: 16px; color: var(--gold-light); margin-top: 4px; }
  .hbk-room-meta { font-size: 9px; color: var(--muted); font-weight: 200; }
  .hbk-room-amenities { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
  .hbk-room-amenity-tag { font-size: 7px; letter-spacing: 0.1em; padding: 2px 6px; border: 1px solid var(--border); color: var(--muted); }

  /* ── Meal Plan Cards ── */
  .hbk-meal-grid { display: flex; flex-direction: column; gap: 10px; }
  .hbk-meal-card {
    border: 1px solid var(--border); padding: 16px 18px;
    background: rgba(10,10,10,0.5); cursor: pointer;
    transition: border-color 0.25s, background 0.25s;
    display: flex; align-items: center; justify-content: space-between;
    position: relative;
  }
  .hbk-meal-card:hover { border-color: var(--gold-line); background: var(--gold-dim); }
  .hbk-meal-card.selected { border-color: var(--gold); background: var(--gold-dim); }
  .hbk-meal-card.selected::before { content: '✔'; position: absolute; top: 50%; right: 14px; transform: translateY(-50%); font-size: 9px; color: var(--gold); }
  .hbk-meal-info {}
  .hbk-meal-name { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--cream); margin-bottom: 3px; }
  .hbk-meal-desc { font-size: 9px; font-weight: 200; color: var(--muted); }
  .hbk-meal-price { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: var(--gold-light); padding-right: 24px; }

  /* ── Payment Method ── */
  .hbk-method-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .hbk-method-card {
    border: 1px solid var(--border); padding: 18px 16px;
    background: rgba(10,10,10,0.5); cursor: pointer;
    transition: border-color 0.25s, background 0.25s;
    display: flex; flex-direction: column; align-items: center; gap: 10px; position: relative;
  }
  .hbk-method-card:hover { border-color: var(--gold-line); background: var(--gold-dim); }
  .hbk-method-card.selected { border-color: var(--gold); background: var(--gold-dim); }
  .hbk-method-card.selected::before { content: '✔'; position: absolute; top: 8px; right: 10px; font-size: 9px; color: var(--gold); }
  .hbk-method-icon { font-size: 26px; line-height: 1; }
  .hbk-method-label { font-family: 'Cinzel', serif; font-size: 8px; font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase; color: var(--cream); text-align: center; }
  .hbk-method-sub { font-size: 9px; font-weight: 200; color: var(--muted); text-align: center; letter-spacing: 0.04em; }
  .hbk-card-fields { display: flex; flex-direction: column; gap: 14px; margin-top: 4px; }
  .hbk-card-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* ── Deposit slider ── */
  .hbk-deposit-slider {
    appearance: none; width: 100%; height: 3px;
    background: linear-gradient(to right, var(--gold) 0%, var(--gold) var(--pct, 25%), rgba(200,169,81,0.2) var(--pct, 25%), rgba(200,169,81,0.2) 100%);
    outline: none; cursor: pointer; border: none;
  }
  .hbk-deposit-slider::-webkit-slider-thumb { appearance: none; width: 16px; height: 16px; background: var(--gold); border: 2px solid var(--black); transform: rotate(45deg); cursor: pointer; }
  .hbk-deposit-slider::-moz-range-thumb { width: 14px; height: 14px; background: var(--gold); border: 2px solid var(--black); transform: rotate(45deg); cursor: pointer; border-radius: 0; }
  .hbk-deposit-badges { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
  .hbk-deposit-badge {
    font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.18em;
    padding: 5px 12px; border: 1px solid var(--border); background: transparent; color: var(--muted);
    cursor: pointer; transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .hbk-deposit-badge:hover { border-color: var(--gold-line); color: var(--gold-light); }
  .hbk-deposit-badge.active { border-color: var(--gold); color: var(--gold-light); background: var(--gold-dim); }

  /* ── Summary ── */
  .hbk-summary-box { border: 1px solid var(--border); background: rgba(17,17,24,0.85); overflow: hidden; margin-bottom: 20px; position: relative; }
  .hbk-summary-box::before { content: ''; position: absolute; top: 0; left: 0; width: 60px; height: 1px; background: var(--gold); }
  .hbk-summary-head { padding: 14px 20px; border-bottom: 1px solid var(--border); font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.8; }
  .hbk-summary-row { padding: 12px 20px; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; border-bottom: 1px solid rgba(200,169,81,0.08); }
  .hbk-summary-row:last-child { border-bottom: none; }
  .hbk-summary-row-label { font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.04em; }
  .hbk-summary-row-val { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 300; color: var(--cream); text-align: right; flex-shrink: 0; max-width: 55%; word-break: break-word; }
  .hbk-summary-row-val.gold { color: var(--gold-light); }

  .hbk-total-box { border: 1px solid var(--gold-line); background: var(--gold-dim); overflow: hidden; margin-bottom: 20px; }
  .hbk-total-head { padding: 10px 20px; border-bottom: 1px solid var(--gold-line); font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); }
  .hbk-total-row { padding: 8px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(200,169,81,0.08); }
  .hbk-total-row:last-of-type { border-bottom: none; }
  .hbk-total-row-label { font-size: 10px; font-weight: 200; color: var(--muted); }
  .hbk-total-row-val { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 300; color: var(--cream); }
  .hbk-grand-row { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--gold-line); }
  .hbk-grand-label { font-size: 9px; font-weight: 300; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); }
  .hbk-grand-val { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 300; color: var(--gold-light); }

  /* ── Submit ── */
  .hbk-submit {
    width: 100%; padding: 16px; background: transparent; border: 1px solid var(--gold);
    color: var(--gold); font-family: 'Cinzel', serif; font-size: 10px; font-weight: 400;
    letter-spacing: 0.32em; text-transform: uppercase;
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.35s; margin-bottom: 12px;
  }
  .hbk-submit::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .hbk-submit:hover:not(:disabled)::before { transform: scaleX(1); }
  .hbk-submit:hover:not(:disabled) { color: var(--black); }
  .hbk-submit span { position: relative; z-index: 1; }
  .hbk-submit:disabled { opacity: 0.4; cursor: not-allowed; }
  .hbk-submit-note { text-align: center; font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.08em; }
  .hbk-global-err { font-size: 11px; font-weight: 200; color: var(--red); letter-spacing: 0.04em; padding: 12px 16px; border: 1px solid rgba(224,128,128,0.3); background: rgba(224,128,128,0.06); margin-bottom: 16px; }

  /* ── Success ── */
  .hbk-success-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.82); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .hbk-success-box {
    background: #111118; border: 1px solid var(--gold-line);
    padding: 52px 48px; max-width: 460px; width: 100%; text-align: center; position: relative;
  }
  .hbk-success-box::before { content: ''; position: absolute; top: 0; left: 0; width: 80px; height: 1px; background: var(--gold); }
  .hbk-success-box::after  { content: ''; position: absolute; bottom: 0; right: 0; width: 80px; height: 1px; background: var(--gold); }
  .hbk-success-icon { font-size: 42px; margin-bottom: 20px; }
  .hbk-success-title { font-family: 'Cormorant Garamond', serif; font-size: 34px; font-weight: 300; color: var(--cream); margin-bottom: 12px; }
  .hbk-success-sub { font-size: 12px; font-weight: 200; color: var(--muted); margin-bottom: 10px; line-height: 1.7; letter-spacing: 0.04em; }
  .hbk-success-id { font-family: 'Cormorant Garamond', serif; font-size: 13px; color: var(--gold); opacity: 0.7; margin-bottom: 32px; letter-spacing: 0.08em; }
  .hbk-success-btn {
    display: inline-block; padding: 13px 36px; border: 1px solid var(--gold);
    background: transparent; color: var(--gold); font-family: 'Cinzel', serif;
    font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
  }
  .hbk-success-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .hbk-success-btn:hover::before { transform: scaleX(1); }
  .hbk-success-btn:hover { color: var(--black); }
  .hbk-success-btn span { position: relative; z-index: 1; }

  /* ── Loading ── */
  .hbk-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 16px; }
  .hbk-spinner { width: 32px; height: 32px; border: 1.5px solid var(--border); border-top-color: var(--gold); border-radius: 50%; animation: hbk-spin 0.9s linear infinite; }
  @keyframes hbk-spin { to { transform: rotate(360deg); } }
  .hbk-loading-text { font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.3em; text-transform: uppercase; }

  /* ── Stars ── */
  .hbk-stars { color: var(--gold); font-size: 13px; letter-spacing: 2px; }

  /* ── Hotel info banner ── */
  .hbk-hotel-banner {
    border: 1px solid var(--border); background: rgba(17,17,24,0.85);
    padding: 28px 36px; margin-bottom: 32px; position: relative;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; flex-wrap: wrap;
  }
  .hbk-hotel-banner::before { content: ''; position: absolute; top: 0; left: 0; width: 80px; height: 1px; background: var(--gold); }
  .hbk-hotel-banner-name { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 300; color: var(--cream); margin-bottom: 4px; }
  .hbk-hotel-banner-loc { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }
  .hbk-hotel-banner-right { text-align: right; flex-shrink: 0; }
  .hbk-hotel-banner-from { font-size: 9px; color: var(--muted); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 4px; }
  .hbk-hotel-banner-price { font-family: 'Cormorant Garamond', serif; font-size: 28px; color: var(--gold-light); }

  /* ── Amenity chips (hotel info) ── */
  .hbk-amenity-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
  .hbk-amenity-chip { font-size: 8px; letter-spacing: 0.12em; padding: 3px 8px; border: 1px solid var(--border); color: var(--muted); }

  /* ── Footer ── */
  .hbk-footer {
    position: relative; z-index: 1; border-top: 1px solid var(--border); padding: 32px 56px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(17,17,24,0.6); backdrop-filter: blur(8px);
  }
  .hbk-footer-copy { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }
  .hbk-footer-copy span { color: var(--gold); }

  @media (max-width: 860px) {
    .hbk-layout { grid-template-columns: 1fr; }
    .hbk-topbar, .hbk-footer { padding: 18px 24px; }
    .hbk-main { padding: 40px 24px 60px; }
    .hbk-panel { padding: 28px 24px; }
    .hbk-footer { flex-direction: column; gap: 12px; text-align: center; }
    .hbk-method-grid, .hbk-room-grid, .hbk-field-row, .hbk-card-row { grid-template-columns: 1fr; }
  }
`;

const FLOOR_PREFERENCES = [
  "No preference",
  "Low floor (1–5)",
  "Mid floor (6–12)",
  "High floor (13+)",
  "Top floor",
];

const SPECIAL_REQUESTS_OPTIONS = [
  "Honeymoon setup",
  "Birthday decoration",
  "High floor preferred",
  "Quiet room",
  "Extra pillows & blankets",
  "Baby cot required",
  "Accessible room",
  "Connecting rooms",
];

const PAYMENT_METHODS = [
  {
    id: "ewallet",
    icon: "◆",
    label: "E-Wallet",
    sub: "Vodafone / Orange / Etisalat / WE",
  },
  {
    id: "instapay",
    icon: "◆",
    label: "InstaPay",
    sub: "Instant bank transfer",
  },
];

function HotelBookingPage() {
  const { id: hotelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(location.state?.hotel || null);
  const [loadingHotel, setLoadingHotel] = useState(!location.state?.hotel);
  const [loadError, setLoadError] = useState("");

  /* ── Form state ── */
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");

  // Room: selected roomCategory id from hotel.roomCategories
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [selectedBedType, setSelectedBedType] = useState("");
  const [floorPref, setFloorPref] = useState("No preference");

  // Meal plan: selected mealPlan id from hotel.mealPlans
  const [selectedMealPlanId, setSelectedMealPlanId] = useState("");

  const [specialRequests, setSpecialRequests] = useState([]);
  const [specialNote, setSpecialNote] = useState("");

  /* ── Payment ── */
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

  /* ── Submission ── */
  const [errors, setErrors] = useState({});
  const [globalErr, setGlobalErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);

  /* ── Fetch hotel if not in router state ── */
  useEffect(() => {
    if (hotel) {
      setLoadingHotel(false);
      return;
    }
    if (!hotelId) {
      navigate("/");
      return;
    }
    API.get(`/hotels/${hotelId}`)
      .then((res) => {
        setHotel(res.data);
        setLoadingHotel(false);
      })
      .catch(() => {
        setLoadError(
          "Could not load hotel details. Please go back and try again.",
        );
        setLoadingHotel(false);
      });
  }, [hotelId]); // eslint-disable-line

  /* ── Auto-select first available room & meal plan ── */
  useEffect(() => {
    if (!hotel) return;
    if (hotel.roomCategories?.length && !selectedRoomId) {
      const first = hotel.roomCategories.find((r) => r.isAvailable !== false);
      if (first) setSelectedRoomId(first.id);
    }
    if (hotel.mealPlans?.length && !selectedMealPlanId) {
      const first = hotel.mealPlans.find((m) => m.isAvailable !== false);
      if (first) setSelectedMealPlanId(first.id);
    }
  }, [hotel]); // eslint-disable-line

  /* ── Derived values ── */
  const nights = (() => {
    if (!checkIn || !checkOut) return 1;
    const diff =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.ceil(diff) : 1;
  })();

  const selectedRoom = hotel?.roomCategories?.find(
    (r) => r.id === selectedRoomId,
  );
  const selectedMealPlan = hotel?.mealPlans?.find(
    (m) => m.id === selectedMealPlanId,
  );

  const roomPricePerNight =
    selectedRoom?.pricePerNight ?? hotel?.pricePerNight ?? 0;
  const roomTotal = roomPricePerNight * nights;

  const guestCount = Number(adults) + Number(children);
  const mealPricePerNight = selectedMealPlan?.pricePerPersonPerNight ?? 0;
  const mealTotal = mealPricePerNight * guestCount * nights;

  const total = roomTotal + mealTotal;
  const depositAmount = Math.round((total * depositPct) / 100);
  const remaining = total - depositAmount;

  /* ── Helpers ── */
  const toggleRequest = (req) =>
    setSpecialRequests((prev) =>
      prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req],
    );

  const formatCardNumber = (val) =>
    val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  const formatExpiry = (val) => {
    const d = val.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };
  const renderStars = (n) => "★".repeat(n || 0);

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
  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    if (!checkIn) errs.checkIn = "Please select a check-in date.";
    if (!checkOut) errs.checkOut = "Please select a check-out date.";
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn))
      errs.checkOut = "Check-out must be after check-in.";
    if (!adults || Number(adults) < 1)
      errs.adults = "At least 1 adult required.";
    if (!selectedRoomId) errs.roomType = "Please select a room type.";
    if (!selectedBedType) errs.bedType = "Please select a bed type.";
    if (!paymentMethod) errs.paymentMethod = "Please select a payment method.";
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
          errs.ewalletPhone = `${ewalletProvider.replace(/_/g, " ")} numbers must start with ${allowedPrefixes[0]}.`;
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

  /* ── Submit ── */
  const handleSubmit = async () => {
    setGlobalErr("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("hotel", hotelId);
      formData.append("checkIn", checkIn);
      formData.append("checkOut", checkOut);
      formData.append("nights", nights);
      formData.append("adults", Number(adults));
      formData.append("children", Number(children));
      formData.append("roomCategoryId", selectedRoomId);
      formData.append("roomCategoryName", selectedRoom?.name ?? "");
      formData.append("bedType", selectedBedType);
      formData.append("floorPreference", floorPref);
      formData.append("mealPlanId", selectedMealPlanId);
      formData.append("mealPlanName", selectedMealPlan?.name ?? "");
      formData.append(
        "specialRequests",
        JSON.stringify([
          ...specialRequests,
          ...(specialNote ? [specialNote] : []),
        ]),
      );
      formData.append("paymentMethod", paymentMethod);
      formData.append("depositPct", depositPct);
      formData.append("depositAmount", depositAmount);
      formData.append("totalAmount", total);
      formData.append("roomPricePerNight", roomPricePerNight);
      formData.append("mealPlanTotal", mealTotal);
      formData.append("addonsTotal", 0);
      if (screenshot) formData.append("screenshot", screenshot);

      const res = await API.post("/hotel-bookings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBooking(res.data);
    } catch (err) {
      setGlobalErr(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Loading / Error states ── */
  if (loadingHotel) {
    return (
      <>
        <style>{style}</style>
        <div className="hbk-root hbk-loading">
          <div className="hbk-spinner" />
          <p className="hbk-loading-text">Loading Hotel</p>
        </div>
      </>
    );
  }

  if (loadError || !hotel) {
    return (
      <>
        <style>{style}</style>
        <div className="hbk-root hbk-loading">
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              color: "var(--cream)",
            }}
          >
            Hotel not found
          </p>
          <p style={{ fontSize: 12, color: "var(--muted)" }}>
            {loadError || "Please go back and try again."}
          </p>
          <button className="hbk-back-btn" onClick={() => navigate("/")}>
            <span>←</span>
            <span>Back</span>
          </button>
        </div>
      </>
    );
  }

  /* ── Success overlay ── */
  if (booking) {
    return (
      <>
        <style>{style}</style>
        <div className="hbk-success-overlay">
          <div className="hbk-success-box">
            <div className="hbk-success-icon">✦</div>
            <div className="hbk-success-title">Stay Confirmed</div>
            <p className="hbk-success-sub">
              Your reservation at{" "}
              <strong style={{ color: "var(--cream)" }}>{hotel?.name}</strong>{" "}
              has been received.
            </p>
            <p className="hbk-success-sub" style={{ marginTop: 4 }}>
              Check-in:{" "}
              <strong style={{ color: "var(--cream)" }}>{checkIn}</strong>
              &nbsp;·&nbsp; Check-out:{" "}
              <strong style={{ color: "var(--cream)" }}>{checkOut}</strong>
            </p>
            <p className="hbk-success-id">Booking ID: {booking._id}</p>
            <button className="hbk-success-btn" onClick={() => navigate("/")}>
              <span>Back to Hotels</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  const roomCategories = hotel.roomCategories ?? [];
  const mealPlans = (hotel.mealPlans ?? []).filter(
    (m) => m.isAvailable !== false,
  );

  /* ── Main render ── */
  return (
    <>
      <style>{style}</style>
      <div className="hbk-root">
        {/* Topbar */}
        <nav className="hbk-topbar">
          <div className="hbk-logo" onClick={() => navigate("/")}>
            <div className="hbk-logo-mark" />
            <div className="hbk-logo-text" translate="no">
              Event<span>y</span>
            </div>
          </div>
          <button className="hbk-back-btn" onClick={() => navigate(-1)}>
            <span>←</span>
            <span>Back to Hotel</span>
          </button>
        </nav>

        <main className="hbk-main">
          <p className="hbk-breadcrumb">Reserve a Room</p>
          <h1 className="hbk-title">Complete Your Stay</h1>
          <p className="hbk-subtitle">
            Confirm the details below to secure your reservation.
          </p>

          {/* Hotel banner */}
          <div className="hbk-hotel-banner">
            <div>
              <div className="hbk-hotel-banner-name">{hotel.name}</div>
              <div className="hbk-hotel-banner-loc">
                📍 {hotel.location}
                {hotel.stars ? (
                  <span className="hbk-stars" style={{ marginLeft: 12 }}>
                    {renderStars(hotel.stars)}
                  </span>
                ) : null}
              </div>
              {hotel.checkInTime && (
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--muted)",
                    marginTop: 8,
                    fontWeight: 200,
                  }}
                >
                  Check-in:{" "}
                  <span style={{ color: "var(--cream)" }}>
                    {hotel.checkInTime}
                  </span>
                  &nbsp;·&nbsp;Check-out:{" "}
                  <span style={{ color: "var(--cream)" }}>
                    {hotel.checkOutTime}
                  </span>
                </div>
              )}
              {hotel.amenities?.length > 0 && (
                <div className="hbk-amenity-chips">
                  {hotel.amenities.slice(0, 8).map((a) => (
                    <span key={a} className="hbk-amenity-chip">
                      {a}
                    </span>
                  ))}
                  {hotel.amenities.length > 8 && (
                    <span className="hbk-amenity-chip">
                      +{hotel.amenities.length - 8} more
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="hbk-hotel-banner-right">
              <div className="hbk-hotel-banner-from">From</div>
              <div className="hbk-hotel-banner-price">
                ${(hotel.pricePerNight ?? 0).toLocaleString()}
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--muted)",
                    fontFamily: "Raleway",
                  }}
                >
                  {" "}
                  / night
                </span>
              </div>
            </div>
          </div>

          <div className="hbk-layout">
            {/* ── LEFT: Form ── */}
            <div>
              {/* Panel 1: Dates & Guests */}
              <div className="hbk-panel">
                <p className="hbk-panel-title">◆ Stay Details</p>
                <div className="hbk-field-row" style={{ marginBottom: 22 }}>
                  <div className="hbk-field" style={{ marginBottom: 0 }}>
                    <label className="hbk-label">Check-In Date *</label>
                    <input
                      type="date"
                      className={`hbk-input${errors.checkIn ? " error" : ""}`}
                      value={checkIn}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        setErrors((p) => ({ ...p, checkIn: undefined }));
                      }}
                    />
                    {errors.checkIn && (
                      <p className="hbk-field-err">{errors.checkIn}</p>
                    )}
                  </div>
                  <div className="hbk-field" style={{ marginBottom: 0 }}>
                    <label className="hbk-label">Check-Out Date *</label>
                    <input
                      type="date"
                      className={`hbk-input${errors.checkOut ? " error" : ""}`}
                      value={checkOut}
                      min={checkIn || new Date().toISOString().split("T")[0]}
                      onChange={(e) => {
                        setCheckOut(e.target.value);
                        setErrors((p) => ({ ...p, checkOut: undefined }));
                      }}
                    />
                    {errors.checkOut && (
                      <p className="hbk-field-err">{errors.checkOut}</p>
                    )}
                  </div>
                </div>
                <div className="hbk-field-row">
                  <div className="hbk-field" style={{ marginBottom: 0 }}>
                    <label className="hbk-label">Adults *</label>
                    <select
                      className={`hbk-select${errors.adults ? " error" : ""}`}
                      value={adults}
                      onChange={(e) => {
                        setAdults(e.target.value);
                        setErrors((p) => ({ ...p, adults: undefined }));
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} Adult{n > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                    {errors.adults && (
                      <p className="hbk-field-err">{errors.adults}</p>
                    )}
                  </div>
                  <div className="hbk-field" style={{ marginBottom: 0 }}>
                    <label className="hbk-label">Children</label>
                    <select
                      className="hbk-select"
                      value={children}
                      onChange={(e) => setChildren(e.target.value)}
                    >
                      {[0, 1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Child" : "Children"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Panel 2: Room Categories from DB */}
              <div className="hbk-panel">
                <p className="hbk-panel-title">◆ Select Room Type *</p>
                {roomCategories.length === 0 ? (
                  <p style={{ fontSize: 11, color: "var(--muted)" }}>
                    No room types available.
                  </p>
                ) : (
                  <div className="hbk-room-grid">
                    {roomCategories.map((room) => {
                      const unavail = room.isAvailable === false;
                      return (
                        <div
                          key={room.id}
                          className={`hbk-room-card${selectedRoomId === room.id ? " selected" : ""}${unavail ? " unavailable" : ""}`}
                          onClick={() => {
                            if (unavail) return;
                            setSelectedRoomId(room.id);
                            setSelectedBedType("");
                            setErrors((p) => ({ ...p, roomType: undefined }));
                          }}
                        >
                          <div className="hbk-room-name">{room.name}</div>
                          {room.description && (
                            <div className="hbk-room-desc">
                              {room.description}
                            </div>
                          )}
                          <div className="hbk-room-meta">
                            Max {room.maxOccupancy} guests
                            {room.totalRooms
                              ? ` · ${room.totalRooms} rooms`
                              : ""}
                          </div>
                          <div className="hbk-room-price">
                            ${(room.pricePerNight ?? 0).toLocaleString()} /
                            night
                          </div>
                          {room.amenities?.length > 0 && (
                            <div className="hbk-room-amenities">
                              {room.amenities.slice(0, 4).map((a) => (
                                <span key={a} className="hbk-room-amenity-tag">
                                  {a}
                                </span>
                              ))}
                            </div>
                          )}
                          {unavail && (
                            <div
                              style={{
                                fontSize: 8,
                                color: "var(--red)",
                                letterSpacing: "0.1em",
                                marginTop: 4,
                              }}
                            >
                              UNAVAILABLE
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {errors.roomType && (
                  <p className="hbk-field-err" style={{ marginTop: 12 }}>
                    {errors.roomType}
                  </p>
                )}

                <div className="hbk-divider" />

                {/* Bed type: pulled from selected room's bedOptions */}
                <div className="hbk-field-row">
                  <div className="hbk-field" style={{ marginBottom: 0 }}>
                    <label className="hbk-label">Bed Type *</label>
                    <select
                      className={`hbk-select${errors.bedType ? " error" : ""}`}
                      value={selectedBedType}
                      onChange={(e) => {
                        setSelectedBedType(e.target.value);
                        setErrors((p) => ({ ...p, bedType: undefined }));
                      }}
                    >
                      <option value="">— Select —</option>
                      {(
                        selectedRoom?.bedOptions ?? [
                          "Single",
                          "Double",
                          "Queen",
                          "King",
                          "Twin",
                        ]
                      ).map((b) => (
                        <option key={b} value={b}>
                          {b} Bed
                        </option>
                      ))}
                    </select>
                    {errors.bedType && (
                      <p className="hbk-field-err">{errors.bedType}</p>
                    )}
                  </div>
                  <div className="hbk-field" style={{ marginBottom: 0 }}>
                    <label className="hbk-label">Floor Preference</label>
                    <select
                      className="hbk-select"
                      value={floorPref}
                      onChange={(e) => setFloorPref(e.target.value)}
                    >
                      {FLOOR_PREFERENCES.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Panel 3: Meal Plans from DB */}
              {mealPlans.length > 0 && (
                <div className="hbk-panel">
                  <p className="hbk-panel-title">◆ Meal Plan / Board Option</p>
                  <div className="hbk-meal-grid">
                    {mealPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`hbk-meal-card${selectedMealPlanId === plan.id ? " selected" : ""}`}
                        onClick={() => setSelectedMealPlanId(plan.id)}
                      >
                        <div className="hbk-meal-info">
                          <div className="hbk-meal-name">{plan.name}</div>
                          {plan.description && (
                            <div className="hbk-meal-desc">
                              {plan.description}
                            </div>
                          )}
                        </div>
                        <div className="hbk-meal-price">
                          {plan.pricePerPersonPerNight === 0
                            ? "Included"
                            : `$${plan.pricePerPersonPerNight}/person/night`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Panel 4: Special Requests */}
              <div className="hbk-panel">
                <p className="hbk-panel-title">◆ Special Requests</p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginBottom: 20,
                  }}
                >
                  {SPECIAL_REQUESTS_OPTIONS.map((req) => {
                    const active = specialRequests.includes(req);
                    return (
                      <button
                        key={req}
                        type="button"
                        onClick={() => toggleRequest(req)}
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: "8px",
                          letterSpacing: "0.18em",
                          padding: "7px 14px",
                          border: `1px solid ${active ? "var(--gold)" : "var(--border)"}`,
                          background: active
                            ? "var(--gold-dim)"
                            : "transparent",
                          color: active ? "var(--gold-light)" : "var(--muted)",
                          cursor: "pointer",
                          textTransform: "uppercase",
                          transition: "all 0.2s",
                        }}
                      >
                        {active ? "✔ " : ""}
                        {req}
                      </button>
                    );
                  })}
                </div>
                <div className="hbk-field" style={{ marginBottom: 0 }}>
                  <label className="hbk-label">Additional Note</label>
                  <textarea
                    className="hbk-input"
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                    placeholder="Any other requests or preferences…"
                    rows={3}
                    style={{ resize: "vertical" }}
                  />
                </div>
              </div>

              {/* Panel 5: Deposit */}
              <div className="hbk-panel">
                <p className="hbk-panel-title">◆ Deposit Amount</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 200,
                      color: "var(--muted)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {depositPct}% deposit
                  </span>
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 22,
                      color: "var(--gold-light)",
                    }}
                  >
                    ${depositAmount.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  className="hbk-deposit-slider"
                  min={25}
                  max={100}
                  step={25}
                  value={depositPct}
                  style={{ "--pct": `${depositPct}%` }}
                  onChange={(e) => setDepositPct(Number(e.target.value))}
                />
                <div className="hbk-deposit-badges">
                  {[25, 50, 75, 100].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`hbk-deposit-badge${depositPct === p ? " active" : ""}`}
                      onClick={() => setDepositPct(p)}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Panel 6: Payment */}
              <div className="hbk-panel">
                <p className="hbk-panel-title">◆ Payment Method</p>
                {errors.paymentMethod && (
                  <p className="hbk-field-err" style={{ marginBottom: 16 }}>
                    {errors.paymentMethod}
                  </p>
                )}
                <div className="hbk-method-grid">
                  {PAYMENT_METHODS.map((m) => (
                    <div
                      key={m.id}
                      className={`hbk-method-card${paymentMethod === m.id ? " selected" : ""}`}
                      onClick={() => {
                        setPaymentMethod(m.id);
                        setScreenshot(null);
                        setScreenshotPreview("");
                        setScreenshotErr("");
                        setErrors((p) => ({ ...p, paymentMethod: undefined }));
                      }}
                    >
                      <div className="hbk-method-icon">{m.icon}</div>
                      <div className="hbk-method-label">{m.label}</div>
                      <div className="hbk-method-sub">{m.sub}</div>
                    </div>
                  ))}
                </div>

                {paymentMethod === "ewallet" && (
                  <div className="hbk-card-fields">
                    <div className="hbk-field" style={{ marginBottom: 0 }}>
                      <label className="hbk-label">Wallet Provider *</label>
                      <select
                        className={`hbk-select${errors.ewalletProvider ? " error" : ""}`}
                        value={ewalletProvider}
                        onChange={(e) => {
                          setEwalletProvider(e.target.value);
                          setScreenshot(null);
                          setScreenshotPreview("");
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
                        <p className="hbk-field-err">
                          {errors.ewalletProvider}
                        </p>
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
                    <div className="hbk-field" style={{ marginBottom: 0 }}>
                      <label className="hbk-label">
                        Registered Phone Number *
                      </label>
                      <input
                        className={`hbk-input${errors.ewalletPhone ? " error" : ""}`}
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
                        <p className="hbk-field-err">{errors.ewalletPhone}</p>
                      )}
                    </div>
                    <div className="hbk-field" style={{ marginBottom: 0 }}>
                      <label className="hbk-label">Payment Screenshot *</label>
                      <div
                        className={`bk-upload-zone${screenshotPreview ? " has-file" : ""}`}
                        style={{
                          border: `1px dashed var(--gold-line)`,
                          padding: "24px 20px",
                          textAlign: "center",
                          cursor: "pointer",
                          background: "rgba(10,10,10,0.4)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          style={{
                            position: "absolute",
                            inset: 0,
                            opacity: 0,
                            cursor: "pointer",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                        {!screenshotPreview ? (
                          <>
                            <div
                              style={{
                                fontSize: 22,
                                color: "var(--gold)",
                                opacity: 0.7,
                                marginBottom: 8,
                              }}
                            >
                              ⬆
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 200,
                                color: "var(--muted)",
                                letterSpacing: "0.06em",
                              }}
                            >
                              <strong
                                style={{
                                  color: "var(--gold-light)",
                                  fontWeight: 300,
                                }}
                              >
                                Click to upload
                              </strong>{" "}
                              or drag & drop
                              <br />
                              PNG, JPG, WEBP — max 5MB
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={screenshotPreview}
                              alt="Payment screenshot"
                              style={{
                                width: "100%",
                                maxHeight: 180,
                                objectFit: "contain",
                                border: "1px solid var(--border)",
                                display: "block",
                              }}
                            />
                            <div
                              style={{
                                fontSize: 9,
                                color: "var(--gold)",
                                opacity: 0.7,
                                marginTop: 6,
                                letterSpacing: "0.06em",
                              }}
                            >
                              Click to change image
                            </div>
                          </>
                        )}
                      </div>
                      {screenshotErr && (
                        <p className="hbk-field-err">{screenshotErr}</p>
                      )}
                      {errors.screenshot && (
                        <p className="hbk-field-err">{errors.screenshot}</p>
                      )}
                    </div>
                  </div>
                )}

                {paymentMethod === "instapay" && (
                  <div className="hbk-card-fields">
                    <div className="hbk-field" style={{ marginBottom: 0 }}>
                      <label className="hbk-label">
                        InstaPay Phone / Account *
                      </label>
                      <input
                        className={`hbk-input${errors.instaPayPhone ? " error" : ""}`}
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
                        <p className="hbk-field-err">{errors.instaPayPhone}</p>
                      )}
                    </div>
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
                        }}
                      >
                        Scan the QR code or transfer manually, then upload your
                        payment screenshot below.
                      </p>
                    </div>
                    <div className="hbk-field" style={{ marginBottom: 0 }}>
                      <label className="hbk-label">Payment Screenshot *</label>
                      <div
                        style={{
                          border: `1px dashed var(--gold-line)`,
                          padding: "24px 20px",
                          textAlign: "center",
                          cursor: "pointer",
                          background: "rgba(10,10,10,0.4)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          style={{
                            position: "absolute",
                            inset: 0,
                            opacity: 0,
                            cursor: "pointer",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                        {!screenshotPreview ? (
                          <>
                            <div
                              style={{
                                fontSize: 22,
                                color: "var(--gold)",
                                opacity: 0.7,
                                marginBottom: 8,
                              }}
                            >
                              ⬆
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 200,
                                color: "var(--muted)",
                                letterSpacing: "0.06em",
                              }}
                            >
                              <strong
                                style={{
                                  color: "var(--gold-light)",
                                  fontWeight: 300,
                                }}
                              >
                                Click to upload
                              </strong>{" "}
                              or drag & drop
                              <br />
                              PNG, JPG, WEBP — max 5MB
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={screenshotPreview}
                              alt="Payment screenshot"
                              style={{
                                width: "100%",
                                maxHeight: 180,
                                objectFit: "contain",
                                border: "1px solid var(--border)",
                                display: "block",
                              }}
                            />
                            <div
                              style={{
                                fontSize: 9,
                                color: "var(--gold)",
                                opacity: 0.7,
                                marginTop: 6,
                                letterSpacing: "0.06em",
                              }}
                            >
                              Click to change image
                            </div>
                          </>
                        )}
                      </div>
                      {screenshotErr && (
                        <p className="hbk-field-err">{screenshotErr}</p>
                      )}
                      {errors.screenshot && (
                        <p className="hbk-field-err">{errors.screenshot}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: Summary ── */}
            <div>
              {/* Hotel snapshot */}
              <div className="hbk-summary-box">
                <div className="hbk-summary-head">Booking Summary</div>
                <div className="hbk-summary-row">
                  <span className="hbk-summary-row-label">Property</span>
                  <span className="hbk-summary-row-val">{hotel.name}</span>
                </div>
                <div className="hbk-summary-row">
                  <span className="hbk-summary-row-label">Location</span>
                  <span className="hbk-summary-row-val">{hotel.location}</span>
                </div>
                {hotel.stars && (
                  <div className="hbk-summary-row">
                    <span className="hbk-summary-row-label">Rating</span>
                    <span className="hbk-summary-row-val">
                      <span className="hbk-stars">
                        {renderStars(hotel.stars)}
                      </span>
                    </span>
                  </div>
                )}
                <div className="hbk-summary-row">
                  <span className="hbk-summary-row-label">Nights</span>
                  <span className="hbk-summary-row-val">{nights}</span>
                </div>
                <div className="hbk-summary-row">
                  <span className="hbk-summary-row-label">Guests</span>
                  <span className="hbk-summary-row-val">
                    {adults} adult{Number(adults) > 1 ? "s" : ""}
                    {Number(children) > 0
                      ? `, ${children} child${Number(children) > 1 ? "ren" : ""}`
                      : ""}
                  </span>
                </div>
                {selectedRoom && (
                  <div className="hbk-summary-row">
                    <span className="hbk-summary-row-label">Room</span>
                    <span className="hbk-summary-row-val">
                      {selectedRoom.name}
                    </span>
                  </div>
                )}
                {selectedBedType && (
                  <div className="hbk-summary-row">
                    <span className="hbk-summary-row-label">Bed</span>
                    <span className="hbk-summary-row-val">
                      {selectedBedType}
                    </span>
                  </div>
                )}
                {selectedMealPlan && (
                  <div className="hbk-summary-row">
                    <span className="hbk-summary-row-label">Meal Plan</span>
                    <span className="hbk-summary-row-val">
                      {selectedMealPlan.name}
                    </span>
                  </div>
                )}
                <div className="hbk-summary-row">
                  <span className="hbk-summary-row-label">Room Rate</span>
                  <span className="hbk-summary-row-val gold">
                    ${roomPricePerNight.toLocaleString()} / night
                  </span>
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="hbk-total-box">
                <div className="hbk-total-head">◆ Cost Breakdown</div>
                <div className="hbk-total-row">
                  <span className="hbk-total-row-label">
                    Room ({nights}n × ${roomPricePerNight.toLocaleString()})
                  </span>
                  <span className="hbk-total-row-val">
                    ${roomTotal.toLocaleString()}
                  </span>
                </div>
                {mealTotal > 0 && (
                  <div className="hbk-total-row">
                    <span className="hbk-total-row-label">
                      {selectedMealPlan?.name} ({guestCount} guests × {nights}n)
                    </span>
                    <span className="hbk-total-row-val">
                      ${mealTotal.toLocaleString()}
                    </span>
                  </div>
                )}
                <div
                  className="hbk-grand-row"
                  style={{ borderBottom: "1px solid var(--gold-line)" }}
                >
                  <span className="hbk-grand-label">Grand Total</span>
                  <span className="hbk-grand-val">
                    ${total.toLocaleString()}
                  </span>
                </div>
                <div className="hbk-total-row" style={{ padding: "12px 20px" }}>
                  <span className="hbk-total-row-label">
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
                    ${depositAmount.toLocaleString()}
                  </span>
                </div>
                <div className="hbk-total-row" style={{ padding: "12px 20px" }}>
                  <span className="hbk-total-row-label">
                    Remaining at check-in
                  </span>
                  <span className="hbk-total-row-val">
                    ${remaining.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Cancellation policy */}
              {hotel.cancellationPolicy && (
                <div
                  style={{
                    border: "1px solid var(--border)",
                    padding: "16px 20px",
                    marginBottom: 20,
                    fontSize: 10,
                    fontWeight: 200,
                    color: "var(--muted)",
                    lineHeight: 1.7,
                  }}
                >
                  <div
                    style={{
                      fontSize: 8,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                      marginBottom: 6,
                    }}
                  >
                    ◆ Cancellation Policy
                  </div>
                  {hotel.cancellationPolicy}
                </div>
              )}

              {globalErr && <div className="hbk-global-err">{globalErr}</div>}

              <button
                className="hbk-submit"
                onClick={handleSubmit}
                disabled={submitting}
              >
                <span>
                  {submitting
                    ? "Reserving…"
                    : `Pay Deposit — $${depositAmount.toLocaleString()}`}
                </span>
              </button>
              <p className="hbk-submit-note">
                {depositPct < 100
                  ? `$${remaining.toLocaleString()} remaining due at check-in`
                  : "Full payment — nothing due at check-in"}
              </p>
            </div>
          </div>
        </main>

        <footer className="hbk-footer">
          <p className="hbk-footer-copy">
            © 2026 <span>Eventy</span> — All rights reserved.
          </p>
          <p className="hbk-footer-copy" style={{ opacity: 0.5 }}>
            Luxury Event Planning Platform
          </p>
        </footer>
      </div>
    </>
  );
}

export default HotelBookingPage;
