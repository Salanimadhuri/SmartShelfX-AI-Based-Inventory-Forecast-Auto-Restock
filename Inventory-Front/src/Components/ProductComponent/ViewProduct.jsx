import React, { useEffect, useState } from "react";
import { getProductById } from "../../Services/ProductService";
import { getUserRole } from "../../Services/LoginService";
import { useParams, useNavigate } from "react-router-dom";
import {
  BoxSeam, TagFill, CurrencyDollar, BarChartLine,
  ArrowDownUp, Truck, ArrowLeft, CheckCircle, ExclamationTriangle,
} from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

const ViewProduct = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProductById(pid), getUserRole()])
      .then(([p, r]) => { setProduct(p.data); setRole(r.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [pid]);

  const returnBack = () => {
    if (role === "Admin") navigate("/AdProdRepo");
    else if (role === "Manager") navigate("/MngProdRepo");
    else navigate("/");
  };

  const healthy = product && product.stock > product.reorderLevel;

  const fields = product ? [
    { icon: <BoxSeam size={14} />,      label: "Product ID",      value: product.productId },
    { icon: <TagFill size={14} />,      label: "SKU",             value: product.sku },
    { icon: <CurrencyDollar size={14} />,label: "Purchase Price",  value: `₹${product.purchasePrice}` },
    { icon: <CurrencyDollar size={14} />,label: "Sales Price",     value: `₹${product.salesPrice}` },
    { icon: <BarChartLine size={14} />, label: "Reorder Level",   value: product.reorderLevel },
    { icon: <ArrowDownUp size={14} />,  label: "Current Stock",   value: `${product.stock} units`, highlight: true },
    { icon: <Truck size={14} />,        label: "Vendor ID",       value: product.vendorId },
  ] : [];

  return (
    <div style={{
      minHeight:"100vh", background:"#f9fafb",
      display:"flex", alignItems:"flex-start", justifyContent:"center",
      padding:"40px 24px", fontFamily:"var(--font,'Inter',sans-serif)",
    }}>
      <div style={{ width:"100%", maxWidth:440 }}>
        <button onClick={returnBack} style={{
          display:"flex", alignItems:"center", gap:6, background:"none", border:"none",
          color:"#6b7280", fontSize:"0.875rem", cursor:"pointer", fontFamily:"inherit", padding:0, marginBottom:20,
        }}>
          <ArrowLeft size={14} /> Product List
        </button>

        <div className="ent-card" style={{ padding:"24px" }}>
          {loading ? (
            <div style={{ textAlign:"center", padding:"40px 0" }}>
              <div className="ent-spinner" style={{ margin:"0 auto 12px" }} />
              <p style={{ color:"#9ca3af", fontSize:"0.875rem" }}>Loading product…</p>
            </div>
          ) : product ? (
            <>
              {/* Product header */}
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <div style={{
                  width:48, height:48, borderRadius:12, background:"#eff6ff",
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                }}>
                  <BoxSeam size={22} color="#1d4ed8" />
                </div>
                <div>
                  <h2 style={{ fontWeight:700, color:"#111827", fontSize:"1.125rem", margin:0 }}>{product.productName}</h2>
                  <code style={{
                    background:"#f3f4f6", border:"1px solid #e5e7eb", borderRadius:5,
                    padding:"2px 8px", fontSize:"0.78rem", color:"#374151",
                  }}>{product.sku}</code>
                </div>
              </div>

              {/* Fields */}
              {fields.map(({ icon, label, value, highlight }, i) => (
                <div key={i} style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"10px 12px",
                  background: highlight ? (healthy ? "#f0fdf4" : "#fef2f2") : i % 2 === 0 ? "#f9fafb" : "#fff",
                  borderRadius:8, marginBottom:6,
                  border: highlight ? `1px solid ${healthy ? "#bbf7d0" : "#fecaca"}` : "1px solid #f3f4f6",
                }}>
                  <div style={{
                    width:28, height:28, borderRadius:7, background:"#f3f4f6",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:"#6b7280", flexShrink:0,
                  }}>
                    {icon}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"0.72rem", color:"#9ca3af", fontWeight:500, marginBottom:1 }}>{label}</div>
                    <div style={{ fontSize:"0.9rem", color:"#111827", fontWeight:500 }}>{value}</div>
                  </div>
                </div>
              ))}

              {/* Stock status banner */}
              <div style={{
                marginTop:14, padding:"12px 14px", borderRadius:10,
                display:"flex", alignItems:"center", gap:10,
                background: healthy ? "#f0fdf4" : "#fef2f2",
                border: `1.5px solid ${healthy ? "#bbf7d0" : "#fecaca"}`,
              }}>
                {healthy
                  ? <CheckCircle size={18} color="#16a34a" />
                  : <ExclamationTriangle size={18} color="#dc2626" />}
                <div>
                  <div style={{ fontWeight:700, color: healthy ? "#16a34a" : "#dc2626", fontSize:"0.9rem" }}>
                    {healthy ? "Permitted to Issue" : "Reorder Level Reached"}
                  </div>
                  <div style={{ fontSize:"0.78rem", color:"#6b7280" }}>
                    {healthy
                      ? `${product.stock - product.reorderLevel} units above reorder level`
                      : `${product.reorderLevel - product.stock} units below reorder level`}
                  </div>
                </div>
              </div>

              <button onClick={returnBack} className="ent-btn ent-btn-primary" style={{ width:"100%", marginTop:18 }}>
                Return to List
              </button>
            </>
          ) : (
            <p style={{ textAlign:"center", color:"#dc2626" }}>Product not found.</p>
          )}
        </div>
      </div>
      <style>{`@keyframes ent-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ViewProduct;
