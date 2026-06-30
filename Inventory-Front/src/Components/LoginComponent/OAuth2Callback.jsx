import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BoxSeam } from "react-bootstrap-icons";

/**
 * Handles redirect from Spring Boot after Google OAuth2 login.
 * URL: /oauth2/callback?username=...&role=...&email=...
 */
export default function OAuth2Callback() {
  const navigate    = useNavigate();
  const [params]    = useSearchParams();
  const [error,     setError] = useState("");

  useEffect(() => {
    const username = params.get("username");
    const role     = params.get("role");
    const email    = params.get("email");

    if (!username || !role) {
      setError("Google authentication failed. Please try again.");
      setTimeout(() => navigate("/"), 3000);
      return;
    }

    // Store session exactly like normal login
    localStorage.setItem("loggedInUser", JSON.stringify({ username, email }));
    localStorage.setItem("loggedInRole", role);

    // Redirect to the correct dashboard
    if      (role === "Admin")   navigate("/AdminMenu");
    else if (role === "Manager") navigate("/ManagerMenu");
    else if (role === "Vendor")  navigate("/VendorMenu");
    else                         navigate("/ManagerMenu"); // default
  }, [params, navigate]);

  return (
    <div style={{
      minHeight:"100vh", background:"#f8fafc",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Inter',-apple-system,sans-serif",
    }}>
      <div style={{ textAlign:"center" }}>
        <div style={{
          width:48, height:48, borderRadius:14,
          background:"linear-gradient(135deg,#2563eb,#3b82f6)",
          display:"inline-flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 4px 14px rgba(37,99,235,.28)", marginBottom:20,
        }}>
          <BoxSeam size={22} color="#fff"/>
        </div>

        {error ? (
          <>
            <p style={{ color:"#dc2626", fontWeight:600, marginBottom:8 }}>{error}</p>
            <p style={{ color:"#64748b", fontSize:".875rem" }}>Redirecting to login…</p>
          </>
        ) : (
          <>
            <div style={{ width:36, height:36, border:"3px solid #dbeafe", borderTopColor:"#2563eb", borderRadius:"50%", animation:"spin .7s linear infinite", margin:"0 auto 16px" }}/>
            <p style={{ color:"#374151", fontWeight:600, marginBottom:4 }}>Signing you in with Google…</p>
            <p style={{ color:"#94a3b8", fontSize:".875rem" }}>Please wait</p>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}
