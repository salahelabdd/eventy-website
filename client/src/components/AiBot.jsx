import { useState, useRef, useEffect } from "react";
import { THEME_KEY } from "../utils/themeUtils";

const API_BASE = "http://localhost:5000"; // <-- your backend URL
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = `You are Eventy's friendly assistant. Eventy is a luxury event planning platform in Egypt.
- Book venues for weddings, birthdays, proms, graduations, engagements, anniversaries, conferences, corporate events, concerts, exhibitions, galas, and more.
- Accommodation: hotels, resorts, villas, chalets, suites, hostels.
- Additional services available (catering, photography, decoration, etc).
- Must be signed in to book. Register via Sign In page.
- Roles: customer (browse & book), provider (manage listings), admin (full control).
- Reservations viewable under "My Reservation" in nav.
- Supports Arabic and English via AR/EN toggle.
- Venues priced per hour. Hotels per night.
Use the LIVE DATA below to answer questions accurately and directly. Never say "browse the site" if the answer is in the data.`;

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Raleway:wght@200;300;400&display=swap');
  .aib-fab {
    position:fixed; bottom:28px; right:28px; z-index:9999;
    width:54px; height:54px; border-radius:50%;
    background:linear-gradient(135deg,#C8A951,#A8843A);
    border:none; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 20px rgba(200,169,81,0.45);
    transition:transform 0.2s,box-shadow 0.2s; font-size:22px;
  }
  .aib-fab:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(200,169,81,0.6);}
  .aib-window {
    position:fixed; bottom:94px; right:28px; z-index:9998;
    width:360px; background:#111118;
    border:1px solid rgba(200,169,81,0.22);
    display:flex; flex-direction:column;
    font-family:'Raleway',sans-serif;
    box-shadow:0 20px 60px rgba(0,0,0,0.7);
    overflow:hidden;
    transition:opacity 0.22s,transform 0.22s;
    transform-origin:bottom right;
  }
  .aib-window.closed{opacity:0;pointer-events:none;transform:scale(0.9) translateY(10px);}
  .aib-window.open{opacity:1;pointer-events:all;transform:scale(1) translateY(0);}
  .aib-header {
    padding:14px 18px; border-bottom:1px solid rgba(200,169,81,0.2);
    display:flex; align-items:center; gap:10px;
    background:rgba(10,10,10,0.8); position:relative;
  }
  .aib-header::after{content:'';position:absolute;bottom:-1px;left:0;width:56px;height:1px;background:#C8A951;}
  .aib-avatar {
    width:32px; height:32px; border-radius:50%; flex-shrink:0;
    background:rgba(200,169,81,0.12); border:1px solid rgba(200,169,81,0.35);
    display:flex; align-items:center; justify-content:center; font-size:14px;
  }
  .aib-title{font-family:'Cinzel',serif;font-size:11px;font-weight:600;letter-spacing:0.22em;text-transform:uppercase;color:#E2C97E;}
  .aib-subtitle{font-size:10px;color:rgba(240,234,214,0.35);letter-spacing:0.06em;margin-top:2px;display:flex;align-items:center;gap:5px;}
  .aib-dot{width:6px;height:6px;border-radius:50%;background:#8DB87A;animation:aib-pulse 2s infinite;}
  @keyframes aib-pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  .aib-close {
    background:none; border:1px solid rgba(200,169,81,0.2);
    color:rgba(240,234,214,0.4); width:28px; height:28px;
    cursor:pointer; font-size:13px; display:flex; align-items:center; justify-content:center;
    transition:border-color 0.2s,color 0.2s; flex-shrink:0; margin-left:auto;
  }
  .aib-close:hover{border-color:rgba(200,169,81,0.5);color:#C8A951;}
  .aib-messages {
    flex:1; overflow-y:auto; padding:16px;
    display:flex; flex-direction:column; gap:10px;
    max-height:320px; min-height:200px;
    scrollbar-width:thin; scrollbar-color:rgba(200,169,81,0.15) transparent;
  }
  .aib-msg{max-width:88%;padding:10px 14px;font-size:13px;line-height:1.65;letter-spacing:0.02em;word-break:break-word;}
  .aib-msg.bot{background:rgba(200,169,81,0.07);border:1px solid rgba(200,169,81,0.14);color:#F0EAD6;align-self:flex-start;border-radius:0 8px 8px 8px;}
  .aib-msg.user{background:rgba(200,169,81,0.16);border:1px solid rgba(200,169,81,0.28);color:#E2C97E;align-self:flex-end;border-radius:8px 0 8px 8px;}
  .aib-typing{align-self:flex-start;padding:12px 16px;background:rgba(200,169,81,0.07);border:1px solid rgba(200,169,81,0.14);border-radius:0 8px 8px 8px;display:flex;gap:5px;align-items:center;}
  .aib-typing span{width:6px;height:6px;border-radius:50%;background:#C8A951;opacity:0.5;animation:aib-bounce 1.2s infinite;}
  .aib-typing span:nth-child(2){animation-delay:0.2s;}
  .aib-typing span:nth-child(3){animation-delay:0.4s;}
  @keyframes aib-bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
  .aib-chips{display:flex;flex-wrap:wrap;gap:6px;padding:4px 16px 12px;}
  .aib-chip {
    font-family:'Cinzel',serif; font-size:8.5px; letter-spacing:0.18em; text-transform:uppercase;
    padding:5px 12px; border:1px solid rgba(200,169,81,0.22);
    background:transparent; color:rgba(200,169,81,0.65); cursor:pointer;
    transition:border-color 0.2s,color 0.2s,background 0.2s;
  }
  .aib-chip:hover{border-color:rgba(200,169,81,0.5);color:#E2C97E;background:rgba(200,169,81,0.07);}
  .aib-input-row{display:flex;border-top:1px solid rgba(200,169,81,0.14);padding:10px 14px;gap:8px;background:rgba(10,10,10,0.4);}
  .aib-input {
    flex:1; background:rgba(255,255,255,0.04); border:1px solid rgba(200,169,81,0.18);
    color:#F0EAD6; padding:9px 13px;
    font-family:'Raleway',sans-serif; font-size:13px; font-weight:200;
    letter-spacing:0.03em; outline:none; transition:border-color 0.22s;
  }
  .aib-input:focus{border-color:rgba(200,169,81,0.4);}
  .aib-input::placeholder{color:rgba(240,234,214,0.25);}
  .aib-input:disabled{opacity:0.5;}
  .aib-send {
    width:38px; height:38px; flex-shrink:0;
    background:#C8A951; border:none; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    font-size:16px; color:#0A0A0A; transition:background 0.2s,transform 0.15s;
  }
  .aib-send:hover:not(:disabled){background:#E2C97E;transform:scale(1.05);}
  .aib-send:disabled{opacity:0.4;cursor:not-allowed;}
  @media(max-width:480px){
    .aib-window{width:calc(100vw - 32px);right:16px;}
    .aib-fab{right:16px;bottom:16px;}
  }

  /* ── Light mode overrides ── */
  html.light-mode .aib-window {
    background: #ede5d0;
    border-color: rgba(168,135,42,0.28);
    box-shadow: 0 20px 60px rgba(44,32,14,0.18);
  }
  html.light-mode .aib-header {
    background: rgba(237,229,208,0.97);
    border-bottom-color: rgba(168,135,42,0.22);
  }
  html.light-mode .aib-avatar {
    background: rgba(168,135,42,0.12);
    border-color: rgba(168,135,42,0.35);
  }
  html.light-mode .aib-title { color: #a8872a; }
  html.light-mode .aib-subtitle { color: rgba(44,32,14,0.45); }
  html.light-mode .aib-close {
    border-color: rgba(168,135,42,0.22);
    color: rgba(44,32,14,0.45);
  }
  html.light-mode .aib-close:hover {
    border-color: rgba(168,135,42,0.5);
    color: #a8872a;
  }
  html.light-mode .aib-messages {
    scrollbar-color: rgba(168,135,42,0.25) transparent;
  }
  html.light-mode .aib-msg.bot {
    background: rgba(168,135,42,0.08);
    border-color: rgba(168,135,42,0.18);
    color: #1c1610;
  }
  html.light-mode .aib-msg.user {
    background: rgba(168,135,42,0.18);
    border-color: rgba(168,135,42,0.32);
    color: #7a5f10;
  }
  html.light-mode .aib-typing {
    background: rgba(168,135,42,0.08);
    border-color: rgba(168,135,42,0.18);
  }
  html.light-mode .aib-chip {
    border-color: rgba(168,135,42,0.28);
    color: rgba(120,90,20,0.75);
  }
  html.light-mode .aib-chip:hover {
    border-color: rgba(168,135,42,0.55);
    color: #a8872a;
    background: rgba(168,135,42,0.08);
  }
  html.light-mode .aib-input-row {
    background: rgba(228,217,192,0.6);
    border-top-color: rgba(168,135,42,0.18);
  }
  html.light-mode .aib-input {
    background: rgba(255,252,244,0.85);
    border-color: rgba(168,135,42,0.22);
    color: #1c1610;
  }
  html.light-mode .aib-input:focus { border-color: rgba(168,135,42,0.45); }
  html.light-mode .aib-input::placeholder { color: rgba(44,32,14,0.35); }
`;

const QUICK_CHIPS = [
  "What venues are available?",
  "Show me hotels",
  "What services do you offer?",
  "How do I book?",
  "What is Eventy?",
];

async function fetchSiteData() {
  try {
    const [venuesRes, hotelsRes, servicesRes] = await Promise.all([
      fetch(`${API_BASE}/api/venues`).catch(() => null),
      fetch(`${API_BASE}/api/hotels`).catch(() => null),
      fetch(`${API_BASE}/api/services`).catch(() => null),
    ]);

    const venues = venuesRes?.ok ? await venuesRes.json() : [];
    const hotels = hotelsRes?.ok ? await hotelsRes.json() : [];
    const services = servicesRes?.ok ? await servicesRes.json() : [];

    let dataBlock = "\n\nLIVE DATA:\n";

    if (venues.length > 0) {
      dataBlock +=
        "VENUES:\n" +
        venues
          .map(
            (v) =>
              `${v.name}|${v.location}|${v.eventType}|${v.capacity} guests|$${v.pricePerHour}/hr|${v.isAvailable ? "Available" : "Unavailable"}`,
          )
          .join("\n");
    }

    if (hotels.length > 0) {
      dataBlock +=
        "\nHOTELS:\n" +
        hotels
          .map(
            (h) =>
              `${h.name}|${h.location}|${h.type}|${h.stars}★|$${h.pricePerNight}/night|${h.isAvailable ? "Available" : "Unavailable"}`,
          )
          .join("\n");
    }

    if (services.length > 0) {
      dataBlock +=
        "\nSERVICES:\n" +
        services
          .map(
            (s) =>
              `${s.name}|${s.category || ""}|${s.price ? "$" + s.price : ""}|${s.isAvailable ? "Available" : "Unavailable"}`,
          )
          .join("\n");
    }

    return dataBlock;
  } catch {
    return "";
  }
}

export default function AiBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Welcome to Eventy! ✦ I can help you find the perfect venue, hotel, or service. What are you planning?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const dbCache = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      // Fetch database once when bot first opens
      if (!dbCache.current) {
        fetchSiteData().then((data) => {
          dbCache.current = data;
        });
      }
    }
  }, [open]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setInput("");
    setChipsVisible(false);

    const newMessages = [...messages, { role: "user", text: trimmed }];
    setMessages(newMessages);

    try {
      const liveData = dbCache.current || "";
      const fullPrompt = SYSTEM_PROMPT + liveData;

      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: fullPrompt },
              ...messages.map((m) => ({
                role: m.role === "user" ? "user" : "assistant",
                content: m.text,
              })),
              { role: "user", content: trimmed },
            ],
          }),
        },
      );

      const data = await res.json();

      if (data.error) {
        setMessages([
          ...newMessages,
          { role: "bot", text: "Error: " + data.error.message },
        ]);
      } else {
        const reply =
          data.choices?.[0]?.message?.content || "Sorry, no response received.";
        setMessages([...newMessages, { role: "bot", text: reply }]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "bot", text: "Network error: " + err.message },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      <style>{style}</style>

      <button
        className="aib-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Eventy Assistant"
      >
        {open ? "✕" : "💬"}
      </button>

      <div className={`aib-window ${open ? "open" : "closed"}`}>
        <div className="aib-header">
          <div className="aib-avatar">✦</div>
          <div>
            <div className="aib-title">Eventy Assistant</div>
            <div className="aib-subtitle">
              <span className="aib-dot" />
              Online — ask me anything
            </div>
          </div>
          <button
            className="aib-close"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="aib-messages">
          {messages.map((m, i) => (
            <div key={i} className={`aib-msg ${m.role}`}>
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="aib-typing">
              <span />
              <span />
              <span />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {chipsVisible && (
          <div className="aib-chips">
            {QUICK_CHIPS.map((q) => (
              <button
                key={q}
                className="aib-chip"
                onClick={() => sendMessage(q)}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div className="aib-input-row">
          <input
            ref={inputRef}
            className="aib-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about venues, hotels, services…"
            disabled={loading}
          />
          <button
            className="aib-send"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            aria-label="Send"
          >
            →
          </button>
        </div>
      </div>
    </>
  );
}
