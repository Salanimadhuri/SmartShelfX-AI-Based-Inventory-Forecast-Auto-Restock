import React, { useEffect, useState, useMemo } from "react";
import AppShell from "../UI/AppShell";
import { getExpirySummary, getAllBatches, deleteBatch } from "../../Services/BatchService";
import { useNavigate } from "react-router-dom";
import { Search, PlusCircle, ExclamationTriangle, Trash } from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

const PAGE_SIZE = 12;

function expiryBadge(expiryDate) {
  if (!expiryDate) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const exp   = new Date(expiryDate); exp.setHours(0,0,0,0);
  const diff  = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  if (diff < 0)   return <span className="ent-badge ent-badge-red">Expired</span>;
  if (diff <= 7)  return <span className="ent-badge ent-badge-red">Exp. in {diff}d</span>;
  if (diff <= 30) return <span className="ent-badge ent-badge-yellow">Exp. in {diff}d</span>;
  return <span className="ent-badge ent-badge-green">{diff}d left</span>;
}

export default function BatchList() {
  const navigate = useNavigate();
  const role     = localStorage.getItem("loggedInRole") || "Admin";
  const [batches,  setBatches]  = useState([]);
  const [summary,  setSummary]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("ALL");
  const [page,     setPage]     = useState(1);

  useEffect(() => {
    Promise.all([getAllBatches(), getExpirySummary()])
      .then(([b, s]) => { setBatches(b.data); setSummary(s.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    let d = batches;
    if (filter === "EXPIRED")  d = d.filter(b => b.expiryDate && new Date(b.expiryDate) < today);
    if (filter === "SOON")     d = d.filter(b => { if (!b.expiryDate) return false; const diff = Math.ceil((new Date(b.expiryDate) - today)/(86400000)); return diff >= 0 && diff <= 30; });
    if (filter === "HEALTHY")  d = d.filter(b => { if (!b.expiryDate) return true; const diff = Math.ceil((new Date(b.expiryDate) - today)/(86400000)); return diff > 30; });
    if (search) d = d.filter(b =>
      b.batchNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b.productName?.toLowerCase().includes(search.toLowerCase()) ||
      b.productId?.toLowerCase().includes(search.toLowerCase())
    );
    return d;
  }, [batches, search, filter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this batch record?")) return;
    await deleteBatch(id);
    setBatches(p => p.filter(b => b.id !== id));
  };

  return (
    <AppShell role={role} breadcrumb={[
      { label:"Dashboard", href: role==="Manager"?"/ManagerMenu":"/AdminMenu" },
      { label:"Batch & Expiry Tracking" }
    ]}>
      <div className="ent-page-header">
        <div>
          <h2 className="ent-page-title">Batch &amp; Expiry Tracking</h2>
          <p className="ent-page-subtitle">{batches.length} batch records</p>
        </div>
        <button className="ent-btn ent-btn-primary" onClick={() => navigate("/Batches/new")}>
          <PlusCircle size={15} /> Add Batch
        </button>
      </div>

      {/* Expiry summary cards */}
      {summary && (
        <div className="ent-grid-3" style={{ marginBottom:20 }}>
          {[
            { label:"Expired Batches",        value:summary.expiredCount,  cls:"ent-badge-red",    bg:"#fef2f2", border:"#fecaca" },
            { label:"Expiring within 7 days", value:summary.within7Count,  cls:"ent-badge-red",    bg:"#fff7ed", border:"#fed7aa" },
            { label:"Expiring within 30 days",value:summary.within30Count, cls:"ent-badge-yellow", bg:"#fefce8", border:"#fde68a" },
          ].map(c => (
            <div key={c.label} className="ent-stat-card" style={{ background:c.bg, borderColor:c.border }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <ExclamationTriangle size={18} color={c.value > 0 ? "#dc2626" : "#9ca3af"} />
                <span className={`ent-badge ${c.cls}`}>{c.value}</span>
              </div>
              <div style={{ fontSize:"1.5rem", fontWeight:700, color:"#111827", marginBottom:4 }}>{c.value}</div>
              <div style={{ fontSize:"0.8125rem", color:"#4b5563" }}>{c.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter bar */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {[
          { key:"ALL",     label:"All Batches" },
          { key:"EXPIRED", label:"Expired"     },
          { key:"SOON",    label:"Expiring Soon (30d)" },
          { key:"HEALTHY", label:"Healthy"     },
        ].map(f => (
          <button key={f.key} onClick={() => { setFilter(f.key); setPage(1); }}
            className={`ent-btn ent-btn-sm ${filter===f.key ? "ent-btn-primary" : "ent-btn-secondary"}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="ent-table-wrap">
        <div className="ent-table-toolbar">
          <div className="ent-search-wrap">
            <span className="ent-search-icon"><Search size={14} /></span>
            <input className="ent-search" placeholder="Search batch number or product…"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <span style={{ fontSize:"0.8125rem", color:"#9ca3af" }}>{filtered.length} records</span>
        </div>

        {loading ? (
          <div style={{ padding:48, textAlign:"center" }}>
            <div className="ent-spinner" style={{ margin:"0 auto 12px" }} />
            <p style={{ color:"#9ca3af", fontSize:"0.875rem" }}>Loading batches…</p>
          </div>
        ) : (
          <>
            <div className="ent-table-scroll">
              <table className="ent-table">
                <thead>
                  <tr>
                    <th>Batch #</th>
                    <th>Product</th>
                    <th>Manufacture Date</th>
                    <th>Expiry Date</th>
                    <th>Quantity</th>
                    <th>Remaining</th>
                    <th>Supplier</th>
                    <th>Expiry Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={9}>
                      <div className="ent-empty">
                        <div className="ent-empty-title">No batch records found</div>
                        <div className="ent-empty-text">Add batch records when receiving stock.</div>
                      </div>
                    </td></tr>
                  ) : paginated.map(b => (
                    <tr key={b.id}>
                      <td className="primary"><code style={{ background:"#f3f4f6", border:"1px solid #e5e7eb", borderRadius:4, padding:"2px 6px", fontSize:"0.78rem" }}>{b.batchNumber}</code></td>
                      <td>
                        <div style={{ fontWeight:500, color:"#111827" }}>{b.productName || b.productId}</div>
                        <div style={{ fontSize:"0.75rem", color:"#9ca3af" }}>{b.productId}</div>
                      </td>
                      <td>{b.manufactureDate ? new Date(b.manufactureDate).toLocaleDateString() : "—"}</td>
                      <td style={{ fontWeight:500 }}>{b.expiryDate ? new Date(b.expiryDate).toLocaleDateString() : "—"}</td>
                      <td>{b.quantity}</td>
                      <td>
                        <span style={{ fontWeight:600, color: b.remainingQuantity > 0 ? "#16a34a" : "#9ca3af" }}>
                          {b.remainingQuantity ?? b.quantity}
                        </span>
                      </td>
                      <td style={{ color:"#4b5563" }}>{b.supplierId || "—"}</td>
                      <td>{expiryBadge(b.expiryDate)}</td>
                      <td>
                        <button className="ent-btn ent-btn-danger ent-btn-sm" title="Delete"
                          onClick={() => handleDelete(b.id)}>
                          <Trash size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="ent-pagination">
                <span>Showing {((page-1)*PAGE_SIZE)+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}</span>
                <div className="ent-pagination-btns">
                  <button className="ent-page-btn" disabled={page===1} onClick={() => setPage(p=>p-1)}>‹</button>
                  {[...Array(totalPages)].map((_,i) => <button key={i} className={`ent-page-btn${page===i+1?" active":""}`} onClick={() => setPage(i+1)}>{i+1}</button>)}
                  <button className="ent-page-btn" disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>›</button>
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
