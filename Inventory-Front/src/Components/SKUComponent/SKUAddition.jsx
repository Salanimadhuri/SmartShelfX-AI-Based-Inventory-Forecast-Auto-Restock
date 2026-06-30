import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { save } from "../../Services/SKUService";
import { TagFill, CheckCircle, ExclamationCircle, ArrowLeft } from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

const SKUAddition = () => {
  const navigate = useNavigate();
  const [sku, setSku] = useState({ skuId: "", skuDescription: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setSku(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!sku.skuId.trim()) e.skuId = "SKU ID is required";
    if (!sku.skuDescription.trim()) e.skuDescription = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await save(sku);
      setSaved(true);
      setTimeout(() => navigate("/AdminMenu"), 1500);
    } catch {
      setErrors({ general: "Failed to save SKU. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (saved) {
    return (
      <div style={{ minHeight:"100vh", background:"#f9fafb", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font,'Inter',sans-serif)" }}>
        <div style={{ textAlign:"center" }}>
          <CheckCircle size={40} color="#16a34a" style={{ marginBottom:12 }} />
          <h3 style={{ fontWeight:700, color:"#111827", marginBottom:6 }}>SKU Added</h3>
          <p style={{ color:"#6b7280", fontSize:"0.875rem" }}>Redirecting to dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#f9fafb", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"40px 24px", fontFamily:"var(--font,'Inter',sans-serif)" }}>
      <div style={{ width:"100%", maxWidth:440 }}>
        <button onClick={() => navigate("/AdminMenu")} style={{
          display:"flex", alignItems:"center", gap:6, background:"none", border:"none",
          color:"#6b7280", fontSize:"0.875rem", cursor:"pointer", fontFamily:"inherit", padding:0, marginBottom:20,
        }}>
          <ArrowLeft size={14} /> Dashboard
        </button>

        <div className="ent-card" style={{ padding:"28px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <TagFill size={18} color="#1d4ed8" />
            </div>
            <div>
              <h2 style={{ fontWeight:700, color:"#111827", fontSize:"1.125rem", margin:0 }}>Add New SKU</h2>
              <p style={{ color:"#6b7280", fontSize:"0.8125rem", margin:"2px 0 0" }}>Create a new Stock Keeping Unit</p>
            </div>
          </div>

          {errors.general && (
            <div className="ent-alert ent-alert-error">
              <ExclamationCircle size={14} /> {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="ent-field">
              <label className="ent-label" htmlFor="skuId">SKU ID</label>
              <input id="skuId" name="skuId" value={sku.skuId} onChange={onChange}
                className={`ent-input${errors.skuId?" error":""}`}
                placeholder="e.g. SKU-001" />
              {errors.skuId && <p className="ent-error">{errors.skuId}</p>}
            </div>

            <div className="ent-field">
              <label className="ent-label" htmlFor="skuDescription">Description</label>
              <input id="skuDescription" name="skuDescription" value={sku.skuDescription} onChange={onChange}
                className={`ent-input${errors.skuDescription?" error":""}`}
                placeholder="e.g. Standard 500ml Beverage Unit" />
              {errors.skuDescription && <p className="ent-error">{errors.skuDescription}</p>}
            </div>

            <div style={{ display:"flex", gap:8, marginTop:4 }}>
              <button type="submit" disabled={loading}
                className="ent-btn ent-btn-primary ent-btn-lg" style={{ flex:1 }}>
                {loading ? (
                  <><span className="ent-spinner" style={{ width:16, height:16, borderWidth:2 }} /> Saving…</>
                ) : "Add SKU"}
              </button>
              <button type="button" onClick={() => setSku({ skuId:"", skuDescription:"" })}
                className="ent-btn ent-btn-secondary ent-btn-lg">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`@keyframes ent-spin { to { transform: rotate(360deg); } }
        .ent-spinner { display:inline-block; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:ent-spin 0.7s linear infinite; }
      `}</style>
    </div>
  );
};

export default SKUAddition;
