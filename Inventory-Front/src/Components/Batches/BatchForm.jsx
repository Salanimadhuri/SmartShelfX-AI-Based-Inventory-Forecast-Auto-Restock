import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../UI/AppShell";
import { getAllProducts } from "../../Services/ProductService";
import { createBatch } from "../../Services/BatchService";
import { CheckCircle, ExclamationCircle } from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

export default function BatchForm() {
  const navigate = useNavigate();
  const role     = localStorage.getItem("loggedInRole") || "Admin";
  const [products, setProducts] = useState([]);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [errors,   setErrors]   = useState({});
  const [form, setForm] = useState({
    productId:"", productName:"", manufactureDate:"", expiryDate:"",
    quantity:"", supplierId:"", purchaseOrderId:"",
  });

  useEffect(() => {
    getAllProducts().then(r => setProducts(r.data)).catch(console.error);
  }, []);

  const setField = (k, v) => {
    setForm(p => {
      const u = { ...p, [k]: v };
      if (k === "productId") {
        const prod = products.find(x => x.productId === v);
        if (prod) u.productName = prod.productName;
      }
      return u;
    });
    setErrors(p => ({ ...p, [k]:"" }));
  };

  const validate = () => {
    const e = {};
    if (!form.productId)       e.productId       = "Select a product";
    if (!form.expiryDate)      e.expiryDate      = "Expiry date is required";
    if (!form.quantity || Number(form.quantity) <= 0) e.quantity = "Enter a valid quantity";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await createBatch({ ...form, remainingQuantity: Number(form.quantity) });
      setSaved(true);
      setTimeout(() => navigate("/Batches"), 1500);
    } catch {
      setErrors({ general:"Failed to save batch. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (saved) return (
    <div style={{ minHeight:"100vh", background:"#f9fafb", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <CheckCircle size={40} color="#16a34a" style={{ marginBottom:12 }} />
        <h3 style={{ fontWeight:700, color:"#111827", marginBottom:6 }}>Batch Added</h3>
        <p style={{ color:"#6b7280", fontSize:"0.875rem" }}>Redirecting…</p>
      </div>
    </div>
  );

  return (
    <AppShell role={role} breadcrumb={[
      { label:"Dashboard", href: role==="Manager"?"/ManagerMenu":"/AdminMenu" },
      { label:"Batch & Expiry", href:"/Batches" },
      { label:"Add Batch" },
    ]}>
      <div className="ent-page-header">
        <div>
          <h2 className="ent-page-title">Add Batch Record</h2>
          <p className="ent-page-subtitle">Record a new product batch with expiry information</p>
        </div>
      </div>

      <div className="ent-card" style={{ padding:"28px", maxWidth:580 }}>
        {errors.general && <div className="ent-alert ent-alert-error"><ExclamationCircle size={14} />{errors.general}</div>}
        <form onSubmit={handleSubmit}>
          <div className="ent-field">
            <label className="ent-label" htmlFor="productId">Product *</label>
            <select id="productId" className={`ent-input${errors.productId?" error":""}`}
              value={form.productId} onChange={e => setField("productId", e.target.value)}>
              <option value="">Select product…</option>
              {products.map(p => <option key={p.productId} value={p.productId}>{p.productName} ({p.productId})</option>)}
            </select>
            {errors.productId && <p className="ent-error">{errors.productId}</p>}
          </div>

          <div className="ent-grid-2">
            <div className="ent-field">
              <label className="ent-label">Manufacture Date</label>
              <input type="date" className="ent-input" value={form.manufactureDate}
                onChange={e => setField("manufactureDate", e.target.value)} />
            </div>
            <div className="ent-field">
              <label className="ent-label">Expiry Date *</label>
              <input type="date" className={`ent-input${errors.expiryDate?" error":""}`}
                value={form.expiryDate} onChange={e => setField("expiryDate", e.target.value)} />
              {errors.expiryDate && <p className="ent-error">{errors.expiryDate}</p>}
            </div>
            <div className="ent-field">
              <label className="ent-label">Quantity *</label>
              <input type="number" className={`ent-input${errors.quantity?" error":""}`}
                value={form.quantity} min="1" placeholder="0"
                onChange={e => setField("quantity", e.target.value)} />
              {errors.quantity && <p className="ent-error">{errors.quantity}</p>}
            </div>
            <div className="ent-field">
              <label className="ent-label">Supplier ID</label>
              <input className="ent-input" value={form.supplierId} placeholder="e.g. V001"
                onChange={e => setField("supplierId", e.target.value)} />
            </div>
          </div>

          <div className="ent-field">
            <label className="ent-label">Purchase Order ID</label>
            <input className="ent-input" value={form.purchaseOrderId} placeholder="e.g. PO10001 (optional)"
              onChange={e => setField("purchaseOrderId", e.target.value)} />
          </div>

          {/* Expiry preview */}
          {form.expiryDate && (
            <div style={{ marginBottom:16 }}>
              {(() => {
                const diff = Math.ceil((new Date(form.expiryDate) - new Date()) / 86400000);
                if (diff < 0) return <div className="ent-alert ent-alert-error"><ExclamationCircle size={14} />This expiry date is in the past!</div>;
                if (diff <= 30) return <div className="ent-alert ent-alert-warning"><ExclamationCircle size={14} />This batch will expire in {diff} days.</div>;
                return <div className="ent-alert ent-alert-success"><CheckCircle size={14} />Expires in {diff} days — healthy shelf life.</div>;
              })()}
            </div>
          )}

          <div style={{ display:"flex", gap:8 }}>
            <button type="submit" disabled={saving} className="ent-btn ent-btn-primary ent-btn-lg" style={{ flex:1 }}>
              {saving ? "Saving…" : "Add Batch"}
            </button>
            <button type="button" className="ent-btn ent-btn-ghost ent-btn-lg" onClick={() => navigate("/Batches")}>Cancel</button>
          </div>
        </form>
      </div>
      <style>{`@keyframes ent-spin{to{transform:rotate(360deg)}}.ent-spinner{width:32px;height:32px;border:2.5px solid #e5e7eb;border-top-color:#1d4ed8;border-radius:50%;animation:ent-spin .7s linear infinite}`}</style>
    </AppShell>
  );
}
