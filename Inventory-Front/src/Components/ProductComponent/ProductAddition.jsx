import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveProduct, generateProductId } from "../../Services/ProductService";
import { BoxSeam, CheckCircle, ExclamationCircle, ArrowLeft } from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

const ProductAddition = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    productId:"", productName:"", sku:"", purchasePrice:"",
    salesPrice:"", stock:"", reorderLevel:"", vendorId:"", status:true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    generateProductId()
      .then(r => setProduct(p => ({ ...p, productId: r.data })))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(p => {
      const u = { ...p, [name]: value };
      if (name === "purchasePrice" && value) {
        const v = parseFloat(value);
        if (!isNaN(v)) u.salesPrice = (v * 1.2).toFixed(2);
      }
      return u;
    });
    setErrors(p => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!product.productName.trim()) e.productName = "Product name is required";
    if (!product.sku.trim()) e.sku = "SKU is required";
    if (!product.purchasePrice || Number(product.purchasePrice) < 1) e.purchasePrice = "Enter a valid purchase price";
    if (!product.stock || Number(product.stock) < 1) e.stock = "Stock must be at least 1";
    if (!product.reorderLevel || Number(product.reorderLevel) < 1) e.reorderLevel = "Reorder level must be at least 1";
    if (!product.vendorId.trim()) e.vendorId = "Vendor ID is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await saveProduct({ ...product, status: Number(product.stock) > Number(product.reorderLevel) });
      setSaved(true);
      setTimeout(() => navigate("/AdProdRepo"), 1600);
    } catch {
      setErrors({ general: "Failed to add product. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProduct(p => ({ ...p, productName:"", sku:"", purchasePrice:"", salesPrice:"", stock:"", reorderLevel:"", vendorId:"" }));
    setErrors({});
  };

  const stockHealthy = product.stock && product.reorderLevel && Number(product.stock) > Number(product.reorderLevel);

  if (saved) {
    return (
      <div style={{ minHeight:"100vh", background:"#f9fafb", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font,'Inter',sans-serif)" }}>
        <div style={{ textAlign:"center" }}>
          <CheckCircle size={40} color="#16a34a" style={{ marginBottom:12 }} />
          <h3 style={{ fontWeight:700, color:"#111827", marginBottom:6 }}>Product added</h3>
          <p style={{ color:"#6b7280", fontSize:"0.875rem" }}>Redirecting to product list…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#f9fafb", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"40px 24px", fontFamily:"var(--font,'Inter',sans-serif)" }}>
      <div style={{ width:"100%", maxWidth:620 }}>
        <button onClick={() => navigate(-1)} style={{
          display:"flex", alignItems:"center", gap:6, background:"none", border:"none",
          color:"#6b7280", fontSize:"0.875rem", cursor:"pointer", fontFamily:"inherit",
          padding:0, marginBottom:20,
        }}>
          <ArrowLeft size={14} /> Back
        </button>

        <div className="ent-card" style={{ padding:"28px 32px" }}>
          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <BoxSeam size={20} color="#1d4ed8" />
            </div>
            <div>
              <h2 style={{ fontWeight:700, color:"#111827", fontSize:"1.125rem", margin:0 }}>Add New Product</h2>
              <p style={{ color:"#6b7280", fontSize:"0.8125rem", margin:"2px 0 0" }}>Fill in the product details below</p>
            </div>
          </div>

          {errors.general && (
            <div className="ent-alert ent-alert-error">
              <ExclamationCircle size={15} /> {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Read-only Product ID */}
            <div className="ent-field">
              <label className="ent-label">Product ID <span style={{ color:"#9ca3af", fontWeight:400 }}>(auto-generated)</span></label>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <input value={product.productId} disabled className="ent-input" style={{ maxWidth:200 }} />
                <span className="ent-badge ent-badge-blue">Auto</span>
              </div>
            </div>

            <div className="ent-grid-2">
              <div className="ent-field">
                <label className="ent-label" htmlFor="productName">Product Name</label>
                <input id="productName" name="productName" value={product.productName} onChange={handleChange}
                  className={`ent-input${errors.productName?" error":""}`} placeholder="e.g. Laptop Pro 15" />
                {errors.productName && <p className="ent-error">{errors.productName}</p>}
              </div>
              <div className="ent-field">
                <label className="ent-label" htmlFor="sku">SKU</label>
                <input id="sku" name="sku" value={product.sku} onChange={handleChange}
                  className={`ent-input${errors.sku?" error":""}`} placeholder="e.g. SKU-001" />
                {errors.sku && <p className="ent-error">{errors.sku}</p>}
              </div>
              <div className="ent-field">
                <label className="ent-label" htmlFor="purchasePrice">Purchase Price (₹)</label>
                <input id="purchasePrice" name="purchasePrice" type="number" value={product.purchasePrice} onChange={handleChange}
                  className={`ent-input${errors.purchasePrice?" error":""}`} placeholder="0.00" min="1" />
                {errors.purchasePrice && <p className="ent-error">{errors.purchasePrice}</p>}
              </div>
              <div className="ent-field">
                <label className="ent-label">Sales Price (₹) <span style={{ color:"#9ca3af", fontWeight:400 }}>(auto: +20%)</span></label>
                <input name="salesPrice" type="number" value={product.salesPrice} onChange={handleChange}
                  className="ent-input" placeholder="Auto-calculated" />
              </div>
              <div className="ent-field">
                <label className="ent-label" htmlFor="stock">Stock Quantity</label>
                <input id="stock" name="stock" type="number" value={product.stock} onChange={handleChange}
                  className={`ent-input${errors.stock?" error":""}`} placeholder="0" min="1" />
                {errors.stock && <p className="ent-error">{errors.stock}</p>}
              </div>
              <div className="ent-field">
                <label className="ent-label" htmlFor="reorderLevel">Reorder Level</label>
                <input id="reorderLevel" name="reorderLevel" type="number" value={product.reorderLevel} onChange={handleChange}
                  className={`ent-input${errors.reorderLevel?" error":""}`} placeholder="0" min="1" />
                {errors.reorderLevel && <p className="ent-error">{errors.reorderLevel}</p>}
              </div>
            </div>

            <div className="ent-field">
              <label className="ent-label" htmlFor="vendorId">Vendor ID</label>
              <input id="vendorId" name="vendorId" value={product.vendorId} onChange={handleChange}
                className={`ent-input${errors.vendorId?" error":""}`} placeholder="e.g. V001" style={{ maxWidth:240 }} />
              {errors.vendorId && <p className="ent-error">{errors.vendorId}</p>}
            </div>

            {/* Stock health indicator */}
            {product.stock && product.reorderLevel && (
              <div className={`ent-alert ${stockHealthy ? "ent-alert-success" : "ent-alert-warning"}`}>
                {stockHealthy ? <CheckCircle size={14} /> : <ExclamationCircle size={14} />}
                {stockHealthy
                  ? "Stock is above reorder level — safe to add"
                  : "Stock is at or below reorder level — will trigger a low stock alert"}
              </div>
            )}

            <div style={{ display:"flex", gap:8, marginTop:4 }}>
              <button type="submit" disabled={loading}
                className="ent-btn ent-btn-primary ent-btn-lg" style={{ flex:1 }}>
                {loading ? (
                  <><span className="ent-spinner" style={{ width:16, height:16, borderWidth:2 }} /> Saving…</>
                ) : "Add Product"}
              </button>
              <button type="button" onClick={handleReset} className="ent-btn ent-btn-secondary ent-btn-lg">Reset</button>
              <button type="button" onClick={() => navigate(-1)} className="ent-btn ent-btn-ghost ent-btn-lg">Cancel</button>
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

export default ProductAddition;
