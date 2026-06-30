import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BoxSeam, Eye, EyeSlash, CheckCircleFill, ExclamationCircleFill } from "react-bootstrap-icons";
import { validateResetToken, resetPassword } from "../../Services/AuthService";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params]  = useSearchParams();
  const token     = params.get("token") || "";

  const [status,   setStatus]   = useState("checking"); // checking | valid | invalid | done
  const [email,    setEmail]    = useState("");
  const [pw,       setPw]       = useState("");
  const [pw2,      setPw2]      = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [showPw2,  setShowPw2]  = useState(false);
  const [error,    setError]    = useState("");
  const [saving,   setSaving]   = useState(false);
  const [tokenMsg, setTokenMsg] = useState("");

  useEffect(() => {
    if (!token) { setStatus("invalid"); setTokenMsg("No reset token found. Please request a new link."); return; }
    validateResetToken(token)
      .then(r => {
        if (r.data.valid) { setEmail(r.data.email || ""); setStatus("valid"); }
        else { setStatus("invalid"); setTokenMsg(r.data.message || "Invalid or expired token."); }
      })
      .catch(() => { setStatus("invalid"); setTokenMsg("Could not verify token. Please try again."); });
  }, [token]);

  const validate = () => {
    if (!pw.trim())              { setError("Password is required.");             return false; }
    if (pw.length < 5)           { setError("Password must be at least 5 characters."); return false; }
    if (pw !== pw2)              { setError("Passwords do not match.");           return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setSaving(true);
    try {
      const res = await resetPassword(token, pw);
      if (res.data.success) setStatus("done");
      else setError(res.data.message || "Reset failed.");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally { setSaving(false); }
  };

  const inputStyle = (err) => ({
    display:"flex", alignItems:"center",
    background:"#fff", border:`1.5px solid ${err?"#ef4444":"#e2e8f0"}`,
    borderRadius:10, overflow:"hidden",
    transition:"border-color .18s, box-shadow .18s",
  });

  return (
    <div style={{ minHeight:"100vh", background:"#f8fafc", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Inter',-apple-system,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes rpSpin { to{transform:rotate(360deg)} }
        @keyframes rpIn   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .rp-wrap:focus-within { border-color:#2563eb!important; box-shadow:0 0 0 3px rgba(37,99,235,.1)!important; }
        .rp-inp { flex:1;border:none;outline:none;padding:11px 12px;font-size:.9rem;color:#0f172a;background:transparent;font-family:inherit; }
        .rp-inp::placeholder { color:#94a3b8; }
      `}</style>

      <div style={{ width:"100%", maxWidth:400, animation:"rpIn .4s ease both" }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ width:44, height:44, borderRadius:13, background:"linear-gradient(135deg,#2563eb,#3b82f6)", display:"inline-flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(37,99,235,.28)" }}>
            <BoxSeam size={20} color="#fff"/>
          </div>
          <div style={{ fontWeight:800, color:"#0f172a", fontSize:"1.05rem", marginTop:8 }}>Smart<span style={{ color:"#2563eb" }}>ShelfX</span></div>
        </div>

        <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:20, padding:"32px 28px", boxShadow:"0 4px 24px rgba(0,0,0,0.07)" }}>

          {/* CHECKING */}
          {status === "checking" && (
            <div style={{ textAlign:"center", padding:"24px 0" }}>
              <div style={{ width:36, height:36, border:"3px solid #dbeafe", borderTopColor:"#2563eb", borderRadius:"50%", animation:"rpSpin .7s linear infinite", margin:"0 auto 14px" }}/>
              <p style={{ color:"#64748b", fontSize:".9rem" }}>Verifying your reset link…</p>
            </div>
          )}

          {/* INVALID */}
          {status === "invalid" && (
            <div style={{ textAlign:"center", padding:"8px 0" }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:"#fee2e2", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                <ExclamationCircleFill size={24} color="#dc2626"/>
              </div>
              <h3 style={{ fontWeight:700, color:"#0f172a", marginBottom:8 }}>Link Invalid or Expired</h3>
              <p style={{ color:"#64748b", fontSize:".875rem", lineHeight:1.6, marginBottom:20 }}>{tokenMsg}</p>
              <button onClick={() => navigate("/")} style={{ padding:"11px 28px", border:"none", borderRadius:10, cursor:"pointer", background:"linear-gradient(90deg,#2563eb,#3b82f6)", color:"#fff", fontWeight:700, fontSize:".9rem", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(37,99,235,.28)" }}>
                Back to Sign In
              </button>
            </div>
          )}

          {/* VALID — show form */}
          {status === "valid" && (
            <>
              <h2 style={{ fontWeight:800, color:"#0f172a", fontSize:"1.3rem", marginBottom:5 }}>Set new password</h2>
              <p style={{ color:"#64748b", fontSize:".875rem", marginBottom:22 }}>
                {email ? <>Resetting password for <strong>{email}</strong></> : "Enter your new password below."}
              </p>

              {error && (
                <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:9, padding:"9px 13px", marginBottom:14, color:"#dc2626", fontSize:".83rem", display:"flex", alignItems:"center", gap:7 }}>
                  <ExclamationCircleFill size={13}/> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontSize:".78rem", fontWeight:600, color:"#374151", marginBottom:6 }}>New Password</label>
                  <div className="rp-wrap" style={inputStyle(false)}>
                    <div style={{ paddingLeft:12, color:"#94a3b8", display:"flex", alignItems:"center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <input className="rp-inp" type={showPw?"text":"password"} value={pw} placeholder="Min. 5 characters"
                      onChange={e=>{setPw(e.target.value);setError("");}}/>
                    <button type="button" onClick={()=>setShowPw(p=>!p)}
                      style={{ background:"none",border:"none",cursor:"pointer",paddingRight:12,color:"#94a3b8",display:"flex",alignItems:"center" }}>
                      {showPw ? <EyeSlash size={14}/> : <Eye size={14}/>}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom:20 }}>
                  <label style={{ display:"block", fontSize:".78rem", fontWeight:600, color:"#374151", marginBottom:6 }}>Confirm Password</label>
                  <div className="rp-wrap" style={inputStyle(pw2 && pw !== pw2)}>
                    <div style={{ paddingLeft:12, color:"#94a3b8", display:"flex", alignItems:"center" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <input className="rp-inp" type={showPw2?"text":"password"} value={pw2} placeholder="Repeat password"
                      onChange={e=>{setPw2(e.target.value);setError("");}}/>
                    <button type="button" onClick={()=>setShowPw2(p=>!p)}
                      style={{ background:"none",border:"none",cursor:"pointer",paddingRight:12,color:"#94a3b8",display:"flex",alignItems:"center" }}>
                      {showPw2 ? <EyeSlash size={14}/> : <Eye size={14}/>}
                    </button>
                  </div>
                  {pw2 && pw !== pw2 && <p style={{ color:"#ef4444", fontSize:".75rem", marginTop:4 }}>Passwords do not match</p>}
                </div>

                {/* Strength indicator */}
                {pw.length > 0 && (
                  <div style={{ marginBottom:16 }}>
                    <div style={{ display:"flex", gap:4, marginBottom:4 }}>
                      {[1,2,3,4].map(n => (
                        <div key={n} style={{ flex:1, height:4, borderRadius:999, background: pw.length >= n*3 ? (pw.length>=12?"#16a34a":pw.length>=8?"#f59e0b":"#ef4444") : "#e2e8f0" }}/>
                      ))}
                    </div>
                    <span style={{ fontSize:".72rem", color:"#64748b" }}>
                      {pw.length < 5 ? "Too short" : pw.length < 8 ? "Weak" : pw.length < 12 ? "Good" : "Strong"}
                    </span>
                  </div>
                )}

                <button type="submit" disabled={saving} style={{
                  width:"100%", padding:"12px", border:"none", borderRadius:11,
                  cursor:saving?"not-allowed":"pointer",
                  background:saving?"#93c5fd":"linear-gradient(90deg,#2563eb,#3b82f6)",
                  color:"#fff", fontWeight:700, fontSize:".93rem", fontFamily:"inherit",
                  boxShadow:"0 4px 16px rgba(37,99,235,.3)",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                }}>
                  {saving ? <><span style={{ width:16,height:16,border:"2px solid rgba(255,255,255,.35)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"rpSpin .7s linear infinite" }}/> Updating…</> : "Update Password"}
                </button>
              </form>
            </>
          )}

          {/* DONE */}
          {status === "done" && (
            <div style={{ textAlign:"center", padding:"8px 0" }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:"#dcfce7", border:"1px solid #bbf7d0", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                <CheckCircleFill size={24} color="#16a34a"/>
              </div>
              <h3 style={{ fontWeight:700, color:"#0f172a", marginBottom:8 }}>Password Updated!</h3>
              <p style={{ color:"#64748b", fontSize:".875rem", lineHeight:1.6, marginBottom:20 }}>Your password has been changed successfully. You can now sign in.</p>
              <button onClick={() => navigate("/")} style={{ padding:"11px 28px", border:"none", borderRadius:10, cursor:"pointer", background:"linear-gradient(90deg,#2563eb,#3b82f6)", color:"#fff", fontWeight:700, fontSize:".9rem", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(37,99,235,.28)" }}>
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
