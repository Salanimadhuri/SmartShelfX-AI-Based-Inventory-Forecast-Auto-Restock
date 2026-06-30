/**
 * PageLayout — Premium shared shell
 * Props: role ("Admin"|"Manager"|"Vendor"), children, activePath
 */
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV = {
  Admin: [
    {
      label: "SKU", icon: "🏷️",
      children: [
        { label: "SKU List",     href: "/SkuRepo?from=admin" },
        { label: "Add SKU",      href: "/SkuAdd" },
      ],
    },
    {
      label: "Products", icon: "📦",
      children: [
        { label: "Product List",          href: "/AdProdRepo" },
        { label: "Add Product",           href: "/ProductAdd" },
        { label: "All Sales Analysis",    href: "/AllProductAnalysis" },
        { label: "Single Product Demand", href: "/SingleProductDemand" },
      ],
    },
    {
      label: "Transactions", icon: "💳",
      children: [
        { label: "Issued History",      href: "/Transactions?type=issue" },
        { label: "Purchase History",    href: "/Transactions?type=purchase" },
        { label: "All Transactions",    href: "/Transactions" },
      ],
    },
    { label: "My Profile", icon: "👤", href: "/ShowSingleUser" },
  ],
  Manager: [
    {
      label: "SKU", icon: "🏷️",
      children: [
        { label: "SKU List", href: "/SkuRepo?from=manager" },
      ],
    },
    {
      label: "Products", icon: "📦",
      children: [
        { label: "Product List", href: "/MngProdRepo" },
      ],
    },
    {
      label: "Transactions", icon: "💳",
      children: [
        { label: "Issued History",   href: "/Transactions?type=issue" },
        { label: "Purchase History", href: "/Transactions?type=purchase" },
        { label: "All Transactions", href: "/Transactions" },
      ],
    },
    { label: "My Profile", icon: "👤", href: "/ShowSingleUser" },
  ],
  Vendor: [
    { label: "My Profile", icon: "👤", href: "/ShowSingleUser" },
  ],
};

const roleConfig = {
  Admin:   { color: "#6366f1", label: "Admin",   emoji: "🛡️" },
  Manager: { color: "#10b981", label: "Manager", emoji: "📋" },
  Vendor:  { color: "#f59e0b", label: "Vendor",  emoji: "🚚" },
};

export default function PageLayout({ children, role = "Admin" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [mobileOpen, setMobileOpen] = useState(false);

  const cfg = roleConfig[role] || roleConfig.Admin;
  const navItems = NAV[role] || [];

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInRole");
    navigate("/");
  };

  const isActive = (href) =>
    href && location.pathname + location.search === href;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#f8fafc 0%,#f1f5f9 50%,#eef2ff 100%)", fontFamily: "'Inter','SF Pro Display',sans-serif" }}>
      {/* ── Top Navigation Bar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(15,23,42,0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        padding: "0 28px",
        display: "flex", alignItems: "center", height: "60px", gap: "8px",
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate(role === "Admin" ? "/AdminMenu" : role === "Manager" ? "/ManagerMenu" : "/VendorMenu")}
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginRight: "28px" }}
        >
          <div style={{
            width: "32px", height: "32px", borderRadius: "9px",
            background: "linear-gradient(135deg,#6366f1,#0ea5e9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem", boxShadow: "0 3px 10px rgba(99,102,241,0.4)",
          }}>⚡</div>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.3px" }}>
            Smart<span style={{ color: "#a5b4fc" }}>ShelfX</span>
          </span>
        </div>

        {/* Desktop nav items */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }} className="desktop-nav">
          {navItems.map((item, i) =>
            item.children ? (
              <div
                key={i}
                style={{ position: "relative" }}
                onMouseEnter={() => setOpenDropdown(i)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button style={{
                  background: openDropdown === i ? "rgba(99,102,241,0.15)" : "transparent",
                  border: "none", color: openDropdown === i ? "#a5b4fc" : "rgba(255,255,255,0.75)",
                  padding: "6px 14px", borderRadius: "8px", fontWeight: 500,
                  fontSize: "0.88rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                  transition: "all 0.15s ease", fontFamily: "inherit",
                }}>
                  <span>{item.icon}</span>{item.label}
                  <span style={{ fontSize: "0.6rem", opacity: 0.7 }}>▼</span>
                </button>
                {openDropdown === i && (
                  <div style={{
                    position: "absolute", top: "100%", left: 0, minWidth: "200px",
                    background: "rgba(15,23,42,0.98)", backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px",
                    padding: "6px", boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
                    animation: "fadeIn 0.15s ease-out both",
                  }}>
                    {item.children.map((child, j) => (
                      <a key={j} href={child.href} style={{
                        display: "block", padding: "8px 14px", borderRadius: "8px",
                        color: isActive(child.href) ? "#a5b4fc" : "rgba(255,255,255,0.8)",
                        textDecoration: "none", fontSize: "0.87rem", fontWeight: 500,
                        background: isActive(child.href) ? "rgba(99,102,241,0.15)" : "transparent",
                        transition: "all 0.15s ease",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; e.currentTarget.style.color = "#a5b4fc"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = isActive(child.href) ? "rgba(99,102,241,0.15)" : "transparent"; e.currentTarget.style.color = isActive(child.href) ? "#a5b4fc" : "rgba(255,255,255,0.8)"; }}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a key={i} href={item.href} style={{
                background: isActive(item.href) ? "rgba(99,102,241,0.15)" : "transparent",
                border: "none", color: isActive(item.href) ? "#a5b4fc" : "rgba(255,255,255,0.75)",
                padding: "6px 14px", borderRadius: "8px", fontWeight: 500,
                fontSize: "0.88rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                textDecoration: "none", transition: "all 0.15s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; e.currentTarget.style.color = "#a5b4fc"; }}
                onMouseLeave={e => { e.currentTarget.style.background = isActive(item.href) ? "rgba(99,102,241,0.15)" : "transparent"; e.currentTarget.style.color = isActive(item.href) ? "#a5b4fc" : "rgba(255,255,255,0.75)"; }}
              >
                <span>{item.icon}</span>{item.label}
              </a>
            )
          )}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "auto" }}>
          {/* Role badge */}
          <span style={{
            background: `${cfg.color}22`, color: cfg.color, border: `1px solid ${cfg.color}44`,
            padding: "3px 10px", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.5px",
          }}>
            {cfg.emoji} {cfg.label}
          </span>

          {/* Logout */}
          <button onClick={handleLogout} style={{
            background: "rgba(239,68,68,0.1)", color: "#f87171",
            border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px",
            padding: "6px 14px", fontWeight: 600, fontSize: "0.82rem",
            cursor: "pointer", transition: "all 0.15s ease", fontFamily: "inherit",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ── Page Content ── */}
      <main style={{ padding: "28px 28px 48px", maxWidth: "1380px", margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
}
