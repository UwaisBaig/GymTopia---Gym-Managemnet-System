import { useState, useEffect, useCallback } from "react";

// =========================================================================
// OOP CONCEPT 1: ENCAPSULATION & DATA ACCESSIBILITY (Base Class)
// 'Person' serves as the root class. Fields are prefixed with '_' (private by convention)
// and exposed through explicit getters to enforce read-only properties.
// =========================================================================
class Person {
  constructor(id, name, age, phone) {
    this._id = id;    // Encapsulated state identifier
    this._name = name;  // Encapsulated name property
    this._age = age;   // Encapsulated age property
    this._phone = phone; // Encapsulated contact number
  }

  // Public Getters (Enforcing Read-Only integrity)
  getId() { return this._id; }
  getName() { return this._name; }
  getAge() { return this._age; }
  getPhone() { return this._phone; }

  // Virtual Method representation for polymorphic behavior
  toString() {
    return `Person: ${this._name} (ID: ${this._id})`;
  }

  toObject() {
    return { id: this._id, name: this._name, age: this._age, phone: this._phone };
  }
}

// =========================================================================
// OOP CONCEPT 2: INHERITANCE (Subclassing)
// 'Member' extends the behavior of 'Person' by inheriting ID, Name, Age, and Phone,
// while expanding specialized gym domains (Packages, Dues, and Attendance Logs).
// =========================================================================
class Member extends Person {
  constructor(id, name, age, phone, pkg, fee, feeStatus = "Paid", trainer = "", checkIns = []) {
    // Invoke base class constructor using 'super'
    super(id, name, age, phone);
    this._package = pkg;
    this._fee = fee;
    this._feeStatus = feeStatus;
    this._trainer = trainer;
    this._checkIns = checkIns; // Tracks attendance timestamps
  }

  getPackage() { return this._package; }
  getFee() { return this._fee; }
  getFeeStatus() { return this._feeStatus; }
  getTrainer() { return this._trainer; }
  getCheckIns() { return this._checkIns; }
  setFeeStatus(s) { this._feeStatus = s; }

  // =========================================================================
  // OOP CONCEPT 3: DYNAMIC POLYMORPHISM (Method Overriding)
  // Re-implements base class 'toString()' dynamically. When evaluated, the runtime
  // executes this specific method for Member instances, rather than Person's method.
  // =========================================================================
  toString() {
    return `Member: ${this._name} | ${this._package} | Rs.${this._fee} | ${this._feeStatus}${this._trainer ? ` | Trainer: ${this._trainer}` : ""}`;
  }

  // Business logic: calculates dynamic check-in ratios for the current month
  getConsistency() {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const thisMonthCIs = this._checkIns.filter(d => {
      const dt = new Date(d);
      return dt.getMonth() === month && dt.getFullYear() === year;
    });
    const dayOfMonth = now.getDate();
    if (dayOfMonth === 0) return 0;
    return Math.round((thisMonthCIs.length / dayOfMonth) * 100);
  }

  toObject() {
    return {
      ...super.toObject(),
      package: this._package,
      fee: this._fee,
      feeStatus: this._feeStatus,
      trainer: this._trainer,
      checkIns: this._checkIns
    };
  }

  // Equivalent to Constructor Overloading (Factory Deserialization)
  static fromObject(o) {
    return new Member(o.id, o.name, o.age, o.phone, o.package, o.fee, o.feeStatus, o.trainer || "", o.checkIns || []);
  }
}

// =========================================================================
// Supplementary Domain Class
// =========================================================================
class Complaint {
  constructor(id, text, timestamp = Date.now()) {
    this._id = id;
    this._text = text;
    this._timestamp = timestamp;
  }
  getId() { return this._id; }
  getText() { return this._text; }
  getTimeString() { return new Date(this._timestamp).toLocaleString(); }
  toObject() { return { id: this._id, text: this._text, timestamp: this._timestamp }; }
  static fromObject(o) { return new Complaint(o.id, o.text, o.timestamp); }
}

// ─────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────
const K_MEMBERS = "gymtopia_members";
const K_COMPLAINTS = "gymtopia_complaints";
const CREDS = {
  admin: { username: "admin", password: "admin123" },
  attendant: { username: "attendant", password: "attendant123" },
};
const PACKAGES = [
  { label: "Silver", fee: 1000 },
  { label: "Gold", fee: 2000 },
  { label: "Premium", fee: 3000 },
];

const loadMembers = () => { try { const r = localStorage.getItem(K_MEMBERS); return r ? JSON.parse(r).map(Member.fromObject) : []; } catch { return []; } };
const saveMembers = ms => localStorage.setItem(K_MEMBERS, JSON.stringify(ms.map(m => m.toObject())));
const loadComplaints = () => { try { const r = localStorage.getItem(K_COMPLAINTS); return r ? JSON.parse(r).map(Complaint.fromObject) : []; } catch { return []; } };
const saveComplaints = cs => localStorage.setItem(K_COMPLAINTS, JSON.stringify(cs.map(c => c.toObject())));
const nextId = arr => arr.length === 0 ? 1 : Math.max(...arr.map(x => x.getId())) + 1;

// ─────────────────────────────────────────────
// DESIGN — RED / WHITE / BLACK  (Gymtopia)
// ─────────────────────────────────────────────
const RED = "#CC0000";
const REDHOV = "#AA0000";
const REDLT = "#FDEAEA";
const BLACK = "#111111";
const GRAY = "#F4F4F4";
const BORDER = "#E0E0E0";
const WHITE = "#FFFFFF";
const MUTED = "#666666";

const T = {
  card: { background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "1.25rem" },
  label: { fontSize: 12, fontWeight: 600, color: BLACK, display: "block", marginBottom: 4, letterSpacing: "0.04em", textTransform: "uppercase" },
  input: { width: "100%", padding: "9px 12px", borderRadius: 6, border: `1px solid ${BORDER}`, fontSize: 14, color: BLACK, background: WHITE, outline: "none", boxSizing: "border-box" },
  err: { fontSize: 11, color: RED, marginTop: 3, display: "block" },
  redBtn: { background: RED, color: WHITE, border: "none", borderRadius: 6, padding: "9px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", letterSpacing: "0.03em" },
  ghost: { background: "none", color: RED, border: `1.5px solid ${RED}`, borderRadius: 6, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" },
};

// ─────────────────────────────────────────────
// ATOMS
// ─────────────────────────────────────────────
const PKG_COLORS = {
  Silver: { bg: "#F0F0F0", color: "#444" },
  Gold: { bg: "#FFF8E0", color: "#7A5C00" },
  Premium: { bg: REDLT, color: RED },
};

function PkgBadge({ pkg }) {
  const c = PKG_COLORS[pkg] || { bg: GRAY, color: BLACK };
  return <span style={{ ...c, fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20, letterSpacing: "0.04em" }}>{pkg?.toUpperCase()}</span>;
}

function StatusBadge({ status }) {
  const paid = status === "Paid";
  return <span style={{ background: paid ? "#E8F5E9" : "#FDEAEA", color: paid ? "#2E7D32" : RED, fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20 }}>{status?.toUpperCase()}</span>;
}

function ConsBar({ pct }) {
  const color = pct >= 75 ? "#2E7D32" : pct >= 40 ? "#F57C00" : RED;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: GRAY, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width .3s" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 32 }}>{pct}%</span>
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div style={{ background: GRAY, borderRadius: 8, padding: "1rem", textAlign: "center" }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: BLACK }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: RED, fontWeight: 700, marginTop: 1 }}>{sub}</div>}
      <div style={{ fontSize: 11, color: MUTED, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
    </div>
  );
}

function Alert({ type, children }) {
  const ok = type === "success";
  return <div style={{ background: ok ? "#E8F5E9" : REDLT, color: ok ? "#2E7D32" : RED, borderRadius: 6, padding: "8px 14px", fontSize: 13, fontWeight: 500, marginBottom: 12 }}>{children}</div>;
}

function RedCorner({ pos }) {
  const size = 90;
  const base = { position: "absolute", width: size, height: size, background: RED, zIndex: 0 };
  const styles = {
    tl: { top: 0, left: 0, clipPath: "polygon(0 0,100% 0,0 100%)" },
    tr: { top: 0, right: 0, clipPath: "polygon(100% 0,100% 100%,0 0)" },
    bl: { bottom: 0, left: 0, clipPath: "polygon(0 0,100% 100%,0 100%)" },
    br: { bottom: 0, right: 0, clipPath: "polygon(100% 0,100% 100%,0 100%)" },
  };
  return <div style={{ ...base, ...styles[pos] }} />;
}

// ─────────────────────────────────────────────
// LOGIN SCREEN  (Gymtopia wireframe)
// ─────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [role, setRole] = useState(null);
  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  function tryLogin() {
    const c = CREDS[role];
    if (uname === c.username && pass === c.password) { onLogin(role); }
    else { setErr("Invalid credentials. Please try again."); }
  }

  const headlines = ["NEW ZUMBA CLASSES — MON & WED 6 PM", "SUMMER CHALLENGE STARTS JULY 1ST", "PROTEIN SHAKES NOW AVAILABLE AT FRONT DESK", "FREE PERSONAL TRAINING SESSION THIS MONTH"];
  const [hl, setHl] = useState(0);
  useEffect(() => { const t = setInterval(() => setHl(h => (h + 1) % headlines.length), 3000); return () => clearInterval(t); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "system-ui,sans-serif", position: "relative", overflow: "hidden" }}>
      <RedCorner pos="tl" /> <RedCorner pos="br" />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 880 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 84, height: 84, background: RED, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(204,0,0,0.25)", marginBottom: 16 }}>
            <i className="ti ti-barbell" style={{ fontSize: 42, color: WHITE }} aria-hidden="true" />
          </div>
          <span style={{ fontSize: 46, fontWeight: 950, color: BLACK, letterSpacing: "-0.03em", lineHeight: 1 }}>GYMTOPIA</span>
          <div style={{ fontSize: 14, color: MUTED, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginTop: 8 }}>Management System</div>
        </div>

        {/* Two-column card */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 0, background: WHITE, borderRadius: 16, border: `1px solid ${BORDER}`, overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
          {/* Left — newsletter */}
          <div style={{ background: GRAY, padding: "3rem 2.5rem", borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: RED, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>— Newsletter of the Gym —</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: BLACK, lineHeight: 1.5, minHeight: 90, transition: "all .3s" }}>
              {headlines[hl]}
            </div>
            <div style={{ display: "flex", gap: 5, marginTop: 20 }}>
              {headlines.map((_, i) => (
                <div key={i} onClick={() => setHl(i)} style={{ width: i === hl ? 24 : 7, height: 7, borderRadius: 3.5, background: i === hl ? RED : BORDER, cursor: "pointer", transition: "width .3s" }} />
              ))}
            </div>
            <div style={{ marginTop: "3rem", fontSize: 13, color: MUTED }}>
              <div style={{ fontWeight: 700, marginBottom: 6, color: BLACK, fontSize: 14 }}>Today</div>
              <div>{new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
            </div>
          </div>

          {/* Right — login */}
          <div style={{ padding: "3rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {!role ? (
              <>
                <div style={{ fontSize: 22, fontWeight: 900, color: BLACK, marginBottom: 8, letterSpacing: "-0.01em" }}>LOG IN AS</div>
                <div style={{ fontSize: 13, color: MUTED, marginBottom: 28 }}>Select your role to continue</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <button onClick={() => setRole("admin")} style={{ ...T.redBtn, width: "100%", padding: "14px", fontSize: 15, borderRadius: 8 }}>ADMIN</button>
                  <button onClick={() => setRole("attendant")} style={{ background: BLACK, color: WHITE, border: "none", borderRadius: 8, padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer", letterSpacing: "0.03em", transition: "all 0.2s" }}>GYM ATTENDANT</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, cursor: "pointer" }} onClick={() => { setRole(null); setErr(""); }}>
                  <i className="ti ti-arrow-left" style={{ fontSize: 15, color: MUTED }} />
                  <span style={{ fontSize: 13, color: MUTED, fontWeight: 600 }}>Back</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: BLACK, marginBottom: 20, letterSpacing: "-0.01em" }}>{role === "admin" ? "ADMIN LOGIN" : "ATTENDANT LOGIN"}</div>
                {err && <Alert type="error">{err}</Alert>}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ ...T.label, fontSize: 12, marginBottom: 6 }}>Username</label>
                  <input style={{ ...T.input, padding: "12px 14px", fontSize: 15, borderRadius: 8 }} value={uname} onChange={e => { setUname(e.target.value); setErr(""); }} placeholder={CREDS[role].username} onKeyDown={e => e.key === "Enter" && tryLogin()} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ ...T.label, fontSize: 12, marginBottom: 6 }}>Password</label>
                  <input style={{ ...T.input, padding: "12px 14px", fontSize: 15, borderRadius: 8 }} type="password" value={pass} onChange={e => { setPass(e.target.value); setErr(""); }} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && tryLogin()} />
                </div>
                <button onClick={tryLogin} style={{ ...T.redBtn, width: "100%", padding: "13px", fontSize: 15, borderRadius: 8 }}>LOGIN</button>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 12, textAlign: "center" }}>Hint: {CREDS[role].username} / {CREDS[role].password}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// EVENT-DRIVEN LAYOUT CONTAINER: Shell
// This handles menu tab selection events and wraps dashboards.
// Layout expanded to 1250px to utilize full widescreen estate.
// =========================================================================
function Shell({ title, tabs, active, onTab, onLogout, children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F7", fontFamily: "system-ui,sans-serif" }}>
      {/* Navigation Top Bar */}
      <div style={{ background: WHITE, borderBottom: `1px solid ${BORDER}`, position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
        <div style={{ maxWidth: 1250, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", height: 58 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 24 }}>
            <div style={{ width: 32, height: 32, background: RED, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="ti ti-barbell" style={{ fontSize: 16, color: WHITE }} />
            </div>
            <span style={{ fontWeight: 900, fontSize: 16, color: BLACK, letterSpacing: "-0.01em" }}>GYMTOPIA</span>
            <span style={{ fontSize: 10, color: MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginLeft: 4 }}>{title}</span>
          </div>
          <div style={{ display: "flex", gap: 2, flex: 1, overflowX: "auto" }}>
            {tabs.map(t => (
              // EVENT-DRIVEN PROGRAMMING: onClick trigger propagates active tab ID to parent handler
              <button key={t.id} onClick={() => onTab(t.id)} style={{
                padding: "6px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
                color: active === t.id ? RED : MUTED, borderBottom: active === t.id ? `3px solid ${RED}` : "3px solid transparent",
                letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap", transition: "all 0.2s"
              }}>
                <i className={`ti ${t.icon}`} style={{ marginRight: 4, fontSize: 13 }} />
                {t.label}
              </button>
            ))}
          </div>
          {/* EVENT-DRIVEN PROGRAMMING: Logout click event */}
          <button onClick={onLogout} style={{ fontSize: 11, color: MUTED, background: "none", border: "none", cursor: "pointer", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}>
            <i className="ti ti-logout" style={{ fontSize: 13 }} />Logout
          </button>
        </div>
      </div>
      {/* Dashboard Main Viewport Container */}
      <div style={{ maxWidth: 1250, margin: "0 auto", padding: "28px 16px" }}>{children}</div>
    </div>
  );
}

const FormGroup = ({ label, id, children, error }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={T.label} htmlFor={id}>{label}</label>
    {children}
    {error && <span style={T.err}>{error}</span>}
  </div>
);

// ─────────────────────────────────────────────
// ADD / EDIT MEMBER FORM
// ─────────────────────────────────────────────
function MemberForm({ members, existing, onSave, onCancel }) {
  const [f, setF] = useState(existing ? {
    name: existing.getName(), age: String(existing.getAge()), phone: existing.getPhone(),
    pkg: existing.getPackage(), feeStatus: existing.getFeeStatus(), trainer: existing.getTrainer()
  } : { name: "", age: "", phone: "", pkg: "Silver", feeStatus: "Paid", trainer: "" });
  const [err, setErr] = useState({});
  const [done, setDone] = useState("");

  const isEdit = !!existing;

  function validate() {
    const e = {};
    if (!f.name.trim()) e.name = "Name is required.";
    const a = parseInt(f.age); if (isNaN(a) || a < 10 || a > 100) e.age = "Age must be 10–100.";
    if (!/^\d{11}$/.test(f.phone)) e.phone = "Must be exactly 11 digits.";
    else if (!isEdit && members.some(m => m.getPhone() === f.phone)) e.phone = "Phone already registered.";
    else if (isEdit && members.some(m => m.getPhone() === f.phone && m.getId() !== existing.getId())) e.phone = "Phone already registered.";
    return e;
  }

  function submit() {
    const e = validate(); if (Object.keys(e).length) { setErr(e); return; }
    const pkg = PACKAGES.find(p => p.label === f.pkg);
    const id = isEdit ? existing.getId() : nextId(members);
    const cis = isEdit ? existing.getCheckIns() : [];
    const m = new Member(id, f.name.trim(), parseInt(f.age), f.phone, pkg.label, pkg.fee, f.feeStatus, f.trainer.trim(), cis);
    onSave(m);
    if (!isEdit) { setDone(`Member "${m.getName()}" added! ID: ${m.getId()}`); setF({ name: "", age: "", phone: "", pkg: "Silver", feeStatus: "Paid", trainer: "" }); setErr({}); }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 4, height: 22, background: RED, borderRadius: 2 }} />
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: BLACK }}>{isEdit ? "Update member info" : "Add new member"}</h2>
      </div>
      {done && <Alert type="success">{done}</Alert>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <div style={{ gridColumn: "1/-1" }}>
          <FormGroup label="Full name" id="name" error={err.name}>
            <input id="name" style={T.input} value={f.name} onChange={e => setF(x => ({ ...x, name: e.target.value }))} placeholder="e.g. Ali Hassan" />
          </FormGroup>
        </div>
        <FormGroup label="Age" id="age" error={err.age}>
          <input id="age" style={T.input} type="number" value={f.age} onChange={e => setF(x => ({ ...x, age: e.target.value }))} placeholder="10–100" />
        </FormGroup>
        <FormGroup label="Phone (11 digits)" id="phone" error={err.phone}>
          <input id="phone" style={T.input} value={f.phone} onChange={e => setF(x => ({ ...x, phone: e.target.value }))} maxLength={11} placeholder="03XXXXXXXXX" />
        </FormGroup>
        <FormGroup label="Trainer (optional)" id="trainer">
          <input id="trainer" style={T.input} value={f.trainer} onChange={e => setF(x => ({ ...x, trainer: e.target.value }))} placeholder="e.g. Sir Hamza" />
        </FormGroup>
        <FormGroup label="Fee status" id="fee">
          <select id="fee" style={T.input} value={f.feeStatus} onChange={e => setF(x => ({ ...x, feeStatus: e.target.value }))}>
            <option>Paid</option><option>Unpaid</option>
          </select>
        </FormGroup>
        <div style={{ gridColumn: "1/-1" }}>
          <label style={T.label}>Package</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 4 }}>
            {PACKAGES.map(p => (
              <div key={p.label} onClick={() => setF(x => ({ ...x, pkg: p.label }))}
                style={{
                  border: `${f.pkg === p.label ? `2px solid ${RED}` : `1px solid ${BORDER}`}`, borderRadius: 8, padding: "12px 10px", cursor: "pointer", textAlign: "center",
                  background: f.pkg === p.label ? REDLT : WHITE
                }}>
                <PkgBadge pkg={p.label} />
                <div style={{ fontSize: 13, color: MUTED, marginTop: 6 }}>Rs. {p.fee.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
        {onCancel && <button onClick={onCancel} style={T.ghost}>Cancel</button>}
        <button onClick={submit} style={T.redBtn}>{isEdit ? "Save changes" : "Add member"}</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MEMBERS TABLE
// ─────────────────────────────────────────────
function MembersTable({ members, onRemove, onEdit, onToggleFee, readonly }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterPkg, setFilterPkg] = useState("All");

  let list = members.filter(m =>
    m.getName().toLowerCase().includes(search.toLowerCase()) ||
    String(m.getId()).includes(search) || m.getPhone().includes(search)
  );
  if (filterPkg !== "All") list = list.filter(m => m.getPackage() === filterPkg);
  list = [...list].sort((a, b) => {
    if (sortBy === "name") return a.getName().localeCompare(b.getName());
    if (sortBy === "pkg") return a.getPackage().localeCompare(b.getPackage());
    if (sortBy === "cons") return b.getConsistency() - a.getConsistency();
    return 0;
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <input style={T.input} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, ID, phone…" />
        </div>
        <select style={{ ...T.input, width: "auto" }} value={filterPkg} onChange={e => setFilterPkg(e.target.value)}>
          <option value="All">All packages</option>
          {PACKAGES.map(p => <option key={p.label}>{p.label}</option>)}
        </select>
        <select style={{ ...T.input, width: "auto" }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="name">Sort: Name</option>
          <option value="pkg">Sort: Package</option>
          <option value="cons">Sort: Consistency</option>
        </select>
        <div style={{ fontSize: 12, color: MUTED, whiteSpace: "nowrap" }}>{list.length} member{list.length !== 1 ? "s" : ""}</div>
      </div>
      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: MUTED, fontSize: 14 }}>
          <i className="ti ti-users" style={{ fontSize: 32, display: "block", marginBottom: 8 }} />
          {search ? "No matching members." : "No members added yet."}
        </div>
      ) : (
        <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${BORDER}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: BLACK }}>
                {["ID", "Name", "Age", "Phone", "Trainer", "Package", "Fee", "Status", "Consistency", !readonly && "Actions"].filter(Boolean).map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: WHITE, fontWeight: 700, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((m, i) => (
                <tr key={m.getId()} style={{ background: i % 2 === 0 ? WHITE : GRAY }}>
                  <td style={{ padding: "10px 12px", color: MUTED, fontWeight: 700 }}>#{m.getId()}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 700, color: BLACK }}>{m.getName()}</td>
                  <td style={{ padding: "10px 12px", color: MUTED }}>{m.getAge()}</td>
                  <td style={{ padding: "10px 12px", color: MUTED }}>{m.getPhone()}</td>
                  <td style={{ padding: "10px 12px", color: m.getTrainer() ? BLACK : MUTED, fontStyle: m.getTrainer() ? "normal" : "italic" }}>{m.getTrainer() || "—"}</td>
                  <td style={{ padding: "10px 12px" }}><PkgBadge pkg={m.getPackage()} /></td>
                  <td style={{ padding: "10px 12px", color: MUTED }}>Rs.{m.getFee().toLocaleString()}</td>
                  <td style={{ padding: "10px 12px" }}><StatusBadge status={m.getFeeStatus()} /></td>
                  <td style={{ padding: "10px 12px", minWidth: 100 }}><ConsBar pct={m.getConsistency()} /></td>
                  {!readonly && (
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => onEdit(m)} style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "3px 8px", cursor: "pointer", fontSize: 11, color: BLACK, fontWeight: 700 }}>Edit</button>
                        <button onClick={() => onToggleFee(m.getId())} style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "3px 8px", cursor: "pointer", fontSize: 11, color: m.getFeeStatus() === "Paid" ? RED : "#2E7D32", fontWeight: 700 }}>
                          {m.getFeeStatus() === "Paid" ? "Unpaid" : "Paid"}
                        </button>
                        <button onClick={() => onRemove(m.getId())} style={{ background: REDLT, border: "none", borderRadius: 4, padding: "3px 8px", cursor: "pointer", fontSize: 11, color: RED, fontWeight: 700 }}>Remove</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// REVENUE VIEW
// ─────────────────────────────────────────────
function RevenueView({ members }) {
  const paid = members.filter(m => m.getFeeStatus() === "Paid");
  const total = paid.reduce((s, m) => s + m.getFee(), 0);
  const byPkg = PACKAGES.map(p => ({
    label: p.label, count: members.filter(m => m.getPackage() === p.label).length,
    rev: paid.filter(m => m.getPackage() === p.label).reduce((s, m) => s + m.getFee(), 0)
  }));
  const topCons = [...members].sort((a, b) => b.getConsistency() - a.getConsistency()).slice(0, 5);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 4, height: 22, background: RED, borderRadius: 2 }} />
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Revenue overview</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10, marginBottom: 20 }}>
        <Stat label="Total members" value={members.length} />
        <Stat label="Paid" value={paid.length} sub="members" />
        <Stat label="Pending" value={members.length - paid.length} sub="members" />
        <Stat label="Total revenue" value={`Rs.${total.toLocaleString()}`} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={T.card}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>By package</div>
          {byPkg.map(p => (
            <div key={p.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <PkgBadge pkg={p.label} />
                <span style={{ fontSize: 12, color: MUTED }}>{p.count} members</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 13 }}>Rs.{p.rev.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div style={T.card}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>Top consistency</div>
          {topCons.length === 0 && <div style={{ color: MUTED, fontSize: 13 }}>No data yet.</div>}
          {topCons.map(m => (
            <div key={m.getId()} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{m.getName()}</span>
                <PkgBadge pkg={m.getPackage()} />
              </div>
              <ConsBar pct={m.getConsistency()} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CHECK-IN VIEW
// ─────────────────────────────────────────────
function CheckInView({ members, onCheckIn }) {
  const [id, setId] = useState("");
  const [msg, setMsg] = useState(null);
  const today = new Date().toISOString().slice(0, 10);

  function doCheckIn() {
    const num = parseInt(id);
    const m = members.find(x => x.getId() === num);
    if (!m) { setMsg({ type: "error", text: "Member not found." }); return; }
    if (m.getCheckIns().includes(today)) { setMsg({ type: "error", text: `${m.getName()} already checked in today.` }); return; }
    onCheckIn(num);
    setMsg({ type: "success", text: `Check-in recorded for ${m.getName()}.` });
    setId("");
  }

  const todayCheckins = members.filter(m => m.getCheckIns().includes(today));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 4, height: 22, background: RED, borderRadius: 2 }} />
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Daily check-in / attendance</h2>
        <span style={{ marginLeft: "auto", fontSize: 12, color: MUTED }}>{new Date().toLocaleDateString("en-PK", { weekday: "long", month: "long", day: "numeric" })}</span>
      </div>
      <div style={{ ...T.card, marginBottom: 20 }}>
        {msg && <Alert type={msg.type}>{msg.text}</Alert>}
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={T.label}>Member ID</label>
            <input style={T.input} type="number" value={id} onChange={e => { setId(e.target.value); setMsg(null); }}
              onKeyDown={e => e.key === "Enter" && doCheckIn()} placeholder="Enter member ID…" />
          </div>
          <button onClick={doCheckIn} style={{ ...T.redBtn, alignSelf: "flex-end", padding: "9px 22px" }}>Check In</button>
        </div>
      </div>
      <div style={{ fontWeight: 800, fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
        Today's attendees ({todayCheckins.length})
      </div>
      {todayCheckins.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: MUTED, fontSize: 13 }}>No check-ins recorded yet today.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
          {todayCheckins.map(m => (
            <div key={m.getId()} style={{ ...T.card, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: WHITE, fontWeight: 800, fontSize: 14 }}>{m.getName().charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{m.getName()}</div>
                <div style={{ fontSize: 11, color: MUTED }}>ID #{m.getId()} · <PkgBadge pkg={m.getPackage()} /></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// CONSISTENCY VIEW
// ─────────────────────────────────────────────
function ConsistencyView({ members }) {
  const sorted = [...members].sort((a, b) => b.getConsistency() - a.getConsistency());
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 4, height: 22, background: RED, borderRadius: 2 }} />
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Member consistency</h2>
      </div>
      {sorted.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: MUTED, fontSize: 14 }}>No members yet.</div>
      ) : sorted.map(m => (
        <div key={m.getId()} style={{ ...T.card, marginBottom: 10, display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: m.getConsistency() >= 75 ? RED : GRAY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontWeight: 800, fontSize: 14, color: m.getConsistency() >= 75 ? WHITE : BLACK }}>{m.getName().charAt(0).toUpperCase()}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{m.getName()}</div>
              <ConsBar pct={m.getConsistency()} />
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <PkgBadge pkg={m.getPackage()} />
            <div style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{m.getCheckIns().length} total check-ins</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// ENROLLMENTS THIS MONTH
// ─────────────────────────────────────────────
function EnrollmentsView({ members }) {
  const now = new Date(); const month = now.getMonth(); const year = now.getFullYear();
  const monthName = now.toLocaleString("default", { month: "long", year: "numeric" });
  const thisMonth = members.filter(m => {
    const cis = m.getCheckIns().filter(d => { const dt = new Date(d); return dt.getMonth() === month && dt.getFullYear() === year; });
    return cis.length > 0;
  });
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 4, height: 22, background: RED, borderRadius: 2 }} />
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Enrollments — {monthName}</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10, marginBottom: 20 }}>
        <Stat label="Active this month" value={thisMonth.length} />
        <Stat label="Total members" value={members.length} />
        <Stat label="Inactive" value={members.length - thisMonth.length} />
      </div>
      {thisMonth.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: MUTED, fontSize: 13 }}>No active members this month.</div>
      ) : (
        <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${BORDER}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: BLACK }}>
                {["Name", "Package", "Check-ins this month", "Consistency"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", color: WHITE, fontWeight: 700, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {thisMonth.sort((a, b) => b.getConsistency() - a.getConsistency()).map((m, i) => {
                const cnt = m.getCheckIns().filter(d => { const dt = new Date(d); return dt.getMonth() === month && dt.getFullYear() === year; }).length;
                return (
                  <tr key={m.getId()} style={{ background: i % 2 === 0 ? WHITE : GRAY }}>
                    <td style={{ padding: "10px 12px", fontWeight: 700 }}>{m.getName()}</td>
                    <td style={{ padding: "10px 12px" }}><PkgBadge pkg={m.getPackage()} /></td>
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: RED }}>{cnt}</td>
                    <td style={{ padding: "10px 12px", minWidth: 120 }}><ConsBar pct={m.getConsistency()} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPLAINTS / SUGGESTIONS
// ─────────────────────────────────────────────
function ComplaintsView({ complaints, onAdd }) {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  function submit() {
    if (!text.trim()) return;
    onAdd(new Complaint(nextId(complaints), text.trim()));
    setText(""); setDone(true); setTimeout(() => setDone(false), 3000);
  }
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 4, height: 22, background: RED, borderRadius: 2 }} />
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Complaints & suggestions</h2>
      </div>
      <div style={{ ...T.card, marginBottom: 20 }}>
        {done && <Alert type="success">Submitted successfully!</Alert>}
        <label style={T.label}>Your complaint or suggestion</label>
        <textarea style={{ ...T.input, height: 90, resize: "vertical", fontFamily: "inherit" }} value={text} onChange={e => { setText(e.target.value); setDone(false); }} placeholder="Type here…" />
        <div style={{ textAlign: "right", marginTop: 10 }}>
          <button onClick={submit} style={T.redBtn}>Submit</button>
        </div>
      </div>
      <div style={{ fontWeight: 800, fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
        Previous entries ({complaints.length})
      </div>
      {complaints.length === 0 ? (
        <div style={{ textAlign: "center", padding: "1.5rem", color: MUTED, fontSize: 13 }}>No complaints or suggestions yet.</div>
      ) : [...complaints].reverse().map(c => (
        <div key={c.getId()} style={{ ...T.card, marginBottom: 8 }}>
          <div style={{ fontSize: 13, color: BLACK, marginBottom: 4 }}>{c.getText()}</div>
          <div style={{ fontSize: 11, color: MUTED }}>{c.getTimeString()}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// SEARCH VIEW
// ─────────────────────────────────────────────
function SearchView({ members }) {
  const [q, setQ] = useState("");
  const res = q.trim() ? members.filter(m => m.getName().toLowerCase().includes(q.toLowerCase())) : [];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 4, height: 22, background: RED, borderRadius: 2 }} />
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Search members</h2>
      </div>
      <input style={{ ...T.input, marginBottom: 20 }} value={q} onChange={e => setQ(e.target.value)} placeholder="Type a name to search…" />
      {q.trim() && res.length === 0 && <div style={{ textAlign: "center", padding: "2rem", color: MUTED, fontSize: 13 }}>No members found.</div>}
      {res.map(m => (
        <div key={m.getId()} style={{ ...T.card, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: WHITE, fontWeight: 800, fontSize: 16 }}>{m.getName().charAt(0).toUpperCase()}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{m.getName()}</div>
              <div style={{ fontSize: 12, color: MUTED }}>ID #{m.getId()} · {m.getPhone()}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <PkgBadge pkg={m.getPackage()} /><br />
              <StatusBadge status={m.getFeeStatus()} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, fontSize: 12 }}>
            <div><span style={{ color: MUTED }}>Age: </span>{m.getAge()}</div>
            <div><span style={{ color: MUTED }}>Fee: </span>Rs.{m.getFee().toLocaleString()}</div>
            <div><span style={{ color: MUTED }}>Trainer: </span>{m.getTrainer() || "—"}</div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 11, color: MUTED, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Consistency this month</div>
            <ConsBar pct={m.getConsistency()} />
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: MUTED, fontStyle: "italic", borderTop: `1px solid ${BORDER}`, paddingTop: 8 }}>
            {m.toString()}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// ADMIN OVERVIEW
// ─────────────────────────────────────────────
function AdminOverview({ members }) {
  const today = new Date().toISOString().slice(0, 10);
  const todayCI = members.filter(m => m.getCheckIns().includes(today)).length;
  const paid = members.filter(m => m.getFeeStatus() === "Paid");
  const revenue = paid.reduce((s, m) => s + m.getFee(), 0);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 4, height: 22, background: RED, borderRadius: 2 }} />
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Admin dashboard</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10, marginBottom: 20 }}>
        <Stat label="Total members" value={members.length} />
        <Stat label="Check-ins today" value={todayCI} />
        <Stat label="Total revenue" value={`Rs.${revenue.toLocaleString()}`} />
        <Stat label="Pending fees" value={members.length - paid.length} sub={members.length - paid.length > 0 ? "action needed" : ""} />
      </div>
      <div style={T.card}>
        <div style={{ fontWeight: 800, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: MUTED, marginBottom: 12 }}>Recent members</div>
        {members.length === 0 && <div style={{ color: MUTED, fontSize: 13 }}>No members yet. Add one from the "Add member" tab.</div>}
        {[...members].reverse().slice(0, 6).map(m => (
          <div key={m.getId()} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: GRAY, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
              {m.getName().charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{m.getName()}</div>
              <div style={{ fontSize: 11, color: MUTED }}>#{m.getId()} · {m.getPhone()}{m.getTrainer() ? ` · ${m.getTrainer()}` : ""}</div>
            </div>
            <PkgBadge pkg={m.getPackage()} />
            <StatusBadge status={m.getFeeStatus()} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────
function AdminDashboard({ members, complaints, onAdd, onUpdate, onRemove, onToggleFee, onLogout }) {
  const [tab, setTab] = useState("overview");
  const [editing, setEditing] = useState(null);

  const tabs = [
    { id: "overview", label: "Overview", icon: "ti-layout-dashboard" },
    { id: "add", label: "Add member", icon: "ti-user-plus" },
    { id: "members", label: "All members", icon: "ti-users" },
    { id: "revenue", label: "Revenue", icon: "ti-chart-bar" },
  ];

  return (
    <Shell title="Admin" tabs={tabs} active={tab} onTab={t => { setTab(t); setEditing(null); }} onLogout={onLogout}>
      {tab === "overview" && <AdminOverview members={members} />}
      {tab === "add" && <MemberForm members={members} onSave={m => { onAdd(m); setTab("members"); }} />}
      {tab === "members" && !editing && (
        <MembersTable members={members} onRemove={onRemove} onEdit={m => { setEditing(m); setTab("members"); }} onToggleFee={onToggleFee} readonly={false} />
      )}
      {tab === "members" && editing && (
        <MemberForm members={members} existing={editing} onSave={m => { onUpdate(m); setEditing(null); }} onCancel={() => setEditing(null)} />
      )}
      {tab === "revenue" && <RevenueView members={members} />}
    </Shell>
  );
}

// ─────────────────────────────────────────────
// ATTENDANT DASHBOARD
// ─────────────────────────────────────────────
function AttendantDashboard({ members, complaints, onAdd, onCheckIn, onComplaint, onLogout }) {
  const [tab, setTab] = useState("checkin");

  const tabs = [
    { id: "checkin", label: "Check-in", icon: "ti-calendar-check" },
    { id: "members", label: "Members", icon: "ti-users" },
    { id: "search", label: "Search", icon: "ti-search" },
    { id: "consistency", label: "Consistency", icon: "ti-chart-line" },
    { id: "enrollments", label: "Enrollments", icon: "ti-calendar-month" },
    { id: "add", label: "Register", icon: "ti-user-plus" },
    { id: "complaints", label: "Complaints", icon: "ti-message-circle" },
  ];

  return (
    <Shell title="Attendant" tabs={tabs} active={tab} onTab={setTab} onLogout={onLogout}>
      {tab === "checkin" && <CheckInView members={members} onCheckIn={onCheckIn} />}
      {tab === "members" && <MembersTable members={members} readonly={true} />}
      {tab === "search" && <SearchView members={members} />}
      {tab === "consistency" && <ConsistencyView members={members} />}
      {tab === "enrollments" && <EnrollmentsView members={members} />}
      {tab === "add" && <MemberForm members={members} onSave={m => { onAdd(m); setTab("members"); }} />}
      {tab === "complaints" && <ComplaintsView complaints={complaints} onAdd={onComplaint} />}
    </Shell>
  );
}

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState(null);
  const [members, setMembers] = useState(() => loadMembers());
  const [complaints, setComplaints] = useState(() => loadComplaints());

  const addMember = useCallback(m => {
    setMembers(prev => { const n = [...prev, m]; saveMembers(n); return n; });
  }, []);

  const updateMember = useCallback(m => {
    setMembers(prev => { const n = prev.map(x => x.getId() === m.getId() ? m : x); saveMembers(n); return n; });
  }, []);

  const removeMember = useCallback(id => {
    setMembers(prev => { const n = prev.filter(m => m.getId() !== id); saveMembers(n); return n; });
  }, []);

  const toggleFee = useCallback(id => {
    setMembers(prev => {
      const n = prev.map(m => {
        if (m.getId() !== id) return m;
        const updated = Member.fromObject(m.toObject());
        updated.setFeeStatus(m.getFeeStatus() === "Paid" ? "Unpaid" : "Paid"); return updated;
      });
      saveMembers(n); return n;
    });
  }, []);

  const checkIn = useCallback(id => {
    const today = new Date().toISOString().slice(0, 10);
    setMembers(prev => {
      const n = prev.map(m => {
        if (m.getId() !== id) return m;
        const o = m.toObject(); if (!o.checkIns.includes(today)) o.checkIns.push(today);
        return Member.fromObject(o);
      });
      saveMembers(n); return n;
    });
  }, []);

  const addComplaint = useCallback(c => {
    setComplaints(prev => { const n = [...prev, c]; saveComplaints(n); return n; });
  }, []);

  if (!role) return <LoginScreen onLogin={setRole} />;
  if (role === "admin") return (
    <AdminDashboard members={members} complaints={complaints}
      onAdd={addMember} onUpdate={updateMember} onRemove={removeMember} onToggleFee={toggleFee}
      onLogout={() => setRole(null)} />
  );
  return (
    <AttendantDashboard members={members} complaints={complaints}
      onAdd={addMember} onCheckIn={checkIn} onComplaint={addComplaint}
      onLogout={() => setRole(null)} />
  );
}
