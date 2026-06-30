import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { findSKUById, update } from "../../Services/SKUService";
import { PencilSquare, CheckCircle, ExclamationCircle, ArrowLeft } from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

const SKUUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sku, setSku] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    findSKUById(id)
      .then(r => { setSku(r.data); setLoading(false); })
      .catch(() => { setFetchError("Failed to load SKU details."); setLoading(false); });
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setSku(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!sku?.skuId?.trim()) e.skuId = "SKU ID is required";
    if (!sku?.skuDescription?.trim()) e.skuDescription = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await update(sku);
      setSaved(true);
      setTimeout(() => navigate("/SkuRepo"), 1500);
    } catch {
      setErrors({ general: "Failed to update SKU." });
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div style={{ minHeight:"100vh", background:"#f9fafb", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font,'Inter',sans-serif)" }}>
        <div style={{ textAlign:"center" }}>
          <CheckCircle size={40} color="#16a34a" style={{ marginBottom:12 }} />
          <h3 style={{ fontWeight:700, color:"#111827", marginBottom:6 }}>SKU Updated</h3>
          <p style={{ color:"#6b7280", fontSize:"0.875rem" }}>Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#f9fafb", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"40px 24px", fontFamily:"var(--font,'Inter',sans-serif)" }}>
      <div style={{ width:"100%", maxWidth:440 }}>
        <button onClick={() => navigate("/SkuRepo")} style={{
          display:"flex", alignItems:"center", gap:6, background:"none", border:"none",
          color:"#6b7280", fontSize:"0.875rem", cursor:"pointer", fontFamily:"inherit", padding:0, marginBottom:20,
        }}>
          <ArrowLeft size={14} /> SKU List
        </button>

        <div className="ent-card" style={{ padding:"28px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <PencilSquare size={18} color="#1d4ed8" />
            </div>
            <div>
              <h2 style={{ fontWeight:700, color:"#111827", fontSize:"1.125rem", margin:0 }}>Update SKU</h2>
              <p style={{ color:"#6b7280", fontSize:"0.8125rem", margin:"2px 0 0" }}>Editing: {id}</p>
            </div>
          </div>

          {loading && (
            <div style={{ textAlign:"center", padding:"32px 0" }}>
              <div className="ent-spinner" style={{ margin:"0 auto 12px" }} />
              <p style={{ color:"#9ca3af", fontSize:"0.875rem" }}>Loading SKU…</p>
            </div>
          )}
          {fetchError && (
            <div className="ent-alert ent-alert-error">
              <ExclamationCircle size={14} /> {fetchError}
            </div>
          )}
          {!loading && !fetchError && sku && (
            <form onSubmit={handleSubmit}>
              {errors.general && (
                <div className="ent-alert ent-alert-error">
                  <ExclamationCircle size={14} /> {errors.general}
                </div>
              )}

              <div className="ent-field">
                <label className="ent-label" htmlFor="skuId">SKU ID</label>
                <input id="skuId" name="skuId" value={sku.skuId} onChange={onChange}
                  className={`ent-input${errors.skuId?" error":""}`} placeholder="SKU ID" />
                {errors.skuId && <p className="ent-error">{errors.skuId}</p>}
              </div>

              <div className="ent-field">
                <label className="ent-label" htmlFor="skuDescription">Description</label>
                <input id="skuDescription" name="skuDescription" value={sku.skuDescription} onChange={onChange}
                  className={`ent-input${errors.skuDescription?" error":""}`} placeholder="SKU description" />
                {errors.skuDescription && <p className="ent-error">{errors.skuDescription}</p>}
              </div>

              <div style={{ display:"flex", gap:8, marginTop:4 }}>
                <button type="submit" disabled={saving}
                  className="ent-btn ent-btn-primary ent-btn-lg" style={{ flex:1 }}>
                  {saving ? (
                    <><span className="ent-spinner" style={{ width:16, height:16, borderWidth:2 }} /> Saving…</>
                  ) : "Update SKU"}
                </button>
                <button type="button" onClick={() => navigate("/SkuRepo")}
                  className="ent-btn ent-btn-ghost ent-btn-lg">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <style>{`@keyframes ent-spin { to { transform: rotate(360deg); } }
        .ent-spinner { display:inline-block; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:ent-spin 0.7s linear infinite; }
      `}</style>
    </div>
  );
};

export default SKUUpdate;
