import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,500&family=Cinzel:wght@400;600&family=Raleway:wght@200;300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    background-color: #0A0A0A !important;
    min-height: 100vh;
  }

  :root {
    --black:      #0A0A0A;
    --obsidian:   #111118;
    --gold:       #C8A951;
    --gold-light: #E2C97E;
    --gold-dim:   rgba(200,169,81,0.12);
    --gold-glow:  rgba(200,169,81,0.22);
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

  /* ── Root ── */
  .hr-root {
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
  .hr-root::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%);
  }

  /* ── Topbar ── */
  .hr-topbar {
    background: rgba(17,17,24,0.94);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 22px 56px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .hr-topbar::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .hr-logo { display: flex; align-items: center; gap: 14px; cursor: pointer; }
  .hr-logo-mark { width: 32px; height: 32px; border: 1.5px solid var(--gold); transform: rotate(45deg); flex-shrink: 0; }
  .hr-logo-text { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase; }
  .hr-logo-text span { color: var(--gold); }
  .hr-topbar-right { display: flex; align-items: center; gap: 16px; }
  .hr-admin-badge {
    font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase;
    padding: 6px 14px; border: 1px solid var(--gold-line); color: var(--gold); background: var(--gold-dim);
  }
  .hr-back-btn {
    font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase;
    padding: 7px 16px; border: 1px solid var(--border); color: var(--muted);
    background: transparent; cursor: pointer; transition: border-color 0.2s, color 0.2s;
    text-decoration: none; display: inline-flex; align-items: center;
  }
  .hr-back-btn:hover { border-color: var(--gold-line); color: var(--gold); }

  /* ── Main ── */
  .hr-main { position: relative; z-index: 1; max-width: 1280px; margin: 0 auto; padding: 64px 56px 100px; }

  /* ── Header ── */
  .hr-breadcrumb {
    font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--gold); opacity: 0.8; margin-bottom: 28px;
    display: flex; align-items: center; gap: 14px;
  }
  .hr-breadcrumb::before { content: ''; display: block; width: 32px; height: 1px; background: var(--gold); opacity: 0.6; }
  .hr-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(30px, 4vw, 52px); font-weight: 300; color: var(--cream); line-height: 1.05; margin-bottom: 6px; }
  .hr-subtitle { font-size: 12px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; margin-bottom: 48px; }

  /* ── Stats ── */
  .hr-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 48px; }
  .hr-stat {
    border: 1px solid var(--border); background: rgba(17,17,24,0.85);
    padding: 22px 24px; position: relative; overflow: hidden;
    animation: hr-fadein 0.5s ease both;
  }
  .hr-stat:nth-child(1) { animation-delay: 0.05s; }
  .hr-stat:nth-child(2) { animation-delay: 0.10s; }
  .hr-stat:nth-child(3) { animation-delay: 0.15s; }
  .hr-stat:nth-child(4) { animation-delay: 0.20s; }
  @keyframes hr-fadein { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .hr-stat::before { content: ''; position: absolute; top: 0; left: 0; width: 48px; height: 1px; background: var(--gold); }
  .hr-stat-icon { font-size: 16px; margin-bottom: 12px; opacity: 0.7; }
  .hr-stat-label { font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.7; margin-bottom: 6px; }
  .hr-stat-val { font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 300; color: var(--cream); line-height: 1; }
  .hr-stat-val.gold { color: var(--gold-light); }
  .hr-stat-val.green { color: var(--green); }
  .hr-stat-val.amber { color: var(--amber); }
  .hr-stat-val.red { color: var(--red); }

  /* ── Toolbar ── */
  .hr-toolbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; gap: 16px; flex-wrap: wrap;
  }
  .hr-section-title {
    font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--gold); opacity: 0.8;
    display: flex; align-items: center; gap: 14px;
  }
  .hr-toolbar-right { display: flex; align-items: center; gap: 12px; }
  .hr-search-wrap { position: relative; }
  .hr-search {
    background: rgba(10,10,10,0.7); border: 1px solid var(--border);
    color: var(--cream); font-family: 'Raleway', sans-serif;
    font-size: 12px; font-weight: 200; padding: 9px 14px 9px 36px;
    outline: none; width: 220px; transition: border-color 0.2s;
  }
  .hr-search::placeholder { color: var(--muted); }
  .hr-search:focus { border-color: var(--gold-line); }
  .hr-search-icon {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    color: var(--gold); font-size: 12px; pointer-events: none; opacity: 0.6;
  }
  .hr-filter-select {
    background: rgba(10,10,10,0.7); border: 1px solid var(--border);
    color: var(--cream); font-family: 'Raleway', sans-serif;
    font-size: 12px; font-weight: 200; padding: 9px 14px;
    outline: none; cursor: pointer; -webkit-appearance: none; appearance: none;
    transition: border-color 0.2s; min-width: 140px;
  }
  .hr-filter-select:focus { border-color: var(--gold-line); }

  /* ── Table ── */
  .hr-table-wrap {
    border: 1px solid var(--border); background: rgba(17,17,24,0.85);
    position: relative; overflow: hidden;
    animation: hr-fadein 0.5s ease 0.25s both;
  }
  .hr-table-wrap::before { content: ''; position: absolute; top: 0; left: 0; width: 80px; height: 1px; background: var(--gold); }
  .hr-table { width: 100%; border-collapse: collapse; }
  .hr-table thead tr { border-bottom: 1px solid var(--border); }
  .hr-table th {
    font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase;
    color: var(--gold); opacity: 0.7; padding: 18px 20px; text-align: left;
    white-space: nowrap;
  }
  .hr-table td { padding: 14px 20px; border-bottom: 1px solid rgba(200,169,81,0.08); vertical-align: middle; }
  .hr-table tbody tr { transition: background 0.2s; cursor: pointer; }
  .hr-table tbody tr:hover { background: rgba(200,169,81,0.04); }
  .hr-table tbody tr:last-child td { border-bottom: none; }

  .hr-td-hotel { font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.08em; color: var(--cream); }
  .hr-td-sub { font-size: 10px; font-weight: 200; color: var(--muted); margin-top: 3px; }
  .hr-td-guest { font-size: 12px; font-weight: 300; color: var(--cream); }
  .hr-td-date { font-size: 11px; font-weight: 200; color: var(--cream); }
  .hr-td-amount { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 300; color: var(--gold-light); }
  .hr-td-actions { display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; }

  /* ── Status Badge ── */
  .hr-status {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 5px 10px; border: 1px solid;
  }
  .hr-status-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .hr-status.pending    { color: var(--amber); border-color: rgba(224,184,112,0.35); background: var(--amber-dim); }
  .hr-status.pending .hr-status-dot { background: var(--amber); }
  .hr-status.confirmed  { color: var(--green); border-color: rgba(141,184,122,0.35); background: var(--green-dim); }
  .hr-status.confirmed .hr-status-dot { background: var(--green); }
  .hr-status.cancelled  { color: var(--red); border-color: rgba(224,128,128,0.35); background: var(--red-dim); }
  .hr-status.cancelled .hr-status-dot { background: var(--red); }
  .hr-status.checked_in { color: var(--gold); border-color: var(--gold-line); background: var(--gold-dim); }
  .hr-status.checked_in .hr-status-dot { background: var(--gold); }
  .hr-status.checked_out { color: var(--muted); border-color: rgba(240,234,214,0.15); background: rgba(240,234,214,0.05); }
  .hr-status.checked_out .hr-status-dot { background: var(--muted); }

  /* ── Action Buttons ── */
  .hr-btn-icon {
    width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--border); background: transparent; cursor: pointer;
    color: var(--muted); font-size: 12px; transition: border-color 0.2s, color 0.2s, background 0.2s;
    flex-shrink: 0;
  }
  .hr-btn-icon.view:hover  { border-color: var(--gold-line); color: var(--gold); background: var(--gold-dim); }
  .hr-btn-icon.edit:hover  { border-color: rgba(141,184,122,0.4); color: var(--green); background: var(--green-dim); }
  .hr-btn-icon.del:hover   { border-color: rgba(224,128,128,0.4); color: var(--red); background: var(--red-dim); }
  .hr-btn-icon.accept:hover { border-color: rgba(141,184,122,0.4); color: var(--green); background: var(--green-dim); }
  .hr-btn-icon.reject:hover { border-color: rgba(224,128,128,0.4); color: var(--red); background: var(--red-dim); }

  /* ── Accept / Reject quick buttons (text) ── */
  .hr-quick-btn {
    font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.18em; text-transform: uppercase;
    padding: 5px 10px; border: 1px solid; background: transparent; cursor: pointer;
    transition: background 0.2s, color 0.2s;
    white-space: nowrap;
  }
  .hr-quick-btn.accept { border-color: rgba(141,184,122,0.4); color: var(--green); }
  .hr-quick-btn.accept:hover { background: var(--green-dim); }
  .hr-quick-btn.reject { border-color: rgba(224,128,128,0.4); color: var(--red); }
  .hr-quick-btn.reject:hover { background: var(--red-dim); }

  /* ── Empty / Loading ── */
  .hr-loading { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 80px 20px; }
  .hr-spinner {
    width: 32px; height: 32px; border: 1.5px solid var(--border);
    border-top-color: var(--gold); border-radius: 50%;
    animation: hr-spin 0.9s linear infinite;
  }
  @keyframes hr-spin { to { transform: rotate(360deg); } }
  .hr-loading-text { font-size: 9px; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.7; }
  .hr-empty { padding: 80px 20px; text-align: center; color: var(--muted); font-size: 13px; font-weight: 200; }

  /* ── Pagination ── */
  .hr-pagination {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 20px; border-top: 1px solid var(--border);
  }
  .hr-page-info { font-size: 9px; font-weight: 200; color: var(--muted); letter-spacing: 0.08em; }
  .hr-page-btns { display: flex; gap: 8px; }
  .hr-page-btn {
    font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.2em;
    padding: 7px 14px; border: 1px solid var(--border); background: transparent;
    color: var(--muted); cursor: pointer; transition: border-color 0.2s, color 0.2s;
  }
  .hr-page-btn:hover:not(:disabled) { border-color: var(--gold-line); color: var(--gold); }
  .hr-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .hr-page-btn.active { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }

  /* ═══ MODAL ═══ */
  .hr-modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.82); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: hr-fadein 0.2s ease;
  }
  .hr-modal {
    background: var(--obsidian); border: 1px solid var(--border);
    width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto;
    position: relative;
    animation: hr-slidein 0.25s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes hr-slidein { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .hr-modal::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); }

  .hr-modal-header {
    padding: 32px 36px 24px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  }
  .hr-modal-label { font-size: 8px; font-weight: 300; letter-spacing: 0.42em; text-transform: uppercase; color: var(--gold); opacity: 0.8; margin-bottom: 6px; }
  .hr-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; color: var(--cream); }
  .hr-modal-close {
    background: transparent; border: 1px solid var(--border); color: var(--muted);
    width: 34px; height: 34px; cursor: pointer; font-size: 16px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s, color 0.2s;
  }
  .hr-modal-close:hover { border-color: var(--gold-line); color: var(--gold); }

  .hr-modal-body { padding: 28px 36px; }
  .hr-modal-footer {
    padding: 20px 36px 28px;
    border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: flex-end; gap: 12px;
    flex-wrap: wrap;
  }

  /* ── Detail Grid ── */
  .hr-detail-section { margin-bottom: 28px; }
  .hr-detail-section-title {
    font-size: 8px; letter-spacing: 0.4em; text-transform: uppercase; color: var(--gold); opacity: 0.75;
    margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid var(--border);
  }
  .hr-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .hr-detail-lbl { font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
  .hr-detail-val { font-size: 13px; font-weight: 200; color: var(--cream); }
  .hr-detail-val.mono { font-family: 'Cormorant Garamond', serif; font-size: 15px; }
  .hr-detail-val.gold { color: var(--gold-light); }

  /* ── Form Fields ── */
  .hr-field { margin-bottom: 20px; }
  .hr-label { font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.65; margin-bottom: 8px; display: block; }
  .hr-input, .hr-select-modal {
    width: 100%; background: rgba(10,10,10,0.7); border: 1px solid var(--border);
    color: var(--cream); font-family: 'Raleway', sans-serif;
    font-size: 13px; font-weight: 200; padding: 10px 14px;
    outline: none; transition: border-color 0.2s; -webkit-appearance: none; appearance: none;
  }
  .hr-input:focus, .hr-select-modal:focus { border-color: var(--gold-line); }
  .hr-input[type="date"] { color-scheme: dark; }
  .hr-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /* ── Delete Confirm ── */
  .hr-delete-body {
    padding: 48px 36px 32px;
    display: flex; flex-direction: column; align-items: center; gap: 0;
  }
  .hr-delete-icon-wrap {
    width: 72px; height: 72px; border: 1px solid rgba(224,128,128,0.3);
    background: var(--red-dim); display: flex; align-items: center; justify-content: center;
    font-size: 30px; margin-bottom: 24px;
  }
  .hr-delete-headline {
    font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300;
    color: var(--cream); margin-bottom: 12px; text-align: center;
  }
  .hr-delete-sub {
    font-size: 12px; font-weight: 200; color: var(--muted);
    line-height: 1.8; text-align: center; max-width: 340px;
  }
  .hr-delete-name {
    font-family: 'Cormorant Garamond', serif; font-size: 17px;
    color: var(--cream); margin: 4px 0;
  }
  .hr-delete-warning {
    margin-top: 20px; padding: 12px 18px;
    border: 1px solid rgba(224,128,128,0.25); background: rgba(224,128,128,0.06);
    font-size: 11px; color: var(--red); letter-spacing: 0.04em; text-align: center;
  }

  /* ── Buttons ── */
  .hr-btn {
    font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase;
    padding: 10px 24px; border: 1px solid; cursor: pointer;
    position: relative; overflow: hidden; transition: color 0.3s;
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent;
  }
  .hr-btn span { position: relative; z-index: 1; }
  .hr-btn::before {
    content: ''; position: absolute; inset: 0;
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .hr-btn:hover::before { transform: scaleX(1); }

  .hr-btn.primary { border-color: var(--gold); color: var(--gold); }
  .hr-btn.primary::before { background: linear-gradient(90deg, var(--gold), #A8843A); }
  .hr-btn.primary:hover { color: var(--black); }

  .hr-btn.danger { border-color: var(--red); color: var(--red); }
  .hr-btn.danger::before { background: var(--red); }
  .hr-btn.danger:hover { color: var(--black); }

  .hr-btn.ghost { border-color: var(--border); color: var(--muted); }
  .hr-btn.ghost:hover { border-color: var(--gold-line); color: var(--gold); }
  .hr-btn.ghost::before { display: none; }

  .hr-btn.success { border-color: var(--green); color: var(--green); }
  .hr-btn.success::before { background: var(--green); }
  .hr-btn.success:hover { color: var(--black); }

  .hr-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .hr-btn:disabled::before { display: none; }

  /* ── Error banner ── */
  .hr-global-err {
    font-size: 11px; color: var(--red); border: 1px solid rgba(224,128,128,0.3);
    background: var(--red-dim); padding: 10px 16px; margin-bottom: 16px; letter-spacing: 0.03em;
  }

  /* ── Footer ── */
  .hr-footer {
    border-top: 1px solid var(--border); padding: 32px 56px;
    display: flex; flex-direction: column; gap: 6px; align-items: center;
    position: relative; z-index: 1;
  }
  .hr-footer-copy { font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.1em; }
  .hr-footer-copy span { color: var(--gold); }

  @media (max-width: 1024px) {
  .hr-main {
    padding: 40px 24px 80px;
  }

  .hr-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .hr-table-wrap {
    overflow-x: auto;
  }

  .hr-table {
    min-width: 900px;
  }

  .hr-search {
    width: 180px;
  }
}

/* Phones */
@media (max-width: 768px) {
.hr-stats {
    gap: 10px;
  }

  
  .hr-stat {
    padding: 14px;
  }

  .hr-topbar {
    padding: 14px 16px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .hr-logo-text {
    font-size: 14px;
    letter-spacing: 0.2em;
  }
    .hr-page-btns {
    flex-wrap: wrap;
    justify-content: center;
  }

  .hr-admin-badge {
    font-size: 7px;
    padding: 4px 10px;
  }

  .hr-back-btn {
    font-size: 7px;
    padding: 6px 10px;
  }

  .hr-main {
    padding: 24px 14px 60px;
  }

  .hr-title {
    font-size: 28px;
  }

  .hr-subtitle {
    font-size: 11px;
    margin-bottom: 28px;
  }


  .hr-stat-val {
    font-size: 28px;
  }

  .hr-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

 .hr-toolbar-right {
    gap: 10px;
  }

  .hr-search {
    font-size: 13px;
    padding: 10px 14px 10px 36px;
  }

  .hr-filter-select {
    font-size: 13px;
  }

  .hr-search-wrap{
    width: 100%;
  }

  .hr-search {
    width: 100%;
  }

  /* TABLE → CARD MODE */
  ..hr-table-wrap {
  overflow-x: hidden;
}

.hr-table {
  width: 100%;
  min-width: 0 !important;
  display: block;
}
.hr-table thead {
  display: none;
}
  .hr-table tbody tr {
  width: 100%;
  overflow: hidden;
}
  .hr-td-sub,
.hr-detail-val {
  word-break: break-word;
}
  body {
  overflow-x: hidden;
}

html, body {
  max-width: 100%;
  overflow-x: hidden;
}

* {
  max-width: 100%;
}

.hr-table tbody tr {
  display: block;
  margin-bottom: 12px;
  border-radius: 10px;
}
  .hr-table {
  display: block;
}

.hr-table thead {
  display: none;
}

.hr-table tbody tr {
  display: block;
  margin-bottom: 12px;
  border-radius: 10px;
}

  .hr-table tbody tr {
    display: block;
    background: rgba(17,17,24,0.85);
    border: 1px solid var(--border);
    margin-bottom: 12px;
    padding: 12px;
  }

  .hr-table td {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border: none;
  }

  .hr-table td::before {
    content: attr(data-label);
    font-size: 8px;
    color: var(--gold);
    letter-spacing: 0.3em;
    text-transform: uppercase;
  }

  .hr-td-actions {
    flex-wrap: wrap;
    gap: 6px;
  }

  .hr-btn-icon {
    width: 32px;
    height: 32px;
  }

  .hr-pagination {
    flex-direction: column;
    gap: 12px;
  }
     .hr-td-actions {
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 6px;
}
  .hr-btn-icon {
  width: 34px;
  height: 34px;
}
  .hr-table tbody tr {
    padding: 14px;
  }

  .hr-table td {
    justify-content: space-between;
  }
}

/* Small phones */
@media (max-width: 480px) {

  .hr-logo-mark {
    width: 24px;
    height: 24px;
  }

  .hr-title {
    font-size: 24px;
  }

  .hr-stat-val {
    font-size: 24px;
  }

  .hr-modal {
    max-height: 95vh;
    overflow-y: auto;
  }

  .hr-modal-header,
  .hr-modal-body,
  .hr-modal-footer {
    padding: 16px;
  }

  .hr-detail-grid {
    grid-template-columns: 1fr;
  }

  .hr-field-row {
    grid-template-columns: 1fr;
  }
    .hr-td-actions {
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 6px;
}
  .hr-btn-icon {
  width: 34px;
  height: 34px;
}
}
`;

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const STATUSES = [
  "pending",
  "confirmed",
  "cancelled",
  "checked_in",
  "checked_out",
];
const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  checked_in: "Checked In",
  checked_out: "Checked Out",
};

const PAGE_SIZE = 10;

function fmt(n) {
  if (n == null) return "—";
  return Number(n).toLocaleString();
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
function fmtDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }) {
  const s = (status || "pending").replace(/\s/g, "_").toLowerCase();
  return (
    <span className={`hr-status ${s}`}>
      <span className="hr-status-dot" />
      {STATUS_LABELS[s] || status}
    </span>
  );
}

/* ─────────────────────────────────────────────
   View Modal
───────────────────────────────────────────── */
function ViewModal({ reservation, onClose, onEdit, onDelete }) {
  const r = reservation;
  return (
    <div
      className="hr-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="hr-modal">
        <div className="hr-modal-header">
          <div>
            <div className="hr-modal-label">◆ Reservation Details</div>
            <div className="hr-modal-title">
              {r.hotel?.name ?? "Hotel Reservation"}
            </div>
          </div>
          <button className="hr-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="hr-modal-body">
          <div className="hr-detail-section">
            <div className="hr-detail-section-title">Status</div>
            <StatusBadge status={r.status} />
          </div>

          <div className="hr-detail-section">
            <div className="hr-detail-section-title">Hotel</div>
            <div className="hr-detail-grid">
              <div>
                <div className="hr-detail-lbl">Property</div>
                <div className="hr-detail-val">{r.hotel?.name ?? "—"}</div>
              </div>
              <div>
                <div className="hr-detail-lbl">Location</div>
                <div className="hr-detail-val">{r.hotel?.location ?? "—"}</div>
              </div>
              <div>
                <div className="hr-detail-lbl">Room Type</div>
                <div className="hr-detail-val">{r.roomCategoryName || "—"}</div>
              </div>
              <div>
                <div className="hr-detail-lbl">Bed Type</div>
                <div className="hr-detail-val">{r.bedType ?? "—"}</div>
              </div>
              <div>
                <div className="hr-detail-lbl">Floor Preference</div>
                <div className="hr-detail-val">{r.floorPreference ?? "—"}</div>
              </div>
              <div>
                <div className="hr-detail-lbl">Meal Plan</div>
                <div className="hr-detail-val">{r.mealPlanName || "—"}</div>
              </div>
            </div>
          </div>

          <div className="hr-detail-section">
            <div className="hr-detail-section-title">Guest</div>
            <div className="hr-detail-grid">
              <div>
                <div className="hr-detail-lbl">Full Name</div>
                <div className="hr-detail-val">{r.user?.fullName ?? "—"}</div>
              </div>
              <div>
                <div className="hr-detail-lbl">Email</div>
                <div className="hr-detail-val">{r.user?.email ?? "—"}</div>
              </div>
              <div>
                <div className="hr-detail-lbl">Guests</div>
                <div className="hr-detail-val">
                  {r.adults ?? 1} adult{Number(r.adults ?? 1) !== 1 ? "s" : ""}
                  {Number(r.children) > 0
                    ? `, ${r.children} child${Number(r.children) > 1 ? "ren" : ""}`
                    : ""}
                </div>
              </div>
              <div>
                <div className="hr-detail-lbl">Payment Method</div>
                <div
                  className="hr-detail-val"
                  style={{ textTransform: "capitalize" }}
                >
                  {r.paymentMethod?.replace(/_/g, " ") ?? "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="hr-detail-section">
            <div className="hr-detail-section-title">Stay</div>
            <div className="hr-detail-grid">
              <div>
                <div className="hr-detail-lbl">Check-In</div>
                <div className="hr-detail-val">{fmtDate(r.checkIn)}</div>
              </div>
              <div>
                <div className="hr-detail-lbl">Check-Out</div>
                <div className="hr-detail-val">{fmtDate(r.checkOut)}</div>
              </div>
              <div>
                <div className="hr-detail-lbl">Nights</div>
                <div className="hr-detail-val">{r.nights ?? "—"}</div>
              </div>
              <div>
                <div className="hr-detail-lbl">Booked On</div>
                <div className="hr-detail-val">{fmtDateTime(r.createdAt)}</div>
              </div>
            </div>
          </div>

          <div className="hr-detail-section">
            <div className="hr-detail-section-title">Financials</div>
            <div className="hr-detail-grid">
              <div>
                <div className="hr-detail-lbl">Room Rate / Night</div>
                <div className="hr-detail-val gold mono">
                  ${fmt(r.roomPricePerNight)}
                </div>
              </div>
              <div>
                <div className="hr-detail-lbl">Meal Plan Total</div>
                <div className="hr-detail-val mono">
                  ${fmt(r.mealPlanTotal)}
                </div>
              </div>
              <div>
                <div className="hr-detail-lbl">Grand Total</div>
                <div className="hr-detail-val gold mono">
                  ${fmt(r.totalAmount)}
                </div>
              </div>
              <div>
                <div className="hr-detail-lbl">
                  Deposit ({r.depositPct ?? "—"}%)
                </div>
                <div className="hr-detail-val mono">
                  ${fmt(r.depositAmount)}
                </div>
              </div>
              <div>
                <div className="hr-detail-lbl">Remaining at Check-In</div>
                <div className="hr-detail-val mono">
                  ${fmt(r.remainingAmount)}
                </div>
              </div>
            </div>
          </div>

          {Array.isArray(r.specialRequests) && r.specialRequests.length > 0 && (
            <div className="hr-detail-section">
              <div className="hr-detail-section-title">Special Requests</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {r.specialRequests.map((req, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 10,
                      fontWeight: 200,
                      color: "var(--muted)",
                      border: "1px solid var(--border)",
                      padding: "3px 10px",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}

          {r.screenshotUrl && (
            <div className="hr-detail-section">
              <div className="hr-detail-section-title">Payment Screenshot</div>
              <img
                src={`http://localhost:5000${r.screenshotUrl}`}
                alt="Payment screenshot"
                style={{
                  width: "100%",
                  maxHeight: 320,
                  objectFit: "contain",
                  border: "1px solid var(--border)",
                  background: "rgba(10,10,10,0.4)",
                  display: "block",
                }}
              />
            </div>
          )}

          {r.adminNotes && (
            <div className="hr-detail-section">
              <div className="hr-detail-section-title">Admin Notes</div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 200,
                  color: "var(--muted)",
                  lineHeight: 1.7,
                }}
              >
                {r.adminNotes}
              </div>
            </div>
          )}
        </div>

        <div className="hr-modal-footer">
          <button className="hr-btn ghost" onClick={onClose}>
            <span>Close</span>
          </button>
          <button className="hr-btn danger" onClick={onDelete}>
            <span>Delete</span>
          </button>
          <button className="hr-btn primary" onClick={onEdit}>
            <span>Edit Reservation</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Edit Modal
───────────────────────────────────────────── */
function EditModal({ reservation, onClose, onSaved }) {
  const r = reservation;
  const [form, setForm] = useState({
    guestName: r.guestName ?? r.user?.name ?? "",
    guestEmail: r.guestEmail ?? r.user?.email ?? "",
    guestPhone: r.guestPhone ?? "",
    checkIn: r.checkIn ? r.checkIn.slice(0, 10) : "",
    checkOut: r.checkOut ? r.checkOut.slice(0, 10) : "",
    adults: r.adults ?? 1,
    children: r.children ?? 0,
    roomType: r.roomType ?? "",
    roomNumber: r.roomNumber ?? "",
    status: r.status ?? "pending",
    specialRequests: r.specialRequests ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const field = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSave() {
    setSaving(true);
    setErr("");
    try {
      // ✅ Fixed route: /hotel-bookings/:id
      await API.put(`/hotel-bookings/${r._id}`, form);
      onSaved();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="hr-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="hr-modal">
        <div className="hr-modal-header">
          <div>
            <div className="hr-modal-label">◆ Edit Reservation</div>
            <div className="hr-modal-title">
              {r.hotel?.name ?? r.hotelName ?? "Reservation"}
            </div>
          </div>
          <button className="hr-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="hr-modal-body">
          {err && <div className="hr-global-err">{err}</div>}

          <div className="hr-detail-section-title" style={{ marginBottom: 16 }}>
            Guest Information
          </div>
          <div className="hr-field">
            <label className="hr-label">Full Name</label>
            <input
              className="hr-input"
              value={form.guestName}
              onChange={field("guestName")}
              placeholder="Guest full name"
            />
          </div>
          <div className="hr-field-row" style={{ marginBottom: 20 }}>
            <div className="hr-field" style={{ marginBottom: 0 }}>
              <label className="hr-label">Email</label>
              <input
                className="hr-input"
                type="email"
                value={form.guestEmail}
                onChange={field("guestEmail")}
                placeholder="guest@email.com"
              />
            </div>
            <div className="hr-field" style={{ marginBottom: 0 }}>
              <label className="hr-label">Phone</label>
              <input
                className="hr-input"
                value={form.guestPhone}
                onChange={field("guestPhone")}
                placeholder="+1 000 000 0000"
              />
            </div>
          </div>

          <div className="hr-detail-section-title" style={{ marginBottom: 16 }}>
            Stay Details
          </div>
          <div className="hr-field-row" style={{ marginBottom: 20 }}>
            <div className="hr-field" style={{ marginBottom: 0 }}>
              <label className="hr-label">Check-In</label>
              <input
                className="hr-input"
                type="date"
                value={form.checkIn}
                onChange={field("checkIn")}
              />
            </div>
            <div className="hr-field" style={{ marginBottom: 0 }}>
              <label className="hr-label">Check-Out</label>
              <input
                className="hr-input"
                type="date"
                value={form.checkOut}
                onChange={field("checkOut")}
              />
            </div>
          </div>
          <div className="hr-field-row" style={{ marginBottom: 20 }}>
            <div className="hr-field" style={{ marginBottom: 0 }}>
              <label className="hr-label">Adults</label>
              <input
                className="hr-input"
                type="number"
                min="1"
                value={form.adults}
                onChange={field("adults")}
              />
            </div>
            <div className="hr-field" style={{ marginBottom: 0 }}>
              <label className="hr-label">Children</label>
              <input
                className="hr-input"
                type="number"
                min="0"
                value={form.children}
                onChange={field("children")}
              />
            </div>
          </div>
          <div className="hr-field-row" style={{ marginBottom: 20 }}>
            <div className="hr-field" style={{ marginBottom: 0 }}>
              <label className="hr-label">Room Type</label>
              <input
                className="hr-input"
                value={form.roomType}
                onChange={field("roomType")}
                placeholder="e.g. Deluxe Suite"
              />
            </div>
            <div className="hr-field" style={{ marginBottom: 0 }}>
              <label className="hr-label">Room Number</label>
              <input
                className="hr-input"
                value={form.roomNumber}
                onChange={field("roomNumber")}
                placeholder="e.g. 412"
              />
            </div>
          </div>

          <div className="hr-detail-section-title" style={{ marginBottom: 16 }}>
            Status
          </div>
          <div className="hr-field">
            <label className="hr-label">Reservation Status</label>
            <select
              className="hr-select-modal"
              value={form.status}
              onChange={field("status")}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <div className="hr-detail-section-title" style={{ marginBottom: 16 }}>
            Notes
          </div>
          <div className="hr-field">
            <label className="hr-label">Special Requests</label>
            <textarea
              className="hr-input"
              rows={3}
              value={form.specialRequests}
              onChange={field("specialRequests")}
              placeholder="Any special requests or notes…"
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        <div className="hr-modal-footer">
          <button className="hr-btn ghost" onClick={onClose}>
            <span>Cancel</span>
          </button>
          <button
            className="hr-btn primary"
            onClick={handleSave}
            disabled={saving}
          >
            <span>{saving ? "Saving…" : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Delete Confirm Modal  ✅ Redesigned
───────────────────────────────────────────── */
function DeleteModal({ reservation, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState("");
  const r = reservation;

  async function handleDelete() {
    setDeleting(true);
    setErr("");
    try {
      // ✅ Fixed route: /hotel-bookings/:id
      await API.delete(`/hotel-bookings/${r._id}`);
      onDeleted();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to delete reservation.");
      setDeleting(false);
    }
  }

  return (
    <div
      className="hr-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="hr-modal" style={{ maxWidth: 500 }}>
        <div className="hr-modal-header">
          <div>
            <div className="hr-modal-label">◆ Confirm Action</div>
            <div className="hr-modal-title">Delete Reservation</div>
          </div>
          <button className="hr-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="hr-delete-body">
          <div className="hr-delete-icon-wrap">◆</div>

          <div className="hr-delete-headline">Are you sure?</div>

          <div className="hr-delete-sub">
            You are about to permanently delete the reservation for
          </div>
          <div className="hr-delete-name">
            {r.guestName ?? r.user?.name ?? "this guest"}
          </div>
          <div className="hr-delete-sub" style={{ marginTop: 4 }}>
            at{" "}
            <strong style={{ color: "var(--cream)" }}>
              {r.hotel?.name ?? r.hotelName ?? "the hotel"}
            </strong>
            {r.checkIn
              ? ` · ${fmtDate(r.checkIn)} → ${fmtDate(r.checkOut)}`
              : ""}
          </div>

          <div className="hr-delete-warning">
            ⚠ &nbsp;This action is permanent and cannot be undone
          </div>

          {err && (
            <div
              className="hr-global-err"
              style={{ marginTop: 16, width: "100%" }}
            >
              {err}
            </div>
          )}
        </div>

        <div
          className="hr-modal-footer"
          style={{ justifyContent: "center", gap: 16 }}
        >
          <button
            className="hr-btn ghost"
            onClick={onClose}
            style={{ minWidth: 120 }}
          >
            <span>Cancel</span>
          </button>
          <button
            className="hr-btn danger"
            onClick={handleDelete}
            disabled={deleting}
            style={{ minWidth: 160 }}
          >
            <span>{deleting ? "Deleting…" : "Yes, Delete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function AdminHotelReservations() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const [viewTarget, setViewTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function fetchReservations() {
    setLoading(true);
    setErr("");
    try {
      const { data } = await API.get("/hotel-bookings");
      setReservations(data?.reservations ?? data ?? []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReservations();
  }, []);

  /* ── Stats ── */
  const total = reservations.length;
  const pending = reservations.filter((r) => r.status === "pending").length;
  const confirmed = reservations.filter((r) => r.status === "confirmed").length;
  const revenue = reservations
    .filter((r) => r.status !== "cancelled")
    .reduce((s, r) => s + (r.depositAmount ?? 0), 0);

  /* ── Filter + paginate ── */
  const filtered = reservations.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (r.guestName ?? r.user?.name ?? "").toLowerCase().includes(q) ||
      (r.guestEmail ?? r.user?.email ?? "").toLowerCase().includes(q) ||
      (r.hotel?.name ?? r.hotelName ?? "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setPage(1);
  }
  function handleStatusChange(e) {
    setStatus(e.target.value);
    setPage(1);
  }

  function openView(r) {
    setViewTarget(r);
  }
  function openEdit(r) {
    setEditTarget(r);
    setViewTarget(null);
  }
  function openDelete(r) {
    setDeleteTarget(r);
    setViewTarget(null);
  }

  function afterSave() {
    setEditTarget(null);
    fetchReservations();
  }
  function afterDelete() {
    setDeleteTarget(null);
    fetchReservations();
  }

  /* ── Quick status update (Accept / Reject) ── */
  async function quickStatus(r, status, e) {
    e.stopPropagation();
    try {
      // ✅ Fixed route: /hotel-bookings/:id
      await API.put(`/hotel-bookings/${r._id}`, { status });
      fetchReservations();
    } catch (_) {}
  }

  /* ── Back to dashboard ── */
  function goBack(e) {
    e.preventDefault();
    navigate("/admin/admindashboard");
  }

  return (
    <>
      <style>{style}</style>
      <div className="hr-root">
        {/* ── Topbar ── */}
        <header className="hr-topbar">
          <div className="hr-logo" onClick={() => navigate("/")}>
            <div className="hr-logo-mark" />
            <div className="hr-logo-text" translate="no">
              Event<span>y</span>
            </div>
          </div>
          <div className="hr-topbar-right">
            <div className="hr-admin-badge">◆ Admin panel</div>
            {/* ✅ Fixed: use button + navigate, not an <a> tag */}
            <button className="hr-back-btn" onClick={goBack}>
              ← Dashboard
            </button>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="hr-main">
          <div className="hr-breadcrumb">Admin · Hotel Reservations</div>
          <h1 className="hr-title">Hotel Reservations</h1>
          <p className="hr-subtitle">
            Manage all hotel bookings — view details, update status, edit or
            remove reservations.
          </p>

          {/* Stats */}
          {!loading && (
            <div className="hr-stats">
              <div className="hr-stat">
                <div className="hr-stat-icon">◆</div>
                <div className="hr-stat-label">Total Reservations</div>
                <div className="hr-stat-val gold">{fmt(total)}</div>
              </div>
              <div className="hr-stat">
                <div className="hr-stat-icon">⏳</div>
                <div className="hr-stat-label">Pending Review</div>
                <div
                  className={`hr-stat-val ${pending > 0 ? "amber" : "green"}`}
                >
                  {fmt(pending)}
                </div>
              </div>
              <div className="hr-stat">
                <div className="hr-stat-icon">✅</div>
                <div className="hr-stat-label">Confirmed</div>
                <div className="hr-stat-val green">{fmt(confirmed)}</div>
              </div>
              <div className="hr-stat">
                <div className="hr-stat-icon">◆</div>
                <div className="hr-stat-label">Deposit Revenue</div>
                <div className="hr-stat-val gold">${fmt(revenue)}</div>
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="hr-toolbar">
            <span className="hr-section-title">◆ All Reservations</span>
            <div className="hr-toolbar-right">
              <div className="hr-search-wrap">
                <span className="hr-search-icon">⌕</span>
                <input
                  className="hr-search"
                  placeholder="Search guest, hotel…"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
              <select
                className="hr-filter-select"
                value={statusFilter}
                onChange={handleStatusChange}
              >
                <option value="all">All Statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="hr-table-wrap">
            {err && (
              <div className="hr-global-err" style={{ margin: 20 }}>
                {err}
              </div>
            )}

            {loading ? (
              <div className="hr-loading">
                <div className="hr-spinner" />
                <p className="hr-loading-text">Loading Reservations</p>
              </div>
            ) : pageData.length === 0 ? (
              <div className="hr-empty">No reservations found.</div>
            ) : (
              <table className="hr-table">
                <thead>
                  <tr>
                    <th>Hotel</th>
                    <th>Guest</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Nights</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((r) => (
                    <tr key={r._id} onClick={() => openView(r)}>
                      <td data-label="Hotel">
                        <div className="hr-td-hotel">
                          {r.hotel?.name ?? r.hotelName ?? "—"}
                        </div>
                        <div className="hr-td-sub">{r.roomType ?? ""}</div>
                      </td>
                      <td data-label="Guest">
                        <div className="hr-td-guest">
                          {r.guestName ?? r.user?.name ?? "—"}
                        </div>
                        <div className="hr-td-sub">
                          {r.guestEmail ?? r.user?.email ?? ""}
                        </div>
                      </td>
                      <td data-label="Check-In">
                        <div className="hr-td-date">{fmtDate(r.checkIn)}</div>
                      </td>
                      <td data-label="Check-Out">
                        <div className="hr-td-date">{fmtDate(r.checkOut)}</div>
                      </td>
                      <td data-label="Night">
                        <div
                          style={{
                            fontSize: 13,
                            color: "var(--cream)",
                            fontWeight: 200,
                          }}
                        >
                          {r.nights ?? "—"}
                        </div>
                      </td>
                      <td data-label="Total">
                        <div className="hr-td-amount">
                          ${fmt(r.totalAmount ?? r.total)}
                        </div>
                      </td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        data-label="Status"
                      >
                        <StatusBadge status={r.status} />
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="hr-td-actions">
                          {/* ✅ Accept / Reject for pending reservations */}
                          {r.status === "pending" && (
                            <>
                              <button
                                className="hr-quick-btn accept"
                                title="Accept reservation"
                                onClick={(e) => quickStatus(r, "confirmed", e)}
                              >
                                ✓ Accept
                              </button>
                              <button
                                className="hr-quick-btn reject"
                                title="Reject reservation"
                                onClick={(e) => quickStatus(r, "cancelled", e)}
                              >
                                ✕ Reject
                              </button>
                            </>
                          )}
                          <button
                            className="hr-btn-icon view"
                            title="View Details"
                            onClick={(e) => {
                              e.stopPropagation();
                              openView(r);
                            }}
                          >
                            ◉
                          </button>
                          <button
                            className="hr-btn-icon edit"
                            title="Edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(r);
                            }}
                          >
                            ✎
                          </button>
                          <button
                            className="hr-btn-icon del"
                            title="Delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDelete(r);
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            {!loading && filtered.length > PAGE_SIZE && (
              <div className="hr-pagination">
                <span className="hr-page-info">
                  Showing{" "}
                  {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
                  {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                  {filtered.length} reservations
                </span>
                <div className="hr-page-btns">
                  <button
                    className="hr-page-btn"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                    )
                    .reduce((acc, p, i, arr) => {
                      if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "…" ? (
                        <span
                          key={`e-${i}`}
                          style={{
                            color: "var(--muted)",
                            padding: "0 4px",
                            fontSize: 12,
                          }}
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          className={`hr-page-btn ${p === page ? "active" : ""}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      ),
                    )}
                  <button
                    className="hr-page-btn"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="hr-footer">
          <p className="hr-footer-copy">
            © 2026 <span>Eventy</span> — Administration
          </p>
          <p className="hr-footer-copy" style={{ opacity: 0.5 }}>
            Luxury Event Planning Platform
          </p>
        </footer>
      </div>

      {/* Modals */}
      {viewTarget && (
        <ViewModal
          reservation={viewTarget}
          onClose={() => setViewTarget(null)}
          onEdit={() => openEdit(viewTarget)}
          onDelete={() => openDelete(viewTarget)}
        />
      )}
      {editTarget && (
        <EditModal
          reservation={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={afterSave}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          reservation={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={afterDelete}
        />
      )}
    </>
  );
}
