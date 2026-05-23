import { useEffect, useRef, useState } from "react";
import API from "../api/axios";

const style = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,500&family=Cinzel:wght@400;600&family=Raleway:wght@200;300;400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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
    }

    .sv-root {
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
    .sv-root::before {
        content: '';
        position: fixed; inset: 0; pointer-events: none; z-index: 0;
        background: radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%);
    }

    /* ── Topbar ── */
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
    .sv-hero {
        position: relative; z-index: 1;
        padding: 100px 56px 80px;
        max-width: 1200px; margin: 0 auto;
    }
    .sv-eyebrow {
        font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
        color: var(--gold); opacity: 0.8; margin-bottom: 20px;
        display: flex; align-items: center; gap: 14px;
    }
    .sv-eyebrow::before { content: ''; display: block; width: 32px; height: 1px; background: var(--gold); opacity: 0.6; }
    .sv-hero-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(52px, 6vw, 86px); font-weight: 300;
        color: var(--cream); line-height: 1.0; margin-bottom: 28px;
    }
    .sv-hero-title em { color: var(--gold-light); font-style: italic; }
    .sv-hero-sub {
        font-size: 13px; font-weight: 200; color: var(--muted);
        line-height: 1.9; max-width: 560px; letter-spacing: 0.04em;
    }

    /* ── Section Common ── */
    .sv-section {
        position: relative; z-index: 1;
        max-width: 1200px; margin: 0 auto;
        padding: 0 56px 80px;
    }
    .sv-section-head {
        margin-bottom: 48px; padding-bottom: 24px;
        border-bottom: 1px solid var(--border); position: relative;
    }
    .sv-section-head::after {
        content: ''; position: absolute; bottom: -1px; left: 0; width: 80px; height: 1px;
        background: var(--gold);
    }
    .sv-section-eyebrow {
        font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
        color: var(--gold); opacity: 0.8; margin-bottom: 10px;
    }
    .sv-section-title {
        font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 300;
        color: var(--cream); line-height: 1.1;
    }

    /* ── Primary Services Grid ── */
    .sv-primary-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px;
        background: var(--border);
    }
    .sv-primary-card {
        background: #0A0A0A; padding: 48px 36px;
        position: relative; overflow: hidden;
        transition: background 0.35s;
        cursor: default;
    }
    .sv-primary-card:hover { background: rgba(17,17,24,0.95); }
    .sv-primary-card::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 3px;
        background: linear-gradient(90deg, transparent, var(--gold), transparent);
        opacity: 0; transition: opacity 0.35s;
    }
    .sv-primary-card:hover::before { opacity: 1; }
    .sv-primary-card::after {
        content: '';
        position: absolute; inset: 0;
        background: radial-gradient(ellipse at 50% 0%, rgba(200,169,81,0.05) 0%, transparent 65%);
        opacity: 0; transition: opacity 0.35s; pointer-events: none;
    }
    .sv-primary-card:hover::after { opacity: 1; }
    .sv-pc-number {
        font-family: 'Cormorant Garamond', serif; font-size: 72px; font-weight: 300;
        color: var(--gold); opacity: 0.08; line-height: 1;
        position: absolute; top: 16px; right: 24px;
        transition: opacity 0.35s;
    }
    .sv-primary-card:hover .sv-pc-number { opacity: 0.14; }
    .sv-pc-icon {
        font-size: 32px; margin-bottom: 20px; display: block;
        filter: drop-shadow(0 0 8px rgba(200,169,81,0.25));
    }
    .sv-pc-title {
        font-family: 'Cinzel', serif; font-size: 13px; font-weight: 600;
        letter-spacing: 0.22em; text-transform: uppercase;
        color: var(--gold-light); margin-bottom: 16px;
    }
    .sv-pc-text {
        font-size: 12px; font-weight: 200; color: var(--muted);
        line-height: 1.85; letter-spacing: 0.03em; margin-bottom: 24px;
    }
    .sv-pc-features { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .sv-pc-features li {
        font-size: 11px; font-weight: 200; color: var(--muted);
        letter-spacing: 0.04em;
        display: flex; align-items: center; gap: 10px;
    }
    .sv-pc-features li::before {
        content: '◆'; font-size: 5px; color: var(--gold); opacity: 0.7; flex-shrink: 0;
    }

    /* ── Packages ── */
    .sv-packages-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
    }
    .sv-pkg {
        background: rgba(17,17,24,0.80); border: 1px solid var(--border);
        overflow: hidden; position: relative;
        transition: border-color 0.35s, transform 0.35s, box-shadow 0.35s;
    }
    .sv-pkg:hover {
        border-color: rgba(200,169,81,0.45);
        transform: translateY(-4px);
        box-shadow: 0 12px 48px rgba(200,169,81,0.09);
    }
    .sv-pkg.featured {
        border-color: var(--gold);
        box-shadow: 0 0 40px rgba(200,169,81,0.12);
    }
    .sv-pkg-badge {
        position: absolute; top: 20px; right: 20px;
        font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.25em;
        text-transform: uppercase; color: var(--black);
        background: var(--gold); padding: 4px 10px;
    }
    .sv-pkg-header { padding: 36px 32px 24px; border-bottom: 1px solid var(--border); }
    .sv-pkg-tier {
        font-family: 'Cinzel', serif; font-size: 9px; font-weight: 400;
        letter-spacing: 0.38em; text-transform: uppercase;
        color: var(--gold); opacity: 0.8; margin-bottom: 12px;
    }
    .sv-pkg-name {
        font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 300;
        color: var(--cream); margin-bottom: 8px; line-height: 1.1;
    }
    .sv-pkg-tagline {
        font-size: 12px; font-weight: 200; color: var(--muted); letter-spacing: 0.03em;
    }
    .sv-pkg-body { padding: 28px 32px 36px; }
    .sv-pkg-features { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; }
    .sv-pkg-features li {
        font-size: 12px; font-weight: 200; color: var(--muted);
        display: flex; align-items: flex-start; gap: 10px; line-height: 1.5;
    }
    .sv-pkg-features li .check { color: var(--gold); font-size: 11px; flex-shrink: 0; margin-top: 2px; }
    .sv-pkg-features li.dim { opacity: 0.45; }
    .sv-pkg-features li.dim .check { color: var(--muted); }
    .sv-pkg-cta {
        width: 100%; padding: 14px;
        background: transparent; border: 1px solid var(--border);
        color: var(--gold);
        font-family: 'Cinzel', serif; font-size: 9px; font-weight: 400;
        letter-spacing: 0.32em; text-transform: uppercase;
        cursor: pointer; position: relative; overflow: hidden; transition: color 0.35s;
    }
    .sv-pkg-cta::before {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(90deg, var(--gold), #A8843A);
        transform: scaleX(0); transform-origin: left;
        transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); z-index: 0;
    }
    .sv-pkg-cta:hover::before { transform: scaleX(1); }
    .sv-pkg-cta:hover { color: var(--black); }
    .sv-pkg-cta span { position: relative; z-index: 1; }
    .sv-pkg.featured .sv-pkg-cta {
        border-color: var(--gold);
        background: var(--gold-dim);
    }

    /* ── How It Works ── */
    .sv-process {
        position: relative; z-index: 1;
        max-width: 1200px; margin: 0 auto;
        padding: 0 56px 80px;
    }
    .sv-process-steps {
        display: grid; grid-template-columns: repeat(4, 1fr);
        gap: 0;
        position: relative;
    }
    .sv-process-steps::before {
        content: '';
        position: absolute; top: 32px; left: 10%; right: 10%; height: 1px;
        background: linear-gradient(90deg, transparent, var(--gold-line), var(--gold-line), transparent);
        z-index: 0;
    }
    .sv-step { text-align: center; padding: 0 20px 0; position: relative; z-index: 1; }
    .sv-step-circle {
        width: 64px; height: 64px; margin: 0 auto 24px;
        border: 1px solid var(--gold);
        background: #0A0A0A;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.3s, box-shadow 0.3s;
    }
    .sv-step:hover .sv-step-circle {
        background: var(--gold-dim);
        box-shadow: 0 0 24px rgba(200,169,81,0.2);
    }
    .sv-step-n {
        font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 300;
        color: var(--gold);
    }
    .sv-step-title {
        font-family: 'Cinzel', serif; font-size: 10px; font-weight: 600;
        letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold-light);
        margin-bottom: 12px;
    }
    .sv-step-text {
        font-size: 12px; font-weight: 200; color: var(--muted);
        line-height: 1.8; letter-spacing: 0.03em;
    }

    /* ── Testimonials ── */
    .sv-testimonials {
        position: relative; z-index: 1;
        max-width: 1200px; margin: 0 auto;
        padding: 0 56px 80px;
    }
    .sv-testi-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
    }
    .sv-testi-card {
        background: rgba(17,17,24,0.80); border: 1px solid var(--border);
        padding: 36px 32px;
        position: relative; overflow: hidden;
        transition: border-color 0.35s, transform 0.35s;
    }
    .sv-testi-card:hover { border-color: rgba(200,169,81,0.35); transform: translateY(-3px); }
    .sv-testi-quote-mark {
        font-family: 'Cormorant Garamond', serif; font-size: 80px; font-weight: 300;
        color: var(--gold); opacity: 0.15; line-height: 0.7;
        margin-bottom: 16px; display: block;
    }
    .sv-testi-text {
        font-family: 'Cormorant Garamond', serif; font-size: 16px; font-style: italic;
        font-weight: 300; color: var(--cream); line-height: 1.7;
        margin-bottom: 24px; letter-spacing: 0.02em;
    }
    .sv-testi-author { display: flex; align-items: center; gap: 14px; }
    .sv-testi-name {
        font-family: 'Cinzel', serif; font-size: 9px; font-weight: 600;
        letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold-light);
    }
    .sv-testi-event {
        font-size: 10px; font-weight: 200; color: var(--muted);
        letter-spacing: 0.06em; margin-top: 3px;
    }

    /* ── Services Grid ── */
    .sv-services-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
    }
    .sv-service-card {
        background: rgba(17,17,24,0.80); border: 1px solid var(--border);
        overflow: hidden; position: relative;
        transition: border-color 0.35s, transform 0.35s, box-shadow 0.35s;
        display: flex; flex-direction: column;
    }
    .sv-service-card::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 2px;
        background: linear-gradient(90deg, transparent, var(--gold), transparent);
        opacity: 0; transition: opacity 0.35s;
    }
    .sv-service-card:hover::before { opacity: 1; }
    .sv-service-card:hover {
        border-color: rgba(200,169,81,0.45);
        transform: translateY(-4px);
        box-shadow: 0 12px 48px rgba(200,169,81,0.09);
    }
    .sv-service-img-wrap {
        width: 100%; height: 180px; overflow: hidden; flex-shrink: 0;
    }
    .sv-service-img {
        width: 100%; height: 100%; object-fit: cover;
        transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
        filter: brightness(0.85) saturate(0.9);
    }
    .sv-service-card:hover .sv-service-img { transform: scale(1.04); }
    .sv-service-body {
        padding: 24px 26px 28px; display: flex; flex-direction: column; flex: 1;
    }
    .sv-service-cat {
        font-size: 9px; letter-spacing: 0.38em; text-transform: uppercase;
        color: var(--gold); opacity: 0.8; margin-bottom: 8px;
    }
    .sv-service-name {
        font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400;
        color: var(--cream); margin-bottom: 6px; line-height: 1.2;
    }
    .sv-service-price {
        font-family: 'Cinzel', serif; font-size: 11px; font-weight: 400;
        letter-spacing: 0.12em; color: var(--gold-light);
        margin-bottom: 12px;
    }
    .sv-service-desc {
        font-size: 12px; font-weight: 200; color: var(--muted);
        line-height: 1.8; letter-spacing: 0.03em; flex: 1;
    }
    @media (max-width: 900px) {
        .sv-services-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
        .sv-services-grid { grid-template-columns: 1fr; }
    }

    /* ── Category Tabs ── */
    .sv-cat-tabs {
        display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 36px;
    }
    .sv-cat-tab {
        font-family: 'Cinzel', serif; font-size: 8px; font-weight: 400;
        letter-spacing: 0.28em; text-transform: uppercase;
        padding: 8px 18px; border: 1px solid var(--border);
        background: transparent; color: var(--muted);
        cursor: pointer; position: relative; overflow: hidden;
        transition: color 0.25s, border-color 0.25s;
    }
    .sv-cat-tab::before {
        content: ''; position: absolute; inset: 0;
        background: var(--gold-dim);
        transform: scaleX(0); transform-origin: left;
        transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); z-index: 0;
    }
    .sv-cat-tab:hover::before, .sv-cat-tab.active::before { transform: scaleX(1); }
    .sv-cat-tab:hover, .sv-cat-tab.active { color: var(--gold); border-color: var(--gold-line); }
    .sv-cat-tab span { position: relative; z-index: 1; }

    /* ── Search Bar ── */
    .sv-search-wrap {
        position: relative; margin-bottom: 28px;
    }
    .sv-search-input {
        width: 100%; padding: 13px 44px 13px 18px;
        background: rgba(255,255,255,0.03); border: 1px solid var(--border);
        color: var(--cream);
        font-family: 'Raleway', sans-serif; font-size: 13px; font-weight: 200;
        letter-spacing: 0.04em; outline: none;
        transition: border-color 0.25s, background 0.25s;
    }
    .sv-search-input::placeholder { color: var(--muted); }
    .sv-search-input:focus { border-color: var(--gold-line); background: rgba(200,169,81,0.04); }
    .sv-search-icon {
        position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
        color: var(--muted); font-size: 15px; pointer-events: none;
        transition: color 0.25s;
    }
    .sv-search-wrap:focus-within .sv-search-icon { color: var(--gold); }
    .sv-search-clear {
        position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
        background: transparent; border: none; color: var(--muted);
        font-size: 15px; cursor: pointer; line-height: 1; padding: 0;
        transition: color 0.2s;
    }
    .sv-search-clear:hover { color: var(--gold); }
    .sv-search-count {
        font-size: 10px; font-weight: 200; color: var(--muted);
        letter-spacing: 0.08em; margin-bottom: 20px; margin-top: -16px;
    }
    .sv-search-count span { color: var(--gold-light); }
    @media (max-width: 768px) {
        .sv-search-input { font-size: 16px; padding: 12px 40px 12px 14px; }
        .sv-search-count { font-size: 9px; margin-bottom: 14px; }
    }

    /* ── Available Services Carousel ── */
    .sv-manage {
        position: relative; z-index: 1;
        max-width: 1200px; margin: 0 auto;
        padding: 0 56px 80px;
    }
    .sv-manage-actions { display: flex; gap: 8px; }
    .sv-manage-btn {
        flex: 1; padding: 10px;
        background: transparent; border: 1px solid var(--border);
        color: var(--gold);
        font-family: 'Cinzel', serif; font-size: 8px; font-weight: 400;
        letter-spacing: 0.22em; text-transform: uppercase;
        cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
    }
    .sv-manage-btn::before {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(90deg, var(--gold), #A8843A);
        transform: scaleX(0); transform-origin: left;
        transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
    }
    .sv-manage-btn:hover::before { transform: scaleX(1); }
    .sv-manage-btn:hover { color: var(--black); }
    .sv-manage-btn span { position: relative; z-index: 1; }
    .sv-manage-btn.danger { color: #E08080; border-color: rgba(192,80,74,0.35); }
    .sv-manage-btn.danger::before { background: linear-gradient(90deg, #c0504a, #a03030); }

    /* ── Available Services Carousel ── */
    .sv-carousel-wrap {
        position: relative;
    }
    .sv-carousel-track-outer {
        overflow: hidden;
        width: 100%;
    }
    .sv-carousel-track {
        display: flex;
        gap: 24px;
        transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
        will-change: transform;
    }
    .sv-carousel-card {
        flex: 0 0 calc((100% - 48px) / 3);
        min-width: 0;
        background: rgba(17,17,24,0.80); border: 1px solid var(--border);
        overflow: hidden; transition: border-color 0.3s, transform 0.3s;
        position: relative;
    }
    .sv-carousel-card::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 2px;
        background: linear-gradient(90deg, transparent, var(--gold), transparent);
        opacity: 0; transition: opacity 0.35s;
    }
    .sv-carousel-card:hover::before { opacity: 1; }
    .sv-carousel-card:hover { border-color: rgba(200,169,81,0.4); transform: translateY(-3px); }
    .sv-carousel-body { padding: 20px 22px 24px; }
    .sv-carousel-img-wrap {
        width: 100%; height: 160px; overflow: hidden; flex-shrink: 0;
    }
    .sv-carousel-img {
        width: 100%; height: 100%; object-fit: cover;
        transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
        filter: brightness(0.85) saturate(0.9);
    }
    .sv-carousel-card:hover .sv-carousel-img { transform: scale(1.04); }
    .sv-carousel-name {
        font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400;
        color: var(--cream); margin-bottom: 6px;
    }
    .sv-carousel-cat {
        font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
        color: var(--gold); margin-bottom: 6px; opacity: 0.75;
    }
    .sv-carousel-price {
        font-family: 'Cinzel', serif; font-size: 10px; font-weight: 400;
        letter-spacing: 0.12em; color: var(--gold-light); margin-bottom: 10px;
    }
    .sv-carousel-desc {
        font-size: 11px; font-weight: 200; color: var(--muted);
        line-height: 1.75;
    }
    .sv-carousel-controls {
        display: flex; align-items: center; justify-content: center;
        gap: 16px; margin-top: 36px;
    }
    .sv-carousel-btn {
        width: 44px; height: 44px;
        background: transparent; border: 1px solid var(--border);
        color: var(--gold); font-size: 18px; line-height: 1;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: border-color 0.25s, background 0.25s, color 0.25s;
    }
    .sv-carousel-btn:hover:not(:disabled) {
        border-color: var(--gold); background: var(--gold-dim);
    }
    .sv-carousel-btn:disabled { opacity: 0.25; cursor: not-allowed; }
    .sv-carousel-dots { display: flex; gap: 8px; align-items: center; }
    .sv-carousel-dot {
        width: 6px; height: 6px; border: 1px solid var(--gold-line);
        transform: rotate(45deg); background: transparent;
        transition: background 0.25s, border-color 0.25s; cursor: pointer;
        padding: 0;
    }
    .sv-carousel-dot.active { background: var(--gold); border-color: var(--gold); }
    @media (max-width: 900px) {
        .sv-carousel-card { flex: 0 0 calc((100% - 24px) / 2); }
    }
    @media (max-width: 600px) {
        .sv-carousel-card { flex: 0 0 100%; }
    }

    /* ── Modal ── */
    .hm-modal-overlay {
        position: fixed; inset: 0; z-index: 200;
        background: rgba(0,0,0,0.75); backdrop-filter: blur(6px);
        display: flex; align-items: center; justify-content: center; padding: 24px;
    }
    .hm-modal {
        background: #111118; border: 1px solid var(--border);
        width: 100%; max-width: 560px; max-height: 90vh;
        overflow-y: auto; position: relative;
        box-shadow: 0 24px 80px rgba(0,0,0,0.6);
    }
    .hm-modal-header {
        padding: 28px 32px 20px; border-bottom: 1px solid var(--border);
        display: flex; align-items: center; justify-content: space-between; position: relative;
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
    .hm-field label { font-size: 9px; font-weight: 300; letter-spacing: 0.35em; text-transform: uppercase; color: var(--gold); opacity: 0.8; }
    .hm-field input, .hm-field select, .hm-field textarea {
        background: rgba(255,255,255,0.03); border: 1px solid var(--border);
        color: var(--cream); padding: 10px 14px;
        font-family: 'Raleway', sans-serif; font-size: 13px; font-weight: 200;
        letter-spacing: 0.04em; outline: none; transition: border-color 0.25s; width: 100%;
    }
    .hm-field input:focus, .hm-field select:focus, .hm-field textarea:focus { border-color: var(--gold-line); }
    .hm-field select option { background: #111118; color: var(--cream); }
    .hm-field textarea { resize: vertical; min-height: 80px; }
    .hm-modal-error { font-size: 11px; color: #E08080; letter-spacing: 0.04em; padding: 10px 14px; border: 1px solid rgba(192,80,74,0.3); background: rgba(192,80,74,0.07); }
    .hm-modal-submit {
        width: 100%; padding: 14px;
        background: transparent; border: 1px solid var(--gold-line); color: var(--gold);
        font-family: 'Cinzel', serif; font-size: 10px; font-weight: 400;
        letter-spacing: 0.32em; text-transform: uppercase;
        cursor: pointer; position: relative; overflow: hidden; transition: color 0.35s; margin-top: 4px;
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

    /* ── Skeleton ── */
    .sv-skeleton {
        background: rgba(17,17,24,0.80); border: 1px solid var(--border); overflow: hidden;
    }
    .sv-skeleton-img {
        height: 160px;
        background: linear-gradient(90deg, rgba(200,169,81,0.04) 25%, rgba(200,169,81,0.08) 50%, rgba(200,169,81,0.04) 75%);
        background-size: 400% 100%; animation: shimmer 1.6s infinite;
    }
    .sv-skeleton-body { padding: 20px 22px; }
    .sv-skeleton-line {
        height: 12px;
        background: linear-gradient(90deg, rgba(200,169,81,0.04) 25%, rgba(200,169,81,0.08) 50%, rgba(200,169,81,0.04) 75%);
        background-size: 400% 100%; animation: shimmer 1.6s infinite; margin-bottom: 10px;
    }
    .sv-skeleton-line.wide  { width: 65%; }
    .sv-skeleton-line.short { width: 40%; }
    .sv-skeleton-line.full  { width: 100%; }
    @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }

    /* ── Star Rating ── */
    .sv-star-row { display: flex; gap: 6px; align-items: center; }
    .sv-star {
        font-size: 20px; cursor: pointer; color: var(--border);
        transition: color 0.2s, transform 0.15s;
        background: none; border: none; padding: 0; line-height: 1;
    }
    .sv-star.filled { color: var(--gold); }
    .sv-star:hover { transform: scale(1.2); }

    /* ── Review Add Button ── */
    .sv-review-add-btn {
        font-family: 'Cinzel', serif; font-size: 9px; font-weight: 400;
        letter-spacing: 0.28em; text-transform: uppercase;
        padding: 10px 24px; border: 1px solid var(--gold-line);
        background: transparent; color: var(--gold);
        cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
        margin-top: 32px; display: inline-flex; align-items: center; gap: 8px;
    }
    .sv-review-add-btn::before {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(90deg, var(--gold), #A8843A);
        transform: scaleX(0); transform-origin: left;
        transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
    }
    .sv-review-add-btn:hover::before { transform: scaleX(1); }
    .sv-review-add-btn:hover { color: var(--black); }
    .sv-review-add-btn span { position: relative; z-index: 1; }

    /* ── Testi Stars ── */
    .sv-testi-stars { display: flex; gap: 3px; margin-bottom: 14px; }
    .sv-testi-star { font-size: 12px; color: var(--gold); }
    .sv-testi-star.empty { color: var(--border); }

    /* ── Empty reviews ── */
    .sv-testi-empty {
        grid-column: 1 / -1; text-align: center; padding: 48px 0;
        color: var(--muted); font-size: 13px; font-weight: 200; letter-spacing: 0.04em;
    }

    /* ── Review carousel controls ── */
    .sv-review-controls {
        display: flex; align-items: center; justify-content: center;
        gap: 16px; margin-top: 32px;
    }
    .sv-review-btn {
        width: 44px; height: 44px;
        background: transparent; border: 1px solid var(--border);
        color: var(--gold); font-size: 18px; line-height: 1;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: border-color 0.25s, background 0.25s;
    }
    .sv-review-btn:hover:not(:disabled) { border-color: var(--gold); background: var(--gold-dim); }
    .sv-review-btn:disabled { opacity: 0.25; cursor: not-allowed; }
    .sv-review-dots { display: flex; gap: 8px; align-items: center; }
    .sv-review-dot {
        width: 6px; height: 6px; border: 1px solid var(--gold-line);
        transform: rotate(45deg); background: transparent;
        transition: background 0.25s, border-color 0.25s; cursor: pointer; padding: 0;
    }
    .sv-review-dot.active { background: var(--gold); border-color: var(--gold); }

    /* ── Admin delete review btn ── */
    .sv-review-delete-btn {
        position: absolute; top: 12px; right: 12px;
        background: transparent; border: 1px solid rgba(192,80,74,0.35);
        color: #E08080; width: 28px; height: 28px;
        cursor: pointer; font-size: 12px; line-height: 1;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.2s, border-color 0.2s; z-index: 2;
    }
    .sv-review-delete-btn:hover { background: rgba(192,80,74,0.15); border-color: rgba(192,80,74,0.6); }

    /* ── Footer ── */
    .hm-footer {
        position: relative; z-index: 1;
        border-top: 1px solid var(--border); padding: 32px 56px;
        display: flex; align-items: center; justify-content: space-between;
        background: rgba(17,17,24,0.6); backdrop-filter: blur(8px);
    }
    .hm-footer-copy { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }
    .hm-footer-copy span { color: var(--gold); }

    /* ══════════════════════════════════════════════
       MOBILE — 768px breakpoint (complete overhaul)
    ══════════════════════════════════════════════ */
    @media (max-width: 768px) {

        /* ── Prevent ALL horizontal overflow ── */
        .sv-root {
            overflow-x: hidden;
            width: 100%;
            padding-top: 57px;
        }
        .sv-hero, .sv-process, .sv-testimonials, .sv-manage {
            overflow-x: hidden;
        }

        /* Topbar */
        .hm-topbar { padding: 14px 16px; }
        .hm-logo-mark { width: 22px; height: 22px; }
        .hm-logo-text { font-size: 14px; letter-spacing: 0.18em; }
        .hm-nav { display: none; }

        /* Hero */
        .sv-hero { padding: 36px 16px 40px; }
        .sv-hero-title {
            font-size: clamp(32px, 9vw, 46px);
            line-height: 1.08;
            margin-bottom: 16px;
        }
        .sv-hero-sub { font-size: 12px; line-height: 1.8; }
        .sv-eyebrow { font-size: 8px; margin-bottom: 14px; }

        /* ── How It Works — strict 2×2 grid ── */
        .sv-process { padding: 0 16px 44px; }
        .sv-process-steps {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px 16px;
        }
        .sv-process-steps::before { display: none; }
        .sv-step {
            padding: 0;
            text-align: center;
            word-break: break-word;
            overflow: hidden;
        }
        .sv-step-circle {
            width: 44px; height: 44px;
            margin: 0 auto 12px;
        }
        .sv-step-n { font-size: 18px; }
        .sv-step-title {
            font-size: 8px;
            letter-spacing: 0.15em;
            margin-bottom: 6px;
        }
        .sv-step-text {
            font-size: 10px;
            line-height: 1.7;
            color: var(--muted);
        }

        /* Section heads */
        .sv-section-head {
            margin-bottom: 22px;
            padding-bottom: 14px;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 14px;
        }
        .sv-section-title { font-size: 24px; }
        .sv-section-eyebrow { font-size: 8px; margin-bottom: 4px; }

        /* ── Testimonials — compact single column ── */
        .sv-testimonials { padding: 0 16px 44px; }
        .sv-testi-grid {
            grid-template-columns: 1fr;
            gap: 12px;
        }
        .sv-testi-card {
            padding: 18px 16px;
        }
        .sv-testi-quote-mark {
            font-size: 44px;
            margin-bottom: 6px;
        }
        .sv-testi-stars { margin-bottom: 8px; }
        .sv-testi-star { font-size: 11px; }
        .sv-testi-text {
            font-size: 13px;
            line-height: 1.6;
            margin-bottom: 14px;
        }
        .sv-testi-name { font-size: 8px; }
        .sv-testi-event { font-size: 9px; }
        .sv-review-controls { margin-top: 18px; gap: 10px; }
        .sv-review-btn { width: 40px; height: 40px; font-size: 18px; }
        .sv-review-add-btn {
            display: block;
            width: 100%;
            text-align: center;
            margin-top: 20px;
            padding: 13px 16px;
            font-size: 8px;
            letter-spacing: 0.22em;
        }

        /* ── Services carousel — compact single card ── */
        .sv-manage { padding: 0 16px 44px; }
        .sv-manage .hm-nav-btn-admin {
            width: 100%;
            justify-content: center;
            padding: 11px 16px;
            font-size: 8px;
        }

        /* Category tabs — horizontal scroll */
        .sv-cat-tabs {
            flex-wrap: nowrap;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            gap: 6px;
            margin-bottom: 20px;
            padding-bottom: 2px;
            scrollbar-width: none;
        }
        .sv-cat-tabs::-webkit-scrollbar { display: none; }
        .sv-cat-tab {
            white-space: nowrap;
            flex-shrink: 0;
            padding: 8px 14px;
            font-size: 7px;
        }

        /* Carousel — full-width single card */
        .sv-carousel-card { flex: 0 0 100% !important; }
        .sv-carousel-img-wrap { height: 160px; }
        .sv-carousel-body { padding: 14px 14px 16px; }
        .sv-carousel-name { font-size: 18px; margin-bottom: 4px; }
        .sv-carousel-cat { font-size: 7px; margin-bottom: 4px; }
        .sv-carousel-price { font-size: 9px; margin-bottom: 6px; }
        .sv-carousel-desc { font-size: 11px; line-height: 1.65; }

        /* Admin edit/delete — side by side (they fit on one line now) */
        .sv-manage-actions {
            flex-direction: row;
            gap: 8px;
            margin-top: 12px;
        }
        .sv-manage-btn {
            flex: 1;
            padding: 10px 6px;
            font-size: 7px;
            letter-spacing: 0.15em;
        }

        /* Carousel controls */
        .sv-carousel-controls { margin-top: 20px; gap: 10px; }
        .sv-carousel-btn { width: 44px; height: 44px; font-size: 20px; }

        /* Modal — slides up from bottom */
        .hm-modal-overlay { padding: 0; align-items: flex-end; }
        .hm-modal {
            max-width: 100%;
            max-height: 90vh;
            border-radius: 0;
            border-left: none;
            border-right: none;
            border-bottom: none;
        }
        .hm-modal-header { padding: 18px 16px 14px; }
        .hm-modal-title { font-size: 11px; letter-spacing: 0.16em; }
        .hm-modal-body { padding: 16px 16px 24px; gap: 14px; }
        .hm-field-row { grid-template-columns: 1fr; gap: 14px; }
        .hm-field input,
        .hm-field select,
        .hm-field textarea {
            font-size: 16px; /* prevent iOS zoom */
            padding: 11px 12px;
        }
        .hm-field label { font-size: 8px; letter-spacing: 0.28em; }
        .hm-field textarea { min-height: 90px; }
        .hm-modal-submit { padding: 13px; font-size: 8px; letter-spacing: 0.26em; }

        /* Star picker */
        .sv-star { font-size: 26px; }
        .sv-star-row { gap: 6px; }

        /* Name toggle */
        .sv-name-toggle-row { flex-direction: row !important; gap: 8px !important; }
        .sv-name-toggle-btn { padding: 11px 10px !important; font-size: 8px !important; }

        /* Footer */
        .hm-footer {
            padding: 20px 16px;
            flex-direction: column;
            gap: 6px;
            text-align: center;
        }
        .hm-footer-copy { font-size: 10px; }

        /* Grids */
        .sv-primary-grid { grid-template-columns: 1fr; }
        .sv-packages-grid { grid-template-columns: 1fr; }
    }

    /* Very small phones (≤360px) */
    @media (max-width: 360px) {
        .sv-hero-title { font-size: 28px; }
        .sv-step-circle { width: 38px; height: 38px; }
        .sv-step-n { font-size: 16px; }
        .sv-step-title { font-size: 7px; }
        .sv-step-text { font-size: 9px; }
        .sv-carousel-img-wrap { height: 140px; }
        .sv-testi-text { font-size: 12px; }
    }
`;

const STEPS = [
  {
    n: "01",
    title: "Discover",
    text: "Browse our curated venue collection and filter by event type, location, capacity, and availability.",
  },
  {
    n: "02",
    title: "Consult",
    text: "Speak with your dedicated coordinator to align vision, budget, and logistics before selecting your package.",
  },
  {
    n: "03",
    title: "Reserve",
    text: "Secure your venue and services with a seamless booking process and transparent pricing — no surprises.",
  },
  {
    n: "04",
    title: "Celebrate",
    text: "Arrive and immerse yourself in the moment. Our team handles everything so you create nothing but memories.",
  },
];

function Services() {
  const [navVisible, setNavVisible] = useState(true);
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    type: "",
    price: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const carouselRef = useRef(null);
  const [cpp, setCpp] = useState(3);

  // ── Review state ──
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    event: "",
    text: "",
    rating: 5,
    anonymous: false,
  });
  const [reviewError, setReviewError] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewPage, setReviewPage] = useState(0);
  const REVIEWS_PER_PAGE = 3;

  // Normalise: use type field (DB) falling back to category
  const svcCategory = (s) => s.type || s.category || "";

  // Derived: unique categories from services data
  const categories = [
    "all",
    ...Array.from(new Set(services.map(svcCategory).filter(Boolean))),
  ];

  // Derived: services filtered by active category AND search query
  const filteredServices = services.filter((s) => {
    const matchesCategory =
      activeCategory === "all" || svcCategory(s) === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (s.name || "").toLowerCase().includes(q) ||
      (s.description || "").toLowerCase().includes(q) ||
      svcCategory(s).toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCarouselIndex(0);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCarouselIndex(0);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCarouselIndex(0);
  };

  // Keep cpp in state so offset math is always in sync with window width
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const next = w <= 768 ? 1 : w <= 900 ? 2 : 3;
      setCpp((prev) => {
        if (prev !== next) setCarouselIndex(0);
        return next;
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
        API.get("/users/me")
          .then((res) =>
            setUser((prev) => ({ ...prev, name: res.data.fullName })),
          )
          .catch(() => {});
      } catch {
        setUser(null);
      }
    }
    let lastY = window.scrollY;
    const onScroll = () => {
      const cur = window.scrollY;
      setNavVisible(cur < lastY || cur < 10);
      lastY = cur;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await API.get("/services");
        setServices(res.data);
      } catch {
        // silently fail
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get("/reviews");
        setReviews(res.data);
      } catch {
        // silently fail
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const openAdd = () => {
    setEditService(null);
    setFormData({ name: "", description: "", image: "", type: "", price: "" });
    setFormError("");
    setShowAddModal(true);
  };

  const openEdit = (svc) => {
    setEditService(svc);
    setFormData({
      name: svc.name || "",
      description: svc.description || "",
      image: svc.image || "",
      type: svc.type || svc.category || "",
      price: svc.price != null ? String(svc.price) : "",
    });
    setFormError("");
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      if (editService) {
        const res = await API.put(`/services/${editService._id}`, formData);
        setServices((p) =>
          p.map((s) => (s._id === editService._id ? res.data : s)),
        );
      } else {
        const res = await API.post("/services", formData);
        setServices((p) => [res.data, ...p]);
      }
      setShowAddModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save service.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await API.delete(`/services/${confirmDelete._id}`);
      setServices((p) => p.filter((s) => s._id !== confirmDelete._id));
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmDelete(null);
    }
  };

  const openReviewModal = () => {
    setReviewForm({ event: "", text: "", rating: 5, anonymous: false });
    setReviewError("");
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    if (!reviewForm.text.trim()) {
      setReviewError("Please write your review.");
      return;
    }
    setReviewLoading(true);
    try {
      const res = await API.post("/reviews", reviewForm);
      const newReview = {
        ...res.data,
        anonymous: reviewForm.anonymous,
        user: { _id: res.data.user, name: user?.name || "You" },
      };
      setReviews((prev) => [newReview, ...prev]);
      setReviewPage(0);
      setShowReviewModal(false);
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await API.delete(`/reviews/${reviewId}`);
      setReviews((prev) => {
        const updated = prev.filter((r) => r._id !== reviewId);
        const maxPage = Math.max(
          0,
          Math.ceil(updated.length / REVIEWS_PER_PAGE) - 1,
        );
        setReviewPage((p) => Math.min(p, maxPage));
        return updated;
      });
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  // ── Pre-compute review pagination (replaces IIFE in JSX) ──
  const reviewTotalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const safeReviewPage = Math.min(
    reviewPage,
    Math.max(0, reviewTotalPages - 1),
  );
  const pageReviews = reviews.slice(
    safeReviewPage * REVIEWS_PER_PAGE,
    safeReviewPage * REVIEWS_PER_PAGE + REVIEWS_PER_PAGE,
  );

  // ── Pre-compute carousel pagination (replaces IIFE in JSX) ──
  const totalCarouselPages = Math.ceil(filteredServices.length / cpp);
  const safeCarouselIndex = Math.min(
    carouselIndex,
    Math.max(0, totalCarouselPages - 1),
  );
  const containerW = carouselRef.current ? carouselRef.current.offsetWidth : 0;
  const gap = 24;
  const cardW = cpp > 1 ? (containerW - gap * (cpp - 1)) / cpp : containerW;
  const carouselOffset = safeCarouselIndex * (cardW + gap) * cpp;

  return (
    <>
      <style>{style}</style>
      <div className="sv-root">
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
            <a href="/services" className="hm-nav-link active">
              Services
            </a>
            <a href="/aboutus" className="hm-nav-link">
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
        <section className="sv-hero">
          <p className="sv-eyebrow">What We Offer</p>
          <h1 className="sv-hero-title">
            Services that
            <br />
            elevate every
            <br />
            <em>occasion.</em>
          </h1>
          <p className="sv-hero-sub">
            From venue curation to bespoke design, world-class catering to
            cinematic photography — Eventy brings every element of your event
            together under one roof, with uncompromising attention to detail.
          </p>
        </section>

        {/* ── How It Works ── */}
        <section className="sv-process">
          <div className="sv-section-head">
            <p className="sv-section-eyebrow">The Journey</p>
            <h2 className="sv-section-title">How It Works</h2>
          </div>
          <div className="sv-process-steps">
            {STEPS.map((s) => (
              <div className="sv-step" key={s.n}>
                <div className="sv-step-circle">
                  <span className="sv-step-n">{s.n}</span>
                </div>
                <div className="sv-step-title">{s.title}</div>
                <p className="sv-step-text">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Testimonials / Reviews ── */}
        <section className="sv-testimonials">
          <div
            className="sv-section-head"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p className="sv-section-eyebrow">In Their Words</p>
              <h2 className="sv-section-title">Client Stories</h2>
            </div>
          </div>

          {loadingReviews ? (
            <div className="sv-testi-grid">
              {[1, 2, 3].map((n) => (
                <div className="sv-testi-card sv-skeleton" key={n}>
                  <div className="sv-skeleton-body">
                    <div className="sv-skeleton-line full" />
                    <div className="sv-skeleton-line full" />
                    <div className="sv-skeleton-line wide" />
                    <div
                      className="sv-skeleton-line short"
                      style={{ marginTop: "20px" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="sv-testi-empty">
              No reviews yet. Be the first to share your experience.
            </div>
          ) : (
            <>
              <div className="sv-testi-grid">
                {pageReviews.map((r) => (
                  <div
                    className="sv-testi-card"
                    key={r._id}
                    style={{ position: "relative" }}
                  >
                    {isAdmin && (
                      <button
                        className="sv-review-delete-btn"
                        onClick={() => handleDeleteReview(r._id)}
                        title="Delete review"
                      >
                        ✕
                      </button>
                    )}
                    <span className="sv-testi-quote-mark">"</span>
                    <div className="sv-testi-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`sv-testi-star${star <= (r.rating || 5) ? "" : " empty"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="sv-testi-text">{r.text}</p>
                    <div className="sv-testi-author">
                      <div>
                        <div className="sv-testi-name">
                          {r.anonymous === true
                            ? "Anonymous"
                            : r.user?.fullName || r.user?.name || "Unknown"}
                        </div>
                        {r.event && (
                          <div className="sv-testi-event">{r.event}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {reviewTotalPages > 1 && (
                <div className="sv-review-controls">
                  <button
                    className="sv-review-btn"
                    onClick={() => setReviewPage((p) => Math.max(0, p - 1))}
                    disabled={safeReviewPage === 0}
                    aria-label="Previous reviews"
                  >
                    ‹
                  </button>
                  <div className="sv-review-dots">
                    {Array.from({ length: reviewTotalPages }).map((_, i) => (
                      <button
                        key={i}
                        className={`sv-review-dot${i === safeReviewPage ? " active" : ""}`}
                        onClick={() => setReviewPage(i)}
                        aria-label={`Reviews page ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    className="sv-review-btn"
                    onClick={() =>
                      setReviewPage((p) =>
                        Math.min(reviewTotalPages - 1, p + 1),
                      )
                    }
                    disabled={safeReviewPage >= reviewTotalPages - 1}
                    aria-label="Next reviews"
                  >
                    ›
                  </button>
                </div>
              )}

              {isLoggedIn && !isAdmin && (
                <div style={{ textAlign: "center", marginTop: "32px" }}>
                  <button
                    className="sv-review-add-btn"
                    onClick={openReviewModal}
                  >
                    <span>✦ Share Your Experience</span>
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* ── Services Carousel ── */}
        <section className="sv-manage">
          <div
            className="sv-section-head"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <p className="sv-section-eyebrow">Curated Experiences</p>
              <h2 className="sv-section-title">Available Services</h2>
            </div>
            {isAdmin && (
              <button className="hm-nav-btn-admin" onClick={openAdd}>
                <div className="adm-diamond" />
                <span>Add Service</span>
              </button>
            )}
          </div>

          {!loadingServices && services.length > 0 && (
            <>
              {/* ── Search Bar ── */}
              <div className="sv-search-wrap">
                <input
                  className="sv-search-input"
                  type="text"
                  placeholder="Search services by name, description or category…"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  aria-label="Search services"
                />
                {searchQuery ? (
                  <button
                    className="sv-search-clear"
                    onClick={clearSearch}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                ) : (
                  <span className="sv-search-icon">⌕</span>
                )}
              </div>

              {/* ── Result count (only when searching) ── */}
              {searchQuery && (
                <p className="sv-search-count">
                  <span>{filteredServices.length}</span>{" "}
                  {filteredServices.length === 1 ? "service" : "services"} found
                  for <span>"{searchQuery}"</span>
                </p>
              )}

              {/* ── Category Tabs ── */}
              <div className="sv-cat-tabs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`sv-cat-tab${activeCategory === cat ? " active" : ""}`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    <span>{cat === "all" ? "All Services" : cat}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {loadingServices ? (
            <div className="sv-carousel-wrap">
              <div className="sv-carousel-track-outer">
                <div className="sv-carousel-track">
                  {[1, 2, 3].map((n) => (
                    <div className="sv-carousel-card sv-skeleton" key={n}>
                      <div className="sv-skeleton-img" />
                      <div className="sv-skeleton-body">
                        <div className="sv-skeleton-line wide" />
                        <div className="sv-skeleton-line full" />
                        <div className="sv-skeleton-line short" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "var(--muted)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "28px",
                  color: "var(--cream)",
                  marginBottom: "10px",
                }}
              >
                {services.length === 0
                  ? "No services available"
                  : searchQuery
                    ? `No results for "${searchQuery}"`
                    : "No services in this category"}
              </div>
              <p style={{ fontSize: "12px", fontWeight: 200 }}>
                {services.length === 0
                  ? "Luxury services will appear here."
                  : searchQuery
                    ? "Try a different search term or clear the search."
                    : "Try selecting a different category."}
              </p>
            </div>
          ) : (
            <div className="sv-carousel-wrap">
              <div className="sv-carousel-track-outer" ref={carouselRef}>
                <div
                  className="sv-carousel-track"
                  style={{ transform: `translateX(-${carouselOffset}px)` }}
                >
                  {filteredServices.map((svc) => (
                    <div className="sv-carousel-card" key={svc._id}>
                      {svc.image && (
                        <div className="sv-carousel-img-wrap">
                          <img
                            src={svc.image}
                            alt={svc.name}
                            className="sv-carousel-img"
                            onError={(e) => {
                              e.currentTarget.parentElement.style.display =
                                "none";
                            }}
                          />
                        </div>
                      )}
                      <div className="sv-carousel-body">
                        {svcCategory(svc) && (
                          <div className="sv-carousel-cat">
                            {svcCategory(svc)}
                          </div>
                        )}
                        <div className="sv-carousel-name">{svc.name}</div>
                        {svc.price != null && (
                          <div className="sv-carousel-price">
                            EGP {Number(svc.price).toLocaleString()}
                          </div>
                        )}
                        {svc.description && (
                          <p className="sv-carousel-desc">{svc.description}</p>
                        )}
                        {isAdmin && (
                          <div
                            className="sv-manage-actions"
                            style={{ marginTop: "16px" }}
                          >
                            <button
                              className="sv-manage-btn"
                              onClick={() => openEdit(svc)}
                            >
                              <span>✎ Edit</span>
                            </button>
                            <button
                              className="sv-manage-btn danger"
                              onClick={() => setConfirmDelete(svc)}
                            >
                              <span>✕ Remove</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="sv-carousel-controls">
                <button
                  className="sv-carousel-btn"
                  onClick={() => setCarouselIndex((i) => Math.max(0, i - 1))}
                  disabled={safeCarouselIndex === 0}
                  aria-label="Previous"
                >
                  ‹
                </button>
                <div className="sv-carousel-dots">
                  {Array.from({ length: totalCarouselPages }).map((_, i) => (
                    <button
                      key={i}
                      className={`sv-carousel-dot${i === safeCarouselIndex ? " active" : ""}`}
                      onClick={() => setCarouselIndex(i)}
                      aria-label={`Go to page ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  className="sv-carousel-btn"
                  onClick={() =>
                    setCarouselIndex((i) =>
                      Math.min(totalCarouselPages - 1, i + 1),
                    )
                  }
                  disabled={safeCarouselIndex >= totalCarouselPages - 1}
                  aria-label="Next"
                >
                  ›
                </button>
              </div>
            </div>
          )}
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

        {/* ── Add / Edit Modal ── */}
        {showAddModal && (
          <div
            className="hm-modal-overlay"
            onClick={() => setShowAddModal(false)}
          >
            <div className="hm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="hm-modal-header">
                <span className="hm-modal-title">
                  {editService ? "Edit Service" : "Add New Service"}
                </span>
                <button
                  className="hm-modal-close"
                  onClick={() => setShowAddModal(false)}
                >
                  ✕
                </button>
              </div>
              <form className="hm-modal-body" onSubmit={handleSubmit}>
                <div className="hm-field">
                  <label>Service Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g. Photography & Film"
                  />
                </div>
                <div className="hm-field-row">
                  <div className="hm-field">
                    <label>Type / Category *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">— Select type —</option>
                      <option value="venue">Venue</option>
                      <option value="catering">Catering</option>
                      <option value="design">Design</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="photography">Photography</option>
                      <option value="coordination">Coordination</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="hm-field">
                    <label>Price (EGP) *</label>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. 5000"
                    />
                  </div>
                </div>
                <div className="hm-field">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Describe this service…"
                  />
                </div>
                <div className="hm-field">
                  <label>Image URL</label>
                  <input
                    name="image"
                    value={formData.image}
                    onChange={handleFormChange}
                    placeholder="https://…"
                  />
                </div>
                {formError && <div className="hm-modal-error">{formError}</div>}
                <button
                  className="hm-modal-submit"
                  type="submit"
                  disabled={formLoading}
                >
                  <span>
                    {formLoading
                      ? "Saving…"
                      : editService
                        ? "Save Changes"
                        : "Add Service"}
                  </span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Confirm Delete ── */}
        {confirmDelete && (
          <div
            className="hm-modal-overlay"
            onClick={() => setConfirmDelete(null)}
          >
            <div
              className="hm-modal"
              style={{ maxWidth: "420px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="hm-modal-header">
                <span className="hm-modal-title">Remove Service</span>
                <button
                  className="hm-modal-close"
                  onClick={() => setConfirmDelete(null)}
                >
                  ✕
                </button>
              </div>
              <div className="hm-modal-body">
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 200,
                    color: "var(--cream)",
                    lineHeight: 1.7,
                  }}
                >
                  Are you sure you want to remove{" "}
                  <span
                    style={{
                      color: "var(--gold-light)",
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "15px",
                    }}
                  >
                    {confirmDelete.name}
                  </span>
                  ? This action cannot be undone.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "4px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    className="hm-modal-submit"
                    style={{
                      borderColor: "rgba(192,80,74,0.5)",
                      color: "#E08080",
                    }}
                    onClick={handleDelete}
                  >
                    <span>Yes, Remove</span>
                  </button>
                  <button
                    className="hm-modal-submit"
                    onClick={() => setConfirmDelete(null)}
                  >
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Add Review Modal ── */}
        {showReviewModal && (
          <div
            className="hm-modal-overlay"
            onClick={() => setShowReviewModal(false)}
          >
            <div className="hm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="hm-modal-header">
                <span className="hm-modal-title">Share Your Experience</span>
                <button
                  className="hm-modal-close"
                  onClick={() => setShowReviewModal(false)}
                >
                  ✕
                </button>
              </div>
              <form className="hm-modal-body" onSubmit={handleReviewSubmit}>
                {/* Name display toggle */}
                <div className="hm-field">
                  <label>Display Name</label>
                  <div
                    className="sv-name-toggle-row"
                    style={{ display: "flex", gap: "10px", marginTop: "2px" }}
                  >
                    <button
                      type="button"
                      className="sv-name-toggle-btn"
                      onClick={() =>
                        setReviewForm((p) => ({ ...p, anonymous: false }))
                      }
                      style={{
                        flex: 1,
                        padding: "10px 14px",
                        background: !reviewForm.anonymous
                          ? "var(--gold-dim)"
                          : "rgba(255,255,255,0.03)",
                        border: `1px solid ${!reviewForm.anonymous ? "var(--gold)" : "var(--border)"}`,
                        color: !reviewForm.anonymous
                          ? "var(--gold)"
                          : "var(--muted)",
                        fontFamily: "'Cinzel', serif",
                        fontSize: "9px",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {user?.name || "My Name"}
                    </button>
                    <button
                      type="button"
                      className="sv-name-toggle-btn"
                      onClick={() =>
                        setReviewForm((p) => ({ ...p, anonymous: true }))
                      }
                      style={{
                        flex: 1,
                        padding: "10px 14px",
                        background: reviewForm.anonymous
                          ? "var(--gold-dim)"
                          : "rgba(255,255,255,0.03)",
                        border: `1px solid ${reviewForm.anonymous ? "var(--gold)" : "var(--border)"}`,
                        color: reviewForm.anonymous
                          ? "var(--gold)"
                          : "var(--muted)",
                        fontFamily: "'Cinzel', serif",
                        fontSize: "9px",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      Anonymous
                    </button>
                  </div>
                </div>

                <div className="hm-field">
                  <label>Event / Occasion</label>
                  <input
                    value={reviewForm.event}
                    onChange={(e) =>
                      setReviewForm((p) => ({ ...p, event: e.target.value }))
                    }
                    placeholder="e.g. Wedding · Cairo"
                  />
                </div>

                <div className="hm-field">
                  <label>Rating</label>
                  <div className="sv-star-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`sv-star${star <= reviewForm.rating ? " filled" : ""}`}
                        onClick={() =>
                          setReviewForm((p) => ({ ...p, rating: star }))
                        }
                        aria-label={`${star} star`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="hm-field">
                  <label>Your Review *</label>
                  <textarea
                    value={reviewForm.text}
                    onChange={(e) =>
                      setReviewForm((p) => ({ ...p, text: e.target.value }))
                    }
                    placeholder="Tell us about your experience with Eventy…"
                    required
                    style={{ minHeight: "110px" }}
                  />
                </div>

                {reviewError && (
                  <div className="hm-modal-error">{reviewError}</div>
                )}

                <button
                  className="hm-modal-submit"
                  type="submit"
                  disabled={reviewLoading}
                >
                  <span>{reviewLoading ? "Submitting…" : "Submit Review"}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Services;
