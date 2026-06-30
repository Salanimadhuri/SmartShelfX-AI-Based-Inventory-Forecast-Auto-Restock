import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../Services/ProductService";
import { getInventoryInsights } from "../../Services/AIService";
import { Search, Eye, ArrowUpCircle, ArrowDownCircle, ExclamationTriangle } from "react-bootstrap-icons";
import AppShell from "../UI/AppShell";
import "../UI/EnterpriseStyles.css";

const PAGE_SIZE = 10;

const StatusBadge = ({ stock, reorderLevel }) => {
  if (stock === 0 || stock < reorderLevel * 0.5) return <span className="ent-badge ent-badge-red">Critical</span>;
  if (stock <= reorderLevel)                      return <span className="ent-badge ent-badge-yellow">Low Stock</span>;
  return <span className="ent-badge ent-badge-green">In Stock</span>;
};

const ManagerProductReport = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProducts()
      .then(r => { setProducts(r.data); setAiInsights(getInventoryInsights(r.data)); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleView     = (id) => navigate(`/view-product/${id}`);
  const handleIssue    = (id) => navigate(`/issue-product/${id}?returnPath=/MngProdRepo`);
  const handlePurchase = (id) => navigate(`/purchase-product/${id}?returnPath=/MngProdRepo`);

  const filtered = useMemo(() =>
    products.filter(p =>
      p.productName?.toLowerCase().includes(search.toLowerCase()) ||
      p.productId?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
    ), [products, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handleSearch = (val) => { setSearch(val); setPage(1); };

  return (
    <AppShell role="Manager" breadcrumb={[{ label: "Dashboard", href: "/ManagerMenu" }, { label: "Products" }]}>
      <div className="ent-page-header">
        <div>
          <h2 className="ent-page-title">Product Inventory</h2>
          <p className="ent-page-subtitle">
            {products.length} products · {aiInsights?.lowStockCount ?? 0} low stock
          </p>
        </div>
      </div>

      {!loading && aiInsights?.criticalCount > 0 && (
        <div className="ent-alert ent-alert-error">
          <ExclamationTriangle size={15} />
          <strong>{aiInsights.criticalCount} critical items</strong>:&nbsp;
          {aiInsights.criticalItems.slice(0, 3).map(p => p.productName).join(", ")}
        </div>
      )}

      {/* Stat strip */}
      {!loading && aiInsights && (
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { label: "Healthy",  value: aiInsights.healthyCount,  cls: "ent-badge-green" },
            { label: "Low Stock",value: aiInsights.lowStockCount, cls: "ent-badge-yellow" },
            { label: "Critical", value: aiInsights.criticalCount, cls: "ent-badge-red" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
              padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, fontSize: "0.8125rem",
            }}>
              <span className={`ent-badge ${s.cls}`}>{s.value}</span>
              <span style={{ color: "#4b5563" }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="ent-table-wrap">
        <div className="ent-table-toolbar">
          <div className="ent-search-wrap">
            <span className="ent-search-icon"><Search size={14} /></span>
            <input className="ent-search" placeholder="Search products…"
              value={search} onChange={e => handleSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: "0.8125rem", color: "#9ca3af", whiteSpace: "nowrap" }}>
            {filtered.length} of {products.length}
          </span>
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <div className="ent-spinner" style={{ margin: "0 auto 12px" }} />
            <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>Loading products…</p>
          </div>
        ) : (
          <>
            <div className="ent-table-scroll">
              <table className="ent-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Purchase Price</th>
                    <th>Stock</th>
                    <th>Reorder Level</th>
                    <th>Vendor</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={8}>
                      <div className="ent-empty">
                        <div className="ent-empty-title">{search ? "No products match" : "No products found"}</div>
                      </div>
                    </td></tr>
                  ) : paginated.map((p) => (
                    <tr key={p.productId}>
                      <td>
                        <div className="primary" style={{ fontWeight: 500 }}>{p.productName}</div>
                        <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{p.productId}</div>
                      </td>
                      <td>
                        <code style={{
                          background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 4,
                          padding: "2px 6px", fontSize: "0.78rem", color: "#374151",
                        }}>{p.sku}</code>
                      </td>
                      <td className="primary">₹{p.purchasePrice}</td>
                      <td>
                        <span style={{
                          fontWeight: 600,
                          color: p.stock === 0 || p.stock < p.reorderLevel * 0.5 ? "#dc2626"
                            : p.stock <= p.reorderLevel ? "#d97706" : "#16a34a",
                        }}>{p.stock}</span>
                        <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}> units</span>
                      </td>
                      <td style={{ color: "#4b5563" }}>{p.reorderLevel}</td>
                      <td style={{ color: "#4b5563" }}>{p.vendorId}</td>
                      <td><StatusBadge stock={p.stock} reorderLevel={p.reorderLevel} /></td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button className="ent-btn ent-btn-ghost ent-btn-sm" title="View" onClick={() => handleView(p.productId)}>
                            <Eye size={14} />
                          </button>
                          <button className="ent-btn ent-btn-ghost ent-btn-sm" title="Issue" onClick={() => handleIssue(p.productId)}>
                            <ArrowUpCircle size={14} />
                          </button>
                          <button className="ent-btn ent-btn-ghost ent-btn-sm" title="Purchase" onClick={() => handlePurchase(p.productId)}>
                            <ArrowDownCircle size={14} />
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
                <span>Showing {((page-1)*PAGE_SIZE)+1}–{Math.min(page*PAGE_SIZE,filtered.length)} of {filtered.length}</span>
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
    </AppShell>
  );
};

export default ManagerProductReport;
