import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

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
    --red:        #E08080;
    --green:      #8DB87A;
  }

  .vd-root {
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
  .vd-root::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%);
  }

  .vd-topbar {
    background: rgba(17,17,24,0.94);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 22px 56px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .vd-topbar::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .vd-logo { display: flex; align-items: center; gap: 14px; cursor: pointer; }
  .vd-logo-mark { width: 32px; height: 32px; border: 1.5px solid var(--gold); transform: rotate(45deg); flex-shrink: 0; }
  .vd-logo-text { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase; }
  .vd-logo-text span { color: var(--gold); }

  .vd-back-btn {
    font-family: 'Cinzel', serif; font-size: 9px; font-weight: 400;
    letter-spacing: 0.28em; text-transform: uppercase;
    padding: 9px 22px; border: 1px solid var(--border);
    background: transparent; color: var(--gold);
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
    display: flex; align-items: center; gap: 10px;
  }
  .vd-back-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .vd-back-btn:hover::before { transform: scaleX(1); }
  .vd-back-btn:hover { color: var(--black); }
  .vd-back-btn span { position: relative; z-index: 1; }
  .vd-back-arrow { position: relative; z-index: 1; font-size: 13px; line-height: 1; }

  .vd-main { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 64px 56px 100px; }

  .vd-breadcrumb {
    font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--gold); opacity: 0.8; margin-bottom: 32px;
    display: flex; align-items: center; gap: 14px;
  }
  .vd-breadcrumb::before { content: ''; display: block; width: 32px; height: 1px; background: var(--gold); opacity: 0.6; }

  .vd-img-wrap {
    position: relative; width: 100%; height: 480px;
    overflow: hidden; margin-bottom: 0;
    border: 1px solid var(--border); border-bottom: none;
  }
  .vd-img-wrap::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 40%, rgba(10,10,10,0.75) 100%); z-index: 1;
  }
  .vd-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .vd-ribbon {
    position: absolute; top: 24px; right: 24px; z-index: 3;
    font-size: 8px; font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase;
    padding: 6px 14px; background: rgba(10,10,10,0.8); backdrop-filter: blur(4px); border: 1px solid;
  }
  .vd-ribbon.available   { color: var(--green); border-color: rgba(141,184,122,0.4); }
  .vd-ribbon.unavailable { color: var(--red);   border-color: rgba(192,80,74,0.4); }

  /* ── Image Carousel ── */
  .vd-carousel { position: relative; width: 100%; height: 100%; }
  .vd-carousel-track { width: 100%; height: 100%; overflow: hidden; }
  .vd-carousel-img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: opacity 0.5s ease;
  }
  .vd-carousel-btn {
    position: absolute; top: 50%; transform: translateY(-50%); z-index: 4;
    width: 40px; height: 40px; border: 1px solid var(--gold-line);
    background: rgba(10,10,10,0.7); backdrop-filter: blur(6px);
    color: var(--gold); font-size: 16px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, border-color 0.2s;
  }
  .vd-carousel-btn:hover { background: rgba(200,169,81,0.18); border-color: var(--gold); }
  .vd-carousel-btn:disabled { opacity: 0.2; cursor: not-allowed; }
  .vd-carousel-btn.prev { left: 16px; }
  .vd-carousel-btn.next { right: 16px; }
  .vd-carousel-dots {
    position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
    display: flex; gap: 7px; z-index: 4;
  }
  .vd-carousel-dot {
    width: 6px; height: 6px; background: rgba(240,234,214,0.35);
    cursor: pointer; transition: background 0.25s, transform 0.25s;
  }
  .vd-carousel-dot.active { background: var(--gold); transform: scale(1.35); }
  .vd-carousel-counter {
    position: absolute; bottom: 16px; right: 16px; z-index: 4;
    font-size: 9px; font-weight: 200; letter-spacing: 0.2em;
    color: var(--cream); opacity: 0.6;
    background: rgba(10,10,10,0.55); padding: 3px 8px;
  }

  /* ── Admin Image Manager ── */
  .vd-img-manager { margin-bottom: 20px; }
  .vd-img-manager-label { font-size: 8px; font-weight: 300; letter-spacing: 0.35em; text-transform: uppercase; color: var(--gold); opacity: 0.7; margin-bottom: 10px; display: block; }
  .vd-img-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
  .vd-img-row {
    display: flex; align-items: center; gap: 8px;
    border: 1px solid var(--border); background: rgba(17,17,24,0.7); padding: 6px 10px;
  }
  .vd-img-thumb { width: 40px; height: 28px; object-fit: cover; border: 1px solid var(--border); flex-shrink: 0; }
  .vd-img-url-input {
    flex: 1; background: transparent; border: none; outline: none;
    color: var(--cream); font-family: 'Raleway', sans-serif;
    font-size: 11px; font-weight: 200; letter-spacing: 0.02em; min-width: 0;
  }
  .vd-img-url-input::placeholder { color: var(--muted); }
  .vd-img-remove-btn {
    flex-shrink: 0; background: none; border: none; cursor: pointer;
    color: var(--muted); font-size: 12px; padding: 0; line-height: 1;
    transition: color 0.2s;
  }
  .vd-img-remove-btn:hover { color: var(--red); }
  .vd-img-add-row { display: flex; gap: 8px; }
  .vd-img-add-input {
    flex: 1; background: rgba(17,17,24,0.9); border: 1px solid var(--gold-line);
    color: var(--cream); font-family: 'Raleway', sans-serif;
    font-size: 12px; font-weight: 200; padding: 7px 10px;
    outline: none; transition: border-color 0.2s; min-width: 0;
  }
  .vd-img-add-input:focus { border-color: var(--gold); }
  .vd-img-add-btn {
    flex-shrink: 0; padding: 0 14px; border: 1px solid var(--gold-line);
    background: transparent; color: var(--gold); font-family: 'Cinzel', serif;
    font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer; white-space: nowrap; position: relative; overflow: hidden; transition: color 0.25s;
  }
  .vd-img-add-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .vd-img-add-btn:hover::before { transform: scaleX(1); }
  .vd-img-add-btn:hover { color: var(--black); }
  .vd-img-add-btn span { position: relative; z-index: 1; }

  .vd-panel {
    background: rgba(17,17,24,0.85); backdrop-filter: blur(10px);
    border: 1px solid var(--border); border-top: none;
    padding: 48px 52px 52px; position: relative;
  }
  .vd-panel::before { content: ''; position: absolute; top: 0; left: 0; width: 80px; height: 1px; background: var(--gold); }

  .vd-name { font-family: 'Cormorant Garamond', serif; font-size: clamp(36px, 4vw, 54px); font-weight: 300; color: var(--cream); line-height: 1.05; }
  .vd-location { font-size: 12px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; margin-bottom: 32px; display: flex; align-items: center; gap: 8px; }
  .vd-location::before { content: '◆'; font-size: 5px; color: var(--gold); opacity: 0.7; }

  .vd-divider { width: 100%; height: 1px; background: var(--border); margin: 32px 0; position: relative; }
  .vd-divider::before {
    content: '◆'; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
    font-size: 7px; color: var(--gold); background: var(--obsidian); padding: 0 10px;
  }

  .vd-body { display: grid; grid-template-columns: 1fr 320px; gap: 52px; align-items: start; }

  .vd-desc-label { font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase; color: var(--gold); opacity: 0.8; margin-bottom: 16px; }
  .vd-desc { font-size: 13px; font-weight: 200; color: var(--muted); line-height: 1.9; letter-spacing: 0.03em; }

  /* Services */
  .vd-services-section { margin-top: 40px; }
  .vd-services-label { font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase; color: var(--gold); opacity: 0.8; margin-bottom: 8px; }
  .vd-services-sub { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.04em; margin-bottom: 20px; }

  .vd-type-carousel { position: relative; }
  .vd-type-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .vd-type-nav-info { display: flex; align-items: center; gap: 12px; }
  .vd-type-nav-icon { font-size: 18px; line-height: 1; }
  .vd-type-nav-title { font-family: 'Cinzel', serif; font-size: 9px; font-weight: 400; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold-light); }
  .vd-type-nav-count { font-family: 'Cormorant Garamond', serif; font-size: 13px; color: var(--gold); opacity: 0.6; }
  .vd-type-nav-arrows { display: flex; align-items: center; gap: 8px; }
  .vd-type-arrow {
    width: 32px; height: 32px; border: 1px solid var(--border); background: rgba(17,17,24,0.7);
    color: var(--gold); font-size: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.25s, background 0.25s; flex-shrink: 0;
  }
  .vd-type-arrow:hover:not(:disabled) { border-color: var(--gold); background: var(--gold-dim); }
  .vd-type-arrow:disabled { opacity: 0.25; cursor: not-allowed; }
  .vd-type-pager { font-size: 9px; font-weight: 200; color: var(--muted); letter-spacing: 0.12em; white-space: nowrap; }

  .vd-svc-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
  .vd-service-card {
    min-width: 0; border: 1px solid var(--border); background: rgb(60 60 75 / 60%);
    cursor: pointer; position: relative;
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
    overflow: hidden; padding: 14px 16px 16px;
  }
  .vd-service-card:hover { border-color: var(--gold-line); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(200,169,81,0.08); }
  .vd-service-card.selected { border-color: var(--gold); background: var(--gold-dim); box-shadow: 0 0 0 1px var(--gold-line), 0 8px 32px rgba(200,169,81,0.12); }
  .vd-service-card-name { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 400; color: var(--cream); margin-bottom: 4px; line-height: 1.2; padding-right: 20px; }
  .vd-service-card-desc { font-size: 9px; font-weight: 200; color: var(--muted); line-height: 1.5; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .vd-service-card-price { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 300; color: var(--gold-light); }
  .vd-service-card-price small { font-family: 'Raleway', sans-serif; font-size: 9px; font-weight: 200; color: var(--muted); margin-left: 2px; }
  .vd-service-check {
    position: absolute; top: 10px; right: 10px; width: 18px; height: 18px;
    border: 1px solid var(--gold); background: rgba(10,10,10,0.85);
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; color: var(--gold); opacity: 0; transition: opacity 0.2s;
  }
  .vd-service-card.selected .vd-service-check { opacity: 1; }

  .vd-items-nav { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .vd-items-pager { font-size: 9px; font-weight: 200; color: var(--muted); letter-spacing: 0.12em; white-space: nowrap; flex: 1; text-align: center; }
  .vd-item-arrow {
    width: 28px; height: 28px; border: 1px solid var(--border); background: rgba(17,17,24,0.7);
    color: var(--gold); font-size: 12px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.25s, background 0.25s; flex-shrink: 0;
  }
  .vd-item-arrow:hover:not(:disabled) { border-color: var(--gold); background: var(--gold-dim); }
  .vd-item-arrow:disabled { opacity: 0.25; cursor: not-allowed; }
  .vd-type-dots { display: flex; gap: 6px; justify-content: center; margin-top: 14px; }
  .vd-type-dot { width: 5px; height: 5px; background: var(--border); transition: background 0.25s, transform 0.25s; cursor: pointer; }
  .vd-type-dot.active { background: var(--gold); transform: scale(1.3); }

  /* Admin bar */
  .vd-admin-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 16px; background: rgba(200,169,81,0.07);
    border: 1px solid var(--gold-line); margin-bottom: 24px; gap: 12px;
  }
  .vd-admin-bar-label { font-family: 'Cinzel', serif; font-size: 8px; font-weight: 400; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); display: flex; align-items: center; gap: 8px; }
  .vd-admin-bar-label::before { content: '◆'; font-size: 6px; }
  .vd-admin-toggle {
    font-family: 'Cinzel', serif; font-size: 8px; font-weight: 400;
    letter-spacing: 0.22em; text-transform: uppercase;
    padding: 7px 18px; border: 1px solid var(--border);
    background: transparent; color: var(--gold);
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
    display: flex; align-items: center; gap: 8px;
  }
  .vd-admin-toggle::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .vd-admin-toggle:hover::before { transform: scaleX(1); }
  .vd-admin-toggle:hover { color: var(--black); }
  .vd-admin-toggle span { position: relative; z-index: 1; }
  .vd-admin-toggle.active { border-color: var(--gold); background: var(--gold-dim); }

  /* Edit inputs */
  .vd-edit-input {
    width: 100%; background: rgba(17,17,24,0.9); border: 1px solid var(--gold-line);
    color: var(--cream); font-family: 'Raleway', sans-serif;
    font-size: 13px; font-weight: 200; padding: 8px 12px;
    outline: none; transition: border-color 0.2s; box-sizing: border-box;
  }
  .vd-edit-input:focus { border-color: var(--gold); }
  .vd-edit-input.name-input { font-family: 'Cormorant Garamond', serif; font-size: clamp(28px, 3vw, 42px); font-weight: 300; padding: 6px 10px; }
  .vd-edit-input.textarea { resize: vertical; min-height: 90px; line-height: 1.7; }
  .vd-edit-input.number-input { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; width: 100%; }
  .vd-edit-select {
    width: 100%; background: rgba(17,17,24,0.9); border: 1px solid var(--gold-line);
    color: var(--cream); font-family: 'Raleway', sans-serif;
    font-size: 12px; font-weight: 200; padding: 8px 12px;
    outline: none; cursor: pointer; transition: border-color 0.2s;
  }
  .vd-edit-select:focus { border-color: var(--gold); }
  .vd-edit-label { font-size: 8px; font-weight: 300; letter-spacing: 0.35em; text-transform: uppercase; color: var(--gold); opacity: 0.7; margin-bottom: 6px; display: block; }
  .vd-edit-field { margin-bottom: 16px; }

  .vd-save-btn {
    width: 100%; padding: 13px; background: transparent; border: 1px solid var(--gold);
    color: var(--gold); font-family: 'Cinzel', serif; font-size: 9px; font-weight: 400;
    letter-spacing: 0.28em; text-transform: uppercase;
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s; margin-top: 8px;
  }
  .vd-save-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .vd-save-btn:hover:not(:disabled)::before { transform: scaleX(1); }
  .vd-save-btn:hover:not(:disabled) { color: var(--black); }
  .vd-save-btn span { position: relative; z-index: 1; }
  .vd-save-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .vd-save-msg { font-size: 10px; font-weight: 200; letter-spacing: 0.06em; text-align: center; margin-top: 8px; padding: 6px; }
  .vd-save-msg.ok  { color: var(--green); }
  .vd-save-msg.err { color: var(--red); }

  /* ── Admin Service Manager ── */
  .vd-svc-manager { margin-top: 40px; }
  .vd-svc-manager-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
  }
  .vd-svc-manager-title { font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase; color: var(--gold); opacity: 0.8; }

  .vd-svc-add-btn {
    font-family: 'Cinzel', serif; font-size: 8px; font-weight: 400;
    letter-spacing: 0.22em; text-transform: uppercase;
    padding: 7px 16px; border: 1px solid var(--gold-line);
    background: transparent; color: var(--gold);
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
    display: flex; align-items: center; gap: 6px;
  }
  .vd-svc-add-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .vd-svc-add-btn:hover::before { transform: scaleX(1); }
  .vd-svc-add-btn:hover { color: var(--black); }
  .vd-svc-add-btn span { position: relative; z-index: 1; }

  /* Admin service cards */
  .vd-admin-svc-list { display: flex; flex-direction: column; gap: 10px; }
  .vd-admin-svc-card {
    border: 1px solid var(--border);
    background: rgba(17,17,24,0.6);
    padding: 16px 18px;
    position: relative;
    transition: border-color 0.2s;
  }
  .vd-admin-svc-card:hover { border-color: var(--gold-line); }
  .vd-admin-svc-card.editing { border-color: var(--gold); background: rgba(200,169,81,0.04); }

  .vd-admin-svc-view { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .vd-admin-svc-info { flex: 1; min-width: 0; }
  .vd-admin-svc-name { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 400; color: var(--cream); margin-bottom: 2px; }
  .vd-admin-svc-meta { font-size: 10px; font-weight: 200; color: var(--muted); display: flex; align-items: center; gap: 10px; }
  .vd-admin-svc-price { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 300; color: var(--gold-light); flex-shrink: 0; }
  .vd-admin-svc-actions { display: flex; gap: 6px; flex-shrink: 0; }

  .vd-icon-btn {
    width: 30px; height: 30px; border: 1px solid var(--border);
    background: rgba(17,17,24,0.7); color: var(--gold);
    font-size: 12px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
  }
  .vd-icon-btn:hover { border-color: var(--gold); background: var(--gold-dim); }
  .vd-icon-btn.danger:hover { border-color: var(--red); background: rgba(224,128,128,0.1); color: var(--red); }

  /* Inline edit form inside card */
  .vd-svc-edit-form { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
  .vd-svc-edit-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
  .vd-svc-edit-row.three { grid-template-columns: 1fr 1fr 1fr; }
  .vd-svc-edit-actions { display: flex; gap: 8px; margin-top: 12px; justify-content: flex-end; }

  .vd-svc-inline-btn {
    font-family: 'Cinzel', serif; font-size: 8px; font-weight: 400;
    letter-spacing: 0.2em; text-transform: uppercase;
    padding: 7px 16px; border: 1px solid var(--border);
    background: transparent; color: var(--gold);
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
  }
  .vd-svc-inline-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .vd-svc-inline-btn:hover::before { transform: scaleX(1); }
  .vd-svc-inline-btn:hover { color: var(--black); }
  .vd-svc-inline-btn span { position: relative; z-index: 1; }
  .vd-svc-inline-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .vd-svc-inline-btn.cancel { border-color: rgba(200,169,81,0.15); color: var(--muted); }
  .vd-svc-inline-btn.cancel::before { background: rgba(200,169,81,0.1); }
  .vd-svc-inline-btn.cancel:hover { color: var(--cream); }

  /* New service form */
  .vd-new-svc-form {
    border: 1px solid var(--gold-line);
    background: rgba(200,169,81,0.04);
    padding: 20px 20px 16px;
    margin-bottom: 14px;
  }
  .vd-new-svc-title { font-size: 9px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); margin-bottom: 14px; }

  /* Skeleton */
  .vd-svc-skel { border: 1px solid var(--border); background: rgba(17,17,24,0.6); overflow: hidden; }
  .vd-svc-skel-body { padding: 14px 16px; }
  .vd-svc-skel-line {
    height: 10px; margin-bottom: 8px;
    background: linear-gradient(90deg, rgba(200,169,81,0.04) 25%, rgba(200,169,81,0.08) 50%, rgba(200,169,81,0.04) 75%);
    background-size: 400% 100%; animation: vd-shimmer 1.6s infinite;
  }

  /* Sidebar */
  .vd-sidebar { display: flex; flex-direction: column; gap: 0; }
  .vd-stats { border: 1px solid var(--border); margin-bottom: 20px; }
  .vd-stat { padding: 20px 24px; display: flex; flex-direction: column; gap: 6px; position: relative; }
  .vd-stat + .vd-stat { border-top: 1px solid var(--border); }
  .vd-stat-label { font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.65; }
  .vd-stat-value { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; color: var(--cream); line-height: 1; }
  .vd-stat-value small { font-family: 'Raleway', sans-serif; font-size: 13px; font-weight: 200; color: var(--muted); margin-left: 4px; }
  .vd-stat-value .currency { font-family: 'Raleway', sans-serif; font-size: 15px; color: var(--gold-light); }

  .vd-services-summary { border: 1px solid var(--border); margin-bottom: 20px; overflow: hidden; }
  .vd-services-summary-head {
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase;
    color: var(--gold); opacity: 0.8; display: flex; align-items: center; justify-content: space-between;
  }
  .vd-services-summary-count { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 300; color: var(--gold-light); opacity: 1; }
  .vd-services-summary-item { padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(200,169,81,0.08); gap: 8px; }
  .vd-services-summary-item:last-child { border-bottom: none; }
  .vd-summary-item-name { font-size: 11px; font-weight: 200; color: var(--cream); letter-spacing: 0.03em; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .vd-summary-item-price { font-family: 'Cormorant Garamond', serif; font-size: 14px; color: var(--gold-light); flex-shrink: 0; }
  .vd-summary-item-remove { background: none; border: none; cursor: pointer; color: var(--muted); font-size: 12px; padding: 0 2px; transition: color 0.2s; flex-shrink: 0; line-height: 1; }
  .vd-summary-item-remove:hover { color: var(--red); }
  .vd-services-total { padding: 14px 20px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--gold-dim); }
  .vd-services-total-label { font-size: 8px; font-weight: 300; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); }
  .vd-services-total-value { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; color: var(--gold-light); }

  .vd-cta {
    width: 100%; padding: 16px; background: transparent; border: 1px solid var(--border);
    color: var(--gold); font-family: 'Cinzel', serif; font-size: 10px; font-weight: 400;
    letter-spacing: 0.32em; text-transform: uppercase;
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.35s; margin-bottom: 12px;
  }
  .vd-cta::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .vd-cta:hover:not(:disabled)::before { transform: scaleX(1); }
  .vd-cta:hover:not(:disabled) { color: var(--black); }
  .vd-cta span { position: relative; z-index: 1; }
  .vd-cta:disabled { opacity: 0.32; cursor: not-allowed; }
  .vd-cta-note { text-align: center; font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.08em; }

  /* Skeleton page */
  .vd-skel-root { position: relative; z-index: 1; max-width: 1100px; margin: 64px auto; padding: 0 56px; }
  .vd-skel-img {
    height: 480px; border: 1px solid var(--border); border-bottom: none;
    background: linear-gradient(90deg, rgba(200,169,81,0.04) 25%, rgba(200,169,81,0.08) 50%, rgba(200,169,81,0.04) 75%);
    background-size: 400% 100%; animation: vd-shimmer 1.6s infinite;
  }
  .vd-skel-panel { border: 1px solid var(--border); border-top: none; background: rgba(17,17,24,0.85); padding: 48px 52px; }
  .vd-skel-line {
    height: 14px; margin-bottom: 16px;
    background: linear-gradient(90deg, rgba(200,169,81,0.04) 25%, rgba(200,169,81,0.08) 50%, rgba(200,169,81,0.04) 75%);
    background-size: 400% 100%; animation: vd-shimmer 1.6s infinite;
  }
  .vd-skel-line.xl   { width: 55%; height: 48px; margin-bottom: 20px; }
  .vd-skel-line.wide { width: 70%; }
  .vd-skel-line.full { width: 100%; }
  @keyframes vd-shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }

  .vd-footer {
    position: relative; z-index: 1; border-top: 1px solid var(--border); padding: 32px 56px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(17,17,24,0.6); backdrop-filter: blur(8px);
  }
  .vd-footer-copy { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }
  .vd-footer-copy span { color: var(--gold); }

  /* Confirm overlay */
  .vd-confirm-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.72); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .vd-confirm-box {
    background: #111118; border: 1px solid var(--gold-line);
    padding: 36px 40px; max-width: 380px; width: 100%; text-align: center;
    position: relative;
  }
  .vd-confirm-box::before { content: ''; position: absolute; top: 0; left: 0; width: 60px; height: 1px; background: var(--gold); }
  .vd-confirm-icon { font-size: 28px; margin-bottom: 16px; }
  .vd-confirm-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 300; color: var(--cream); margin-bottom: 8px; }
  .vd-confirm-sub { font-size: 11px; font-weight: 200; color: var(--muted); margin-bottom: 28px; line-height: 1.6; }
  .vd-confirm-actions { display: flex; gap: 10px; }
  .vd-confirm-cancel {
    flex: 1; padding: 11px; border: 1px solid var(--border); background: transparent;
    color: var(--muted); font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase;
    cursor: pointer; transition: color 0.2s, border-color 0.2s;
  }
  .vd-confirm-cancel:hover { color: var(--cream); border-color: var(--gold-line); }
  .vd-confirm-delete {
    flex: 1; padding: 11px; border: 1px solid rgba(224,128,128,0.4); background: transparent;
    color: var(--red); font-family: 'Cinzel', serif; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase;
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
  }
  .vd-confirm-delete::before {
    content: ''; position: absolute; inset: 0;
    background: rgba(224,128,128,0.15);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .vd-confirm-delete:hover::before { transform: scaleX(1); }
  .vd-confirm-delete span { position: relative; z-index: 1; }

  /* ── Booking Fields ── */
  .vd-booking-fields { border: 1px solid var(--border); margin-bottom: 20px; overflow: hidden; }
  .vd-booking-field { padding: 16px 20px; border-bottom: 1px solid var(--border); }
  .vd-booking-field:last-child { border-bottom: none; }
  .vd-booking-field-label { font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.65; margin-bottom: 10px; display: block; }
  .vd-booking-input {
    width: 100%; background: rgba(10,10,10,0.7); border: 1px solid var(--border);
    color: var(--cream); font-family: 'Raleway', sans-serif;
    font-size: 13px; font-weight: 200; padding: 9px 12px;
    outline: none; transition: border-color 0.2s; box-sizing: border-box;
    -webkit-appearance: none; appearance: none;
  }
  .vd-booking-input:focus { border-color: var(--gold-line); }
  .vd-booking-input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.6) sepia(1) saturate(3) hue-rotate(10deg); cursor: pointer; }
  .vd-hours-row { display: flex; align-items: center; gap: 12px; }
  .vd-hours-btn {
    width: 32px; height: 32px; flex-shrink: 0; border: 1px solid var(--border);
    background: rgba(17,17,24,0.7); color: var(--gold); font-size: 18px; line-height: 1;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s, background 0.2s; user-select: none;
  }
  .vd-hours-btn:hover { border-color: var(--gold); background: var(--gold-dim); }
  .vd-hours-btn:disabled { opacity: 0.25; cursor: not-allowed; }
  .vd-hours-val { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 300; color: var(--cream); min-width: 36px; text-align: center; }
  .vd-hours-unit { font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.1em; }
  .vd-hours-subtotal { font-family: 'Cormorant Garamond', serif; font-size: 14px; font-weight: 300; color: var(--gold-light); margin-left: auto; }

  /* Invitation emails */
  .vd-email-add-row { display: flex; gap: 8px; margin-bottom: 10px; }
  .vd-email-add-row .vd-booking-input { flex: 1; }
  .vd-email-add-btn {
    flex-shrink: 0; padding: 0 14px; border: 1px solid var(--gold-line);
    background: transparent; color: var(--gold); font-family: 'Cinzel', serif;
    font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer; white-space: nowrap; position: relative; overflow: hidden; transition: color 0.25s;
  }
  .vd-email-add-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .vd-email-add-btn:hover::before { transform: scaleX(1); }
  .vd-email-add-btn:hover { color: var(--black); }
  .vd-email-add-btn span { position: relative; z-index: 1; }
  .vd-email-list { display: flex; flex-direction: column; gap: 6px; }
  .vd-email-tag { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 10px; border: 1px solid rgba(200,169,81,0.15); background: var(--gold-dim); }
  .vd-email-tag-text { font-size: 11px; font-weight: 200; color: var(--cream); letter-spacing: 0.03em; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .vd-email-tag-remove { background: none; border: none; cursor: pointer; color: var(--muted); font-size: 11px; padding: 0; transition: color 0.2s; flex-shrink: 0; line-height: 1; }
  .vd-email-tag-remove:hover { color: var(--red); }
  .vd-email-err { font-size: 9px; color: var(--red); margin-top: 4px; letter-spacing: 0.04em; }

  /* Grand total */
  .vd-grand-total {
    border: 1px solid var(--gold-line); background: var(--gold-dim); margin-bottom: 20px;
    overflow: hidden;
  }
  .vd-grand-total-head { padding: 10px 20px; border-bottom: 1px solid var(--gold-line); font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.8; }
  .vd-grand-total-row { padding: 8px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(200,169,81,0.08); }
  .vd-grand-total-row-label { font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.04em; }
  .vd-grand-total-row-val { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 300; color: var(--cream); }
  .vd-grand-total-sum { padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; }
  .vd-grand-total-sum-label { font-size: 9px; font-weight: 300; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); }
  .vd-grand-total-sum-val { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; color: var(--gold-light); }

  @media (max-width: 900px) {
    .vd-body { grid-template-columns: 1fr; }
    .vd-sidebar { order: -1; }
    .vd-svc-edit-row { grid-template-columns: 1fr 1fr; }
    .vd-svc-edit-row.three { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 768px) {
    .vd-topbar { padding: 18px 24px; }
    .vd-main { padding: 40px 24px 60px; }
    .vd-img-wrap { height: 300px; }
    .vd-panel { padding: 32px 24px 36px; }
    .vd-footer { padding: 24px; flex-direction: column; gap: 12px; text-align: center; }
    .vd-svc-edit-row { grid-template-columns: 1fr; }
    .vd-svc-edit-row.three { grid-template-columns: 1fr; }
  }
    /* ── Hide Google Translate toolbar ── */
.goog-te-banner-frame,
.goog-te-banner-frame.skiptranslate,
body > .skiptranslate {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
}

body {
    top: 0 !important;
    position: static !important;

`;

const SERVICE_ICONS = {
  catering: "◆",
  photographer: "◆",
  videographer: "◆",
  decoration: "◆",
  dj: "◆",
  staff: "◆",
  makeup_artist: "◆",
  bakery: "◆",
  mc_host: "◆",
  entertainer: "◆",
};
const serviceIcon = (type) => SERVICE_ICONS[type?.toLowerCase()] ?? "◆";

const SERVICE_TYPES = [
  "catering",
  "photographer",
  "videographer",
  "staff",
  "decoration",
  "makeup_artist",
  "dj",
  "bakery",
  "mc_host",
];

const BLANK_SVC = { name: "", description: "", price: "", type: "catering" };

// ── Confirm Delete Modal ──
function ConfirmDelete({ name, onConfirm, onCancel }) {
  return (
    <div className="vd-confirm-overlay">
      <div className="vd-confirm-box">
        <div className="vd-confirm-icon">✕</div>
        <div className="vd-confirm-title">Delete Service</div>
        <p className="vd-confirm-sub">
          Are you sure you want to delete{" "}
          <strong style={{ color: "var(--cream)" }}>{name}</strong>? This cannot
          be undone.
        </p>
        <div className="vd-confirm-actions">
          <button className="vd-confirm-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="vd-confirm-delete" onClick={onConfirm}>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Admin Service Card (view + inline edit) ──
function AdminServiceCard({ svc, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: svc.name,
    description: svc.description || "",
    price: svc.price,
    type: svc.type || "other",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await API.put(`/services/${svc._id}`, {
        ...form,
        price: Number(form.price),
      });
      onUpdated(res.data);
      setMsg({ type: "ok", text: "Saved." });
      setTimeout(() => {
        setEditing(false);
        setMsg(null);
      }, 900);
    } catch (err) {
      setMsg({
        type: "err",
        text: err?.response?.data?.message || "Failed to save.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/services/${svc._id}`);
      onDeleted(svc._id);
    } catch (err) {
      setMsg({ type: "err", text: "Failed to delete." });
      setConfirmDelete(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: svc.name,
      description: svc.description || "",
      price: svc.price,
      type: svc.type || "other",
    });
    setMsg(null);
    setEditing(false);
  };

  return (
    <>
      {confirmDelete && (
        <ConfirmDelete
          name={svc.name}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
      <div className={`vd-admin-svc-card ${editing ? "editing" : ""}`}>
        {!editing && (
          <div className="vd-admin-svc-view">
            <div className="vd-admin-svc-info">
              <div className="vd-admin-svc-name">{svc.name}</div>
              <div className="vd-admin-svc-meta">
                <span>
                  {serviceIcon(svc.type)} {svc.type || "other"}
                </span>
                {svc.description && (
                  <span style={{ opacity: 0.6 }}>
                    — {svc.description.slice(0, 40)}
                    {svc.description.length > 40 ? "…" : ""}
                  </span>
                )}
              </div>
            </div>
            <div className="vd-admin-svc-price">
              ${svc.price?.toLocaleString()}
            </div>
            <div className="vd-admin-svc-actions">
              <button
                className="vd-icon-btn"
                onClick={() => setEditing(true)}
                title="Edit"
              >
                ✎
              </button>
              <button
                className="vd-icon-btn danger"
                onClick={() => setConfirmDelete(true)}
                title="Delete"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {editing && (
          <div className="vd-svc-edit-form">
            <div className="vd-svc-edit-row three">
              <div>
                <label className="vd-edit-label">Name</label>
                <input
                  className="vd-edit-input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Service name"
                />
              </div>
              <div>
                <label className="vd-edit-label">Type</label>
                <select
                  className="vd-edit-select"
                  value={form.type}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, type: e.target.value }))
                  }
                >
                  {SERVICE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="vd-edit-label">Price ($)</label>
                <input
                  className="vd-edit-input"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="vd-edit-label">Description</label>
              <input
                className="vd-edit-input"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Short description (optional)"
              />
            </div>
            {msg && (
              <p
                className={`vd-save-msg ${msg.type}`}
                style={{ textAlign: "left", marginTop: "8px" }}
              >
                {msg.text}
              </p>
            )}
            <div className="vd-svc-edit-actions">
              <button
                className="vd-svc-inline-btn cancel"
                onClick={handleCancel}
              >
                <span>Cancel</span>
              </button>
              <button
                className="vd-svc-inline-btn"
                onClick={handleSave}
                disabled={saving}
              >
                <span>{saving ? "Saving…" : "Save"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── New Service Form ──
function NewServiceForm({ onCreated, onClose }) {
  const [form, setForm] = useState(BLANK_SVC);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleCreate = async () => {
    if (!form.name.trim()) {
      setMsg({ type: "err", text: "Name is required." });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      const res = await API.post("/services", {
        ...form,
        price: Number(form.price),
      });
      onCreated(res.data);
      onClose();
    } catch (err) {
      setMsg({
        type: "err",
        text: err?.response?.data?.message || "Failed to create.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="vd-new-svc-form">
      <p className="vd-new-svc-title">◆ New Service</p>
      <div className="vd-svc-edit-row three">
        <div>
          <label className="vd-edit-label">Name *</label>
          <input
            className="vd-edit-input"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Service name"
          />
        </div>
        <div>
          <label className="vd-edit-label">Type</label>
          <select
            className="vd-edit-select"
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
          >
            {SERVICE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="vd-edit-label">Price ($)</label>
          <input
            className="vd-edit-input"
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            placeholder="0"
          />
        </div>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label className="vd-edit-label">Description</label>
        <input
          className="vd-edit-input"
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Short description (optional)"
        />
      </div>
      {msg && (
        <p className={`vd-save-msg ${msg.type}`} style={{ textAlign: "left" }}>
          {msg.text}
        </p>
      )}
      <div className="vd-svc-edit-actions">
        <button className="vd-svc-inline-btn cancel" onClick={onClose}>
          <span>Cancel</span>
        </button>
        <button
          className="vd-svc-inline-btn"
          onClick={handleCreate}
          disabled={saving}
        >
          <span>{saving ? "Creating…" : "Create Service"}</span>
        </button>
      </div>
    </div>
  );
}

// ── Service Type Carousel (non-admin) ──
const CARDS_PER_PAGE = 3;
function ServiceTypeCarousel({ services, selectedServices, onToggle }) {
  const [typeIndex, setTypeIndex] = useState(0);
  const [cardPage, setCardPage] = useState(0);

  const groups = Object.entries(
    services.reduce((acc, svc) => {
      const key = svc.type || "other";
      if (!acc[key]) acc[key] = [];
      acc[key].push(svc);
      return acc;
    }, {}),
  ).map(([type, items]) => ({ type, icon: serviceIcon(type), items }));

  if (groups.length === 0) return null;
  const safeTypeIndex = Math.min(typeIndex, groups.length - 1);
  const group = groups[safeTypeIndex];
  const totalPages = Math.ceil(group.items.length / CARDS_PER_PAGE);
  const safePage = Math.min(cardPage, totalPages - 1);
  const visibleItems = group.items.slice(
    safePage * CARDS_PER_PAGE,
    safePage * CARDS_PER_PAGE + CARDS_PER_PAGE,
  );

  const handleTypeChange = (i) => {
    setTypeIndex(i);
    setCardPage(0);
  };

  return (
    <div className="vd-type-carousel">
      <div className="vd-type-nav">
        <div className="vd-type-nav-info">
          <span className="vd-type-nav-icon">{group.icon}</span>
          <span className="vd-type-nav-title">{group.type}</span>
          <span className="vd-type-nav-count">({group.items.length})</span>
        </div>
        <div className="vd-type-nav-arrows">
          <span className="vd-type-pager">
            {safeTypeIndex + 1} / {groups.length}
          </span>
          <button
            className="vd-type-arrow"
            disabled={safeTypeIndex === 0}
            onClick={() => handleTypeChange(safeTypeIndex - 1)}
          >
            ←
          </button>
          <button
            className="vd-type-arrow"
            disabled={safeTypeIndex === groups.length - 1}
            onClick={() => handleTypeChange(safeTypeIndex + 1)}
          >
            →
          </button>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="vd-items-nav">
          <button
            className="vd-item-arrow"
            disabled={safePage === 0}
            onClick={() => setCardPage((p) => p - 1)}
          >
            ←
          </button>
          <span className="vd-items-pager">
            {safePage * CARDS_PER_PAGE + 1}–
            {Math.min((safePage + 1) * CARDS_PER_PAGE, group.items.length)} of{" "}
            {group.items.length}
          </span>
          <button
            className="vd-item-arrow"
            disabled={safePage === totalPages - 1}
            onClick={() => setCardPage((p) => p + 1)}
          >
            →
          </button>
        </div>
      )}
      <div className="vd-svc-row">
        {visibleItems.map((svc) => {
          const isSelected = selectedServices.includes(svc._id);
          return (
            <div
              key={svc._id}
              className={`vd-service-card ${isSelected ? "selected" : ""}`}
              onClick={() => onToggle(svc._id)}
            >
              <div className="vd-service-check">✓</div>
              <p className="vd-service-card-name">{svc.name}</p>
              {svc.description && (
                <p className="vd-service-card-desc">{svc.description}</p>
              )}
              <div className="vd-service-card-price">
                ${svc.price?.toLocaleString()}
                <small>/ event</small>
              </div>
            </div>
          );
        })}
      </div>
      {groups.length > 1 && (
        <div className="vd-type-dots">
          {groups.map((_, i) => (
            <div
              key={i}
              className={`vd-type-dot ${i === safeTypeIndex ? "active" : ""}`}
              onClick={() => handleTypeChange(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceSearch({ value, onChange }) {
  return (
    <div style={{ position: "relative", marginBottom: "20px" }}>
      <span
        style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "13px",
          color: "var(--muted)",
          pointerEvents: "none",
          lineHeight: 1,
        }}
      >
        ⌕
      </span>
      <input
        className="vd-booking-input"
        style={{ paddingLeft: "32px" }}
        type="text"
        placeholder="Search services…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function ServiceSkeleton() {
  return (
    <div className="vd-svc-skel" style={{ padding: "18px 20px 20px" }}>
      <div className="vd-svc-skel-body">
        <div
          className="vd-svc-skel-line"
          style={{ width: "40%", marginBottom: "10px" }}
        />
        <div
          className="vd-svc-skel-line"
          style={{ width: "70%", marginBottom: "8px" }}
        />
        <div
          className="vd-svc-skel-line"
          style={{ width: "100%", marginBottom: "8px" }}
        />
        <div className="vd-svc-skel-line" style={{ width: "30%" }} />
      </div>
    </div>
  );
}

function VenueSkeleton() {
  return (
    <div className="vd-skel-root">
      <div className="vd-skel-img" />
      <div className="vd-skel-panel">
        <div
          className="vd-skel-line"
          style={{ width: "30%", marginBottom: "12px" }}
        />
        <div className="vd-skel-line xl" />
        <div className="vd-skel-line wide" />
        <div className="vd-skel-line full" />
        <div className="vd-skel-line full" />
      </div>
    </div>
  );
}

// ── Main Component ──
function VenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState([]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  // Carousel
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Image manager (admin)
  const [newImgUrl, setNewImgUrl] = useState("");

  // Service manager
  const [showNewSvcForm, setShowNewSvcForm] = useState(false);

  // Booking fields
  const [hours, setHours] = useState(4);
  const [eventDate, setEventDate] = useState("");
  const [inviteEmails, setInviteEmails] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(payload?.role === "admin");
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await API.get(`/venues/${id}`);
        setVenue(res.data);
        setEditForm({
          name: res.data.name || "",
          location: res.data.location || "",
          description: res.data.description || "",
          capacity: res.data.capacity ?? "",
          pricePerHour: res.data.pricePerHour ?? "",
          isAvailable: res.data.isAvailable ?? true,
          images: res.data.images || [],
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchServices = async () => {
      try {
        const res = await API.get("/services");
        setServices(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchVenue();
    fetchServices();
  }, [id]);

  const toggleService = (serviceId) =>
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((s) => s !== serviceId)
        : [...prev, serviceId],
    );

  const removeService = (serviceId, e) => {
    e.stopPropagation();
    setSelectedServices((prev) => prev.filter((s) => s !== serviceId));
  };

  const selectedServiceObjects = services.filter((s) =>
    selectedServices.includes(s._id),
  );
  const servicesTotal = selectedServiceObjects.reduce(
    (sum, s) => sum + (s.price || 0),
    0,
  );
  const venueCost = hours * ((venue?.pricePerHour || 0) * 10);
  const grandTotal = venueCost + servicesTotal;

  const addInviteEmail = () => {
    const val = emailInput.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setEmailErr("Please enter a valid email address.");
      return;
    }
    if (inviteEmails.includes(val)) {
      setEmailErr("This email has already been added.");
      return;
    }
    setInviteEmails((prev) => [...prev, val]);
    setEmailInput("");
    setEmailErr("");
  };

  const removeInviteEmail = (email) =>
    setInviteEmails((prev) => prev.filter((e) => e !== email));

  const handleBook = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    navigate(`/booking/${id}`, {
      state: {
        venue,
        selectedServices, // array of service IDs
        selectedServiceObjects, // array of full service objects {_id, name, price}
        hours,
        eventDate,
        inviteEmails,
      },
    });
  };

  const handleEditChange = (field, value) =>
    setEditForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const payload = {
        name: editForm.name,
        location: editForm.location,
        description: editForm.description,
        capacity: Number(editForm.capacity),
        pricePerHour: Number(editForm.pricePerHour),
        isAvailable: editForm.isAvailable,
        images: editForm.images || [],
      };
      const res = await API.put(`/venues/${id}`, payload);
      setVenue(res.data);
      setSaveMsg({ type: "ok", text: "Changes saved successfully." });
      setEditMode(false);
    } catch (err) {
      setSaveMsg({
        type: "err",
        text:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          `Error ${err?.response?.status}: Failed to save changes.`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: venue.name || "",
      location: venue.location || "",
      description: venue.description || "",
      capacity: venue.capacity ?? "",
      pricePerHour: venue.pricePerHour ?? "",
      isAvailable: venue.isAvailable ?? true,
      images: venue.images || [],
    });
    setNewImgUrl("");
    setSaveMsg(null);
    setEditMode(false);
  };

  // Image manager helpers
  const addImage = () => {
    const url = newImgUrl.trim();
    if (!url) return;
    setEditForm((prev) => ({ ...prev, images: [...(prev.images || []), url] }));
    setNewImgUrl("");
  };
  const removeImage = (idx) =>
    setEditForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  const updateImage = (idx, val) =>
    setEditForm((prev) => {
      const imgs = [...(prev.images || [])];
      imgs[idx] = val;
      return { ...prev, images: imgs };
    });

  // Service CRUD callbacks
  const handleServiceUpdated = (updated) =>
    setServices((prev) =>
      prev.map((s) => (s._id === updated._id ? updated : s)),
    );

  const handleServiceDeleted = (deletedId) =>
    setServices((prev) => prev.filter((s) => s._id !== deletedId));

  const handleServiceCreated = (newSvc) =>
    setServices((prev) => [...prev, newSvc]);

  return (
    <>
      <style>{style}</style>
      <div className="vd-root">
        <nav className="vd-topbar">
          <div className="vd-logo" onClick={() => navigate("/")}>
            <div className="vd-logo-mark" />
            <div className="vd-logo-text" translate="no">
              Event<span>y</span>
            </div>
          </div>
          <button className="vd-back-btn" onClick={() => navigate("/")}>
            <span className="vd-back-arrow">←</span>
            <span>All Venues</span>
          </button>
        </nav>

        {loading && <VenueSkeleton />}

        {!loading && !venue && (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              textAlign: "center",
              padding: "120px 56px",
            }}
          >
            <div
              style={{
                fontFamily: "Cormorant Garamond",
                fontSize: "40px",
                color: "var(--gold)",
                opacity: 0.3,
                marginBottom: "20px",
              }}
            >
              ◆
            </div>
            <div
              style={{
                fontFamily: "Cormorant Garamond",
                fontSize: "36px",
                fontWeight: 300,
                color: "var(--cream)",
                marginBottom: "12px",
              }}
            >
              Venue Not Found
            </div>
            <p
              style={{
                fontSize: "12px",
                fontWeight: 200,
                color: "var(--muted)",
                letterSpacing: "0.06em",
              }}
            >
              This venue may no longer be available.
            </p>
          </div>
        )}

        {!loading && venue && (
          <main className="vd-main">
            <p className="vd-breadcrumb">Venue Details</p>

            {isAdmin && (
              <div className="vd-admin-bar">
                <span className="vd-admin-bar-label">Admin Mode</span>
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  {saveMsg && (
                    <span className={`vd-save-msg ${saveMsg.type}`}>
                      {saveMsg.text}
                    </span>
                  )}
                  {editMode ? (
                    <>
                      <button
                        className="vd-admin-toggle"
                        onClick={handleCancelEdit}
                      >
                        <span>Cancel</span>
                      </button>
                      <button
                        className="vd-admin-toggle active"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        <span>{saving ? "Saving…" : "Save Changes"}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      className="vd-admin-toggle"
                      onClick={() => {
                        setEditMode(true);
                        setSaveMsg(null);
                      }}
                    >
                      <span>✎ Edit Venue</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="vd-img-wrap">
              <div
                className={`vd-ribbon ${(editMode ? editForm.isAvailable : venue.isAvailable) ? "available" : "unavailable"}`}
              >
                {(editMode ? editForm.isAvailable : venue.isAvailable)
                  ? "Available"
                  : "Unavailable"}
              </div>
              {(() => {
                const imgs = (venue.images?.length ? venue.images : null) || [
                  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
                ];
                const idx = Math.min(carouselIndex, imgs.length - 1);
                return (
                  <div className="vd-carousel">
                    <div className="vd-carousel-track">
                      <img
                        key={idx}
                        className="vd-carousel-img"
                        src={imgs[idx]}
                        alt={`${venue.name} — photo ${idx + 1}`}
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80";
                        }}
                      />
                    </div>
                    {imgs.length > 1 && (
                      <>
                        <button
                          className="vd-carousel-btn prev"
                          disabled={idx === 0}
                          onClick={() => setCarouselIndex((i) => i - 1)}
                        >
                          ←
                        </button>
                        <button
                          className="vd-carousel-btn next"
                          disabled={idx === imgs.length - 1}
                          onClick={() => setCarouselIndex((i) => i + 1)}
                        >
                          →
                        </button>
                        <div className="vd-carousel-dots">
                          {imgs.map((_, i) => (
                            <div
                              key={i}
                              className={`vd-carousel-dot ${i === idx ? "active" : ""}`}
                              onClick={() => setCarouselIndex(i)}
                            />
                          ))}
                        </div>
                        <span className="vd-carousel-counter">
                          {idx + 1} / {imgs.length}
                        </span>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="vd-panel">
              {editMode ? (
                <input
                  className="vd-edit-input name-input"
                  value={editForm.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  placeholder="Venue name"
                  style={{ marginBottom: "10px" }}
                />
              ) : (
                <h1 className="vd-name">{venue.name}</h1>
              )}
              {editMode ? (
                <input
                  className="vd-edit-input"
                  value={editForm.location}
                  onChange={(e) => handleEditChange("location", e.target.value)}
                  placeholder="Location"
                  style={{ marginBottom: "32px" }}
                />
              ) : (
                <p className="vd-location">{venue.location}</p>
              )}

              <div className="vd-divider" />

              <div className="vd-body">
                <div>
                  <p className="vd-desc-label">About this Venue</p>
                  {editMode && (
                    <div className="vd-img-manager vd-edit-field">
                      <label className="vd-img-manager-label">◆ Photos</label>
                      <div className="vd-img-list">
                        {(editForm.images || []).map((url, i) => (
                          <div className="vd-img-row" key={i}>
                            <img
                              className="vd-img-thumb"
                              src={url}
                              alt=""
                              onError={(e) => {
                                e.target.style.opacity = "0.3";
                              }}
                            />
                            <input
                              className="vd-img-url-input"
                              value={url}
                              onChange={(e) => updateImage(i, e.target.value)}
                              placeholder="https://..."
                            />
                            <button
                              className="vd-img-remove-btn"
                              onClick={() => removeImage(i)}
                              title="Remove photo"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        {(editForm.images || []).length === 0 && (
                          <p
                            style={{
                              fontSize: "11px",
                              color: "var(--muted)",
                              fontWeight: 200,
                              marginBottom: "6px",
                            }}
                          >
                            No photos yet. Add a URL below.
                          </p>
                        )}
                      </div>
                      <div className="vd-img-add-row">
                        <input
                          className="vd-img-add-input"
                          placeholder="Paste image URL…"
                          value={newImgUrl}
                          onChange={(e) => setNewImgUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addImage();
                            }
                          }}
                        />
                        <button className="vd-img-add-btn" onClick={addImage}>
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  )}
                  {editMode ? (
                    <textarea
                      className="vd-edit-input textarea"
                      value={editForm.description}
                      onChange={(e) =>
                        handleEditChange("description", e.target.value)
                      }
                      placeholder="Venue description"
                    />
                  ) : (
                    <p className="vd-desc">
                      {venue.description ||
                        "No description available for this venue."}
                    </p>
                  )}

                  {/* ── Services: admin view ── */}
                  {isAdmin && (
                    <div className="vd-svc-manager">
                      <div className="vd-svc-manager-head">
                        <p className="vd-svc-manager-title">
                          Manage Services ({services.length})
                        </p>
                        <button
                          className="vd-svc-add-btn"
                          onClick={() => setShowNewSvcForm((v) => !v)}
                        >
                          <span>
                            {showNewSvcForm ? "✕ Cancel" : "+ Add Service"}
                          </span>
                        </button>
                      </div>

                      {showNewSvcForm && (
                        <NewServiceForm
                          onCreated={handleServiceCreated}
                          onClose={() => setShowNewSvcForm(false)}
                        />
                      )}

                      {servicesLoading ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          {[1, 2, 3].map((n) => (
                            <ServiceSkeleton key={n} />
                          ))}
                        </div>
                      ) : services.length === 0 ? (
                        <p
                          style={{
                            fontSize: "12px",
                            color: "var(--muted)",
                            fontWeight: 200,
                          }}
                        >
                          No services yet. Add one above.
                        </p>
                      ) : (
                        <div className="vd-admin-svc-list">
                          {services.map((svc) => (
                            <AdminServiceCard
                              key={svc._id}
                              svc={svc}
                              onUpdated={handleServiceUpdated}
                              onDeleted={handleServiceDeleted}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Services: regular user view ── */}
                  {!isAdmin && !editMode && (
                    <div className="vd-services-section">
                      <p className="vd-services-label">Add-on Services</p>
                      <p className="vd-services-sub">
                        Enhance your event by selecting from our curated
                        services below.
                      </p>

                      {servicesLoading ? (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(140px, 1fr))",
                            gap: "10px",
                          }}
                        >
                          {[1, 2, 3].map((n) => (
                            <ServiceSkeleton key={n} />
                          ))}
                        </div>
                      ) : services.length === 0 ? (
                        <p
                          style={{
                            fontSize: "12px",
                            color: "var(--muted)",
                            fontWeight: 200,
                          }}
                        >
                          No services available at this time.
                        </p>
                      ) : (
                        <>
                          <ServiceSearch
                            value={searchQuery}
                            onChange={setSearchQuery}
                          />

                          {searchQuery.trim() ? (
                            (() => {
                              const q = searchQuery.trim().toLowerCase();
                              const results = services.filter(
                                (s) =>
                                  s.name?.toLowerCase().includes(q) ||
                                  s.description?.toLowerCase().includes(q) ||
                                  s.type?.toLowerCase().includes(q),
                              );
                              return results.length === 0 ? (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    color: "var(--muted)",
                                    fontWeight: 200,
                                  }}
                                >
                                  No services match "{searchQuery}".
                                </p>
                              ) : (
                                <div className="vd-svc-row">
                                  {results.map((svc) => {
                                    const isSelected =
                                      selectedServices.includes(svc._id);
                                    return (
                                      <div
                                        key={svc._id}
                                        className={`vd-service-card ${isSelected ? "selected" : ""}`}
                                        onClick={() => toggleService(svc._id)}
                                      >
                                        <div className="vd-service-check">
                                          ✓
                                        </div>
                                        <p className="vd-service-card-name">
                                          {svc.name}
                                        </p>
                                        {svc.description && (
                                          <p className="vd-service-card-desc">
                                            {svc.description}
                                          </p>
                                        )}
                                        <div className="vd-service-card-price">
                                          ${svc.price?.toLocaleString()}
                                          <small>/ event</small>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })()
                          ) : (
                            <ServiceTypeCarousel
                              services={services}
                              selectedServices={selectedServices}
                              onToggle={toggleService}
                            />
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="vd-sidebar">
                  <div className="vd-stats">
                    <div className="vd-stat">
                      <span className="vd-stat-label">Capacity</span>
                      {editMode ? (
                        <input
                          className="vd-edit-input number-input"
                          type="number"
                          min="0"
                          value={editForm.capacity}
                          onChange={(e) =>
                            handleEditChange("capacity", e.target.value)
                          }
                        />
                      ) : (
                        <div className="vd-stat-value">
                          {venue.capacity?.toLocaleString()}
                          <small>guests</small>
                        </div>
                      )}
                    </div>
                    <div className="vd-stat">
                      <span className="vd-stat-label">Price per Hour</span>
                      {editMode ? (
                        <input
                          className="vd-edit-input number-input"
                          type="number"
                          min="0"
                          value={editForm.pricePerHour}
                          onChange={(e) =>
                            handleEditChange("pricePerHour", e.target.value)
                          }
                        />
                      ) : (
                        <div className="vd-stat-value">
                          <span className="currency">$</span>
                          {((venue.pricePerHour || 0) * 10).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="vd-stat">
                      <span className="vd-stat-label">Availability</span>
                      {editMode ? (
                        <select
                          className="vd-edit-select"
                          value={editForm.isAvailable ? "true" : "false"}
                          onChange={(e) =>
                            handleEditChange(
                              "isAvailable",
                              e.target.value === "true",
                            )
                          }
                        >
                          <option value="true">Open for Booking</option>
                          <option value="false">Currently Unavailable</option>
                        </select>
                      ) : (
                        <div
                          className="vd-stat-value"
                          style={{
                            fontSize: "16px",
                            color: venue.isAvailable
                              ? "var(--green)"
                              : "var(--red)",
                          }}
                        >
                          {venue.isAvailable
                            ? "Open for Booking"
                            : "Currently Unavailable"}
                        </div>
                      )}
                    </div>
                  </div>

                  {editMode && (
                    <>
                      <button
                        className="vd-save-btn"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        <span>{saving ? "Saving…" : "Save Changes"}</span>
                      </button>
                      {saveMsg && (
                        <p className={`vd-save-msg ${saveMsg.type}`}>
                          {saveMsg.text}
                        </p>
                      )}
                    </>
                  )}

                  {!editMode && !isAdmin && (
                    <>
                      {/* ── Booking Fields ── */}
                      <div className="vd-booking-fields">
                        {/* Hours */}
                        <div className="vd-booking-field">
                          <span className="vd-booking-field-label">
                            Number of Hours
                          </span>
                          <div className="vd-hours-row">
                            <button
                              className="vd-hours-btn"
                              disabled={hours <= 1}
                              onClick={() =>
                                setHours((h) => Math.max(1, h - 1))
                              }
                            >
                              −
                            </button>
                            <span className="vd-hours-val">{hours}</span>
                            <span className="vd-hours-unit">hrs</span>
                            <button
                              className="vd-hours-btn"
                              disabled={hours >= 24}
                              onClick={() =>
                                setHours((h) => Math.min(24, h + 1))
                              }
                            >
                              +
                            </button>
                            <span className="vd-hours-subtotal">
                              ${venueCost.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="vd-booking-field">
                          <span className="vd-booking-field-label">
                            Event Date
                          </span>
                          <input
                            className="vd-booking-input"
                            type="date"
                            value={eventDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setEventDate(e.target.value)}
                          />
                        </div>

                        {/* Invitation Emails */}
                        <div className="vd-booking-field">
                          <span className="vd-booking-field-label">
                            Send Invitations
                          </span>
                          <div className="vd-email-add-row">
                            <input
                              className="vd-booking-input"
                              type="email"
                              placeholder="guest@example.com"
                              value={emailInput}
                              onChange={(e) => {
                                setEmailInput(e.target.value);
                                setEmailErr("");
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addInviteEmail();
                                }
                              }}
                            />
                            <button
                              className="vd-email-add-btn"
                              onClick={addInviteEmail}
                            >
                              <span>Add</span>
                            </button>
                          </div>
                          {emailErr && (
                            <p className="vd-email-err">{emailErr}</p>
                          )}
                          {inviteEmails.length > 0 && (
                            <div className="vd-email-list">
                              {inviteEmails.map((email) => (
                                <div className="vd-email-tag" key={email}>
                                  <span className="vd-email-tag-text">
                                    ✉ {email}
                                  </span>
                                  <button
                                    className="vd-email-tag-remove"
                                    onClick={() => removeInviteEmail(email)}
                                    title="Remove"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ── Services Summary ── */}
                      {selectedServiceObjects.length > 0 && (
                        <div className="vd-services-summary">
                          <div className="vd-services-summary-head">
                            <span>Selected Services</span>
                            <span className="vd-services-summary-count">
                              {selectedServiceObjects.length}
                            </span>
                          </div>
                          {selectedServiceObjects.map((svc) => (
                            <div
                              className="vd-services-summary-item"
                              key={svc._id}
                            >
                              <span className="vd-summary-item-name">
                                {svc.name}
                              </span>
                              <span className="vd-summary-item-price">
                                ${svc.price?.toLocaleString()}
                              </span>
                              <button
                                className="vd-summary-item-remove"
                                onClick={(e) => removeService(svc._id, e)}
                                title="Remove"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* ── Grand Total ── */}
                      <div className="vd-grand-total">
                        <div className="vd-grand-total-head">
                          ◆ Booking Summary
                        </div>
                        <div className="vd-grand-total-row">
                          <span className="vd-grand-total-row-label">
                            Venue ({hours}h × $
                            {((venue.pricePerHour || 0) * 10).toLocaleString()}
                            /h)
                          </span>
                          <span className="vd-grand-total-row-val">
                            ${venueCost.toLocaleString()}
                          </span>
                        </div>
                        {selectedServiceObjects.map((svc) => (
                          <div className="vd-grand-total-row" key={svc._id}>
                            <span className="vd-grand-total-row-label">
                              {svc.name}
                            </span>
                            <span className="vd-grand-total-row-val">
                              ${svc.price?.toLocaleString()}
                            </span>
                          </div>
                        ))}
                        <div className="vd-grand-total-sum">
                          <span className="vd-grand-total-sum-label">
                            Grand Total
                          </span>
                          <span className="vd-grand-total-sum-val">
                            ${grandTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* ── CTA ── */}
                      <button
                        className="vd-cta"
                        onClick={handleBook}
                        disabled={!venue.isAvailable}
                      >
                        <span>
                          {venue.isAvailable
                            ? "Reserve This Venue"
                            : "Not Available"}
                        </span>
                      </button>
                      {venue.isAvailable && <p className="vd-cta-note"></p>}
                    </>
                  )}
                </div>
              </div>
            </div>
          </main>
        )}

        <footer className="vd-footer">
          <p className="vd-footer-copy">
            © 2026 <span>Eventy</span> — All rights reserved.
          </p>
          <p className="vd-footer-copy" style={{ opacity: 0.5 }}>
            Luxury Event Planning Platform
          </p>
        </footer>
      </div>
    </>
  );
}

export default VenueDetails;
