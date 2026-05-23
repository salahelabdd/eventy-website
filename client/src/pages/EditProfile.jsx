import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

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
    --green:      #8DB87A;
  }

  .ep-root {
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
  .ep-root::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%);
  }

  /* ── Topbar ── */
  .ep-topbar {
    background: rgba(17,17,24,0.94);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 22px 56px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .ep-topbar::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .ep-logo { display: flex; align-items: center; gap: 14px; cursor: pointer; }
  .ep-logo-mark { width: 32px; height: 32px; border: 1.5px solid var(--gold); transform: rotate(45deg); flex-shrink: 0; }
  .ep-logo-text { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600; letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase; }
  .ep-logo-text span { color: var(--gold); }
  .ep-back-btn {
    font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase;
    padding: 9px 22px; border: 1px solid var(--border);
    background: transparent; color: var(--gold); cursor: pointer;
    position: relative; overflow: hidden; transition: color 0.3s;
    display: flex; align-items: center; gap: 10px;
  }
  .ep-back-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .ep-back-btn:hover::before { transform: scaleX(1); }
  .ep-back-btn:hover { color: var(--black); }
  .ep-back-btn span { position: relative; z-index: 1; }

  /* ── Main ── */
  .ep-main { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; padding: 64px 56px 100px; }

  .ep-breadcrumb {
    font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--gold); opacity: 0.8; margin-bottom: 32px;
    display: flex; align-items: center; gap: 14px;
  }
  .ep-breadcrumb::before { content: ''; display: block; width: 32px; height: 1px; background: var(--gold); opacity: 0.6; }

  .ep-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 50px); font-weight: 300; color: var(--cream); line-height: 1.05; margin-bottom: 8px; }
  .ep-subtitle { font-size: 12px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; margin-bottom: 48px; }

  /* ── Avatar ── */
  .ep-avatar-row {
    display: flex; align-items: center; gap: 24px; margin-bottom: 40px;
    padding: 24px 28px; border: 1px solid var(--border);
    background: rgba(17,17,24,0.6); position: relative;
  }
  .ep-avatar-row::before { content: ''; position: absolute; top: 0; left: 0; width: 60px; height: 1px; background: var(--gold); }
  .ep-avatar {
    width: 64px; height: 64px; border: 1.5px solid var(--gold-line);
    background: var(--gold-dim); display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 300;
    color: var(--gold-light); flex-shrink: 0; position: relative;
  }
  .ep-avatar::after {
    content: ''; position: absolute; inset: -4px;
    border: 1px solid rgba(200,169,81,0.15);
  }
  .ep-avatar-info {}
  .ep-avatar-name { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; color: var(--cream); }
  .ep-avatar-label { font-size: 9px; font-weight: 200; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); opacity: 0.6; margin-top: 4px; }

  /* ── Panel ── */
  .ep-panel {
    background: rgba(17,17,24,0.85); backdrop-filter: blur(10px);
    border: 1px solid var(--border); padding: 40px 44px;
    position: relative;
  }
  .ep-panel::before { content: ''; position: absolute; top: 0; left: 0; width: 80px; height: 1px; background: var(--gold); }
  .ep-panel-title { font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase; color: var(--gold); opacity: 0.8; margin-bottom: 28px; }

  /* ── Fields ── */
  .ep-field { margin-bottom: 22px; }
  .ep-label { font-size: 8px; font-weight: 300; letter-spacing: 0.38em; text-transform: uppercase; color: var(--gold); opacity: 0.65; margin-bottom: 8px; display: block; }
  .ep-input {
    width: 100%; background: rgba(10,10,10,0.7); border: 1px solid var(--border);
    color: var(--cream); font-family: 'Raleway', sans-serif;
    font-size: 13px; font-weight: 200; padding: 11px 14px;
    outline: none; transition: border-color 0.2s; -webkit-appearance: none; appearance: none;
  }
  .ep-input:focus { border-color: var(--gold-line); }
  .ep-input::placeholder { color: var(--muted); }

  /* ── Divider ── */
  .ep-divider { width: 100%; height: 1px; background: var(--border); margin: 28px 0; position: relative; }
  .ep-divider::before {
    content: '◆'; position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
    font-size: 7px; color: var(--gold); background: var(--obsidian); padding: 0 10px;
  }

  /* ── Password note ── */
  .ep-field-note { font-size: 9px; font-weight: 200; color: var(--muted); letter-spacing: 0.04em; margin-top: 6px; }

  /* ── Submit ── */
  .ep-submit {
    width: 100%; padding: 16px; background: transparent; border: 1px solid var(--gold);
    color: var(--gold); font-family: 'Cinzel', serif; font-size: 10px; font-weight: 400;
    letter-spacing: 0.32em; text-transform: uppercase;
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.35s; margin-top: 8px;
  }
  .ep-submit::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .ep-submit:hover:not(:disabled)::before { transform: scaleX(1); }
  .ep-submit:hover:not(:disabled) { color: var(--black); }
  .ep-submit span { position: relative; z-index: 1; }
  .ep-submit:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Message ── */
  .ep-msg {
    margin-top: 16px; padding: 12px 16px;
    font-size: 11px; font-weight: 200; letter-spacing: 0.04em;
  }
  .ep-msg.ok  { color: var(--green); border: 1px solid rgba(141,184,122,0.3); background: rgba(141,184,122,0.06); }
  .ep-msg.err { color: var(--red);   border: 1px solid rgba(224,128,128,0.3); background: rgba(224,128,128,0.06); }

  /* ── Loading ── */
  .ep-loading {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.45em;
    text-transform: uppercase; color: var(--gold); opacity: 0.6;
    background: #0A0A0A;
  }

  /* ── Footer ── */
  .ep-footer {
    position: relative; z-index: 1; border-top: 1px solid var(--border); padding: 32px 56px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(17,17,24,0.6); backdrop-filter: blur(8px);
  }
  .ep-footer-copy { font-size: 11px; font-weight: 200; color: var(--muted); letter-spacing: 0.06em; }
  .ep-footer-copy span { color: var(--gold); }

  @media (max-width: 768px) {
  /* ── Topbar ── */
  .ep-topbar {
    padding: 16px 20px;
  }
  .ep-logo-text {
    font-size: 15px;
    letter-spacing: 0.2em;
  }
  .ep-back-btn {
    padding: 8px 16px;
    font-size: 8px;
    letter-spacing: 0.2em;
  }

  /* ── Main ── */
  .ep-main {
    padding: 32px 20px 60px;
  }

  /* ── Breadcrumb ── */
  .ep-breadcrumb {
    font-size: 8px;
    margin-bottom: 20px;
  }

  /* ── Title ── */
  .ep-title {
    font-size: 32px;
  }
  .ep-subtitle {
    font-size: 11px;
    margin-bottom: 32px;
  }

  /* ── Avatar row ── */
  .ep-avatar-row {
    padding: 18px 18px;
    gap: 16px;
    margin-bottom: 28px;
  }
  .ep-avatar {
    width: 52px;
    height: 52px;
    font-size: 20px;
    flex-shrink: 0;
  }
  .ep-avatar-name {
    font-size: 18px;
  }
  .ep-avatar-label {
    font-size: 8px;
    margin-top: 3px;
  }

  /* ── Panel ── */
  .ep-panel {
    padding: 24px 20px 28px;
  }
  .ep-panel-title {
    font-size: 8px;
    letter-spacing: 0.35em;
    margin-bottom: 20px;
  }

  /* ── Fields ── */
  .ep-field {
    margin-bottom: 18px;
  }
  .ep-label {
    font-size: 8px;
    letter-spacing: 0.3em;
    margin-bottom: 7px;
  }
  .ep-input {
    font-size: 14px;
    padding: 12px 14px;
  }
  .ep-field-note {
    font-size: 10px;
    margin-top: 5px;
  }

  /* ── Divider ── */
  .ep-divider {
    margin: 22px 0;
  }

  /* ── Submit ── */
  .ep-submit {
    padding: 14px;
    font-size: 9px;
    letter-spacing: 0.26em;
    margin-top: 6px;
  }

  /* ── Message ── */
  .ep-msg {
    font-size: 11px;
    padding: 10px 14px;
    margin-top: 14px;
  }

  /* ── Footer ── */
  .ep-footer {
    padding: 20px;
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  .ep-footer-copy {
    font-size: 11px;
  }
}
`;

function EditProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { text, type: 'ok'|'err' }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/users/me");
        setUser({
          fullName: res.data.fullName,
          email: res.data.email,
          phoneNumber: res.data.phoneNumber || "",
          password: "",
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const payload = { ...user };
      if (!payload.password) delete payload.password;
      const res = await API.put("/users/update-profile", payload);
      setMessage({
        text: res.data.message || "Profile updated successfully.",
        type: "ok",
      });
      setUser((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Error updating profile.",
        type: "err",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "—";

  if (loading) {
    return (
      <>
        <style>{style}</style>
        <div className="ep-loading">Loading Profile…</div>
      </>
    );
  }

  return (
    <>
      <style>{style}</style>
      <div className="ep-root">
        {/* Topbar */}
        <nav className="ep-topbar">
          <div className="ep-logo" onClick={() => navigate("/")}>
            <div className="ep-logo-mark" />
            <div className="ep-logo-text" translate="no">
              Event<span>y</span>
            </div>
          </div>
          <button className="ep-back-btn" onClick={() => navigate(-1)}>
            <span>←</span>
            <span>Back</span>
          </button>
        </nav>

        <main className="ep-main">
          <p className="ep-breadcrumb">Account Settings</p>
          <h1 className="ep-title">Edit Profile</h1>
          <p className="ep-subtitle">
            Update your personal information and security credentials.
          </p>

          {/* Avatar row */}
          <div className="ep-avatar-row">
            <div className="ep-avatar">{initials}</div>
            <div className="ep-avatar-info">
              <div className="ep-avatar-name">{user.fullName || "—"}</div>
              <div className="ep-avatar-label">◆ Member Account</div>
            </div>
          </div>

          {/* Form panel */}
          <div className="ep-panel">
            <form onSubmit={handleSubmit} noValidate>
              <p className="ep-panel-title">◆ Personal Information</p>

              <div className="ep-field">
                <label className="ep-label">Full Name</label>
                <input
                  className="ep-input"
                  name="fullName"
                  value={user.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>

              <div className="ep-field">
                <label className="ep-label">Email Address</label>
                <input
                  className="ep-input"
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  autoComplete="email"
                />
              </div>

              <div className="ep-field">
                <label className="ep-label">Phone Number</label>
                <input
                  className="ep-input"
                  name="phoneNumber"
                  type="tel"
                  value={user.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 (000) 000-0000"
                  autoComplete="tel"
                />
              </div>

              <div className="ep-divider" />

              <p className="ep-panel-title">◆ Security</p>

              <div className="ep-field">
                <label className="ep-label">New Password</label>
                <input
                  className="ep-input"
                  name="password"
                  type="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current"
                  autoComplete="new-password"
                />
                <p className="ep-field-note">
                  Only fill this in if you wish to change your password.
                </p>
              </div>

              <button type="submit" className="ep-submit" disabled={submitting}>
                <span>{submitting ? "Saving…" : "Save Changes"}</span>
              </button>

              {message && (
                <div className={`ep-msg ${message.type}`}>{message.text}</div>
              )}
            </form>
          </div>
        </main>

        <footer className="ep-footer">
          <p className="ep-footer-copy">
            © 2026 <span>Eventy</span> — All rights reserved.
          </p>
          <p className="ep-footer-copy" style={{ opacity: 0.5 }}>
            Luxury Event Planning Platform
          </p>
        </footer>
      </div>
    </>
  );
}

export default EditProfile;
