import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllTransactions } from "../../Services/TransactionService";
import { getTransactionInsights } from "../../Services/AIService";
import { Search, ArrowUpCircle, ArrowDownCircle, CurrencyDollar, BarChartLine } from "react-bootstrap-icons";
import AppShell from "../UI/AppShell";
import "../UI/EnterpriseStyles.css";

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
};

const PAGE_SIZE = 15;

const TransactionReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);

  const queryParams = new URLSearchParams(location.search);
  const urlFilterType = queryParams.get("type");

  const storedUser = localStorage.getItem("loggedInUser");
  let user = { username: "unknown" };
  if (storedUser) {
    try { user = storedUser.startsWith("{") ? JSON.parse(storedUser) : { username: storedUser }; }
    catch { /* ignore */ }
  }

  const role = localStorage.getItem("loggedInRole");

  useEffect(() => {
    if (!storedUser) { navigate("/"); return; }
    if (urlFilterType === "issue" || urlFilterType === "purchase") setFilterType(urlFilterType);
    getAllTransactions()
      .then((res) => { setInsights(getTransactionInsights(res.data)); setTransactions(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pageTitle = urlFilterType === "issue" ? "Issue History"
    : urlFilterType === "purchase" ? "Purchase History" : "All Transactions";

  const breadcrumbBase = role === "Manager"
    ? [{ label: "Dashboard", href: "/ManagerMenu" }]
    : [{ label: "Dashboard", href: "/AdminMenu" }];

  const filtered = useMemo(() => {
    let data = transactions;
    if (filterType !== "all") data = data.filter(t => t.transactionType === filterType);
    if (search) data = data.filter(t =>
      String(t.transactionId).toLowerCase().includes(search.toLowerCase()) ||
      String(t.productId).toLowerCase().includes(search.toLowerCase())
    );
    return data;
  }, [transactions, filterType, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handleSearch = (val) => { setSearch(val); setPage(1); };
  const handleFilter = (val) => { setFilterType(val); setPage(1); };

  return (
    <AppShell role={role || "Admin"} breadcrumb={[...breadcrumbBase, { label: pageTitle }]}>
      <div className="ent-page-header">
        <div>
          <h2 className="ent-page-title">{pageTitle}</h2>
          <p className="ent-page-subtitle">{transactions.length} total transactions</p>
        </div>
      </div>

      {/* Summary cards */}
      {insights && (
        <div className="ent-grid-4" style={{ marginBottom: 20 }}>
          {[
            {
              icon: <CurrencyDollar size={18} />, label: "Total Revenue",
              value: `₹${parseFloat(insights.totalRevenue).toLocaleString()}`,
            },
            {
              icon: <BarChartLine size={18} />, label: "Profit Margin",
              value: `${insights.profitMargin}%`,
            },
            {
              icon: <ArrowUpCircle size={18} />, label: "Issued",
              value: insights.issueCount,
            },
            {
              icon: <ArrowDownCircle size={18} />, label: "Purchased",
              value: insights.purchaseCount,
            },
          ].map((c, i) => (
            <div key={i} className="ent-stat-card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, background: "#eff6ff",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#1d4ed8", flexShrink: 0,
              }}>
                {c.icon}
              </div>
              <div>
                <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "#111827" }}>{c.value}</div>
                <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>{c.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="ent-table-wrap">
        <div className="ent-table-toolbar">
          <div className="ent-search-wrap">
            <span className="ent-search-icon"><Search size={14} /></span>
            <input className="ent-search" placeholder="Search by ID or product…"
              value={search} onChange={e => handleSearch(e.target.value)} />
          </div>
          {/* Type filter */}
          <div style={{ display: "flex", gap: 4 }}>
            {[
              { val: "all",      label: "All" },
              { val: "issue",    label: "Issues (OUT)" },
              { val: "purchase", label: "Purchases (IN)" },
            ].map((f) => (
              <button key={f.val}
                className={`ent-btn ent-btn-sm ${filterType === f.val ? "ent-btn-primary" : "ent-btn-secondary"}`}
                onClick={() => handleFilter(f.val)}>
                {f.label}
              </button>
            ))}
          </div>
          <span style={{ fontSize: "0.8125rem", color: "#9ca3af", whiteSpace: "nowrap" }}>
            {filtered.length} records
          </span>
        </div>

        {loading ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <div className="ent-spinner" style={{ margin: "0 auto 12px" }} />
            <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>Loading transactions…</p>
          </div>
        ) : (
          <>
            <div className="ent-table-scroll">
              <table className="ent-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product ID</th>
                    <th>Type</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Value</th>
                    <th>Date</th>
                    <th>User</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={8}>
                      <div className="ent-empty">
                        <div className="ent-empty-title">No transactions found</div>
                      </div>
                    </td></tr>
                  ) : paginated.map((t, idx) => (
                    <tr key={t.transactionId}>
                      <td className="primary">{t.transactionId}</td>
                      <td style={{ fontWeight: 500, color: "#111827" }}>{t.productId}</td>
                      <td>
                        <span className={`ent-badge ${t.transactionType === "issue" ? "ent-badge-yellow" : "ent-badge-green"}`}>
                          {t.transactionType === "issue" ? "OUT" : "IN"}
                        </span>
                      </td>
                      <td>{t.quantity}</td>
                      <td>₹{t.rate}</td>
                      <td style={{ fontWeight: 600, color: "#111827" }}>₹{t.transactionValue}</td>
                      <td>{formatDate(t.transactionDate)}</td>
                      <td style={{ color: "#6b7280" }}>{t.userId || user.username}</td>
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
                  {[...Array(Math.min(totalPages, 7))].map((_,i) => (
                    <button key={i} className={`ent-page-btn${page===i+1?" active":""}`} onClick={() => setPage(i+1)}>{i+1}</button>
                  ))}
                  {totalPages > 7 && <span style={{ padding: "4px 8px", color: "#9ca3af" }}>…</span>}
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

export default TransactionReport;
