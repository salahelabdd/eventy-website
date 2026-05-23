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

  .ts-root {
    font-family: 'Raleway', sans-serif;
    min-height: 100vh;
    background-color: #0A0A0A;
    background-image:
      repeating-linear-gradient(135deg, transparent, transparent 28px, rgba(200,169,81,0.025) 28px, rgba(200,169,81,0.025) 29px),
      repeating-linear-gradient(45deg,  transparent, transparent 28px, rgba(200,169,81,0.015) 28px, rgba(200,169,81,0.015) 29px),
      radial-gradient(ellipse at 15% 0%, rgba(200,169,81,0.06) 0%, transparent 50%);
    color: var(--cream);
    padding-top: 73px;
  }
  .ts-root::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.5) 100%);
  }

  /* ── Topbar ── */
  .ts-topbar {
    background: rgba(17,17,24,0.94); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 22px 56px;
    display: flex; align-items: center; justify-content: space-between;
    position: fixed; top: 0; left: 0; right: 0; z-index: 50;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .ts-topbar.hidden { transform: translateY(-100%); }
  .ts-topbar::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .ts-logo { display: flex; align-items: center; gap: 14px; text-decoration: none; }
  .ts-logo-mark { width: 32px; height: 32px; border: 1.5px solid var(--gold); transform: rotate(45deg); flex-shrink: 0; }
  .ts-logo-text { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase; }
  .ts-logo-text span { color: var(--gold); }
  .ts-back-btn {
    font-family: 'Cinzel', serif; font-size: 9px; font-weight: 400;
    letter-spacing: 0.28em; text-transform: uppercase;
    padding: 9px 22px; border: 1px solid var(--border);
    background: transparent; color: var(--gold);
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
    text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
  }
  .ts-back-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .ts-back-btn:hover::before { transform: scaleX(1); }
  .ts-back-btn:hover { color: var(--black); }
  .ts-back-btn span { position: relative; z-index: 1; }

  /* ── Hero ── */
  .ts-hero {
    position: relative; z-index: 1;
    max-width: 860px; margin: 0 auto;
    padding: 80px 56px 60px;
  }
  .ts-eyebrow {
    font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--gold); opacity: 0.8; margin-bottom: 18px;
    display: flex; align-items: center; gap: 14px;
  }
  .ts-eyebrow::before { content: ''; display: block; width: 28px; height: 1px; background: var(--gold); opacity: 0.6; }
  .ts-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(40px, 5vw, 64px); font-weight: 300;
    color: var(--cream); line-height: 1.05; margin-bottom: 20px;
  }
  .ts-hero-title em { color: var(--gold-light); font-style: italic; }
  .ts-hero-meta {
    font-size: 11px; font-weight: 200; color: var(--muted);
    letter-spacing: 0.08em; display: flex; align-items: center; gap: 20px;
  }
  .ts-hero-meta-dot { width: 4px; height: 4px; background: var(--gold); transform: rotate(45deg); opacity: 0.5; }

  /* ── Divider ── */
  .ts-divider {
    position: relative; z-index: 1;
    max-width: 860px; margin: 0 auto;
    padding: 0 56px 48px;
    display: flex; align-items: center; gap: 16px;
  }
  .ts-divider-line { flex: 1; height: 1px; background: var(--border); }
  .ts-divider-diamond { width: 8px; height: 8px; border: 1px solid var(--gold); transform: rotate(45deg); flex-shrink: 0; }

  /* ── TOC ── */
  .ts-toc-wrap {
    position: relative; z-index: 1;
    max-width: 860px; margin: 0 auto;
    padding: 0 56px 56px;
  }
  .ts-toc {
    background: rgba(17,17,24,0.7); border: 1px solid var(--border);
    padding: 28px 32px;
    position: relative; overflow: hidden;
  }
  .ts-toc::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold), transparent);
  }
  .ts-toc-title {
    font-family: 'Cinzel', serif; font-size: 10px; font-weight: 600;
    letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold);
    margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
  }
  .ts-toc-title::before { content: '◆'; font-size: 7px; }
  .ts-toc-list { list-style: none; columns: 2; gap: 0; }
  .ts-toc-item { break-inside: avoid; }
  .ts-toc-link {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 0; text-decoration: none;
    font-size: 12px; font-weight: 200; color: var(--muted);
    letter-spacing: 0.04em; transition: color 0.2s;
    border-bottom: 1px solid transparent;
  }
  .ts-toc-link:hover { color: var(--gold-light); }
  .ts-toc-link .toc-n { font-family: 'Cormorant Garamond', serif; font-size: 14px; color: var(--gold); opacity: 0.6; min-width: 22px; }

  /* ── Content ── */
  .ts-content {
    position: relative; z-index: 1;
    max-width: 860px; margin: 0 auto;
    padding: 0 56px 100px;
  }
  .ts-section { margin-bottom: 56px; }
  .ts-section-header {
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 24px; padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .ts-section-header::after {
    content: ''; position: absolute; bottom: -1px; left: 0; width: 56px; height: 1px;
    background: var(--gold);
  }
  .ts-section-num {
    font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300;
    color: var(--gold); opacity: 0.35; line-height: 1; flex-shrink: 0;
  }
  .ts-section-title {
    font-family: 'Cinzel', serif; font-size: 12px; font-weight: 600;
    letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold-light);
  }
  .ts-p {
    font-size: 13px; font-weight: 200; color: var(--muted);
    line-height: 1.9; letter-spacing: 0.03em; margin-bottom: 16px;
  }
  .ts-p:last-child { margin-bottom: 0; }
  .ts-p strong { color: var(--cream); font-weight: 300; }
  .ts-p a { color: var(--gold-light); text-decoration: none; }
  .ts-p a:hover { opacity: 0.7; }
  .ts-ul {
    list-style: none; margin: 12px 0 16px; display: flex; flex-direction: column; gap: 10px;
  }
  .ts-ul li {
    font-size: 13px; font-weight: 200; color: var(--muted);
    line-height: 1.75; letter-spacing: 0.03em;
    display: flex; align-items: flex-start; gap: 12px;
  }
  .ts-ul li::before { content: '◆'; font-size: 5px; color: var(--gold); opacity: 0.65; flex-shrink: 0; margin-top: 7px; }
  .ts-highlight {
    background: var(--gold-dim); border-left: 2px solid var(--gold);
    padding: 16px 20px; margin: 20px 0;
    font-size: 13px; font-weight: 200; color: var(--cream);
    line-height: 1.8; letter-spacing: 0.03em;
  }

  /* ── Contact box ── */
  .ts-contact-box {
    background: rgba(17,17,24,0.7); border: 1px solid var(--border);
    padding: 36px 40px; text-align: center; position: relative; overflow: hidden;
    margin-top: 16px;
  }
  .ts-contact-box::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .ts-contact-eyebrow {
    font-size: 9px; font-weight: 300; letter-spacing: 0.42em; text-transform: uppercase;
    color: var(--gold); opacity: 0.8; margin-bottom: 12px;
  }
  .ts-contact-title {
    font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300;
    color: var(--cream); margin-bottom: 10px;
  }
  .ts-contact-sub {
    font-size: 12px; font-weight: 200; color: var(--muted);
    letter-spacing: 0.04em; margin-bottom: 24px;
  }
  .ts-contact-link {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'Cinzel', serif; font-size: 9px; font-weight: 400;
    letter-spacing: 0.28em; text-transform: uppercase;
    padding: 12px 32px; border: 1px solid var(--gold-line);
    color: var(--gold); text-decoration: none;
    position: relative; overflow: hidden; transition: color 0.35s;
  }
  .ts-contact-link::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .ts-contact-link:hover::before { transform: scaleX(1); }
  .ts-contact-link:hover { color: var(--black); }
  .ts-contact-link span { position: relative; z-index: 1; }

  /* ── Footer ── */
  .ts-footer {
    position: relative; z-index: 1;
    border-top: 1px solid var(--border); padding: 28px 56px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(17,17,24,0.6); backdrop-filter: blur(8px);
  }
  .ts-footer-copy { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }
  .ts-footer-copy span { color: var(--gold); }
  .ts-footer-links { display: flex; gap: 24px; }
  .ts-footer-link { font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.1em; text-decoration: none; transition: color 0.2s; }
  .ts-footer-link:hover { color: var(--gold); }
  .ts-footer-link.active { color: var(--gold); }

  @media (max-width: 768px) {
    .ts-topbar { padding: 18px 24px; }
    .ts-hero, .ts-toc-wrap, .ts-content, .ts-divider { padding-left: 24px; padding-right: 24px; }
    .ts-toc-list { columns: 1; }
    .ts-footer { padding: 24px; flex-direction: column; gap: 16px; text-align: center; }
    .ts-footer-links { flex-wrap: wrap; justify-content: center; }
  }
`;

const SECTIONS = [
  {
    id: "acceptance",
    num: "01",
    title: "Acceptance of Terms",
    content: (
      <>
        <p className="ts-p">
          By accessing or using the Eventy platform — including our website,
          mobile application, and any associated services (collectively, the{" "}
          <strong>"Platform"</strong>) — you confirm that you have read,
          understood, and agree to be bound by these Terms of Service (
          <strong>"Terms"</strong>).
        </p>
        <p className="ts-p">
          If you do not agree to these Terms, you must discontinue use of the
          Platform immediately. These Terms apply to all visitors, registered
          users, event organizers, and any other persons who access or use the
          Platform.
        </p>
        <div className="ts-highlight">
          By creating an account or completing a booking, you represent that you
          are at least 18 years of age and have the legal capacity to enter into
          a binding agreement.
        </div>
      </>
    ),
  },
  {
    id: "account",
    num: "02",
    title: "Account Registration & Security",
    content: (
      <>
        <p className="ts-p">
          To access certain features of the Platform, you must register for an
          account. When creating your account, you agree to:
        </p>
        <ul className="ts-ul">
          <li>
            Provide accurate, complete, and current information including your
            full name, email address, and phone number.
          </li>
          <li>
            Maintain and promptly update your account information to keep it
            accurate and current.
          </li>
          <li>
            Keep your login credentials strictly confidential and not share them
            with any third party.
          </li>
          <li>
            Immediately notify Eventy of any unauthorized access to or use of
            your account.
          </li>
          <li>
            Accept full responsibility for all activity that occurs under your
            account.
          </li>
        </ul>
        <p className="ts-p">
          Eventy reserves the right to suspend or terminate accounts that
          contain inaccurate information, violate these Terms, or engage in any
          fraudulent or harmful behavior.
        </p>
      </>
    ),
  },
  {
    id: "bookings",
    num: "03",
    title: "Venue Bookings & Reservations",
    content: (
      <>
        <p className="ts-p">
          Eventy acts as an intermediary platform connecting event organizers
          with venue owners and service providers. When you submit a booking
          request through the Platform:
        </p>
        <ul className="ts-ul">
          <li>
            A booking is confirmed only upon written confirmation from Eventy
            and receipt of any applicable deposit or payment.
          </li>
          <li>
            Venue availability displayed on the Platform is updated in real time
            but may be subject to brief discrepancies due to concurrent
            bookings.
          </li>
          <li>
            Pricing displayed is indicative. Final pricing may vary based on
            event duration, guest count, add-on services, and applicable taxes.
          </li>
          <li>
            Any special requests or custom arrangements must be agreed upon in
            writing prior to confirmation.
          </li>
        </ul>
        <p className="ts-p">
          Eventy reserves the right to decline any booking request at its sole
          discretion without obligation to provide a reason.
        </p>
      </>
    ),
  },
  {
    id: "cancellation",
    num: "04",
    title: "Cancellation & Refund Policy",
    content: (
      <>
        <p className="ts-p">
          All cancellations must be submitted in writing to{" "}
          <strong>support@eventy.com</strong>. The following cancellation policy
          applies:
        </p>
        <ul className="ts-ul">
          <li>
            <strong>More than 30 days before event:</strong> Full refund of
            deposit, less a 10% administrative fee.
          </li>
          <li>
            <strong>15–30 days before event:</strong> 50% refund of total amount
            paid.
          </li>
          <li>
            <strong>7–14 days before event:</strong> 25% refund of total amount
            paid.
          </li>
          <li>
            <strong>Less than 7 days before event:</strong> No refund. The full
            amount is forfeited.
          </li>
        </ul>
        <div className="ts-highlight">
          Force majeure events (natural disasters, government-imposed lockdowns,
          etc.) may be considered for exception at Eventy's sole discretion.
          Please contact us within 48 hours of such an event.
        </div>
        <p className="ts-p">
          Refunds, where applicable, will be processed within 10–14 business
          days to the original payment method used.
        </p>
      </>
    ),
  },
  {
    id: "conduct",
    num: "05",
    title: "User Conduct & Prohibited Activities",
    content: (
      <>
        <p className="ts-p">
          You agree not to use the Platform for any purpose that is unlawful,
          harmful, or in violation of these Terms. Specifically, you must not:
        </p>
        <ul className="ts-ul">
          <li>
            Post false, misleading, or fraudulent information about yourself or
            any event.
          </li>
          <li>
            Attempt to gain unauthorized access to any part of the Platform or
            its related systems.
          </li>
          <li>
            Use automated tools, bots, or scrapers to collect data from the
            Platform without express written consent.
          </li>
          <li>
            Harass, threaten, or harm any other user, venue partner, or Eventy
            employee.
          </li>
          <li>
            Use the Platform to promote or conduct any illegal activity,
            including but not limited to money laundering, fraud, or human
            trafficking.
          </li>
          <li>
            Upload any content that infringes intellectual property rights of
            any third party.
          </li>
          <li>
            Circumvent any security measures or access controls implemented on
            the Platform.
          </li>
        </ul>
        <p className="ts-p">
          Violation of this section may result in immediate account termination,
          forfeiture of any deposits, and referral to relevant law enforcement
          authorities.
        </p>
      </>
    ),
  },
  {
    id: "payments",
    num: "06",
    title: "Payments & Billing",
    content: (
      <>
        <p className="ts-p">
          The Platform supports payments via credit card, debit card, and select
          digital wallets including InstaPay. By submitting payment, you
          authorize Eventy (or its payment processor) to charge the stated
          amount to your chosen payment method.
        </p>
        <ul className="ts-ul">
          <li>
            All prices are quoted in Egyptian Pounds (EGP) unless otherwise
            stated.
          </li>
          <li>
            Eventy is not responsible for currency conversion fees or
            international transaction charges imposed by your bank.
          </li>
          <li>
            Invoices are issued electronically and delivered to the email
            address registered on your account.
          </li>
          <li>
            In the event of a payment dispute, you must notify Eventy within 7
            days of the transaction date.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "ip",
    num: "07",
    title: "Intellectual Property",
    content: (
      <>
        <p className="ts-p">
          All content on the Platform — including but not limited to text,
          graphics, logos, photographs, software, and user interface designs —
          is the exclusive property of Eventy or its licensors and is protected
          by applicable intellectual property laws.
        </p>
        <p className="ts-p">
          You are granted a limited, non-exclusive, non-transferable license to
          access and use the Platform for personal, non-commercial purposes. You
          may not reproduce, distribute, modify, or create derivative works from
          any Platform content without prior written consent from Eventy.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    num: "08",
    title: "Limitation of Liability",
    content: (
      <>
        <p className="ts-p">
          To the maximum extent permitted by applicable law, Eventy and its
          officers, directors, employees, and partners shall not be liable for:
        </p>
        <ul className="ts-ul">
          <li>
            Any indirect, incidental, special, consequential, or punitive
            damages arising from your use of the Platform.
          </li>
          <li>Loss of profits, data, goodwill, or business opportunities.</li>
          <li>
            Any actions or omissions of third-party venue owners or service
            providers listed on the Platform.
          </li>
          <li>
            Disruptions to the Platform caused by technical failures, cyber
            attacks, or force majeure events.
          </li>
        </ul>
        <div className="ts-highlight">
          Eventy's total cumulative liability to you shall not exceed the amount
          you paid to Eventy in the 12 months immediately preceding the event
          giving rise to the claim.
        </div>
      </>
    ),
  },
  {
    id: "changes",
    num: "09",
    title: "Changes to These Terms",
    content: (
      <>
        <p className="ts-p">
          Eventy reserves the right to modify these Terms at any time. When we
          make material changes, we will update the{" "}
          <strong>"Last Updated"</strong> date at the top of this page and,
          where appropriate, send a notification to your registered email
          address.
        </p>
        <p className="ts-p">
          Your continued use of the Platform following any update constitutes
          your acceptance of the revised Terms. If you do not agree to the
          updated Terms, you must discontinue use of the Platform and may
          request account deletion by contacting us.
        </p>
      </>
    ),
  },
  {
    id: "governing",
    num: "10",
    title: "Governing Law & Disputes",
    content: (
      <>
        <p className="ts-p">
          These Terms shall be governed by and construed in accordance with the
          laws of the Arab Republic of Egypt, without regard to conflict of law
          principles.
        </p>
        <p className="ts-p">
          Any dispute arising out of or in connection with these Terms shall
          first be attempted to be resolved through good-faith negotiation. If
          unresolved within 30 days, disputes shall be submitted to the
          exclusive jurisdiction of the courts of Cairo, Egypt.
        </p>
      </>
    ),
  },
];

export default function TermsOfService() {
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
      <div className="ts-root">
        {/* ── Topbar ── */}
        <nav className={`ts-topbar${navVisible ? "" : " hidden"}`}>
          <Link to="/" className="ts-logo">
            <div className="ts-logo-mark" />
            <div className="ts-logo-text" translate="no">
              Event<span>y</span>
            </div>
          </Link>
          <Link to="/register" className="ts-back-btn">
            <span>← Back to Registration</span>
          </Link>
        </nav>

        {/* ── Hero ── */}
        <section className="ts-hero">
          <p className="ts-eyebrow">Legal</p>
          <h1 className="ts-hero-title">
            Terms of
            <br />
            <em>Service</em>
          </h1>
          <div className="ts-hero-meta">
            <span>Eventy Platform</span>
            <div className="ts-hero-meta-dot" />
            <span>Last Updated: January 1, 2026</span>
            <div className="ts-hero-meta-dot" />
            <span>Version 2.0</span>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="ts-divider">
          <div className="ts-divider-line" />
          <div className="ts-divider-diamond" />
          <div className="ts-divider-line" />
        </div>

        {/* ── Table of Contents ── */}
        <div className="ts-toc-wrap">
          <div className="ts-toc">
            <div className="ts-toc-title">Table of Contents</div>
            <ul className="ts-toc-list">
              {SECTIONS.map((s) => (
                <li className="ts-toc-item" key={s.id}>
                  <a href={`#${s.id}`} className="ts-toc-link">
                    <span className="toc-n">{s.num}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Sections ── */}
        <div className="ts-content">
          {SECTIONS.map((s) => (
            <div className="ts-section" id={s.id} key={s.id}>
              <div className="ts-section-header">
                <span className="ts-section-num">{s.num}</span>
                <span className="ts-section-title">{s.title}</span>
              </div>
              {s.content}
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <footer className="ts-footer">
          <p className="ts-footer-copy">
            © 2026 <span>Eventy</span> — All rights reserved.
          </p>
          <div className="ts-footer-links">
            <Link to="/terms" className="ts-footer-link active">
              Terms of Service
            </Link>
            <Link to="/privacy" className="ts-footer-link">
              Privacy Policy
            </Link>
            <Link to="/" className="ts-footer-link">
              Home
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}
