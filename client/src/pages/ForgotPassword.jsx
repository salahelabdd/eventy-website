import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,500&family=Cinzel:wght@400;600&family=Raleway:wght@200;300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black:      #0A0A0A;
    --obsidian:   #111118;
    --navy:       #0D1B2A;
    --gold:       #C8A951;
    --gold-light: #E2C97E;
    --gold-dim:   rgba(200,169,81,0.10);
    --cream:      #F0EAD6;
    --muted:      rgba(240,234,214,0.38);
    --border:     rgba(200,169,81,0.2);
  }

  .fp-root {
    font-family: 'Raleway', sans-serif;
    min-height: 100vh;
    background: var(--black);
    display: flex;
  }

  .fp-left {
    flex: 1; position: relative; overflow: hidden;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 56px 60px;
  }
  .fp-left::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 20% 15%, rgba(200,169,81,0.18) 0%, transparent 45%),
      radial-gradient(ellipse at 80% 85%, rgba(13,27,42,0.9) 0%, transparent 55%),
      linear-gradient(175deg, var(--navy) 0%, #080C12 55%, #0A0A0A 100%);
    z-index: 0;
  }
  .fp-left::after {
    content: '';
    position: absolute; inset: 0;
    background-image: repeating-linear-gradient(
      45deg, transparent, transparent 80px,
      rgba(200,169,81,0.025) 80px, rgba(200,169,81,0.025) 81px
    );
    z-index: 0;
  }
  .fp-frame {
    position: absolute;
    top: 28px; left: 28px; right: 28px; bottom: 28px;
    border: 1px solid rgba(200,169,81,0.12);
    z-index: 1; pointer-events: none;
  }
  .fp-corner {
    position: absolute; width: 10px; height: 10px;
    background: var(--gold); transform: rotate(45deg);
    z-index: 2; pointer-events: none;
  }
  .fp-corner.tl { top: 22px; left: 22px; }
  .fp-corner.tr { top: 22px; right: 22px; }
  .fp-corner.bl { bottom: 22px; left: 22px; }
  .fp-corner.br { bottom: 22px; right: 22px; }

  .fp-left-top { position: relative; z-index: 2; }
  .fp-left-mid  { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .fp-left-bot  { position: relative; z-index: 2; }

  .fp-logo { display: flex; align-items: center; gap: 14px; }
  .fp-logo-mark {
    width: 38px; height: 38px;
    border: 1.5px solid var(--gold); transform: rotate(45deg);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .fp-logo-mark::after {
    content: ''; width: 16px; height: 16px;
    border: 1px solid var(--gold); opacity: 0.5;
  }
  .fp-logo-text {
    font-family: 'Cinzel', serif;
    font-size: 22px; font-weight: 600;
    letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase;
  }
  .fp-logo-text span { color: var(--gold); }

  .fp-eyebrow {
    font-size: 9px; font-weight: 300; letter-spacing: 0.45em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 20px;
  }
  .fp-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(42px, 4vw, 62px); font-weight: 300;
    color: var(--cream); line-height: 1.1; margin-bottom: 28px;
  }
  .fp-headline em { color: var(--gold-light); font-style: italic; }
  .fp-rule {
    width: 60px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    margin-bottom: 22px;
  }
  .fp-sub {
    font-size: 13px; font-weight: 200;
    color: var(--muted); line-height: 1.9;
    max-width: 380px; letter-spacing: 0.04em;
  }

  .fp-form-panel {
    width: 500px; flex-shrink: 0;
    background: var(--obsidian);
    display: flex; flex-direction: column; justify-content: center;
    padding: 72px 56px;
    position: relative;
    border-left: 1px solid rgba(200,169,81,0.1);
  }
  .fp-form-panel::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent 0%, var(--gold) 40%, var(--gold-light) 60%, transparent 100%);
  }
  .fp-form-panel::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 200px;
    background: radial-gradient(ellipse at 50% 0%, rgba(200,169,81,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .fp-form-eyebrow {
    font-size: 9px; font-weight: 300; letter-spacing: 0.45em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 12px; opacity: 0.8;
  }
  .fp-form-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px; font-weight: 300;
    color: var(--cream); margin-bottom: 6px; line-height: 1.1;
  }
  .fp-form-sub {
    font-size: 12px; font-weight: 200;
    color: var(--muted); margin-bottom: 44px;
    letter-spacing: 0.06em; line-height: 1.7;
  }

  .fp-field { margin-bottom: 28px; }
  .fp-label {
    display: block; font-size: 9px; font-weight: 300;
    letter-spacing: 0.32em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 10px; opacity: 0.9;
  }
  .fp-input {
    width: 100%; background: transparent;
    border: none; border-bottom: 1px solid var(--border);
    padding: 10px 0 12px;
    font-family: 'Raleway', sans-serif; font-size: 14px; font-weight: 300;
    color: var(--cream); outline: none;
    transition: border-color 0.3s; letter-spacing: 0.05em;
  }
  .fp-input::placeholder { color: rgba(240,234,214,0.2); }
  .fp-input:focus { border-bottom-color: var(--gold); }

  .fp-btn {
    width: 100%; padding: 17px;
    background: transparent; border: 1px solid var(--gold);
    color: var(--gold);
    font-family: 'Cinzel', serif; font-size: 11px; font-weight: 400;
    letter-spacing: 0.35em; text-transform: uppercase;
    cursor: pointer; position: relative; overflow: hidden;
    transition: color 0.4s;
  }
  .fp-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
    z-index: 0;
  }
  .fp-btn:hover:not(:disabled)::before { transform: scaleX(1); }
  .fp-btn:hover:not(:disabled) { color: var(--black); }
  .fp-btn span { position: relative; z-index: 1; }
  .fp-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .fp-footer {
    text-align: center; font-size: 12px; font-weight: 200;
    color: var(--muted); letter-spacing: 0.05em; margin-top: 24px;
  }
  .fp-footer a {
    color: var(--gold-light); font-weight: 300; text-decoration: none;
  }
  .fp-footer a:hover { opacity: 0.7; }

  .fp-error {
    border: 1px solid rgba(180,50,50,0.4); background: rgba(180,50,50,0.07);
    color: #E08080; font-size: 12px; font-weight: 300; letter-spacing: 0.04em;
    padding: 12px 16px; margin-bottom: 24px; line-height: 1.5;
  }
  .fp-success {
    border: 1px solid rgba(50,150,80,0.4); background: rgba(50,150,80,0.07);
    color: #7EC89A; font-size: 12px; font-weight: 300; letter-spacing: 0.04em;
    padding: 12px 16px; margin-bottom: 24px; line-height: 1.5;
  }

  .fp-otp-row {
    display: flex; gap: 12px; justify-content: center; margin-bottom: 32px;
  }
  .fp-otp-input {
    width: 52px; height: 60px; background: transparent;
    border: 1px solid var(--border);
    font-family: 'Cinzel', serif; font-size: 22px; font-weight: 600;
    color: var(--cream); text-align: center; outline: none;
    transition: border-color 0.3s;
  }
  .fp-otp-input:focus { border-color: var(--gold); }

  .fp-resend {
    text-align: center; font-size: 12px; font-weight: 200;
    color: var(--muted); letter-spacing: 0.05em; margin-bottom: 32px;
  }
  .fp-resend-btn {
    background: none; border: none; cursor: pointer;
    color: var(--gold-light); font-size: 12px; font-weight: 300;
    font-family: 'Raleway', sans-serif; letter-spacing: 0.05em;
    padding: 0; text-decoration: underline; text-underline-offset: 3px;
  }
  .fp-resend-btn:hover:not(:disabled) { opacity: 0.7; }
  .fp-resend-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .fp-back-btn {
    background: none; border: none; cursor: pointer;
    color: var(--gold-light); font-size: 12px; font-weight: 300;
    font-family: 'Raleway', sans-serif; letter-spacing: 0.05em;
    padding: 0; text-decoration: underline; text-underline-offset: 3px;
  }
  .fp-back-btn:hover { opacity: 0.7; }

  @media (max-width: 900px) {
    .fp-left { display: none; }
    .fp-form-panel { width: 100%; padding: 56px 32px; }
  }
`;

const OTP_LENGTH = 6;

export default function ForgotPassword() {
  const [step, setStep] = useState("email"); // "email" | "reset"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();

  // ── Step 1: Send reset code ──
  const handleSendCode = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await API.post("/users/forgot-password", { email });
      setStep("reset");
      startResendCooldown();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not send reset code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify code + set new password ──
  const handleReset = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await API.post("/users/reset-password", { email, code, newPassword });
      setSuccess("Password reset successfully. Redirecting to sign in…");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid or expired code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Resend ──
  const handleResend = async () => {
    setError("");
    try {
      await API.post("/users/forgot-password", { email });
      startResendCooldown();
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend code.");
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  // ── OTP handlers ──
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < OTP_LENGTH - 1)
      document.getElementById(`fp-otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      document.getElementById(`fp-otp-${index - 1}`)?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (pasted.length) {
      setOtp([
        ...pasted.split(""),
        ...Array(OTP_LENGTH - pasted.length).fill(""),
      ]);
      document
        .getElementById(`fp-otp-${Math.min(pasted.length, OTP_LENGTH - 1)}`)
        ?.focus();
      e.preventDefault();
    }
  };

  return (
    <>
      <style>{style}</style>
      <div className="fp-root">
        {/* ── Left visual panel ── */}
        <div className="fp-left">
          <div className="fp-frame" />
          <div className="fp-corner tl" />
          <div className="fp-corner tr" />
          <div className="fp-corner bl" />
          <div className="fp-corner br" />

          <div className="fp-left-top">
            <div className="fp-logo">
              <div className="fp-logo-mark" />
              <div className="fp-logo-text" translate="no">
                Event<span>y</span>
              </div>
            </div>
          </div>

          <div className="fp-left-mid">
            <p className="fp-eyebrow">Account Recovery</p>
            <h1 className="fp-headline">
              Regain access
              <br />
              to your <em>world</em>
              <br />
              of events.
            </h1>
            <div className="fp-rule" />
            <p className="fp-sub">
              Enter your registered email address and we'll send you a secure
              code to reset your password and restore access to your account.
            </p>
          </div>

          <div className="fp-left-bot" />
        </div>

        {/* ── Right form panel ── */}
        <div className="fp-form-panel">
          {/* ════════ EMAIL STEP ════════ */}
          {step === "email" && (
            <>
              <p className="fp-form-eyebrow">Password Recovery</p>
              <h2 className="fp-form-title">Forgot password?</h2>
              <p className="fp-form-sub">
                Enter the email address associated with your account and we'll
                send you a 6-digit reset code.
              </p>

              {error && <div className="fp-error">{error}</div>}

              <div className="fp-field">
                <label className="fp-label">Email Address</label>
                <input
                  className="fp-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                />
              </div>

              <button
                className="fp-btn"
                onClick={handleSendCode}
                disabled={loading}
              >
                <span>{loading ? "Sending Code…" : "Send Reset Code"}</span>
              </button>

              <p className="fp-footer">
                Remembered it?&ensp;<Link to="/login">Back to sign in</Link>
              </p>
            </>
          )}

          {/* ════════ RESET STEP ════════ */}
          {step === "reset" && (
            <>
              <p className="fp-form-eyebrow">Password Recovery</p>
              <h2 className="fp-form-title">Reset password</h2>
              <p className="fp-form-sub">
                Enter the 6-digit code sent to{" "}
                <span style={{ color: "var(--gold-light)", fontWeight: 300 }}>
                  {email}
                </span>
                , then choose a new password.
              </p>

              {error && <div className="fp-error">{error}</div>}
              {success && <div className="fp-success">{success}</div>}

              <div className="fp-otp-row" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`fp-otp-${i}`}
                    className="fp-otp-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <div className="fp-resend">
                {resendCooldown > 0 ? (
                  <>Resend code in {resendCooldown}s</>
                ) : (
                  <>
                    Didn't receive it?&ensp;
                    <button
                      className="fp-resend-btn"
                      onClick={handleResend}
                      disabled={loading}
                    >
                      Resend code
                    </button>
                  </>
                )}
              </div>

              <div className="fp-field">
                <label className="fp-label">New Password</label>
                <input
                  className="fp-input"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="fp-field">
                <label className="fp-label">Confirm New Password</label>
                <input
                  className="fp-input"
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                className="fp-btn"
                onClick={handleReset}
                disabled={loading || !!success}
              >
                <span>{loading ? "Resetting…" : "Reset Password"}</span>
              </button>

              <p className="fp-footer">
                Wrong email?&ensp;
                <button
                  className="fp-back-btn"
                  onClick={() => {
                    setStep("email");
                    setError("");
                    setOtp(Array(OTP_LENGTH).fill(""));
                  }}
                >
                  Go back
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
