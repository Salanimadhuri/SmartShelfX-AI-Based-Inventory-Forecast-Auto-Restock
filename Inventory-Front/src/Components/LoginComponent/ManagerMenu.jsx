import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../UI/AppShell";
import { getAllProducts } from "../../Services/ProductService";
import { getAllTransactions } from "../../Services/TransactionService";
import { getInventoryInsights, getTransactionInsights } from "../../Services/AIService";
import {
  ExclamationTriangle, ArrowUpCircle, ArrowDownCircle, Activity,
} from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

export default function ManagerMenu() {
  const navigate = useNavigate();
  const [inv, setInv] = useState(null);
  const [txn, setTxn] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllProducts(), getAllTransactions()])
      .then(([p, t]) => {
        setInv(getInventoryInsights(p.data));
        setTxn(getTransactionInsights(t.data));
        setTransactions(t.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const storedUser = localStorage.getItem("loggedInUser");
  const username = storedUser ? JSON.parse(storedUser).username : "Manager";
  const recentTxns = [...transactions].reverse().slice(0, 5);

  return (
    <AppShell role="Manager" breadcrumb={[{ label: "Dashboard" }]}>
      {/* Welcome */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: 4 }}>
          Good day, {username}
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
          Manage inventory movements and monitor stock levels.
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
          {[
            { icon: <Activity size={18} />, label: "Inventory Health", value: inv ? `${inv.healthScore}%` : "—", sub: "Overall score" },
            { icon: <ExclamationTriangle size={18} />, label: "Low Stock", value: inv?.lowStockCount ?? 0, sub: `${inv?.criticalCount ?? 0} critical` },
            { icon: <ArrowUpCircle size={18} />, label: "Items Issued", value: txn?.issueCount ?? 0, sub: "Total outflows" },
            { icon: <ArrowDownCircle size={18} />, label: "Items Purchased", value: txn?.purchaseCount ?? 0, sub: "Total inflows" },
          ].map((c, i) => (
            <div key={i} className="ent-stat-card ent-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, background: "#eff6ff",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#1d4ed8", marginBottom: 12,
              }}>
                {c.icon}
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", lineHeight: 1, marginBottom: 4 }}>{c.value}</div>
              <div style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#4b5563", marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{c.sub}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, marginBottom: 24 }}>
        {/* Recent transactions */}
        <div className="ent-table-wrap">
          <div className="ent-table-toolbar" style={{ justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827" }}>Recent Transactions</span>
            <button className="ent-btn ent-btn-ghost ent-btn-sm" onClick={() => navigate("/Transactions")}>View all</button>
          </div>
          {loading ? (
            <div style={{ padding: 16 }}>
              {[...Array(4)].map((_, i) => <div key={i} className="ent-skeleton" style={{ height: 36, marginBottom: 8 }} />)}
            </div>
          ) : (
            <div className="ent-table-scroll">
              <table className="ent-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Qty</th>
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

        {/* Quick actions */}
        <div className="ent-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827", marginBottom: 14 }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "Product List",     href: "/MngProdRepo" },
              { label: "Issue History",    href: "/Transactions?type=issue" },
              { label: "Purchase History", href: "/Transactions?type=purchase" },
              { label: "All Transactions", href: "/Transactions" },
            ].map((a) => (
              <a key={a.href} href={a.href}
                className="ent-btn ent-btn-secondary"
                style={{ textDecoration: "none", justifyContent: "flex-start" }}>
                {a.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {!loading && inv && inv.criticalItems.length > 0 && (
        <div className="ent-alert ent-alert-error">
          <ExclamationTriangle size={15} />
          <span><strong>{inv.criticalItems.length} critical items</strong> need restocking: </span>
          <span>{inv.criticalItems.map(p => p.productName).join(", ")}</span>
        </div>
      )}
    </AppShell>
  );
}
