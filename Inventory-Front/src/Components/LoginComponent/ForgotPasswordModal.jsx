import React, { useState, useEffect, useRef } from "react";
import { X, EnvelopeFill, CheckCircleFill, ExclamationCircleFill } from "react-bootstrap-icons";
import { forgotPassword } from "../../Services/AuthService";

export default function ForgotPasswordModal({ onClose }) {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);   // { message, devToken? }
  const [error,   setError]   = useState("");
  const inputRef = useRef(null);
  const wrapRef  = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  // Close on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const em = email.trim();
    if (!em) { setError("Please enter your email address."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setError("Please enter a valid email address."); return; }
    setLoading(true);
    try {
      const res = await forgotPassword(em);
      setSuccess(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={handleBackdrop} style={{
      position:"fixed", inset:0, background:"rgba(15,23,42,0.45)",
      zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center",
      padding:"16px", backdropFilter:"blur(4px)",
    }}>
      <div ref={wrapRef} style={{
        background:"#fff", borderRadius:20, padding:"32px 28px",
        width:"100%", maxWidth:420,
        boxShadow:"0 24px 64px rgba(0,0,0,0.14)",
        border:"1px solid #e2e8f0",
        animation:"fpIn .22s ease-out both",
        fontFamily:"'Inter',-apple-system,sans-serif",
      }}>
        <style>{`@keyframes fpIn{from{opacity:0;transform:scale(.95) translateY(-8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <div style={{ width:42, height:42, borderRadius:12, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
              <EnvelopeFill size={20} color="#2563eb"/>
            </div>
            <h2 style={{ fontWeight:800, color:"#0f172a", fontSize:"1.2rem", margin:"0 0 4px" }}>Forgot password?</h2>
            <p style={{ color:"#64748b", fontSize:".85rem", margin:0 }}>Enter your email and we'll send you a reset link.</p>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8", padding:4, borderRadius:8, display:"flex", alignItems:"center" }}
            onMouseEnter={e=>e.currentTarget.style.background="#f1f5f9"}
            onMouseLeave={e=>e.currentTarget.style.background="none"}>
            <X size={18}/>
          </button>
        </div>

        {!success ? (
          <>
            {error && (
              <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:9, padding:"9px 13px", marginBottom:14, color:"#dc2626", fontSize:".83rem", display:"flex", alignItems:"center", gap:7 }}>
                <ExclamationCircleFill size={14}/> {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:18 }}>
                <label style={{ display:"block", fontSize:".78rem", fontWeight:600, color:"#374151", marginBottom:6 }}>Email address</label>
                <div style={{
                  display:"flex", alignItems:"center",
                  background:"#fff", border:"1.5px solid #e2e8f0",
                  borderRadius:10, overflow:"hidden",
                  transition:"border-color .18s, box-shadow .18s",
                }} onFocus={()=>{}} className="fp-wrap">
                  <div style={{ paddingLeft:12, color:"#94a3b8", display:"flex", alignItems:"center" }}><EnvelopeFill size={14}/></div>
                  <input ref={inputRef} type="email" value={email} onChange={e=>{setEmail(e.target.value);setError("");}}
                    placeholder="you@example.com"
                    style={{ flex:1, border:"none", outline:"none", padding:"11px 12px", fontSize:".9rem", color:"#0f172a", background:"transparent", fontFamily:"inherit" }}/>
                </div>
                <style>{`.fp-wrap:focus-within{border-color:#2563eb!important;box-shadow:0 0 0 3px rgba(37,99,235,.1)!important}`}</style>
              </div>

              <button type="submit" disabled={loading} style={{
                width:"100%", padding:"12px", border:"none", borderRadius:11, cursor:loading?"not-allowed":"pointer",
                background:loading?"#93c5fd":"linear-gradient(90deg,#2563eb,#3b82f6)",
                color:"#fff", fontWeight:700, fontSize:".93rem", fontFamily:"inherit",
                boxShadow:"0 4px 16px rgba(37,99,235,.3)", transition:"transform .18s,box-shadow .18s",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              }}>
                {loading ? <><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,.35)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"lpSpin .7s linear infinite" }}/> Sending…</> : "Send Reset Link"}
              </button>
              <style>{`@keyframes lpSpin{to{transform:rotate(360deg)}}`}</style>
            </form>

            <button onClick={onClose} style={{ display:"block", width:"100%", marginTop:12, background:"none", border:"none", cursor:"pointer", color:"#64748b", fontSize:".85rem", fontFamily:"inherit", padding:"8px", borderRadius:8, transition:"background .15s" }}
              onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
              onMouseLeave={e=>e.currentTarget.style.background="none"}>
              Cancel
            </button>
          </>
        ) : (
          /* Success state */
          <div style={{ textAlign:"center", padding:"8px 0" }}>
            <div style={{ width:52, height:52, borderRadius:"50%", background:"#dcfce7", border:"1px solid #bbf7d0", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <CheckCircleFill size={24} color="#16a34a"/>
            </div>
            <h3 style={{ fontWeight:700, color:"#0f172a", marginBottom:8, fontSize:"1rem" }}>Check your inbox</h3>
            <p style={{ color:"#64748b", fontSize:".85rem", lineHeight:1.6, marginBottom:16 }}>{success.message}</p>

            {/* Dev mode: show token when no email is configured */}
            {success.devToken && (
              <div style={{ background:"#fefce8", border:"1px solid #fde68a", borderRadius:10, padding:"12px 14px", marginBottom:16, textAlign:"left" }}>
                <div style={{ fontSize:".72rem", fontWeight:700, color:"#d97706", marginBottom:6 }}>⚠ Dev Mode — No email configured</div>
                <div style={{ fontSize:".75rem", color:"#374151", marginBottom:4 }}>Use this token to test password reset:</div>
                <code style={{ fontSize:".72rem", wordBreak:"break-all", color:"#1d4ed8", background:"#eff6ff", padding:"4px 8px", borderRadius:6, display:"block" }}>{success.devToken}</code>
                <a href={`http://localhost:3838/reset-password?token=${success.devToken}`}
                  style={{ display:"inline-block", marginTop:8, fontSize:".75rem", color:"#2563eb", fontWeight:600 }}>
                  → Open Reset Page
                </a>
              </div>
            )}

            <button onClick={onClose} style={{
              padding:"10px 28px", border:"none", borderRadius:10, cursor:"pointer",
              background:"linear-gradient(90deg,#2563eb,#3b82f6)", color:"#fff",
              fontWeight:700, fontSize:".88rem", fontFamily:"inherit",
              boxShadow:"0 4px 14px rgba(37,99,235,.28)",
            }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
