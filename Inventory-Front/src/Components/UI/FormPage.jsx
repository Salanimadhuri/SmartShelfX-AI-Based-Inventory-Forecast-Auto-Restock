/**
 * FormPage — Reusable premium form page wrapper
 * Props: title, subtitle, icon, onBack, children, maxWidth
 */
import React from "react";

export default function FormPage({ title, subtitle, icon="📝", onBack, children, maxWidth="520px" }) {
  return (
    <div style={{
      minHeight:"100vh",background:"linear-gradient(135deg,#f8fafc 0%,#f1f5f9 50%,#eef2ff 100%)",
      display:"flex",alignItems:"flex-start",justifyContent:"center",
      padding:"40px 20px",fontFamily:"'Inter','SF Pro Display',sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        .fp-input{width:100%;padding:11px 14px;border-radius:10px;border:1.5px solid rgba(99,102,241,0.18);
          background:#fafbff;color:#0f172a;font-size:0.9rem;font-family:inherit;
          outline:none;transition:all 0.2s ease;box-sizing:border-box;}
        .fp-input:focus{border-color:#6366f1;background:#fff;box-shadow:0 0 0 3px rgba(99,102,241,0.1);}
        .fp-input::placeholder{color:#cbd5e1;}
        .fp-input.err{border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,0.08);}
        .fp-input[readonly],.fp-input:disabled{background:#f8fafc;color:#94a3b8;cursor:not-allowed;}
        .fp-label{display:block;margin-bottom:6px;font-weight:600;font-size:0.78rem;
          color:#64748b;letter-spacing:0.3px;text-transform:uppercase;}
        .fp-error{color:#ef4444;font-size:0.77rem;margin-top:4px;}
        .fp-field{margin-bottom:18px;}
      `}</style>

      <div style={{ width:"100%",maxWidth,animation:"fadeUp 0.5s ease both",paddingTop:"8px" }}>
        {onBack && (
          <button onClick={onBack} style={{
            background:"transparent",border:"none",color:"#64748b",fontSize:"0.87rem",
            cursor:"pointer",marginBottom:"18px",display:"flex",alignItems:"center",gap:"6px",
            fontFamily:"inherit",transition:"color 0.15s",padding:0,
          }}
            onMouseEnter={e=>e.currentTarget.style.color="#0f172a"}
            onMouseLeave={e=>e.currentTarget.style.color="#64748b"}
          >← Back</button>
        )}

        <div style={{
          background:"#fff",borderRadius:"20px",padding:"32px",
          boxShadow:"0 8px 40px rgba(0,0,0,0.07)",border:"1px solid rgba(99,102,241,0.1)",
        }}>
          <div style={{ marginBottom:"28px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:"12px",marginBottom:"6px" }}>
              <div style={{ width:"40px",height:"40px",borderRadius:"12px",background:"rgba(99,102,241,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem" }}>{icon}</div>
              <h2 style={{ fontWeight:800,color:"#0f172a",fontSize:"1.4rem",margin:0 }}>{title}</h2>
            </div>
            {subtitle && <p style={{ color:"#64748b",fontSize:"0.88rem",marginLeft:"52px",margin:"4px 0 0 52px" }}>{subtitle}</p>}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
