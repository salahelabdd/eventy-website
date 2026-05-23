import { useEffect, useState } from "react";
import API from "../api/axios";
import translations, {
  EVENT_TYPE_LABELS,
  HOTEL_TYPE_LABELS,
} from "../utils/translations";

import { applyTheme, toggleTheme } from "../utils/themeUtils";
import AiBot from "../components/AiBot";
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

    .hm-root {
        font-family: 'Raleway', sans-serif;
        font-size: 15px;
        min-height: 100vh;
        color: var(--cream);
        padding-top: 73px;
        background-color: #0A0A0A;
        background-image:
        repeating-linear-gradient(135deg, transparent, transparent 28px, rgba(200,169,81,0.03) 28px, rgba(200,169,81,0.03) 29px),
        repeating-linear-gradient(45deg,  transparent, transparent 28px, rgba(200,169,81,0.018) 28px, rgba(200,169,81,0.018) 29px),
        radial-gradient(ellipse at 15% 0%, rgba(200,169,81,0.07) 0%, transparent 50%),
        radial-gradient(ellipse at 85% 100%, rgba(13,27,42,0.6) 0%, transparent 50%);
    }
    .hm-root::before {
        content: '';
        position: fixed; inset: 0; pointer-events: none; z-index: 0;
        background: radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%);
    }

    .hm-topbar {
        background: rgba(17,17,24,0.94);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--border);
        padding: 22px 56px;
        display: flex; align-items: center; justify-content: space-between;
        position: fixed; top: 0; left: 0; right: 0; z-index: 50;
        transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
        gap: 48px;
    }
    .hm-topbar.hidden { transform: translateY(-100%); }
    .hm-topbar::after {
        content: '';
        position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, var(--gold), transparent);
    }
    .hm-logo { display: flex; align-items: center; gap: 14px; min-width: 160px; flex-shrink: 0; }
    .hm-logo-mark {
        width: 32px; height: 32px;
        border: 1.5px solid var(--gold);
        transform: rotate(45deg); flex-shrink: 0;
    }
    .hm-logo-text {
        font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600;
        letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase;
    }
    .hm-logo-text span { color: var(--gold); }
    .hm-nav { display: flex; gap: 6px; align-items: center; flex-wrap: nowrap; }
    .hm-nav-link {
        font-size: 11.5px; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase;
        color: var(--muted); text-decoration: none; transition: color 0.2s; white-space: nowrap;
    }
    .hm-nav-link:hover { color: var(--gold); }

    .hm-nav-btn {
        font-family: 'Cinzel', serif; font-size: 9px; font-weight: 400;
        letter-spacing: 0.24em; text-transform: uppercase;
        padding: 9px 20px; border: 1px solid var(--border);
        background: transparent; color: var(--gold);
        cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
        white-space: nowrap; flex-shrink: 0;
    }
    .hm-nav-btn::before {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(90deg, var(--gold), #A8843A);
        transform: scaleX(0); transform-origin: left;
        transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
    }
    .hm-nav-btn:hover::before { transform: scaleX(1); }
    .hm-nav-btn:hover { color: var(--black); }
    .hm-nav-btn span { position: relative; z-index: 1; }

    .hm-nav-btn-admin {
        font-family: 'Cinzel', serif; font-size: 9px; font-weight: 600;
        letter-spacing: 0.24em; text-transform: uppercase;
        padding: 9px 20px;
        border: 1px solid var(--gold);
        background: var(--gold-dim);
        color: var(--gold-light);
        cursor: pointer; position: relative; overflow: visible; transition: color 0.3s;
        display: flex; align-items: center; gap: 8px; white-space: nowrap; flex-shrink: 0;
    }
    .hm-nav-btn-admin::before {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(90deg, var(--gold), #A8843A);
        transform: scaleX(0); transform-origin: left;
        transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
    }
    .hm-nav-btn-admin:hover::before { transform: scaleX(1); }
    .hm-nav-btn-admin:hover { color: var(--black); }
    .hm-nav-btn-admin span { position: relative; z-index: 1; }
    .hm-nav-btn-admin .adm-diamond {
        position: relative; z-index: 1;
        width: 6px; height: 6px;
        border: 1px solid currentColor;
        transform: rotate(45deg);
        flex-shrink: 0; opacity: 0.75;
        transition: opacity 0.3s;
    }
    .hm-nav-btn-admin:hover .adm-diamond { opacity: 1; }
    .hm-nav-sep { width: 1px; height: 20px; background: var(--border); flex-shrink: 0; }

    .hm-hero {
        position: relative; z-index: 1;
        padding: 100px 56px 80px;
        max-width: 1200px; margin: 0 auto;
        display: flex; align-items: flex-end; justify-content: space-between;
        gap: 48px;
    }
    .hm-hero-left { flex: 1; }
    .hm-hero-eyebrow {
        font-size: 10px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
        color: var(--gold); opacity: 0.8; margin-bottom: 20px;
        display: flex; align-items: center; gap: 14px;
    }
    .hm-hero-eyebrow::before {
        content: ''; display: block; width: 32px; height: 1px;
        background: var(--gold); opacity: 0.6;
    }
    .hm-hero-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(52px, 6vw, 86px); font-weight: 300;
        color: var(--cream); line-height: 1.0; margin-bottom: 28px;
    }
    .hm-hero-title em { color: var(--gold-light); font-style: italic; }
    .hm-hero-sub {
        font-size: 15px; font-weight: 200; color: var(--muted);
        line-height: 1.9; max-width: 440px; letter-spacing: 0.04em;
    }
    .hm-hero-right {
        flex-shrink: 0;
        display: flex; gap: 0;
        border: 1px solid var(--border);
        padding: 28px 36px;
        background: rgba(17,17,24,0.7); backdrop-filter: blur(8px);
    }
    .hm-hero-stat { padding: 0 28px; text-align: center; }
    .hm-hero-stat + .hm-hero-stat { border-left: 1px solid var(--border); }
    .hm-stat-n {
        font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 300;
        color: var(--gold-light); line-height: 1;
    }
    .hm-stat-l {
        font-size: 10px; font-weight: 200; letter-spacing: 0.18em; text-transform: uppercase;
        color: var(--muted); margin-top: 6px;
    }

    .hm-filter-wrap {
        position: relative;
        max-width: 1200px; margin: 0 auto;
        padding: 0 56px 48px;
    }
    .hm-filter-label {
        font-size: 10.5px; font-weight: 300; letter-spacing: 0.4em; text-transform: uppercase;
        color: var(--gold); opacity: 0.7; margin-bottom: 16px;
        display: flex; align-items: center; gap: 12px;
    }
    .hm-filter-label::before {
        content: ''; display: block; width: 24px; height: 1px;
        background: var(--gold); opacity: 0.5;
    }
    .hm-filter-scroll {
        display: flex; gap: 10px; flex-wrap: wrap;
    }
    .hm-filter-btn {
        font-family: 'Cinzel', serif; font-size: 8.5px; font-weight: 400;
        letter-spacing: 0.22em; text-transform: uppercase;
        padding: 8px 18px;
        border: 1px solid var(--border);
        background: transparent;
        color: var(--muted);
        cursor: pointer;
        position: relative; overflow: hidden;
        transition: color 0.25s, border-color 0.25s;
        white-space: nowrap;
        display: flex; align-items: center; gap: 8px;
    }
    .hm-filter-btn::before {
        content: ''; position: absolute; inset: 0;
        background: var(--gold-dim);
        transform: scaleX(0); transform-origin: left;
        transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); z-index: 0;
    }
    .hm-filter-btn:hover { color: var(--gold-light); border-color: var(--gold-line); }
    .hm-filter-btn:hover::before { transform: scaleX(1); }
    .hm-filter-btn span { position: relative; z-index: 1; }
    .hm-filter-btn .fb-icon { position: relative; z-index: 1; font-size: 11px; line-height: 1; }
    .hm-filter-btn.active {
        border-color: var(--gold);
        color: var(--gold-light);
        background: var(--gold-dim);
    }
    .hm-filter-btn.active::before { transform: scaleX(1); }
    .hm-filter-count {
        position: relative; z-index: 1;
        font-family: 'Cormorant Garamond', serif; font-size: 12px;
        color: var(--gold); opacity: 0.7;
    }

    /* ── Carousel Filter ── */
.hm-cfilter-wrap {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    position: relative;
}
.hm-cfilter-chip {
    font-family: 'Cinzel', serif; font-size: 8.5px; font-weight: 400;
    letter-spacing: 0.22em; text-transform: uppercase;
    padding: 8px 20px;
    border: 1px solid var(--gold);
    background: var(--gold-dim);
    color: var(--gold-light);
    display: flex; align-items: center; gap: 8px;
    white-space: nowrap; min-width: 160px; justify-content: center;
}
.hm-cfilter-view-btn {
    font-family: 'Cinzel', serif; font-size: 8px; font-weight: 400;
    letter-spacing: 0.22em; text-transform: uppercase;
    padding: 8px 16px;
    border: 1px solid var(--border);
    background: transparent; color: var(--muted);
    cursor: pointer; white-space: nowrap;
    transition: border-color 0.25s, color 0.25s;
    display: flex; align-items: center; gap: 6px;
}
.hm-cfilter-view-btn:hover { border-color: var(--gold-line); color: var(--gold-light); }
.hm-cfilter-dropdown {
    position: absolute; top: calc(100% + 10px); left: 0; z-index: 100;
    background: #111118; backdrop-filter: none;
    border: 1px solid var(--border);
    padding: 16px;
    display: flex; flex-wrap: wrap; gap: 8px;
    min-width: 340px; max-width: 560px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.5);
    animation: fdrop 0.18s cubic-bezier(0.4,0,0.2,1);
}
@keyframes fdrop {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
}
.hm-cfilter-opt {
    font-family: 'Cinzel', serif; font-size: 8px; font-weight: 400;
    letter-spacing: 0.2em; text-transform: uppercase;
    padding: 7px 14px;
    border: 1px solid var(--border);
    background: transparent; color: var(--muted);
    cursor: pointer;
    display: flex; align-items: center; gap: 6px;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
    white-space: nowrap;
}
.hm-cfilter-opt:hover { color: var(--gold-light); border-color: var(--gold-line); background: var(--gold-dim); }
.hm-cfilter-opt.active { color: var(--gold-light); border-color: var(--gold); background: var(--gold-dim); }
.hm-cfilter-count-badge {
    font-family: 'Cormorant Garamond', serif; font-size: 11px;
    color: var(--gold); opacity: 0.7;
}

    /* ── Location carousel ── */
    .hm-loc-carousel {
        display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    }
    .hm-loc-arrow {
        width: 32px; height: 32px; flex-shrink: 0;
        border: 1px solid var(--border);
        background: rgba(17,17,24,0.7);
        color: var(--gold);
        font-size: 14px; line-height: 1;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: border-color 0.25s, background 0.25s;
    }
    .hm-loc-arrow:hover:not(:disabled) {
        border-color: var(--gold);
        background: var(--gold-dim);
    }
    .hm-loc-arrow:disabled { opacity: 0.25; cursor: not-allowed; }
    .hm-loc-chip {
        font-family: 'Cinzel', serif; font-size: 8.5px; font-weight: 400;
        letter-spacing: 0.22em; text-transform: uppercase;
        padding: 8px 20px;
        border: 1px solid var(--gold);
        background: var(--gold-dim);
        color: var(--gold-light);
        display: flex; align-items: center; gap: 8px;
        white-space: nowrap;
    }
    .hm-loc-chip-icon { font-size: 11px; line-height: 1; }
    .hm-loc-pager {
        font-size: 10px; font-weight: 200; color: var(--muted);
        letter-spacing: 0.12em; white-space: nowrap;
    }
    .hm-loc-search {
        display: flex; align-items: center;
        border: 1px solid var(--border);
        background: rgba(17,17,24,0.7);
        transition: border-color 0.25s;
        margin-left: 8px;
    }
    .hm-loc-search:focus-within {
        border-color: var(--gold-line);
    }
    .hm-loc-search-icon {
        padding: 0 10px;
        color: var(--gold); opacity: 0.6;
        font-size: 13px; line-height: 1; flex-shrink: 0;
    }
    .hm-loc-search input {
        background: transparent; border: none; outline: none;
        color: var(--cream);
        font-family: 'Raleway', sans-serif; font-size: 12px; font-weight: 200;
        letter-spacing: 0.06em;
        padding: 8px 12px 8px 0;
        width: 180px;
    }
    .hm-loc-search input::placeholder { color: var(--muted); }

    .hm-section {
        position: relative; z-index: 1;
        max-width: 1200px; margin: 0 auto;
        padding: 0 56px 100px;
    }
    .hm-section-head {
        display: flex; align-items: flex-end; justify-content: space-between;
        margin-bottom: 48px; padding-bottom: 24px;
        border-bottom: 1px solid var(--border);
        position: relative;
    }
    .hm-section-head::after {
        content: ''; position: absolute; bottom: -1px; left: 0; width: 80px; height: 1px;
        background: var(--gold);
    }
    .hm-section-eyebrow {
        font-size: 10px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
        color: var(--gold); opacity: 0.8; margin-bottom: 10px;
    }
    .hm-section-title {
        font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 300;
        color: var(--cream); line-height: 1.1;
    }
    .hm-section-count {
        font-size: 13px; font-weight: 200; color: var(--muted);
        letter-spacing: 0.08em; padding-bottom: 4px;
    }
    .hm-section-count strong { color: var(--gold-light); font-weight: 400; }

    .hm-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 24px;
    }

    .hm-card {
        background: rgba(17,17,24,0.80); backdrop-filter: blur(8px);
        border: 1px solid var(--border);
        overflow: hidden; position: relative;
        transition: border-color 0.35s, box-shadow 0.35s, transform 0.35s;
        cursor: pointer;
    }
    .hm-card:hover {
        border-color: rgba(200,169,81,0.45);
        box-shadow: 0 12px 48px rgba(200,169,81,0.09);
        transform: translateY(-4px);
    }

    .hm-card-ribbon {
        position: absolute; top: 16px; right: 16px; z-index: 3;
        font-size: 8.5px; font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase;
        padding: 4px 10px;
        background: rgba(10,10,10,0.75); backdrop-filter: blur(4px);
        border: 1px solid;
    }
    .hm-card-ribbon.available   { color: #8DB87A; border-color: rgba(141,184,122,0.4); }
    .hm-card-ribbon.unavailable { color: #E08080; border-color: rgba(192,80,74,0.4); }

    .hm-card-badge {
        position: absolute; top: 16px; left: 16px; z-index: 3;
        font-family: 'Cinzel', serif;
        font-size: 7.5px; font-weight: 400; letter-spacing: 0.22em; text-transform: uppercase;
        padding: 4px 10px;
        background: rgb(127 113 113 / 80%); backdrop-filter: blur(4px);
        border: 1px solid var(--gold-line);
        color: var(--gold-light);
        display: flex; align-items: center; gap: 6px;
    }
    .hm-card-badge-dot {
        width: 4px; height: 4px;
        background: var(--gold);
        transform: rotate(45deg);
        flex-shrink: 0;
    }

    .hm-card-img-wrap { position: relative; height: 210px; overflow: hidden; }
    .hm-card-img-wrap::after {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(to bottom, transparent 50%, rgba(10,10,10,0.7) 100%);
    }
    .hm-card img {
        width: 100%; height: 100%; object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
        display: block;
    }
    .hm-card:hover img { transform: scale(1.06); }

    .hm-card-body { padding: 24px 26px 28px; }
    .hm-card-name {
        font-family: 'Cormorant Garamond', serif; font-size: 23px; font-weight: 400;
        color: var(--cream); margin-bottom: 6px; line-height: 1.2;
    }
    .hm-card-location {
        font-size: 12px; font-weight: 200; color: var(--muted);
        letter-spacing: 0.06em; margin-bottom: 16px;
        display: flex; align-items: center; gap: 6px;
    }
    .hm-card-location::before { content: '◆'; font-size: 5px; color: var(--gold); opacity: 0.7; }
    .hm-card-desc {
        font-size: 13.5px; font-weight: 200; color: var(--muted);
        line-height: 1.75; letter-spacing: 0.03em; margin-bottom: 20px;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .hm-card-meta { display: flex; gap: 0; margin-bottom: 22px; border: 1px solid var(--border); }
    .hm-card-meta-item { flex: 1; padding: 10px 14px; }
    .hm-card-meta-item + .hm-card-meta-item { border-left: 1px solid var(--border); }
    .hm-card-meta-label {
        font-size: 9px; font-weight: 300; letter-spacing: 0.3em; text-transform: uppercase;
        color: var(--gold); opacity: 0.65; margin-bottom: 4px;
    }
    .hm-card-meta-value { font-size: 14px; font-weight: 300; color: var(--cream); letter-spacing: 0.03em; }
    .hm-card-meta-value span { font-family: 'Cormorant Garamond', serif; font-size: 16px; }

    .hm-card-btn {
        width: 100%; padding: 13px;
        background: transparent; border: 1px solid var(--border);
        color: var(--gold);
        font-family: 'Cinzel', serif; font-size: 9px; font-weight: 400;
        letter-spacing: 0.32em; text-transform: uppercase;
        cursor: pointer; position: relative; overflow: hidden; transition: color 0.35s;
    }
    .hm-card-btn::before {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(90deg, var(--gold), #A8843A);
        transform: scaleX(0); transform-origin: left;
        transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); z-index: 0;
    }
    .hm-card-btn:hover::before { transform: scaleX(1); }
    .hm-card-btn:hover { color: var(--black); }
    .hm-card-btn span { position: relative; z-index: 1; }
    .hm-card-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .hm-card-btn:disabled::before { display: none; }

    .hm-card-btn-toggle {
        width: 100%; padding: 11px;
        background: transparent; border: 1px solid var(--border);
        color: var(--muted);
        font-family: 'Cinzel', serif; font-size: 9px; font-weight: 400;
        letter-spacing: 0.28em; text-transform: uppercase;
        cursor: pointer; position: relative; overflow: hidden;
        transition: color 0.3s, border-color 0.3s;
        margin-top: 8px;
        display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .hm-card-btn-toggle::before {
        content: ''; position: absolute; inset: 0;
        background: rgba(200,169,81,0.08);
        transform: scaleX(0); transform-origin: left;
        transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
    }
    .hm-card-btn-toggle:hover::before { transform: scaleX(1); }
    .hm-card-btn-toggle:hover { border-color: var(--gold-line); color: var(--gold-light); }
    .hm-card-btn-toggle span { position: relative; z-index: 1; }
    .hm-card-btn-toggle:disabled { opacity: 0.4; cursor: not-allowed; }
    .hm-card-btn-toggle:disabled::before { display: none; }

    .hm-empty {
        text-align: center; padding: 100px 0; color: var(--muted); grid-column: 1 / -1;
    }
    .hm-empty-icon { font-size: 40px; margin-bottom: 20px; opacity: 0.3; font-family: 'Cormorant Garamond', serif; }
    .hm-empty-title { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 300; color: var(--cream); margin-bottom: 10px; }
    .hm-empty-sub { font-size: 13px; font-weight: 200; letter-spacing: 0.06em; }

    .hm-skeleton { background: rgba(17,17,24,0.80); border: 1px solid var(--border); overflow: hidden; }
    .hm-skeleton-img {
        height: 210px;
        background: linear-gradient(90deg, rgba(200,169,81,0.04) 25%, rgba(200,169,81,0.08) 50%, rgba(200,169,81,0.04) 75%);
        background-size: 400% 100%; animation: shimmer 1.6s infinite;
    }
    .hm-skeleton-body { padding: 24px 26px; }
    .hm-skeleton-line {
        height: 14px; border-radius: 0;
        background: linear-gradient(90deg, rgba(200,169,81,0.04) 25%, rgba(200,169,81,0.08) 50%, rgba(200,169,81,0.04) 75%);
        background-size: 400% 100%; animation: shimmer 1.6s infinite; margin-bottom: 12px;
    }
    .hm-skeleton-line.wide  { width: 70%; }
    .hm-skeleton-line.short { width: 40%; }
    .hm-skeleton-line.full  { width: 100%; }
    @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }

    /* ── Add Venue Modal ── */
    .hm-modal-overlay {
        position: fixed; inset: 0; z-index: 200;
        background: rgba(0,0,0,0.75); backdrop-filter: blur(6px);
        display: flex; align-items: center; justify-content: center;
        padding: 24px;
    }
    .hm-modal {
        background: #111118; border: 1px solid var(--border);
        width: 100%; max-width: 560px; max-height: 90vh;
        overflow-y: auto; position: relative;
        box-shadow: 0 24px 80px rgba(0,0,0,0.6);
    }
    .hm-modal-header {
        padding: 28px 32px 20px;
        border-bottom: 1px solid var(--border);
        display: flex; align-items: center; justify-content: space-between;
        position: relative;
    }
    .hm-modal-header::after {
        content: ''; position: absolute; bottom: -1px; left: 0; width: 60px; height: 1px;
        background: var(--gold);
    }
    .hm-modal-title {
        font-family: 'Cinzel', serif; font-size: 14px; font-weight: 600;
        letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold-light);
    }
    .hm-modal-close {
        background: transparent; border: 1px solid var(--border);
        color: var(--muted); width: 32px; height: 32px;
        cursor: pointer; font-size: 16px; line-height: 1;
        display: flex; align-items: center; justify-content: center;
        transition: border-color 0.2s, color 0.2s;
    }
    .hm-modal-close:hover { border-color: var(--gold-line); color: var(--gold); }
    .hm-modal-body { padding: 28px 32px 32px; display: flex; flex-direction: column; gap: 18px; }
    .hm-field { display: flex; flex-direction: column; gap: 7px; }
    .hm-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .hm-field label {
        font-size: 10px; font-weight: 300; letter-spacing: 0.35em; text-transform: uppercase;
        color: var(--gold); opacity: 0.8;
    }
    .hm-field input, .hm-field select, .hm-field textarea {
        background: rgba(255,255,255,0.03); border: 1px solid var(--border);
        color: var(--cream); padding: 10px 14px;
        font-family: 'Raleway', sans-serif; font-size: 14px; font-weight: 200;
        letter-spacing: 0.04em; outline: none;
        transition: border-color 0.25s;
        width: 100%;
    }
    .hm-field input:focus, .hm-field select:focus, .hm-field textarea:focus {
        border-color: var(--gold-line);
    }
    .hm-field select option { background: #111118; color: var(--cream); }
    .hm-field textarea { resize: vertical; min-height: 80px; }
    .hm-modal-error {
        font-size: 12px; color: #E08080; letter-spacing: 0.04em;
        padding: 10px 14px; border: 1px solid rgba(192,80,74,0.3);
        background: rgba(192,80,74,0.07);
    }
    .hm-modal-submit {
        width: 100%; padding: 14px;
        background: transparent; border: 1px solid var(--gold-line);
        color: var(--gold);
        font-family: 'Cinzel', serif; font-size: 10px; font-weight: 400;
        letter-spacing: 0.32em; text-transform: uppercase;
        cursor: pointer; position: relative; overflow: hidden; transition: color 0.35s;
        margin-top: 4px;
    }
    .hm-modal-submit::before {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(90deg, var(--gold), #A8843A);
        transform: scaleX(0); transform-origin: left;
        transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); z-index: 0;
    }
    .hm-modal-submit:hover::before { transform: scaleX(1); }
    .hm-modal-submit:hover { color: var(--black); }
    .hm-modal-submit span { position: relative; z-index: 1; }
    .hm-modal-submit:disabled { opacity: 0.45; cursor: not-allowed; }
    .hm-modal-submit:disabled::before { display: none; }

    .hm-footer {
        position: relative; z-index: 1;
        border-top: 1px solid var(--border);
        padding: 32px 56px;
        display: flex; align-items: center; justify-content: space-between;
        background: rgba(17,17,24,0.6); backdrop-filter: blur(8px);
    }
    .hm-footer-copy { font-size: 13px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }
    .hm-footer-copy span { color: var(--gold); }

    /* ── Accommodation Section Divider ── */
    .hm-section-divider {
        position: relative; z-index: 1;
        max-width: 1200px; margin: 0 auto;
        padding: 0 56px 64px;
        display: flex; align-items: center; gap: 24px;
    }
    .hm-section-divider::before, .hm-section-divider::after {
        content: ''; flex: 1; height: 1px;
        background: linear-gradient(90deg, transparent, var(--gold-line), transparent);
    }
    .hm-section-divider-inner {
        display: flex; align-items: center; gap: 12px;
        padding: 0 8px; flex-shrink: 0;
    }
    .hm-section-divider-diamond {
        width: 8px; height: 8px;
        border: 1px solid var(--gold);
        transform: rotate(45deg);
        opacity: 0.6;
    }
    .hm-section-divider-text {
        font-family: 'Cinzel', serif; font-size: 10px; font-weight: 400;
        letter-spacing: 0.4em; text-transform: uppercase;
        color: var(--gold); opacity: 0.65;
    }

    /* ── Hotel card star rating ── */
    .hm-hotel-stars {
        display: flex; gap: 3px; margin-bottom: 14px;
    }
    .hm-hotel-star {
        font-size: 11px; color: var(--gold); opacity: 0.4;
        transition: opacity 0.2s;
    }
    .hm-hotel-star.lit { opacity: 1; }

    /* ── Hotel card amenity pills ── */
    .hm-hotel-amenities {
        display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px;
    }
    .hm-hotel-pill {
        font-size: 9px; font-weight: 300; letter-spacing: 0.18em;
        text-transform: uppercase; color: var(--muted);
        padding: 4px 10px; border: 1px solid var(--border);
        background: rgba(200,169,81,0.04);
    }

    /* ── Accommodation filter tab strip ── */
    .hm-accom-tabs {
        display: flex; gap: 0; border: 1px solid var(--border);
        width: fit-content; margin-bottom: 0;
    }
    .hm-accom-tab {
        font-family: 'Cinzel', serif; font-size: 8.5px; font-weight: 400;
        letter-spacing: 0.25em; text-transform: uppercase;
        padding: 9px 20px; background: transparent; border: none;
        color: var(--muted); cursor: pointer;
        position: relative; overflow: hidden;
        transition: color 0.25s;
    }
    .hm-accom-tab + .hm-accom-tab { border-left: 1px solid var(--border); }
    .hm-accom-tab::before {
        content: ''; position: absolute; inset: 0;
        background: var(--gold-dim);
        transform: scaleY(0); transform-origin: bottom;
        transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); z-index: 0;
    }
    .hm-accom-tab:hover { color: var(--gold-light); }
    .hm-accom-tab:hover::before { transform: scaleY(1); }
    .hm-accom-tab.active {
        color: var(--gold-light); background: var(--gold-dim);
        border-bottom: 1px solid var(--gold);
    }
    .hm-accom-tab span { position: relative; z-index: 1; }

    .hm-hamburger{
    display:none;
    }

    .hm-root {
    overflow-x: hidden;
}

html, body {
    overflow-x: hidden;
    max-width: 100%;
}
    @media (max-width: 768px) {
  /* ── Topbar ── */
  .hm-topbar {
    padding: 16px 20px;
    gap: 0;
  }

  /* ── Hide nav links, show hamburger ── */
  .hm-nav { display: none; }
  .hm-nav.open {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 65px; left: 0; right: 0;
    background: rgba(17,17,24,0.98);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    padding: 24px 24px 32px;
    gap: 6px;
    z-index: 49;
    animation: nav-slide 0.25s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes nav-slide {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .hm-nav-link {
    padding: 13px 0;
    border-bottom: 1px solid rgba(200,169,81,0.08);
    font-size: 13px;
    letter-spacing: 0.25em;
  }
  .hm-nav-sep { display: none; }
  .hm-nav-btn, .hm-nav-btn-admin {
    width: 100%;
    padding: 13px 16px;
    text-align: center;
    justify-content: center;
    font-size: 10px;
  }

  /* ── Hamburger button ── */
  .hm-hamburger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 36px; height: 36px;
    background: transparent;
    border: 1px solid var(--border);
    cursor: pointer;
    padding: 0;
    align-items: center;
    flex-shrink: 0;
    transition: border-color 0.2s;
  }
  .hm-hamburger:hover { border-color: var(--gold-line); }
  .hm-hamburger span {
    display: block;
    width: 16px; height: 1.5px;
    background: var(--gold);
    transition: transform 0.3s, opacity 0.3s;
  }
  .hm-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .hm-hamburger.open span:nth-child(2) { opacity: 0; }
  .hm-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  /* ── Hero ── */
  .hm-hero {
    flex-direction: column;
    padding: 48px 20px 36px;
    gap: 32px;
  }
  .hm-hero-title { font-size: 36px; }
  .hm-hero-sub { font-size: 13px; max-width: 100%; }
  .hm-hero-right {
    width: 100%;
    padding: 20px 0;
    justify-content: space-around;
    display: flex;   /* make sure this is explicit */
    overflow: hidden;
  }
  .hm-hero-stat { 
  padding: 0 10px;
  flex:1; 
  }
  .hm-stat-n { font-size: 28px; }
  .hm-stat-l { font-size: 9px; }

  /* ── Filters ── */
  .hm-filter-wrap { padding: 0 20px 28px; }
  .hm-filter-label { font-size: 9px; }
  .hm-cfilter-wrap { gap: 8px; }
  .hm-cfilter-chip { min-width: 120px; font-size: 8px; padding: 8px 14px; }
  .hm-cfilter-dropdown {
    min-width: 280px;
    max-width: calc(100vw - 40px);
  }
  .hm-loc-search { margin-left: 0; width: 100%; margin-top: 8px; }
  .hm-loc-search input { width: 100%; }
  .hm-accom-tabs { flex-wrap: wrap; width: 100%; }
  .hm-accom-tab { flex: 1; min-width: 60px; font-size: 7.5px; padding: 9px 10px; }

  /* ── Section ── */
  .hm-section { padding: 0 20px 60px; }
  .hm-section-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 28px;
  }
  .hm-section-title { font-size: 28px; }
  .hm-section-head > div:last-child { width: 100%; justify-content: flex-start; }

  /* ── Grid: single column ── */
  .hm-grid { grid-template-columns: 1fr; gap: 16px; }

  /* ── Cards ── */
  .hm-card-img-wrap { height: 180px; }
  .hm-card-body { padding: 18px 18px 20px; }
  .hm-card-name { font-size: 20px; }
  .hm-card-meta-value { font-size: 13px; }

  /* ── Section divider ── */
  .hm-section-divider { padding: 0 20px 40px; }

  /* ── Modals: bottom sheet ── */
  .hm-modal-overlay { padding: 0; align-items: flex-end; }
  .hm-modal {
    max-width: 100%;
    width: 100%;
    max-height: 90vh;
    border-radius: 16px 16px 0 0;
    border-left: none;
    border-right: none;
    border-bottom: none;
  }
  .hm-modal-header { padding: 20px 20px 16px; }
  .hm-modal-body { padding: 16px 20px 24px; gap: 14px; }
  .hm-field-row { grid-template-columns: 1fr; gap: 14px; }

  /* ── Footer ── */
  .hm-footer {
    padding: 24px 20px;
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  /* ── Cards: compact on mobile ── */
  .hm-card-img-wrap { height: 140px; }
  .hm-card-body { padding: 12px 14px 14px; }
  .hm-card-name { font-size: 17px; margin-bottom: 4px; }
  .hm-card-location { font-size: 11px; margin-bottom: 10px; }
  .hm-card-desc { font-size: 12px; margin-bottom: 12px; -webkit-line-clamp: 2; }
  .hm-card-meta { margin-bottom: 12px; }
  .hm-card-meta-item { padding: 8px 10px; }
  .hm-card-meta-label { font-size: 8px; margin-bottom: 2px; }
  .hm-card-meta-value { font-size: 12px; }
  .hm-card-meta-value span { font-size: 14px; }
  .hm-card-btn { padding: 10px; font-size: 8px; letter-spacing: 0.2em; }
  .hm-card-btn-toggle { padding: 9px; font-size: 8px; margin-top: 6px; }
  .hm-card-ribbon { font-size: 7px; padding: 3px 8px; top: 10px; right: 10px; }
  .hm-card-badge { font-size: 6.5px; padding: 3px 8px; top: 10px; left: 10px; }
  .hm-hotel-pill { font-size: 8px; padding: 3px 8px; }
  .hm-hotel-star { font-size: 10px; }

  /* ── Hotel search fix ── */
#accommodation ~ .hm-filter-wrap > div,
.hm-filter-wrap > div[style] {
  flex-direction: column;
  align-items: stretch;
}

.hm-accom-tabs {
  width: 100%;
  flex-wrap: wrap;
  border: 1px solid var(--border);
}

.hm-accom-tab {
  flex: 1;
  min-width: 60px;
  font-size: 7.5px;
  padding: 9px 8px;
  text-align: center;
}

.hm-loc-search {
  margin-left: 0;
  margin-top: 10px;
  width: 100%;
}

.hm-loc-search input {
  width: 100%;
  flex: 1;
}
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
    }
    .notranslate {
        display: inline !important;
    }

    @keyframes dot-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

.hm-event-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 10px;
}

.hm-event-check {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 12px;

  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;

  background: rgba(255,255,255,0.03);

  font-size: 13px;
  text-transform: capitalize;

  cursor: pointer;
}

.hm-event-check input {
  width: 16px;
  height: 16px;
  accent-color: var(--gold);
  cursor: pointer;
}

@media (max-width: 768px) {
  .hm-event-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 520px) {
  .hm-event-grid {
    grid-template-columns: 1fr;
  }
}

.hm-tier-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 14px;
}

.hm-add-tier-btn {
  border: none;
  background: var(--gold);

  color: black;
  font-weight: 600;

  padding: 8px 14px;
  border-radius: 10px;

  cursor: pointer;
}

.hm-tier-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hm-tier-card {
  display: flex;
  align-items: center;
  gap: 14px;

  padding: 14px;

  border-radius: 14px;

  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
}

.hm-tier-range {
  display: flex;
  align-items: center;
  gap: 10px;

  flex: 1;
}

.hm-tier-range span {
  opacity: 0.7;
  font-size: 13px;
}

.hm-tier-multiplier {
  width: 90px !important;
  min-width: 90px;

  text-align: center;
}

.hm-remove-tier {
  border: none;
  background: transparent;

  color: #ff6b6b;
  font-size: 18px;

  cursor: pointer;
}

@media (max-width: 700px) {
  .hm-tier-card {
    flex-direction: column;
    align-items: stretch;
  }

  .hm-tier-range {
    width: 100%;
  }

  .hm-tier-multiplier {
    width: 100% !important;
  }
}


`;

const EVENT_TYPES = [
  { value: "all", label: "All Venues", icon: "◆" },
  { value: "wedding", label: "Wedding", icon: "◆" },
  { value: "birthday", label: "Birthday", icon: "◆" },
  { value: "prom", label: "Prom", icon: "◆" },
  { value: "graduation", label: "Graduation", icon: "◆" },
  { value: "engagement", label: "Engagement", icon: "◆" },
  { value: "anniversary", label: "Anniversary", icon: "◆" },
  { value: "conference", label: "Conference", icon: "◆" },
  { value: "business", label: "Business", icon: "◆" },
  { value: "concert", label: "Concert", icon: "◆" },
  { value: "corporate", label: "Corporate", icon: "◆" },
  { value: "exhibition", label: "Exhibition", icon: "◆" },
  { value: "gala", label: "Gala", icon: "◆" },
  { value: "other", label: "Other", icon: "◇" },
];

const typeLabel = (val) =>
  EVENT_TYPES.find((t) => t.value === val)?.label ?? val;
const typeIcon = (val) => EVENT_TYPES.find((t) => t.value === val)?.icon ?? "◆";

function SkeletonCard() {
  return (
    <div className="hm-skeleton">
      <div className="hm-skeleton-img" />
      <div className="hm-skeleton-body">
        <div className="hm-skeleton-line wide" />
        <div className="hm-skeleton-line short" />
        <div className="hm-skeleton-line full" />
        <div className="hm-skeleton-line full" />
      </div>
    </div>
  );
}

function triggerGoogleTranslate(lang) {
  const attempt = (tries) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      if (lang === "en") {
        document.cookie =
          "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" +
          window.location.hostname;
        localStorage.setItem("siteLang", "en");
        window.location.reload();
      } else {
        select.value = lang;
        select.dispatchEvent(new Event("change"));
        localStorage.setItem("siteLang", lang);
      }
    } else if (tries > 0) {
      setTimeout(() => attempt(tries - 1), 300);
    }
  };
  attempt(5);
}

function PendingDot() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    Promise.all([
      API.get("/bookings").catch(() => ({ data: [] })),
      API.get("/hotel-reservations").catch(() => ({ data: [] })),
      API.get("/admin/provider-requests").catch(() => ({ data: [] })),
    ]).then(([bookingsRes, hotelRes, providerRes]) => {
      const pendingBookings = (bookingsRes.data ?? []).filter(
        (b) => b.status === "pending",
      ).length;
      const hotelData = hotelRes.data?.reservations ?? hotelRes.data ?? [];
      const pendingHotels = hotelData.filter(
        (r) => r.status === "pending",
      ).length;
      const pendingProviders = (providerRes.data ?? []).filter(
        (r) => r.status === "pending",
      ).length;
      setCount(pendingBookings + pendingHotels + pendingProviders);
    });
  }, []);
  if (!count) return null;
  return (
    <span
      style={{
        position: "absolute",
        top: "-10px",
        right: "-12px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        background: "rgba(10,10,10,0.9)",
        border: "1px solid rgba(200,169,81,0.55)",
        padding: "3px 8px 3px 6px",
        boxShadow: "0 0 0 1px rgba(200,169,81,0.1)",
      }}
    >
      <span
        style={{
          /* blinking diamond dot */ width: "5px",
          height: "5px",
          background: "#C8A951",
          transform: "rotate(45deg)",
          animation: "dot-blink 1.6s ease-in-out infinite",
        }}
      />
      <span
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "9px",
          fontWeight: 600,
          color: "#E2C97E",
          letterSpacing: "0.06em",
          lineHeight: 1,
        }}
      >
        {count > 99 ? "99+" : count}
      </span>
    </span>
  );
}

function Home() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeFilter, setActive] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [availFilter, setAvailFilter] = useState("all");
  const [lang, setLang] = useState(localStorage.getItem("siteLang") || "en");
  const t = translations[lang];
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [availDropdownOpen, setAvailDropdownOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = applyTheme();
    setTheme(savedTheme);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch {
        setUser(null);
      }
    }

    const fetchVenues = async () => {
      try {
        const res = await API.get("/venues");
        setVenues(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const isAdmin = user?.role === "admin";
  const isProvider = user?.role === "provider" || user?.role == "admin";
  const isCustomer = user?.role === "customer";
  const isLoggedIn = !!localStorage.getItem("token");

  // My Reservation is visible to customers and providers only (NOT admins)
  const canSeeReservations = isLoggedIn && (isCustomer || isProvider);

  const [navVisible, setNavVisible] = useState(true);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setNavVisible(currentY < lastY || currentY < 10);
      lastY = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const presentTypes = [
    "all",
    ...new Set(venues.map((v) => v.eventType).filter(Boolean)),
  ];
  const visibleTypes = EVENT_TYPES.filter((t) =>
    presentTypes.includes(t.value),
  );

  const presentLocations = [
    "all",
    ...new Set(venues.map((v) => v.location).filter(Boolean)),
  ];

  const [locationIndex, setLocationIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);

  const filtered = venues.filter((v) => {
    const matchType = activeFilter === "all" || v.eventType === activeFilter;
    const matchLocation =
      locationFilter === "all" || v.location === locationFilter;
    const matchSearch =
      searchQuery.trim() === "" ||
      v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchAvail =
      availFilter === "all" ||
      (availFilter === "available" && v.isAvailable) ||
      (availFilter === "unavailable" && !v.isAvailable);
    return matchType && matchLocation && matchSearch && matchAvail;
  });

  const availableCount = venues.filter((v) => v.isAvailable).length;

  const handleAuthBtn = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else {
      window.location.href = "/login";
    }
  };

  const handleToggleAvailability = async (venue) => {
    try {
      await API.put(`/venues/${venue._id}`, {
        isAvailable: !venue.isAvailable,
      });
      setVenues((prev) =>
        prev.map((v) =>
          v._id === venue._id ? { ...v, isAvailable: !v.isAvailable } : v,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle availability", err);
    }
  };

  const handleDeleteVenue = async () => {
    if (!confirmVenue) return;
    try {
      await API.delete(`/venues/${confirmVenue._id}`);
      setVenues((prev) => prev.filter((v) => v._id !== confirmVenue._id));
    } catch (err) {
      console.error("Failed to delete venue", err);
    } finally {
      setConfirmVenue(null);
    }
  };

  // ── Add Venue Modal state ──
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmVenue, setConfirmVenue] = useState(null);
  const DEFAULT_EVENT_TYPE_PRICING = {
    wedding: { enabled: false, multiplier: 1.5 },
    gala: { enabled: false, multiplier: 1.4 },
    anniversary: { enabled: false, multiplier: 1.3 },
    engagement: { enabled: false, multiplier: 1.3 },
    prom: { enabled: false, multiplier: 1.2 },
    concert: { enabled: false, multiplier: 1.2 },
    corporate: { enabled: false, multiplier: 1.2 },
    conference: { enabled: false, multiplier: 1.15 },
    exhibition: { enabled: false, multiplier: 1.15 },
    business: { enabled: false, multiplier: 1.1 },
    graduation: { enabled: false, multiplier: 1.1 },
    birthday: { enabled: false, multiplier: 1.0 },
    baby_shower: { enabled: false, multiplier: 1.0 },
    bridal_shower: { enabled: false, multiplier: 1.1 },
    fashion_show: { enabled: false, multiplier: 1.2 },
    festival: { enabled: false, multiplier: 1.2 },
    charity: { enabled: false, multiplier: 1.0 },
    networking: { enabled: false, multiplier: 1.0 },
    seminar: { enabled: false, multiplier: 1.0 },
    workshop: { enabled: false, multiplier: 1.0 },
    product_launch: { enabled: false, multiplier: 1.2 },
    award_ceremony: { enabled: false, multiplier: 1.3 },
    photoshoot: { enabled: false, multiplier: 1.0 },
    private_party: { enabled: false, multiplier: 1.1 },
    retirement: { enabled: false, multiplier: 1.0 },
    reunion: { enabled: false, multiplier: 1.0 },
    sports_event: { enabled: false, multiplier: 1.1 },
    cultural_event: { enabled: false, multiplier: 1.1 },
    religious_event: { enabled: false, multiplier: 1.0 },
    holiday_party: { enabled: false, multiplier: 1.1 },
    music_festival: { enabled: false, multiplier: 1.3 },
    gaming_event: { enabled: false, multiplier: 1.0 },
    vip_event: { enabled: false, multiplier: 1.5 },
    cocktail_party: { enabled: false, multiplier: 1.1 },
    dinner_party: { enabled: false, multiplier: 1.1 },
    other: { enabled: false, multiplier: 1.0 },
  };

  const DEFAULT_GUEST_TIER_PRICING = [];

  const [addForm, setAddForm] = useState({
    name: "",
    location: "",
    capacity: "",
    pricePerHour: "",
    description: "",
    eventType: "",
    isAvailable: true,
    images: "",

    eventTypePricing: DEFAULT_EVENT_TYPE_PRICING,

    guestTierPricing: DEFAULT_GUEST_TIER_PRICING,
  });

  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const handleAddChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleAddVenue = async (e) => {
    e.preventDefault();

    setAddError("");
    setAddLoading(true);

    try {
      const cleanedEventPricing = {};

      Object.entries(addForm.eventTypePricing).forEach(([key, value]) => {
        if (value.enabled) {
          cleanedEventPricing[key] = Number(value.multiplier);
        }
      });
      // 2. CLEAN guest tiers
      const cleanedGuestTiers = addForm.guestTierPricing.map((tier) => ({
        min: Number(tier.min),
        max: Number(tier.max),
        multiplier: Number(tier.multiplier),

        // ✅ AUTO FIX LABEL (IMPORTANT)
        label: tier.label?.trim() || `${tier.min}-${tier.max} guests`,
      }));

      // 3. FINAL PAYLOAD (NO SPREAD addForm)
      const payload = {
        name: addForm.name,
        location: addForm.location,
        capacity: Number(addForm.capacity),
        pricePerHour: Number(addForm.pricePerHour),
        description: addForm.description,
        eventType: addForm.eventType,
        isAvailable: addForm.isAvailable,

        images: addForm.images
          ? addForm.images
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],

        eventTypePricing: cleanedEventPricing,
        guestTierPricing: cleanedGuestTiers,
      };

      const res = await API.post("/venues", payload);

      setVenues((prev) => [res.data, ...prev]);
      setShowAddModal(false);

      // reset
      setAddForm({
        name: "",
        location: "",
        capacity: "",
        pricePerHour: "",
        description: "",
        eventType: "",
        isAvailable: true,
        images: "",

        eventTypePricing: DEFAULT_EVENT_TYPE_PRICING,
        guestTierPricing: DEFAULT_GUEST_TIER_PRICING,
      });
    } catch (err) {
      console.log(err.response?.data || err.message);

      setAddError(err.response?.data?.message || "Failed to add venue.");
    } finally {
      setAddLoading(false);
    }
  };
  // ── Accommodation state ──────────────────────────────────────────────────
  const [hotels, setHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [hotelTypeFilter, setHotelTypeFilter] = useState("all");
  const [hotelSearch, setHotelSearch] = useState("");
  const [hotelVisibleCount, setHotelVisibleCount] = useState(3);

  const HOTEL_TYPES = [
    { value: "all", label: "All", icon: "◆" },
    { value: "hotel", label: "Hotel", icon: "◆" },
    { value: "resort", label: "Resort", icon: "◆" },
    { value: "villa", label: "Villa", icon: "◆" },
    { value: "chalet", label: "Chalet", icon: "◆" },
    { value: "suite", label: "Suite", icon: "◆" },
    { value: "hostel", label: "Hostel", icon: "◆" },
  ];

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await API.get("/hotels");
        setHotels(res.data);
      } catch {
        setHotels([]);
      } finally {
        setHotelsLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const filteredHotels = hotels.filter((h) => {
    const matchType = hotelTypeFilter === "all" || h.type === hotelTypeFilter;
    const q = hotelSearch.trim().toLowerCase();
    const matchSearch =
      q === "" ||
      h.name?.toLowerCase().includes(q) ||
      h.location?.toLowerCase().includes(q) ||
      h.description?.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  // ── Add Hotel Modal state ────────────────────────────────────────────────
  const [showAddHotelModal, setShowAddHotelModal] = useState(false);
  const [confirmHotel, setConfirmHotel] = useState(null);
  const [addHotelForm, setAddHotelForm] = useState({
    name: "",
    location: "",
    type: "",
    stars: "3",
    pricePerNight: "",
    description: "",
    amenities: "",
    isAvailable: true,
    images: "",
  });
  const [addHotelError, setAddHotelError] = useState("");
  const [addHotelLoading, setAddHotelLoading] = useState(false);

  const handleAddHotelChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddHotelForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    setAddHotelError("");
    setAddHotelLoading(true);
    try {
      const payload = {
        ...addHotelForm,
        stars: Number(addHotelForm.stars),
        pricePerNight: Number(addHotelForm.pricePerNight),
        amenities: addHotelForm.amenities
          ? addHotelForm.amenities
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        images: addHotelForm.images
          ? addHotelForm.images
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };
      const res = await API.post("/hotels", payload);
      setHotels((prev) => [res.data, ...prev]);
      setShowAddHotelModal(false);
      setAddHotelForm({
        name: "",
        location: "",
        type: "",
        stars: "3",
        pricePerNight: "",
        description: "",
        amenities: "",
        isAvailable: true,
        images: "",
      });
    } catch (err) {
      setAddHotelError(err.response?.data?.message || "Failed to add hotel.");
    } finally {
      setAddHotelLoading(false);
    }
  };

  const handleDeleteHotel = async () => {
    if (!confirmHotel) return;
    try {
      await API.delete(`/hotels/${confirmHotel._id}`);
      setHotels((prev) => prev.filter((h) => h._id !== confirmHotel._id));
    } catch (err) {
      console.error("Failed to delete hotel", err);
    } finally {
      setConfirmHotel(null);
    }
  };

  const handleToggleHotelAvailability = async (hotel) => {
    try {
      await API.put(`/hotels/${hotel._id}`, {
        isAvailable: !hotel.isAvailable,
      });
      setHotels((prev) =>
        prev.map((h) =>
          h._id === hotel._id ? { ...h, isAvailable: !h.isAvailable } : h,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle hotel availability", err);
    }
  };

  return (
    <>
      <style>{style}</style>
      <div className="hm-root">
        {/* ── Top Bar ── */}
        <nav className={`hm-topbar${navVisible ? "" : " hidden"}`}>
          <a
            className="hm-logo"
            href="/"
            style={{ textDecoration: "none" }}
            translate="no"
          >
            <div className="hm-logo-mark" />
            <div className="hm-logo-text">
              Event<span>y</span>
            </div>
          </a>

          <button
            className={`hm-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`hm-nav${menuOpen ? " open" : ""}`}>
            <a
              href="#venues"
              className="hm-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Venues
            </a>
            <a
              href="#accommodation"
              className="hm-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Accommodation
            </a>
            <a
              href="services"
              className="hm-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="aboutus"
              className="hm-nav-link"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>

            <div className="hm-nav-sep" />

            <button
              className="hm-nav-btn"
              translate="no"
              onClick={() => {
                const newLang = lang === "en" ? "ar" : "en";
                setLang(newLang);
                triggerGoogleTranslate(newLang);
                setMenuOpen(false);
              }}
            >
              <span className="notranslate">{lang === "en" ? "AR" : "EN"}</span>
            </button>
            <button
              className="hm-nav-btn"
              translate="no"
              onClick={() => {
                const next = toggleTheme();
                setTheme(next);
              }}
            >
              <span className="notranslate">
                {theme === "dark" ? "☀" : "☽"}
              </span>
            </button>

            {isAdmin && (
              <>
                <div className="hm-nav-sep" />
                <button
                  className="hm-nav-btn-admin"
                  onClick={() => {
                    window.location.href = "/admin/admindashboard";
                    setMenuOpen(false);
                  }}
                  style={{ position: "relative" }}
                >
                  <div className="adm-diamond" />
                  <span>Admin Dashboard</span>
                  <PendingDot />
                </button>
              </>
            )}

            {isProvider && (
              <>
                <div className="hm-nav-sep" />
                <button
                  className="hm-nav-btn-admin"
                  onClick={() => {
                    window.location.href = "/provider";
                    setMenuOpen(false);
                  }}
                >
                  <div className="adm-diamond" />
                  <span>Provider Dashboard</span>
                </button>
              </>
            )}

            {canSeeReservations && (
              <>
                <div className="hm-nav-sep" />
                <button
                  className="hm-nav-btn"
                  onClick={() => {
                    window.location.href = "/my-reservations";
                    setMenuOpen(false);
                  }}
                >
                  <span>My Reservation</span>
                </button>
              </>
            )}

            {isLoggedIn && (
              <>
                <div className="hm-nav-sep" />
                <button
                  className="hm-nav-btn"
                  onClick={() => {
                    window.location.href = "/update-profile";
                    setMenuOpen(false);
                  }}
                >
                  <span>Profile</span>
                </button>
              </>
            )}

            <div className="hm-nav-sep" />
            <button
              className="hm-nav-btn"
              onClick={() => {
                handleAuthBtn();
                setMenuOpen(false);
              }}
            >
              <span>{isLoggedIn ? "Logout" : "Sign In"}</span>
            </button>
          </div>

          {menuOpen && (
            <div
              style={{ position: "fixed", inset: 0, zIndex: 48 }}
              onClick={() => setMenuOpen(false)}
            />
          )}
        </nav>

        {/* ── Hero ── */}
        <section className="hm-hero">
          <div className="hm-hero-left">
            <p className="hm-hero-eyebrow">Luxury Event Planning</p>
            <h1 className="hm-hero-title">
              Where every
              <br />
              moment becomes
              <br />
              <em>legend.</em>
            </h1>
            <p className="hm-hero-sub">
              The perfect event lives in the space between vision and reality.
              We close that gap — pairing discerning clients with iconic venues,
              seamless planning, and experiences so immersive they become the
              stories people tell for years.
            </p>
          </div>
          <div className="hm-hero-right">
            <div className="hm-hero-stat">
              <div className="hm-stat-n">100+</div>
              <div className="hm-stat-l">Premium Venues</div>
            </div>
            <div className="hm-hero-stat">
              <div className="hm-stat-n">{loading ? "—" : availableCount}</div>
              <div className="hm-stat-l">Available Now</div>
            </div>
            <div className="hm-hero-stat">
              <div className="hm-stat-n">98%</div>
              <div className="hm-stat-l">Satisfaction</div>
            </div>
          </div>
        </section>

        {/* ── Event Type Filter Bar ── */}
        {!loading && (
          <div className="hm-filter-wrap" id="venues">
            <p className="hm-filter-label">Filter by Event Type</p>
            <div className="hm-cfilter-wrap">
              <button
                className="hm-loc-arrow"
                disabled={
                  visibleTypes.findIndex((t) => t.value === activeFilter) === 0
                }
                onClick={() => {
                  const idx = visibleTypes.findIndex(
                    (t) => t.value === activeFilter,
                  );
                  if (idx > 0) {
                    setActive(visibleTypes[idx - 1].value);
                    setVisibleCount(12);
                  }
                }}
              >
                ←
              </button>

              <div className="hm-cfilter-chip">
                <span>
                  {visibleTypes.find((t) => t.value === activeFilter)?.icon ??
                    "◆"}
                </span>
                <span>
                  {visibleTypes.find((t) => t.value === activeFilter)?.label ??
                    "All Venues"}
                </span>
              </div>

              <button
                className="hm-loc-arrow"
                disabled={
                  visibleTypes.findIndex((t) => t.value === activeFilter) ===
                  visibleTypes.length - 1
                }
                onClick={() => {
                  const idx = visibleTypes.findIndex(
                    (t) => t.value === activeFilter,
                  );
                  if (idx < visibleTypes.length - 1) {
                    setActive(visibleTypes[idx + 1].value);
                    setVisibleCount(12);
                  }
                }}
              >
                →
              </button>

              <span className="hm-loc-pager">
                {visibleTypes.findIndex((t) => t.value === activeFilter) + 1} /{" "}
                {visibleTypes.length}
              </span>

              <button
                className="hm-cfilter-view-btn"
                onClick={() => {
                  setTypeDropdownOpen((o) => !o);
                  setAvailDropdownOpen(false);
                }}
              >
                <span>View All</span>
                <span style={{ fontSize: "10px", opacity: 0.6 }}>
                  {typeDropdownOpen ? "▲" : "▼"}
                </span>
              </button>

              {typeDropdownOpen && (
                <>
                  <div
                    style={{ position: "fixed", inset: 0, zIndex: 99 }}
                    onClick={() => setTypeDropdownOpen(false)}
                  />
                  <div className="hm-cfilter-dropdown">
                    {visibleTypes.map((t) => {
                      const count =
                        t.value === "all"
                          ? venues.length
                          : venues.filter((v) => v.eventType === t.value)
                              .length;
                      return (
                        <button
                          key={t.value}
                          className={`hm-cfilter-opt ${activeFilter === t.value ? "active" : ""}`}
                          onClick={() => {
                            setActive(t.value);
                            setVisibleCount(12);
                            setTypeDropdownOpen(false);
                          }}
                        >
                          <span>{t.icon}</span>
                          <span>{t.label}</span>
                          <span className="hm-cfilter-count-badge">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Location Filter Carousel ── */}
        {!loading && presentLocations.length > 2 && (
          <div className="hm-filter-wrap">
            <p className="hm-filter-label">Filter by Location</p>
            <div className="hm-loc-carousel">
              <button
                className="hm-loc-arrow"
                disabled={locationIndex === 0}
                onClick={() => {
                  const newIdx = locationIndex - 1;
                  setLocationIndex(newIdx);
                  setLocationFilter(presentLocations[newIdx]);
                  setVisibleCount(12);
                }}
              >
                ←
              </button>

              <div className="hm-loc-chip">
                <span className="hm-loc-chip-icon">{"◆"}</span>
                <span>
                  {presentLocations[locationIndex] === "all"
                    ? "All Locations"
                    : presentLocations[locationIndex]}
                </span>
              </div>

              <button
                className="hm-loc-arrow"
                disabled={locationIndex === presentLocations.length - 1}
                onClick={() => {
                  const newIdx = locationIndex + 1;
                  setLocationIndex(newIdx);
                  setLocationFilter(presentLocations[newIdx]);
                  setVisibleCount(12);
                }}
              >
                →
              </button>

              <span className="hm-loc-pager">
                {locationIndex + 1} / {presentLocations.length}
              </span>

              <div className="hm-loc-search">
                <span className="hm-loc-search-icon">⌕</span>
                <input
                  type="text"
                  placeholder="Search venues…"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(12);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {!loading && (
          <div className="hm-filter-wrap">
            <p className="hm-filter-label">Filter by Availability</p>
            {(() => {
              const availOpts = [
                { value: "all", label: "All", icon: "◆" },
                { value: "available", label: "Available", icon: "✓" },
                { value: "unavailable", label: "Unavailable", icon: "✕" },
              ];
              const activeAvailOpt = availOpts.find(
                (o) => o.value === availFilter,
              );
              return (
                <div className="hm-cfilter-wrap">
                  <button
                    className="hm-loc-arrow"
                    disabled={
                      availOpts.findIndex((o) => o.value === availFilter) === 0
                    }
                    onClick={() => {
                      const idx = availOpts.findIndex(
                        (o) => o.value === availFilter,
                      );
                      if (idx > 0) {
                        setAvailFilter(availOpts[idx - 1].value);
                        setVisibleCount(12);
                      }
                    }}
                  >
                    ←
                  </button>

                  <div className="hm-cfilter-chip">
                    <span>{activeAvailOpt?.icon}</span>
                    <span>{activeAvailOpt?.label}</span>
                  </div>

                  <button
                    className="hm-loc-arrow"
                    disabled={
                      availOpts.findIndex((o) => o.value === availFilter) ===
                      availOpts.length - 1
                    }
                    onClick={() => {
                      const idx = availOpts.findIndex(
                        (o) => o.value === availFilter,
                      );
                      if (idx < availOpts.length - 1) {
                        setAvailFilter(availOpts[idx + 1].value);
                        setVisibleCount(12);
                      }
                    }}
                  >
                    →
                  </button>

                  <span className="hm-loc-pager">
                    {availOpts.findIndex((o) => o.value === availFilter) + 1} /{" "}
                    {availOpts.length}
                  </span>

                  <button
                    className="hm-cfilter-view-btn"
                    onClick={() => {
                      setAvailDropdownOpen((o) => !o);
                      setTypeDropdownOpen(false);
                    }}
                  >
                    <span>View All</span>
                    <span style={{ fontSize: "10px", opacity: 0.6 }}>
                      {availDropdownOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {availDropdownOpen && (
                    <>
                      <div
                        style={{ position: "fixed", inset: 0, zIndex: 99 }}
                        onClick={() => setAvailDropdownOpen(false)}
                      />
                      <div className="hm-cfilter-dropdown">
                        {availOpts.map((opt) => {
                          const count =
                            opt.value === "all"
                              ? venues.length
                              : opt.value === "available"
                                ? venues.filter((v) => v.isAvailable).length
                                : venues.filter((v) => !v.isAvailable).length;
                          return (
                            <button
                              key={opt.value}
                              className={`hm-cfilter-opt ${availFilter === opt.value ? "active" : ""}`}
                              onClick={() => {
                                setAvailFilter(opt.value);
                                setVisibleCount(12);
                                setAvailDropdownOpen(false);
                              }}
                            >
                              <span>{opt.icon}</span>
                              <span>{opt.label}</span>
                              <span className="hm-cfilter-count-badge">
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        )}
        {/* ── Venues Section ── */}
        <section className="hm-section">
          <div className="hm-section-head">
            <div>
              <p className="hm-section-eyebrow">Curated Selection</p>
              <h2 className="hm-section-title">
                {activeFilter === "all"
                  ? "All Venues"
                  : `${typeIcon(activeFilter)} ${typeLabel(activeFilter)} Venues`}
              </h2>
            </div>
            <div
              style={{ display: "flex", alignItems: "flex-end", gap: "16px" }}
            >
              {isAdmin && (
                <button
                  className="hm-nav-btn-admin"
                  onClick={() => setShowAddModal(true)}
                >
                  <div className="adm-diamond" />
                  <span>Add Venue</span>
                </button>
              )}
              {!loading && (
                <p className="hm-section-count">
                  <strong>{filtered.length}</strong> venue
                  {filtered.length !== 1 ? "s" : ""} listed
                </p>
              )}
            </div>
          </div>

          <div className="hm-grid">
            {loading ? (
              [1, 2, 3].map((n) => <SkeletonCard key={n} />)
            ) : filtered.length === 0 ? (
              <div className="hm-empty">
                <div className="hm-empty-icon">◆</div>
                <div className="hm-empty-title">No venues found</div>
                <p className="hm-empty-sub">
                  Try a different category or check back soon.
                </p>
              </div>
            ) : (
              filtered.slice(0, visibleCount).map((venue) => (
                <div className="hm-card" key={venue._id}>
                  <div
                    className={`hm-card-ribbon ${venue.isAvailable ? "available" : "unavailable"}`}
                  >
                    {venue.isAvailable ? "Available" : "Unavailable"}
                  </div>

                  {venue.eventType && (
                    <div className="hm-card-badge">
                      <div className="hm-card-badge-dot" />
                      <span>
                        {typeIcon(venue.eventType)} {typeLabel(venue.eventType)}
                      </span>
                    </div>
                  )}

                  <div className="hm-card-img-wrap">
                    <img
                      src={
                        venue.images?.[0] ||
                        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80"
                      }
                      alt={venue.name}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80";
                      }}
                    />
                  </div>

                  <div className="hm-card-body">
                    <h3 className="hm-card-name">{venue.name}</h3>
                    <p className="hm-card-location">{venue.location}</p>
                    {venue.description && (
                      <p className="hm-card-desc">{venue.description}</p>
                    )}
                    <div className="hm-card-meta">
                      <div className="hm-card-meta-item">
                        <div className="hm-card-meta-label">Capacity</div>
                        <div className="hm-card-meta-value">
                          <span>{venue.capacity}</span> guests
                        </div>
                      </div>
                      <div className="hm-card-meta-item">
                        <div className="hm-card-meta-label">Price / Hour</div>
                        <div className="hm-card-meta-value">
                          <span>
                            ${((venue.pricePerHour || 0) * 10).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isLoggedIn ? (
                      <button
                        className="hm-card-btn"
                        disabled={!venue.isAvailable}
                        onClick={() => {
                          window.location.href = `/venue/${venue._id}`;
                        }}
                      >
                        <span>
                          {venue.isAvailable ? "Book Now" : "Unavailable"}
                        </span>
                      </button>
                    ) : (
                      <button
                        className="hm-card-btn"
                        onClick={() => {
                          window.location.href = "/login";
                        }}
                      >
                        <span>Sign In to Book</span>
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        className="hm-card-btn-toggle"
                        onClick={() => handleToggleAvailability(venue)}
                      >
                        <span>
                          {venue.isAvailable
                            ? "✖ Mark Unavailable"
                            : "✔ Mark Available"}
                        </span>
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        className="hm-card-btn-toggle"
                        style={{
                          borderColor: "rgba(192,80,74,0.35)",
                          color: "#E08080",
                          marginTop: "6px",
                        }}
                        onClick={() => setConfirmVenue(venue)}
                      >
                        <span>✕ Remove Venue</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {!loading && visibleCount < filtered.length && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "48px",
              }}
            >
              <button
                className="hm-nav-btn"
                onClick={() => setVisibleCount((c) => c + 4)}
                style={{ padding: "13px 48px", fontSize: "10px" }}
              >
                <span>
                  Show More — {filtered.length - visibleCount} remaining
                </span>
              </button>
            </div>
          )}
        </section>

        {/* ── Section Divider ── */}
        <div className="hm-section-divider">
          <div className="hm-section-divider-inner">
            <div className="hm-section-divider-diamond" />
            <span className="hm-section-divider-text">Accommodation</span>
            <div className="hm-section-divider-diamond" />
          </div>
        </div>

        {/* ── Hotel Type Filter ── */}
        {!hotelsLoading && (
          <div className="hm-filter-wrap" id="accommodation">
            <p className="hm-filter-label">Filter by Type</p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div className="hm-accom-tabs">
                {HOTEL_TYPES.filter(
                  (t) =>
                    t.value === "all" || hotels.some((h) => h.type === t.value),
                ).map((t) => (
                  <button
                    key={t.value}
                    className={`hm-accom-tab ${hotelTypeFilter === t.value ? "active" : ""}`}
                    onClick={() => {
                      setHotelTypeFilter(t.value);
                      setHotelVisibleCount(12);
                    }}
                  >
                    <span>
                      {t.icon} {t.label}
                    </span>
                  </button>
                ))}
              </div>
              <div className="hm-loc-search">
                <span className="hm-loc-search-icon">⌕</span>
                <input
                  type="text"
                  placeholder="Search hotels…"
                  value={hotelSearch}
                  onChange={(e) => {
                    setHotelSearch(e.target.value);
                    setHotelVisibleCount(12);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Accommodation Section ── */}
        <section className="hm-section">
          <div className="hm-section-head">
            <div>
              <p className="hm-section-eyebrow">Curated Stays</p>
              <h2 className="hm-section-title">
                {hotelTypeFilter === "all"
                  ? "All Accommodations"
                  : `${HOTEL_TYPES.find((t) => t.value === hotelTypeFilter)?.icon} ${HOTEL_TYPES.find((t) => t.value === hotelTypeFilter)?.label}s`}
              </h2>
            </div>
            <div
              style={{ display: "flex", alignItems: "flex-end", gap: "16px" }}
            >
              {isAdmin && (
                <button
                  className="hm-nav-btn-admin"
                  onClick={() => setShowAddHotelModal(true)}
                >
                  <div className="adm-diamond" />
                  <span>Add Hotel</span>
                </button>
              )}
              {!hotelsLoading && (
                <p className="hm-section-count">
                  <strong>{filteredHotels.length}</strong> propert
                  {filteredHotels.length !== 1 ? "ies" : "y"} listed
                </p>
              )}
            </div>
          </div>

          <div className="hm-grid">
            {hotelsLoading ? (
              [1, 2, 3].map((n) => <SkeletonCard key={n} />)
            ) : filteredHotels.length === 0 ? (
              <div className="hm-empty">
                <div className="hm-empty-icon">◆</div>
                <div className="hm-empty-title">No accommodations found</div>
                <p className="hm-empty-sub">
                  Try a different type or check back soon.
                </p>
              </div>
            ) : (
              filteredHotels.slice(0, hotelVisibleCount).map((hotel) => (
                <div className="hm-card" key={hotel._id}>
                  <div
                    className={`hm-card-ribbon ${hotel.isAvailable ? "available" : "unavailable"}`}
                  >
                    {hotel.isAvailable ? "Available" : "Unavailable"}
                  </div>

                  {hotel.type && (
                    <div className="hm-card-badge">
                      <div className="hm-card-badge-dot" />
                      <span>
                        {HOTEL_TYPES.find((t) => t.value === hotel.type)
                          ?.icon ?? "◆"}{" "}
                        {HOTEL_TYPES.find((t) => t.value === hotel.type)
                          ?.label ?? hotel.type}
                      </span>
                    </div>
                  )}

                  <div className="hm-card-img-wrap">
                    <img
                      src={
                        hotel.images?.[0] ||
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80"
                      }
                      alt={hotel.name}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80";
                      }}
                    />
                  </div>

                  <div className="hm-card-body">
                    <div className="hm-hotel-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          className={`hm-hotel-star ${s <= (hotel.stars || 0) ? "lit" : ""}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <h3 className="hm-card-name">{hotel.name}</h3>
                    <p className="hm-card-location">{hotel.location}</p>

                    {hotel.description && (
                      <p className="hm-card-desc">{hotel.description}</p>
                    )}

                    {hotel.amenities?.length > 0 && (
                      <div className="hm-hotel-amenities">
                        {hotel.amenities.slice(0, 4).map((a) => (
                          <span key={a} className="hm-hotel-pill">
                            {a}
                          </span>
                        ))}
                        {hotel.amenities.length > 4 && (
                          <span className="hm-hotel-pill">
                            +{hotel.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="hm-card-meta">
                      <div className="hm-card-meta-item">
                        <div className="hm-card-meta-label">Per Night</div>
                        <div className="hm-card-meta-value">
                          <span>
                            ${(hotel.pricePerNight || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="hm-card-meta-item">
                        <div className="hm-card-meta-label">Rating</div>
                        <div className="hm-card-meta-value">
                          <span>{hotel.stars || "—"}</span> / 5
                        </div>
                      </div>
                    </div>

                    {isLoggedIn ? (
                      <button
                        className="hm-card-btn"
                        disabled={!hotel.isAvailable}
                        onClick={() => {
                          window.location.href = `/hotel/${hotel._id}`;
                        }}
                      >
                        <span>
                          {hotel.isAvailable ? "Book Stay" : "Unavailable"}
                        </span>
                      </button>
                    ) : (
                      <button
                        className="hm-card-btn"
                        onClick={() => {
                          window.location.href = "/login";
                        }}
                      >
                        <span>Sign In to Book</span>
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        className="hm-card-btn-toggle"
                        onClick={() => handleToggleHotelAvailability(hotel)}
                      >
                        <span>
                          {hotel.isAvailable
                            ? "✖ Mark Unavailable"
                            : "✔ Mark Available"}
                        </span>
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        className="hm-card-btn-toggle"
                        style={{
                          borderColor: "rgba(192,80,74,0.35)",
                          color: "#E08080",
                          marginTop: "6px",
                        }}
                        onClick={() => setConfirmHotel(hotel)}
                      >
                        <span>✕ Remove Hotel</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {!hotelsLoading && hotelVisibleCount < filteredHotels.length && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "48px",
              }}
            >
              <button
                className="hm-nav-btn"
                onClick={() => setHotelVisibleCount((c) => c + 4)}
                style={{ padding: "13px 48px", fontSize: "10px" }}
              >
                <span>
                  Show More — {filteredHotels.length - hotelVisibleCount}{" "}
                  remaining
                </span>
              </button>
            </div>
          )}
        </section>

        {/* ── Footer ── */}
        <footer className="hm-footer">
          <p className="hm-footer-copy">
            © 2026 <span translate="no">Eventy</span> — All rights reserved.
          </p>
          <p className="hm-footer-copy" style={{ opacity: 0.5 }}>
            Luxury Event Planning Platform
          </p>
        </footer>

        {/* ── Confirm Delete Venue Modal ── */}
        {confirmVenue && (
          <div
            className="hm-modal-overlay"
            onClick={() => setConfirmVenue(null)}
          >
            <div
              className="hm-modal"
              style={{ maxWidth: "420px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hm-modal-header">
                <span className="hm-modal-title">Remove Venue</span>
                <button
                  className="hm-modal-close"
                  onClick={() => setConfirmVenue(null)}
                >
                  ✕
                </button>
              </div>
              <div className="hm-modal-body">
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 200,
                    color: "var(--cream)",
                    lineHeight: 1.7,
                    letterSpacing: "0.03em",
                  }}
                >
                  Are you sure you want to remove{" "}
                  <span
                    style={{
                      color: "var(--gold-light)",
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "16px",
                    }}
                  >
                    {confirmVenue.name}
                  </span>
                  ? This action cannot be undone.
                </p>
                <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                  <button
                    className="hm-modal-submit"
                    style={{
                      borderColor: "rgba(192,80,74,0.5)",
                      color: "#E08080",
                    }}
                    onClick={handleDeleteVenue}
                  >
                    <span>Yes, Remove</span>
                  </button>
                  <button
                    className="hm-modal-submit"
                    onClick={() => setConfirmVenue(null)}
                  >
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Add Venue Modal ── */}
        {showAddModal && (
          <div
            className="hm-modal-overlay"
            onClick={() => setShowAddModal(false)}
          >
            <div className="hm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="hm-modal-header">
                <span className="hm-modal-title">Add New Venue</span>
                <button
                  className="hm-modal-close"
                  onClick={() => setShowAddModal(false)}
                >
                  ✕
                </button>
              </div>
              <form className="hm-modal-body" onSubmit={handleAddVenue}>
                <div className="hm-field-row">
                  <div className="hm-field">
                    <label>Venue Name *</label>
                    <input
                      name="name"
                      value={addForm.name}
                      onChange={handleAddChange}
                      required
                      placeholder="Grand Ballroom"
                    />
                  </div>

                  <div className="hm-field">
                    <label>Location *</label>
                    <input
                      name="location"
                      value={addForm.location}
                      onChange={handleAddChange}
                      required
                      placeholder="Cairo, Egypt"
                    />
                  </div>
                </div>

                <div className="hm-field-row">
                  <div className="hm-field">
                    <label>Capacity *</label>
                    <input
                      name="capacity"
                      type="number"
                      min="1"
                      value={addForm.capacity}
                      onChange={handleAddChange}
                      required
                      placeholder="500"
                    />
                  </div>

                  <div className="hm-field">
                    <label>Price / Hour *</label>
                    <input
                      name="pricePerHour"
                      type="number"
                      min="0"
                      value={addForm.pricePerHour}
                      onChange={handleAddChange}
                      required
                      placeholder="200"
                    />
                  </div>
                </div>

                <div className="hm-field">
                  <label>Event Type *</label>

                  <select
                    name="eventType"
                    value={addForm.eventType}
                    onChange={handleAddChange}
                    required
                  >
                    <option value="">— Select type —</option>

                    {EVENT_TYPES.filter((t) => t.value !== "all").map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="hm-field">
                  <label>Description</label>

                  <textarea
                    name="description"
                    value={addForm.description}
                    onChange={handleAddChange}
                    placeholder="Describe the venue…"
                  />
                </div>

                <div className="hm-field">
                  <label>Image URLs (comma-separated)</label>

                  <input
                    name="images"
                    value={addForm.images}
                    onChange={handleAddChange}
                    placeholder="https://..., https://..."
                  />
                </div>

                {/* EVENT TYPE MULTIPLIERS */}

                <div className="hm-field">
                  <label>Supported Event Types</label>

                  <div className="hm-event-grid">
                    {Object.entries(addForm.eventTypePricing).map(
                      ([type, config]) => (
                        <div key={type} className="hm-event-card">
                          <label className="hm-event-check">
                            <input
                              type="checkbox"
                              checked={config.enabled}
                              onChange={(e) => {
                                setAddForm((prev) => ({
                                  ...prev,
                                  eventTypePricing: {
                                    ...prev.eventTypePricing,
                                    [type]: {
                                      ...config,
                                      enabled: e.target.checked,
                                    },
                                  },
                                }));
                              }}
                            />

                            <span>{type.replaceAll("_", " ")}</span>
                          </label>

                          <input
                            type="number"
                            step="0.1"
                            min="1"
                            disabled={!config.enabled}
                            value={config.multiplier}
                            onChange={(e) => {
                              setAddForm((prev) => ({
                                ...prev,
                                eventTypePricing: {
                                  ...prev.eventTypePricing,
                                  [type]: {
                                    ...config,
                                    multiplier: Number(e.target.value),
                                  },
                                },
                              }));
                            }}
                            className="hm-multiplier-input"
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* GUEST TIERS */}

                <div className="hm-field">
                  <div className="hm-tier-header">
                    <label>Guest Tier Pricing</label>

                    <button
                      type="button"
                      className="hm-add-tier-btn"
                      onClick={() => {
                        setAddForm((prev) => ({
                          ...prev,
                          guestTierPricing: [
                            ...prev.guestTierPricing,
                            {
                              min: "",
                              max: "",
                              multiplier: 1,
                              label: "",
                            },
                          ],
                        }));
                      }}
                    >
                      + Add Tier
                    </button>
                  </div>

                  <div className="hm-tier-list">
                    {addForm.guestTierPricing.map((tier, index) => (
                      <div key={index} className="hm-tier-card">
                        <div className="hm-tier-range">
                          <input
                            type="number"
                            placeholder="1"
                            value={tier.min}
                            onChange={(e) => {
                              const updated = [...addForm.guestTierPricing];
                              updated[index].min = e.target.value;

                              setAddForm((prev) => ({
                                ...prev,
                                guestTierPricing: updated,
                              }));
                            }}
                          />

                          <span>to</span>

                          <input
                            type="number"
                            placeholder="50"
                            value={tier.max}
                            onChange={(e) => {
                              const updated = [...addForm.guestTierPricing];
                              updated[index].max = e.target.value;

                              setAddForm((prev) => ({
                                ...prev,
                                guestTierPricing: updated,
                              }));
                            }}
                          />
                        </div>

                        <input
                          type="number"
                          step="0.1"
                          placeholder="1.2x"
                          value={tier.multiplier}
                          onChange={(e) => {
                            const updated = [...addForm.guestTierPricing];
                            updated[index].multiplier = e.target.value;

                            setAddForm((prev) => ({
                              ...prev,
                              guestTierPricing: updated,
                            }));
                          }}
                          className="hm-tier-multiplier"
                        />

                        <button
                          type="button"
                          className="hm-remove-tier"
                          onClick={() => {
                            const updated = addForm.guestTierPricing.filter(
                              (_, i) => i !== index,
                            );

                            setAddForm((prev) => ({
                              ...prev,
                              guestTierPricing: updated,
                            }));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className="hm-field"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <input
                    id="isAvailable"
                    name="isAvailable"
                    type="checkbox"
                    checked={addForm.isAvailable}
                    onChange={handleAddChange}
                    style={{
                      width: "16px",
                      height: "16px",
                      accentColor: "var(--gold)",
                      cursor: "pointer",
                    }}
                  />

                  <label
                    htmlFor="isAvailable"
                    style={{
                      cursor: "pointer",
                      fontSize: "12px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Available immediately
                  </label>
                </div>

                {addError && <div className="hm-modal-error">{addError}</div>}

                <button
                  className="hm-modal-submit"
                  type="submit"
                  disabled={addLoading}
                >
                  <span>{addLoading ? "Adding…" : "Add Venue"}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Confirm Delete Hotel Modal ── */}
        {confirmHotel && (
          <div
            className="hm-modal-overlay"
            onClick={() => setConfirmHotel(null)}
          >
            <div
              className="hm-modal"
              style={{ maxWidth: "420px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hm-modal-header">
                <span className="hm-modal-title">Remove Hotel</span>
                <button
                  className="hm-modal-close"
                  onClick={() => setConfirmHotel(null)}
                >
                  ✕
                </button>
              </div>
              <div className="hm-modal-body">
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 200,
                    color: "var(--cream)",
                    lineHeight: 1.7,
                    letterSpacing: "0.03em",
                  }}
                >
                  Are you sure you want to remove{" "}
                  <span
                    style={{
                      color: "var(--gold-light)",
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "16px",
                    }}
                  >
                    {confirmHotel.name}
                  </span>
                  ? This action cannot be undone.
                </p>
                <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                  <button
                    className="hm-modal-submit"
                    style={{
                      borderColor: "rgba(192,80,74,0.5)",
                      color: "#E08080",
                    }}
                    onClick={handleDeleteHotel}
                  >
                    <span>Yes, Remove</span>
                  </button>
                  <button
                    className="hm-modal-submit"
                    onClick={() => setConfirmHotel(null)}
                  >
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Add Hotel Modal ── */}
        {showAddHotelModal && (
          <div
            className="hm-modal-overlay"
            onClick={() => setShowAddHotelModal(false)}
          >
            <div className="hm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="hm-modal-header">
                <span className="hm-modal-title">Add New Hotel</span>
                <button
                  className="hm-modal-close"
                  onClick={() => setShowAddHotelModal(false)}
                >
                  ✕
                </button>
              </div>
              <form className="hm-modal-body" onSubmit={handleAddHotel}>
                <div className="hm-field-row">
                  <div className="hm-field">
                    <label>Hotel Name *</label>
                    <input
                      name="name"
                      value={addHotelForm.name}
                      onChange={handleAddHotelChange}
                      required
                      placeholder="The Grand Palace"
                    />
                  </div>
                  <div className="hm-field">
                    <label>Location *</label>
                    <input
                      name="location"
                      value={addHotelForm.location}
                      onChange={handleAddHotelChange}
                      required
                      placeholder="Cairo, Egypt"
                    />
                  </div>
                </div>
                <div className="hm-field-row">
                  <div className="hm-field">
                    <label>Type *</label>
                    <select
                      name="type"
                      value={addHotelForm.type}
                      onChange={handleAddHotelChange}
                      required
                    >
                      <option value="">— Select type —</option>
                      {HOTEL_TYPES.filter((t) => t.value !== "all").map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.icon} {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="hm-field">
                    <label>Star Rating *</label>
                    <select
                      name="stars"
                      value={addHotelForm.stars}
                      onChange={handleAddHotelChange}
                      required
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {"★".repeat(n)} ({n} star{n > 1 ? "s" : ""})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="hm-field">
                  <label>Price Per Night (USD) *</label>
                  <input
                    name="pricePerNight"
                    type="number"
                    min="0"
                    value={addHotelForm.pricePerNight}
                    onChange={handleAddHotelChange}
                    required
                    placeholder="350"
                  />
                </div>
                <div className="hm-field">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={addHotelForm.description}
                    onChange={handleAddHotelChange}
                    placeholder="Describe the property…"
                  />
                </div>
                <div className="hm-field">
                  <label>Amenities (comma-separated)</label>
                  <input
                    name="amenities"
                    value={addHotelForm.amenities}
                    onChange={handleAddHotelChange}
                    placeholder="Pool, Spa, Free WiFi, Gym"
                  />
                </div>
                <div className="hm-field">
                  <label>Image URLs (comma-separated)</label>
                  <input
                    name="images"
                    value={addHotelForm.images}
                    onChange={handleAddHotelChange}
                    placeholder="https://…, https://…"
                  />
                </div>
                <div
                  className="hm-field"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <input
                    id="hotelIsAvailable"
                    name="isAvailable"
                    type="checkbox"
                    checked={addHotelForm.isAvailable}
                    onChange={handleAddHotelChange}
                    style={{
                      width: "16px",
                      height: "16px",
                      accentColor: "var(--gold)",
                      cursor: "pointer",
                    }}
                  />
                  <label
                    htmlFor="hotelIsAvailable"
                    style={{
                      cursor: "pointer",
                      fontSize: "12px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Available immediately
                  </label>
                </div>
                {addHotelError && (
                  <div className="hm-modal-error">{addHotelError}</div>
                )}
                <button
                  className="hm-modal-submit"
                  type="submit"
                  disabled={addHotelLoading}
                >
                  <span>{addHotelLoading ? "Adding…" : "Add Hotel"}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <AiBot />
    </>
  );
}

export default Home;
