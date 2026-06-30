import React from "react";
import AppShell from "../UI/AppShell";
import { PersonCircle, ShieldLock, ArrowRight } from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

export default function VendorMenu() {
  const storedUser = localStorage.getItem("loggedInUser");
  const username = storedUser ? JSON.parse(storedUser).username : "Vendor";

  return (
    <AppShell role="Vendor" breadcrumb={[{ label: "Dashboard" }]}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: 4 }}>
          Welcome, {username}
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
          Vendor portal — view your account information below.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 600 }}>
        {/* Profile card */}
        <div className="ent-card" style={{ padding: "24px 20px", textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", background: "#eff6ff",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
          }}>
            <PersonCircle size={32} color="#1d4ed8" />
          </div>
          <div style={{ fontWeight: 600, color: "#111827", marginBottom: 4 }}>{username}</div>
          <span className="ent-badge ent-badge-blue" style={{ marginBottom: 16 }}>Vendor</span>
          <div>
            <a href="/ShowSingleUser"
              className="ent-btn ent-btn-primary ent-btn-sm"
              style={{ textDecoration: "none" }}>
              <ArrowRight size={13} /> View Profile
            </a>
          </div>
        </div>

        {/* Info card */}
        <div className="ent-card" style={{ padding: "24px 20px" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: "#eff6ff",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 12,
          }}>
            <ShieldLock size={18} color="#1d4ed8" />
          </div>
          <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827", marginBottom: 8 }}>
            Limited Access
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.6 }}>
            As a vendor, you have read-only access. Contact your administrator to request additional permissions.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
