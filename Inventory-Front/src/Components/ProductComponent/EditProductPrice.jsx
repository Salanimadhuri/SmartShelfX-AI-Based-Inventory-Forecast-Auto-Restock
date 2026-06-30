import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProductPrice } from "../../Services/ProductService";
import { PencilSquare, CheckCircle, ExclamationCircle, ArrowLeft } from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

const EditProductPrice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ productId:"", productName:"", productPrice:"" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getProductById(id)
      .then(({ data }) => setForm({
        productId: data.productId ?? "",
        productName: data.productName ?? "",
        productPrice: data.purchasePrice ?? data.productPrice ?? "",
      }))
      .catch(() => setError("Failed to load product details."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productPrice || Number(form.productPrice) < 1) {
      setError("Enter a valid price (minimum 1).");
      return;
    }
    setSaving(true);
    try {
      await updateProductPrice(id, form.productPrice);
      setSaved(true);
      setTimeout(() => navigate("/AdProdRepo"), 1600);
    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div style={{ minHeight:"100vh", background:"#f9fafb", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font,'Inter',sans-serif)" }}>
        <div style={{ textAlign:"center" }}>
          <CheckCircle size={40} color="#16a34a" style={{ marginBottom:12 }} />
          <h3 style={{ fontWeight:700, color:"#111827", marginBottom:6 }}>Price updated</h3>
          <p style={{ color:"#6b7280", fontSize:"0.875rem" }}>Redirecting…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#f9fafb", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"40px 24px", fontFamily:"var(--font,'Inter',sans-serif)" }}>
      <div style={{ width:"100%", maxWidth:440 }}>
        <button onClick={() => navigate("/AdProdRepo")} style={{
          display:"flex", alignItems:"center", gap:6, background:"none", border:"none",
          color:"#6b7280", fontSize:"0.875rem", cursor:"pointer", fontFamily:"inherit", padding:0, marginBottom:20,
        }}>
          <ArrowLeft size={14} /> Back to Products
        </button>

        <div className="ent-card" style={{ padding:"28px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <PencilSquare size={18} color="#1d4ed8" />
            </div>
            <div>
              <h2 style={{ fontWeight:700, color:"#111827", fontSize:"1.125rem", margin:0 }}>Update Price</h2>
              <p style={{ color:"#6b7280", fontSize:"0.8125rem", margin:"2px 0 0" }}>
                {form.productName || id}
              </p>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign:"center", padding:"32px 0" }}>
              <div className="ent-spinner" style={{ margin:"0 auto 12px" }} />
              <p style={{ color:"#9ca3af", fontSize:"0.875rem" }}>Loading product…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="ent-alert ent-alert-error">
                  <ExclamationCircle size={14} /> {error}
                </div>
              )}

              <div className="ent-field">
                <label className="ent-label">Product ID</label>
                <input value={form.productId} disabled className="ent-input" />
              </div>
              <div className="ent-field">
                <label className="ent-label">Product Name</label>
                <input value={form.productName} disabled className="ent-input" />
              </div>
              <div className="ent-field">
                <label className="ent-label" htmlFor="price">New Purchase Price (₹)</label>
                <input id="price" type="number" value={form.productPrice}
                  onChange={e => { setForm(p => ({ ...p, productPrice:e.target.value })); setError(""); }}
                  className="ent-input" placeholder="Enter new price" min="1" />
              </div>

              <div style={{ display:"flex", gap:8, marginTop:4 }}>
                <button type="submit" disabled={saving}
                  className="ent-btn ent-btn-primary ent-btn-lg" style={{ flex:1 }}>
                  {saving ? (
                    <><span className="ent-spinner" style={{ width:16, height:16, borderWidth:2 }} /> Updating…</>
                  ) : "Update Price"}
                </button>
                <button type="button" onClick={() => navigate("/AdProdRepo")} className="ent-btn ent-btn-ghost ent-btn-lg">
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

export default EditProductPrice;
