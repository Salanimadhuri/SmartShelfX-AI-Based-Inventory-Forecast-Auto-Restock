import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../UI/AppShell";
import { getPOById, changeStatus, receivePO } from "../../Services/PurchaseOrderService";
import { PencilSquare, CheckCircle, SendCheck, XCircle, ArrowLeft } from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

const STATUS_BADGE = {
  DRAFT:              { cls:"ent-badge-gray",   label:"Draft"              },
  SENT:               { cls:"ent-badge-blue",   label:"Sent"               },
  PARTIALLY_RECEIVED: { cls:"ent-badge-yellow", label:"Partially Received" },
  RECEIVED:           { cls:"ent-badge-green",  label:"Received"           },
  CANCELLED:          { cls:"ent-badge-red",    label:"Cancelled"          },
};

export default function PurchaseOrderDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const role     = localStorage.getItem("loggedInRole") || "Admin";
  const [po,      setPo]      = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg,     setMsg]     = useState("");

  useEffect(() => {
    getPOById(id).then(r => setPo(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleSend = async () => {
    await changeStatus(id, "SENT");
    setPo(p => ({ ...p, status:"SENT" }));
    setMsg("Purchase order sent to supplier.");
  };
  const handleReceive = async () => {
    if (!window.confirm("Mark as received? This will update all product stock quantities.")) return;
    await receivePO(id);
    setPo(p => ({ ...p, status:"RECEIVED" }));
    setMsg("Inventory updated. PO marked as received.");
  };
  const handleCancel = async () => {
    if (!window.confirm("Cancel this purchase order?")) return;
    await changeStatus(id, "CANCELLED");
    setPo(p => ({ ...p, status:"CANCELLED" }));
    setMsg("Purchase order cancelled.");
  };

  if (loading) return (
    <AppShell role={role} breadcrumb={[{ label:"Purchase Orders", href:"/PurchaseOrders" }, { label:"Loading…" }]}>
      <div style={{ textAlign:"center", padding:"64px 0" }}>
        <div className="ent-spinner" style={{ margin:"0 auto 12px" }} />
        <p style={{ color:"#9ca3af" }}>Loading…</p>
      </div>
    </AppShell>
  );
  if (!po) return (
    <AppShell role={role} breadcrumb={[{ label:"Purchase Orders", href:"/PurchaseOrders" }, { label:"Not Found" }]}>
      <p style={{ color:"#dc2626", textAlign:"center" }}>Purchase order not found.</p>
    </AppShell>
  );

  const s  = STATUS_BADGE[po.status] || { cls:"ent-badge-gray", label: po.status };
  const canEdit    = po.status === "DRAFT";
  const canSend    = po.status === "DRAFT";
  const canReceive = po.status === "SENT" || po.status === "PARTIALLY_RECEIVED";
  const canCancel  = po.status === "DRAFT" || po.status === "SENT";

  return (
    <AppShell role={role} breadcrumb={[
      { label:"Dashboard", href: role==="Manager" ? "/ManagerMenu" : "/AdminMenu" },
      { label:"Purchase Orders", href:"/PurchaseOrders" },
      { label: po.poNumber },
    ]}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:20 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
            <button onClick={() => navigate("/PurchaseOrders")}
              style={{ background:"none", border:"none", color:"#6b7280", cursor:"pointer", padding:0, display:"flex", alignItems:"center", gap:4, fontFamily:"inherit", fontSize:"0.875rem" }}>
              <ArrowLeft size={14} /> Back
            </button>
          </div>
          <h2 style={{ fontSize:"1.25rem", fontWeight:700, color:"#111827", display:"flex", alignItems:"center", gap:10 }}>
            {po.poNumber}
            <span className={`ent-badge ${s.cls}`}>{s.label}</span>
          </h2>
          <p style={{ color:"#6b7280", fontSize:"0.875rem" }}>
            Supplier: {po.supplierId || "—"} · Created: {po.createdAt ? new Date(po.createdAt).toLocaleDateString() : "—"}
          </p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {canEdit    && <button className="ent-btn ent-btn-secondary" onClick={() => navigate(`/PurchaseOrders/${id}/edit`)}><PencilSquare size={14} /> Edit</button>}
          {canSend    && <button className="ent-btn ent-btn-primary"   onClick={handleSend}><SendCheck size={14} /> Send to Supplier</button>}
          {canReceive && <button className="ent-btn ent-btn-success"   onClick={handleReceive}><CheckCircle size={14} /> Mark Received</button>}
          {canCancel  && <button className="ent-btn ent-btn-secondary" onClick={handleCancel} style={{ color:"#d97706", borderColor:"#fde68a" }}><XCircle size={14} /> Cancel</button>}
        </div>
      </div>

      {msg && <div className="ent-alert ent-alert-success"><CheckCircle size={14} />{msg}</div>}

      {/* Info grid */}
      <div className="ent-grid-2" style={{ marginBottom:16 }}>
        <div className="ent-card" style={{ padding:"20px" }}>
          <h3 style={{ fontSize:"0.875rem", fontWeight:600, color:"#374151", marginBottom:14 }}>Order Information</h3>
          {[
            ["PO Number",          po.poNumber],
            ["Supplier",           po.supplierId || "—"],
            ["Order Date",         po.orderDate ? new Date(po.orderDate).toLocaleDateString() : "—"],
            ["Expected Delivery",  po.expectedDeliveryDate ? new Date(po.expectedDeliveryDate).toLocaleDateString() : "—"],
            ["Status",             <span className={`ent-badge ${s.cls}`}>{s.label}</span>],
          ].map(([label, val]) => (
            <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #f9fafb", fontSize:"0.875rem" }}>
              <span style={{ color:"#6b7280" }}>{label}</span>
              <span style={{ color:"#111827", fontWeight:500 }}>{val}</span>
            </div>
          ))}
        </div>
        <div className="ent-card" style={{ padding:"20px" }}>
          <h3 style={{ fontSize:"0.875rem", fontWeight:600, color:"#374151", marginBottom:14 }}>Financial Summary</h3>
          {[
            ["Total Items", po.items?.length ?? 0],
            ["Total Qty",   po.items?.reduce((s, i) => s + (i.quantity || 0), 0) ?? 0],
            ["Total Amount", <span style={{ fontWeight:700, color:"#111827" }}>₹{(po.totalAmount || 0).toLocaleString(undefined, { maximumFractionDigits:2 })}</span>],
          ].map(([label, val]) => (
            <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #f9fafb", fontSize:"0.875rem" }}>
              <span style={{ color:"#6b7280" }}>{label}</span>
              <span style={{ color:"#111827", fontWeight:500 }}>{val}</span>
            </div>
          ))}
          {po.notes && (
            <div style={{ marginTop:12, padding:"10px 12px", background:"#f9fafb", borderRadius:8, fontSize:"0.8125rem", color:"#4b5563" }}>
              <strong>Notes:</strong> {po.notes}
            </div>
          )}
        </div>
      </div>

      {/* Items table */}
      <div className="ent-table-wrap">
        <div className="ent-table-toolbar">
          <span style={{ fontWeight:600, color:"#111827", fontSize:"0.9375rem" }}>Order Items</span>
        </div>
        <div className="ent-table-scroll">
          <table className="ent-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Product ID</th>
                <th>Ordered Qty</th>
                <th>Received Qty</th>
                <th>Unit Cost</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {(po.items || []).map((item, i) => (
                <tr key={i}>
                  <td style={{ color:"#9ca3af" }}>{i+1}</td>
                  <td className="primary">{item.productName || item.productId}</td>
                  <td><code style={{ background:"#f3f4f6", border:"1px solid #e5e7eb", borderRadius:4, padding:"2px 6px", fontSize:"0.78rem" }}>{item.productId}</code></td>
                  <td>{item.quantity}</td>
                  <td>
                    {item.receivedQuantity > 0
                      ? <span className="ent-badge ent-badge-green">{item.receivedQuantity}</span>
                      : <span className="ent-badge ent-badge-gray">0</span>}
                  </td>
                  <td>₹{item.unitCost}</td>
                  <td style={{ fontWeight:600, color:"#111827" }}>₹{(item.totalCost || 0).toLocaleString(undefined, { maximumFractionDigits:2 })}</td>
                </tr>
              ))}
              {(po.items || []).length === 0 && (
                <tr><td colSpan={7} style={{ textAlign:"center", color:"#9ca3af", padding:32 }}>No items in this order</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`@keyframes ent-spin{to{transform:rotate(360deg)}}.ent-spinner{width:32px;height:32px;border:2.5px solid #e5e7eb;border-top-color:#1d4ed8;border-radius:50%;animation:ent-spin .7s linear infinite}`}</style>
    </AppShell>
  );
}
