import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../UI/AppShell";
import { getAllPOs, changeStatus, deletePO } from "../../Services/PurchaseOrderService";
import { Search, PlusCircle, Eye, Trash, CheckCircle, XCircle, SendCheck } from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

const PAGE_SIZE = 10;

const STATUS_BADGE = {
  DRAFT:               { cls: "ent-badge-gray",   label: "Draft"              },
  SENT:                { cls: "ent-badge-blue",   label: "Sent"               },
  PARTIALLY_RECEIVED:  { cls: "ent-badge-yellow", label: "Partially Received" },
  RECEIVED:            { cls: "ent-badge-green",  label: "Received"           },
  CANCELLED:           { cls: "ent-badge-red",    label: "Cancelled"          },
};

export default function PurchaseOrderList() {
  const navigate  = useNavigate();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("ALL");
  const [page,    setPage]    = useState(1);
  const role = localStorage.getItem("loggedInRole") || "Admin";

  useEffect(() => {
    getAllPOs().then(r => setOrders(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let d = orders;
    if (filter !== "ALL") d = d.filter(o => o.status === filter);
    if (search) d = d.filter(o =>
      o.poNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.supplierId?.toLowerCase().includes(search.toLowerCase())
    );
    return d;
  }, [orders, search, filter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSend = async (id) => {
    await changeStatus(id, "SENT");
    setOrders(p => p.map(o => o.id === id ? { ...o, status: "SENT" } : o));
  };
  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this purchase order?")) return;
    await changeStatus(id, "CANCELLED");
    setOrders(p => p.map(o => o.id === id ? { ...o, status: "CANCELLED" } : o));
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this draft PO? This cannot be undone.")) return;
    await deletePO(id);
    setOrders(p => p.filter(o => o.id !== id));
  };
  const handleReceive = async (id) => {
    if (!window.confirm("Mark this PO as received? This will update product stock.")) return;
    const { receivePO } = await import("../../Services/PurchaseOrderService");
    await receivePO(id);
    setOrders(p => p.map(o => o.id === id ? { ...o, status: "RECEIVED" } : o));
  };

  return (
    <AppShell role={role} breadcrumb={[
      { label: "Dashboard", href: role === "Manager" ? "/ManagerMenu" : "/AdminMenu" },
      { label: "Purchase Orders" }
    ]}>
      <div className="ent-page-header">
        <div>
          <h2 className="ent-page-title">Purchase Orders</h2>
          <p className="ent-page-subtitle">{orders.length} total orders</p>
        </div>
        <button className="ent-btn ent-btn-primary" onClick={() => navigate("/PurchaseOrders/new")}>
          <PlusCircle size={15} /> New Purchase Order
        </button>
      </div>

      {/* Summary strip */}
      {!loading && (
        <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
          {["ALL","DRAFT","SENT","PARTIALLY_RECEIVED","RECEIVED","CANCELLED"].map(s => {
            const count = s === "ALL" ? orders.length : orders.filter(o => o.status === s).length;
            const cfg   = STATUS_BADGE[s] || { cls:"ent-badge-gray", label: s };
            return (
              <button key={s} onClick={() => { setFilter(s); setPage(1); }}
                style={{
                  background: filter === s ? "#1d4ed8" : "#fff",
                  color:      filter === s ? "#fff"    : "#374151",
                  border: `1px solid ${filter === s ? "#1d4ed8" : "#e5e7eb"}`,
                  borderRadius:8, padding:"6px 14px", cursor:"pointer",
                  fontSize:"0.8125rem", fontWeight:500, fontFamily:"inherit",
                  display:"flex", alignItems:"center", gap:6,
                }}>
                <span className={`ent-badge ${filter === s ? "ent-badge-primary" : cfg.cls}`}>{count}</span>
                {s === "ALL" ? "All" : cfg.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="ent-table-wrap">
        <div className="ent-table-toolbar">
          <div className="ent-search-wrap">
            <span className="ent-search-icon"><Search size={14} /></span>
            <input className="ent-search" placeholder="Search by PO number or supplier…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <span style={{ fontSize:"0.8125rem", color:"#9ca3af" }}>{filtered.length} orders</span>
        </div>

        {loading ? (
          <div style={{ padding:48, textAlign:"center" }}>
            <div className="ent-spinner" style={{ margin:"0 auto 12px" }} />
            <p style={{ color:"#9ca3af", fontSize:"0.875rem" }}>Loading purchase orders…</p>
          </div>
        ) : (
          <>
            <div className="ent-table-scroll">
              <table className="ent-table">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>Supplier</th>
                    <th>Order Date</th>
                    <th>Expected Delivery</th>
                    <th>Total Amount</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={8}>
                      <div className="ent-empty">
                        <div className="ent-empty-title">No purchase orders found</div>
                        <div className="ent-empty-text">Create your first purchase order to get started.</div>
                        <button className="ent-btn ent-btn-primary" style={{ marginTop:12 }}
                          onClick={() => navigate("/PurchaseOrders/new")}>
                          <PlusCircle size={14} /> Create PO
                        </button>
                      </div>
                    </td></tr>
                  ) : paginated.map(o => {
                    const s = STATUS_BADGE[o.status] || { cls:"ent-badge-gray", label: o.status };
                    return (
                      <tr key={o.id}>
                        <td className="primary">{o.poNumber}</td>
                        <td>{o.supplierId || "—"}</td>
                        <td>{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "—"}</td>
                        <td>{o.expectedDeliveryDate ? new Date(o.expectedDeliveryDate).toLocaleDateString() : "—"}</td>
                        <td style={{ fontWeight:600, color:"#111827" }}>
                          ₹{(o.totalAmount || 0).toLocaleString(undefined, { maximumFractionDigits:2 })}
                        </td>
                        <td>{o.items?.length ?? 0} items</td>
                        <td><span className={`ent-badge ${s.cls}`}>{s.label}</span></td>
                        <td>
                          <div style={{ display:"flex", gap:4 }}>
                            <button className="ent-btn ent-btn-ghost ent-btn-sm" title="View"
                              onClick={() => navigate(`/PurchaseOrders/${o.id}`)}>
                              <Eye size={14} />
                            </button>
                            {o.status === "DRAFT" && (
                              <button className="ent-btn ent-btn-ghost ent-btn-sm" title="Send to Supplier"
                                onClick={() => handleSend(o.id)}
                                style={{ color:"#1d4ed8" }}>
                                <SendCheck size={14} />
                              </button>
                            )}
                            {(o.status === "SENT" || o.status === "PARTIALLY_RECEIVED") && (
                              <button className="ent-btn ent-btn-ghost ent-btn-sm" title="Mark Received"
                                onClick={() => handleReceive(o.id)}
                                style={{ color:"#16a34a" }}>
                                <CheckCircle size={14} />
                              </button>
                            )}
                            {(o.status === "DRAFT" || o.status === "SENT") && (
                              <button className="ent-btn ent-btn-ghost ent-btn-sm" title="Cancel"
                                onClick={() => handleCancel(o.id)}
                                style={{ color:"#d97706" }}>
                                <XCircle size={14} />
                              </button>
                            )}
                            {(o.status === "DRAFT" || o.status === "CANCELLED") && (
                              <button className="ent-btn ent-btn-danger ent-btn-sm" title="Delete"
                                onClick={() => handleDelete(o.id)}>
                                <Trash size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="ent-pagination">
                <span>Showing {((page-1)*PAGE_SIZE)+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}</span>
                <div className="ent-pagination-btns">
                  <button className="ent-page-btn" disabled={page===1} onClick={() => setPage(p=>p-1)}>‹ Prev</button>
                  {[...Array(totalPages)].map((_,i) => (
                    <button key={i} className={`ent-page-btn${page===i+1?" active":""}`} onClick={() => setPage(i+1)}>{i+1}</button>
                  ))}
                  <button className="ent-page-btn" disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>Next ›</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <style>{`@keyframes ent-spin{to{transform:rotate(360deg)}}.ent-spinner{width:32px;height:32px;border:2.5px solid #e5e7eb;border-top-color:#1d4ed8;border-radius:50%;animation:ent-spin .7s linear infinite}`}</style>
    </AppShell>
  );
}
