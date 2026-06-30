import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell, X, CheckAll, ExclamationTriangle, InfoCircle, CheckCircle } from "react-bootstrap-icons";
import { getNotifications, markRead, markAllRead } from "../../Services/NotificationService";

const TYPE_CONFIG = {
  ERROR:   { icon: <ExclamationTriangle size={14} />, color:"#dc2626", bg:"#fef2f2", border:"#fecaca", dot:"#dc2626" },
  WARNING: { icon: <ExclamationTriangle size={14} />, color:"#d97706", bg:"#fefce8", border:"#fde68a", dot:"#d97706" },
  SUCCESS: { icon: <CheckCircle        size={14} />, color:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0", dot:"#16a34a" },
  INFO:    { icon: <InfoCircle         size={14} />, color:"#1d4ed8", bg:"#eff6ff", border:"#bfdbfe", dot:"#1d4ed8" },
};

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

export default function NotificationPanel() {
  const panelRef    = useRef(null);
  const [open,      setOpen]      = useState(false);
  const [items,     setItems]     = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [unread,    setUnread]    = useState(0);
  const [error,     setError]     = useState("");

  const fetchNotifications = useCallback(() => {
    setLoading(true); setError("");
    getNotifications()
      .then(r => {
        const list = r.data || [];
        setItems(list);
        setUnread(list.filter(n => !n.read).length);
      })
      .catch(() => setError("Failed to load notifications."))
      .finally(() => setLoading(false));
  }, []);

  // Load on first open
  useEffect(() => { if (open) fetchNotifications(); }, [open, fetchNotifications]);

  // Auto-refresh every 30s
  useEffect(() => {
    const t = setInterval(() => {
      getNotifications()
        .then(r => {
          const list = r.data || [];
          setItems(list);
          setUnread(list.filter(n => !n.read).length);
        })
        .catch(() => {});
    }, 30000);
    return () => clearInterval(t);
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleMarkRead = async (id) => {
    await markRead(id);
    setItems(p => p.map(n => n.id === id ? { ...n, read: true } : n));
    setUnread(p => Math.max(0, p - 1));
  };

  const handleMarkAll = async () => {
    await markAllRead();
    setItems(p => p.map(n => ({ ...n, read: true })));
    setUnread(0);
  };

  return (
    <div ref={panelRef} style={{ position:"relative" }}>
      <style>{`
        @keyframes npIn { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .np-item { display:flex; gap:10px; padding:12px 16px; border-bottom:1px solid #f9fafb; transition:background 0.1s; cursor:default; }
        .np-item:hover { background:#f9fafb; }
        .np-item.unread { background:#fafbff; }
        @keyframes ent-spin { to { transform:rotate(360deg); } }
      `}</style>

      {/* Bell button */}
      <button
        onClick={() => setOpen(p => !p)}
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
        style={{
          position:"relative", background:"transparent", border:"none",
          cursor:"pointer", padding:"6px", borderRadius:"8px", display:"flex",
          alignItems:"center", justifyContent:"center",
          color: open ? "var(--primary)" : "var(--text-muted)",
          transition:"all 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background="var(--gray-100)"}
        onMouseLeave={e => e.currentTarget.style.background="transparent"}
      >
        <Bell size={17} />
        {unread > 0 && (
          <span style={{
            position:"absolute", top:"2px", right:"2px",
            minWidth:"16px", height:"16px",
            background:"#dc2626", color:"#fff",
            borderRadius:"999px", fontSize:"0.65rem", fontWeight:700,
            display:"flex", alignItems:"center", justifyContent:"center",
            border:"1.5px solid #fff", padding:"0 3px",
          }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 8px)", right:0,
          width:"360px", maxHeight:"480px",
          background:"#fff", borderRadius:"14px",
          boxShadow:"0 16px 48px rgba(0,0,0,0.16)",
          border:"1px solid #e5e7eb",
          zIndex:500, overflow:"hidden",
          animation:"npIn 0.18s ease-out both",
          display:"flex", flexDirection:"column",
        }}>
          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px 12px", borderBottom:"1px solid #f3f4f6" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontWeight:700, color:"#111827", fontSize:"0.9375rem" }}>Notifications</span>
              {unread > 0 && (
                <span style={{ background:"#eff6ff", color:"#1d4ed8", border:"1px solid #bfdbfe", borderRadius:"999px", padding:"1px 8px", fontSize:"0.7rem", fontWeight:700 }}>
                  {unread} new
                </span>
              )}
            </div>
            <div style={{ display:"flex", gap:4 }}>
              {unread > 0 && (
                <button onClick={handleMarkAll}
                  title="Mark all as read"
                  style={{ background:"none", border:"none", cursor:"pointer", color:"#1d4ed8", fontSize:"0.78rem", fontWeight:600, fontFamily:"inherit", display:"flex", alignItems:"center", gap:4, padding:"4px 6px", borderRadius:6 }}
                  onMouseEnter={e => e.currentTarget.style.background="#eff6ff"}
                  onMouseLeave={e => e.currentTarget.style.background="none"}>
                  <CheckAll size={14} /> Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)}
                style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", padding:"4px", borderRadius:6, display:"flex", alignItems:"center" }}
                onMouseEnter={e => e.currentTarget.style.background="#f3f4f6"}
                onMouseLeave={e => e.currentTarget.style.background="none"}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div style={{ overflowY:"auto", flex:1 }}>
            {loading ? (
              <div style={{ padding:"36px", textAlign:"center" }}>
                <div style={{ width:28, height:28, border:"2.5px solid #e5e7eb", borderTopColor:"#1d4ed8", borderRadius:"50%", animation:"ent-spin 0.7s linear infinite", margin:"0 auto 10px" }} />
                <p style={{ color:"#9ca3af", fontSize:"0.875rem", margin:0 }}>Loading…</p>
              </div>
            ) : error ? (
              <div style={{ padding:"20px 16px", textAlign:"center", color:"#dc2626", fontSize:"0.875rem" }}>
                ⚠ {error}
                <button onClick={fetchNotifications} style={{ display:"block", margin:"8px auto 0", background:"none", border:"none", color:"#1d4ed8", cursor:"pointer", fontSize:"0.8125rem", fontFamily:"inherit" }}>
                  Retry
                </button>
              </div>
            ) : items.length === 0 ? (
              <div style={{ padding:"40px 16px", textAlign:"center" }}>
                <CheckCircle size={32} color="#d1d5db" style={{ marginBottom:10 }} />
                <p style={{ color:"#9ca3af", fontSize:"0.875rem", margin:0 }}>All caught up! No notifications.</p>
              </div>
            ) : (
              items.map((n) => {
                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.INFO;
                return (
                  <div key={n.id} className={`np-item${n.read ? "" : " unread"}`}
                    onClick={() => !n.read && handleMarkRead(n.id)}>
                    {/* Icon */}
                    <div style={{
                      width:32, height:32, borderRadius:"50%", flexShrink:0,
                      background:cfg.bg, border:`1px solid ${cfg.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:cfg.color,
                    }}>
                      {cfg.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:6 }}>
                        <span style={{ fontWeight: n.read ? 500 : 700, color:"#111827", fontSize:"0.8375rem", lineHeight:1.35 }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize:"0.7rem", color:"#9ca3af", flexShrink:0, whiteSpace:"nowrap" }}>
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p style={{ margin:"3px 0 0", fontSize:"0.78rem", color: n.read ? "#9ca3af" : "#4b5563", lineHeight:1.45 }}>
                        {n.message}
                      </p>
                      {!n.read && (
                        <button onClick={e => { e.stopPropagation(); handleMarkRead(n.id); }}
                          style={{ marginTop:4, background:"none", border:"none", cursor:"pointer", color:"#1d4ed8", fontSize:"0.72rem", fontWeight:600, fontFamily:"inherit", padding:0 }}>
                          Mark as read
                        </button>
                      )}
                    </div>

                    {/* Unread dot */}
                    {!n.read && (
                      <div style={{ width:7, height:7, borderRadius:"50%", background:cfg.dot, flexShrink:0, marginTop:4 }} />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div style={{ padding:"10px 16px", borderTop:"1px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <button onClick={fetchNotifications}
              style={{ background:"none", border:"none", cursor:"pointer", color:"#6b7280", fontSize:"0.78rem", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4 }}
              onMouseEnter={e => e.currentTarget.style.color="#1d4ed8"}
              onMouseLeave={e => e.currentTarget.style.color="#6b7280"}>
              ↻ Refresh
            </button>
            <span style={{ fontSize:"0.72rem", color:"#9ca3af" }}>{items.length} total</span>
          </div>
        </div>
      )}
    </div>
  );
}
