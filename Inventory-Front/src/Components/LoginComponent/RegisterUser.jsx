import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerNewUser } from "../../Services/LoginService";
import { BoxSeam, CheckCircle, ExclamationCircle, ArrowLeft } from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

const RegisterUser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username:"", personalName:"", password:"", email:"", role:"" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required";
    if (!form.personalName.trim()) e.personalName = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!emailPattern.test(form.email)) e.email = "Invalid email format";
    if (!form.password.trim()) e.password = "Password is required";
    else if (form.password.length < 5) e.password = "Password must be at least 5 characters";
    if (!confirmPassword.trim()) e.confirmPassword = "Please confirm your password";
    else if (form.password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!form.role.trim()) e.role = "Role is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await registerNewUser(form);
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch {
      setErrors(p => ({ ...p, general: "Registration failed. Please try again." }));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: "100vh", background: "#f9fafb",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font, 'Inter', sans-serif)",
      }}>
        <div style={{
          background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16,
          padding: "48px 40px", textAlign: "center", maxWidth: 380,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}>
          <CheckCircle size={40} color="#16a34a" style={{ marginBottom: 16 }} />
          <h3 style={{ fontWeight: 700, color: "#111827", marginBottom: 8, fontSize: "1.1rem" }}>
            Account created
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Redirecting to sign in…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#f9fafb",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "48px 24px", fontFamily: "var(--font, 'Inter', sans-serif)",
    }}>
      <div style={{ width: "100%", maxWidth: 540 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 36, height: 36, background: "#1d4ed8", borderRadius: 9,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BoxSeam size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#111827" }}>
            Smart<span style={{ color: "#1d4ed8" }}>ShelfX</span>
          </span>
        </div>

        <div style={{
          background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16,
          padding: "32px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          {/* Back link */}
          <button onClick={() => navigate("/")} style={{
            display: "flex", alignItems: "center", gap: 6, background: "none",
            border: "none", color: "#6b7280", fontSize: "0.875rem", cursor: "pointer",
            fontFamily: "inherit", padding: 0, marginBottom: 24,
          }}>
            <ArrowLeft size={14} /> Back to sign in
          </button>

          <h2 style={{ fontWeight: 700, color: "#111827", fontSize: "1.25rem", marginBottom: 6 }}>
            Create an account
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: 24 }}>
            Fill in your details to get started
          </p>

          {errors.general && (
            <div className="ent-alert ent-alert-error">
              <ExclamationCircle size={15} />
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="ent-grid-2">
              <div className="ent-field">
                <label className="ent-label" htmlFor="username">Username</label>
                <input id="username" name="username" value={form.username} onChange={onChange}
                  className={`ent-input${errors.username?" error":""}`} placeholder="Choose a username" />
                {errors.username && <p className="ent-error">{errors.username}</p>}
              </div>
              <div className="ent-field">
                <label className="ent-label" htmlFor="personalName">Full Name</label>
                <input id="personalName" name="personalName" value={form.personalName} onChange={onChange}
                  className={`ent-input${errors.personalName?" error":""}`} placeholder="Your full name" />
                {errors.personalName && <p className="ent-error">{errors.personalName}</p>}
              </div>
            </div>

            <div className="ent-field">
              <label className="ent-label" htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" value={form.email} onChange={onChange}
                className={`ent-input${errors.email?" error":""}`} placeholder="you@company.com" />
              {errors.email && <p className="ent-error">{errors.email}</p>}
            </div>

            <div className="ent-grid-2">
              <div className="ent-field">
                <label className="ent-label" htmlFor="password">Password</label>
                <input id="password" name="password" type="password" value={form.password} onChange={onChange}
                  className={`ent-input${errors.password?" error":""}`} placeholder="Min. 5 characters" />
                {errors.password && <p className="ent-error">{errors.password}</p>}
              </div>
              <div className="ent-field">
                <label className="ent-label" htmlFor="confirmPassword">Confirm password</label>
                <input id="confirmPassword" type="password" value={confirmPassword}
                  onChange={e=>setConfirmPassword(e.target.value)}
                  className={`ent-input${errors.confirmPassword?" error":""}`} placeholder="Repeat password" />
                {errors.confirmPassword && <p className="ent-error">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="ent-field">
              <label className="ent-label" htmlFor="role">Role</label>
              <select id="role" name="role" value={form.role} onChange={onChange}
                className={`ent-input${errors.role?" error":""}`} style={{ cursor: "pointer" }}>
                <option value="">Select a role</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Vendor">Vendor</option>
              </select>
              {errors.role && <p className="ent-error">{errors.role}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="ent-btn ent-btn-primary ent-btn-lg"
              style={{ width: "100%", marginTop: 8 }}>
              {loading ? (
                <>
                  <span className="ent-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Creating account…
                </>
              ) : "Create account"}
            </button>
          </form>
        </div>
      </div>
      <style>{`
        @keyframes ent-spin { to { transform: rotate(360deg); } }
        .ent-spinner {
          display: inline-block;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          width: 16px; height: 16px;
          animation: ent-spin 0.7s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RegisterUser;
