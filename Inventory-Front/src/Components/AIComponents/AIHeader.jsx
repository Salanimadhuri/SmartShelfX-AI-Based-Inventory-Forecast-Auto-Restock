/**
 * AIHeader — Reusable futuristic header for AI dashboard pages
 * Props: title, subtitle, icon, onReturn (function)
 */
import React from "react";

const AIHeader = ({ title, subtitle, icon = "🤖", onReturn, returnLabel = "Return" }) => (
  <div style={{
    background: "linear-gradient(90deg, #141e30 0%, #243b55 60%, #1565c0 100%)",
    padding: "28px 36px 22px",
    borderRadius: "0 0 24px 24px",
    marginBottom: "32px",
    boxShadow: "0 6px 32px rgba(20,30,48,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "14px",
  }}>
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
        <span style={{ fontSize: "2rem" }}>{icon}</span>
        <h1 style={{
          color: "#fdd835", fontWeight: 800, fontSize: "1.7rem",
          margin: 0, letterSpacing: "1px", textShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}>{title}</h1>
        <span style={{
          background: "linear-gradient(90deg,#1976d2,#42a5f5)",
          color: "#fff", fontSize: "0.65rem", fontWeight: 700,
          padding: "3px 10px", borderRadius: "20px", letterSpacing: "1px",
          textTransform: "uppercase", alignSelf: "center",
        }}>AI Powered</span>
      </div>
      {subtitle && (
        <p style={{ color: "rgba(255,255,255,0.7)", margin: 0, fontSize: "0.92rem", paddingLeft: "44px" }}>
          {subtitle}
        </p>
      )}
    </div>
    {onReturn && (
      <button onClick={onReturn} style={{
        background: "linear-gradient(90deg,#fbc02d,#f57f17)",
        color: "#141e30", border: "none", borderRadius: "10px",
        padding: "10px 22px", fontWeight: 700, fontSize: "0.95rem",
        cursor: "pointer", boxShadow: "0 3px 12px rgba(251,192,45,0.4)",
        transition: "all 0.2s ease", letterSpacing: "0.5px",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        ← {returnLabel}
      </button>
    )}
  </div>
);

export default AIHeader;
