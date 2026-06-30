import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { showAllSKUs, removeSKU } from "../../Services/SKUService";
import { Search, PlusCircle, PencilSquare, Trash, TagFill } from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

const PAGE_SIZE = 15;

export default function SKUReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const [skuList, setSkuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    showAllSKUs().then(r => { setSkuList(r.data); setLoading(false); });
  }, []);

  const returnBack = () => {
    const from = new URLSearchParams(location.search).get("from");
    navigate(from === "manager" ? "/ManagerMenu" : "/AdminMenu");
  };

  const deleteSKU = async (id) => {
    if (!window.confirm("Delete this SKU? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await removeSKU(id);
      setSkuList(p => p.filter(s => s.skuId !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = skuList.filter(s =>
    s.skuId?.toLowerCase().includes(search.toLowerCase()) ||
    s.skuDescription?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handleSearch = (val) => { setSearch(val); setPage(1); };

  return (
    <div style={{
      minHeight:"100vh", background:"#f9fafb",
      fontFamily:"var(--font,'Inter',sans-serif)", padding:"32px 24px",
    }}>
      <div style={{ maxWidth:800, margin:"0 auto" }}>
        {/* Back */}
        <button onClick={returnBack} style={{
          display:"flex", alignItems:"center", gap:6, background:"none", border:"none",
          color:"#6b7280", fontSize:"0.875rem", cursor:"pointer", fontFamily:"inherit", padding:0, marginBottom:20,
        }}>
          ← Dashboard
        </button>

        {/* Header */}
        <div className="ent-page-header">
          <div>
            <h2 className="ent-page-title">SKU List</h2>
            <p className="ent-page-subtitle">{skuList.length} SKUs in inventory</p>
          </div>
          <Link to="/SkuAdd" className="ent-btn ent-btn-primary" style={{ textDecoration:"none" }}>
            <PlusCircle size={15} /> Add SKU
          </Link>
        </div>

        {/* Table */}
        <div className="ent-table-wrap">
          <div className="ent-table-toolbar">
            <div className="ent-search-wrap">
              <span className="ent-search-icon"><Search size={14} /></span>
              <input className="ent-search" value={search}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search by SKU ID or description…" />
            </div>
            <span style={{ fontSize:"0.8125rem", color:"#9ca3af", whiteSpace:"nowrap" }}>
              {filtered.length} of {skuList.length}
            </span>
          </div>

          {loading ? (
            <div style={{ padding:48, textAlign:"center" }}>
              <div className="ent-spinner" style={{ margin:"0 auto 12px" }} />
              <p style={{ color:"#9ca3af", fontSize:"0.875rem" }}>Loading SKUs…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="ent-empty">
              <TagFill size={28} style={{ color:"#d1d5db", marginBottom:12 }} />
              <div className="ent-empty-title">
                {search ? "No SKUs match your search" : "No SKUs yet"}
              </div>
              <div className="ent-empty-text">
                {search ? "Try a different keyword" : "Add your first SKU to get started."}
              </div>
            </div>
          ) : (
            <>
              <div className="ent-table-scroll">
                <table className="ent-table">
                  <thead>
                    <tr>
                      <th style={{ width:40 }}>#</th>
                      <th>SKU ID</th>
                      <th>Description</th>
                      <th style={{ width:120 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((sku, i) => (
                      <tr key={sku.skuId}>
                        <td style={{ color:"#9ca3af", fontSize:"0.78rem" }}>
                          {(page - 1) * PAGE_SIZE + i + 1}
                        </td>
                        <td>
                          <code style={{
                            background:"#f3f4f6", border:"1px solid #e5e7eb", borderRadius:5,
                            padding:"2px 8px", fontSize:"0.8rem", color:"#374151",
                          }}>{sku.skuId}</code>
                        </td>
                        <td className="primary">{sku.skuDescription}</td>
                        <td>
                          <div style={{ display:"flex", gap:4 }}>
                            <Link to={`/update-sku/${sku.skuId}`}
                              className="ent-btn ent-btn-ghost ent-btn-sm"
                              title="Edit" style={{ textDecoration:"none" }}>
                              <PencilSquare size={14} />
                            </Link>
                            <button
                              className="ent-btn ent-btn-danger ent-btn-sm" title="Delete"
                              onClick={() => deleteSKU(sku.skuId)}
                              disabled={deletingId === sku.skuId}>
                              <Trash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="ent-pagination">
                  <span>
                    Showing {((page-1)*PAGE_SIZE)+1}–{Math.min(page*PAGE_SIZE,filtered.length)} of {filtered.length}
                  </span>
                  <div className="ent-pagination-btns">
                    <button className="ent-page-btn" disabled={page===1} onClick={() => setPage(p=>p-1)}>‹</button>
                    {[...Array(totalPages)].map((_,i) => (
                      <button key={i} className={`ent-page-btn${page===i+1?" active":""}`} onClick={() => setPage(i+1)}>
                        {i+1}
                      </button>
                    ))}
                    <button className="ent-page-btn" disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>›</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes ent-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
