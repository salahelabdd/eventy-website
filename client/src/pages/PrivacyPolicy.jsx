import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,500&family=Cinzel:wght@400;600&family=Raleway:wght@200;300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black:      #0A0A0A;
    --obsidian:   #111118;
    --gold:       #C8A951;
    --gold-light: #E2C97E;
    --gold-dim:   rgba(200,169,81,0.10);
    --gold-line:  rgba(200,169,81,0.3);
    --cream:      #F0EAD6;
    --muted:      rgba(240,234,214,0.38);
    --border:     rgba(200,169,81,0.18);
  }

  .pp-root {
    font-family: 'Raleway', sans-serif;
    min-height: 100vh;
    background-color: #0A0A0A;
    background-image:
      repeating-linear-gradient(135deg, transparent, transparent 28px, rgba(200,169,81,0.025) 28px, rgba(200,169,81,0.025) 29px),
      repeating-linear-gradient(45deg,  transparent, transparent 28px, rgba(200,169,81,0.015) 28px, rgba(200,169,81,0.015) 29px),
      radial-gradient(ellipse at 85% 0%, rgba(200,169,81,0.06) 0%, transparent 50%);
    color: var(--cream);
    padding-top: 73px;
  }
  .pp-root::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.5) 100%);
  }

  /* ── Topbar ── */
  .pp-topbar {
    background: rgba(17,17,24,0.94); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 22px 56px;
    display: flex; align-items: center; justify-content: space-between;
    position: fixed; top: 0; left: 0; right: 0; z-index: 50;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .pp-topbar.hidden { transform: translateY(-100%); }
  .pp-topbar::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .pp-logo { display: flex; align-items: center; gap: 14px; text-decoration: none; }
  .pp-logo-mark { width: 32px; height: 32px; border: 1.5px solid var(--gold); transform: rotate(45deg); flex-shrink: 0; }
  .pp-logo-text { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase; }
  .pp-logo-text span { color: var(--gold); }
  .pp-back-btn {
    font-family: 'Cinzel', serif; font-size: 9px; font-weight: 400;
    letter-spacing: 0.28em; text-transform: uppercase;
    padding: 9px 22px; border: 1px solid var(--border);
    background: transparent; color: var(--gold);
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
    text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
  }
  .pp-back-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .pp-back-btn:hover::before { transform: scaleX(1); }
  .pp-back-btn:hover { color: var(--black); }
  .pp-back-btn span { position: relative; z-index: 1; }

  /* ── Hero ── */
  .pp-hero {
    position: relative; z-index: 1;
    max-width: 860px; margin: 0 auto;
    padding: 80px 56px 60px;
  }
  .pp-eyebrow {
    font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--gold); opacity: 0.8; margin-bottom: 18px;
    display: flex; align-items: center; gap: 14px;
  }
  .pp-eyebrow::before { content: ''; display: block; width: 28px; height: 1px; background: var(--gold); opacity: 0.6; }
  .pp-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(40px, 5vw, 64px); font-weight: 300;
    color: var(--cream); line-height: 1.05; margin-bottom: 20px;
  }
  .pp-hero-title em { color: var(--gold-light); font-style: italic; }
  .pp-hero-meta {
    font-size: 11px; font-weight: 200; color: var(--muted);
    letter-spacing: 0.08em; display: flex; align-items: center; gap: 20px;
  }
  .pp-hero-meta-dot { width: 4px; height: 4px; background: var(--gold); transform: rotate(45deg); opacity: 0.5; }

  /* ── Divider ── */
  .pp-divider {
    position: relative; z-index: 1;
    max-width: 860px; margin: 0 auto;
    padding: 0 56px 48px;
    display: flex; align-items: center; gap: 16px;
  }
  .pp-divider-line { flex: 1; height: 1px; background: var(--border); }
  .pp-divider-diamond { width: 8px; height: 8px; border: 1px solid var(--gold); transform: rotate(45deg); flex-shrink: 0; }

  /* ── Commitment Banner ── */
  .pp-banner-wrap {
    position: relative; z-index: 1;
    max-width: 860px; margin: 0 auto;
    padding: 0 56px 48px;
  }
  .pp-banner {
    background: var(--gold-dim); border: 1px solid var(--border);
    padding: 28px 32px; display: flex; gap: 20px; align-items: flex-start;
    position: relative; overflow: hidden;
  }
  .pp-banner::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold), transparent);
  }
  .pp-banner-icon { font-size: 24px; flex-shrink: 0; margin-top: 2px; }
  .pp-banner-title {
    font-family: 'Cinzel', serif; font-size: 11px; font-weight: 600;
    letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold-light);
    margin-bottom: 8px;
  }
  .pp-banner-text {
    font-size: 13px; font-weight: 200; color: var(--muted);
    line-height: 1.8; letter-spacing: 0.03em;
  }

  /* ── TOC ── */
  .pp-toc-wrap {
    position: relative; z-index: 1;
    max-width: 860px; margin: 0 auto;
    padding: 0 56px 56px;
  }
  .pp-toc {
    background: rgba(17,17,24,0.7); border: 1px solid var(--border);
    padding: 28px 32px; position: relative; overflow: hidden;
  }
  .pp-toc::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold), transparent);
  }
  .pp-toc-title {
    font-family: 'Cinzel', serif; font-size: 10px; font-weight: 600;
    letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold);
    margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
  }
  .pp-toc-title::before { content: '◆'; font-size: 7px; }
  .pp-toc-list { list-style: none; columns: 2; gap: 0; }
  .pp-toc-item { break-inside: avoid; }
  .pp-toc-link {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 0; text-decoration: none;
    font-size: 12px; font-weight: 200; color: var(--muted);
    letter-spacing: 0.04em; transition: color 0.2s;
  }
  .pp-toc-link:hover { color: var(--gold-light); }
  .pp-toc-link .toc-n { font-family: 'Cormorant Garamond', serif; font-size: 14px; color: var(--gold); opacity: 0.6; min-width: 22px; }

  /* ── Content ── */
  .pp-content {
    position: relative; z-index: 1;
    max-width: 860px; margin: 0 auto;
    padding: 0 56px 100px;
  }
  .pp-section { margin-bottom: 56px; }
  .pp-section-header {
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 24px; padding-bottom: 16px;
    border-bottom: 1px solid var(--border); position: relative;
  }
  .pp-section-header::after {
    content: ''; position: absolute; bottom: -1px; left: 0; width: 56px; height: 1px;
    background: var(--gold);
  }
  .pp-section-num {
    font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300;
    color: var(--gold); opacity: 0.35; line-height: 1; flex-shrink: 0;
  }
  .pp-section-title {
    font-family: 'Cinzel', serif; font-size: 12px; font-weight: 600;
    letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold-light);
  }
  .pp-p {
    font-size: 13px; font-weight: 200; color: var(--muted);
    line-height: 1.9; letter-spacing: 0.03em; margin-bottom: 16px;
  }
  .pp-p:last-child { margin-bottom: 0; }
  .pp-p strong { color: var(--cream); font-weight: 300; }
  .pp-p a { color: var(--gold-light); text-decoration: none; }
  .pp-p a:hover { opacity: 0.7; }
  .pp-ul {
    list-style: none; margin: 12px 0 16px; display: flex; flex-direction: column; gap: 10px;
  }
  .pp-ul li {
    font-size: 13px; font-weight: 200; color: var(--muted);
    line-height: 1.75; letter-spacing: 0.03em;
    display: flex; align-items: flex-start; gap: 12px;
  }
  .pp-ul li::before { content: '◆'; font-size: 5px; color: var(--gold); opacity: 0.65; flex-shrink: 0; margin-top: 7px; }
  .pp-highlight {
    background: var(--gold-dim); border-left: 2px solid var(--gold);
    padding: 16px 20px; margin: 20px 0;
    font-size: 13px; font-weight: 200; color: var(--cream);
    line-height: 1.8; letter-spacing: 0.03em;
  }

  /* ── Data categories table ── */
  .pp-data-table {
    width: 100%; border-collapse: collapse; margin: 16px 0;
  }
  .pp-data-table th {
    font-family: 'Cinzel', serif; font-size: 8px; font-weight: 600;
    letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold);
    padding: 12px 16px; text-align: left;
    border-bottom: 1px solid var(--border);
    background: rgba(200,169,81,0.05);
  }
  .pp-data-table td {
    font-size: 12px; font-weight: 200; color: var(--muted);
    padding: 12px 16px; letter-spacing: 0.03em; line-height: 1.6;
    border-bottom: 1px solid rgba(200,169,81,0.08);
    vertical-align: top;
  }
  .pp-data-table tr:last-child td { border-bottom: none; }
  .pp-data-table td:first-child { color: var(--cream); font-weight: 300; }

  /* ── Rights cards ── */
  .pp-rights-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 2px;
    background: var(--border); margin: 16px 0;
  }
  .pp-right-card {
    background: #0A0A0A; padding: 22px 24px;
    transition: background 0.3s;
  }
  .pp-right-card:hover { background: rgba(17,17,24,0.95); }
  .pp-right-icon { font-size: 18px; margin-bottom: 8px; }
  .pp-right-title {
    font-family: 'Cinzel', serif; font-size: 9px; font-weight: 600;
    letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold-light);
    margin-bottom: 8px;
  }
  .pp-right-text { font-size: 11px; font-weight: 200; color: var(--muted); line-height: 1.75; }

  /* ── Contact box ── */
  .pp-contact-box {
    background: rgba(17,17,24,0.7); border: 1px solid var(--border);
    padding: 36px 40px; text-align: center; position: relative; overflow: hidden;
    margin-top: 16px;
  }
  .pp-contact-box::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .pp-contact-eyebrow { font-size: 9px; font-weight: 300; letter-spacing: 0.42em; text-transform: uppercase; color: var(--gold); opacity: 0.8; margin-bottom: 12px; }
  .pp-contact-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; color: var(--cream); margin-bottom: 10px; }
  .pp-contact-sub { font-size: 12px; font-weight: 200; color: var(--muted); letter-spacing: 0.04em; margin-bottom: 24px; }
  .pp-contact-link {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'Cinzel', serif; font-size: 9px; font-weight: 400;
    letter-spacing: 0.28em; text-transform: uppercase;
    padding: 12px 32px; border: 1px solid var(--gold-line);
    color: var(--gold); text-decoration: none;
    position: relative; overflow: hidden; transition: color 0.35s;
  }
  .pp-contact-link::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .pp-contact-link:hover::before { transform: scaleX(1); }
  .pp-contact-link:hover { color: var(--black); }
  .pp-contact-link span { position: relative; z-index: 1; }

  /* ── Footer ── */
  .pp-footer {
    position: relative; z-index: 1;
    border-top: 1px solid var(--border); padding: 28px 56px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(17,17,24,0.6); backdrop-filter: blur(8px);
  }
  .pp-footer-copy { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }
  .pp-footer-copy span { color: var(--gold); }
  .pp-footer-links { display: flex; gap: 24px; }
  .pp-footer-link { font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.1em; text-decoration: none; transition: color 0.2s; }
  .pp-footer-link:hover { color: var(--gold); }
  .pp-footer-link.active { color: var(--gold); }

  @media (max-width: 768px) {
    .pp-topbar { padding: 18px 24px; }
    .pp-hero, .pp-toc-wrap, .pp-content, .pp-divider, .pp-banner-wrap { padding-left: 24px; padding-right: 24px; }
    .pp-toc-list { columns: 1; }
    .pp-rights-grid { grid-template-columns: 1fr; }
    .pp-footer { padding: 24px; flex-direction: column; gap: 16px; text-align: center; }
    .pp-footer-links { flex-wrap: wrap; justify-content: center; }
  }
`;

const SECTIONS = [
  {
    id: "overview",
    num: "01",
    title: "Overview & Scope",
    content: (
      <>
        <p className="pp-p">
          This Privacy Policy explains how <strong>Eventy</strong> ("we", "our",
          "us") collects, uses, stores, and protects personal information when
          you use our Platform — including our website, mobile application, and
          all associated services.
        </p>
        <p className="pp-p">
          This Policy applies to all users of the Platform, including visitors,
          registered members, event organizers, and venue partners. By using the
          Platform, you consent to the data practices described in this Policy.
        </p>
        <div className="pp-highlight">
          We are committed to handling your personal data with transparency,
          integrity, and respect. We collect only what we need, use it only for
          stated purposes, and never sell it to third parties.
        </div>
      </>
    ),
  },
  {
    id: "collection",
    num: "02",
    title: "Data We Collect",
    content: (
      <>
        <p className="pp-p">
          We collect information in three ways: information you provide
          directly, information collected automatically, and information from
          third parties.
        </p>
        <table className="pp-data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Examples</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Identity Data</td>
              <td>Full name, profile photo</td>
              <td>You provide directly</td>
            </tr>
            <tr>
              <td>Contact Data</td>
              <td>Email address, phone number</td>
              <td>You provide directly</td>
            </tr>
            <tr>
              <td>Booking Data</td>
              <td>Event type, date, guest count, venue preferences</td>
              <td>Generated through your use</td>
            </tr>
            <tr>
              <td>Payment Data</td>
              <td>Card type, last 4 digits, billing address</td>
              <td>Payment processor (tokenized)</td>
            </tr>
            <tr>
              <td>Technical Data</td>
              <td>IP address, browser type, device ID, cookies</td>
              <td>Collected automatically</td>
            </tr>
            <tr>
              <td>Usage Data</td>
              <td>Pages visited, search queries, clicks, session duration</td>
              <td>Collected automatically</td>
            </tr>
            <tr>
              <td>Communications</td>
              <td>Support messages, feedback, survey responses</td>
              <td>You provide directly</td>
            </tr>
          </tbody>
        </table>
        <p className="pp-p">
          We do <strong>not</strong> collect full payment card numbers. All
          payment processing is handled by our PCI-DSS compliant payment
          partners, who return only a tokenized reference to us.
        </p>
      </>
    ),
  },
  {
    id: "use",
    num: "03",
    title: "How We Use Your Data",
    content: (
      <>
        <p className="pp-p">
          We use your personal data only for the purposes described below:
        </p>
        <ul className="pp-ul">
          <li>
            <strong>Service delivery:</strong> Processing bookings, sending
            confirmations, and managing your account.
          </li>
          <li>
            <strong>Personalization:</strong> Tailoring venue recommendations
            and search results to your preferences and history.
          </li>
          <li>
            <strong>Communication:</strong> Sending booking updates, reminders,
            promotional offers (with consent), and platform announcements.
          </li>
          <li>
            <strong>Security:</strong> Detecting and preventing fraud,
            unauthorized access, and other harmful activities.
          </li>
          <li>
            <strong>Legal compliance:</strong> Meeting our obligations under
            Egyptian law and applicable international regulations.
          </li>
          <li>
            <strong>Analytics:</strong> Understanding how the Platform is used
            so we can improve it — using aggregated, anonymized data wherever
            possible.
          </li>
        </ul>
        <p className="pp-p">
          We will never use your data for purposes materially different from
          those listed above without first obtaining your explicit consent.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    num: "04",
    title: "Data Sharing & Disclosure",
    content: (
      <>
        <p className="pp-p">
          We do <strong>not sell, rent, or trade</strong> your personal
          information. We may share limited data only in the following
          circumstances:
        </p>
        <ul className="pp-ul">
          <li>
            <strong>Venue partners:</strong> When you complete a booking, we
            share your name, event details, and contact information with the
            venue to facilitate your reservation.
          </li>
          <li>
            <strong>Service providers:</strong> Trusted third parties who help
            us operate the Platform — including cloud hosting, payment
            processing, email delivery, and analytics — under strict data
            processing agreements.
          </li>
          <li>
            <strong>Legal obligations:</strong> When required by Egyptian law,
            court order, or regulatory authority, or to protect the rights and
            safety of Eventy or others.
          </li>
          <li>
            <strong>Business transfers:</strong> In the event of a merger,
            acquisition, or asset sale, your data may be transferred. You will
            be notified in advance.
          </li>
        </ul>
        <div className="pp-highlight">
          All third-party service providers are contractually required to handle
          your data securely, use it only for the specific services they provide
          to Eventy, and never disclose it to further parties.
        </div>
      </>
    ),
  },
  {
    id: "cookies",
    num: "05",
    title: "Cookies & Tracking",
    content: (
      <>
        <p className="pp-p">
          The Platform uses cookies and similar tracking technologies to enhance
          your experience, maintain session state, and gather usage analytics.
        </p>
        <ul className="pp-ul">
          <li>
            <strong>Essential cookies:</strong> Required for the Platform to
            function. Cannot be disabled without affecting core features such as
            login and booking flow.
          </li>
          <li>
            <strong>Preference cookies:</strong> Remember your settings,
            language preferences, and personalization choices.
          </li>
          <li>
            <strong>Analytics cookies:</strong> Help us understand Platform
            usage patterns through aggregated, anonymized data (e.g., Google
            Analytics).
          </li>
          <li>
            <strong>Marketing cookies:</strong> Used to deliver relevant
            advertising on third-party platforms. These are only placed with
            your explicit consent.
          </li>
        </ul>
        <p className="pp-p">
          You may manage cookie preferences at any time via your browser
          settings. Note that disabling certain cookies may affect Platform
          functionality.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    num: "06",
    title: "Data Retention",
    content: (
      <>
        <p className="pp-p">
          We retain your personal data only for as long as is necessary to
          fulfill the purposes for which it was collected, including legal,
          accounting, or reporting requirements.
        </p>
        <ul className="pp-ul">
          <li>
            <strong>Active account data:</strong> Retained for the lifetime of
            your account plus 2 years after deletion.
          </li>
          <li>
            <strong>Booking records:</strong> Retained for 7 years to meet
            Egyptian tax and commercial law requirements.
          </li>
          <li>
            <strong>Technical logs:</strong> Retained for 90 days for security
            and debugging purposes.
          </li>
          <li>
            <strong>Marketing data:</strong> Retained until you withdraw consent
            or unsubscribe.
          </li>
        </ul>
        <p className="pp-p">
          Upon account deletion, identifiable personal data is anonymized or
          securely deleted within 30 days, except where retention is required by
          law.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    num: "07",
    title: "Your Privacy Rights",
    content: (
      <>
        <p className="pp-p">
          As a user of our Platform, you have the following rights regarding
          your personal data:
        </p>
        <div className="pp-rights-grid">
          {[
            {
              icon: "◆",
              title: "Right to Access",
              text: "Request a copy of all personal data we hold about you.",
            },
            {
              icon: "✦",
              title: "Right to Rectification",
              text: "Correct any inaccurate or incomplete personal data.",
            },
            {
              icon: "◇",
              title: "Right to Erasure",
              text: "Request deletion of your data, subject to legal obligations.",
            },
            {
              icon: "✧",
              title: "Right to Portability",
              text: "Receive your data in a structured, machine-readable format.",
            },
            {
              icon: "❖",
              title: "Right to Object",
              text: "Object to processing of your data for marketing purposes at any time.",
            },
            {
              icon: "✶",
              title: "Right to Restrict",
              text: "Request that we pause processing of your data in certain circumstances.",
            },
          ].map((r) => (
            <div className="pp-right-card" key={r.title}>
              <div className="pp-right-icon">{r.icon}</div>
              <div className="pp-right-title">{r.title}</div>
              <p className="pp-right-text">{r.text}</p>
            </div>
          ))}
        </div>
        <p className="pp-p">
          To exercise any of these rights, please contact us at{" "}
          <a href="mailto:privacy@eventy.com">privacy@eventy.com</a>. We will
          respond within 30 days. Some rights may be subject to legal
          limitations.
        </p>
      </>
    ),
  },
  {
    id: "security",
    num: "08",
    title: "Data Security",
    content: (
      <>
        <p className="pp-p">
          We implement industry-standard technical and organizational measures
          to protect your personal data against unauthorized access, alteration,
          disclosure, or destruction. These include:
        </p>
        <ul className="pp-ul">
          <li>
            TLS/SSL encryption for all data in transit between your browser and
            our servers.
          </li>
          <li>AES-256 encryption for sensitive data stored at rest.</li>
          <li>
            Role-based access controls ensuring only authorized personnel access
            your data.
          </li>
          <li>
            Regular security audits and penetration testing by independent third
            parties.
          </li>
          <li>
            Incident response procedures with mandatory breach notification
            within 72 hours of discovery.
          </li>
        </ul>
        <p className="pp-p">
          Despite these measures, no system is entirely immune from risk. In the
          unlikely event of a data breach that affects your rights or freedoms,
          we will notify you promptly in accordance with applicable law.
        </p>
      </>
    ),
  },
  {
    id: "children",
    num: "09",
    title: "Children's Privacy",
    content: (
      <>
        <p className="pp-p">
          The Eventy Platform is not directed to individuals under the age of
          18. We do not knowingly collect personal data from minors. If you
          believe a child has provided us with personal information, please
          contact us immediately at{" "}
          <a href="mailto:privacy@eventy.com">privacy@eventy.com</a> and we will
          take prompt steps to delete the data.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    num: "10",
    title: "Changes to This Policy",
    content: (
      <>
        <p className="pp-p">
          We may update this Privacy Policy from time to time to reflect changes
          in our practices, technology, legal requirements, or other factors.
          When we make material changes, we will update the{" "}
          <strong>"Last Updated"</strong> date and, where appropriate, notify
          you via email or a prominent notice on the Platform.
        </p>
        <p className="pp-p">
          We encourage you to review this Policy periodically. Your continued
          use of the Platform following any update constitutes acceptance of the
          revised Policy.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  const [navVisible, setNavVisible] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const cur = window.scrollY;
      setNavVisible(cur < lastY || cur < 10);
      lastY = cur;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{style}</style>
      <div className="pp-root">
        {/* ── Topbar ── */}
        <nav className={`pp-topbar${navVisible ? "" : " hidden"}`}>
          <Link to="/" className="pp-logo">
            <div className="pp-logo-mark" />
            <div className="pp-logo-text" translate="no">
              Event<span>y</span>
            </div>
          </Link>
          <Link to="/register" className="pp-back-btn">
            <span>← Back to Registration</span>
          </Link>
        </nav>

        {/* ── Hero ── */}
        <section className="pp-hero">
          <p className="pp-eyebrow">Legal</p>
          <h1 className="pp-hero-title">
            Privacy
            <br />
            <em>Policy</em>
          </h1>
          <div className="pp-hero-meta">
            <span>Eventy Platform</span>
            <div className="pp-hero-meta-dot" />
            <span>Last Updated: January 1, 2026</span>
            <div className="pp-hero-meta-dot" />
            <span>Version 2.0</span>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="pp-divider">
          <div className="pp-divider-line" />
          <div className="pp-divider-diamond" />
          <div className="pp-divider-line" />
        </div>

        {/* ── Commitment banner ── */}
        <div className="pp-banner-wrap">
          <div className="pp-banner">
            <span className="pp-banner-icon">◆</span>
            <div>
              <div className="pp-banner-title">Our Privacy Commitment</div>
              <p className="pp-banner-text">
                Your privacy is not a checkbox for us — it is a core value. We
                collect only what we need, protect it rigorously, and give you
                full control over your data. We will never sell your personal
                information to any third party, ever.
              </p>
            </div>
          </div>
        </div>

        {/* ── Table of Contents ── */}
        <div className="pp-toc-wrap">
          <div className="pp-toc">
            <div className="pp-toc-title">Table of Contents</div>
            <ul className="pp-toc-list">
              {SECTIONS.map((s) => (
                <li className="pp-toc-item" key={s.id}>
                  <a href={`#${s.id}`} className="pp-toc-link">
                    <span className="toc-n">{s.num}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Sections ── */}
        <div className="pp-content">
          {SECTIONS.map((s) => (
            <div className="pp-section" id={s.id} key={s.id}>
              <div className="pp-section-header">
                <span className="pp-section-num">{s.num}</span>
                <span className="pp-section-title">{s.title}</span>
              </div>
              {s.content}
            </div>
          ))}

          {/* Contact box */}
          <div className="pp-contact-box">
            <p className="pp-contact-eyebrow">Privacy Concerns or Requests?</p>
            <div className="pp-contact-title">Contact our Privacy Team</div>
            <p className="pp-contact-sub">
              For data access requests, deletion requests, or any
              privacy-related questions, reach out to us directly.
            </p>
            <a href="mailto:privacy@eventy.com" className="pp-contact-link">
              <span>privacy@eventy.com</span>
            </a>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="pp-footer">
          <p className="pp-footer-copy">
            © 2026 <span>Eventy</span> — All rights reserved.
          </p>
          <div className="pp-footer-links">
            <Link to="/terms" className="pp-footer-link">
              Terms of Service
            </Link>
            <Link to="/privacy" className="pp-footer-link active">
              Privacy Policy
            </Link>
            <Link to="/" className="pp-footer-link">
              Home
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}
