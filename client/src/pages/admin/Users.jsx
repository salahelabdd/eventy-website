import { useEffect, useState } from "react";
import API from "../../api/axios";

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
    --danger:     #C0504A;
    --danger-dim: rgba(192,80,74,0.12);
  }

  .adm-root {
    font-family: 'Raleway', sans-serif;
    min-height: 100vh;
    color: var(--cream);
    position: relative;

    /* Luxury herringbone diagonal stripe background */
    background-color: #0A0A0A;
    background-image:
      repeating-linear-gradient(
        135deg,
        transparent,
        transparent 28px,
        rgba(200,169,81,0.03) 28px,
        rgba(200,169,81,0.03) 29px
      ),
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 28px,
        rgba(200,169,81,0.018) 28px,
        rgba(200,169,81,0.018) 29px
      ),
      radial-gradient(ellipse at 15% 0%, rgba(200,169,81,0.07) 0%, transparent 50%),
      radial-gradient(ellipse at 85% 100%, rgba(13,27,42,0.6) 0%, transparent 50%);
  }

  /* Edge vignette so stripes fade to darkness at corners */
  .adm-root::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.62) 100%);
  }

  /* ── Top Bar ── */
  .adm-topbar {
    background: rgba(17,17,24,0.94);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 22px 48px;
    display: flex; align-items: center; justify-content: space-between;
    position: relative; z-index: 10;
  }
  .adm-topbar::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }

  .adm-logo { display: flex; align-items: center; gap: 14px; }
  .adm-logo-mark {
    width: 32px; height: 32px;
    border: 1.5px solid var(--gold);
    transform: rotate(45deg);
    flex-shrink: 0;
  }
  .adm-logo-text {
    font-family: 'Cinzel', serif;
    font-size: 18px; font-weight: 600;
    letter-spacing: 0.28em; color: var(--cream); text-transform: uppercase;
  }
  .adm-logo-text span { color: var(--gold); }

  .adm-topbar-badge {
    font-size: 9px; font-weight: 300;
    letter-spacing: 0.38em; text-transform: uppercase;
    color: var(--gold); opacity: 0.75;
    border: 1px solid var(--border); padding: 5px 14px;
  }

  /* ── Page Content ── */
  .adm-content {
    max-width: 1100px; margin: 0 auto;
    padding: 56px 48px;
    position: relative; z-index: 1;
  }

  .adm-page-header { margin-bottom: 44px; }
  .adm-eyebrow {
    font-size: 9px; font-weight: 300;
    letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 12px; opacity: 0.8;
  }
  .adm-page-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 46px; font-weight: 300;
    color: var(--cream); line-height: 1.1;
  }
  .adm-rule {
    width: 60px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    margin-top: 18px;
  }
  .adm-count {
    margin-top: 14px;
    font-size: 12px; font-weight: 200;
    color: var(--muted); letter-spacing: 0.06em;
  }
  .adm-count strong { color: var(--gold-light); font-weight: 400; }

  /* ── Toolbar ── */
  .adm-toolbar {
    display: flex; align-items: center; gap: 20px;
    margin-bottom: 36px; flex-wrap: wrap;
  }

  .adm-search-wrap {
    position: relative; flex: 1;
    min-width: 200px; max-width: 380px;
  }
  .adm-search-icon {
    position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    color: var(--gold); opacity: 0.5; font-size: 15px;
    pointer-events: none; font-style: normal; line-height: 1;
  }
  .adm-search {
    width: 100%; background: transparent; border: none;
    border-bottom: 1px solid var(--border);
    padding: 10px 0 12px 26px;
    font-family: 'Raleway', sans-serif;
    font-size: 13px; font-weight: 300;
    color: var(--cream); outline: none;
    transition: border-color 0.3s; letter-spacing: 0.05em;
  }
  .adm-search::placeholder { color: rgba(240,234,214,0.22); }
  .adm-search:focus { border-bottom-color: var(--gold); }

  .adm-filters { display: flex; gap: 8px; flex-wrap: wrap; }
  .adm-filter-btn {
    font-family: 'Cinzel', serif;
    font-size: 8px; font-weight: 400;
    letter-spacing: 0.28em; text-transform: uppercase;
    padding: 8px 18px;
    border: 1px solid var(--border);
    background: transparent; color: var(--muted);
    cursor: pointer;
    transition: color 0.25s, border-color 0.25s, background 0.25s;
  }
  .adm-filter-btn:hover { color: var(--gold); border-color: var(--gold-line); }
  .adm-filter-btn.active        { background: var(--gold-dim); border-color: var(--gold); color: var(--gold-light); }
  .adm-filter-btn.active-admin  { background: rgba(226,201,126,0.1); border-color: rgba(226,201,126,0.5); color: #E2C97E; }
  .adm-filter-btn.active-provider { background: rgba(136,192,208,0.08); border-color: rgba(136,192,208,0.4); color: #88C0D0; }
  .adm-filter-btn.active-customer { background: var(--gold-dim); border-color: var(--gold); color: var(--gold-light); }

  /* ── Cards ── */
  .adm-cards { display: flex; flex-direction: column; gap: 18px; }

  .adm-card {
    background: rgba(17,17,24,0.80);
    backdrop-filter: blur(8px);
    border: 1px solid var(--border);
    padding: 28px 32px; position: relative;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .adm-card::before {
    content: ''; position: absolute; top: 0; left: 0; width: 3px; bottom: 0;
    background: linear-gradient(180deg, var(--gold), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .adm-card:hover { border-color: rgba(200,169,81,0.4); box-shadow: 0 4px 32px rgba(200,169,81,0.07); }
  .adm-card:hover::before { opacity: 1; }

  .adm-card-top {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 24px;
  }
  .adm-card-info { flex: 1; }
  .adm-card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 400; color: var(--cream); margin-bottom: 6px;
  }
  .adm-card-email {
    font-size: 12px; font-weight: 200; color: var(--muted);
    letter-spacing: 0.06em; margin-bottom: 16px;
  }
  .adm-card-meta { display: flex; gap: 24px; flex-wrap: wrap; }
  .adm-meta-label {
    font-size: 8px; font-weight: 300;
    letter-spacing: 0.35em; text-transform: uppercase;
    color: var(--gold); opacity: 0.65; margin-bottom: 4px;
  }
  .adm-meta-value { font-size: 12px; font-weight: 300; color: var(--muted); letter-spacing: 0.04em; }

  .adm-role-badge {
    display: inline-block; font-size: 8px; font-weight: 400;
    letter-spacing: 0.25em; text-transform: uppercase;
    padding: 4px 12px; border: 1px solid var(--border);
    color: var(--gold); background: var(--gold-dim);
  }
  .adm-role-badge.admin    { color: #E2C97E; border-color: rgba(226,201,126,0.4); background: rgba(226,201,126,0.08); }
  .adm-role-badge.provider { color: #88C0D0; border-color: rgba(136,192,208,0.35); background: rgba(136,192,208,0.07); }

  .adm-card-actions { display: flex; gap: 10px; align-items: flex-start; flex-shrink: 0; }

  /* Buttons */
  .adm-btn {
    font-family: 'Cinzel', serif; font-size: 9px; font-weight: 400;
    letter-spacing: 0.28em; text-transform: uppercase;
    padding: 10px 20px; border: 1px solid var(--border);
    background: transparent; color: var(--gold);
    cursor: pointer; position: relative; overflow: hidden; transition: color 0.3s;
  }
  .adm-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--gold), #A8843A);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: 0;
  }
  .adm-btn:hover::before { transform: scaleX(1); }
  .adm-btn:hover { color: var(--black); }
  .adm-btn span { position: relative; z-index: 1; }

  .adm-btn-danger { border-color: rgba(192,80,74,0.4); color: #E08080; }
  .adm-btn-danger::before { background: linear-gradient(90deg, var(--danger), #9B3A35); }
  .adm-btn-danger:hover { color: var(--cream); }

  /* ── Overlays & Modals ── */
  .adm-overlay {
    position: fixed; inset: 0; background: rgba(10,10,10,0.85);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn  { from { opacity: 0; }               to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .adm-modal {
    background: var(--obsidian); border: 1px solid var(--border);
    width: 100%; max-width: 480px; padding: 44px 44px 40px;
    position: relative; animation: slideUp 0.25s ease;
  }
  .adm-modal::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), transparent);
  }
  .adm-modal-eyebrow {
    font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
    color: var(--gold); opacity: 0.8; margin-bottom: 10px;
  }
  .adm-modal-title {
    font-family: 'Cormorant Garamond', serif; font-size: 34px; font-weight: 300;
    color: var(--cream); margin-bottom: 32px; line-height: 1.1;
  }
  .adm-modal-close {
    position: absolute; top: 18px; right: 20px; background: none; border: none;
    color: var(--muted); font-size: 20px; cursor: pointer; transition: color 0.2s; line-height: 1;
  }
  .adm-modal-close:hover { color: var(--gold); }

  .adm-field { margin-bottom: 26px; }
  .adm-label {
    display: block; font-size: 9px; font-weight: 300;
    letter-spacing: 0.32em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 10px; opacity: 0.9;
  }
  .adm-input {
    width: 100%; background: transparent; border: none;
    border-bottom: 1px solid var(--border); padding: 10px 0 12px;
    font-family: 'Raleway', sans-serif; font-size: 14px; font-weight: 300;
    color: var(--cream); outline: none; transition: border-color 0.3s; letter-spacing: 0.05em;
  }
  .adm-input::placeholder { color: rgba(240,234,214,0.2); }
  .adm-input:focus { border-bottom-color: var(--gold); }

  .adm-select {
    width: 100%; background: var(--navy-mid); border: 1px solid var(--border);
    padding: 10px 14px; font-family: 'Raleway', sans-serif; font-size: 13px; font-weight: 300;
    color: var(--cream); outline: none; cursor: pointer; letter-spacing: 0.05em;
    appearance: none; transition: border-color 0.3s;
  }
  .adm-select:focus { border-color: var(--gold); }

  .adm-modal-actions { display: flex; gap: 12px; margin-top: 36px; }
  .adm-modal-actions .adm-btn { flex: 1; padding: 14px; }

  .adm-confirm {
    background: var(--obsidian); border: 1px solid rgba(192,80,74,0.35);
    width: 100%; max-width: 400px; padding: 40px 40px 36px;
    position: relative; animation: slideUp 0.25s ease;
  }
  .adm-confirm::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--danger), #E08080, transparent);
  }
  .adm-confirm-gold { border-color: var(--border); }
  .adm-confirm-gold::before { background: linear-gradient(90deg, transparent, var(--gold), var(--gold-light), transparent); }

  .adm-confirm-eyebrow {
    font-size: 9px; font-weight: 300; letter-spacing: 0.45em; text-transform: uppercase;
    color: #E08080; opacity: 0.8; margin-bottom: 10px;
  }
  .adm-confirm-eyebrow.gold { color: var(--gold); }
  .adm-confirm-title {
    font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 300;
    color: var(--cream); margin-bottom: 14px;
  }
  .adm-confirm-body {
    font-size: 12px; font-weight: 200; color: var(--muted);
    line-height: 1.8; letter-spacing: 0.04em; margin-bottom: 32px;
  }
  .adm-confirm-body strong { color: var(--cream); font-weight: 400; }
  .adm-confirm-actions { display: flex; gap: 12px; }
  .adm-confirm-actions .adm-btn { flex: 1; padding: 13px; }

  .adm-empty { text-align: center; padding: 80px 0; color: var(--muted); }
  .adm-empty-title {
    font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300;
    color: var(--cream); margin-bottom: 10px;
  }

  .adm-btn-create {
    border-color: var(--gold-line);
    color: var(--gold-light);
    background: var(--gold-dim);
  }
  .adm-btn-create::before { background: linear-gradient(90deg, var(--gold), #A8843A); }
  .adm-topbar-actions { display: flex; align-items: center; gap: 12px; }

html,
body {
  overflow-x: hidden;
  width: 100%;
}

.adm-root {
  width: 100%;
  overflow-x: hidden;
}

.adm-content {
  width: 100%;
  overflow-x: hidden;
}

.adm-card {
  width: 100%;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .adm-topbar {
    padding: 18px 18px;
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
  }

  .adm-logo {
    justify-content: center;
  }

  .adm-logo-text {
    font-size: 15px;
    letter-spacing: 0.18em;
  }
    .adm-overlay {
  padding: 16px;
  overflow-y: auto;
}

  .adm-topbar-actions {
    width: 100%;
    justify-content: center;
    gap: 10px;
  }

  .adm-topbar-actions .adm-btn,
  .adm-topbar-actions .adm-btn-create {
    flex: 1;
    min-width: 0;
    padding: 10px 12px;
    font-size: 8px;
    letter-spacing: 0.16em;
  }

  .adm-topbar-badge {
    width: 100%;
    text-align: center;
    padding: 8px;
    order: -1;
  }

  .adm-content {
    padding: 32px 16px;
  }

  .adm-page-title {
    font-size: 34px;
  }

  .adm-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .adm-search-wrap {
    max-width: 100%;
  }

  .adm-card {
    padding: 22px 18px;
  }

  .adm-card-top {
    flex-direction: column;
    gap: 20px;
  }

  .adm-card-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .adm-card-actions .adm-btn {
    flex: 1;
    min-width: 120px;
  }

  .adm-card-meta {
    gap: 14px;
  }

  .adm-meta-item {
    min-width: 100%;
  }

  .adm-modal,
  .adm-confirm {
    width: calc(100% - 24px);
    padding: 28px 20px;
    margin: 12px;
  }

  .adm-modal{
  
  
  }

  .adm-modal-actions,
  .adm-confirm-actions {
    flex-direction: column;
  }

  .adm-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .adm-topbar-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
  }

  .adm-topbar-actions .adm-btn,
  .adm-topbar-actions .adm-btn-create {
    width: 100%;
    min-width: 0;

    padding: 12px 8px;

    font-size: 8px;
    letter-spacing: 0.08em;

    white-space: nowrap;
  }

  .adm-topbar-badge {
    grid-column: 1 / -1;
    text-align: center;
    margin: 0;
  }
}
  `;

const ROLES = ["all", "admin", "provider", "customer"];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmUpdate, setConfirmUpdate] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Create user state
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "customer",
  });
  const [createError, setCreateError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      await API.delete(`/admin/users/${id}`);
      setConfirmDelete(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const updateUser = async () => {
    try {
      await API.put(`/admin/users/${editingUser._id}`, editingUser);
      setConfirmUpdate(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const createUser = async () => {
    setCreateError("");
    try {
      // FIX: use /admin/users instead of /users/register
      // The register endpoint requires email verification and doesn't accept a role.
      // The admin endpoint bypasses verification and sets any role directly.
      await API.post("/admin/users", createForm);
      setShowCreate(false);
      setCreateForm({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        role: "customer",
      });
      fetchUsers();
    } catch (err) {
      setCreateError(err.response?.data?.message || "Failed to create user.");
    }
  };

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchSearch = u.fullName
      ?.toLowerCase()
      .includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const filterBtnClass = (role) => {
    if (roleFilter !== role) return "adm-filter-btn";
    if (role === "all") return "adm-filter-btn active";
    return `adm-filter-btn active-${role}`;
  };

  return (
    <>
      <style>{style}</style>
      <div className="adm-root">
        {/* Top Bar */}
        <div className="adm-topbar">
          <a className="adm-logo" href="/" style={{ textDecoration: "none" }}>
            <div className="adm-logo-mark" />
            <div className="adm-logo-text" translate="no">
              Event<span>y</span>
            </div>
          </a>

          <div className="adm-topbar-actions">
            {/* FIX: navigate to /admindashboard instead of / */}

            <button
              className="adm-btn adm-btn-create"
              onClick={() => {
                setCreateForm({
                  fullName: "",
                  email: "",
                  password: "",
                  phoneNumber: "",
                  role: "customer",
                });
                setCreateError("");
                setShowCreate(true);
              }}
            >
              <span>+ Create User</span>
            </button>
            <div className="adm-topbar-badge">Admin Panel</div>

            <button
              className="adm-btn"
              onClick={() => (window.location.href = "/admin/admindashboard")}
            >
              <span>← Dashboard</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="adm-content">
          <div className="adm-page-header">
            <p className="adm-eyebrow">Management</p>
            <h1 className="adm-page-title">User Directory</h1>
            <div className="adm-rule" />
            <p className="adm-count">
              Showing <strong>{filtered.length}</strong> of{" "}
              <strong>{users.length}</strong> registered member
              {users.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Search + Filter Toolbar */}
          <div className="adm-toolbar">
            <div className="adm-search-wrap">
              <i className="adm-search-icon">⌕</i>
              <input
                className="adm-search"
                type="text"
                placeholder="Search by name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="adm-filters">
              {ROLES.map((role) => (
                <button
                  key={role}
                  className={filterBtnClass(role)}
                  onClick={() => setRoleFilter(role)}
                >
                  {role === "all" ? "All Members" : role}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="adm-empty">
              <div className="adm-empty-title">No members found</div>
              <p>Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className="adm-cards">
              {filtered.map((u) => (
                <div className="adm-card" key={u._id}>
                  <div className="adm-card-top">
                    <div className="adm-card-info">
                      <div className="adm-card-name">{u.fullName}</div>
                      <div className="adm-card-email">{u.email}</div>
                      <div className="adm-card-meta">
                        <div className="adm-meta-item">
                          <div className="adm-meta-label">Phone</div>
                          <div className="adm-meta-value">
                            {u.phoneNumber || "—"}
                          </div>
                        </div>
                        <div className="adm-meta-item">
                          <div className="adm-meta-label">User ID</div>
                          <div
                            className="adm-meta-value"
                            style={{ fontFamily: "monospace", fontSize: 11 }}
                          >
                            {u._id}
                          </div>
                        </div>
                        <div className="adm-meta-item">
                          <div className="adm-meta-label">Role</div>
                          <span className={`adm-role-badge ${u.role}`}>
                            {u.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="adm-card-actions">
                      <button
                        className="adm-btn"
                        onClick={() => setEditingUser({ ...u })}
                      >
                        <span>Edit</span>
                      </button>
                      <button
                        className="adm-btn adm-btn-danger"
                        onClick={() => setConfirmDelete(u)}
                      >
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Delete Confirmation ── */}
        {confirmDelete && (
          <div className="adm-overlay" onClick={() => setConfirmDelete(null)}>
            <div className="adm-confirm" onClick={(e) => e.stopPropagation()}>
              <p className="adm-confirm-eyebrow">Irreversible Action</p>
              <h2 className="adm-confirm-title">Delete Member</h2>
              <p className="adm-confirm-body">
                You are about to permanently remove{" "}
                <strong>{confirmDelete.fullName}</strong> from the platform.
                This action cannot be undone.
              </p>
              <div className="adm-confirm-actions">
                <button
                  className="adm-btn"
                  onClick={() => setConfirmDelete(null)}
                >
                  <span>Cancel</span>
                </button>
                <button
                  className="adm-btn adm-btn-danger"
                  onClick={() => deleteUser(confirmDelete._id)}
                >
                  <span>Confirm Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Edit Modal ── */}
        {editingUser && !confirmUpdate && (
          <div className="adm-overlay" onClick={() => setEditingUser(null)}>
            <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="adm-modal-close"
                onClick={() => setEditingUser(null)}
              >
                ✕
              </button>
              <p className="adm-modal-eyebrow">Editing Member</p>
              <h2 className="adm-modal-title">Edit Profile</h2>

              <div className="adm-field">
                <label className="adm-label">Full Name</label>
                <input
                  className="adm-input"
                  placeholder="Full Name"
                  value={editingUser.fullName}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, fullName: e.target.value })
                  }
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Email Address</label>
                <input
                  className="adm-input"
                  placeholder="Email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Phone Number</label>
                <input
                  className="adm-input"
                  placeholder="Phone"
                  value={editingUser.phoneNumber}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Role</label>
                <select
                  className="adm-select"
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                >
                  <option value="customer">Customer</option>
                  <option value="provider">Provider</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="adm-modal-actions">
                <button
                  className="adm-btn"
                  onClick={() => setEditingUser(null)}
                >
                  <span>Cancel</span>
                </button>
                <button
                  className="adm-btn"
                  onClick={() => setConfirmUpdate(true)}
                >
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Update Confirmation ── */}
        {confirmUpdate && editingUser && (
          <div className="adm-overlay" onClick={() => setConfirmUpdate(false)}>
            <div
              className="adm-confirm adm-confirm-gold"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="adm-confirm-eyebrow gold">Confirm Changes</p>
              <h2 className="adm-confirm-title">Save Updates</h2>
              <p className="adm-confirm-body">
                You are about to update the profile of{" "}
                <strong>{editingUser.fullName}</strong>. Please confirm to apply
                these changes.
              </p>
              <div className="adm-confirm-actions">
                <button
                  className="adm-btn"
                  onClick={() => setConfirmUpdate(false)}
                >
                  <span>Go Back</span>
                </button>
                <button className="adm-btn" onClick={updateUser}>
                  <span>Confirm Save</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Create User Modal ── */}
        {showCreate && (
          <div className="adm-overlay" onClick={() => setShowCreate(false)}>
            <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="adm-modal-close"
                onClick={() => setShowCreate(false)}
              >
                ✕
              </button>
              <p className="adm-modal-eyebrow">New Member</p>
              <h2 className="adm-modal-title">Create User</h2>

              <div className="adm-field">
                <label className="adm-label">Full Name</label>
                <input
                  className="adm-input"
                  placeholder="Full Name"
                  value={createForm.fullName}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, fullName: e.target.value })
                  }
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Email Address</label>
                <input
                  className="adm-input"
                  type="email"
                  placeholder="Email"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, email: e.target.value })
                  }
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Password</label>
                <input
                  className="adm-input"
                  type="password"
                  placeholder="Password"
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, password: e.target.value })
                  }
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Phone Number</label>
                <input
                  className="adm-input"
                  placeholder="Phone (optional)"
                  value={createForm.phoneNumber}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Role</label>
                <select
                  className="adm-select"
                  value={createForm.role}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, role: e.target.value })
                  }
                >
                  <option value="customer">Customer</option>
                  <option value="provider">Provider</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {createError && (
                <p
                  style={{
                    fontSize: "11px",
                    color: "#E08080",
                    marginBottom: "12px",
                    letterSpacing: "0.04em",
                  }}
                >
                  {createError}
                </p>
              )}

              <div className="adm-modal-actions">
                <button
                  className="adm-btn"
                  onClick={() => setShowCreate(false)}
                >
                  <span>Cancel</span>
                </button>
                <button className="adm-btn adm-btn-create" onClick={createUser}>
                  <span>Create User</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
