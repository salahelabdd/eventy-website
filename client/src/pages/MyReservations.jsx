import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
// Hotel bookings are fetched from /api/hotel-bookings/my

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
    --green:      #8DB87A;
    --amber:      #D4A853;
  }

  .mr-root {
    font-family: 'Raleway', sans-serif;
    min-height: 100vh;
    color: var(--cream);
    background-color: #0A0A0A;
    background-image:
      repeating-linear-gradient(135deg, transparent, transparent 28px, rgba(200,169,81,0.03) 28px, rgba(200,169,81,0.03) 29px),
      repeating-linear-gradient(45deg, transparent, transparent 28px, rgba(200,169,81,0.018) 28px, rgba(200,169,81,0.018) 29px),
      radial-gradient(ellipse at 15% 0%, rgba(200,169,81,0.07) 0%, transparent 50%),
      radial-gradient(ellipse at 85% 100%, rgba(13,27,42,0.6) 0%, transparent 50%);
  }
  .mr-root::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%);
  }

  .mr-topbar {
    background: rgba(17,17,24,0.94); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border); padding: 22px 56px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .mr-topbar::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .mr-logo { display: flex; align-items: center; gap: 14px; cursor: pointer; }
  .mr-logo-mark { width: 32px; height: 32px; border: 1.5px solid var(--gold); transform: rotate(45deg); flex-shrink: 0; }
  .mr-logo-text { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase; }
  .mr-logo-text span { color: var(--gold); }
  .mr-back-btn {
    font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
    padding: 9px 22px; border: 1px solid var(--border);
    background: transparent; color: var(--gold); cursor: pointer;
    position: relative; overflow: hidden; transition: color 0.3s;
    display: flex; align-items: center; gap: 10px;
  }
  .mr-back-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .mr-back-btn:hover::before { transform: scaleX(1); }
  .mr-back-btn:hover { color: var(--black); }
  .mr-back-btn span { position: relative; z-index: 1; }

  .mr-main { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; padding: 64px 56px 100px; }

  .mr-breadcrumb {
    font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--gold); opacity: 0.8; margin-bottom: 32px;
    display: flex; align-items: center; gap: 14px;
  }
  .mr-breadcrumb::before { content: ''; display: block; width: 32px; height: 1px; background: var(--gold); opacity: 0.6; }
  .mr-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 50px); font-weight: 300; color: var(--cream); line-height: 1.05; margin-bottom: 8px; }
  .mr-subtitle { font-size: 12px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; margin-bottom: 48px; }

  .mr-stats {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
    border: 1px solid var(--border); margin-bottom: 48px; background: var(--border);
  }
  .mr-stat { background: rgba(17,17,24,0.85); padding: 20px 24px; display: flex; flex-direction: column; gap: 6px; }
  .mr-stat-val { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300; color: var(--gold-light); line-height: 1; }
  .mr-stat-label { font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--muted); }

  .mr-empty {
    border: 1px solid var(--border); background: rgba(17,17,24,0.6);
    padding: 64px 40px; text-align: center; position: relative;
  }
  .mr-empty::before { content: ''; position: absolute; top: 0; left: 0; width: 60px; height: 1px; background: var(--gold); }
  .mr-empty-icon { font-size: 32px; color: var(--gold); opacity: 0.3; margin-bottom: 20px; }
  .mr-empty-title { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 300; color: var(--cream); margin-bottom: 10px; }
  .mr-empty-sub { font-size: 12px; font-weight: 200; color: var(--muted); letter-spacing: 0.04em; margin-bottom: 32px; line-height: 1.7; }
  .mr-empty-btn {
    display: inline-block; padding: 12px 32px; border: 1px solid var(--gold);
    background: transparent; color: var(--gold);
    font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
  }
  .mr-empty-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .mr-empty-btn:hover::before { transform: scaleX(1); }
  .mr-empty-btn:hover { color: var(--black); }
  .mr-empty-btn span { position: relative; z-index: 1; }

  .mr-list { display: flex; flex-direction: column; gap: 2px; }

  .mr-card {
    border: 1px solid var(--border); background: rgba(17,17,24,0.85);
    backdrop-filter: blur(10px); position: relative; overflow: hidden;
    transition: border-color 0.3s;
  }
  .mr-card:hover { border-color: var(--gold-line); }
  .mr-card::before { content: ''; position: absolute; top: 0; left: 0; width: 60px; height: 1px; background: var(--gold); }

  .mr-card-header {
    padding: 24px 28px 20px;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
    border-bottom: 1px solid rgba(200,169,81,0.08);
  }
  .mr-card-venue { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; color: var(--cream); margin-bottom: 4px; }
  .mr-card-location { font-size: 10px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; display: flex; align-items: center; gap: 6px; }
  .mr-card-location::before { content: '◆'; font-size: 5px; color: var(--gold); opacity: 0.6; }

  .mr-status-badge {
    font-family: 'Cinzel', serif; font-size: 7px; font-weight: 400;
    letter-spacing: 0.25em; text-transform: uppercase;
    padding: 5px 12px; border: 1px solid; flex-shrink: 0; white-space: nowrap;
  }
  .mr-status-badge.pending   { color: var(--amber); border-color: rgba(212,168,83,0.4);  background: rgba(212,168,83,0.07); }
  .mr-status-badge.confirmed { color: var(--green); border-color: rgba(141,184,122,0.4); background: rgba(141,184,122,0.07); }
  .mr-status-badge.cancelled { color: var(--red);   border-color: rgba(224,128,128,0.4); background: rgba(224,128,128,0.07); }

  .mr-card-body {
    padding: 20px 28px;
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
    border-bottom: 1px solid rgba(200,169,81,0.08);
  }
  .mr-detail { padding: 0 16px; border-right: 1px solid rgba(200,169,81,0.08); }
  .mr-detail:first-child { padding-left: 0; }
  .mr-detail:last-child { border-right: none; }
  .mr-detail-label { font-size: 8px; font-weight: 300; letter-spacing: 0.35em; text-transform: uppercase; color: var(--gold); opacity: 0.6; margin-bottom: 6px; }
  .mr-detail-val { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 300; color: var(--cream); }
  .mr-detail-val.gold { color: var(--gold-light); }

  /* Payment info row */
  .mr-card-payment {
    padding: 14px 28px;
    display: flex; align-items: center; gap: 0;
    border-bottom: 1px solid rgba(200,169,81,0.08);
    background: rgba(200,169,81,0.03);
  }
  .mr-pay-item { flex: 1; padding: 0 16px; border-right: 1px solid rgba(200,169,81,0.08); }
  .mr-pay-item:first-child { padding-left: 0; }
  .mr-pay-item:last-child { border-right: none; }
  .mr-pay-label { font-size: 8px; font-weight: 300; letter-spacing: 0.35em; text-transform: uppercase; color: var(--gold); opacity: 0.6; margin-bottom: 5px; }
  .mr-pay-val { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 300; color: var(--cream); }
  .mr-pay-val.green { color: var(--green); }
  .mr-pay-val.amber { color: var(--amber); }
  .mr-method-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'Cinzel', serif; font-size: 8px; font-weight: 400;
    letter-spacing: 0.18em; text-transform: uppercase;
    padding: 4px 10px; border: 1px solid var(--gold-line);
    background: var(--gold-dim); color: var(--gold-light);
  }

  /* Services */
  .mr-card-services {
    padding: 16px 28px;
    border-bottom: 1px solid rgba(200,169,81,0.08);
    background: rgba(10,10,10,0.25);
  }
  .mr-services-label { font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.6; margin-bottom: 10px; }
  .mr-services-list { display: flex; flex-wrap: wrap; gap: 8px; }
  .mr-service-tag {
    font-size: 10px; font-weight: 200; color: var(--cream);
    padding: 4px 12px; border: 1px solid rgba(200,169,81,0.2);
    background: rgba(200,169,81,0.06); letter-spacing: 0.03em;
    display: flex; align-items: center; gap: 6px;
  }
  .mr-service-tag::before { content: '◆'; font-size: 5px; color: var(--gold); opacity: 0.55; }

  /* Card footer */
  .mr-card-footer {
    padding: 14px 28px;
    display: flex; justify-content: flex-end; align-items: center; gap: 12px;
  }
  .mr-cancel-btn {
    font-family: 'Cinzel', serif; font-size: 8px; font-weight: 400;
    letter-spacing: 0.22em; text-transform: uppercase;
    padding: 8px 20px; border: 1px solid rgba(224,128,128,0.35);
    background: transparent; color: var(--red);
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
    display: flex; align-items: center; gap: 8px;
  }
  .mr-cancel-btn::before {
    content: ''; position: absolute; inset: 0;
    background: rgba(224,128,128,0.12);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .mr-cancel-btn:hover::before { transform: scaleX(1); }
  .mr-cancel-btn span { position: relative; z-index: 1; }
  .mr-cancel-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .mr-cancel-note { font-size: 9px; font-weight: 200; color: var(--muted); letter-spacing: 0.04em; }

  .mr-loading {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.45em;
    text-transform: uppercase; color: var(--gold); opacity: 0.6; background: #0A0A0A;
  }

  .mr-footer {
    position: relative; z-index: 1; border-top: 1px solid var(--border); padding: 32px 56px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(17,17,24,0.6); backdrop-filter: blur(8px);
  }
  .mr-footer-copy { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }
  .mr-footer-copy span { color: var(--gold); }

  /* ── Section divider ── */
  .mr-section-title {
    font-family: 'Cormorant Garamond', serif; font-size: clamp(20px, 2.5vw, 28px);
    font-weight: 300; color: var(--cream); margin-bottom: 20px; margin-top: 56px;
    display: flex; align-items: center; gap: 16px;
  }
  .mr-section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .mr-section-title:first-of-type { margin-top: 0; }

  /* ── Hotel card extras ── */
  .mr-hotel-badge {
    font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.22em;
    text-transform: uppercase; padding: 4px 10px;
    border: 1px solid var(--gold-line); color: var(--gold); background: var(--gold-dim);
    flex-shrink: 0;
  }
  .mr-stars { color: var(--gold); font-size: 11px; letter-spacing: 2px; }
  .mr-card-body-3 {
    padding: 20px 28px;
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 0;
    border-bottom: 1px solid rgba(200,169,81,0.08);
  }
  .mr-tag-list { display: flex; flex-wrap: wrap; gap: 8px; }
  .mr-tag {
    font-size: 10px; font-weight: 200; color: var(--cream);
    padding: 4px 12px; border: 1px solid rgba(200,169,81,0.2);
    background: rgba(200,169,81,0.06); letter-spacing: 0.03em;
  }

  @media (max-width: 720px) {
    .mr-topbar { padding: 18px 24px; }
    .mr-main { padding: 40px 24px 60px; }
    .mr-stats { grid-template-columns: 1fr 1fr; }
    .mr-card-body { grid-template-columns: 1fr 1fr; gap: 16px; }
    .mr-card-body-3 { grid-template-columns: 1fr 1fr; gap: 16px; }
    .mr-detail { padding: 0; border-right: none; }
    .mr-card-footer { flex-direction: column; align-items: flex-start; }
    .mr-footer { padding: 24px; flex-direction: column; gap: 12px; text-align: center; }
  }
`;

const STATUS_CLASS = {
  pending: "pending",
  accepted: "confirmed",
  confirmed: "confirmed",
  rejected: "cancelled",
  cancelled: "cancelled",
};

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const fmt = (n) => (n ?? 0).toLocaleString();

const STARS = (n) => "★".repeat(Math.min(n || 0, 5));

function MyReservations() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [hotelBookings, setHotelBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [venueRes, hotelRes] = await Promise.all([
          API.get("/bookings/my"),
          API.get("/hotel-bookings/my"),
        ]);
        setBookings(venueRes.data);
        setHotelBookings(hotelRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleCancel = async (id) => {
    setCancelling(id);
    try {
      await API.put(`/bookings/${id}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)),
      );
    } catch (err) {
      console.error("Cancel failed:", err.response?.data || err.message);
    } finally {
      setCancelling(null);
    }
  };

  const handleCancelHotel = async (id) => {
    setCancelling(id);
    try {
      await API.put(`/hotel-bookings/${id}/cancel`);
      setHotelBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)),
      );
    } catch (err) {
      console.error("Hotel cancel failed:", err.response?.data || err.message);
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <>
        <style>{style}</style>
        <div className="mr-loading">Loading Reservations…</div>
      </>
    );
  }

  const totalAll = bookings.length + hotelBookings.length;
  const confirmedAll =
    bookings.filter((b) => b.status === "accepted" || b.status === "confirmed").length +
    hotelBookings.filter((b) => b.status === "accepted").length;
  const pendingAll =
    bookings.filter((b) => b.status === "pending").length +
    hotelBookings.filter((b) => b.status === "pending").length;

  return (
    <>
      <style>{style}</style>
      <div className="mr-root">
        <nav className="mr-topbar">
          <div className="mr-logo" onClick={() => navigate("/")}>
            <div className="mr-logo-mark" />
            <div className="mr-logo-text" translate="no">
              Event<span>y</span>
            </div>
          </div>
          <button className="mr-back-btn" onClick={() => navigate("/")}>
            <span>←</span>
            <span>Back to Venues</span>
          </button>
        </nav>

        <main className="mr-main">
          <p className="mr-breadcrumb">Account</p>
          <h1 className="mr-title">My Reservations</h1>
          <p className="mr-subtitle">
            A record of all your venue and hotel bookings.
          </p>

          {totalAll > 0 && (
            <div className="mr-stats">
              <div className="mr-stat">
                <span className="mr-stat-val">{totalAll}</span>
                <span className="mr-stat-label">Total Bookings</span>
              </div>
              <div className="mr-stat">
                <span className="mr-stat-val">{confirmedAll}</span>
                <span className="mr-stat-label">Confirmed</span>
              </div>
              <div className="mr-stat">
                <span className="mr-stat-val">{pendingAll}</span>
                <span className="mr-stat-label">Pending</span>
              </div>
            </div>
          )}

          {totalAll === 0 ? (
            <div className="mr-empty">
              <div className="mr-empty-icon">✦</div>
              <div className="mr-empty-title">No Reservations Yet</div>
              <p className="mr-empty-sub">
                You haven't made any bookings yet.
                <br />
                Browse our curated venues and hotels to get started.
              </p>
              <button className="mr-empty-btn" onClick={() => navigate("/")}>
                <span>Explore Venues</span>
              </button>
            </div>
          ) : (
            <>
              {/* ── Venue Bookings ── */}
              {bookings.length > 0 && (
                <>
                  <h2 className="mr-section-title">Venue Reservations</h2>
                  <div className="mr-list">
                    {bookings.map((b) => {
                      const isCancelled = b.status === "cancelled";
                      const services = b.services || [];
                      return (
                        <div className="mr-card" key={b._id}>
                          {/* Header */}
                          <div className="mr-card-header">
                            <div>
                              <div className="mr-card-venue">
                                {b.venue?.name ?? "—"}
                              </div>
                              <div className="mr-card-location">
                                {b.venue?.location ?? "—"}
                              </div>
                            </div>
                            <span
                              className={`mr-status-badge ${STATUS_CLASS[b.status] ?? "pending"}`}
                            >
                              {b.status ?? "Pending"}
                            </span>
                          </div>

                          {/* Details */}
                          <div className="mr-card-body">
                            <div className="mr-detail">
                              <div className="mr-detail-label">Event</div>
                              <div className="mr-detail-val">{b.eventType}</div>
                            </div>
                            <div className="mr-detail">
                              <div className="mr-detail-label">Date</div>
                              <div className="mr-detail-val">
                                {fmtDate(b.eventDate)}
                              </div>
                            </div>
                            <div className="mr-detail">
                              <div className="mr-detail-label">Guests</div>
                              <div className="mr-detail-val">
                                {fmt(b.guestCount)}
                              </div>
                            </div>
                            <div className="mr-detail">
                              <div className="mr-detail-label">Duration</div>
                              <div className="mr-detail-val gold">{b.hours}h</div>
                            </div>
                          </div>

                          {/* Payment Info */}
                          {(b.depositAmount != null || b.paymentMethod) && (
                            <div className="mr-card-payment">
                              <div className="mr-pay-item">
                                <div className="mr-pay-label">Deposit Paid</div>
                                <div className="mr-pay-val green">
                                  {b.depositAmount != null ? `$${fmt(b.depositAmount)}` : "—"}
                                </div>
                              </div>
                              <div className="mr-pay-item">
                                <div className="mr-pay-label">Remaining</div>
                                <div className="mr-pay-val amber">
                                  {b.remainingAmount != null ? `$${fmt(b.remainingAmount)}` : "—"}
                                </div>
                              </div>
                              <div className="mr-pay-item">
                                <div className="mr-pay-label">Method</div>
                                <div className="mr-pay-val">
                                  {b.paymentMethod ? (
                                    <span className="mr-method-badge">
                                      {b.paymentMethod === "credit_card" && "Credit Card"}
                                      {b.paymentMethod === "debit_card"  && "Debit Card"}
                                      {b.paymentMethod === "ewallet"     && "E-Wallet"}
                                      {b.paymentMethod === "instapay"    && "InstaPay"}
                                    </span>
                                  ) : "—"}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Services */}
                          {services.length > 0 && (
                            <div className="mr-card-services">
                              <div className="mr-services-label">Add-on Services</div>
                              <div className="mr-services-list">
                                {services.map((svc, i) => (
                                  <span className="mr-service-tag" key={svc._id || i}>
                                    {svc.name ?? svc}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Footer */}
                          <div className="mr-card-footer">
                            {isCancelled ? (
                              <span className="mr-cancel-note">
                                This reservation has been cancelled.
                              </span>
                            ) : (
                              <button
                                className="mr-cancel-btn"
                                onClick={() => handleCancel(b._id)}
                                disabled={cancelling === b._id}
                              >
                                <span>
                                  {cancelling === b._id ? "Cancelling…" : "Cancel Reservation"}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* ── Hotel Bookings ── */}
              {hotelBookings.length > 0 && (
                <>
                  <h2 className="mr-section-title">Hotel Reservations</h2>
                  <div className="mr-list">
                    {hotelBookings.map((b) => {
                      const isCancelled = b.status === "cancelled";
                      return (
                        <div className="mr-card" key={b._id}>
                          {/* Header */}
                          <div className="mr-card-header">
                            <div>
                              <div className="mr-card-venue" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                {b.hotel?.name ?? "—"}
                                {b.hotel?.stars > 0 && (
                                  <span className="mr-stars">{STARS(b.hotel.stars)}</span>
                                )}
                              </div>
                              <div className="mr-card-location">
                                {b.hotel?.location ?? "—"}
                              </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                              <span className="mr-hotel-badge">Hotel</span>
                              <span
                                className={`mr-status-badge ${STATUS_CLASS[b.status] ?? "pending"}`}
                              >
                                {b.status ?? "Pending"}
                              </span>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="mr-card-body-3">
                            <div className="mr-detail">
                              <div className="mr-detail-label">Check-in</div>
                              <div className="mr-detail-val">{fmtDate(b.checkIn)}</div>
                            </div>
                            <div className="mr-detail" style={{ paddingLeft: 16, borderRight: "1px solid rgba(200,169,81,0.08)" }}>
                              <div className="mr-detail-label">Check-out</div>
                              <div className="mr-detail-val">{fmtDate(b.checkOut)}</div>
                            </div>
                            <div className="mr-detail" style={{ paddingLeft: 16 }}>
                              <div className="mr-detail-label">Nights</div>
                              <div className="mr-detail-val gold">{b.nights}</div>
                            </div>
                          </div>

                          {/* Room details */}
                          <div className="mr-card-body">
                            <div className="mr-detail">
                              <div className="mr-detail-label">Room Type</div>
                              <div className="mr-detail-val" style={{ textTransform: "capitalize" }}>
                                {b.roomType ?? "—"}
                              </div>
                            </div>
                            <div className="mr-detail">
                              <div className="mr-detail-label">Bed Type</div>
                              <div className="mr-detail-val">{b.bedType ?? "—"}</div>
                            </div>
                            <div className="mr-detail">
                              <div className="mr-detail-label">Guests</div>
                              <div className="mr-detail-val">
                                {b.adults} adult{b.adults !== 1 ? "s" : ""}
                                {b.children > 0 ? `, ${b.children} child${b.children !== 1 ? "ren" : ""}` : ""}
                              </div>
                            </div>
                            <div className="mr-detail">
                              <div className="mr-detail-label">Floor Pref.</div>
                              <div className="mr-detail-val gold" style={{ fontSize: 13 }}>
                                {b.floorPreference ?? "—"}
                              </div>
                            </div>
                          </div>

                          {/* Payment Info */}
                          {(b.depositAmount != null || b.paymentMethod) && (
                            <div className="mr-card-payment">
                              <div className="mr-pay-item">
                                <div className="mr-pay-label">Deposit Paid</div>
                                <div className="mr-pay-val green">
                                  {b.depositAmount != null ? `$${fmt(b.depositAmount)}` : "—"}
                                </div>
                              </div>
                              <div className="mr-pay-item">
                                <div className="mr-pay-label">Remaining</div>
                                <div className="mr-pay-val amber">
                                  {b.remainingAmount != null ? `$${fmt(b.remainingAmount)}` : "—"}
                                </div>
                              </div>
                              <div className="mr-pay-item">
                                <div className="mr-pay-label">Method</div>
                                <div className="mr-pay-val">
                                  {b.paymentMethod ? (
                                    <span className="mr-method-badge">
                                      {b.paymentMethod === "credit_card" && "Credit Card"}
                                      {b.paymentMethod === "debit_card"  && "Debit Card"}
                                      {b.paymentMethod === "ewallet"     && "E-Wallet"}
                                      {b.paymentMethod === "instapay"    && "InstaPay"}
                                    </span>
                                  ) : "—"}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Add-ons */}
                          {b.addons?.length > 0 && (
                            <div className="mr-card-services">
                              <div className="mr-services-label">Add-ons</div>
                              <div className="mr-tag-list">
                                {b.addons.map((a, i) => (
                                  <span className="mr-tag" key={i}>{a}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Special Requests */}
                          {b.specialRequests?.length > 0 && (
                            <div className="mr-card-services">
                              <div className="mr-services-label">Special Requests</div>
                              <div className="mr-tag-list">
                                {b.specialRequests.map((r, i) => (
                                  <span className="mr-tag" key={i}>{r}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Footer */}
                          <div className="mr-card-footer">
                            {isCancelled ? (
                              <span className="mr-cancel-note">
                                This reservation has been cancelled.
                              </span>
                            ) : (
                              <button
                                className="mr-cancel-btn"
                                onClick={() => handleCancelHotel(b._id)}
                                disabled={cancelling === b._id}
                              >
                                <span>
                                  {cancelling === b._id ? "Cancelling…" : "Cancel Reservation"}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </main>

        <footer className="mr-footer">
          <p className="mr-footer-copy">
            © 2026 <span>Eventy</span> — All rights reserved.
          </p>
          <p className="mr-footer-copy" style={{ opacity: 0.5 }}>
            Luxury Event Planning Platform
          </p>
        </footer>
      </div>
    </>
  );
}

export default MyReservations;
