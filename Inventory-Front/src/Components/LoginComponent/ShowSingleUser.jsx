import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSingleUserDetails } from "../../Services/LoginService";
import { PersonCircle, EnvelopeFill, KeyFill, ShieldLock, ArrowLeft } from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

export default function ShowSingleUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSingleUserDetails()
      .then(r => setUser(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const returnBack = () => {
    if (!user) { navigate("/"); return; }
    if (user.role === "Admin") navigate("/AdminMenu");
    else if (user.role === "Manager") navigate("/ManagerMenu");
    else if (user.role === "Vendor") navigate("/VendorMenu");
    else navigate("/");
  };

  const roleBadgeClass = {
    Admin:   "ent-badge ent-badge-primary",
    Manager: "ent-badge ent-badge-green",
    Vendor:  "ent-badge ent-badge-yellow",
  };

  const InfoRow = ({ icon, label, value }) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 0", borderBottom: "1px solid #f3f4f6",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, background: "#f3f4f6",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#4b5563", flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500, marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: "0.9rem", color: "#111827", fontWeight: 500 }}>{value || "—"}</div>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#f9fafb",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "48px 24px", fontFamily: "var(--font,'Inter',sans-serif)",
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <button onClick={returnBack} style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "none", border: "none", color: "#6b7280",
          fontSize: "0.875rem", cursor: "pointer", fontFamily: "inherit",
          padding: 0, marginBottom: 20,
        }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <div className="ent-card" style={{ padding: "28px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div className="ent-spinner" style={{ margin: "0 auto 12px" }} />
              <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>Loading profile…</p>
            </div>
          ) : !user ? (
            <p style={{ textAlign: "center", color: "#dc2626" }}>Failed to load user details.</p>
          ) : (
            <>
              {/* Avatar + name */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", background: "#eff6ff",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <PersonCircle size={32} color="#1d4ed8" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#111827", fontSize: "1.1rem" }}>
                    {user.personalName || user.username}
                  </div>
                  <span className={roleBadgeClass[user.role] || "ent-badge ent-badge-gray"} style={{ marginTop: 4 }}>
                    {user.role}
                  </span>
                </div>
              </div>

              <InfoRow icon={<PersonCircle size={15} />} label="Username"  value={user.username} />
              <InfoRow icon={<KeyFill       size={14} />} label="Full Name" value={user.personalName} />
              <InfoRow icon={<EnvelopeFill  size={14} />} label="Email"     value={user.email} />
              <InfoRow icon={<ShieldLock    size={14} />} label="Role"      value={user.role} />

              <button
                onClick={returnBack}
                className="ent-btn ent-btn-primary"
                style={{ width: "100%", marginTop: 20 }}
              >
                Return to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes ent-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
