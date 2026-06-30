/**
 * AppShell — Main layout shell with left sidebar + topbar
 * Search and Notifications are now fully wired.
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PersonCircle, List, X, ChevronRight } from "react-bootstrap-icons";
import Sidebar           from "./Sidebar";
import GlobalSearch      from "./GlobalSearch";
import NotificationPanel from "./NotificationPanel";
import "./EnterpriseStyles.css";

export default function AppShell({ role = "Admin", children, breadcrumb = [] }) {
  const navigate           = useNavigate();
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);

  const storedUser = localStorage.getItem("loggedInUser");
  const username   = storedUser ? JSON.parse(storedUser).username : role;

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInRole");
    navigate("/");
  };

  // Keyboard shortcut: Ctrl+K or Cmd+K opens search
  React.useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="ent-shell">
      {/* Global Search Modal */}
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:199 }}
        />
      )}

      {/* Sidebar */}
      <div className={mobileOpen ? "ent-sidebar open" : undefined}>
        <Sidebar role={role} />
      </div>

      {/* Main area */}
      <div className="ent-shell-main">

        {/* ── Top bar ── */}
        <header className="ent-topbar">
          <div className="ent-topbar-left">
            {/* Mobile menu button */}
            <button
              className="ent-btn ent-btn-ghost ent-btn-sm"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              style={{ display:"none" }}
            >
              {mobileOpen ? <X size={18} /> : <List size={18} />}
            </button>

            {/* Breadcrumb */}
            {breadcrumb.length > 0 && (
              <nav className="ent-breadcrumb" aria-label="Breadcrumb">
                {breadcrumb.map((crumb, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <ChevronRight size={12} className="sep" />}
                    {i === breadcrumb.length - 1 ? (
                      <span className="current">{crumb.label}</span>
                    ) : crumb.href ? (
                      <a
                        href={crumb.href}
                        style={{ color:"inherit", textDecoration:"none" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "inherit")}
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span>{crumb.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}
          </div>

          <div className="ent-topbar-right">

            {/* ── Search trigger ── */}
            <button
              className="ent-btn ent-btn-ghost ent-btn-sm"
              aria-label="Open search (Ctrl+K)"
              title="Search (Ctrl+K)"
              onClick={() => setSearchOpen(true)}
              style={{ color:"var(--text-muted)", display:"flex", alignItems:"center", gap:6 }}
            >
              {/* inline SVG so no extra import needed */}
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="9" r="7" />
                <line x1="15" y1="15" x2="19" y2="19" />
              </svg>
              <span style={{
                fontSize:"0.7rem", fontWeight:500,
                background:"var(--gray-100)", border:"1px solid var(--border)",
                borderRadius:"4px", padding:"1px 5px", color:"var(--text-muted)",
              }}>⌘K</span>
            </button>

            {/* ── Notification bell ── */}
            <NotificationPanel />

            {/* Divider */}
            <div style={{ width:1, height:20, background:"var(--border)" }} />

            {/* User */}
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{
                width:28, height:28, borderRadius:"50%",
                background:"var(--primary-light)",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <PersonCircle size={18} color="var(--primary)" />
              </div>
              <span style={{ fontSize:"0.813rem", fontWeight:500, color:"var(--text-secondary)" }}>
                {username}
              </span>
            </div>

            {/* Sign out */}
            <button
              className="ent-btn ent-btn-secondary ent-btn-sm"
              onClick={handleLogout}
              style={{ fontSize:"0.8rem" }}
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="ent-content">
          {children}
        </main>
      </div>
    </div>
  );
}
