import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateUser } from "../../Services/LoginService";
import { getMailStatus } from "../../Services/AuthService";
import ForgotPasswordModal from "./ForgotPasswordModal";
import {
  Eye, EyeSlash, BoxSeam, ShieldLock,
  GraphUp, Bell, ClipboardData, People,
  ArrowRight,
} from "react-bootstrap-icons";

/* ── Mini analytics card for the left panel ── */
function AnalyticsIllustration() {
  const [health, setHealth] = useState(0);
  useEffect(() => {
    let v = 0;
    const t = setInterval(() => { v += 2; setHealth(Math.min(v, 78)); if (v >= 78) clearInterval(t); }, 18);
    return () => clearInterval(t);
  }, []);

  const r = 26, circ = 2 * Math.PI * r;
  const bars = [55, 70, 62, 85, 72, 91, 78];

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      border: "1px solid #e2e8f0",
      boxShadow: "0 8px 32px rgba(37,99,235,0.10)",
      padding: "18px 20px",
      width: "100%",
      maxWidth: 300,
      animation: "lpFloat 5s ease-in-out infinite",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <span style={{ fontWeight:700, color:"#0f172a", fontSize:"0.8rem" }}>Inventory Overview</span>
        <span style={{ background:"#eff6ff", color:"#2563eb", fontSize:"0.65rem", fontWeight:700, padding:"2px 8px", borderRadius:999, border:"1px solid #bfdbfe" }}>LIVE</span>
      </div>

      {/* Bar chart */}
      <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:44, marginBottom:14 }}>
        {bars.map((v, i) => (
          <div key={i} style={{
            flex:1, borderRadius:4,
            background: i === 6 ? "linear-gradient(180deg,#2563eb,#3b82f6)" : "#dbeafe",
            height:`${v}%`,
            transition:`height .6s ease ${i*.07}s`,
          }} />
        ))}
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        {/* Ring */}
        <div style={{ position:"relative", flexShrink:0 }}>
          <svg width={60} height={60} viewBox="0 0 60 60">
            <circle cx={30} cy={30} r={r} fill="none" stroke="#e2e8f0" strokeWidth={5}/>
            <circle cx={30} cy={30} r={r} fill="none"
              stroke="#2563eb" strokeWidth={5}
              strokeDasharray={`${circ*(health/100)} ${circ*(1-health/100)}`}
              strokeLinecap="round" transform="rotate(-90 30 30)"/>
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontWeight:800, color:"#0f172a", fontSize:"0.9rem", lineHeight:1 }}>{health}%</span>
            <span style={{ color:"#64748b", fontSize:"0.5rem", fontWeight:600 }}>HEALTH</span>
          </div>
        </div>

        {/* Stat rows */}
        <div style={{ flex:1 }}>
          {[
            { label:"Low Stock",    value:"12 items",  color:"#f59e0b" },
            { label:"Pred. Demand", value:"+18%",      color:"#2563eb" },
            { label:"Auto-Restock", value:"Active",    color:"#16a34a" },
          ].map(s => (
            <div key={s.label} style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:s.color }}/>
                <span style={{ color:"#64748b", fontSize:"0.68rem" }}>{s.label}</span>
              </div>
              <span style={{ color:"#0f172a", fontWeight:700, fontSize:"0.72rem" }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: <GraphUp    size={14}/>, label: "Automated demand forecasting"     },
  { icon: <Bell       size={14}/>, label: "Real-time low stock alerts"        },
  { icon: <ClipboardData size={14}/>, label: "Transaction history & reports"  },
  { icon: <People     size={14}/>, label: "Role-based access control"         },
];

/* ── Main component ── */
const LoginPage = () => {
  const navigate = useNavigate();
  const [form,      setForm]     = useState({ username:"", password:"" });
  const [errors,    setErrors]   = useState({});
  const [showPass,  setShowPass] = useState(false);
  const [remember,  setRemember] = useState(false);
  const [loading,   setLoading]  = useState(false);
  const [authErr,   setAuthErr]  = useState("");
  const [mounted,   setMounted]  = useState(false);
  const [showForgot,setShowForgot] = useState(false);
  const [mailCfg,   setMailCfg]  = useState({ mailConfigured: false, googleConfigured: false });

  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t); }, []);

  useEffect(() => {
    getMailStatus()
      .then(r => setMailCfg(r.data))
      .catch(() => {}); // silently ignore if backend not yet restarted
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]:"" }));
    setAuthErr("");
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required";
    if (!form.password.trim()) e.password = "Password is required";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await validateUser(form.username, form.password);
      const role = String(res.data);
      localStorage.setItem("loggedInUser", JSON.stringify({ username: form.username }));
      localStorage.setItem("loggedInRole", role);
      if      (role === "Admin")   navigate("/AdminMenu");
      else if (role === "Manager") navigate("/ManagerMenu");
      else if (role === "Vendor")  navigate("/VendorMenu");
      else setAuthErr("Invalid credentials. Please try again.");
    } catch { setAuthErr("Invalid credentials. Please try again."); }
    finally  { setLoading(false); }
  };

  return (
    <>
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes lpFadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lpFadeLeft { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
        @keyframes lpFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes lpSpin     { to{transform:rotate(360deg)} }
        @keyframes lpArrow    { 0%,100%{transform:translateX(0)} 50%{transform:translateX(4px)} }
        .lp-input-wrap { display:flex; align-items:center; background:#fff; border:1.5px solid #e2e8f0; border-radius:10px; overflow:hidden; transition:border-color .18s,box-shadow .18s; }
        .lp-input-wrap:focus-within { border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,.1); }
        .lp-input-wrap.err { border-color:#ef4444; }
        .lp-input { flex:1; border:none; outline:none; padding:11px 12px; font-size:.9rem; color:#0f172a; background:transparent; font-family:'Inter',sans-serif; }
        .lp-input::placeholder { color:#94a3b8; }
        .lp-btn { width:100%; padding:13px; border:none; border-radius:11px; cursor:pointer; font-size:.95rem; font-weight:700; font-family:'Inter',sans-serif; background:linear-gradient(90deg,#2563eb,#3b82f6); color:#fff; box-shadow:0 4px 18px rgba(37,99,235,.32); transition:transform .18s,box-shadow .18s; display:flex; align-items:center; justify-content:center; gap:8px; position:relative; overflow:hidden; }
        .lp-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 28px rgba(37,99,235,.42); }
        .lp-btn::before { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.14),transparent); transition:left .45s; }
        .lp-btn:hover::before { left:100%; }
        .lp-btn .arr { animation:lpArrow 1.6s ease-in-out infinite; }
        .lp-google { width:100%; padding:11px; border:1.5px solid #e2e8f0; border-radius:10px; background:#fff; cursor:pointer; font-size:.87rem; font-family:'Inter',sans-serif; font-weight:500; color:#374151; display:flex; align-items:center; justify-content:center; gap:9px; transition:background .15s,border-color .15s; }
        .lp-google:hover { background:#f8fafc; border-color:#cbd5e1; }
        .lp-link { background:none; border:none; cursor:pointer; font-family:'Inter',sans-serif; color:#2563eb; font-weight:600; font-size:.87rem; padding:0; transition:color .15s; }
        .lp-link:hover { color:#1d4ed8; text-decoration:underline; }
        @media(max-width:860px){ .lp-left-panel{ display:none!important; } .lp-right-panel{ padding:32px 20px!important; } }
      `}</style>

      <div style={{
        minHeight:"100vh", display:"flex",
        fontFamily:"'Inter',-apple-system,sans-serif",
        background:"#f8fafc",
        opacity: mounted ? 1 : 0, transition:"opacity .35s ease",
      }}>

        {/* ══ LEFT PANEL ══ */}
        <div className="lp-left-panel" style={{
          flex:"0 0 44%", display:"flex", flexDirection:"column",
          justifyContent:"space-between", padding:"48px 48px 40px",
          background:"linear-gradient(145deg,#eff6ff 0%,#dbeafe 50%,#ede9fe 100%)",
          borderRight:"1px solid #e2e8f0", position:"relative", overflow:"hidden",
        }}>
          {/* Decorative circles */}
          <div style={{ position:"absolute", top:"-80px", right:"-80px", width:300, height:300, borderRadius:"50%", background:"rgba(37,99,235,.07)", pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:"-60px", left:"-60px", width:220, height:220, borderRadius:"50%", background:"rgba(59,130,246,.06)", pointerEvents:"none" }}/>

          <div style={{ position:"relative", zIndex:1 }}>
            {/* Logo */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:48, animation:"lpFadeLeft .6s ease both" }}>
              <div style={{ width:38, height:38, borderRadius:10, background:"linear-gradient(135deg,#2563eb,#3b82f6)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(37,99,235,.35)" }}>
                <BoxSeam size={18} color="#fff"/>
              </div>
              <span style={{ fontWeight:800, fontSize:"1.15rem", color:"#0f172a", letterSpacing:"-0.2px" }}>
                Smart<span style={{ color:"#2563eb" }}>ShelfX</span>
              </span>
            </div>

            {/* Headline */}
            <div style={{ animation:"lpFadeLeft .6s ease .08s both" }}>
              <h1 style={{ color:"#0f172a", fontSize:"1.85rem", fontWeight:900, lineHeight:1.2, letterSpacing:"-0.5px", marginBottom:14 }}>
                Inventory intelligence<br/>
                <span style={{ color:"#2563eb" }}>for modern teams</span>
              </h1>
              <p style={{ color:"#475569", fontSize:".9rem", lineHeight:1.65, marginBottom:32, maxWidth:320 }}>
                AI-powered forecasting, automated restock alerts, and real-time inventory analytics.
              </p>
            </div>

            {/* Analytics card */}
            <div style={{ marginBottom:32, animation:"lpFadeLeft .6s ease .16s both" }}>
              <AnalyticsIllustration/>
            </div>

            {/* Features */}
            <div style={{ animation:"lpFadeLeft .6s ease .24s both" }}>
              {FEATURES.map(f => (
                <div key={f.label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <div style={{ width:22, height:22, borderRadius:"50%", background:"#dbeafe", border:"1px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"#2563eb" }}>
                    {f.icon}
                  </div>
                  <span style={{ color:"#374151", fontSize:".85rem", fontWeight:500 }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="lp-right-panel" style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"48px 32px", background:"#f8fafc" }}>
          <div style={{ width:"100%", maxWidth:400, animation:"lpFadeUp .55s ease .1s both" }}>

            {/* Card */}
            <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:20, padding:"36px 32px", boxShadow:"0 4px 24px rgba(0,0,0,0.07)" }}>

              {/* Logo mark */}
              <div style={{ textAlign:"center", marginBottom:22 }}>
                <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,#2563eb,#3b82f6)", display:"inline-flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(37,99,235,.28)" }}>
                  <BoxSeam size={22} color="#fff"/>
                </div>
              </div>

              <h2 style={{ textAlign:"center", fontWeight:800, color:"#0f172a", fontSize:"1.45rem", marginBottom:5, letterSpacing:"-0.2px" }}>
                Welcome back 
              </h2>
              <p style={{ textAlign:"center", color:"#64748b", fontSize:".875rem", marginBottom:26 }}>
                Sign in to continue to SmartShelfX
              </p>

              {/* Auth error */}
              {authErr && (
                <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:9, padding:"9px 13px", marginBottom:16, color:"#dc2626", fontSize:".83rem", display:"flex", alignItems:"center", gap:7 }}>
                  <span>⚠</span> {authErr}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Username field */}
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontSize:".78rem", fontWeight:600, color:"#374151", marginBottom:6 }}>Username</label>
                  <div className={`lp-input-wrap${errors.username?" err":""}`}>
                    <div style={{ paddingLeft:12, color:"#94a3b8", display:"flex", alignItems:"center" }}>
                      <ShieldLock size={15}/>
                    </div>
                    <input className="lp-input" name="username" type="text"
                      value={form.username} onChange={onChange}
                      placeholder="Enter your username" autoComplete="username"/>
                  </div>
                  {errors.username && <p style={{ color:"#ef4444", fontSize:".75rem", marginTop:4 }}>{errors.username}</p>}
                </div>

                {/* Password field */}
                <div style={{ marginBottom:12 }}>
                  <label style={{ display:"block", fontSize:".78rem", fontWeight:600, color:"#374151", marginBottom:6 }}>Password</label>
                  <div className={`lp-input-wrap${errors.password?" err":""}`}>
                    <div style={{ paddingLeft:12, color:"#94a3b8", display:"flex", alignItems:"center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                    <input className="lp-input" name="password" type={showPass?"text":"password"}
                      value={form.password} onChange={onChange}
                      placeholder="Enter your password" autoComplete="current-password"/>
                    <button type="button" onClick={() => setShowPass(p=>!p)}
                      style={{ background:"none", border:"none", cursor:"pointer", paddingRight:12, color:"#94a3b8", display:"flex", alignItems:"center", transition:"color .15s" }}
                      onMouseEnter={e=>e.currentTarget.style.color="#475569"}
                      onMouseLeave={e=>e.currentTarget.style.color="#94a3b8"}>
                      {showPass ? <EyeSlash size={14}/> : <Eye size={14}/>}
                    </button>
                  </div>
                  {errors.password && <p style={{ color:"#ef4444", fontSize:".75rem", marginTop:4 }}>{errors.password}</p>}
                </div>

                {/* Remember + Forgot */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <label style={{ display:"flex", alignItems:"center", gap:7, cursor:"pointer" }}>
                    <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}
                      style={{ width:14, height:14, accentColor:"#2563eb", cursor:"pointer" }}/>
                    <span style={{ color:"#64748b", fontSize:".8rem" }}>Remember me</span>
                  </label>
                  <button type="button" className="lp-link" style={{ fontSize:".8rem" }}
                    onClick={() => setShowForgot(true)}>
                    Forgot password?
                  </button>
                </div>

                {/* Sign in btn */}
                <button type="submit" disabled={loading} className="lp-btn" style={{ marginBottom:16 }}>
                  {loading ? (
                    <><span style={{ width:17, height:17, border:"2.5px solid rgba(255,255,255,.35)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"lpSpin .7s linear infinite" }}/> Signing in…</>
                  ) : (
                    <>Sign In <span className="arr"><ArrowRight size={15}/></span></>
                  )}
                </button>
              </form>

              {/* OR divider */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ flex:1, height:1, background:"#e2e8f0" }}/>
                <span style={{ color:"#94a3b8", fontSize:".75rem" }}>OR</span>
                <div style={{ flex:1, height:1, background:"#e2e8f0" }}/>
              </div>

              {/* Google sign-in */}
              {mailCfg.googleConfigured ? (
                <button className="lp-google" style={{ marginBottom:22 }}
                  onClick={() => { window.location.href = `${process.env.REACT_APP_API_URL || "http://localhost:9898"}/oauth2/authorization/google`; }}>
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              ) : (
                <div style={{ marginBottom:22, padding:"11px 14px", border:"1px solid #e2e8f0", borderRadius:10, background:"#f8fafc", display:"flex", alignItems:"center", justifyContent:"center", gap:9, cursor:"not-allowed" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" style={{ opacity:.35 }}>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span style={{ fontSize:".84rem", color:"#94a3b8", fontWeight:500 }}>Google Sign-In not configured</span>
                </div>
              )}

              <p style={{ textAlign:"center", color:"#64748b", fontSize:".85rem", margin:0 }}>
                Don't have an account?{" "}
                <button className="lp-link" onClick={() => navigate("/Register")}>Create account</button>
              </p>
            </div>

            <p style={{ textAlign:"center", color:"#94a3b8", fontSize:".72rem", marginTop:18 }}>
              SmartShelfX Enterprise · Secure Sign In
            </p>
          </div>
        </div>

      </div>
    </>
  );
};

export default LoginPage;
