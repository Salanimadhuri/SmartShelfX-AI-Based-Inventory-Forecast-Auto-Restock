import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSalesInsights } from "../../Services/AIService";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, BarElement, CategoryScale,
  LinearScale, Tooltip, Legend,
} from "chart.js";
import AppShell from "../UI/AppShell";
import { BarChartLine, Star, ArrowDownUp, CurrencyDollar } from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";
import API_BASE from "../../Services/config";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AllProductAnalysis = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/inventory/analysis`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = Object.entries(data).map(([productName, totalSalesValue]) => ({
          productName,
          totalSalesValue,
        }));
        setInsights(getSalesInsights(formatted));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const role = localStorage.getItem("loggedInRole");
  const returnPath = role === "Manager" ? "/ManagerMenu" : "/AdminMenu";

  const chartData = insights ? {
    labels: insights.sorted.map(p => p.productName),
    datasets: [{
      label: "Sales Value (₹)",
      data: insights.sorted.map(p => p.totalSalesValue),
      backgroundColor: insights.sorted.map((_, i) =>
        i === 0 ? "#1d4ed8" : i === insights.sorted.length - 1 ? "#f87171" : "#93c5fd"
      ),
      borderRadius: 4,
      borderSkipped: false,
    }],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx) => `₹${ctx.parsed.y.toLocaleString()}` },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { size: 12 } },
      },
      y: {
        grid: { color: "#f3f4f6" },
        ticks: { color: "#6b7280", callback: (v) => `₹${v.toLocaleString()}` },
      },
    },
  };

  return (
    <AppShell
      role={role || "Admin"}
      breadcrumb={[
        { label: "Dashboard", href: returnPath },
        { label: "Sales Analysis" },
      ]}
    >
      <div className="ent-page-header">
        <div>
          <h2 className="ent-page-title">Sales Analysis</h2>
          <p className="ent-page-subtitle">Product-wise revenue breakdown and performance ranking</p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
          {[...Array(4)].map((_, i) => <div key={i} className="ent-skeleton" style={{ height: 90 }} />)}
        </div>
      ) : insights ? (
        <>
          {/* KPI cards */}
          <div className="ent-grid-4" style={{ marginBottom: 24 }}>
            {[
              { icon: <CurrencyDollar size={18} />, label: "Total Revenue",    value: `₹${parseFloat(insights.totalRevenue).toLocaleString()}` },
              { icon: <Star         size={18} />, label: "Top Product",      value: insights.topSeller?.productName || "—" },
              { icon: <ArrowDownUp    size={18} />, label: "Lowest Product",   value: insights.bottomSeller?.productName || "—" },
              { icon: <BarChartLine   size={18} />, label: "Avg Revenue",      value: `₹${parseFloat(insights.avgSales).toLocaleString()}` },
            ].map((c, i) => (
              <div key={i} className="ent-stat-card">
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: "#eff6ff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#1d4ed8", marginBottom: 10,
                }}>
                  {c.icon}
                </div>
                <div style={{ fontWeight: 700, color: "#111827", fontSize: "1.05rem", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.value}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>{c.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16, marginBottom: 24 }}>
            {/* Chart */}
            <div className="ent-card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827", marginBottom: 16 }}>
                Revenue by Product
              </h3>
              {chartData && <Bar data={chartData} options={chartOptions} />}
            </div>

            {/* Insight box */}
            <div className="ent-card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827", marginBottom: 14 }}>
                Key Insights
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ padding: "12px", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#16a34a", marginBottom: 3 }}>Top performer</div>
                  <div style={{ fontWeight: 600, color: "#111827" }}>{insights.topSeller?.productName}</div>
                  <div style={{ fontSize: "0.8125rem", color: "#6b7280" }}>
                    ₹{insights.topSeller?.totalSalesValue?.toFixed(2)} · {insights.topShare}% of total
                  </div>
                </div>
                <div style={{ padding: "12px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#dc2626", marginBottom: 3 }}>Needs attention</div>
                  <div style={{ fontWeight: 600, color: "#111827" }}>{insights.bottomSeller?.productName}</div>
                  <div style={{ fontSize: "0.8125rem", color: "#6b7280" }}>
                    ₹{insights.bottomSeller?.totalSalesValue?.toFixed(2)} · lowest sales
                  </div>
                </div>
                <div style={{ padding: "12px", background: "#eff6ff", borderRadius: 8, border: "1px solid #bfdbfe" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#1d4ed8", marginBottom: 3 }}>Distribution</div>
                  <div style={{ fontSize: "0.8125rem", color: "#374151" }}>
                    {insights.aboveAvgCount} products above average · {insights.belowAvgCount} below
                  </div>
                  {insights.isConcentrated && (
                    <div style={{ fontSize: "0.78rem", color: "#d97706", marginTop: 4 }}>
                      Revenue concentrated — consider diversifying
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ranking table */}
          <div className="ent-table-wrap">
            <div className="ent-table-toolbar">
              <span style={{ fontWeight: 600, color: "#111827", fontSize: "0.9375rem" }}>Product Rankings</span>
              <span style={{ fontSize: "0.8125rem", color: "#9ca3af" }}>{insights.sorted.length} products</span>
            </div>
            <div className="ent-table-scroll">
              <table className="ent-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Product</th>
                    <th>Sales Value</th>
                    <th>Share</th>
                    <th>vs. Average</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {insights.sorted.map((p, i) => {
                    const share = ((p.totalSalesValue / parseFloat(insights.totalRevenue)) * 100).toFixed(1);
                    const vsAvg = p.totalSalesValue >= parseFloat(insights.avgSales);
                    const isTop = i === 0;
                    const isBot = i === insights.sorted.length - 1;
                    return (
                      <tr key={i}>
                        <td style={{ fontWeight: 700, color: isTop ? "#d97706" : "#9ca3af" }}>
                          {i === 0 ? "#1" : i === 1 ? "#2" : i === 2 ? "#3" : `#${i + 1}`}
                        </td>
                        <td className="primary">{p.productName}</td>
                        <td style={{ fontWeight: 600, color: "#111827" }}>₹{p.totalSalesValue.toFixed(2)}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{
                              width: 52, height: 5, background: "#f3f4f6", borderRadius: 999, overflow: "hidden",
                            }}>
                              <div style={{
                                width: `${share}%`, height: "100%", borderRadius: 999,
                                background: isTop ? "#16a34a" : isBot ? "#dc2626" : "#1d4ed8",
                              }} />
                            </div>
                            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#374151" }}>{share}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`ent-badge ${vsAvg ? "ent-badge-green" : "ent-badge-red"}`}>
                            {vsAvg ? "Above avg" : "Below avg"}
                          </span>
                        </td>
                        <td>
                          {isTop ? <span className="ent-badge ent-badge-blue">Top Seller</span>
                           : isBot ? <span className="ent-badge ent-badge-yellow">Needs Boost</span>
                           : <span className="ent-badge ent-badge-gray">Active</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="ent-card">
          <div className="ent-empty">
            <BarChartLine size={32} className="ent-empty-icon" />
            <div className="ent-empty-title">No sales data available</div>
            <div className="ent-empty-text">Make some transactions to see analysis here.</div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default AllProductAnalysis;
