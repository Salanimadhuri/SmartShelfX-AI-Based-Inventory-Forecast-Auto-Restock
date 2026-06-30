import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, CategoryScale,
  LinearScale, PointElement, Tooltip, Legend, Filler,
} from "chart.js";
import { getAllProducts } from "../../Services/ProductService";
import { getDemandByProduct } from "../../Services/TransactionService";
import { getProductDemandInsights } from "../../Services/AIService";
import AppShell from "../UI/AppShell";
import { GraphUp, ExclamationCircle } from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const SingleProductDemand = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [demandData, setDemandData] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState("");

  const role = localStorage.getItem("loggedInRole");
  const returnPath = role === "Manager" ? "/ManagerMenu" : "/AdminMenu";

  useEffect(() => {
    getAllProducts()
      .then((r) => setProducts(r.data))
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoadingProducts(false));
  }, []);

  const handleProductChange = async (e) => {
    const id = e.target.value;
    const name = products.find((p) => p.productId === id)?.productName || "";
    setSelectedProduct(id);
    setSelectedName(name);
    setInsights(null);
    setDemandData([]);
    setError("");
    if (!id) return;
    setLoading(true);
    try {
      const r = await getDemandByProduct(id);
      const data = r.data;
      setDemandData(data);
      setInsights(getProductDemandInsights(name, data));
    } catch {
      setError("Failed to load demand data for this product.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: demandData.map((_, i) => `T${i + 1}`),
    datasets: [{
      label: "Demand (Qty)",
      data: demandData,
      borderColor: "#1d4ed8",
      backgroundColor: "rgba(29,78,216,0.06)",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: "#1d4ed8",
      borderWidth: 2,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#4b5563", font: { size: 12 } } },
      tooltip: { callbacks: { label: (ctx) => `Qty: ${ctx.parsed.y}` } },
    },
    scales: {
      x: { ticks: { color: "#9ca3af" }, grid: { display: false } },
      y: { ticks: { color: "#9ca3af" }, grid: { color: "#f3f4f6" } },
    },
  };

  const trendColor = insights?.trend === "increasing" ? "#16a34a"
    : insights?.trend === "decreasing" ? "#dc2626" : "#d97706";

  return (
    <AppShell
      role={role || "Admin"}
      breadcrumb={[{ label: "Dashboard", href: returnPath }, { label: "Demand Forecast" }]}
    >
      <div className="ent-page-header">
        <div>
          <h2 className="ent-page-title">Demand Forecast</h2>
          <p className="ent-page-subtitle">Analyze per-product demand trends and restock recommendations</p>
        </div>
      </div>

      {/* Product selector */}
      <div className="ent-card" style={{ padding: "16px 20px", marginBottom: 20 }}>
        <div className="ent-field" style={{ marginBottom: 0 }}>
          <label className="ent-label" htmlFor="product-select">Select product to analyze</label>
          {loadingProducts ? (
            <div className="ent-skeleton" style={{ height: 36 }} />
          ) : (
            <select id="product-select" value={selectedProduct} onChange={handleProductChange}
              className="ent-input" style={{ maxWidth: 360 }}>
              <option value="">Choose a product…</option>
              {products.map((p) => (
                <option key={p.productId} value={p.productId}>{p.productName}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {error && (
        <div className="ent-alert ent-alert-error">
          <ExclamationCircle size={15} /> {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <div className="ent-spinner" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>Analyzing demand data…</p>
        </div>
      )}

      {!loading && !selectedProduct && !error && (
        <div className="ent-card">
          <div className="ent-empty">
            <GraphUp size={32} style={{ color: "#d1d5db", marginBottom: 10 }} />
            <div className="ent-empty-title">Select a product</div>
            <div className="ent-empty-text">Choose a product above to see demand insights and forecasts.</div>
          </div>
        </div>
      )}

      {!loading && insights && (
        <>
          {/* Metrics */}
          <div className="ent-grid-3" style={{ marginBottom: 20 }}>
            {[
              {
                label: "Demand Trend",
                value: `${insights.trend === "increasing" ? "▲" : insights.trend === "decreasing" ? "▼" : "►"} ${insights.trendPct}%`,
                sub: insights.trend,
                color: trendColor,
              },
              {
                label: "Next Period Forecast",
                value: `${insights.forecastNext} units`,
                sub: "AI linear projection",
                color: "#1d4ed8",
              },
              {
                label: "7-Day Forecast",
                value: `${insights.forecastWeek} units`,
                sub: "Projected weekly demand",
                color: "#1d4ed8",
              },
              {
                label: "Avg Demand",
                value: `${insights.avg} units`,
                sub: `Range: ${insights.min}–${insights.max}`,
                color: "#374151",
              },
              {
                label: "Stock Coverage",
                value: `~${insights.daysOfStock} days`,
                sub: insights.daysOfStock < 7 ? "Restock soon!" : "Adequate",
                color: insights.daysOfStock < 7 ? "#dc2626" : "#16a34a",
              },
              {
                label: "Demand Volatility",
                value: `${insights.volatility}%`,
                sub: insights.isVolatile ? "High — buffer stock recommended" : "Low — predictable",
                color: insights.isVolatile ? "#d97706" : "#16a34a",
              },
            ].map((m, i) => (
              <div key={i} className="ent-stat-card" style={{ padding: "16px" }}>
                <div style={{ fontSize: "1.125rem", fontWeight: 700, color: m.color, marginBottom: 4 }}>{m.value}</div>
                <div style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#111827", marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div style={{ marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{
              padding: "14px 16px", borderRadius: 10,
              background: insights.daysOfStock < 7 ? "#fef2f2" : "#f0fdf4",
              border: `1px solid ${insights.daysOfStock < 7 ? "#fecaca" : "#bbf7d0"}`,
            }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: insights.daysOfStock < 7 ? "#dc2626" : "#16a34a", marginBottom: 5 }}>
                Restock Recommendation
              </div>
              <p style={{ fontSize: "0.875rem", color: "#374151", margin: 0, lineHeight: 1.55 }}>
                {insights.daysOfStock < 7
                  ? `Restock "${insights.productName}" within ${insights.daysOfStock} days — demand rate is high.`
                  : `"${insights.productName}" has ~${insights.daysOfStock} days of coverage. Monitor and reorder as needed.`}
              </p>
            </div>
            <div style={{
              padding: "14px 16px", borderRadius: 10,
              background: "#eff6ff", border: "1px solid #bfdbfe",
            }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#1d4ed8", marginBottom: 5 }}>Monthly Projection</div>
              <p style={{ fontSize: "0.875rem", color: "#374151", margin: 0, lineHeight: 1.55 }}>
                Estimated 30-day demand: ~{Math.round(insights.forecastWeek * 4.3)} units.{" "}
                {insights.trend === "increasing" ? "Plan for higher procurement."
                  : insights.trend === "decreasing" ? "Consider reducing order quantities."
                  : "Maintain current procurement cadence."}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="ent-card" style={{ padding: "20px" }}>
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#111827", marginBottom: 16 }}>
              Historical Demand — {selectedName}
            </h3>
            {demandData.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <p style={{ color: "#9ca3af", textAlign: "center", padding: "24px 0" }}>No historical data available.</p>
            )}
          </div>
        </>
      )}

      {!loading && selectedProduct && demandData.length === 0 && !error && (
        <div className="ent-card">
          <div className="ent-empty">
            <div className="ent-empty-title">No demand data</div>
            <div className="ent-empty-text">No transactions found for <strong>{selectedName}</strong>. Make some transactions first.</div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default SingleProductDemand;
