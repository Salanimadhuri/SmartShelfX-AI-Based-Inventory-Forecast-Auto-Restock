import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getAllProducts, issueProduct, purchaseProduct } from "../../Services/ProductService";
import { generateTransactionId, saveTransaction } from "../../Services/TransactionService";
import {
  ArrowUpCircle, ArrowDownCircle, ExclamationCircle, CheckCircle, ArrowLeft,
} from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

const EditStock = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = new URLSearchParams(location.search).get("returnPath") || "/AdProdRepo";

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showReorderAlert, setShowReorderAlert] = useState(false);
  const [navMessage, setNavMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [res, txnRes] = await Promise.all([getAllProducts(), generateTransactionId()]);
        const found = res.data.find(p => String(p.productId) === id);
        setProduct({ ...found, status: true });
        setTransactionId(txnRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, [id]);

  useEffect(() => {
    if (product && mode === "issue") {
      const q = Number(quantity);
      setShowReorderAlert(!isNaN(q) && q > 0 && (product.stock - q) <= product.reorderLevel);
    }
  }, [quantity, product, mode]);

  const handleSave = async () => {
    const q = Number(quantity);
    if (!q || isNaN(q) || q <= 0) { setMessage("Enter a valid quantity."); setMessageType("error"); return; }
    setSaving(true);
    try {
      const txnDate = transactionDate || new Date().toISOString().split("T")[0];
      const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      const rate = mode === "issue" ? product.salesPrice : product.purchasePrice;
      const txnValue = q * rate;
      const transaction = {
        transactionId, transactionType: mode, productId: product.productId,
        quantity: q, rate, transactionValue: txnValue,
        transactionDate: txnDate, userId: user.username || "unknown",
      };
      await saveTransaction(transaction);
      if (mode === "issue") await issueProduct(id, q);
      else await purchaseProduct(id, q);
      const msg = mode === "issue"
        ? `Issued ${q} units. Transaction value: ₹${txnValue}`
        : `Purchased ${q} units. Transaction value: ₹${txnValue}`;
      setNavMessage(msg);
      setMessage(msg);
      setMessageType("success");
      setShowReorderAlert(false);
    } catch {
      setMessage("Operation failed. Please try again.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const isIssue = mode === "issue";
  const rate = product ? (isIssue ? product.salesPrice : product.purchasePrice) : 0;
  const txnPreview = quantity && Number(quantity) > 0 ? (Number(quantity) * rate).toFixed(2) : null;

  return (
    <div style={{
      minHeight:"100vh", background:"#f9fafb",
      display:"flex", alignItems:"flex-start", justifyContent:"center",
      padding:"40px 24px", fontFamily:"var(--font,'Inter',sans-serif)",
    }}>
      <div style={{ width:"100%", maxWidth:560 }}>
        <button onClick={() => navigate(returnPath, { state: { message: navMessage || undefined } })} style={{
          display:"flex", alignItems:"center", gap:6, background:"none", border:"none",
          color:"#6b7280", fontSize:"0.875rem", cursor:"pointer", fontFamily:"inherit", padding:0, marginBottom:20,
        }}>
          <ArrowLeft size={14} /> Product List
        </button>

        <div className="ent-card" style={{ padding:"28px" }}>
          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, paddingBottom:16, borderBottom:"1px solid #f3f4f6" }}>
            <div style={{
              width:40, height:40, borderRadius:10, flexShrink:0,
              background: isIssue ? "#fef3c7" : "#dcfce7",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              {isIssue
                ? <ArrowUpCircle size={20} color="#d97706" />
                : <ArrowDownCircle size={20} color="#16a34a" />}
            </div>
            <div>
              <h2 style={{ fontWeight:700, color:"#111827", fontSize:"1.125rem", margin:0 }}>
                {isIssue ? "Issue Stock" : "Purchase Stock"}
              </h2>
              <p style={{ color:"#6b7280", fontSize:"0.8125rem", margin:"2px 0 0" }}>
                {isIssue ? "Record stock outflow" : "Record stock inflow"}
              </p>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign:"center", padding:"32px 0" }}>
              <div className="ent-spinner" style={{ margin:"0 auto 12px" }} />
              <p style={{ color:"#9ca3af", fontSize:"0.875rem" }}>Loading product details…</p>
            </div>
          ) : product ? (
            <>
              {/* Product summary */}
              <div style={{
                background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:10,
                padding:"14px 16px", marginBottom:20,
                display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 20px",
              }}>
                {[
                  ["Product ID",    product.productId],
                  ["Product Name",  product.productName],
                  ["SKU",           product.sku],
                  ["Current Stock", `${product.stock} units`],
                  [isIssue ? "Sales Price" : "Purchase Price", `₹${isIssue ? product.salesPrice : product.purchasePrice}`],
                  ["Reorder Level", product.reorderLevel],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize:"0.72rem", color:"#9ca3af", fontWeight:500, marginBottom:2 }}>{label}</div>
                    <div style={{ fontSize:"0.875rem", color:"#111827", fontWeight:500 }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Transaction ID */}
              <div className="ent-field">
                <label className="ent-label">Transaction ID</label>
                <input className="ent-input" value={transactionId} readOnly />
              </div>

              {/* Date */}
              <div className="ent-field">
                <label className="ent-label" htmlFor="txn-date">Transaction Date</label>
                <input id="txn-date" type="date" className="ent-input"
                  value={transactionDate} onChange={e => setTransactionDate(e.target.value)} />
              </div>

              {/* Quantity */}
              <div className="ent-field">
                <label className="ent-label" htmlFor="qty">{isIssue ? "Quantity to Issue" : "Quantity to Purchase"}</label>
                <input id="qty" type="number" className="ent-input"
                  value={quantity} onChange={e => { setQuantity(e.target.value); setMessage(""); }}
                  placeholder="Enter quantity" min="1" />
              </div>

              {/* Transaction value preview */}
              {txnPreview && (
                <div style={{
                  padding:"10px 14px", borderRadius:8, marginBottom:14,
                  background: isIssue ? "#fef3c7" : "#dcfce7",
                  border:`1px solid ${isIssue ? "#fde68a" : "#bbf7d0"}`,
                  fontSize:"0.875rem", fontWeight:600,
                  color: isIssue ? "#d97706" : "#16a34a",
                }}>
                  Transaction Value: ₹{txnPreview}
                </div>
              )}

              {/* Reorder alert */}
              {showReorderAlert && (
                <div className="ent-alert ent-alert-warning">
                  <ExclamationCircle size={14} />
                  This issue will bring stock to or below reorder level.
                </div>
              )}

              {/* Result message */}
              {message && (
                <div className={`ent-alert ${messageType === "success" ? "ent-alert-success" : "ent-alert-error"}`}>
                  {messageType === "success" ? <CheckCircle size={14} /> : <ExclamationCircle size={14} />}
                  {message}
                </div>
              )}

              <div style={{ display:"flex", gap:8 }}>
                <button onClick={handleSave} disabled={saving}
                  className={`ent-btn ent-btn-lg ${isIssue ? "ent-btn-secondary" : "ent-btn-success"}`}
                  style={{ flex:1, ...(isIssue ? { background:"#d97706", color:"#fff", borderColor:"#d97706" } : {}) }}>
                  {saving ? (
                    <><span className="ent-spinner-dark" style={{ width:16, height:16 }} /> Processing…</>
                  ) : (isIssue ? "Issue Stock" : "Purchase Stock")}
                </button>
                <button onClick={() => navigate(returnPath, { state: { message: navMessage || undefined } })}
                  className="ent-btn ent-btn-ghost ent-btn-lg">
                  Return
                </button>
              </div>
            </>
          ) : (
            <p style={{ textAlign:"center", color:"#dc2626" }}>Product not found.</p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ent-spin { to { transform: rotate(360deg); } }
        .ent-spinner { display:inline-block; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:ent-spin 0.7s linear infinite; }
        .ent-spinner-dark { display:inline-block; border:2px solid rgba(0,0,0,0.15); border-top-color:#374151; border-radius:50%; animation:ent-spin 0.7s linear infinite; }
      `}</style>
    </div>
  );
};

export default EditStock;
