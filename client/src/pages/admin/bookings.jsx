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
    --red-dim:    rgba(224,128,128,0.12);
    --green:      #8DB87A;
    --green-dim:  rgba(141,184,122,0.12);
    --amber:      #E0B870;
    --amber-dim:  rgba(224,184,112,0.12);
    --blue:       #7AABCC;
    --blue-dim:   rgba(122,171,204,0.12);
    --cancelled:  #9A9A9A;
    --cancelled-dim: rgba(154,154,154,0.12);
  }

  .adm-root {
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
  .adm-root::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%);
  }

  /* ── Topbar ── */
  .adm-topbar {
    background: rgba(17,17,24,0.94);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 22px 56px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .adm-topbar::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .adm-logo { display: flex; align-items: center; gap: 14px; cursor: pointer; }
  .adm-logo-mark { width: 32px; height: 32px; border: 1.5px solid var(--gold); transform: rotate(45deg); flex-shrink: 0; }
  .adm-logo-text { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase; }
  .adm-logo-text span { color: var(--gold); }
  .adm-topbar-right { display: flex; align-items: center; gap: 16px; }
  .adm-badge {
    font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase;
    padding: 6px 14px; border: 1px solid var(--gold-line); color: var(--gold); background: var(--gold-dim);
  }
  .adm-dash-btn {
    font-family: 'Cinzel', serif; font-size: 8px; font-weight: 400;
    letter-spacing: 0.22em; text-transform: uppercase;
    padding: 8px 18px; border: 1px solid var(--border);
    background: transparent; color: var(--gold);
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
  }
  .adm-dash-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .adm-dash-btn:hover::before { transform: scaleX(1); }
  .adm-dash-btn:hover { color: var(--black); }
  .adm-dash-btn span { position: relative; z-index: 1; }

  /* ── Main ── */
  .adm-main { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 56px 56px 100px; }

  .adm-breadcrumb {
    font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--gold); opacity: 0.8; margin-bottom: 28px;
    display: flex; align-items: center; gap: 14px;
  }
  .adm-breadcrumb::before { content: ''; display: block; width: 32px; height: 1px; background: var(--gold); opacity: 0.6; }

  .adm-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(28px, 3.5vw, 46px); font-weight: 300; color: var(--cream); line-height: 1.05; margin-bottom: 6px; }
  .adm-subtitle { font-size: 12px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; margin-bottom: 44px; }

  /* ── Stats Row ── */
  .adm-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 40px; }
  .adm-stat-card {
    border: 1px solid var(--border); background: rgba(17,17,24,0.85);
    padding: 20px 24px; position: relative; overflow: hidden;
  }
  .adm-stat-card::before { content: ''; position: absolute; top: 0; left: 0; width: 48px; height: 1px; background: var(--gold); }
  .adm-stat-label { font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.7; margin-bottom: 10px; }
  .adm-stat-val { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 300; color: var(--cream); line-height: 1; }
  .adm-stat-val.pending { color: var(--amber); }
  .adm-stat-val.accepted { color: var(--green); }
  .adm-stat-val.rejected { color: var(--red); }

  /* ── Filters ── */
  .adm-filters { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; flex-wrap: wrap; }
  .adm-filter-btn {
    font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase;
    padding: 9px 20px; border: 1px solid var(--border);
    background: transparent; color: var(--muted); cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .adm-filter-btn:hover { border-color: var(--gold-line); color: var(--gold-light); }
  .adm-filter-btn.active { border-color: var(--gold); color: var(--gold-light); background: var(--gold-dim); }
  .adm-search {
    margin-left: auto;
    background: rgba(10,10,10,0.7); border: 1px solid var(--border);
    color: var(--cream); font-family: 'Raleway', sans-serif;
    font-size: 12px; font-weight: 200; padding: 9px 14px;
    outline: none; width: 240px; transition: border-color 0.2s;
  }
  .adm-search:focus { border-color: var(--gold-line); }
  .adm-search::placeholder { color: var(--muted); }

  /* ── Table ── */
  .adm-table-wrap {
    border: 1px solid var(--border); background: rgba(17,17,24,0.85);
    backdrop-filter: blur(10px); position: relative; overflow: hidden;
  }
  .adm-table-wrap::before { content: ''; position: absolute; top: 0; left: 0; width: 80px; height: 1px; background: var(--gold); }

  .adm-table { width: 100%; border-collapse: collapse; }
  .adm-table th {
    padding: 14px 20px; text-align: left;
    font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase;
    color: var(--gold); opacity: 0.7;
    border-bottom: 1px solid var(--border);
    background: rgba(10,10,10,0.3);
    white-space: nowrap;
  }
  .adm-table td { padding: 16px 20px; border-bottom: 1px solid rgba(200,169,81,0.07); vertical-align: middle; }
  .adm-table tr:last-child td { border-bottom: none; }
  .adm-table tr { transition: background 0.18s; }
  .adm-table tr:hover td { background: rgba(200,169,81,0.03); }

  .adm-td-id { font-family: 'Cormorant Garamond', serif; font-size: 13px; color: var(--gold); opacity: 0.7; letter-spacing: 0.04em; }
  .adm-td-venue { font-family: 'Cormorant Garamond', serif; font-size: 16px; color: var(--cream); font-weight: 300; }
  .adm-td-sub { font-size: 10px; font-weight: 200; color: var(--muted); margin-top: 2px; }
  .adm-td-meta { font-size: 11px; font-weight: 200; color: var(--cream); letter-spacing: 0.03em; }
  .adm-td-money { font-family: 'Cormorant Garamond', serif; font-size: 17px; color: var(--cream); font-weight: 300; }
  .adm-td-deposit { font-size: 10px; font-weight: 200; color: var(--gold-light); margin-top: 2px; letter-spacing: 0.03em; }

  /* ── Status badge ── */
  .adm-status {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase;
    padding: 5px 12px; border: 1px solid; white-space: nowrap;
  }
  .adm-status.pending  { color: var(--amber); border-color: rgba(224,184,112,0.4); background: var(--amber-dim); }
  .adm-status.accepted { color: var(--green); border-color: rgba(141,184,122,0.4); background: var(--green-dim); }
  .adm-status.rejected { color: var(--red);   border-color: rgba(224,128,128,0.4); background: var(--red-dim); }
  .adm-status.cancelled { color: var(--cancelled); border-color: rgba(154,154,154,0.4); background: var(--cancelled-dim); }
  .adm-status-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .adm-status.pending  .adm-status-dot { background: var(--amber); }
  .adm-status.accepted .adm-status-dot { background: var(--green); }
  .adm-status.rejected .adm-status-dot { background: var(--red); }
  .adm-status.cancelled .adm-status-dot { background: var(--cancelled); }

  /* ── Postpone / Cancel action buttons ── */
  .adm-action-btn.postpone { color: var(--blue); border-color: rgba(122,171,204,0.4); }
  .adm-action-btn.postpone::before { background: var(--blue); }
  .adm-action-btn.postpone:hover:not(:disabled) { color: var(--black); }
  .adm-action-btn.postpone:hover:not(:disabled)::before { transform: scaleX(1); }

  .adm-action-btn.cancel-btn { color: var(--red); border-color: rgba(224,128,128,0.4); }
  .adm-action-btn.cancel-btn::before { background: var(--red); }
  .adm-action-btn.cancel-btn:hover:not(:disabled) { color: var(--black); }
  .adm-action-btn.cancel-btn:hover:not(:disabled)::before { transform: scaleX(1); }

  /* ── Modal action postpone / cancel ── */
  .adm-modal-action.postpone { color: var(--blue); border-color: rgba(122,171,204,0.5); }
  .adm-modal-action.postpone::before { background: var(--blue); }
  .adm-modal-action.postpone:hover:not(:disabled) { color: var(--black); }
  .adm-modal-action.postpone:hover:not(:disabled)::before { transform: scaleX(1); }

  .adm-modal-action.cancel-btn { color: var(--red); border-color: rgba(224,128,128,0.5); }
  .adm-modal-action.cancel-btn::before { background: var(--red); }
  .adm-modal-action.cancel-btn:hover:not(:disabled) { color: var(--black); }
  .adm-modal-action.cancel-btn:hover:not(:disabled)::before { transform: scaleX(1); }

  /* ── Postpone date modal ── */
  .adm-postpone-overlay {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,0.88); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .adm-postpone-box {
    background: #111118; border: 1px solid var(--gold-line);
    padding: 36px 40px; max-width: 400px; width: 100%; position: relative;
  }
  .adm-postpone-box::before { content: ''; position: absolute; top: 0; left: 0; width: 60px; height: 1px; background: var(--gold); }
  .adm-postpone-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 300; color: var(--cream); margin-bottom: 6px; }
  .adm-postpone-sub { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.04em; margin-bottom: 28px; }
  .adm-postpone-label { font-size: 9px; font-weight: 300; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); opacity: 0.8; margin-bottom: 10px; display: block; }
  .adm-postpone-input {
    width: 100%; background: rgba(10,10,10,0.7); border: 1px solid var(--border);
    color: var(--cream); font-family: 'Raleway', sans-serif; font-size: 14px;
    padding: 11px 14px; outline: none; transition: border-color 0.2s;
    color-scheme: dark;
  }
  .adm-postpone-input:focus { border-color: var(--gold-line); }
  .adm-postpone-actions { display: flex; gap: 12px; margin-top: 28px; }
  .adm-postpone-confirm {
    flex: 1; padding: 13px; font-family: 'Cinzel', serif; font-size: 9px;
    letter-spacing: 0.26em; text-transform: uppercase;
    border: 1px solid rgba(122,171,204,0.5); color: var(--blue);
    background: transparent; cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
  }
  .adm-postpone-confirm::before {
    content: ''; position: absolute; inset: 0; background: var(--blue);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .adm-postpone-confirm:hover:not(:disabled) { color: var(--black); }
  .adm-postpone-confirm:hover:not(:disabled)::before { transform: scaleX(1); }
  .adm-postpone-confirm span { position: relative; z-index: 1; }
  .adm-postpone-confirm:disabled { opacity: 0.35; cursor: not-allowed; }
  .adm-postpone-cancel-btn {
    flex: 1; padding: 13px; font-family: 'Cinzel', serif; font-size: 9px;
    letter-spacing: 0.26em; text-transform: uppercase;
    border: 1px solid var(--border); color: var(--muted);
    background: transparent; cursor: pointer; transition: border-color 0.2s, color 0.2s;
  }
  .adm-postpone-cancel-btn:hover { border-color: var(--gold-line); color: var(--gold-light); }

  /* ── Action buttons ── */
  .adm-actions { display: flex; gap: 8px; }
  .adm-action-btn {
    font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 7px 14px; border: 1px solid; background: transparent;
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.25s;
    white-space: nowrap;
  }
  .adm-action-btn::before {
    content: ''; position: absolute; inset: 0;
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .adm-action-btn span { position: relative; z-index: 1; }
  .adm-action-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .adm-action-btn.accept { color: var(--green); border-color: rgba(141,184,122,0.4); }
  .adm-action-btn.accept::before { background: var(--green); }
  .adm-action-btn.accept:hover:not(:disabled) { color: var(--black); }
  .adm-action-btn.accept:hover:not(:disabled)::before { transform: scaleX(1); }

  .adm-action-btn.reject { color: var(--red); border-color: rgba(224,128,128,0.4); }
  .adm-action-btn.reject::before { background: var(--red); }
  .adm-action-btn.reject:hover:not(:disabled) { color: var(--black); }
  .adm-action-btn.reject:hover:not(:disabled)::before { transform: scaleX(1); }

  .adm-action-btn.view-btn { color: var(--gold); border-color: var(--border); }
  .adm-action-btn.view-btn::before { background: linear-gradient(90deg, var(--gold), #A8843A); }
  .adm-action-btn.view-btn:hover:not(:disabled) { color: var(--black); }
  .adm-action-btn.view-btn:hover:not(:disabled)::before { transform: scaleX(1); }

  /* ── Empty state ── */
  .adm-empty { text-align: center; padding: 72px 24px; }
  .adm-empty-icon { font-size: 36px; margin-bottom: 16px; opacity: 0.4; }
  .adm-empty-text { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; color: var(--muted); }
  .adm-empty-sub { font-size: 11px; font-weight: 200; color: var(--muted); margin-top: 8px; opacity: 0.6; letter-spacing: 0.06em; }

  /* ── Loading ── */
  .adm-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; gap: 20px; }
  .adm-spinner {
    width: 36px; height: 36px; border: 1.5px solid var(--border);
    border-top-color: var(--gold); border-radius: 50%;
    animation: adm-spin 0.9s linear infinite;
  }
  @keyframes adm-spin { to { transform: rotate(360deg); } }
  .adm-loading-text { font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.3em; text-transform: uppercase; }

  /* ── Detail Modal ── */
  .adm-modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.82); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .adm-modal {
    background: #111118; border: 1px solid var(--gold-line);
    padding: 0; max-width: 540px; width: 100%;
    position: relative; max-height: 85vh; overflow-y: auto;
  }
  .adm-modal::before { content: ''; position: absolute; top: 0; left: 0; width: 80px; height: 1px; background: var(--gold); }
  .adm-modal::after  { content: ''; position: absolute; bottom: 0; right: 0; width: 80px; height: 1px; background: var(--gold); }
  .adm-modal-head {
    padding: 28px 32px 20px; border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .adm-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 300; color: var(--cream); }
  .adm-modal-id { font-size: 9px; font-weight: 200; color: var(--gold); opacity: 0.6; letter-spacing: 0.1em; margin-top: 4px; }
  .adm-modal-close {
    background: transparent; border: 1px solid var(--border); color: var(--muted);
    font-size: 14px; width: 32px; height: 32px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s, color 0.2s; flex-shrink: 0;
  }
  .adm-modal-close:hover { border-color: var(--gold-line); color: var(--gold); }
  .adm-modal-body { padding: 24px 32px; }
  .adm-modal-section { margin-bottom: 24px; }
  .adm-modal-section-title {
    font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase;
    color: var(--gold); opacity: 0.7; margin-bottom: 14px;
    display: flex; align-items: center; gap: 10px;
  }
  .adm-modal-section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .adm-modal-row { display: flex; justify-content: space-between; align-items: baseline; padding: 8px 0; border-bottom: 1px solid rgba(200,169,81,0.06); }
  .adm-modal-row:last-child { border-bottom: none; }
  .adm-modal-row-label { font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.04em; }
  .adm-modal-row-val { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: var(--cream); text-align: right; max-width: 60%; word-break: break-word; }
  .adm-modal-row-val.gold { color: var(--gold-light); }
  .adm-modal-footer { padding: 20px 32px 28px; border-top: 1px solid var(--border); display: flex; gap: 12px; }
  .adm-modal-action {
    flex: 1; padding: 13px; font-family: 'Cinzel', serif; font-size: 9px;
    letter-spacing: 0.26em; text-transform: uppercase; border: 1px solid;
    background: transparent; cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
  }
  .adm-modal-action span { position: relative; z-index: 1; }
  .adm-modal-action::before {
    content: ''; position: absolute; inset: 0;
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .adm-modal-action.accept { color: var(--green); border-color: rgba(141,184,122,0.5); }
  .adm-modal-action.accept::before { background: var(--green); }
  .adm-modal-action.accept:hover:not(:disabled) { color: var(--black); }
  .adm-modal-action.accept:hover:not(:disabled)::before { transform: scaleX(1); }
  .adm-modal-action.reject { color: var(--red); border-color: rgba(224,128,128,0.5); }
  .adm-modal-action.reject::before { background: var(--red); }
  .adm-modal-action.reject:hover:not(:disabled) { color: var(--black); }
  .adm-modal-action.reject:hover:not(:disabled)::before { transform: scaleX(1); }
  .adm-modal-action:disabled { opacity: 0.35; cursor: not-allowed; }

  /* ── Toast ── */
  .adm-toast {
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
    background: rgba(17,17,24,0.97); border: 1px solid var(--gold-line);
    padding: 14px 28px; z-index: 300;
    font-size: 12px; font-weight: 200; color: var(--cream); letter-spacing: 0.06em;
    display: flex; align-items: center; gap: 12px;
    animation: adm-toast-in 0.3s ease;
  }
  .adm-toast.success .adm-toast-dot { background: var(--green); }
  .adm-toast.error   .adm-toast-dot { background: var(--red); }
  .adm-toast-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  @keyframes adm-toast-in { from { opacity: 0; transform: translateX(-50%) translateY(12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

/* ── Screenshot ── */
  .adm-screenshot-wrap { margin-top: 12px; }
  .adm-screenshot-img { width: 100%; max-height: 260px; object-fit: contain; border: 1px solid var(--border); display: block; cursor: pointer; transition: border-color 0.2s; }
  .adm-screenshot-img:hover { border-color: var(--gold-line); }
  .adm-screenshot-hint { font-size: 9px; color: var(--muted); margin-top: 6px; letter-spacing: 0.04em; text-align: center; }

  /* ── Footer ── */
  .adm-footer {
    position: relative; z-index: 1; border-top: 1px solid var(--border); padding: 32px 56px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(17,17,24,0.6); backdrop-filter: blur(8px);
  }
  .adm-footer-copy { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }
  .adm-footer-copy span { color: var(--gold); }

  @media (max-width: 900px) {
    .adm-topbar { padding: 18px 24px; }
    .adm-main { padding: 36px 24px 60px; }
    .adm-stats { grid-template-columns: repeat(2, 1fr); }
    .adm-table th:nth-child(3),
    .adm-table td:nth-child(3),
    .adm-table th:nth-child(5),
    .adm-table td:nth-child(5) { display: none; }
    .adm-search { width: 100%; }
    .adm-filters { gap: 8px; }
    .adm-footer { padding: 24px; flex-direction: column; gap: 10px; text-align: center; }
  }

  @media (max-width: 900px) {
  /* ── Layout ── */
  .adm-topbar { padding: 16px 20px; }
  .adm-logo-text { font-size: 15px; letter-spacing: 0.2em; }
  .adm-badge { display: none; }
  .adm-main { padding: 28px 16px 60px; }
  .adm-footer { padding: 20px 16px; flex-direction: column; gap: 8px; text-align: center; }

  /* ── Title ── */
  .adm-breadcrumb { margin-bottom: 16px; }
  .adm-subtitle { margin-bottom: 28px; }

  /* ── Stats ── */
  .adm-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 24px; }
  .adm-stat-card { padding: 14px 16px; }
  .adm-stat-val { font-size: 28px; }

  /* ── Filters ── */
  .adm-filters { gap: 8px; }
  .adm-filter-btn { padding: 8px 14px; font-size: 7px; }
  .adm-search { width: 100%; margin-left: 0; margin-top: 4px; }

  /* ── Table: hide low-priority columns ── */
  .adm-table th:nth-child(3),
  .adm-table td:nth-child(3),
  .adm-table th:nth-child(5),
  .adm-table td:nth-child(5) { display: none; }

  .adm-table th { padding: 12px 12px; font-size: 7px; }
  .adm-table td { padding: 12px 12px; }

  .adm-td-venue { font-size: 14px; }
  .adm-td-money { font-size: 15px; }

  /* ── Action buttons: icon-only on small rows ── */
  .adm-actions { gap: 6px; }
  .adm-action-btn { padding: 7px 10px; }

  /* ── Modal ── */
  .adm-modal { max-height: 92vh; margin: 0 8px; }
  .adm-modal-head { padding: 20px 20px 16px; }
  .adm-modal-title { font-size: 20px; }
  .adm-modal-body { padding: 16px 20px; }
  .adm-modal-footer { padding: 14px 20px 20px; flex-direction: column; gap: 8px; }
  .adm-modal-action { padding: 13px; }

  /* ── Postpone modal ── */
  .adm-postpone-box { padding: 24px 20px; margin: 0 8px; }
  .adm-postpone-title { font-size: 20px; }
  .adm-postpone-actions { flex-direction: column; }

  /* ── Toast ── */
  .adm-toast { width: calc(100% - 32px); bottom: 20px; font-size: 11px; padding: 12px 16px; }

  .adm-modal-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .adm-modal {
    max-width: 100%;
    width: 100%;
    max-height: 92vh;
    margin: 0;
    border-radius: 16px 16px 0 0;
    border-left: none;
    border-right: none;
    border-bottom: none;
  }

  .adm-modal-head {
    padding: 20px 16px 14px;
  }

  .adm-modal-title {
    font-size: 20px;
  }

  .adm-modal-body {
    padding: 14px 16px;
  }

  .adm-modal-row-label {
    font-size: 11px;
  }

  .adm-modal-row-val {
    font-size: 13px;
    max-width: 55%;
  }

  .adm-modal-footer {
    padding: 12px 16px 20px;
    flex-direction: column;
    gap: 8px;
  }

  .adm-modal-action {
    padding: 14px;
    font-size: 10px;
  }
}

/* Extra small phones */
@media (max-width: 480px) {
  .adm-stats { grid-template-columns: repeat(2, 1fr); }

  /* Stack filters vertically, full-width */
  .adm-filters { flex-direction: column; align-items: stretch; }
  .adm-filter-btn { text-align: center; }

  /* Hide more table columns — keep only Venue, Deposit, Status, Actions */
  .adm-table th:nth-child(4),
  .adm-table td:nth-child(4) { display: none; }

  /* Overflow-scroll the table instead of squishing */
  .adm-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .adm-table { min-width: 420px; }

  .adm-modal-overlay { padding: 0; align-items: flex-end; }
  .adm-modal { max-height: 96vh; margin: 0; border-radius: 0; border-left: none; border-right: none; border-bottom: none; }
}
`;

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  cancelled: "Cancelled",
};
const FILTERS = ["all", "pending", "accepted", "rejected", "cancelled"];

const fmt = (n) => (n ?? 0).toLocaleString();
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
function AdminBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [postponeTarget, setPostponeTarget] = useState(null);
  const [newDate, setNewDate] = useState("");

  /* ── Fetch ── */
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await API.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      showToast("Failed to load bookings.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ── Status update ── */
  const updateStatus = async (id, status) => {
    setActionLoading((p) => ({ ...p, [id]: true }));
    try {
      const res = await API.put(`/bookings/${id}/status`, { status });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: res.data.status ?? status } : b,
        ),
      );
      if (selected?._id === id)
        setSelected((p) => ({ ...p, status: res.data.status ?? status }));
      showToast(
        `Booking ${status === "accepted" ? "accepted" : "rejected"} successfully.`,
        "success",
      );
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Action failed. Please try again.",
        "error",
      );
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  };

  /* ── Postpone ── */
  const openPostpone = (booking) => {
    const current = booking.eventDate
      ? new Date(booking.eventDate).toISOString().split("T")[0]
      : "";
    setNewDate(current);
    setPostponeTarget(booking);
  };

  const confirmPostpone = async () => {
    if (!postponeTarget || !newDate) return;
    const id = postponeTarget._id;
    setActionLoading((p) => ({ ...p, [id]: true }));
    try {
      const res = await API.put(`/bookings/${id}/postpone`, { newDate });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, eventDate: res.data.eventDate } : b,
        ),
      );
      if (selected?._id === id)
        setSelected((p) => ({ ...p, eventDate: res.data.eventDate }));
      setPostponeTarget(null);
      setNewDate("");
      showToast("Booking postponed successfully.", "success");
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Postpone failed. Please try again.",
        "error",
      );
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  };

  /* ── Cancel ── */
  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    setActionLoading((p) => ({ ...p, [id]: true }));
    try {
      const res = await API.put(`/bookings/${id}/cancel`);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: res.data.status ?? "cancelled" } : b,
        ),
      );
      if (selected?._id === id)
        setSelected((p) => ({ ...p, status: res.data.status ?? "cancelled" }));
      showToast("Booking cancelled successfully.", "success");
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Cancel failed. Please try again.",
        "error",
      );
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  };

  /* ── Toast ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Derived ── */
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    accepted: bookings.filter((b) => b.status === "accepted").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const visible = bookings.filter((b) => {
    if (filter !== "all" && b.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b._id?.toLowerCase().includes(q) ||
        b.venue?.name?.toLowerCase().includes(q) ||
        b.eventType?.toLowerCase().includes(q) ||
        b.venue?.location?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  /* ─────────────────────────────────────────
     Detail Modal
  ───────────────────────────────────────── */
  const DetailModal = ({ booking, onClose }) => {
    const isLoading = actionLoading[booking._id];
    const isPending = booking.status === "pending";
    const isAccepted = booking.status === "accepted";

    return (
      <div
        className="adm-modal-overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="adm-modal">
          <div className="adm-modal-head">
            <div>
              <div className="adm-modal-title">
                {booking.venue?.name ?? "—"}
              </div>
              <div className="adm-modal-id">ID: {booking._id}</div>
            </div>
            <button className="adm-modal-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="adm-modal-body">
            <div className="adm-modal-section">
              <div className="adm-modal-section-title">Status</div>
              <div style={{ paddingTop: 4 }}>
                <span className={`adm-status ${booking.status}`}>
                  <span className="adm-status-dot" />
                  {STATUS_LABELS[booking.status] ?? booking.status}
                </span>
              </div>
            </div>

            <div className="adm-modal-section">
              <div className="adm-modal-section-title">Event Details</div>
              <div className="adm-modal-row">
                <span className="adm-modal-row-label">Event Type</span>
                <span className="adm-modal-row-val">
                  {booking.eventType ?? "—"}
                </span>
              </div>
              <div className="adm-modal-row">
                <span className="adm-modal-row-label">Event Date</span>
                <span className="adm-modal-row-val">
                  {fmtDate(booking.eventDate)}
                </span>
              </div>
              <div className="adm-modal-row">
                <span className="adm-modal-row-label">Duration</span>
                <span className="adm-modal-row-val">
                  {booking.hours ?? "—"} hours
                </span>
              </div>
              <div className="adm-modal-row">
                <span className="adm-modal-row-label">Guests</span>
                <span className="adm-modal-row-val">
                  {fmt(booking.guestCount)}
                </span>
              </div>
            </div>

            <div className="adm-modal-section">
              <div className="adm-modal-section-title">Venue</div>
              <div className="adm-modal-row">
                <span className="adm-modal-row-label">Name</span>
                <span className="adm-modal-row-val">
                  {booking.venue?.name ?? "—"}
                </span>
              </div>
              <div className="adm-modal-row">
                <span className="adm-modal-row-label">Location</span>
                <span className="adm-modal-row-val">
                  {booking.venue?.location ?? "—"}
                </span>
              </div>
              <div className="adm-modal-row">
                <span className="adm-modal-row-label">Capacity</span>
                <span className="adm-modal-row-val">
                  {fmt(booking.venue?.capacity)} guests
                </span>
              </div>
            </div>

            <div className="adm-modal-section">
              <div className="adm-modal-section-title">Payment</div>
              <div className="adm-modal-row">
                <span className="adm-modal-row-label">Method</span>
                <span
                  className="adm-modal-row-val"
                  style={{ textTransform: "capitalize" }}
                >
                  {booking.paymentMethod?.replace(/_/g, " ") ?? "—"}
                </span>
              </div>
              <div className="adm-modal-row">
                <span className="adm-modal-row-label">
                  Deposit ({booking.depositPct ?? "—"}%)
                </span>
                <span className="adm-modal-row-val gold">
                  ${fmt(booking.depositAmount)}
                </span>
              </div>
            </div>

            {booking.screenshotUrl && (
              <div className="adm-modal-section">
                <div className="adm-modal-section-title">
                  Payment Screenshot
                </div>
                <div className="adm-screenshot-wrap">
                  <img
                    className="adm-screenshot-img"
                    src={`http://localhost:5000${booking.screenshotUrl}`}
                    alt="Payment screenshot"
                    onClick={() =>
                      window.open(
                        `http://localhost:5000${booking.screenshotUrl}`,
                        "_blank",
                      )
                    }
                  />
                  <p className="adm-screenshot-hint">
                    Click image to open full size
                  </p>
                </div>
              </div>
            )}

            {booking.services?.length > 0 && (
              <div className="adm-modal-section">
                <div className="adm-modal-section-title">
                  Services ({booking.services.length})
                </div>
                {booking.services.map((s, i) => (
                  <div className="adm-modal-row" key={i}>
                    <span className="adm-modal-row-label">{s.name ?? s}</span>
                    {s.price != null && (
                      <span className="adm-modal-row-val">${fmt(s.price)}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {booking.invites?.length > 0 && (
              <div className="adm-modal-section">
                <div className="adm-modal-section-title">
                  Invitations ({booking.invites.length})
                </div>
                {booking.invites.map((email, i) => (
                  <div className="adm-modal-row" key={i}>
                    <span
                      className="adm-modal-row-label"
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span style={{ color: "var(--gold)", fontSize: 9 }}>
                        ✉
                      </span>
                      {email}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isPending && (
            <div className="adm-modal-footer">
              <button
                className="adm-modal-action accept"
                disabled={isLoading}
                onClick={() => updateStatus(booking._id, "accepted")}
              >
                <span>{isLoading ? "Processing…" : "✔ Accept"}</span>
              </button>
              <button
                className="adm-modal-action reject"
                disabled={isLoading}
                onClick={() => updateStatus(booking._id, "rejected")}
              >
                <span>{isLoading ? "Processing…" : "✕ Reject"}</span>
              </button>
            </div>
          )}
          {isAccepted && (
            <div className="adm-modal-footer">
              <button
                className="adm-modal-action postpone"
                disabled={isLoading}
                onClick={() => {
                  onClose();
                  openPostpone(booking);
                }}
              >
                <span>{isLoading ? "Processing…" : "⏱ Postpone"}</span>
              </button>
              <button
                className="adm-modal-action cancel-btn"
                disabled={isLoading}
                onClick={() => {
                  onClose();
                  cancelBooking(booking._id);
                }}
              >
                <span>{isLoading ? "Processing…" : "✕ Cancel"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────
     Render
  ───────────────────────────────────────── */
  return (
    <>
      <style>{style}</style>
      <div className="adm-root">
        {/* Topbar */}
        <nav className="adm-topbar">
          <div
            className="adm-logo"
            onClick={() => navigate("/")}
            translate="no"
          >
            <div className="adm-logo-mark" />
            <div className="adm-logo-text">
              Event<span>y</span>
            </div>
          </div>
          <div className="adm-topbar-right">
            <span className="adm-badge">◆ Admin Panel</span>
            {/* ── Dashboard Button ── */}
            <button
              className="adm-dash-btn"
              onClick={() => navigate("/admin/admindashboard")}
            >
              <span>← Dashboard</span>
            </button>
          </div>
        </nav>

        <main className="adm-main">
          <p className="adm-breadcrumb">Administration</p>
          <h1 className="adm-title">Booking Management</h1>
          <p className="adm-subtitle">
            Review, approve, or decline reservation requests from clients.
          </p>

          {/* Stats */}
          <div className="adm-stats">
            {[
              { label: "Total Bookings", val: stats.total, cls: "" },
              { label: "Pending Review", val: stats.pending, cls: "pending" },
              { label: "Accepted", val: stats.accepted, cls: "accepted" },
              { label: "Rejected", val: stats.rejected, cls: "rejected" },
            ].map((s) => (
              <div className="adm-stat-card" key={s.label}>
                <div className="adm-stat-label">{s.label}</div>
                <div className={`adm-stat-val ${s.cls}`}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Filters + Search */}
          <div className="adm-filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`adm-filter-btn${filter === f ? " active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : STATUS_LABELS[f]}
                {f !== "all" && (
                  <span style={{ marginLeft: 6, opacity: 0.6 }}>
                    ({stats[f]})
                  </span>
                )}
              </button>
            ))}
            <input
              className="adm-search"
              placeholder="Search by venue, ID, event…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="adm-table-wrap">
            {loading ? (
              <div className="adm-loading">
                <div className="adm-spinner" />
                <p className="adm-loading-text">Loading Bookings</p>
              </div>
            ) : visible.length === 0 ? (
              <div className="adm-empty">
                <div className="adm-empty-icon">◇</div>
                <div className="adm-empty-text">No bookings found</div>
                <div className="adm-empty-sub">
                  {search
                    ? "Try adjusting your search query."
                    : "No reservations match the current filter."}
                </div>
              </div>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Venue / Event</th>
                    <th>Date & Duration</th>
                    <th>Deposit</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((b) => {
                    const isLoading = actionLoading[b._id];
                    const isPending = b.status === "pending";
                    const isAccepted = b.status === "accepted";
                    return (
                      <tr key={b._id}>
                        <td>
                          <div className="adm-td-id">
                            #{b._id?.slice(-8).toUpperCase()}
                          </div>
                        </td>
                        <td>
                          <div className="adm-td-venue">
                            {b.venue?.name ?? "—"}
                          </div>
                          <div className="adm-td-sub">
                            {b.eventType ?? "—"} · {fmt(b.guestCount)} guests
                          </div>
                        </td>
                        <td>
                          <div className="adm-td-meta">
                            {fmtDate(b.eventDate)}
                          </div>
                          <div className="adm-td-sub">
                            {b.hours ?? "—"} hours
                          </div>
                        </td>
                        <td>
                          <div className="adm-td-money">
                            ${fmt(b.depositAmount)}
                          </div>
                          <div className="adm-td-deposit">
                            {b.depositPct ?? "—"}% of total
                          </div>
                        </td>
                        <td>
                          <div
                            className="adm-td-meta"
                            style={{ textTransform: "capitalize" }}
                          >
                            {b.paymentMethod?.replace(/_/g, " ") ?? "—"}
                          </div>
                        </td>
                        <td>
                          <span className={`adm-status ${b.status}`}>
                            <span className="adm-status-dot" />
                            {STATUS_LABELS[b.status] ?? b.status}
                          </span>
                        </td>
                        <td>
                          <div className="adm-actions">
                            <button
                              className="adm-action-btn view-btn"
                              onClick={() => setSelected(b)}
                            >
                              <span>View</span>
                            </button>
                            {isPending && (
                              <>
                                <button
                                  className="adm-action-btn accept"
                                  disabled={isLoading}
                                  onClick={() =>
                                    updateStatus(b._id, "accepted")
                                  }
                                >
                                  <span>✔</span>
                                </button>
                                <button
                                  className="adm-action-btn reject"
                                  disabled={isLoading}
                                  onClick={() =>
                                    updateStatus(b._id, "rejected")
                                  }
                                >
                                  <span>✕</span>
                                </button>
                              </>
                            )}
                            {isAccepted && (
                              <>
                                <button
                                  className="adm-action-btn postpone"
                                  disabled={isLoading}
                                  onClick={() => openPostpone(b)}
                                >
                                  <span>⏱</span>
                                </button>
                                <button
                                  className="adm-action-btn cancel-btn"
                                  disabled={isLoading}
                                  onClick={() => cancelBooking(b._id)}
                                >
                                  <span>✕</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>

        <footer className="adm-footer">
          <p className="adm-footer-copy">
            © 2026 <span>Eventy</span> — Administration
          </p>
          <p className="adm-footer-copy" style={{ opacity: 0.5 }}>
            Luxury Event Planning Platform
          </p>
        </footer>
      </div>

      {/* Detail Modal */}
      {selected && (
        <DetailModal booking={selected} onClose={() => setSelected(null)} />
      )}

      {/* Postpone Modal */}
      {postponeTarget && (
        <div
          className="adm-postpone-overlay"
          onClick={(e) =>
            e.target === e.currentTarget && setPostponeTarget(null)
          }
        >
          <div className="adm-postpone-box">
            <div className="adm-postpone-title">Postpone Booking</div>
            <div className="adm-postpone-sub">
              {postponeTarget.venue?.name ?? "—"} · Current date:{" "}
              {fmtDate(postponeTarget.eventDate)}
            </div>
            <label className="adm-postpone-label">New Event Date</label>
            <input
              type="date"
              className="adm-postpone-input"
              value={newDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <div className="adm-postpone-actions">
              <button
                className="adm-postpone-confirm"
                disabled={!newDate || actionLoading[postponeTarget._id]}
                onClick={confirmPostpone}
              >
                <span>
                  {actionLoading[postponeTarget._id]
                    ? "Saving…"
                    : "Confirm Postpone"}
                </span>
              </button>
              <button
                className="adm-postpone-cancel-btn"
                onClick={() => setPostponeTarget(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`adm-toast ${toast.type}`}>
          <span className="adm-toast-dot" />
          {toast.msg}
        </div>
      )}
    </>
  );
}

export default AdminBookings;
