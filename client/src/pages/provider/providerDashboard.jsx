import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,500&family=Cinzel:wght@400;600&family=Raleway:wght@200;300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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
    --red-dim:    rgba(224,128,128,0.12);
    --green:      #8DB87A;
    --green-dim:  rgba(141,184,122,0.12);
    --amber:      #E0B870;
    --amber-dim:  rgba(224,184,112,0.12);
  }

  .dash-root {
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
  .dash-root::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%);
  }

  /* ── Topbar ── */
  .dash-topbar {
    background: rgba(17,17,24,0.94); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border); padding: 22px 56px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .dash-topbar::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .dash-logo { display: flex; align-items: center; gap: 14px; cursor: pointer; }
  .dash-logo-mark { width: 32px; height: 32px; border: 1.5px solid var(--gold); transform: rotate(45deg); flex-shrink: 0; }
  .dash-logo-text { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase; }
  .dash-logo-text span { color: var(--gold); }
  .dash-topbar-right { display: flex; align-items: center; gap: 16px; }
  .dash-provider-badge {
    font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase;
    padding: 6px 14px; border: 1px solid var(--gold-line); color: var(--gold); background: var(--gold-dim);
  }
  .dash-logout-btn {
    font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase;
    padding: 7px 16px; border: 1px solid var(--border); color: var(--muted);
    background: transparent; cursor: pointer; transition: border-color 0.2s, color 0.2s;
  }
  .dash-logout-btn:hover { border-color: var(--gold-line); color: var(--gold); }

  /* ── Main ── */
  .dash-main { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 64px 56px 100px; }

  /* ── Header ── */
  .dash-breadcrumb {
    font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--gold); opacity: 0.8; margin-bottom: 28px;
    display: flex; align-items: center; gap: 14px;
  }
  .dash-breadcrumb::before { content: ''; display: block; width: 32px; height: 1px; background: var(--gold); opacity: 0.6; }
  .dash-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(30px, 4vw, 52px); font-weight: 300; color: var(--cream); line-height: 1.05; margin-bottom: 6px; }
  .dash-subtitle { font-size: 12px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; margin-bottom: 56px; }

  /* ── Stats Grid ── */
  .dash-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 56px; }
  .dash-stat {
    border: 1px solid var(--border); background: rgba(17,17,24,0.85);
    padding: 24px 28px; position: relative; overflow: hidden;
    animation: dash-fadein 0.5s ease both;
  }
  .dash-stat:nth-child(1) { animation-delay: 0.05s; }
  .dash-stat:nth-child(2) { animation-delay: 0.10s; }
  .dash-stat:nth-child(3) { animation-delay: 0.15s; }
  @keyframes dash-fadein { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .dash-stat::before { content: ''; position: absolute; top: 0; left: 0; width: 48px; height: 1px; background: var(--gold); }
  .dash-stat-icon { font-size: 18px; margin-bottom: 14px; opacity: 0.7; }
  .dash-stat-label { font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.7; margin-bottom: 8px; }
  .dash-stat-val { font-family: 'Cormorant Garamond', serif; font-size: 42px; font-weight: 300; color: var(--cream); line-height: 1; }
  .dash-stat-val.amber { color: var(--amber); }
  .dash-stat-val.green { color: var(--green); }
  .dash-stat-val.red   { color: var(--red); }
  .dash-stat-sub { font-size: 10px; font-weight: 200; color: var(--muted); margin-top: 6px; letter-spacing: 0.04em; }

  /* ── Section title ── */
  .dash-section-title {
    font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--gold); opacity: 0.8; margin-bottom: 20px;
    display: flex; align-items: center; gap: 14px;
  }
  .dash-section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* ── Submit Cards ── */
  .dash-submit-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 56px; }
  .dash-submit-card {
    border: 1px solid var(--border); background: rgba(17,17,24,0.85);
    padding: 36px 32px; position: relative; overflow: hidden;
    cursor: pointer; transition: border-color 0.3s, background 0.3s;
    animation: dash-fadein 0.5s ease both;
    display: flex; flex-direction: column; align-items: flex-start; gap: 16px;
  }
  .dash-submit-card:nth-child(1) { animation-delay: 0.20s; }
  .dash-submit-card:nth-child(2) { animation-delay: 0.27s; }
  .dash-submit-card:nth-child(3) { animation-delay: 0.34s; }
  .dash-submit-card:hover { border-color: var(--gold); background: rgba(200,169,81,0.05); }
  .dash-submit-card::before { content: ''; position: absolute; top: 0; left: 0; width: 56px; height: 1px; background: var(--gold); transition: width 0.4s ease; }
  .dash-submit-card:hover::before { width: 100%; }
  .dash-submit-card-icon { width: 52px; height: 52px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 22px; transition: border-color 0.3s, background 0.3s; }
  .dash-submit-card:hover .dash-submit-card-icon { border-color: var(--gold-line); background: var(--gold-dim); }
  .dash-submit-card-label { font-family: 'Cinzel', serif; font-size: 9px; font-weight: 400; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); }
  .dash-submit-card-title { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 300; color: var(--cream); line-height: 1.1; }
  .dash-submit-card-desc { font-size: 11px; font-weight: 200; color: var(--muted); line-height: 1.7; }
  .dash-submit-card-cta {
    margin-top: auto; font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase;
    padding: 9px 20px; border: 1px solid var(--gold); color: var(--gold);
    background: transparent; position: relative; overflow: hidden; transition: color 0.3s; cursor: pointer;
  }
  .dash-submit-card-cta::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .dash-submit-card:hover .dash-submit-card-cta::before { transform: scaleX(1); }
  .dash-submit-card:hover .dash-submit-card-cta { color: var(--black); }
  .dash-submit-card-cta span { position: relative; z-index: 1; }

  /* ── Listings tab bar ── */
  .dash-tab-row { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .dash-tab-btn {
    font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.22em; text-transform: uppercase;
    padding: 7px 18px; border: 1px solid var(--border); color: var(--muted);
    background: transparent; cursor: pointer; transition: border-color 0.2s, color 0.2s;
  }
  .dash-tab-btn.active { border-color: var(--gold-line); color: var(--gold); background: var(--gold-dim); }
  .dash-tab-btn:not(.active):hover { color: var(--cream); }

  /* ── Listings cards grid ── */
  .dash-listings-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-bottom: 56px; }
  .dash-listing-card {
    border: 1px solid var(--border); background: rgba(17,17,24,0.85);
    padding: 28px 28px 22px; position: relative; overflow: hidden;
    animation: dash-fadein 0.4s ease both;
  }
  .dash-listing-card::before { content: ''; position: absolute; top: 0; left: 0; width: 44px; height: 1px; background: var(--gold); }
  .dash-listing-card-type { font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); opacity: 0.7; margin-bottom: 10px; }
  .dash-listing-card-name { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; color: var(--cream); margin-bottom: 6px; line-height: 1.2; }
  .dash-listing-card-meta { font-size: 11px; font-weight: 200; color: var(--muted); line-height: 1.7; margin-bottom: 20px; }
  .dash-listing-card-meta span { color: var(--cream); }
  .dash-listing-card-badge {
    display: inline-flex; align-items: center; gap: 5px; margin-bottom: 14px;
    font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 4px 10px; border: 1px solid rgba(141,184,122,0.4);
    color: var(--green); background: var(--green-dim);
  }
  .dash-listing-card-badge-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
  .dash-listing-card-actions { display: flex; gap: 8px; border-top: 1px solid var(--border); padding-top: 16px; }
  .dash-btn-edit, .dash-btn-delete {
    font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 7px 16px; border: 1px solid; cursor: pointer; background: transparent;
    transition: background 0.2s, color 0.2s;
  }
  .dash-btn-edit { color: var(--gold); border-color: var(--gold-line); }
  .dash-btn-edit:hover { background: var(--gold-dim); }
  .dash-btn-delete { color: var(--red); border-color: rgba(224,128,128,0.4); }
  .dash-btn-delete:hover { background: var(--red-dim); }
  .dash-btn-delete:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Requests table ── */
  .dash-recent-wrap {
    border: 1px solid var(--border); background: rgba(17,17,24,0.85);
    position: relative; overflow: hidden; animation: dash-fadein 0.5s 0.4s ease both;
  }
  .dash-recent-wrap::before { content: ''; position: absolute; top: 0; left: 0; width: 80px; height: 1px; background: var(--gold); }
  .dash-recent-head {
    padding: 18px 28px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
  }
  .dash-recent-head-title { font-size: 9px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.8; }
  .dash-history-filters { display: flex; gap: 6px; flex-wrap: wrap; }
  .dash-history-filter-btn {
    font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.18em; text-transform: uppercase;
    padding: 5px 14px; border: 1px solid var(--border); color: var(--muted);
    background: transparent; cursor: pointer; transition: border-color 0.2s, color 0.2s;
  }
  .dash-history-filter-btn.active { border-color: var(--gold-line); color: var(--gold); background: var(--gold-dim); }
  .dash-history-filter-btn:not(.active):hover { color: var(--cream); }
  .dash-recent-table { width: 100%; border-collapse: collapse; }
  .dash-recent-table th {
    padding: 12px 20px; text-align: left;
    font-size: 8px; font-weight: 300; letter-spacing: 0.32em; text-transform: uppercase;
    color: var(--gold); opacity: 0.6; border-bottom: 1px solid var(--border); background: rgba(10,10,10,0.3);
  }
  .dash-recent-table td { padding: 14px 20px; border-bottom: 1px solid rgba(200,169,81,0.06); vertical-align: middle; }
  .dash-recent-table tr:last-child td { border-bottom: none; }
  .dash-recent-table tr { transition: background 0.15s; }
  .dash-recent-table tr:hover td { background: rgba(200,169,81,0.02); }
  .dash-rt-name { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: var(--cream); }
  .dash-rt-sub  { font-size: 10px; font-weight: 200; color: var(--muted); margin-top: 2px; }
  .dash-rt-type { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }

  /* ── Status badges ── */
  .dash-status {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 4px 10px; border: 1px solid; white-space: nowrap;
  }
  .dash-status.pending  { color: var(--amber); border-color: rgba(224,184,112,0.4); background: var(--amber-dim); }
  .dash-status.accepted { color: var(--green); border-color: rgba(141,184,122,0.4); background: var(--green-dim); }
  .dash-status.rejected { color: var(--red);   border-color: rgba(224,128,128,0.4); background: var(--red-dim); }
  .dash-status-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; background: currentColor; }

  /* ── Rejection reason block (provider-facing) ── */
  .prov-rejection-block {
    margin-top: 10px;
    border: 1px solid rgba(224,128,128,0.22);
    background: rgba(224,128,128,0.06);
    padding: 12px 14px;
    position: relative;
  }
  .prov-rejection-block::before {
    content: '';
    position: absolute; top: 0; left: 0;
    width: 28px; height: 1px;
    background: var(--red); opacity: 0.6;
  }
  .prov-rejection-eyebrow {
    font-family: 'Cinzel', serif;
    font-size: 7px; letter-spacing: 0.32em; text-transform: uppercase;
    color: var(--red); opacity: 0.75;
    margin-bottom: 6px;
    display: flex; align-items: center; gap: 6px;
  }
  .prov-rejection-eyebrow::before {
    content: '✗';
    font-size: 8px;
  }
  .prov-rejection-text {
    font-size: 11px; font-weight: 200; line-height: 1.65;
    color: rgba(224,128,128,0.88); letter-spacing: 0.03em;
  }
  .prov-rejection-reapply {
    margin-top: 10px;
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 5px 14px; border: 1px solid rgba(200,169,81,0.3); color: var(--gold);
    background: transparent; cursor: pointer; transition: background 0.2s, border-color 0.2s;
  }
  .prov-rejection-reapply:hover { background: var(--gold-dim); border-color: var(--gold-line); }

  /* ── Row actions ── */
  .dash-rt-actions { display: flex; gap: 6px; }
  .dash-rt-btn-edit, .dash-rt-btn-delete {
    font-family: 'Cinzel', serif; font-size: 6px; letter-spacing: 0.18em; text-transform: uppercase;
    padding: 5px 12px; border: 1px solid; cursor: pointer; background: transparent;
    transition: background 0.2s, color 0.2s; white-space: nowrap;
  }
  .dash-rt-btn-edit  { color: var(--gold); border-color: var(--gold-line); }
  .dash-rt-btn-edit:hover  { background: var(--gold-dim); }
  .dash-rt-btn-delete { color: var(--red);  border-color: rgba(224,128,128,0.4); }
  .dash-rt-btn-delete:hover { background: var(--red-dim); }
  .dash-rt-locked {
    font-family: 'Cinzel', serif; font-size: 6px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--muted); opacity: 0.45; padding: 5px 0; display: inline-flex; align-items: center; gap: 5px;
  }

  /* ── Modal ── */
  .prov-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.75); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; padding: 24px;
    animation: dash-fadein 0.2s ease;
  }
  .prov-modal {
    background: var(--obsidian); border: 1px solid var(--gold-line);
    width: 100%; max-width: 720px; max-height: 88vh; overflow-y: auto;
    position: relative;
    scrollbar-width: thin; scrollbar-color: var(--gold-line) transparent;
  }
  .prov-modal::before { content: ''; position: absolute; top: 0; left: 0; width: 80px; height: 1px; background: var(--gold); }
  .prov-modal-head {
    padding: 32px 36px 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  }
  .prov-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300; color: var(--cream); }
  .prov-modal-sub { font-size: 11px; font-weight: 200; color: var(--muted); margin-top: 4px; letter-spacing: 0.04em; }
  .prov-modal-close {
    background: transparent; border: 1px solid var(--border); color: var(--muted);
    width: 36px; height: 36px; cursor: pointer; font-size: 18px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; transition: border-color 0.2s, color 0.2s;
  }
  .prov-modal-close:hover { border-color: var(--red); color: var(--red); }
  .prov-modal-body { padding: 32px 36px; }

  /* ── Form shared ── */
  .prov-form { display: flex; flex-direction: column; gap: 20px; }
  .prov-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .prov-form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .prov-field { display: flex; flex-direction: column; gap: 8px; }
  .prov-label { font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.8; }
  .prov-input, .prov-select, .prov-textarea {
    background: rgba(10,10,10,0.6); border: 1px solid var(--border); color: var(--cream);
    font-family: 'Raleway', sans-serif; font-size: 13px; font-weight: 300;
    padding: 12px 16px; outline: none; transition: border-color 0.2s; width: 100%;
  }
  .prov-input:focus, .prov-select:focus, .prov-textarea:focus { border-color: var(--gold-line); }
  .prov-input::placeholder, .prov-textarea::placeholder { color: var(--muted); font-size: 12px; }
  .prov-select { appearance: none; cursor: pointer; }
  .prov-select option { background: var(--obsidian); }
  .prov-textarea { resize: vertical; min-height: 90px; }
  .prov-checkbox-row { display: flex; align-items: center; gap: 12px; }
  .prov-checkbox { width: 16px; height: 16px; accent-color: var(--gold); cursor: pointer; }
  .prov-checkbox-label { font-size: 12px; font-weight: 200; color: var(--muted); }
  .prov-form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; padding-top: 20px; border-top: 1px solid var(--border); }
  .prov-btn-cancel {
    font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 10px 22px; border: 1px solid var(--border); color: var(--muted);
    background: transparent; cursor: pointer; transition: border-color 0.2s, color 0.2s;
  }
  .prov-btn-cancel:hover { border-color: var(--gold-line); color: var(--cream); }
  .prov-btn-submit {
    font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 10px 28px; border: 1px solid var(--gold); color: var(--black);
    background: linear-gradient(90deg, var(--gold), #A8843A); cursor: pointer; transition: opacity 0.2s;
  }
  .prov-btn-submit:disabled { opacity: 0.45; cursor: not-allowed; }
  .prov-btn-submit:not(:disabled):hover { opacity: 0.88; }
  .prov-alert {
    padding: 12px 16px; font-size: 12px; font-weight: 300; letter-spacing: 0.04em;
    border: 1px solid; display: flex; align-items: center; gap: 10px;
  }
  .prov-alert.success { color: var(--green); border-color: rgba(141,184,122,0.35); background: var(--green-dim); }
  .prov-alert.error   { color: var(--red);   border-color: rgba(224,128,128,0.35); background: var(--red-dim); }

  /* ── Section divider ── */
  .prov-section-divider {
    font-size: 8px; letter-spacing: 0.38em; text-transform: uppercase;
    color: var(--gold); opacity: 0.65;
    display: flex; align-items: center; gap: 12px; margin: 4px 0;
  }
  .prov-section-divider::after { content:''; flex:1; height:1px; background:var(--border); }

  /* ── Image URL rows ── */
  .prov-img-row { display:flex; gap:8px; align-items:center; margin-bottom:8px; }
  .prov-img-row .prov-input { flex:1; }
  .prov-img-remove {
    flex-shrink:0; width:32px; height:32px;
    border:1px solid rgba(224,128,128,0.4); color:var(--red);
    background:transparent; cursor:pointer; font-size:14px;
    display:flex; align-items:center; justify-content:center; transition:background 0.2s;
  }
  .prov-img-remove:hover { background:var(--red-dim); }
  .prov-add-url {
    font-family:'Cinzel',serif; font-size:7px; letter-spacing:0.2em; text-transform:uppercase;
    padding:7px 16px; border:1px dashed var(--border); color:var(--muted);
    background:transparent; cursor:pointer; transition:border-color 0.2s, color 0.2s; align-self:flex-start;
  }
  .prov-add-url:hover { border-color:var(--gold-line); color:var(--gold); }

  /* ── Room category cards ── */
  .prov-room-card {
    border:1px solid var(--border); background:rgba(10,10,10,0.45);
    padding:18px; display:flex; flex-direction:column; gap:12px; margin-bottom:12px; position:relative;
  }
  .prov-room-card-header { display:flex; align-items:center; justify-content:space-between; }
  .prov-room-card-title { font-family:'Cinzel',serif; font-size:7.5px; letter-spacing:0.22em; text-transform:uppercase; color:var(--gold); }
  .prov-room-card-eff { font-size:10px; color:var(--gold); opacity:0.7; }

  /* ── Bed type chips ── */
  .prov-bed-chips { display:flex; gap:6px; flex-wrap:wrap; }
  .prov-bed-chip {
    font-family:'Cinzel',serif; font-size:7px; letter-spacing:0.16em; text-transform:uppercase;
    padding:5px 10px; border:1px solid var(--border); color:var(--muted);
    background:transparent; cursor:pointer; transition:border-color 0.2s, color 0.2s, background 0.2s;
  }
  .prov-bed-chip.selected { border-color:var(--gold-line); color:var(--gold-light); background:var(--gold-dim); }

  /* ── Meal plan cards ── */
  .prov-meal-card {
    border:1px solid var(--border); background:rgba(10,10,10,0.45);
    padding:16px; display:flex; flex-direction:column; gap:10px; margin-bottom:10px;
  }
  .prov-meal-card-header { display:flex; align-items:center; justify-content:space-between; }
  .prov-meal-card-title { font-family:'Cinzel',serif; font-size:7.5px; letter-spacing:0.22em; text-transform:uppercase; color:var(--gold); }

  /* ── Amenity chips ── */
  .prov-amenity-grid { display:flex; gap:6px; flex-wrap:wrap; }
  .prov-amenity-chip {
    font-family:'Cinzel',serif; font-size:7px; letter-spacing:0.14em; text-transform:uppercase;
    padding:5px 12px; border:1px solid var(--border); color:var(--muted);
    background:transparent; cursor:pointer; transition:border-color 0.2s, color 0.2s, background 0.2s;
  }
  .prov-amenity-chip.selected { border-color:var(--gold-line); color:var(--gold-light); background:var(--gold-dim); }

  /* ── Preset row ── */
  .prov-preset-row { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; }
  .prov-preset-btn {
    font-family:'Cinzel',serif; font-size:7px; letter-spacing:0.16em; text-transform:uppercase;
    padding:5px 12px; border:1px dashed var(--border); color:var(--muted);
    background:transparent; cursor:pointer; transition:border-color 0.2s, color 0.2s;
  }
  .prov-preset-btn:hover { border-color:var(--gold-line); color:var(--gold); }

  /* ── VenueForm extras ── */
  .prov-event-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(155px,1fr)); gap:8px; }
  .prov-event-item {
    border:1px solid var(--border); padding:10px 12px;
    display:flex; flex-direction:column; gap:7px;
    transition:border-color 0.2s, background 0.2s; cursor:pointer;
  }
  .prov-event-item.selected { border-color:var(--gold-line); background:var(--gold-dim); }
  .prov-event-item-top { display:flex; align-items:center; gap:8px; }
  .prov-event-checkbox { width:14px; height:14px; accent-color:var(--gold); cursor:pointer; flex-shrink:0; }
  .prov-event-name { font-family:'Cinzel',serif; font-size:7.5px; letter-spacing:0.18em; text-transform:uppercase; color:var(--cream); line-height:1.3; }
  .prov-event-multiplier-row { display:flex; align-items:center; gap:6px; }
  .prov-event-mult-label { font-size:9px; color:var(--muted); white-space:nowrap; }
  .prov-event-mult-input {
    width:60px; background:rgba(10,10,10,0.7); border:1px solid var(--border);
    color:var(--gold); font-family:'Raleway',sans-serif; font-size:12px;
    padding:4px 8px; outline:none; transition:border-color 0.2s;
  }
  .prov-event-mult-input:focus { border-color:var(--gold-line); }
  .prov-event-eff { font-size:9px; color:var(--gold); opacity:0.7; }
  .prov-event-actions { display:flex; gap:8px; margin-bottom:10px; align-items:center; flex-wrap:wrap; }
  .prov-event-action-btn {
    font-family:'Cinzel',serif; font-size:7px; letter-spacing:0.18em; text-transform:uppercase;
    padding:5px 12px; border:1px solid var(--border); color:var(--muted);
    background:transparent; cursor:pointer; transition:border-color 0.2s, color 0.2s;
  }
  .prov-event-action-btn:hover { border-color:var(--gold-line); color:var(--gold); }
  .prov-event-search {
    flex:1; min-width:140px; background:rgba(10,10,10,0.6); border:1px solid var(--border);
    color:var(--cream); font-family:'Raleway',sans-serif; font-size:12px; font-weight:300;
    padding:5px 10px; outline:none; transition:border-color 0.2s;
  }
  .prov-event-search:focus { border-color:var(--gold-line); }
  .prov-event-search::placeholder { color:var(--muted); font-size:11px; }
  .prov-tier-card { border:1px solid var(--border); background:rgba(10,10,10,0.4); padding:16px; display:flex; flex-direction:column; gap:8px; margin-bottom:10px; }
  .prov-tier-title { font-family:'Cinzel',serif; font-size:7px; letter-spacing:0.24em; text-transform:uppercase; color:var(--gold); opacity:0.85; }
  .prov-tier-input {
    width:72px; background:rgba(10,10,10,0.7); border:1px solid var(--border);
    color:var(--gold); font-family:'Raleway',sans-serif; font-size:12px;
    padding:5px 8px; outline:none; transition:border-color 0.2s;
  }
  .prov-tier-input:focus { border-color:var(--gold-line); }
  .prov-tier-eff { font-size:9px; color:var(--gold); opacity:0.7; }

  /* ── Confirm dialog ── */
  .dash-confirm-overlay {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,0.8); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .dash-confirm-box {
    background: var(--obsidian); border: 1px solid rgba(224,128,128,0.4);
    padding: 40px; max-width: 420px; width: 100%; text-align: center; position: relative;
  }
  .dash-confirm-box::before { content: ''; position: absolute; top: 0; left: 0; width: 60px; height: 1px; background: var(--red); }
  .dash-confirm-title { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 300; color: var(--cream); margin-bottom: 12px; }
  .dash-confirm-sub { font-size: 12px; font-weight: 200; color: var(--muted); margin-bottom: 28px; line-height: 1.6; }
  .dash-confirm-actions { display: flex; gap: 12px; justify-content: center; }
  .dash-confirm-cancel {
    font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 10px 22px; border: 1px solid var(--border); color: var(--muted);
    background: transparent; cursor: pointer; transition: border-color 0.2s, color 0.2s;
  }
  .dash-confirm-cancel:hover { border-color: var(--gold-line); color: var(--cream); }
  .dash-confirm-delete {
    font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 10px 22px; border: 1px solid rgba(224,128,128,0.5); color: var(--red);
    background: var(--red-dim); cursor: pointer; transition: background 0.2s;
  }
  .dash-confirm-delete:hover { background: rgba(224,128,128,0.2); }

  /* ── Loading / Empty ── */
  .dash-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 16px; }
  .dash-spinner { width: 32px; height: 32px; border: 1.5px solid var(--border); border-top-color: var(--gold); border-radius: 50%; animation: dash-spin 0.9s linear infinite; }
  @keyframes dash-spin { to { transform: rotate(360deg); } }
  .dash-loading-text { font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.3em; text-transform: uppercase; }
  .dash-empty { text-align: center; padding: 48px; font-size: 12px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }

  /* ── Footer ── */
  .dash-footer {
    position: relative; z-index: 1; border-top: 1px solid var(--border); padding: 32px 56px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(17,17,24,0.6); backdrop-filter: blur(8px);
  }
  .dash-footer-copy { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }
  .dash-footer-copy span { color: var(--gold); }

  @media (max-width: 860px) {
    .dash-topbar { padding: 18px 24px; }
    .dash-main { padding: 40px 24px 60px; }
    .dash-stats { grid-template-columns: repeat(2, 1fr); }
    .dash-submit-grid { grid-template-columns: 1fr; }
    .dash-listings-grid { grid-template-columns: 1fr; }
    .dash-footer { padding: 24px; flex-direction: column; gap: 10px; text-align: center; }
    .prov-form-row, .prov-form-row-3 { grid-template-columns: 1fr; }
    .prov-modal-head, .prov-modal-body { padding: 24px 20px; }
    .dash-recent-table th:nth-child(3), .dash-recent-table td:nth-child(3) { display: none; }
  }
  @media (max-width: 1100px) and (min-width: 861px) {
    .dash-submit-grid { grid-template-columns: 1fr 1fr; }
  }
`;

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const fmt = (n) => (n ?? 0).toLocaleString();
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const BED_OPTIONS = ["Single", "Double", "Queen", "King", "Twin"];

const HOTEL_AMENITIES = [
  "Swimming Pool",
  "Gym / Fitness",
  "Spa & Wellness",
  "Rooftop Terrace",
  "Restaurant",
  "Bar / Lounge",
  "Room Service",
  "Concierge",
  "Valet Parking",
  "Free Parking",
  "Airport Shuttle",
  "Business Center",
  "Conference Rooms",
  "Free Wi-Fi",
  "Kids Club",
  "Pet Friendly",
  "Beach Access",
  "Casino",
  "Laundry Service",
  "24h Front Desk",
];

const ROOM_AMENITIES = [
  "Air Conditioning",
  "Mini Bar",
  "Safe",
  "Flat-screen TV",
  "Bathtub",
  "Rain Shower",
  "Balcony",
  "City View",
  "Sea View",
  "Garden View",
  "Coffee Machine",
  "Kitchenette",
  "Sofa Bed",
  "Dressing Room",
  "Blackout Curtains",
  "Soundproofing",
];

const DEFAULT_ROOM_CATEGORIES = [
  {
    id: "standard",
    name: "Standard Room",
    pricePerNight: 100,
    maxOccupancy: 2,
    bedOptions: ["Double"],
    totalRooms: 20,
    description: "",
    amenities: [],
    images: [],
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    pricePerNight: 150,
    maxOccupancy: 2,
    bedOptions: ["Queen"],
    totalRooms: 15,
    description: "",
    amenities: [],
    images: [],
  },
  {
    id: "suite",
    name: "Junior Suite",
    pricePerNight: 250,
    maxOccupancy: 3,
    bedOptions: ["King"],
    totalRooms: 8,
    description: "",
    amenities: [],
    images: [],
  },
  {
    id: "presidential",
    name: "Presidential Suite",
    pricePerNight: 600,
    maxOccupancy: 4,
    bedOptions: ["King"],
    totalRooms: 2,
    description: "",
    amenities: [],
    images: [],
  },
];

const DEFAULT_MEAL_PLANS = [
  {
    id: "room_only",
    name: "Room Only",
    pricePerPersonPerNight: 0,
    description: "No meals included.",
    isAvailable: true,
  },
  {
    id: "breakfast",
    name: "Bed & Breakfast",
    pricePerPersonPerNight: 25,
    description: "Full buffet breakfast daily.",
    isAvailable: true,
  },
  {
    id: "half_board",
    name: "Half Board",
    pricePerPersonPerNight: 55,
    description: "Breakfast + dinner daily.",
    isAvailable: true,
  },
  {
    id: "full_board",
    name: "Full Board",
    pricePerPersonPerNight: 85,
    description: "Breakfast, lunch & dinner.",
    isAvailable: true,
  },
  {
    id: "all_inclusive",
    name: "All Inclusive",
    pricePerPersonPerNight: 130,
    description: "All meals, snacks & selected drinks.",
    isAvailable: true,
  },
];

const EVENT_TYPES = [
  { value: "wedding", label: "Wedding", icon: "💍" },
  { value: "engagement", label: "Engagement", icon: "💎" },
  { value: "anniversary", label: "Anniversary", icon: "🥂" },
  { value: "birthday", label: "Birthday Party", icon: "🎂" },
  { value: "graduation", label: "Graduation", icon: "🎓" },
  { value: "prom", label: "Prom", icon: "🌟" },
  { value: "gala", label: "Gala / Fundraiser", icon: "🎩" },
  { value: "concert", label: "Concert", icon: "🎵" },
  { value: "corporate", label: "Corporate Event", icon: "💼" },
  { value: "conference", label: "Conference", icon: "🎤" },
  { value: "exhibition", label: "Exhibition", icon: "🖼️" },
  { value: "business", label: "Business Meeting", icon: "🤝" },
  { value: "baby_shower", label: "Baby Shower", icon: "🍼" },
  { value: "bridal_shower", label: "Bridal Shower", icon: "👰" },
  { value: "fashion_show", label: "Fashion Show", icon: "👗" },
  { value: "festival", label: "Festival", icon: "🎪" },
  { value: "charity", label: "Charity Event", icon: "❤️" },
  { value: "networking", label: "Networking", icon: "🌐" },
  { value: "seminar", label: "Seminar", icon: "📚" },
  { value: "workshop", label: "Workshop", icon: "🔧" },
  { value: "product_launch", label: "Product Launch", icon: "🚀" },
  { value: "award_ceremony", label: "Award Ceremony", icon: "🏆" },
  { value: "photoshoot", label: "Photoshoot", icon: "📸" },
  { value: "private_party", label: "Private Party", icon: "🎉" },
  { value: "retirement", label: "Retirement Party", icon: "🌅" },
  { value: "reunion", label: "Reunion", icon: "👨‍👩‍👧‍👦" },
  { value: "sports_event", label: "Sports Event", icon: "⚽" },
  { value: "cultural_event", label: "Cultural Event", icon: "🎭" },
  { value: "religious_event", label: "Religious Event", icon: "🕊️" },
  { value: "holiday_party", label: "Holiday Party", icon: "🎄" },
  { value: "music_festival", label: "Music Festival", icon: "🎸" },
  { value: "gaming_event", label: "Gaming Event", icon: "🎮" },
  { value: "vip_event", label: "VIP Event", icon: "👑" },
  { value: "cocktail_party", label: "Cocktail Party", icon: "🍸" },
  { value: "dinner_party", label: "Dinner Party", icon: "🍽️" },
  { value: "other", label: "Other", icon: "✨" },
];

/* ═══════════════════════════════════════════════
   REJECTION REASON BLOCK  ← new component
═══════════════════════════════════════════════ */
function RejectionBlock({ reason, onReapply }) {
  return (
    <div className="prov-rejection-block">
      <div className="prov-rejection-eyebrow">Admin Note</div>
      <div className="prov-rejection-text">{reason}</div>
      {onReapply && (
        <button className="prov-rejection-reapply" onClick={onReapply}>
          ↺ Reapply
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   VENUE FORM
═══════════════════════════════════════════════ */
function VenueForm({ onClose, onSuccess, initial = null, editId = null }) {
  const isEdit = !!editId;
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    location: initial?.location ?? "",
    capacity: initial?.capacity ?? "",
    pricePerHour: initial?.pricePerHour ?? "",
    description: initial?.description ?? "",
    isAvailable: initial?.isAvailable ?? true,
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const [images, setImages] = useState(
    Array.isArray(initial?.images) && initial.images.length
      ? initial.images
      : [""],
  );
  const setImg = (i, v) =>
    setImages((p) => p.map((u, idx) => (idx === i ? v : u)));
  const addImg = () => setImages((p) => [...p, ""]);
  const removeImg = (i) =>
    setImages((p) => (p.length > 1 ? p.filter((_, idx) => idx !== i) : [""]));

  const initEventPricing = (() => {
    const src = initial?.eventTypePricing;
    if (!src) return {};
    const raw = src instanceof Map ? Object.fromEntries(src) : src;
    return Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, String(v)]),
    );
  })();
  const [eventTypePricing, setEventTypePricing] = useState(initEventPricing);
  const [eventTypeSearch, setEventTypeSearch] = useState("");

  const filteredEventTypes = EVENT_TYPES.filter(
    ({ value, label }) =>
      !eventTypeSearch ||
      label.toLowerCase().includes(eventTypeSearch.toLowerCase()) ||
      value.toLowerCase().includes(eventTypeSearch.toLowerCase()),
  );
  const selectAllVisible = () =>
    setEventTypePricing((prev) => {
      const next = { ...prev };
      filteredEventTypes.forEach(({ value }) => {
        if (next[value] === undefined) next[value] = "1.0";
      });
      return next;
    });
  const clearAllVisible = () =>
    setEventTypePricing((prev) => {
      const next = { ...prev };
      filteredEventTypes.forEach(({ value }) => delete next[value]);
      return next;
    });
  const toggleType = (value) =>
    setEventTypePricing((prev) => {
      if (prev[value] !== undefined) {
        const next = { ...prev };
        delete next[value];
        return next;
      }
      return { ...prev, [value]: "1.0" };
    });
  const setMult = (value, v) =>
    setEventTypePricing((prev) => ({ ...prev, [value]: v }));

  const initTiers = (() => {
    const t = initial?.guestTierPricing;
    if (Array.isArray(t) && t.length)
      return t.map((tier) => ({
        min: String(tier.min ?? ""),
        max: String(tier.max === 999999 ? "" : (tier.max ?? "")),
        multiplier: String(tier.multiplier ?? "1.0"),
        label: tier.label ?? "",
      }));
    return [
      { min: "1", max: "50", multiplier: "1.0", label: "1–50 guests" },
      { min: "51", max: "", multiplier: "1.25", label: "51+ guests" },
    ];
  })();
  const [tiers, setTiers] = useState(initTiers);
  const setTierField = (i, field, value) =>
    setTiers((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)),
    );
  const addTier = () =>
    setTiers((prev) => {
      const last = prev[prev.length - 1];
      const lastMax = Number(last?.max);
      const newMin = last?.max && !isNaN(lastMax) ? String(lastMax + 1) : "";
      return [...prev, { min: newMin, max: "", multiplier: "1.0", label: "" }];
    });
  const removeTier = (i) =>
    setTiers((prev) =>
      prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev,
    );

  const TIER_PRESETS = [
    {
      label: "Standard (4 tiers)",
      tiers: [
        { min: "1", max: "50", multiplier: "1.0", label: "1–50 guests" },
        { min: "51", max: "150", multiplier: "1.15", label: "51–150 guests" },
        { min: "151", max: "300", multiplier: "1.3", label: "151–300 guests" },
        { min: "301", max: "", multiplier: "1.5", label: "301+ guests" },
      ],
    },
    {
      label: "Simple (2 tiers)",
      tiers: [
        { min: "1", max: "100", multiplier: "1.0", label: "1–100 guests" },
        { min: "101", max: "", multiplier: "1.25", label: "101+ guests" },
      ],
    },
    {
      label: "Flat rate",
      tiers: [
        { min: "1", max: "", multiplier: "1.0", label: "All guest counts" },
      ],
    },
  ];

  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.location ||
      !form.capacity ||
      !form.pricePerHour ||
      !form.description
    ) {
      setAlert({ type: "error", msg: "Please fill in all required fields." });
      return;
    }
    if (Object.keys(eventTypePricing).length === 0) {
      setAlert({ type: "error", msg: "Select at least one event type." });
      return;
    }
    setSubmitting(true);
    try {
      const eventTypePricingNum = Object.fromEntries(
        Object.entries(eventTypePricing).map(([k, v]) => [k, Number(v) || 1.0]),
      );
      const guestTierPricing = tiers.map((t) => {
        const min = Number(t.min);
        const maxRaw = t.max === "" || t.max === null ? null : Number(t.max);
        const max = maxRaw === null || isNaN(maxRaw) ? 999999 : maxRaw;
        return {
          min,
          max,
          multiplier: Number(t.multiplier) || 1.0,
          label:
            t.label.trim() ||
            (max === 999999 ? `${min}+ guests` : `${min}–${max} guests`),
        };
      });
      const payload = {
        name: form.name,
        location: form.location,
        capacity: Number(form.capacity),
        pricePerHour: Number(form.pricePerHour),
        description: form.description,
        isAvailable: form.isAvailable,
        images: images.map((u) => u.trim()).filter(Boolean),
        eventType: Object.keys(eventTypePricingNum)[0] ?? "other",
        eventTypePricing: eventTypePricingNum,
        guestTierPricing,
      };
      if (isEdit) {
        await API.put(`/provider/venues/${editId}`, payload);
        setAlert({ type: "success", msg: "Venue updated successfully." });
      } else {
        await API.post("/provider/venues/request", payload);
        setAlert({
          type: "success",
          msg: "Venue request submitted. Awaiting admin approval.",
        });
      }
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setAlert({
        type: "error",
        msg: err.response?.data?.message ?? "Failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const basePrice = Number(form.pricePerHour) || 0;

  return (
    <div className="prov-form">
      {alert && (
        <div className={`prov-alert ${alert.type}`}>
          {alert.type === "success" ? "✓" : "✗"} {alert.msg}
        </div>
      )}
      <div className="prov-form-row">
        <div className="prov-field">
          <label className="prov-label">Venue Name *</label>
          <input
            className="prov-input"
            placeholder="e.g. The Grand Ballroom"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div className="prov-field">
          <label className="prov-label">Location *</label>
          <input
            className="prov-input"
            placeholder="e.g. Cairo, Egypt"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>
      </div>
      <div className="prov-form-row">
        <div className="prov-field">
          <label className="prov-label">Max Guests *</label>
          <input
            className="prov-input"
            type="number"
            min="1"
            placeholder="e.g. 300"
            value={form.capacity}
            onChange={(e) => set("capacity", e.target.value)}
          />
        </div>
        <div className="prov-field">
          <label className="prov-label">Base Price Per Hour (USD) *</label>
          <input
            className="prov-input"
            type="number"
            min="0"
            placeholder="e.g. 500"
            value={form.pricePerHour}
            onChange={(e) => set("pricePerHour", e.target.value)}
          />
        </div>
      </div>
      <div className="prov-field">
        <label className="prov-label">Description *</label>
        <textarea
          className="prov-textarea"
          placeholder="Describe the venue…"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>
      <div className="prov-field">
        <div className="prov-section-divider">◆ Image URLs</div>
        {images.map((url, i) => (
          <div className="prov-img-row" key={i}>
            <input
              className="prov-input"
              type="url"
              placeholder={`https://example.com/photo-${i + 1}.jpg`}
              value={url}
              onChange={(e) => setImg(i, e.target.value)}
            />
            <button className="prov-img-remove" onClick={() => removeImg(i)}>
              ✕
            </button>
          </div>
        ))}
        <button className="prov-add-url" onClick={addImg}>
          + Add Image URL
        </button>
      </div>
      <div className="prov-field">
        <div className="prov-section-divider">
          ◆ Event Types & Pricing Multipliers
        </div>
        <p
          style={{
            fontSize: 10,
            color: "var(--muted)",
            marginBottom: 12,
            fontWeight: 200,
            lineHeight: 1.6,
          }}
        >
          Select every event type this venue supports.
        </p>
        <div className="prov-event-actions">
          <input
            className="prov-event-search"
            type="text"
            placeholder="Search event types…"
            value={eventTypeSearch}
            onChange={(e) => setEventTypeSearch(e.target.value)}
          />
          <button className="prov-event-action-btn" onClick={selectAllVisible}>
            Select All{eventTypeSearch ? " Visible" : ""}
          </button>
          <button className="prov-event-action-btn" onClick={clearAllVisible}>
            Clear All{eventTypeSearch ? " Visible" : ""}
          </button>
          {Object.keys(eventTypePricing).length > 0 && (
            <span
              style={{
                fontSize: 9,
                color: "var(--gold)",
                opacity: 0.7,
                letterSpacing: "0.1em",
              }}
            >
              {Object.keys(eventTypePricing).length} selected
            </span>
          )}
        </div>
        <div className="prov-event-grid">
          {filteredEventTypes.map(({ value, label, icon }) => {
            const selected = eventTypePricing[value] !== undefined;
            const mult = Number(eventTypePricing[value]) || 1.0;
            return (
              <div
                key={value}
                className={`prov-event-item${selected ? " selected" : ""}`}
                onClick={() => toggleType(value)}
              >
                <div className="prov-event-item-top">
                  <input
                    className="prov-event-checkbox"
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleType(value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="prov-event-name">
                    {icon} {label}
                  </span>
                </div>
                {selected && (
                  <div
                    className="prov-event-multiplier-row"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="prov-event-mult-label">×</span>
                    <input
                      className="prov-event-mult-input"
                      type="number"
                      step="0.05"
                      min="0.1"
                      max="10"
                      value={eventTypePricing[value]}
                      onChange={(e) => setMult(value, e.target.value)}
                    />
                    {basePrice > 0 && (
                      <span className="prov-event-eff">
                        = ${(basePrice * mult).toFixed(0)}/hr
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="prov-field">
        <div className="prov-section-divider">◆ Guest Count Pricing Tiers</div>
        <div className="prov-preset-row">
          <span
            style={{
              fontSize: 9,
              color: "var(--muted)",
              alignSelf: "center",
              letterSpacing: "0.1em",
            }}
          >
            Quick fill:
          </span>
          {TIER_PRESETS.map((p) => (
            <button
              key={p.label}
              className="prov-preset-btn"
              onClick={() => setTiers(p.tiers)}
            >
              {p.label}
            </button>
          ))}
        </div>
        {tiers.map((tier, i) => (
          <div key={i} className="prov-tier-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="prov-tier-title">◆ Tier {i + 1}</div>
              {tiers.length > 1 && (
                <button
                  className="prov-img-remove"
                  onClick={() => removeTier(i)}
                  style={{ width: 26, height: 26, fontSize: 12 }}
                >
                  ✕
                </button>
              )}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
            >
              <div className="prov-field">
                <label className="prov-label">Min guests</label>
                <input
                  className="prov-input"
                  type="number"
                  min="0"
                  placeholder="e.g. 1"
                  value={tier.min}
                  onChange={(e) => setTierField(i, "min", e.target.value)}
                />
              </div>
              <div className="prov-field">
                <label className="prov-label">Max guests</label>
                <input
                  className="prov-input"
                  type="number"
                  min="0"
                  placeholder="∞ unlimited"
                  value={tier.max}
                  onChange={(e) => setTierField(i, "max", e.target.value)}
                />
              </div>
              <div className="prov-field">
                <label className="prov-label">Multiplier ×</label>
                <input
                  className="prov-tier-input"
                  type="number"
                  step="0.05"
                  min="0.1"
                  max="10"
                  placeholder="e.g. 1.2"
                  value={tier.multiplier}
                  onChange={(e) =>
                    setTierField(i, "multiplier", e.target.value)
                  }
                />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="prov-field" style={{ flex: 1 }}>
                <label className="prov-label">Label (optional)</label>
                <input
                  className="prov-input"
                  placeholder={
                    tier.max
                      ? `e.g. ${tier.min}–${tier.max} guests`
                      : `e.g. ${tier.min}+ guests`
                  }
                  value={tier.label}
                  onChange={(e) => setTierField(i, "label", e.target.value)}
                />
              </div>
              {basePrice > 0 && tier.multiplier && (
                <div
                  className="prov-tier-eff"
                  style={{ paddingTop: 20, whiteSpace: "nowrap" }}
                >
                  → ${(basePrice * (Number(tier.multiplier) || 1)).toFixed(0)}
                  /hr effective
                </div>
              )}
            </div>
          </div>
        ))}
        <button className="prov-add-url" onClick={addTier}>
          + Add Guest Tier
        </button>
      </div>
      <div className="prov-checkbox-row">
        <input
          className="prov-checkbox"
          type="checkbox"
          id="venue-avail"
          checked={form.isAvailable}
          onChange={(e) => set("isAvailable", e.target.checked)}
        />
        <label className="prov-checkbox-label" htmlFor="venue-avail">
          Available for booking immediately upon approval
        </label>
      </div>
      <div className="prov-form-actions">
        <button className="prov-btn-cancel" onClick={onClose}>
          Cancel
        </button>
        <button
          className="prov-btn-submit"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting
            ? "Saving…"
            : isEdit
              ? "Save Changes →"
              : "Submit Request →"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HOTEL FORM
═══════════════════════════════════════════════ */
function HotelForm({ onClose, onSuccess, initial = null, editId = null }) {
  const isEdit = !!editId;
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    location: initial?.location ?? "",
    stars: initial?.stars ?? "",
    description: initial?.description ?? "",
    checkInTime: initial?.checkInTime ?? "14:00",
    checkOutTime: initial?.checkOutTime ?? "12:00",
    cancellationPolicy: initial?.cancellationPolicy ?? "",
    contactEmail: initial?.contactEmail ?? "",
    contactPhone: initial?.contactPhone ?? "",
    website: initial?.website ?? "",
    petFriendly: initial?.petFriendly ?? false,
    smokingAllowed: initial?.smokingAllowed ?? false,
    isAvailable: initial?.isAvailable ?? true,
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const [images, setImages] = useState(
    Array.isArray(initial?.images) && initial.images.length
      ? initial.images
      : [""],
  );
  const setImg = (i, v) =>
    setImages((p) => p.map((u, idx) => (idx === i ? v : u)));
  const addImg = () => setImages((p) => [...p, ""]);
  const removeImg = (i) =>
    setImages((p) => (p.length > 1 ? p.filter((_, idx) => idx !== i) : [""]));

  const initAmenities = Array.isArray(initial?.amenities)
    ? initial.amenities
    : [];
  const [amenities, setAmenities] = useState(initAmenities);
  const toggleAmenity = (a) =>
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );

  const initRooms =
    Array.isArray(initial?.roomCategories) && initial.roomCategories.length
      ? initial.roomCategories.map((r) => ({
          id: r.id ?? "",
          name: r.name ?? "",
          description: r.description ?? "",
          pricePerNight: String(r.pricePerNight ?? ""),
          maxOccupancy: String(r.maxOccupancy ?? "2"),
          bedOptions: Array.isArray(r.bedOptions) ? r.bedOptions : [],
          amenities: Array.isArray(r.amenities) ? r.amenities : [],
          images: Array.isArray(r.images) ? r.images : [""],
          totalRooms: String(r.totalRooms ?? ""),
          isAvailable: r.isAvailable ?? true,
        }))
      : DEFAULT_ROOM_CATEGORIES.map((r) => ({
          ...r,
          pricePerNight: String(r.pricePerNight),
          maxOccupancy: String(r.maxOccupancy),
          totalRooms: String(r.totalRooms),
          images: [""],
        }));

  const [rooms, setRooms] = useState(initRooms);
  const setRoomField = (i, field, value) =>
    setRooms((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)),
    );
  const toggleBedOption = (i, bed) => {
    const room = rooms[i];
    setRoomField(
      i,
      "bedOptions",
      room.bedOptions.includes(bed)
        ? room.bedOptions.filter((b) => b !== bed)
        : [...room.bedOptions, bed],
    );
  };
  const toggleRoomAmenity = (i, a) => {
    const room = rooms[i];
    setRoomField(
      i,
      "amenities",
      room.amenities.includes(a)
        ? room.amenities.filter((x) => x !== a)
        : [...room.amenities, a],
    );
  };
  const setRoomImg = (ri, ii, v) =>
    setRooms((prev) =>
      prev.map((r, idx) =>
        idx === ri
          ? { ...r, images: r.images.map((u, jj) => (jj === ii ? v : u)) }
          : r,
      ),
    );
  const addRoomImg = (ri) =>
    setRooms((prev) =>
      prev.map((r, idx) =>
        idx === ri ? { ...r, images: [...r.images, ""] } : r,
      ),
    );
  const removeRoomImg = (ri, ii) =>
    setRooms((prev) =>
      prev.map((r, idx) =>
        idx === ri
          ? {
              ...r,
              images:
                r.images.length > 1
                  ? r.images.filter((_, jj) => jj !== ii)
                  : [""],
            }
          : r,
      ),
    );
  const addRoom = () =>
    setRooms((prev) => [
      ...prev,
      {
        id: `room_${Date.now()}`,
        name: "",
        description: "",
        pricePerNight: "",
        maxOccupancy: "2",
        bedOptions: [],
        amenities: [],
        images: [""],
        totalRooms: "",
        isAvailable: true,
      },
    ]);
  const removeRoom = (i) =>
    setRooms((prev) =>
      prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev,
    );

  const initMeals =
    Array.isArray(initial?.mealPlans) && initial.mealPlans.length
      ? initial.mealPlans.map((m) => ({
          ...m,
          pricePerPersonPerNight: String(m.pricePerPersonPerNight ?? "0"),
        }))
      : DEFAULT_MEAL_PLANS.map((m) => ({
          ...m,
          pricePerPersonPerNight: String(m.pricePerPersonPerNight),
        }));
  const [meals, setMeals] = useState(initMeals);
  const setMealField = (i, field, value) =>
    setMeals((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)),
    );
  const addMeal = () =>
    setMeals((prev) => [
      ...prev,
      {
        id: `plan_${Date.now()}`,
        name: "",
        description: "",
        pricePerPersonPerNight: "0",
        isAvailable: true,
      },
    ]);
  const removeMeal = (i) =>
    setMeals((prev) =>
      prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev,
    );

  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async () => {
    if (!form.name || !form.location || !form.stars || !form.description) {
      setAlert({
        type: "error",
        msg: "Please fill in all required fields (name, location, stars, description).",
      });
      return;
    }
    if (rooms.some((r) => !r.name || !r.pricePerNight)) {
      setAlert({
        type: "error",
        msg: "Each room category must have a name and price per night.",
      });
      return;
    }
    setSubmitting(true);
    try {
      const roomCategories = rooms.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        pricePerNight: Number(r.pricePerNight) || 0,
        maxOccupancy: Number(r.maxOccupancy) || 2,
        bedOptions: r.bedOptions,
        amenities: r.amenities,
        images: r.images.map((u) => u.trim()).filter(Boolean),
        totalRooms: Number(r.totalRooms) || 0,
        isAvailable: r.isAvailable,
      }));
      const mealPlans = meals.map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        pricePerPersonPerNight: Number(m.pricePerPersonPerNight) || 0,
        isAvailable: m.isAvailable,
      }));
      const payload = {
        name: form.name,
        location: form.location,
        stars: Number(form.stars),
        description: form.description,
        isAvailable: form.isAvailable,
        images: images.map((u) => u.trim()).filter(Boolean),
        amenities,
        roomCategories,
        mealPlans,
        checkInTime: form.checkInTime,
        checkOutTime: form.checkOutTime,
        cancellationPolicy: form.cancellationPolicy,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        website: form.website,
        petFriendly: form.petFriendly,
        smokingAllowed: form.smokingAllowed,
      };
      if (isEdit) {
        await API.put(`/provider/hotels/${editId}`, payload);
        setAlert({ type: "success", msg: "Hotel updated successfully." });
      } else {
        await API.post("/provider/hotels/request", payload);
        setAlert({
          type: "success",
          msg: "Hotel request submitted. Awaiting admin approval.",
        });
      }
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setAlert({
        type: "error",
        msg: err.response?.data?.message ?? "Failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="prov-form">
      {alert && (
        <div className={`prov-alert ${alert.type}`}>
          {alert.type === "success" ? "✓" : "✗"} {alert.msg}
        </div>
      )}
      <div className="prov-form-row">
        <div className="prov-field">
          <label className="prov-label">Hotel Name *</label>
          <input
            className="prov-input"
            placeholder="e.g. The Nile Palace"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div className="prov-field">
          <label className="prov-label">Location *</label>
          <input
            className="prov-input"
            placeholder="e.g. Giza, Egypt"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>
      </div>
      <div className="prov-form-row">
        <div className="prov-field">
          <label className="prov-label">Star Rating *</label>
          <select
            className="prov-select"
            value={form.stars}
            onChange={(e) => set("stars", e.target.value)}
          >
            <option value="">— Select —</option>
            {[1, 2, 3, 4, 5].map((s) => (
              <option key={s} value={s}>
                {s} Star{s > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="prov-field">
          <label className="prov-label">Contact Email</label>
          <input
            className="prov-input"
            type="email"
            placeholder="e.g. info@hotel.com"
            value={form.contactEmail}
            onChange={(e) => set("contactEmail", e.target.value)}
          />
        </div>
      </div>
      <div className="prov-form-row">
        <div className="prov-field">
          <label className="prov-label">Contact Phone</label>
          <input
            className="prov-input"
            placeholder="e.g. +20 10 0000 0000"
            value={form.contactPhone}
            onChange={(e) => set("contactPhone", e.target.value)}
          />
        </div>
        <div className="prov-field">
          <label className="prov-label">Website</label>
          <input
            className="prov-input"
            type="url"
            placeholder="https://myhotel.com"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </div>
      </div>
      <div className="prov-field">
        <label className="prov-label">Description *</label>
        <textarea
          className="prov-textarea"
          placeholder="Describe the hotel…"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>
      <div className="prov-section-divider">◆ Policies</div>
      <div className="prov-form-row">
        <div className="prov-field">
          <label className="prov-label">Check-In Time</label>
          <input
            className="prov-input"
            type="time"
            value={form.checkInTime}
            onChange={(e) => set("checkInTime", e.target.value)}
          />
        </div>
        <div className="prov-field">
          <label className="prov-label">Check-Out Time</label>
          <input
            className="prov-input"
            type="time"
            value={form.checkOutTime}
            onChange={(e) => set("checkOutTime", e.target.value)}
          />
        </div>
      </div>
      <div className="prov-field">
        <label className="prov-label">Cancellation Policy</label>
        <textarea
          className="prov-textarea"
          style={{ minHeight: 60 }}
          placeholder="e.g. Free cancellation up to 48 hours before check-in."
          value={form.cancellationPolicy}
          onChange={(e) => set("cancellationPolicy", e.target.value)}
        />
      </div>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div className="prov-checkbox-row">
          <input
            className="prov-checkbox"
            type="checkbox"
            id="pet-friendly"
            checked={form.petFriendly}
            onChange={(e) => set("petFriendly", e.target.checked)}
          />
          <label className="prov-checkbox-label" htmlFor="pet-friendly">
            Pet Friendly
          </label>
        </div>
        <div className="prov-checkbox-row">
          <input
            className="prov-checkbox"
            type="checkbox"
            id="smoking"
            checked={form.smokingAllowed}
            onChange={(e) => set("smokingAllowed", e.target.checked)}
          />
          <label className="prov-checkbox-label" htmlFor="smoking">
            Smoking Allowed
          </label>
        </div>
      </div>
      <div className="prov-field">
        <div className="prov-section-divider">◆ Hotel Images</div>
        {images.map((url, i) => (
          <div className="prov-img-row" key={i}>
            <input
              className="prov-input"
              type="url"
              placeholder={`https://example.com/hotel-photo-${i + 1}.jpg`}
              value={url}
              onChange={(e) => setImg(i, e.target.value)}
            />
            <button className="prov-img-remove" onClick={() => removeImg(i)}>
              ✕
            </button>
          </div>
        ))}
        <button className="prov-add-url" onClick={addImg}>
          + Add Hotel Image
        </button>
      </div>
      <div className="prov-field">
        <div className="prov-section-divider">◆ Hotel Amenities</div>
        <div className="prov-amenity-grid">
          {HOTEL_AMENITIES.map((a) => (
            <button
              key={a}
              type="button"
              className={`prov-amenity-chip${amenities.includes(a) ? " selected" : ""}`}
              onClick={() => toggleAmenity(a)}
            >
              {amenities.includes(a) ? "✔ " : ""}
              {a}
            </button>
          ))}
        </div>
      </div>
      <div className="prov-field">
        <div className="prov-section-divider">◆ Room Categories</div>
        {rooms.map((room, i) => (
          <div key={i} className="prov-room-card">
            <div className="prov-room-card-header">
              <span className="prov-room-card-title">
                ◆ Room Category {i + 1}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {room.pricePerNight && (
                  <span className="prov-room-card-eff">
                    ${Number(room.pricePerNight).toLocaleString()} / night
                  </span>
                )}
                {rooms.length > 1 && (
                  <button
                    className="prov-img-remove"
                    onClick={() => removeRoom(i)}
                    style={{ width: 26, height: 26, fontSize: 12 }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="prov-form-row-3">
              <div className="prov-field">
                <label className="prov-label">Category ID</label>
                <input
                  className="prov-input"
                  placeholder="e.g. suite"
                  value={room.id}
                  onChange={(e) =>
                    setRoomField(
                      i,
                      "id",
                      e.target.value.toLowerCase().replace(/\s+/g, "_"),
                    )
                  }
                />
              </div>
              <div className="prov-field">
                <label className="prov-label">Name *</label>
                <input
                  className="prov-input"
                  placeholder="e.g. Junior Suite"
                  value={room.name}
                  onChange={(e) => setRoomField(i, "name", e.target.value)}
                />
              </div>
              <div className="prov-field">
                <label className="prov-label">Price / Night (USD) *</label>
                <input
                  className="prov-input"
                  type="number"
                  min="0"
                  placeholder="e.g. 250"
                  value={room.pricePerNight}
                  onChange={(e) =>
                    setRoomField(i, "pricePerNight", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="prov-form-row">
              <div className="prov-field">
                <label className="prov-label">Max Occupancy</label>
                <input
                  className="prov-input"
                  type="number"
                  min="1"
                  max="20"
                  placeholder="e.g. 2"
                  value={room.maxOccupancy}
                  onChange={(e) =>
                    setRoomField(i, "maxOccupancy", e.target.value)
                  }
                />
              </div>
              <div className="prov-field">
                <label className="prov-label">Total Rooms of this Type</label>
                <input
                  className="prov-input"
                  type="number"
                  min="0"
                  placeholder="e.g. 10"
                  value={room.totalRooms}
                  onChange={(e) =>
                    setRoomField(i, "totalRooms", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="prov-field">
              <label className="prov-label">Description</label>
              <input
                className="prov-input"
                placeholder="e.g. Separate living area with panoramic views"
                value={room.description}
                onChange={(e) => setRoomField(i, "description", e.target.value)}
              />
            </div>
            <div className="prov-field">
              <label className="prov-label">Available Bed Types</label>
              <div className="prov-bed-chips">
                {BED_OPTIONS.map((bed) => (
                  <button
                    key={bed}
                    type="button"
                    className={`prov-bed-chip${room.bedOptions.includes(bed) ? " selected" : ""}`}
                    onClick={() => toggleBedOption(i, bed)}
                  >
                    {bed}
                  </button>
                ))}
              </div>
            </div>
            <div className="prov-field">
              <label className="prov-label">Room Amenities</label>
              <div className="prov-amenity-grid">
                {ROOM_AMENITIES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={`prov-amenity-chip${room.amenities.includes(a) ? " selected" : ""}`}
                    onClick={() => toggleRoomAmenity(i, a)}
                  >
                    {room.amenities.includes(a) ? "✔ " : ""}
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="prov-field">
              <label className="prov-label">Room Images</label>
              {room.images.map((url, ii) => (
                <div className="prov-img-row" key={ii}>
                  <input
                    className="prov-input"
                    type="url"
                    placeholder="https://example.com/room-photo.jpg"
                    value={url}
                    onChange={(e) => setRoomImg(i, ii, e.target.value)}
                  />
                  <button
                    className="prov-img-remove"
                    onClick={() => removeRoomImg(i, ii)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button className="prov-add-url" onClick={() => addRoomImg(i)}>
                + Add Room Image
              </button>
            </div>
            <div className="prov-checkbox-row">
              <input
                className="prov-checkbox"
                type="checkbox"
                id={`room-avail-${i}`}
                checked={room.isAvailable}
                onChange={(e) =>
                  setRoomField(i, "isAvailable", e.target.checked)
                }
              />
              <label
                className="prov-checkbox-label"
                htmlFor={`room-avail-${i}`}
              >
                Available for booking
              </label>
            </div>
          </div>
        ))}
        <button className="prov-add-url" onClick={addRoom}>
          + Add Room Category
        </button>
      </div>
      <div className="prov-field">
        <div className="prov-section-divider">◆ Meal Plans / Board Options</div>
        {meals.map((meal, i) => (
          <div key={i} className="prov-meal-card">
            <div className="prov-meal-card-header">
              <span className="prov-meal-card-title">
                ◆ {meal.name || `Plan ${i + 1}`}
              </span>
              {meals.length > 1 && (
                <button
                  className="prov-img-remove"
                  onClick={() => removeMeal(i)}
                  style={{ width: 26, height: 26, fontSize: 12 }}
                >
                  ✕
                </button>
              )}
            </div>
            <div className="prov-form-row">
              <div className="prov-field">
                <label className="prov-label">Plan Name *</label>
                <input
                  className="prov-input"
                  placeholder="e.g. All Inclusive"
                  value={meal.name}
                  onChange={(e) => setMealField(i, "name", e.target.value)}
                />
              </div>
              <div className="prov-field">
                <label className="prov-label">
                  Price / Person / Night (USD)
                </label>
                <input
                  className="prov-input"
                  type="number"
                  min="0"
                  placeholder="0 = included"
                  value={meal.pricePerPersonPerNight}
                  onChange={(e) =>
                    setMealField(i, "pricePerPersonPerNight", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="prov-field">
              <label className="prov-label">Description</label>
              <input
                className="prov-input"
                placeholder="What's included?"
                value={meal.description}
                onChange={(e) => setMealField(i, "description", e.target.value)}
              />
            </div>
            <div className="prov-checkbox-row">
              <input
                className="prov-checkbox"
                type="checkbox"
                id={`meal-avail-${i}`}
                checked={meal.isAvailable}
                onChange={(e) =>
                  setMealField(i, "isAvailable", e.target.checked)
                }
              />
              <label
                className="prov-checkbox-label"
                htmlFor={`meal-avail-${i}`}
              >
                Available
              </label>
            </div>
          </div>
        ))}
        <button className="prov-add-url" onClick={addMeal}>
          + Add Meal Plan
        </button>
      </div>
      <div className="prov-checkbox-row">
        <input
          className="prov-checkbox"
          type="checkbox"
          id="hotel-avail"
          checked={form.isAvailable}
          onChange={(e) => set("isAvailable", e.target.checked)}
        />
        <label className="prov-checkbox-label" htmlFor="hotel-avail">
          Hotel is available for booking immediately upon approval
        </label>
      </div>
      <div className="prov-form-actions">
        <button className="prov-btn-cancel" onClick={onClose}>
          Cancel
        </button>
        <button
          className="prov-btn-submit"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting
            ? "Saving…"
            : isEdit
              ? "Save Changes →"
              : "Submit Request →"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SERVICE FORM
═══════════════════════════════════════════════ */
function ServiceForm({ onClose, onSuccess, initial = null, editId = null }) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    category: initial?.category ?? initial?.type ?? "",
    price: initial?.price ?? "",
    priceUnit: initial?.priceUnit ?? "flat",
    description: initial?.description ?? "",
    location: initial?.location ?? "",
    contactEmail: initial?.contactEmail ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const isEdit = !!editId;

  const handleSubmit = async () => {
    if (
      ["name", "category", "price", "description", "contactEmail"].some(
        (k) => !form[k],
      )
    ) {
      setAlert({ type: "error", msg: "Please fill in all required fields." });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        type: form.category,
      };
      if (isEdit) {
        await API.put(`/provider/services/${editId}`, payload);
        setAlert({ type: "success", msg: "Service updated successfully." });
      } else {
        await API.post("/provider/services/request", {
          ...form,
          price: Number(form.price),
        });
        setAlert({
          type: "success",
          msg: "Service request submitted. Awaiting admin approval.",
        });
      }
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setAlert({
        type: "error",
        msg: err.response?.data?.message ?? "Failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="prov-form">
      {alert && (
        <div className={`prov-alert ${alert.type}`}>
          {alert.type === "success" ? "✓" : "✗"} {alert.msg}
        </div>
      )}
      <div className="prov-form-row">
        <div className="prov-field">
          <label className="prov-label">Service Name *</label>
          <input
            className="prov-input"
            placeholder="e.g. Royal Photography"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div className="prov-field">
          <label className="prov-label">Category *</label>
          <select
            className="prov-select"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            <option value="">— Select —</option>
            {[
              "photography",
              "catering",
              "decoration",
              "music",
              "florist",
              "transport",
              "planning",
              "other",
            ].map((v) => (
              <option key={v} value={v}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="prov-form-row">
        <div className="prov-field">
          <label className="prov-label">Price (USD) *</label>
          <input
            className="prov-input"
            type="number"
            placeholder="e.g. 800"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
          />
        </div>
        <div className="prov-field">
          <label className="prov-label">Pricing Unit</label>
          <select
            className="prov-select"
            value={form.priceUnit}
            onChange={(e) => set("priceUnit", e.target.value)}
          >
            <option value="flat">Flat Fee</option>
            <option value="per_hour">Per Hour</option>
            <option value="per_person">Per Person</option>
            <option value="per_day">Per Day</option>
          </select>
        </div>
      </div>
      <div className="prov-form-row">
        <div className="prov-field">
          <label className="prov-label">Location / Service Area</label>
          <input
            className="prov-input"
            placeholder="e.g. Cairo & Giza"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>
        <div className="prov-field">
          <label className="prov-label">Contact Email *</label>
          <input
            className="prov-input"
            type="email"
            placeholder="e.g. hello@myphoto.com"
            value={form.contactEmail}
            onChange={(e) => set("contactEmail", e.target.value)}
          />
        </div>
      </div>
      <div className="prov-field">
        <label className="prov-label">Description *</label>
        <textarea
          className="prov-textarea"
          placeholder="Describe your service…"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>
      <div className="prov-form-actions">
        <button className="prov-btn-cancel" onClick={onClose}>
          Cancel
        </button>
        <button
          className="prov-btn-submit"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting
            ? "Saving…"
            : isEdit
              ? "Save Changes →"
              : "Submit Request →"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MODAL WRAPPER
═══════════════════════════════════════════════ */
const MODAL_META = {
  venue: {
    title: "Add a Venue",
    sub: "Fill in the details — admin will review and approve.",
    icon: "🏛️",
  },
  hotel: {
    title: "Add a Hotel",
    sub: "Provide hotel information — admin will review and approve.",
    icon: "🏨",
  },
  service: {
    title: "Add a Service",
    sub: "Describe what you offer — admin will review and approve.",
    icon: "✨",
  },
  "edit-venue": {
    title: "Edit Venue",
    sub: "Update your venue details.",
    icon: "✏️",
  },
  "edit-hotel": {
    title: "Edit Hotel",
    sub: "Update your hotel details.",
    icon: "✏️",
  },
  "edit-service": {
    title: "Edit Service",
    sub: "Update your service details.",
    icon: "✏️",
  },
};

function Modal({ type, onClose, onSuccess, editData = null }) {
  const meta = MODAL_META[type] ?? {};
  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };
  const baseType = type.replace("edit-", "");
  const isEdit = type.startsWith("edit-");
  return (
    <div className="prov-overlay" onClick={handleOverlay}>
      <div className="prov-modal">
        <div className="prov-modal-head">
          <div>
            <div className="prov-modal-title">
              {meta.icon} {meta.title}
            </div>
            <div className="prov-modal-sub">{meta.sub}</div>
          </div>
          <button className="prov-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="prov-modal-body">
          {baseType === "venue" && (
            <VenueForm
              onClose={onClose}
              onSuccess={onSuccess}
              initial={isEdit ? editData : null}
              editId={isEdit ? editData?._id : null}
            />
          )}
          {baseType === "hotel" && (
            <HotelForm
              onClose={onClose}
              onSuccess={onSuccess}
              initial={isEdit ? editData : null}
              editId={isEdit ? editData?._id : null}
            />
          )}
          {baseType === "service" && (
            <ServiceForm
              onClose={onClose}
              onSuccess={onSuccess}
              initial={isEdit ? editData : null}
              editId={isEdit ? editData?._id : null}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LISTING CARD
═══════════════════════════════════════════════ */
function ListingCard({ item, listingType, onEdit, onDelete }) {
  const meta = {
    venue: {
      label: "◆ Venue",
      detail: `${fmt(item.capacity)} guests · $${fmt(item.pricePerHour)}/hr`,
    },
    hotel: {
      label: "◆ Hotel",
      detail: `${item.stars}★ · from $${fmt(item.pricePerNight)}/night · ${fmt(item.totalRooms)} rooms`,
    },
    service: {
      label: "◆ Service",
      detail: `${item.type ?? item.category} · $${fmt(item.price)}`,
    },
  }[listingType];
  return (
    <div className="dash-listing-card">
      <div className="dash-listing-card-type">{meta.label}</div>
      <div className="dash-listing-card-name">{item.name}</div>
      <div className="dash-listing-card-badge">
        <span className="dash-listing-card-badge-dot" />
        Live · Accepted
      </div>
      <div className="dash-listing-card-meta">
        {item.location && (
          <div>
            📍 <span>{item.location}</span>
          </div>
        )}
        <div>{meta.detail}</div>
        {listingType === "hotel" && item.roomCategories?.length > 0 && (
          <div style={{ marginTop: 4, opacity: 0.7, fontSize: 10 }}>
            {item.roomCategories.length} room type
            {item.roomCategories.length > 1 ? "s" : ""} ·{" "}
            {item.mealPlans?.length ?? 0} meal plan
            {(item.mealPlans?.length ?? 0) !== 1 ? "s" : ""}
          </div>
        )}
        {item.description && (
          <div style={{ marginTop: 4, opacity: 0.7, fontSize: 10 }}>
            {item.description.slice(0, 80)}
            {item.description.length > 80 ? "…" : ""}
          </div>
        )}
      </div>
      <div className="dash-listing-card-actions">
        <button className="dash-btn-edit" onClick={() => onEdit(item)}>
          ✏ Edit
        </button>
        <button className="dash-btn-delete" onClick={() => onDelete(item)}>
          ✗ Delete
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
function ProviderDashboard() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);
  const [editData, setEditData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [reqLoading, setReqLoading] = useState(true);
  const [historyFilter, setHistoryFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const [listings, setListings] = useState({
    venue: [],
    hotel: [],
    service: [],
  });
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingTab, setListingTab] = useState("venue");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRequests = async () => {
    setReqLoading(true);
    try {
      const [vR, hR, sR] = await Promise.all([
        API.get("/provider/venues/requests").catch(() => ({ data: [] })),
        API.get("/provider/hotels/requests").catch(() => ({ data: [] })),
        API.get("/provider/services/requests").catch(() => ({ data: [] })),
      ]);
      const all = [
        ...(vR.data ?? []).map((r) => ({ ...r, _type: "Venue" })),
        ...(hR.data ?? []).map((r) => ({ ...r, _type: "Hotel" })),
        ...(sR.data ?? []).map((r) => ({ ...r, _type: "Service" })),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRequests(all);
      setStats({
        total: all.length,
        pending: all.filter((r) => r.status === "pending").length,
        accepted: all.filter((r) => r.status === "accepted").length,
        rejected: all.filter((r) => r.status === "rejected").length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setReqLoading(false);
    }
  };

  const fetchListings = async () => {
    setListingsLoading(true);
    try {
      const [vR, hR, sR] = await Promise.all([
        API.get("/provider/venues").catch(() => ({ data: [] })),
        API.get("/provider/hotels").catch(() => ({ data: [] })),
        API.get("/provider/services").catch(() => ({ data: [] })),
      ]);
      setListings({
        venue: vR.data ?? [],
        hotel: hR.data ?? [],
        service: sR.data ?? [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setListingsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchListings();
  }, []);
  const refreshAll = () => {
    fetchRequests();
    fetchListings();
  };
  const openSubmit = (type) => {
    setEditData(null);
    setModal(type);
  };
  const openEdit = (item, listingType) => {
    setEditData(item);
    setModal(`edit-${listingType}`);
  };
  const closeModal = () => {
    setModal(null);
    setEditData(null);
  };
  const confirmDelete = (item, listingType) =>
    setDeleteTarget({ item, listingType });
  const cancelDelete = () => setDeleteTarget(null);
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { item, listingType } = deleteTarget;
      await API.delete(`/provider/${listingType}s/${item._id}`);
      setDeleteTarget(null);
      fetchListings();
      fetchRequests();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  const filteredRequests =
    historyFilter === "all"
      ? requests
      : requests.filter((r) => r.status === historyFilter);
  const findLiveItem = (req) => {
    const typeKey = req._type?.toLowerCase();
    if (!typeKey || !listings[typeKey]) return null;
    return listings[typeKey].find((l) => l.name === req.name) ?? null;
  };
  const totalListings =
    listings.venue.length + listings.hotel.length + listings.service.length;

  return (
    <>
      <style>{style}</style>
      {modal && (
        <Modal
          type={modal}
          onClose={closeModal}
          onSuccess={refreshAll}
          editData={editData}
        />
      )}
      {deleteTarget && (
        <div className="dash-confirm-overlay">
          <div className="dash-confirm-box">
            <div className="dash-confirm-title">Delete Listing?</div>
            <div className="dash-confirm-sub">
              You're about to permanently delete{" "}
              <strong style={{ color: "var(--cream)" }}>
                {deleteTarget.item.name}
              </strong>
              . This cannot be undone.
            </div>
            <div className="dash-confirm-actions">
              <button className="dash-confirm-cancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button
                className="dash-confirm-delete"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "✗ Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dash-root">
        <nav className="dash-topbar">
          <div className="dash-logo" onClick={() => navigate("/")}>
            <div className="dash-logo-mark" />
            <div className="dash-logo-text" translate="no">
              Event<span>y</span>
            </div>
          </div>
          <div className="dash-topbar-right">
            <span className="dash-provider-badge">◆ Provider Panel</span>
            <button className="dash-logout-btn" onClick={() => navigate("/")}>
              ← Exit
            </button>
          </div>
        </nav>

        <main className="dash-main">
          <p className="dash-breadcrumb">Provider</p>
          <h1 className="dash-title">Provider Studio</h1>
          <p className="dash-subtitle">
            Submit listings for review, and manage your approved venues, hotels,
            and services.
          </p>

          <div className="dash-stats">
            <div className="dash-stat">
              <div className="dash-stat-icon">📤</div>
              <div className="dash-stat-label">Total Requests</div>
              <div className="dash-stat-val">{fmt(stats.total)}</div>
              <div className="dash-stat-sub">All submissions</div>
            </div>
            <div className="dash-stat">
              <div className="dash-stat-icon">⏳</div>
              <div className="dash-stat-label">Pending Review</div>
              <div
                className={`dash-stat-val ${stats.pending > 0 ? "amber" : ""}`}
              >
                {fmt(stats.pending)}
              </div>
              <div className="dash-stat-sub">Awaiting admin</div>
            </div>
            <div className="dash-stat">
              <div className="dash-stat-icon">✅</div>
              <div className="dash-stat-label">Live Listings</div>
              <div
                className={`dash-stat-val ${totalListings > 0 ? "green" : ""}`}
              >
                {fmt(totalListings)}
              </div>
              <div className="dash-stat-sub">Active on platform</div>
            </div>
          </div>

          <p className="dash-section-title">◆ New Submission</p>
          <div className="dash-submit-grid">
            {[
              {
                type: "venue",
                icon: "🏛️",
                lbl: "◆ Spaces",
                title: "Add a Venue",
                desc: "List an event venue — halls, gardens, rooftops, or ballrooms.",
                cta: "Submit Venue →",
              },
              {
                type: "hotel",
                icon: "🏨",
                lbl: "◆ Stays",
                title: "Add a Hotel",
                desc: "Register a hotel with room types, meal plans, and amenities.",
                cta: "Submit Hotel →",
              },
              {
                type: "service",
                icon: "✨",
                lbl: "◆ Services",
                title: "Add a Service",
                desc: "Offer photography, catering, decoration, music, and more.",
                cta: "Submit Service →",
              },
            ].map(({ type, icon, lbl, title, desc, cta }) => (
              <div
                key={type}
                className="dash-submit-card"
                onClick={() => openSubmit(type)}
              >
                <div className="dash-submit-card-icon">{icon}</div>
                <div>
                  <div className="dash-submit-card-label">{lbl}</div>
                  <div className="dash-submit-card-title">{title}</div>
                  <div className="dash-submit-card-desc">{desc}</div>
                </div>
                <button
                  className="dash-submit-card-cta"
                  onClick={(e) => {
                    e.stopPropagation();
                    openSubmit(type);
                  }}
                >
                  <span>{cta}</span>
                </button>
              </div>
            ))}
          </div>

          <p className="dash-section-title">◆ My Accepted Listings</p>
          <div className="dash-tab-row">
            {[
              { key: "venue", label: "Venues", count: listings.venue.length },
              { key: "hotel", label: "Hotels", count: listings.hotel.length },
              {
                key: "service",
                label: "Services",
                count: listings.service.length,
              },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                className={`dash-tab-btn${listingTab === key ? " active" : ""}`}
                onClick={() => setListingTab(key)}
              >
                {label}{" "}
                <span style={{ marginLeft: 6, opacity: 0.7 }}>({count})</span>
              </button>
            ))}
          </div>
          {listingsLoading ? (
            <div className="dash-loading" style={{ marginBottom: 56 }}>
              <div className="dash-spinner" />
              <p className="dash-loading-text">Loading Listings</p>
            </div>
          ) : listings[listingTab].length === 0 ? (
            <div
              className="dash-empty"
              style={{
                marginBottom: 56,
                border: "1px solid var(--border)",
                background: "rgba(17,17,24,0.85)",
              }}
            >
              No approved {listingTab}s yet — submit a request above.
            </div>
          ) : (
            <div className="dash-listings-grid" style={{ marginBottom: 56 }}>
              {listings[listingTab].map((item) => (
                <ListingCard
                  key={item._id}
                  item={item}
                  listingType={listingTab}
                  onEdit={(i) => openEdit(i, listingTab)}
                  onDelete={(i) => confirmDelete(i, listingTab)}
                />
              ))}
            </div>
          )}

          {/* ── Submission History ── */}
          <p className="dash-section-title">◆ Submission History</p>
          <div className="dash-recent-wrap">
            <div className="dash-recent-head">
              <span className="dash-recent-head-title">All Requests</span>
              <div className="dash-history-filters">
                {[
                  { key: "all", label: `All (${stats.total})` },
                  { key: "accepted", label: `Accepted (${stats.accepted})` },
                  { key: "pending", label: `Pending (${stats.pending})` },
                  { key: "rejected", label: `Rejected (${stats.rejected})` },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    className={`dash-history-filter-btn${historyFilter === key ? " active" : ""}`}
                    onClick={() => setHistoryFilter(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {reqLoading ? (
              <div className="dash-loading">
                <div className="dash-spinner" />
                <p className="dash-loading-text">Loading Requests</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="dash-empty">
                {historyFilter === "all"
                  ? "No submissions yet."
                  : `No ${historyFilter} requests found.`}
              </div>
            ) : (
              <table className="dash-recent-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((r) => {
                    const isAccepted = r.status === "accepted";
                    const isRejected = r.status === "rejected";
                    const liveItem = isAccepted ? findLiveItem(r) : null;
                    const typeKey = r._type?.toLowerCase();
                    return (
                      <tr key={r._id}>
                        <td>
                          <div className="dash-rt-name">{r.name ?? "—"}</div>
                          <div className="dash-rt-sub">
                            {r.location ?? r.contactEmail ?? "—"}
                          </div>
                        </td>
                        <td>
                          <span className="dash-rt-type">{r._type}</span>
                        </td>
                        <td>
                          <div
                            className="dash-rt-sub"
                            style={{ color: "var(--cream)", fontSize: 11 }}
                          >
                            {fmtDate(r.createdAt)}
                          </div>
                        </td>
                        <td>
                          {/* Status badge */}
                          <span
                            className={`dash-status ${r.status ?? "pending"}`}
                          >
                            <span className="dash-status-dot" />
                            {r.status ?? "pending"}
                          </span>

                          {/* ── Rejection reason — visible only to provider ── */}
                          {isRejected && r.rejectionReason && (
                            <RejectionBlock
                              reason={r.rejectionReason}
                              onReapply={() => openSubmit(typeKey)}
                            />
                          )}

                          {/* Rejected with no reason — still show a nudge */}
                          {isRejected && !r.rejectionReason && (
                            <div style={{ marginTop: 8 }}>
                              <button
                                className="prov-rejection-reapply"
                                onClick={() => openSubmit(typeKey)}
                              >
                                ↺ Reapply
                              </button>
                            </div>
                          )}
                        </td>
                        <td>
                          {isAccepted && (liveItem || r) ? (
                            <div className="dash-rt-actions">
                              <button
                                className="dash-rt-btn-edit"
                                onClick={() => openEdit(liveItem ?? r, typeKey)}
                              >
                                ✏ Edit
                              </button>
                              <button
                                className="dash-rt-btn-delete"
                                onClick={() =>
                                  confirmDelete(liveItem ?? r, typeKey)
                                }
                              >
                                ✗ Delete
                              </button>
                            </div>
                          ) : (
                            <span className="dash-rt-locked">
                              {r.status === "pending"
                                ? "⏳ Awaiting review"
                                : isRejected
                                  ? "✗ Not approved"
                                  : "—"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>

        <footer className="dash-footer">
          <p className="dash-footer-copy">
            © 2026 <span>Eventy</span> — Provider Portal
          </p>
          <p className="dash-footer-copy" style={{ opacity: 0.5 }}>
            Luxury Event Planning Platform
          </p>
        </footer>
      </div>
    </>
  );
}

export default ProviderDashboard;
