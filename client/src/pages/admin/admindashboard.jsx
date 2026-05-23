import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

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
    background: rgba(17,17,24,0.94);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 22px 56px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .dash-topbar::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .dash-logo { display: flex; align-items: center; gap: 14px; cursor: pointer; }
  .dash-logo-mark { width: 32px; height: 32px; border: 1.5px solid var(--gold); transform: rotate(45deg); flex-shrink: 0; }
  .dash-logo-text { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase; }
  .dash-logo-text span { color: var(--gold); }
  .dash-topbar-right { display: flex; align-items: center; gap: 16px; }
  .dash-admin-badge {
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
  .dash-stat:nth-child(4) { animation-delay: 0.20s; }
  @keyframes dash-fadein { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .dash-stat::before { content: ''; position: absolute; top: 0; left: 0; width: 48px; height: 1px; background: var(--gold); }
  .dash-stat-icon { font-size: 18px; margin-bottom: 14px; opacity: 0.7; }
  .dash-stat-label { font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.7; margin-bottom: 8px; }
  .dash-stat-val { font-family: 'Cormorant Garamond', serif; font-size: 42px; font-weight: 300; color: var(--cream); line-height: 1; }
  .dash-stat-val.gold { color: var(--gold-light); }
  .dash-stat-val.green { color: var(--green); }
  .dash-stat-val.amber { color: var(--amber); }
  .dash-stat-val.red { color: var(--red); }
  .dash-stat-sub { font-size: 10px; font-weight: 200; color: var(--muted); margin-top: 6px; letter-spacing: 0.04em; }

  /* ── Section title ── */
  .dash-section-title {
    font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--gold); opacity: 0.8; margin-bottom: 20px;
    display: flex; align-items: center; gap: 14px;
  }
  .dash-section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* ── Nav Cards ── */
  .dash-nav-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 56px; }
  .dash-nav-card {
    border: 1px solid var(--border); background: rgba(17,17,24,0.85);
    padding: 40px 44px; position: relative; overflow: hidden;
    cursor: pointer; transition: border-color 0.3s, background 0.3s;
    animation: dash-fadein 0.5s ease both;
    display: flex; flex-direction: column; justify-content: space-between; min-height: 240px;
  }
  .dash-nav-card:nth-child(1) { animation-delay: 0.25s; }
  .dash-nav-card:nth-child(2) { animation-delay: 0.32s; }
  .dash-nav-card:nth-child(3) { animation-delay: 0.39s; }
  .dash-nav-card:hover { border-color: var(--gold); background: rgba(200,169,81,0.05); }
  .dash-nav-card::before { content: ''; position: absolute; top: 0; left: 0; width: 64px; height: 1px; background: var(--gold); transition: width 0.4s ease; }
  .dash-nav-card:hover::before { width: 100%; }
  .dash-nav-card::after { content: ''; position: absolute; bottom: 0; right: 0; width: 64px; height: 1px; background: var(--gold); opacity: 0.4; transition: width 0.4s ease; }
  .dash-nav-card:hover::after { width: 100%; }
  .dash-nav-card-top { display: flex; align-items: flex-start; justify-content: space-between; }
  .dash-nav-card-icon { width: 56px; height: 56px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 22px; transition: border-color 0.3s, background 0.3s; flex-shrink: 0; }
  .dash-nav-card:hover .dash-nav-card-icon { border-color: var(--gold-line); background: var(--gold-dim); }
  .dash-nav-card-arrow { font-family: 'Cinzel', serif; font-size: 18px; color: var(--gold); opacity: 0; transform: translateX(-8px); transition: opacity 0.3s, transform 0.3s; }
  .dash-nav-card:hover .dash-nav-card-arrow { opacity: 1; transform: translateX(0); }
  .dash-nav-card-label { font-family: 'Cinzel', serif; font-size: 10px; font-weight: 400; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); margin-bottom: 10px; }
  .dash-nav-card-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300; color: var(--cream); margin-bottom: 12px; line-height: 1.1; }
  .dash-nav-card-desc { font-size: 12px; font-weight: 200; color: var(--muted); line-height: 1.7; letter-spacing: 0.03em; }
  .dash-nav-card-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 18px; margin-top: 24px; }
  .dash-nav-card-count { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; color: var(--gold-light); }
  .dash-nav-card-count-label { font-size: 9px; font-weight: 200; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 2px; }
  .dash-nav-card-cta { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.24em; text-transform: uppercase; padding: 9px 20px; border: 1px solid var(--gold); color: var(--gold); background: transparent; position: relative; overflow: hidden; transition: color 0.3s; }
  .dash-nav-card-cta::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, var(--gold), #A8843A); transform: scaleX(0); transform-origin: left; transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0; }
  .dash-nav-card:hover .dash-nav-card-cta::before { transform: scaleX(1); }
  .dash-nav-card:hover .dash-nav-card-cta { color: var(--black); }
  .dash-nav-card-cta span { position: relative; z-index: 1; }

  /* ── Tables ── */
  .dash-recent-wrap {
    border: 1px solid var(--border); background: rgba(17,17,24,0.85);
    position: relative; overflow: hidden;
    animation: dash-fadein 0.5s 0.4s ease both;
  }
  .dash-recent-wrap::before { content: ''; position: absolute; top: 0; left: 0; width: 80px; height: 1px; background: var(--gold); }
  .dash-recent-head { padding: 18px 28px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .dash-recent-head-title { font-size: 9px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.8; }
  .dash-recent-view-all { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); background: transparent; border: none; cursor: pointer; transition: color 0.2s; padding: 0; }
  .dash-recent-view-all:hover { color: var(--gold); }
  .dash-recent-table { width: 100%; border-collapse: collapse; }
  .dash-recent-table th { padding: 12px 20px; text-align: left; font-size: 8px; font-weight: 300; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); opacity: 0.6; border-bottom: 1px solid var(--border); background: rgba(10,10,10,0.3); }
  .dash-recent-table td { padding: 14px 20px; border-bottom: 1px solid rgba(200,169,81,0.06); vertical-align: middle; }
  .dash-recent-table tr:last-child td { border-bottom: none; }
  .dash-recent-table tr { transition: background 0.15s; }
  .dash-recent-table tr:hover td { background: rgba(200,169,81,0.02); }
  .dash-rt-venue { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: var(--cream); }
  .dash-rt-sub { font-size: 10px; font-weight: 200; color: var(--muted); margin-top: 2px; }
  .dash-rt-amount { font-family: 'Cormorant Garamond', serif; font-size: 16px; color: var(--cream); }

  .dash-status { display: inline-flex; align-items: center; gap: 5px; font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.2em; text-transform: uppercase; padding: 4px 10px; border: 1px solid; white-space: nowrap; }
  .dash-status.pending  { color: var(--amber); border-color: rgba(224,184,112,0.4); background: var(--amber-dim); }
  .dash-status.accepted { color: var(--green); border-color: rgba(141,184,122,0.4); background: var(--green-dim); }
  .dash-status.rejected { color: var(--red);   border-color: rgba(224,128,128,0.4); background: var(--red-dim); }
  .dash-status.confirmed { color: var(--green); border-color: rgba(141,184,122,0.4); background: var(--green-dim); }
  .dash-status.cancelled { color: var(--muted); border-color: rgba(240,234,214,0.15); background: rgba(240,234,214,0.04); }
  .dash-status-dot { width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; background: currentColor; }

  /* ── Provider Request Actions ── */
  .dash-req-detail { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: var(--cream); }
  .dash-req-type { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
  .dash-req-actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .dash-btn-accept, .dash-btn-reject, .dash-btn-view {
    font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 6px 14px; border: 1px solid; cursor: pointer;
    background: transparent; transition: background 0.2s, color 0.2s; white-space: nowrap;
  }
  .dash-btn-accept { color: var(--green); border-color: rgba(141,184,122,0.4); }
  .dash-btn-accept:hover:not(:disabled) { background: var(--green-dim); }
  .dash-btn-accept:disabled { opacity: 0.4; cursor: not-allowed; }
  .dash-btn-reject { color: var(--red); border-color: rgba(224,128,128,0.4); }
  .dash-btn-reject:hover:not(:disabled) { background: var(--red-dim); }
  .dash-btn-reject:disabled { opacity: 0.4; cursor: not-allowed; }
  .dash-btn-view { color: var(--gold); border-color: var(--gold-line); }
  .dash-btn-view:hover { background: var(--gold-dim); }

  .dash-req-filter-row { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
  .dash-filter-btn { font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.2em; text-transform: uppercase; padding: 6px 16px; border: 1px solid var(--border); color: var(--muted); background: transparent; cursor: pointer; transition: border-color 0.2s, color 0.2s; }
  .dash-filter-btn.active { border-color: var(--gold-line); color: var(--gold); background: var(--gold-dim); }
  .dash-filter-btn:not(.active):hover { border-color: var(--border); color: var(--cream); }

  /* ── Rejection reason badge ── */
  .dash-rejection-reason { display: inline-flex; align-items: flex-start; gap: 6px; font-size: 10px; font-weight: 200; color: var(--red); background: rgba(224,128,128,0.07); border: 1px solid rgba(224,128,128,0.2); padding: 6px 10px; margin-top: 6px; line-height: 1.5; max-width: 260px; letter-spacing: 0.02em; }
  .dash-rejection-reason-icon { opacity: 0.7; flex-shrink: 0; margin-top: 1px; }

  /* ── Modal Overlay (shared) ── */
  .dash-modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.78);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: dash-fadein 0.2s ease;
  }
  .dash-modal {
    background: #111118; border: 1px solid var(--gold-line);
    padding: 44px 48px; max-width: 520px; width: 100%;
    position: relative;
    animation: dash-modal-in 0.25s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes dash-modal-in {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }
  .dash-modal::before { content: ''; position: absolute; top: 0; left: 0; width: 72px; height: 1px; background: var(--gold); }
  .dash-modal::after  { content: ''; position: absolute; bottom: 0; right: 0; width: 72px; height: 1px; background: var(--gold); opacity: 0.4; }
  .dash-modal-eyebrow { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.42em; text-transform: uppercase; color: var(--red); opacity: 0.85; margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
  .dash-modal-eyebrow::before { content: ''; display: block; width: 20px; height: 1px; background: var(--red); opacity: 0.6; }
  .dash-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 300; color: var(--cream); line-height: 1.1; margin-bottom: 8px; }
  .dash-modal-subtitle { font-size: 12px; font-weight: 200; color: var(--muted); letter-spacing: 0.04em; line-height: 1.6; margin-bottom: 28px; }
  .dash-modal-subject { border: 1px solid var(--border); background: rgba(10,10,10,0.5); padding: 14px 18px; margin-bottom: 24px; position: relative; }
  .dash-modal-subject::before { content: ''; position: absolute; top: 0; left: 0; width: 32px; height: 1px; background: var(--gold); opacity: 0.5; }
  .dash-modal-subject-label { font-size: 8px; font-weight: 300; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); opacity: 0.6; margin-bottom: 6px; }
  .dash-modal-subject-name { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 300; color: var(--cream); }
  .dash-modal-subject-meta { font-size: 10px; font-weight: 200; color: var(--muted); margin-top: 3px; letter-spacing: 0.04em; }
  .dash-modal-label { font-size: 8px; font-weight: 300; letter-spacing: 0.36em; text-transform: uppercase; color: var(--gold); opacity: 0.7; margin-bottom: 10px; display: block; }
  .dash-modal-textarea { width: 100%; background: rgba(10,10,10,0.6); border: 1px solid var(--border); color: var(--cream); font-family: 'Raleway', sans-serif; font-size: 13px; font-weight: 200; line-height: 1.65; letter-spacing: 0.03em; padding: 14px 16px; resize: vertical; min-height: 110px; outline: none; transition: border-color 0.2s; margin-bottom: 6px; }
  .dash-modal-textarea::placeholder { color: rgba(240,234,214,0.2); }
  .dash-modal-textarea:focus { border-color: var(--gold-line); }
  .dash-modal-char-count { font-size: 9px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; text-align: right; margin-bottom: 28px; }
  .dash-modal-char-count.warn { color: var(--amber); }
  .dash-modal-actions { display: flex; gap: 12px; justify-content: flex-end; align-items: center; }
  .dash-modal-cancel { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase; padding: 10px 22px; border: 1px solid var(--border); color: var(--muted); background: transparent; cursor: pointer; transition: border-color 0.2s, color 0.2s; }
  .dash-modal-cancel:hover { border-color: var(--gold-line); color: var(--cream); }
  .dash-modal-confirm { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase; padding: 10px 28px; border: 1px solid rgba(224,128,128,0.5); color: var(--red); background: transparent; cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s; white-space: nowrap; }
  .dash-modal-confirm::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(224,128,128,0.18), rgba(224,128,128,0.08)); transform: scaleX(0); transform-origin: left; transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); }
  .dash-modal-confirm:hover:not(:disabled)::before { transform: scaleX(1); }
  .dash-modal-confirm:disabled { opacity: 0.35; cursor: not-allowed; }
  .dash-modal-confirm span { position: relative; z-index: 1; }
  .dash-modal-note { font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.04em; margin-right: auto; line-height: 1.5; }

  /* ── View Details Modal ── */
  .dash-view-modal {
    background: #111118; border: 1px solid var(--gold-line);
    width: 100%; max-width: 760px;
    max-height: 88vh; overflow-y: auto;
    position: relative;
    animation: dash-modal-in 0.25s cubic-bezier(0.22,1,0.36,1) both;
    scrollbar-width: thin; scrollbar-color: var(--gold-line) transparent;
  }
  .dash-view-modal::before { content: ''; position: absolute; top: 0; left: 0; width: 80px; height: 1px; background: var(--gold); }
  .dash-view-modal-head {
    padding: 32px 36px 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
    position: sticky; top: 0; background: #111118; z-index: 10;
  }
  .dash-view-modal-head::before { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: var(--border); }
  .dash-view-modal-eyebrow { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.75; margin-bottom: 8px; }
  .dash-view-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300; color: var(--cream); line-height: 1.1; }
  .dash-view-modal-close { background: transparent; border: 1px solid var(--border); color: var(--muted); width: 36px; height: 36px; cursor: pointer; font-size: 18px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: border-color 0.2s, color 0.2s; }
  .dash-view-modal-close:hover { border-color: var(--red); color: var(--red); }
  .dash-view-modal-body { padding: 32px 36px; }

  /* ── Detail sections ── */
  .dash-detail-section { margin-bottom: 32px; }
  .dash-detail-section-title {
    font-size: 8px; font-weight: 300; letter-spacing: 0.42em; text-transform: uppercase;
    color: var(--gold); opacity: 0.75; margin-bottom: 16px;
    display: flex; align-items: center; gap: 12px;
  }
  .dash-detail-section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .dash-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .dash-detail-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .dash-detail-field { background: rgba(10,10,10,0.45); border: 1px solid var(--border); padding: 12px 16px; position: relative; }
  .dash-detail-field::before { content: ''; position: absolute; top: 0; left: 0; width: 24px; height: 1px; background: var(--gold); opacity: 0.4; }
  .dash-detail-field-label { font-size: 8px; font-weight: 300; letter-spacing: 0.32em; text-transform: uppercase; color: var(--gold); opacity: 0.6; margin-bottom: 6px; }
  .dash-detail-field-value { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 300; color: var(--cream); line-height: 1.3; }
  .dash-detail-field-value.small { font-family: 'Raleway', sans-serif; font-size: 12px; font-weight: 200; line-height: 1.6; }
  .dash-detail-full { grid-column: 1 / -1; }

  /* ── Images strip ── */
  .dash-detail-images { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
  .dash-detail-img { width: 100px; height: 70px; object-fit: cover; border: 1px solid var(--border); }
  .dash-detail-img-placeholder { width: 100px; height: 70px; border: 1px dashed var(--border); display: flex; align-items: center; justify-content: center; font-size: 9px; color: var(--muted); letter-spacing: 0.1em; }

  /* ── Room / Meal cards ── */
  .dash-detail-card { border: 1px solid var(--border); background: rgba(10,10,10,0.3); padding: 16px 18px; margin-bottom: 10px; position: relative; }
  .dash-detail-card::before { content: ''; position: absolute; top: 0; left: 0; width: 32px; height: 1px; background: var(--gold); opacity: 0.5; }
  .dash-detail-card-title { font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; }

  /* ── Chip list (amenities, bed types) ── */
  .dash-chip-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
  .dash-chip { font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.14em; text-transform: uppercase; padding: 4px 10px; border: 1px solid var(--border); color: var(--muted); }

  /* ── Event type pricing table ── */
  .dash-pricing-table { width: 100%; border-collapse: collapse; margin-top: 4px; }
  .dash-pricing-table th { padding: 8px 12px; text-align: left; font-size: 7px; font-weight: 300; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); opacity: 0.6; border-bottom: 1px solid var(--border); background: rgba(10,10,10,0.3); }
  .dash-pricing-table td { padding: 8px 12px; font-size: 11px; font-weight: 200; color: var(--cream); border-bottom: 1px solid rgba(200,169,81,0.05); }
  .dash-pricing-table tr:last-child td { border-bottom: none; }

  /* ── View modal actions ── */
  .dash-view-modal-footer {
    padding: 20px 36px 28px; border-top: 1px solid var(--border);
    display: flex; gap: 12px; justify-content: flex-end; align-items: center;
    background: #111118;
  }

  /* ── Error toast ── */
  .dash-error-toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); background: rgba(224,128,128,0.12); border: 1px solid rgba(224,128,128,0.4); color: var(--red); font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.18em; padding: 12px 24px; z-index: 999; white-space: nowrap; animation: dash-fadein 0.3s ease; }

  /* ── Loading / Empty ── */
  .dash-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 16px; }
  .dash-spinner { width: 32px; height: 32px; border: 1.5px solid var(--border); border-top-color: var(--gold); border-radius: 50%; animation: dash-spin 0.9s linear infinite; }
  @keyframes dash-spin { to { transform: rotate(360deg); } }
  .dash-loading-text { font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.3em; text-transform: uppercase; }
  .dash-empty { text-align: center; padding: 48px; font-size: 12px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }

  /* ── Footer ── */
  .dash-footer { position: relative; z-index: 1; border-top: 1px solid var(--border); padding: 32px 56px; display: flex; align-items: center; justify-content: space-between; background: rgba(17,17,24,0.6); backdrop-filter: blur(8px); }
  .dash-footer-copy { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }
  .dash-footer-copy span { color: var(--gold); }

  @keyframes dash-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  @media (max-width: 1024px) {
    .dash-main { padding: 48px 28px 80px; }
    .dash-stats { grid-template-columns: repeat(2, 1fr); }
    .dash-nav-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 860px) {
    .dash-topbar { padding: 18px 24px; }
    .dash-main { padding: 40px 24px 60px; }
    .dash-stats { grid-template-columns: repeat(2, 1fr); }
    .dash-nav-grid { grid-template-columns: 1fr; }
    .dash-footer { padding: 24px; flex-direction: column; gap: 10px; text-align: center; }
    .dash-recent-table th:nth-child(3), .dash-recent-table td:nth-child(3) { display: none; }
    .dash-req-actions { flex-direction: column; }
    .dash-detail-grid, .dash-detail-grid-3 { grid-template-columns: 1fr; }
    .dash-view-modal-head, .dash-view-modal-body, .dash-view-modal-footer { padding-left: 20px; padding-right: 20px; }
  }
  @media (max-width: 768px) {
    .dash-main { padding: 36px 18px 70px; }
    .dash-topbar { padding: 16px 18px; }
    .dash-logo-text { font-size: 15px; letter-spacing: 0.18em; }
    .dash-admin-badge { display: none; }
    .dash-topbar-right { gap: 10px; }
    .dash-title { font-size: 32px; }
    .dash-subtitle { font-size: 11px; margin-bottom: 36px; }
    .dash-stats { grid-template-columns: 1fr; gap: 12px; }
    .dash-stat { padding: 18px 20px; }
    .dash-stat-val { font-size: 34px; }
    .dash-nav-card { padding: 26px 22px; min-height: auto; }
    .dash-nav-card-title { font-size: 24px; }
    .dash-nav-card-desc { font-size: 11px; }
    .dash-recent-table { display: block; overflow-x: auto; white-space: nowrap; }
    .dash-recent-table th, .dash-recent-table td { padding: 10px 12px; font-size: 10px; }
    .dash-recent-table th:nth-child(3), .dash-recent-table td:nth-child(3),
    .dash-recent-table th:nth-child(2), .dash-recent-table td:nth-child(2) { display: none; }
    .dash-req-actions { flex-direction: column; gap: 6px; }
    .dash-btn-accept, .dash-btn-reject, .dash-btn-view { width: 100%; }
    .dash-req-filter-row { gap: 6px; }
    .dash-filter-btn { font-size: 6px; padding: 5px 10px; }
    .dash-footer { flex-direction: column; text-align: center; gap: 10px; padding: 22px 18px; }
    .dash-footer-copy { font-size: 10px; }
    .dash-modal { padding: 32px 24px; }
    .dash-modal-title { font-size: 24px; }
    .dash-modal-actions { flex-direction: column-reverse; }
    .dash-modal-cancel, .dash-modal-confirm { width: 100%; text-align: center; }
    .dash-modal-note { margin-right: 0; margin-bottom: 8px; }
  }
  @media (max-width: 480px) {
    .dash-title { font-size: 28px; }
    .dash-nav-card-title { font-size: 20px; }
    .dash-stat-val { font-size: 30px; }
    .dash-main { padding: 28px 14px 60px; }
  }
`;

/* ─────────────────────────────────────────────
   Helpers
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

const getRequestId = (req) => req._id ?? req.id ?? null;
const getRequestType = (req) => req._type ?? req.type ?? "unknown";

const MAX_REASON = 500;

/* ─────────────────────────────────────────────
   DetailField — small reusable cell
───────────────────────────────────────────── */
function DetailField({ label, value, small = false, full = false }) {
  return (
    <div className={`dash-detail-field${full ? " dash-detail-full" : ""}`}>
      <div className="dash-detail-field-label">{label}</div>
      <div className={`dash-detail-field-value${small ? " small" : ""}`}>
        {value || (
          <span style={{ color: "var(--muted)", fontSize: 11 }}>—</span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ViewDetailsModal
───────────────────────────────────────────── */
function ViewDetailsModal({ req, onClose, onAccept, onReject, busy }) {
  const type = getRequestType(req);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const isPending = req.status === "pending";

  /* ── Event type pricing map → array ── */
  const eventPricingEntries = (() => {
    if (!req.eventTypePricing) return [];
    if (req.eventTypePricing instanceof Map)
      return [...req.eventTypePricing.entries()];
    return Object.entries(req.eventTypePricing);
  })();

  return (
    <div
      className="dash-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dash-view-modal" role="dialog" aria-modal="true">
        {/* ── Head ── */}
        <div className="dash-view-modal-head">
          <div>
            <div className="dash-view-modal-eyebrow">◆ {type} Submission</div>
            <div className="dash-view-modal-title">{req.name ?? "—"}</div>
          </div>
          <button className="dash-view-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="dash-view-modal-body">
          {/* ── Provider & Meta ── */}
          <div className="dash-detail-section">
            <div className="dash-detail-section-title">◆ Submission Info</div>
            <div className="dash-detail-grid">
              <DetailField
                label="Provider"
                value={req.provider?.fullName ?? "—"}
              />
              <DetailField
                label="Provider Email"
                value={req.provider?.email ?? "—"}
              />
              <DetailField label="Submitted" value={fmtDate(req.createdAt)} />
              <DetailField
                label="Status"
                value={
                  <span
                    className={`dash-status ${req.status}`}
                    style={{ marginTop: 2 }}
                  >
                    <span className="dash-status-dot" />
                    {req.status}
                  </span>
                }
              />
              {req.status === "rejected" && req.rejectionReason && (
                <div className="dash-detail-field dash-detail-full">
                  <div className="dash-detail-field-label">
                    Rejection Reason
                  </div>
                  <div
                    className="dash-detail-field-value small"
                    style={{ color: "var(--red)" }}
                  >
                    {req.rejectionReason}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── VENUE details ── */}
          {type === "venue" && (
            <>
              <div className="dash-detail-section">
                <div className="dash-detail-section-title">◆ Venue Details</div>
                <div className="dash-detail-grid">
                  <DetailField label="Name" value={req.name} />
                  <DetailField label="Location" value={req.location} />
                  <DetailField
                    label="Max Capacity"
                    value={req.capacity ? `${fmt(req.capacity)} guests` : null}
                  />
                  <DetailField
                    label="Base Price / Hour"
                    value={
                      req.pricePerHour ? `$${fmt(req.pricePerHour)}` : null
                    }
                  />
                  <DetailField
                    label="Availability"
                    value={
                      req.isAvailable
                        ? "Available upon approval"
                        : "Not available"
                    }
                  />
                  <DetailField
                    label="Primary Event Type"
                    value={req.eventType}
                  />
                  <DetailField
                    label="Description"
                    value={req.description}
                    small
                    full
                  />
                </div>
              </div>

              {eventPricingEntries.length > 0 && (
                <div className="dash-detail-section">
                  <div className="dash-detail-section-title">
                    ◆ Event Type Pricing
                  </div>
                  <table className="dash-pricing-table">
                    <thead>
                      <tr>
                        <th>Event Type</th>
                        <th>Multiplier</th>
                        <th>Effective Price / hr</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventPricingEntries.map(([evType, mult]) => (
                        <tr key={evType}>
                          <td style={{ textTransform: "capitalize" }}>
                            {evType.replace(/_/g, " ")}
                          </td>
                          <td>×{Number(mult).toFixed(2)}</td>
                          <td style={{ color: "var(--gold)" }}>
                            $
                            {(
                              Number(req.pricePerHour ?? 0) * Number(mult)
                            ).toFixed(0)}{" "}
                            / hr
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {Array.isArray(req.guestTierPricing) &&
                req.guestTierPricing.length > 0 && (
                  <div className="dash-detail-section">
                    <div className="dash-detail-section-title">
                      ◆ Guest Tier Pricing
                    </div>
                    <table className="dash-pricing-table">
                      <thead>
                        <tr>
                          <th>Tier</th>
                          <th>Min</th>
                          <th>Max</th>
                          <th>Multiplier</th>
                        </tr>
                      </thead>
                      <tbody>
                        {req.guestTierPricing.map((tier, i) => (
                          <tr key={i}>
                            <td>{tier.label || `Tier ${i + 1}`}</td>
                            <td>{tier.min}</td>
                            <td>{tier.max === 999999 ? "∞" : tier.max}</td>
                            <td style={{ color: "var(--gold)" }}>
                              ×{Number(tier.multiplier).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              {Array.isArray(req.images) && req.images.length > 0 && (
                <div className="dash-detail-section">
                  <div className="dash-detail-section-title">◆ Images</div>
                  <div className="dash-detail-images">
                    {req.images.filter(Boolean).map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`venue-${i}`}
                        className="dash-detail-img"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── HOTEL details ── */}
          {type === "hotel" && (
            <>
              <div className="dash-detail-section">
                <div className="dash-detail-section-title">◆ Hotel Details</div>
                <div className="dash-detail-grid">
                  <DetailField label="Name" value={req.name} />
                  <DetailField label="Location" value={req.location} />
                  <DetailField
                    label="Stars"
                    value={req.stars ? `${"★".repeat(req.stars)}` : null}
                  />
                  <DetailField
                    label="Availability"
                    value={
                      req.isAvailable
                        ? "Available upon approval"
                        : "Not available"
                    }
                  />
                  <DetailField label="Check-In" value={req.checkInTime} />
                  <DetailField label="Check-Out" value={req.checkOutTime} />
                  <DetailField label="Contact Email" value={req.contactEmail} />
                  <DetailField label="Contact Phone" value={req.contactPhone} />
                  <DetailField label="Website" value={req.website} />
                  <DetailField
                    label="Pet Friendly"
                    value={req.petFriendly ? "Yes" : "No"}
                  />
                  <DetailField
                    label="Smoking Allowed"
                    value={req.smokingAllowed ? "Yes" : "No"}
                  />
                  <DetailField
                    label="Cancellation Policy"
                    value={req.cancellationPolicy}
                    small
                    full
                  />
                  <DetailField
                    label="Description"
                    value={req.description}
                    small
                    full
                  />
                </div>
              </div>

              {Array.isArray(req.amenities) && req.amenities.length > 0 && (
                <div className="dash-detail-section">
                  <div className="dash-detail-section-title">
                    ◆ Hotel Amenities
                  </div>
                  <div className="dash-chip-list">
                    {req.amenities.map((a) => (
                      <span key={a} className="dash-chip">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(req.roomCategories) &&
                req.roomCategories.length > 0 && (
                  <div className="dash-detail-section">
                    <div className="dash-detail-section-title">
                      ◆ Room Categories
                    </div>
                    {req.roomCategories.map((room, i) => (
                      <div key={i} className="dash-detail-card">
                        <div className="dash-detail-card-title">
                          ◆ {room.name || `Room ${i + 1}`}
                        </div>
                        <div className="dash-detail-grid">
                          <DetailField
                            label="Price / Night"
                            value={
                              room.pricePerNight
                                ? `$${fmt(room.pricePerNight)}`
                                : null
                            }
                          />
                          <DetailField
                            label="Max Occupancy"
                            value={
                              room.maxOccupancy
                                ? `${room.maxOccupancy} guests`
                                : null
                            }
                          />
                          <DetailField
                            label="Total Rooms"
                            value={
                              room.totalRooms != null
                                ? String(room.totalRooms)
                                : null
                            }
                          />
                          <DetailField label="Category ID" value={room.id} />
                          {Array.isArray(room.bedOptions) &&
                            room.bedOptions.length > 0 && (
                              <div className="dash-detail-field">
                                <div className="dash-detail-field-label">
                                  Bed Types
                                </div>
                                <div
                                  className="dash-chip-list"
                                  style={{ marginTop: 6 }}
                                >
                                  {room.bedOptions.map((b) => (
                                    <span key={b} className="dash-chip">
                                      {b}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          {Array.isArray(room.amenities) &&
                            room.amenities.length > 0 && (
                              <div className="dash-detail-field">
                                <div className="dash-detail-field-label">
                                  Room Amenities
                                </div>
                                <div
                                  className="dash-chip-list"
                                  style={{ marginTop: 6 }}
                                >
                                  {room.amenities.map((a) => (
                                    <span key={a} className="dash-chip">
                                      {a}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          {room.description && (
                            <DetailField
                              label="Description"
                              value={room.description}
                              small
                              full
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {Array.isArray(req.mealPlans) && req.mealPlans.length > 0 && (
                <div className="dash-detail-section">
                  <div className="dash-detail-section-title">◆ Meal Plans</div>
                  {req.mealPlans.map((meal, i) => (
                    <div key={i} className="dash-detail-card">
                      <div className="dash-detail-card-title">
                        ◆ {meal.name || `Plan ${i + 1}`}
                      </div>
                      <div className="dash-detail-grid">
                        <DetailField
                          label="Price / Person / Night"
                          value={
                            meal.pricePerPersonPerNight != null
                              ? `$${fmt(meal.pricePerPersonPerNight)}`
                              : null
                          }
                        />
                        <DetailField
                          label="Available"
                          value={meal.isAvailable ? "Yes" : "No"}
                        />
                        {meal.description && (
                          <DetailField
                            label="Description"
                            value={meal.description}
                            small
                            full
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {Array.isArray(req.images) && req.images.length > 0 && (
                <div className="dash-detail-section">
                  <div className="dash-detail-section-title">◆ Images</div>
                  <div className="dash-detail-images">
                    {req.images.filter(Boolean).map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`hotel-${i}`}
                        className="dash-detail-img"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── SERVICE details ── */}
          {type === "service" && (
            <div className="dash-detail-section">
              <div className="dash-detail-section-title">◆ Service Details</div>
              <div className="dash-detail-grid">
                <DetailField label="Name" value={req.name} />
                <DetailField label="Category" value={req.category} />
                <DetailField
                  label="Price"
                  value={req.price != null ? `$${fmt(req.price)}` : null}
                />
                <DetailField
                  label="Pricing Unit"
                  value={req.priceUnit?.replace(/_/g, " ")}
                />
                <DetailField
                  label="Location / Service Area"
                  value={req.location}
                />
                <DetailField label="Contact Email" value={req.contactEmail} />
                <DetailField
                  label="Description"
                  value={req.description}
                  small
                  full
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Footer actions ── */}
        <div className="dash-view-modal-footer">
          <button className="dash-modal-cancel" onClick={onClose}>
            Close
          </button>
          {isPending && (
            <>
              <button
                className="dash-btn-reject"
                disabled={busy}
                onClick={() => {
                  onClose();
                  onReject(req);
                }}
              >
                {busy ? "…" : "✗ Reject"}
              </button>
              <button
                className="dash-btn-accept"
                disabled={busy}
                onClick={() => {
                  onClose();
                  onAccept(req);
                }}
              >
                {busy ? "…" : "✓ Accept"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RejectionModal
───────────────────────────────────────────── */
function RejectionModal({
  req,
  reason,
  onReasonChange,
  onConfirm,
  onCancel,
  busy,
}) {
  const name = req?.name ?? "—";
  const location = req?.location ?? req?.contactEmail ?? "—";
  const type = getRequestType(req);
  const len = reason.length;
  const overLimit = len > MAX_REASON;

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div
      className="dash-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="dash-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <p className="dash-modal-eyebrow">Rejection Notice</p>
        <h2 className="dash-modal-title" id="modal-title">
          Leave a Comment
        </h2>
        <p className="dash-modal-subtitle">
          This message will be visible to the provider so they understand why
          their submission was not approved.
        </p>
        <div className="dash-modal-subject">
          <div className="dash-modal-subject-label">◆ Submission</div>
          <div className="dash-modal-subject-name">{name}</div>
          <div className="dash-modal-subject-meta">
            {type} · {location}
          </div>
        </div>
        <label className="dash-modal-label" htmlFor="rejection-reason">
          ◆ Rejection Reason
        </label>
        <textarea
          id="rejection-reason"
          className="dash-modal-textarea"
          placeholder="e.g. The submitted documents are incomplete…"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          maxLength={MAX_REASON + 50}
          autoFocus
        />
        <div className={`dash-modal-char-count${overLimit ? " warn" : ""}`}>
          {len} / {MAX_REASON}
        </div>
        <div className="dash-modal-actions">
          <span className="dash-modal-note">
            {reason.trim() === "" ? "You may reject without a comment." : ""}
          </span>
          <button
            className="dash-modal-cancel"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            className="dash-modal-confirm"
            onClick={onConfirm}
            disabled={busy || overLimit}
          >
            <span>{busy ? "Rejecting…" : "✗ Confirm Rejection"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AdminDashboard
───────────────────────────────────────────── */
function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    bookings: 0,
    pending: 0,
    revenue: 0,
    hotelReservations: 0,
    hotelPending: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providerRequests, setProviderRequests] = useState([]);
  const [reqFilter, setReqFilter] = useState("pending");
  const [actionLoading, setActionLoading] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  const [rejectionModal, setRejectionModal] = useState(null); // null | { req, reason }
  const [viewModal, setViewModal] = useState(null); // null | req

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 4000);
  };

  const fetchProviderRequests = async () => {
    try {
      const res = await API.get("/admin/provider-requests");
      const raw = res.data ?? [];
      const all = raw.map((r) => ({
        ...r,
        _id: r._id ?? r.id,
        _type: r.type ?? r._type,
        status: r.status ?? "pending",
      }));
      setProviderRequests(
        [...all].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      );
    } catch (err) {
      console.error("Provider requests fetch error:", err);
      showError("Failed to load provider requests.");
    }
  };

  const handleDecision = async (req, decision, reason = "") => {
    const id = getRequestId(req);
    const type = getRequestType(req);
    if (!id) {
      showError("Cannot process request: missing ID.");
      return;
    }
    const key = `${type}:${id}`;
    setActionLoading((prev) => ({ ...prev, [key]: true }));
    try {
      await API.patch(`/admin/provider-requests/${id}/${decision}`, {
        ...(decision === "reject" && reason.trim()
          ? { reason: reason.trim() }
          : {}),
      });
      setProviderRequests((prev) =>
        prev.map((r) =>
          (r._id ?? r.id) === id
            ? {
                ...r,
                status: decision === "accept" ? "accepted" : "rejected",
                ...(decision === "reject"
                  ? { rejectionReason: reason.trim() || null }
                  : {}),
              }
            : r,
        ),
      );
    } catch (err) {
      const status = err?.response?.status;
      const detail =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        err?.message ??
        "Unknown error";
      showError(`Error ${status ?? ""}: ${detail}`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const openRejectModal = (req) => setRejectionModal({ req, reason: "" });

  const confirmRejection = async () => {
    if (!rejectionModal) return;
    const { req, reason } = rejectionModal;
    const id = getRequestId(req);
    const type = getRequestType(req);
    const key = `${type}:${id}`;
    setActionLoading((prev) => ({ ...prev, [key]: true }));
    setRejectionModal(null);
    await handleDecision(req, "reject", reason);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, usersRes, hotelRes] = await Promise.all([
          API.get("/bookings"),
          API.get("/admin/users"),
          API.get("/admin/hotel-reservations").catch(() => ({ data: [] })),
        ]);
        const bookings = bookingsRes.data;
        const users = usersRes.data;
        const hotelReservations =
          hotelRes.data?.reservations ?? hotelRes.data ?? [];
        const pending = bookings.filter((b) => b.status === "pending").length;
        const revenue = bookings
          .filter((b) => b.status === "accepted" || b.status === "confirmed")
          .reduce((sum, b) => sum + (b.depositAmount || 0), 0);
        const hotelPending = hotelReservations.filter(
          (r) => r.status === "pending",
        ).length;
        setStats({
          users: users.length,
          bookings: bookings.length,
          pending,
          revenue,
          hotelReservations: hotelReservations.length,
          hotelPending,
        });
        setRecentBookings(
          [...bookings]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5),
        );
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    fetchProviderRequests();
  }, []);

  const pendingProviderCount = providerRequests.filter(
    (r) => r.status === "pending",
  ).length;

  return (
    <>
      <style>{style}</style>
      <div className="dash-root">
        {errorMsg && <div className="dash-error-toast">✗ {errorMsg}</div>}

        {/* ── View Details Modal ── */}
        {viewModal && (
          <ViewDetailsModal
            req={viewModal}
            onClose={() => setViewModal(null)}
            onAccept={(req) => handleDecision(req, "accept")}
            onReject={(req) => openRejectModal(req)}
            busy={
              !!actionLoading[
                `${getRequestType(viewModal)}:${getRequestId(viewModal)}`
              ]
            }
          />
        )}

        {/* ── Rejection Modal ── */}
        {rejectionModal && (
          <RejectionModal
            req={rejectionModal.req}
            reason={rejectionModal.reason}
            onReasonChange={(r) =>
              setRejectionModal((m) => ({ ...m, reason: r }))
            }
            onConfirm={confirmRejection}
            onCancel={() => setRejectionModal(null)}
            busy={
              !!actionLoading[
                `${getRequestType(rejectionModal.req)}:${getRequestId(rejectionModal.req)}`
              ]
            }
          />
        )}

        {/* ── Topbar ── */}
        <nav className="dash-topbar">
          <div
            className="dash-logo"
            onClick={() => navigate("/")}
            translate="no"
          >
            <div className="dash-logo-mark" />
            <div className="dash-logo-text">
              Event<span>y</span>
            </div>
          </div>
          <div className="dash-topbar-right">
            <span className="dash-admin-badge">◆ Admin Panel</span>
            {(stats.pending > 0 ||
              stats.hotelPending > 0 ||
              pendingProviderCount > 0) && (
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "8px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  padding: "5px 12px",
                  border: "1px solid rgba(224,184,112,0.5)",
                  color: "var(--amber)",
                  background: "var(--amber-dim)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--amber)",
                    display: "inline-block",
                    animation: "dash-pulse 1.8s ease-in-out infinite",
                  }}
                />
                {stats.pending + stats.hotelPending + pendingProviderCount}{" "}
                pending
              </span>
            )}
            <button className="dash-logout-btn" onClick={() => navigate("/")}>
              ← Exit Admin
            </button>
          </div>
        </nav>

        <main className="dash-main">
          <p className="dash-breadcrumb">Administration</p>
          <h1 className="dash-title">Command Centre</h1>
          <p className="dash-subtitle">
            Overview of platform activity — users, reservations, and revenue.
          </p>

          {/* ── Stats ── */}
          {loading ? (
            <div className="dash-loading" style={{ marginBottom: 56 }}>
              <div className="dash-spinner" />
              <p className="dash-loading-text">Loading Overview</p>
            </div>
          ) : (
            <div className="dash-stats">
              <div className="dash-stat">
                <div className="dash-stat-icon">◆</div>
                <div className="dash-stat-label">Registered Users</div>
                <div className="dash-stat-val">{fmt(stats.users)}</div>
                <div className="dash-stat-sub">Total accounts</div>
              </div>
              <div className="dash-stat">
                <div className="dash-stat-icon">◆</div>
                <div className="dash-stat-label">Total Bookings</div>
                <div className="dash-stat-val">{fmt(stats.bookings)}</div>
                <div className="dash-stat-sub">All time</div>
              </div>
              <div className="dash-stat">
                <div className="dash-stat-icon">◆</div>
                <div className="dash-stat-label">Awaiting Review</div>
                <div
                  className={`dash-stat-val ${stats.pending + stats.hotelPending + pendingProviderCount > 0 ? "amber" : ""}`}
                >
                  {fmt(
                    stats.pending + stats.hotelPending + pendingProviderCount,
                  )}
                </div>
                <div className="dash-stat-sub">
                  {stats.pending} bookings · {stats.hotelPending} hotels ·{" "}
                  {pendingProviderCount} provider requests
                </div>
              </div>
            </div>
          )}

          {/* ── Nav Cards ── */}
          <p className="dash-section-title">◆ Management</p>
          <div className="dash-nav-grid">
            <div
              className="dash-nav-card"
              onClick={() => navigate("/admin/users")}
            >
              <div className="dash-nav-card-top">
                <div className="dash-nav-card-icon">◆</div>
                <div className="dash-nav-card-arrow">→</div>
              </div>
              <div style={{ marginTop: 24 }}>
                <div className="dash-nav-card-label">◆ Directory</div>
                <div className="dash-nav-card-title">User Management</div>
                <div className="dash-nav-card-desc">
                  Browse registered accounts, review user profiles, manage
                  roles, and oversee platform access.
                </div>
              </div>
              <div className="dash-nav-card-footer">
                <div>
                  <div className="dash-nav-card-count">{fmt(stats.users)}</div>
                  <div className="dash-nav-card-count-label">
                    Registered Users
                  </div>
                </div>
                <div className="dash-nav-card-cta">
                  <span>Manage Users →</span>
                </div>
              </div>
            </div>
            <div
              className="dash-nav-card"
              onClick={() => navigate("/admin/bookings")}
            >
              <div className="dash-nav-card-top">
                <div className="dash-nav-card-icon">◆</div>
                <div className="dash-nav-card-arrow">→</div>
              </div>
              <div style={{ marginTop: 24 }}>
                <div className="dash-nav-card-label">◆ Reservations</div>
                <div className="dash-nav-card-title">Booking Management</div>
                <div className="dash-nav-card-desc">
                  Review incoming reservation requests, accept or decline
                  bookings, and track deposit payments.
                </div>
              </div>
              <div className="dash-nav-card-footer">
                <div>
                  <div
                    className="dash-nav-card-count"
                    style={{
                      color:
                        stats.pending > 0
                          ? "var(--amber)"
                          : "var(--gold-light)",
                    }}
                  >
                    {fmt(stats.pending)}
                  </div>
                  <div className="dash-nav-card-count-label">
                    Pending Review
                  </div>
                </div>
                <div className="dash-nav-card-cta">
                  <span>Manage Bookings →</span>
                </div>
              </div>
            </div>
            <div
              className="dash-nav-card"
              onClick={() => navigate("/admin/hotel-reservations")}
            >
              <div className="dash-nav-card-top">
                <div className="dash-nav-card-icon">◆</div>
                <div className="dash-nav-card-arrow">→</div>
              </div>
              <div style={{ marginTop: 24 }}>
                <div className="dash-nav-card-label">◆ Hotels</div>
                <div className="dash-nav-card-title">Hotel Reservations</div>
                <div className="dash-nav-card-desc">
                  View, edit, and manage all hotel bookings. Update guest
                  details, adjust stay dates, and control reservation status.
                </div>
              </div>
              <div className="dash-nav-card-footer">
                <div>
                  <div
                    className="dash-nav-card-count"
                    style={{
                      color:
                        stats.hotelPending > 0
                          ? "var(--amber)"
                          : "var(--gold-light)",
                    }}
                  >
                    {fmt(stats.hotelPending)}
                  </div>
                  <div className="dash-nav-card-count-label">
                    Pending Review
                  </div>
                </div>
                <div className="dash-nav-card-cta">
                  <span>Manage Hotels →</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Provider Requests ── */}
          <p className="dash-section-title">◆ Provider Requests</p>
          <div className="dash-req-filter-row">
            {["all", "pending", "accepted", "rejected"].map((f) => (
              <button
                key={f}
                className={`dash-filter-btn${reqFilter === f ? " active" : ""}`}
                onClick={() => setReqFilter(f)}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                <span style={{ marginLeft: 6, opacity: 0.7 }}>
                  (
                  {f === "all"
                    ? providerRequests.length
                    : providerRequests.filter((r) => r.status === f).length}
                  )
                </span>
              </button>
            ))}
          </div>

          <div className="dash-recent-wrap" style={{ marginBottom: 56 }}>
            <div className="dash-recent-head">
              <span className="dash-recent-head-title">
                Provider Submissions
              </span>
              <button
                className="dash-recent-view-all"
                onClick={fetchProviderRequests}
              >
                ↻ Refresh
              </button>
            </div>

            {(() => {
              const filtered = providerRequests.filter((r) =>
                reqFilter === "all" ? true : r.status === reqFilter,
              );
              if (filtered.length === 0) {
                return (
                  <div className="dash-empty">
                    {reqFilter === "pending"
                      ? "No pending provider requests — all caught up."
                      : `No ${reqFilter} requests to show.`}
                  </div>
                );
              }
              return (
                <table className="dash-recent-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Provider</th>
                      <th>Submitted</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((req) => {
                      const id = getRequestId(req);
                      const type = getRequestType(req);
                      const key = `${type}:${id}`;
                      const busy = !!actionLoading[key];
                      const isPending = req.status === "pending";
                      return (
                        <tr key={key}>
                          <td>
                            <div className="dash-req-detail">
                              {req.name ?? "—"}
                            </div>
                            <div className="dash-rt-sub">
                              {req.location ?? req.contactEmail ?? "—"}
                            </div>
                          </td>
                          <td>
                            <span className="dash-req-type">{type}</span>
                          </td>
                          <td>
                            <div
                              className="dash-rt-sub"
                              style={{ color: "var(--cream)" }}
                            >
                              {req.provider?.fullName ?? "—"}
                            </div>
                            <div className="dash-rt-sub">
                              {req.provider?.email ?? ""}
                            </div>
                          </td>
                          <td>
                            <div
                              className="dash-rt-sub"
                              style={{ color: "var(--cream)", fontSize: 11 }}
                            >
                              {fmtDate(req.createdAt)}
                            </div>
                          </td>
                          <td>
                            <span className={`dash-status ${req.status}`}>
                              <span className="dash-status-dot" />
                              {req.status}
                            </span>
                            {req.status === "rejected" &&
                              req.rejectionReason && (
                                <div className="dash-rejection-reason">
                                  <span className="dash-rejection-reason-icon">
                                    ✗
                                  </span>
                                  <span>{req.rejectionReason}</span>
                                </div>
                              )}
                          </td>
                          <td>
                            <div className="dash-req-actions">
                              <button
                                className="dash-btn-view"
                                onClick={() => setViewModal(req)}
                              >
                                ◆ View
                              </button>
                              {isPending && (
                                <>
                                  <button
                                    className="dash-btn-accept"
                                    disabled={busy}
                                    onClick={() =>
                                      handleDecision(req, "accept")
                                    }
                                  >
                                    {busy ? "…" : "✓ Accept"}
                                  </button>
                                  <button
                                    className="dash-btn-reject"
                                    disabled={busy}
                                    onClick={() => openRejectModal(req)}
                                  >
                                    {busy ? "…" : "✗ Reject"}
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
              );
            })()}
          </div>

          {/* ── Recent Bookings ── */}
          <p className="dash-section-title">◆ Recent Activity</p>
          <div className="dash-recent-wrap">
            <div className="dash-recent-head">
              <span className="dash-recent-head-title">
                Latest Reservations
              </span>
              <button
                className="dash-recent-view-all"
                onClick={() => navigate("/admin/bookings")}
              >
                View All →
              </button>
            </div>
            {loading ? (
              <div className="dash-loading">
                <div className="dash-spinner" />
                <p className="dash-loading-text">Fetching Bookings</p>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="dash-empty">No bookings yet.</div>
            ) : (
              <table className="dash-recent-table">
                <thead>
                  <tr>
                    <th>Venue / Event</th>
                    <th>Date</th>
                    <th>Deposit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr
                      key={b._id ?? b.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/admin/bookings")}
                    >
                      <td>
                        <div className="dash-rt-venue">
                          {b.venue?.name ?? "—"}
                        </div>
                        <div className="dash-rt-sub">
                          {b.eventType ?? "—"} · {fmt(b.guestCount)} guests
                        </div>
                      </td>
                      <td>
                        <div
                          className="dash-rt-sub"
                          style={{ color: "var(--cream)", fontSize: 11 }}
                        >
                          {fmtDate(b.eventDate)}
                        </div>
                      </td>
                      <td>
                        <div className="dash-rt-amount">
                          ${fmt(b.depositAmount)}
                        </div>
                        <div className="dash-rt-sub">
                          {b.depositPct ?? "—"}%
                        </div>
                      </td>
                      <td>
                        <span className={`dash-status ${b.status}`}>
                          <span className="dash-status-dot" />
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>

        <footer className="dash-footer">
          <p className="dash-footer-copy">
            © 2026 <span>Eventy</span> — Administration
          </p>
          <p className="dash-footer-copy" style={{ opacity: 0.5 }}>
            Luxury Event Planning Platform
          </p>
        </footer>
      </div>
    </>
  );
}

export default AdminDashboard;
