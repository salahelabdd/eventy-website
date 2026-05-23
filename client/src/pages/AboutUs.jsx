import { useEffect, useState } from "react";

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

    .ab-root {
        font-family: 'Raleway', sans-serif;
        min-height: 100vh;
        color: var(--cream);
        padding-top: 73px;
        background-color: #0A0A0A;
        background-image:
            repeating-linear-gradient(135deg, transparent, transparent 28px, rgba(200,169,81,0.03) 28px, rgba(200,169,81,0.03) 29px),
            repeating-linear-gradient(45deg, transparent, transparent 28px, rgba(200,169,81,0.018) 28px, rgba(200,169,81,0.018) 29px),
            radial-gradient(ellipse at 15% 0%, rgba(200,169,81,0.07) 0%, transparent 50%),
            radial-gradient(ellipse at 85% 100%, rgba(13,27,42,0.6) 0%, transparent 50%);
    }
    .ab-root::before {
        content: '';
        position: fixed; inset: 0; pointer-events: none; z-index: 0;
        background: radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%);
    }

    /* ── Topbar (same as Home) ── */
    .hm-topbar {
        background: rgba(17,17,24,0.94); backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--border);
        padding: 22px 56px;
        display: flex; align-items: center; justify-content: space-between;
        position: fixed; top: 0; left: 0; right: 0; z-index: 50;
        transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
    }
    .hm-topbar.hidden { transform: translateY(-100%); }
    .hm-topbar::after {
        content: '';
        position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, var(--gold), transparent);
    }
    .hm-logo { display: flex; align-items: center; gap: 14px; }
    .hm-logo-mark { width: 32px; height: 32px; border: 1.5px solid var(--gold); transform: rotate(45deg); flex-shrink: 0; }
    .hm-logo-text { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase; }
    .hm-logo-text span { color: var(--gold); }
    .hm-nav { display: flex; gap: 32px; align-items: center; }
    .hm-nav-link { font-size: 10px; font-weight: 300; letter-spacing: 0.28em; text-transform: uppercase; color: var(--muted); text-decoration: none; transition: color 0.2s; }
    .hm-nav-link:hover, .hm-nav-link.active { color: var(--gold); }
    .hm-nav-sep { width: 1px; height: 20px; background: var(--border); }
    .hm-nav-btn {
        font-family: 'Cinzel', serif; font-size: 9px; font-weight: 400;
        letter-spacing: 0.28em; text-transform: uppercase;
        padding: 9px 22px; border: 1px solid var(--border);
        background: transparent; color: var(--gold);
        cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
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
        letter-spacing: 0.28em; text-transform: uppercase;
        padding: 9px 22px; border: 1px solid var(--gold);
        background: var(--gold-dim); color: var(--gold-light);
        cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
        display: flex; align-items: center; gap: 8px;
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
    .adm-diamond { position: relative; z-index: 1; width: 6px; height: 6px; border: 1px solid currentColor; transform: rotate(45deg); flex-shrink: 0; opacity: 0.75; transition: opacity 0.3s; }
    .hm-nav-btn-admin:hover .adm-diamond { opacity: 1; }

    /* ── Hero ── */
    .ab-hero {
        position: relative; z-index: 1;
        padding: 100px 56px 80px;
        max-width: 1200px; margin: 0 auto;
        display: flex; align-items: flex-end; justify-content: space-between;
        gap: 48px;
    }
    .ab-hero-left { flex: 1; }
    .ab-eyebrow {
        font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
        color: var(--gold); opacity: 0.8; margin-bottom: 20px;
        display: flex; align-items: center; gap: 14px;
    }
    .ab-eyebrow::before { content: ''; display: block; width: 32px; height: 1px; background: var(--gold); opacity: 0.6; }
    .ab-hero-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(52px, 6vw, 86px); font-weight: 300;
        color: var(--cream); line-height: 1.0; margin-bottom: 28px;
    }
    .ab-hero-title em { color: var(--gold-light); font-style: italic; }
    .ab-hero-sub {
        font-size: 13px; font-weight: 200; color: var(--muted);
        line-height: 1.9; max-width: 480px; letter-spacing: 0.04em;
    }

    /* ── Decorative divider ── */
    .ab-divider {
        position: relative; z-index: 1;
        max-width: 1200px; margin: 0 auto;
        padding: 0 56px;
        display: flex; align-items: center; gap: 20px;
        margin-bottom: 80px;
    }
    .ab-divider-line { flex: 1; height: 1px; background: var(--border); }
    .ab-divider-diamond {
        width: 10px; height: 10px; border: 1px solid var(--gold);
        transform: rotate(45deg); flex-shrink: 0;
    }
    .ab-divider-text {
        font-family: 'Cinzel', serif; font-size: 8px; font-weight: 400;
        letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.6;
    }

    /* ── Story Section ── */
    .ab-story {
        position: relative; z-index: 1;
        max-width: 1200px; margin: 0 auto;
        padding: 0 56px 80px;
        display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
    }
    .ab-story-img-wrap {
        position: relative;
    }
    .ab-story-img-wrap::before {
        content: '';
        position: absolute; inset: -16px 16px 16px -16px;
        border: 1px solid var(--border); z-index: 0;
    }
    .ab-story-img-wrap::after {
        content: '';
        position: absolute; inset: 0;
        background: linear-gradient(135deg, transparent 60%, rgba(200,169,81,0.08) 100%);
        z-index: 2; pointer-events: none;
    }
    .ab-story-img {
        width: 100%; aspect-ratio: 4/3; object-fit: cover;
        display: block; position: relative; z-index: 1;
        filter: brightness(0.85) saturate(0.9);
    }
    .ab-story-img-caption {
        position: absolute; bottom: 0; left: 0; right: 0; z-index: 3;
        padding: 16px 20px;
        background: linear-gradient(to top, rgba(10,10,10,0.85), transparent);
        font-size: 10px; font-weight: 200; color: var(--gold); letter-spacing: 0.18em;
        text-transform: uppercase;
    }
    .ab-story-content {}
    .ab-story-section-eyebrow {
        font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
        color: var(--gold); opacity: 0.8; margin-bottom: 16px;
    }
    .ab-story-title {
        font-family: 'Cormorant Garamond', serif; font-size: 40px; font-weight: 300;
        color: var(--cream); line-height: 1.1; margin-bottom: 28px;
    }
    .ab-story-title em { color: var(--gold-light); font-style: italic; }
    .ab-story-text {
        font-size: 13px; font-weight: 200; color: var(--muted);
        line-height: 1.9; letter-spacing: 0.03em; margin-bottom: 18px;
    }
    .ab-story-quote {
        border-left: 2px solid var(--gold);
        padding: 16px 24px; margin: 28px 0;
        background: var(--gold-dim);
        font-family: 'Cormorant Garamond', serif;
        font-size: 18px; font-style: italic; font-weight: 300;
        color: var(--gold-light); line-height: 1.6;
    }

    /* ── Stats Row ── */
    .ab-stats {
        position: relative; z-index: 1;
        max-width: 1200px; margin: 0 auto;
        padding: 0 56px 80px;
    }
    .ab-stats-grid {
        display: grid; grid-template-columns: repeat(4, 1fr);
        border: 1px solid var(--border);
        background: rgba(17,17,24,0.7); backdrop-filter: blur(8px);
    }
    .ab-stat {
        padding: 36px 28px; text-align: center;
        border-right: 1px solid var(--border);
        position: relative; overflow: hidden;
        transition: background 0.3s;
    }
    .ab-stat:last-child { border-right: none; }
    .ab-stat:hover { background: var(--gold-dim); }
    .ab-stat::after {
        content: '';
        position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
        width: 0; height: 2px; background: var(--gold);
        transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
    }
    .ab-stat:hover::after { width: 60%; }
    .ab-stat-n {
        font-family: 'Cormorant Garamond', serif; font-size: 48px; font-weight: 300;
        color: var(--gold-light); line-height: 1;
    }
    .ab-stat-l {
        font-size: 9px; font-weight: 200; letter-spacing: 0.2em; text-transform: uppercase;
        color: var(--muted); margin-top: 8px;
    }

    /* ── Values ── */
    .ab-values {
        position: relative; z-index: 1;
        max-width: 1200px; margin: 0 auto;
        padding: 0 56px 80px;
    }
    .ab-section-head {
        margin-bottom: 56px; padding-bottom: 24px;
        border-bottom: 1px solid var(--border);
        position: relative;
    }
    .ab-section-head::after {
        content: ''; position: absolute; bottom: -1px; left: 0; width: 80px; height: 1px;
        background: var(--gold);
    }
    .ab-section-eyebrow {
        font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
        color: var(--gold); opacity: 0.8; margin-bottom: 10px;
    }
    .ab-section-title {
        font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 300;
        color: var(--cream); line-height: 1.1;
    }
    .ab-values-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
    }
    .ab-value-card {
        background: rgba(17,17,24,0.80); backdrop-filter: blur(8px);
        border: 1px solid var(--border);
        padding: 36px 32px;
        position: relative; overflow: hidden;
        transition: border-color 0.35s, box-shadow 0.35s, transform 0.35s;
    }
    .ab-value-card:hover {
        border-color: rgba(200,169,81,0.45);
        box-shadow: 0 12px 48px rgba(200,169,81,0.09);
        transform: translateY(-4px);
    }
    .ab-value-card::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 2px;
        background: linear-gradient(90deg, transparent, var(--gold), transparent);
        opacity: 0; transition: opacity 0.35s;
    }
    .ab-value-card:hover::before { opacity: 1; }
    .ab-value-icon {
        font-size: 28px; margin-bottom: 20px; display: block;
        filter: drop-shadow(0 0 8px rgba(200,169,81,0.3));
    }
    .ab-value-title {
        font-family: 'Cinzel', serif; font-size: 12px; font-weight: 600;
        letter-spacing: 0.22em; text-transform: uppercase;
        color: var(--gold-light); margin-bottom: 14px;
    }
    .ab-value-text {
        font-size: 12px; font-weight: 200; color: var(--muted);
        line-height: 1.8; letter-spacing: 0.03em;
    }

    /* ── Team ── */
    .ab-team {
        position: relative; z-index: 1;
        max-width: 1200px; margin: 0 auto;
        padding: 0 56px 80px;
    }
    .ab-team-grid {
        display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px;
    }
    .ab-team-card {
        background: rgba(17,17,24,0.80); border: 1px solid var(--border);
        overflow: hidden;
        transition: border-color 0.35s, transform 0.35s;
    }
    .ab-team-card:hover {
        border-color: rgba(200,169,81,0.45);
        transform: translateY(-4px);
    }
    .ab-team-card-top {
        height: 4px;
        background: linear-gradient(90deg, transparent, var(--gold), transparent);
        opacity: 0; transition: opacity 0.35s;
    }
    .ab-team-card:hover .ab-team-card-top { opacity: 1; }
    .ab-team-body { padding: 20px 22px 24px; }
    .ab-team-name {
        font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 400;
        color: var(--cream); margin-bottom: 4px;
    }
    .ab-team-role {
        font-family: 'Cinzel', serif; font-size: 8px; font-weight: 400;
        letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold);
        opacity: 0.8; margin-bottom: 12px;
    }
    .ab-team-bio {
        font-size: 11px; font-weight: 200; color: var(--muted);
        line-height: 1.75; letter-spacing: 0.03em;
    }

    /* ── CTA ── */
    .ab-cta {
        position: relative; z-index: 1;
        max-width: 1200px; margin: 0 auto;
        padding: 0 56px 100px;
    }
    .ab-cta-inner {
        background: rgba(17,17,24,0.80); border: 1px solid var(--border);
        padding: 64px;
        text-align: center; position: relative; overflow: hidden;
    }
    .ab-cta-inner::before {
        content: '';
        position: absolute; inset: 0;
        background: radial-gradient(ellipse at 50% 0%, rgba(200,169,81,0.07) 0%, transparent 65%);
        pointer-events: none;
    }
    .ab-cta-inner::after {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, var(--gold), transparent);
    }
    .ab-cta-eyebrow {
        font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
        color: var(--gold); opacity: 0.8; margin-bottom: 16px;
    }
    .ab-cta-title {
        font-family: 'Cormorant Garamond', serif; font-size: 48px; font-weight: 300;
        color: var(--cream); line-height: 1.1; margin-bottom: 20px;
    }
    .ab-cta-title em { color: var(--gold-light); font-style: italic; }
    .ab-cta-text {
        font-size: 13px; font-weight: 200; color: var(--muted);
        line-height: 1.9; max-width: 520px; margin: 0 auto 36px;
    }
    .ab-cta-btn {
        font-family: 'Cinzel', serif; font-size: 10px; font-weight: 400;
        letter-spacing: 0.32em; text-transform: uppercase;
        padding: 16px 48px;
        border: 1px solid var(--gold-line); background: transparent; color: var(--gold);
        cursor: pointer; position: relative; overflow: hidden; transition: color 0.35s;
        display: inline-block; text-decoration: none;
    }
    .ab-cta-btn::before {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(90deg, var(--gold), #A8843A);
        transform: scaleX(0); transform-origin: left;
        transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); z-index: 0;
    }
    .ab-cta-btn:hover::before { transform: scaleX(1); }
    .ab-cta-btn:hover { color: var(--black); }
    .ab-cta-btn span { position: relative; z-index: 1; }

    /* ── Footer ── */
    .hm-footer {
        position: relative; z-index: 1;
        border-top: 1px solid var(--border);
        padding: 32px 56px;
        display: flex; align-items: center; justify-content: space-between;
        background: rgba(17,17,24,0.6); backdrop-filter: blur(8px);
    }
    .hm-footer-copy { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }
    .hm-footer-copy span { color: var(--gold); }

    /* ══════════════════════════════════════════════
   MOBILE / TABLET RESPONSIVE
══════════════════════════════════════════════ */

/* ───────────────── TABLET ───────────────── */

@media (max-width: 1024px) {

    .ab-hero,
    .ab-story,
    .ab-stats,
    .ab-values,
    .ab-team,
    .ab-cta {
        padding-left: 40px;
        padding-right: 40px;
    }

    .ab-story {
        grid-template-columns: 1fr;
        gap: 56px;
    }

    .ab-values-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .ab-team-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .ab-cta-title {
        font-size: 42px;
    }
}

/* ───────────────── MOBILE ───────────────── */

@media (max-width: 768px) {

    /* ── General ── */

    .ab-root {
        overflow-x: hidden;
    }

    .ab-hero,
    .ab-story,
    .ab-stats,
    .ab-values,
    .ab-team,
    .ab-cta {
        padding-left: 20px;
        padding-right: 20px;
    }

    .ab-divider {
        padding: 0 20px;
        margin-bottom: 56px;
    }

    /* ── Navbar ── */

    .hm-topbar {
        padding: 18px 20px;
    }

    .hm-logo-text {
        font-size: 15px;
        letter-spacing: 0.18em;
    }

    .hm-logo-mark {
        width: 24px;
        height: 24px;
    }

    .hm-nav {
        display: none;
    }

    /* ── Hero ── */

    .ab-hero {
        padding-top: 72px;
        padding-bottom: 56px;
        align-items: flex-start;
    }

    .ab-eyebrow {
        font-size: 8px;
        letter-spacing: 0.32em;
        margin-bottom: 16px;
    }

    .ab-eyebrow::before {
        width: 22px;
    }

    .ab-hero-title {
        font-size: clamp(42px, 14vw, 64px);
        line-height: 0.95;
        margin-bottom: 22px;
    }

    .ab-hero-sub {
        font-size: 12px;
        line-height: 1.8;
        max-width: 100%;
    }

    /* ── Divider ── */

    .ab-divider-text {
        font-size: 7px;
        letter-spacing: 0.22em;
        text-align: center;
    }

    /* ── Story ── */

    .ab-story {
        grid-template-columns: 1fr;
        gap: 44px;
        padding-bottom: 64px;
    }

    .ab-story-img-wrap::before {
        inset: -10px 10px 10px -10px;
    }

    .ab-story-title {
        font-size: 34px;
        margin-bottom: 22px;
    }

    .ab-story-text {
        font-size: 12px;
        line-height: 1.9;
    }

    .ab-story-quote {
        font-size: 16px;
        padding: 14px 18px;
        margin: 24px 0;
    }

    /* ── Stats ── */

    .ab-stats {
        padding-bottom: 64px;
    }

    .ab-stats-grid {
        grid-template-columns: 1fr 1fr;
    }

    .ab-stat {
        padding: 28px 18px;
    }

    .ab-stat:nth-child(2) {
        border-right: none;
    }

    .ab-stat:nth-child(1),
    .ab-stat:nth-child(2) {
        border-bottom: 1px solid var(--border);
    }

    .ab-stat-n {
        font-size: 38px;
    }

    .ab-stat-l {
        font-size: 8px;
    }

    /* ── Sections ── */

    .ab-section-head {
        margin-bottom: 40px;
        padding-bottom: 18px;
    }

    .ab-section-title {
        font-size: 32px;
    }

    /* ── Values ── */

    .ab-values {
        padding-bottom: 64px;
    }

    .ab-values-grid {
        grid-template-columns: 1fr;
        gap: 18px;
    }

    .ab-value-card {
        padding: 28px 24px;
    }

    .ab-value-title {
        font-size: 11px;
        line-height: 1.5;
    }

    .ab-value-text {
        font-size: 11px;
    }

    /* ── Team ── */

    .ab-team {
        padding-bottom: 64px;
    }

    .ab-team-grid {
        grid-template-columns: 1fr;
        gap: 18px;
    }

    .ab-team-body {
        padding: 18px 18px 22px;
    }

    .ab-team-name {
        font-size: 20px;
    }

    .ab-team-bio {
        font-size: 11px;
    }

    /* ── CTA ── */

    .ab-cta {
        padding-bottom: 72px;
    }

    .ab-cta-inner {
        padding: 42px 22px;
    }

    .ab-cta-title {
        font-size: 38px;
        margin-bottom: 18px;
    }

    .ab-cta-text {
        font-size: 12px;
        margin-bottom: 28px;
    }

    .ab-cta-btn {
        width: 100%;
        padding: 15px 20px;
        font-size: 9px;
        text-align: center;
    }

    /* ── Footer ── */

    .hm-footer {
        padding: 22px 20px;
        flex-direction: column;
        gap: 10px;
        text-align: center;
    }

    .hm-footer-copy {
        font-size: 10px;
        line-height: 1.7;
    }
}

/* ───────────────── SMALL MOBILE ───────────────── */

@media (max-width: 480px) {

    .ab-hero-title {
        font-size: 36px;
    }

    .ab-story-title,
    .ab-section-title,
    .ab-cta-title {
        font-size: 28px;
    }

    .ab-stat-n {
        font-size: 32px;
    }

    .ab-stat {
        padding: 24px 14px;
    }

    .ab-value-card,
    .ab-team-card {
        border-radius: 0;
    }

    .ab-cta-inner {
        padding: 36px 18px;
    }

    .ab-divider {
        gap: 10px;
    }

    .ab-divider-line {
        opacity: 0.5;
    }
}
   
`;

const TEAM = [
  {
    name: "Salah Elabd",
    role: "Co-Founder",
    bio: "Salah brings a sharp eye for design and a passion for creating seamless event experiences that leave lasting impressions.",
  },
  {
    name: "Mahmoud Magdy",
    role: "Co-Founder",
    bio: "Mahmoud drives the platform's technical vision, ensuring every interaction — from discovery to booking — is effortless and elegant.",
  },
  {
    name: "Mohab Allam",
    role: "Co-Founder",
    bio: "Mohab leads client relations and venue partnerships, building the trusted network that powers Eventy's curated collection.",
  },
  {
    name: "Zeiad Magdy",
    role: "Co-Founder",
    bio: "Zeiad shapes the product strategy and user experience, translating bold ideas into intuitive, beautiful interfaces.",
  },
  {
    name: "Nagham Waleed",
    role: "Co-Founder",
    bio: "Nagham oversees operations and quality assurance, making sure every event facilitated through Eventy meets the highest standard.",
  },
];

const VALUES = [
  {
    icon: "◆",
    title: "Uncompromising Quality",
    text: "Every venue in our collection is personally vetted. We hold our spaces to the highest standards of aesthetics, service, and technical excellence — no exceptions.",
  },
  {
    icon: "✦",
    title: "Artful Curation",
    text: "We don't list venues. We compose collections. Each space is chosen for its ability to transform an occasion into an unforgettable chapter of your story.",
  },
  {
    icon: "◇",
    title: "White-Glove Service",
    text: "From the first inquiry to the final farewell, our team is your dedicated partner — anticipating needs, solving challenges, and elevating every detail.",
  },
  {
    icon: "✧",
    title: "Trust & Transparency",
    text: "Honest pricing, accurate availability, and clear communication. Our clients trust us because we've never given them a reason not to.",
  },
  {
    icon: "❖",
    title: "Creative Vision",
    text: "We believe events are art. Our curation team works with you to ensure every space you choose is a canvas perfectly matched to your creative ambition.",
  },
  {
    icon: "✶",
    title: "Legacy Events",
    text: "We measure our success not in bookings, but in stories that are still told years later. We are in the business of making legends.",
  },
];

function AboutUs() {
  const [navVisible, setNavVisible] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch {
        setUser(null);
      }
    }
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setNavVisible(currentY < lastY || currentY < 10);
      lastY = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!localStorage.getItem("token");

  const handleAuthBtn = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <>
      <style>{style}</style>
      <div className="ab-root">
        {/* ── Topbar ── */}
        <nav className={`hm-topbar${navVisible ? "" : " hidden"}`}>
          <a className="hm-logo" href="/" style={{ textDecoration: "none" }}>
            <div className="hm-logo-mark" />
            <div className="hm-logo-text" translate="no">
              Event<span>y</span>
            </div>
          </a>
          <div className="hm-nav">
            <a href="/" className="hm-nav-link">
              Venues
            </a>
            <a href="/services" className="hm-nav-link">
              Services
            </a>
            <a href="/aboutus" className="hm-nav-link active">
              About
            </a>
            {isAdmin && (
              <>
                <div className="hm-nav-sep" />
                <button
                  className="hm-nav-btn-admin"
                  onClick={() =>
                    (window.location.href = "/admin/admindashboard")
                  }
                >
                  <div className="adm-diamond" />
                  <span>Admin Dashboard</span>
                </button>
              </>
            )}
            {isLoggedIn && (
              <>
                <div className="hm-nav-sep" />

                <div className="hm-nav-sep" />
                <button
                  className="hm-nav-btn"
                  onClick={() => (window.location.href = "/update-profile")}
                >
                  <span>Profile</span>
                </button>
              </>
            )}
            <div className="hm-nav-sep" />
            <button className="hm-nav-btn" onClick={handleAuthBtn}>
              <span>{isLoggedIn ? "Logout" : "Sign In"}</span>
            </button>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="ab-hero">
          <div className="ab-hero-left">
            <p className="ab-eyebrow">Our Story</p>
            <h1 className="ab-hero-title">
              Born from a<br />
              passion for
              <br />
              <em>the remarkable.</em>
            </h1>
            <p className="ab-hero-sub">
              Eventy was founded on a single conviction: that every celebration,
              conference, and gathering deserves a venue as exceptional as the
              occasion itself. We exist to make that possible.
            </p>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="ab-divider">
          <div className="ab-divider-line" />
          <div className="ab-divider-diamond" />
          <span className="ab-divider-text">Est. 2026 · Cairo, Egypt</span>
          <div className="ab-divider-diamond" />
          <div className="ab-divider-line" />
        </div>

        {/* ── Story ── */}
        <section className="ab-story">
          <div className="ab-story-img-wrap">
            <img
              className="ab-story-img"
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
              alt="Eventy founding story"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80";
              }}
            />
            <div className="ab-story-img-caption">◆ Where it all began</div>
          </div>
          <div className="ab-story-content">
            <p className="ab-story-section-eyebrow">Our Foundation</p>
            <h2 className="ab-story-title">
              Crafting <em>legends</em>,<br />
              one event at a time.
            </h2>
            <p className="ab-story-text">
              What started as a boutique consultancy helping Cairo's most
              discerning families find extraordinary venues has grown into the
              region's premier luxury event platform. From intimate anniversary
              dinners to grand corporate galas, we've been the trusted partner
              behind thousands of unforgettable occasions.
            </p>
            <blockquote className="ab-story-quote">
              "The venue is not merely a backdrop — it is the first impression,
              the atmosphere, and the memory itself."
            </blockquote>
            <p className="ab-story-text">
              Today, our curated network spans hundreds of premium venues across
              Egypt and beyond, each personally vetted by our team for its
              unique ability to elevate an event from ordinary to extraordinary.
              We don't just connect clients to spaces — we help them find the
              perfect stage for their story.
            </p>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="ab-stats">
          <div className="ab-stats-grid">
            {[
              { n: "500+", l: "Premium Venues" },
              { n: "12K+", l: "Events Hosted" },
              { n: "98%", l: "Client Satisfaction" },
              { n: "2026", l: "Year Established" },
            ].map((s) => (
              <div className="ab-stat" key={s.l}>
                <div className="ab-stat-n">{s.n}</div>
                <div className="ab-stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Values ── */}
        <section className="ab-values">
          <div className="ab-section-head">
            <p className="ab-section-eyebrow">What Drives Us</p>
            <h2 className="ab-section-title">Our Core Values</h2>
          </div>
          <div className="ab-values-grid">
            {VALUES.map((v) => (
              <div className="ab-value-card" key={v.title}>
                <span className="ab-value-icon">{v.icon}</span>
                <div className="ab-value-title">{v.title}</div>
                <p className="ab-value-text">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Team ── */}
        <section className="ab-team">
          <div className="ab-section-head">
            <p className="ab-section-eyebrow">The People Behind Eventy</p>
            <h2 className="ab-section-title">Meet the Team</h2>
          </div>
          <div className="ab-team-grid">
            {TEAM.map((m) => (
              <div className="ab-team-card" key={m.name}>
                <div className="ab-team-card-top" />
                <div className="ab-team-body">
                  <div className="ab-team-name">{m.name}</div>
                  <div className="ab-team-role">{m.role}</div>
                  <p className="ab-team-bio">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="ab-cta">
          <div className="ab-cta-inner">
            <p className="ab-cta-eyebrow">Begin Your Journey</p>
            <h2 className="ab-cta-title">
              Ready to create
              <br />
              your <em>legend?</em>
            </h2>
            <p className="ab-cta-text">
              Browse our curated collection of extraordinary venues, or speak
              with our team about a bespoke event planning experience tailored
              entirely to your vision.
            </p>
            <a href="/" className="ab-cta-btn">
              <span>Explore Venues</span>
            </a>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="hm-footer">
          <p className="hm-footer-copy">
            © 2026 <span>Eventy</span> — All rights reserved.
          </p>
          <p className="hm-footer-copy" style={{ opacity: 0.5 }}>
            Luxury Event Planning Platform
          </p>
        </footer>
      </div>
    </>
  );
}

export default AboutUs;
