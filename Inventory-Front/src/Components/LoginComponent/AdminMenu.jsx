import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../UI/AppShell";
import { getAllProducts } from "../../Services/ProductService";
import { getAllTransactions } from "../../Services/TransactionService";
import { getPOSummary } from "../../Services/PurchaseOrderService";
import { getExpirySummary } from "../../Services/BatchService";
import { getInventoryInsights, getTransactionInsights } from "../../Services/AIService";
import {
  BoxSeam, ExclamationTriangle, CurrencyDollar, Activity,
  ArrowUpRight, ArrowDownRight, FileEarmarkArrowDown, CalendarEvent,
} from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

const KPICard = ({ icon, label, value, sub, trend, trendUp, delay = 0 }) => (
  <div className="ent-stat-card ent-fade-up" style={{ animationDelay: `${delay}s` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, background: "#eff6ff",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#1d4ed8",
      }}>
        {icon}
      </div>
      {trend !== undefined && (
        <span style={{
          display: "flex", alignItems: "center", gap: 3, fontSize: "0.75rem", fontWeight: 500,
          color: trendUp ? "#16a34a" : "#dc2626",
        }}>
          {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </span>
      )}
    </div>
    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", lineHeight: 1, marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#4b5563", marginBottom: 2 }}>{label}</div>
    {sub && <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{sub}</div>}
  </div>
);

const StatusBar = ({ label, count, total, color }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: "0.8125rem", color: "#4b5563" }}>{label}</span>
        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#111827" }}>{count} <span style={{ color: "#9ca3af", fontWeight: 400 }}>({pct}%)</span></span>
      </div>
      <div style={{ height: 6, background: "#f3f4f6", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
};

export default function AdminMenu() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [inv, setInv] = useState(null);
  const [txn, setTxn] = useState(null);
  const [poSummary, setPoSummary] = useState(null);
  const [expiry, setExpiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllProducts(), getAllTransactions(),
      getPOSummary().catch(() => null),
      getExpirySummary().catch(() => null),
    ])
      .then(([p, t, po, ex]) => {
        setProducts(p.data);
        setTransactions(t.data);
        setInv(getInventoryInsights(p.data));
        setTxn(getTransactionInsights(t.data));
        if (po) setPoSummary(po.data);
        if (ex) setExpiry(ex.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const storedUser = localStorage.getItem("loggedInUser");
  const username = storedUser ? JSON.parse(storedUser).username : "Admin";

  const recentTxns = [...transactions].reverse().slice(0, 5);

  return (
    <AppShell role="Admin" breadcrumb={[{ label: "Dashboard" }]}>
      {/* Welcome */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: 4 }}>
          Good day, {username}
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
          Here's an overview of your inventory operations.
        </p>
      </div>

      {/* KPI row */}
      {loading ? (
        <div className="ent-grid-4" style={{ marginBottom: 24 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="ent-skeleton" style={{ height: 104 }} />
          ))}
        </div>
      ) : (
        <div className="ent-grid-4" style={{ marginBottom: 24 }}>
          <KPICard
            icon={<BoxSeam size={18} />}
            label="Total Products"
            value={products.length}
            sub="In inventory"
            delay={0}
          />
          <KPICard
            icon={<CurrencyDollar size={18} />}
            label="Total Revenue"
            value={txn ? `₹${parseFloat(txn.totalRevenue).toLocaleString()}` : "—"}
            sub={txn ? `${txn.profitMargin}% margin` : ""}
            trend={txn ? `${txn.profitMargin}%` : undefined}
            trendUp={txn && parseFloat(txn.profitMargin) > 0}
            delay={0.05}
          />
          <KPICard
            icon={<ExclamationTriangle size={18} />}
            label="Low Stock Alerts"
            value={inv?.lowStockCount ?? 0}
            sub={inv?.criticalCount > 0 ? `${inv.criticalCount} critical` : "All clear"}
            delay={0.1}
          />
          <KPICard
            icon={<Activity size={18} />}
            label="Inventory Health"
            value={inv ? `${inv.healthScore}%` : "—"}
            sub={inv ? `${inv.healthyCount} products healthy` : ""}
            trend={inv ? `${inv.healthScore}%` : undefined}
            trendUp={inv && inv.healthScore >= 60}
            delay={0.15}
          />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, marginBottom: 24 }}>
        {/* Inventory status */}
        <div className="ent-card" style={{ padding: "20px 20px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Inventory Status</h3>
            <button className="ent-btn ent-btn-ghost ent-btn-sm" onClick={() => navigate("/AdProdRepo")}>
              View all
            </button>
          </div>
          {loading ? (
            <div>
              {[...Array(3)].map((_, i) => <div key={i} className="ent-skeleton" style={{ height: 28, marginBottom: 12 }} />)}
            </div>
          ) : inv ? (
            <div>
              <StatusBar label="Healthy" count={inv.healthyCount} total={inv.totalProducts} color="#16a34a" />
              <StatusBar label="Low Stock" count={inv.lowStockCount} total={inv.totalProducts} color="#d97706" />
              <StatusBar label="Critical" count={inv.criticalCount} total={inv.totalProducts} color="#dc2626" />
            </div>
          ) : null}
        </div>

        {/* Quick actions */}
        <div className="ent-card" style={{ padding: "20px" }}>
          <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827", marginBottom: 14 }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "View Products",    href: "/AdProdRepo" },
              { label: "Add Product",      href: "/ProductAdd" },
              { label: "Add SKU",          href: "/SkuAdd" },
              { label: "Sales Analysis",   href: "/AllProductAnalysis" },
              { label: "Demand Forecast",  href: "/SingleProductDemand" },
              { label: "All Transactions", href: "/Transactions" },
            ].map((a) => (
              <a key={a.href} href={a.href}
                className="ent-btn ent-btn-secondary"
                style={{ textDecoration: "none", justifyContent: "flex-start", textAlign: "left" }}>
                {a.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* PO + Expiry widgets */}
      {(poSummary || expiry) && (
        <div className="ent-grid-2" style={{ marginBottom: 24 }}>
          {poSummary && (
            <div className="ent-card" style={{ padding: "20px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <FileEarmarkArrowDown size={16} color="#1d4ed8" />
                  <h3 style={{ margin:0, fontSize:"0.9375rem", fontWeight:600, color:"#111827" }}>Purchase Orders</h3>
                </div>
                <a href="/PurchaseOrders" style={{ fontSize:"0.8125rem", color:"#1d4ed8", textDecoration:"none" }}>View all</a>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                {[
                  { label:"Open",     value:poSummary.openOrders,       cls:"ent-badge-blue"   },
                  { label:"Pending",  value:poSummary.pendingDeliveries, cls:"ent-badge-yellow" },
                  { label:"Received", value:poSummary.receivedOrders,   cls:"ent-badge-green"  },
                ].map(c => (
                  <div key={c.label} style={{ textAlign:"center", padding:"10px 8px", background:"#f9fafb", borderRadius:8, border:"1px solid #e5e7eb" }}>
                    <span className={`ent-badge ${c.cls}`} style={{ marginBottom:4 }}>{c.value}</span>
                    <div style={{ fontSize:"0.75rem", color:"#6b7280", marginTop:4 }}>{c.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {expiry && (
            <div className="ent-card" style={{ padding: "20px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <CalendarEvent size={16} color={expiry.expiredCount > 0 || expiry.within7Count > 0 ? "#dc2626" : "#1d4ed8"} />
                  <h3 style={{ margin:0, fontSize:"0.9375rem", fontWeight:600, color:"#111827" }}>Batch Expiry</h3>
                </div>
                <a href="/Batches" style={{ fontSize:"0.8125rem", color:"#1d4ed8", textDecoration:"none" }}>View all</a>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                {[
                  { label:"Expired",    value:expiry.expiredCount,   cls: expiry.expiredCount > 0  ? "ent-badge-red"    : "ent-badge-gray" },
                  { label:"Within 7d",  value:expiry.within7Count,   cls: expiry.within7Count > 0  ? "ent-badge-red"    : "ent-badge-gray" },
                  { label:"Within 30d", value:expiry.within30Count,  cls: expiry.within30Count > 0 ? "ent-badge-yellow" : "ent-badge-gray" },
                ].map(c => (
                  <div key={c.label} style={{ textAlign:"center", padding:"10px 8px", background:"#f9fafb", borderRadius:8, border:"1px solid #e5e7eb" }}>
                    <span className={`ent-badge ${c.cls}`} style={{ marginBottom:4 }}>{c.value}</span>
                    <div style={{ fontSize:"0.75rem", color:"#6b7280", marginTop:4 }}>{c.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent transactions */}
      <div className="ent-table-wrap">
        <div className="ent-table-toolbar" style={{ justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Recent Transactions</span>
          <button className="ent-btn ent-btn-ghost ent-btn-sm" onClick={() => navigate("/Transactions")}>
            View all
          </button>
        </div>
        {loading ? (
          <div style={{ padding: 20 }}>
            {[...Array(4)].map((_, i) => <div key={i} className="ent-skeleton" style={{ height: 36, marginBottom: 8 }} />)}
          </div>
        ) : (
          <div className="ent-table-scroll">
            <table className="ent-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Product ID</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTxns.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: 32 }}>No transactions yet</td></tr>
                ) : recentTxns.map((t) => (
                  <tr key={t.transactionId}>
                    <td className="primary">{t.transactionId}</td>
                    <td>{t.productId}</td>
                    <td>
                      <span className={`ent-badge ${t.transactionType === "issue" ? "ent-badge-yellow" : "ent-badge-green"}`}>
                        {t.transactionType === "issue" ? "OUT" : "IN"}
                      </span>
                    </td>
                    <td>{t.quantity}</td>
                    <td className="primary">₹{t.transactionValue}</td>
                    <td>{new Date(t.transactionDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Low stock alerts */}
      {!loading && inv && inv.criticalItems.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div className="ent-alert ent-alert-error">
            <ExclamationTriangle size={15} />
            <span><strong>{inv.criticalItems.length} critical items</strong> need immediate restocking: </span>
            <span>{inv.criticalItems.map(p => p.productName).join(", ")}</span>
          </div>
        </div>
      )}
    </AppShell>
  );
}
