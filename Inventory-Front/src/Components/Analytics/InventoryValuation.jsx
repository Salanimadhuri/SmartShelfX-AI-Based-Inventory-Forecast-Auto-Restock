import React, { useEffect, useState } from "react";
import AppShell from "../UI/AppShell";
import { getValuation } from "../../Services/AnalyticsService";
import { exportProducts } from "../../Services/ImportExportService";
import { CurrencyDollar, BoxSeam, Download, Truck } from "react-bootstrap-icons";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import "../UI/EnterpriseStyles.css";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function InventoryValuation() {
  const role     = localStorage.getItem("loggedInRole") || "Admin";
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    getValuation().then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = data?.allProducts?.filter(p =>
    !search || p.productName?.toLowerCase().includes(search.toLowerCase()) ||
               p.productId?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const supplierLabels  = data ? Object.keys(data.valueBySupplier) : [];
  const supplierValues  = data ? Object.values(data.valueBySupplier) : [];
  const chartData = {
    labels: supplierLabels,
    datasets: [{ label:"Inventory Value (₹)", data: supplierValues, backgroundColor:"#1d4ed8", borderRadius:4 }],
  };
  const chartOpts = {
    responsive:true,
    plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label: ctx => `₹${ctx.parsed.y.toLocaleString()}` } } },
    scales:{ x:{ grid:{ display:false }, ticks:{ color:"#6b7280" } }, y:{ grid:{ color:"#f3f4f6" }, ticks:{ color:"#6b7280", callback: v => `₹${v.toLocaleString()}` } } },
  };

  return (
    <AppShell role={role} breadcrumb={[
      { label:"Dashboard", href: role==="Manager"?"/ManagerMenu":"/AdminMenu" },
      { label:"Inventory Valuation" }
    ]}>
      <div className="ent-page-header">
        <div>
          <h2 className="ent-page-title">Inventory Valuation Report</h2>
          <p className="ent-page-subtitle">Total value of stock on hand at purchase cost</p>
        </div>
        <button className="ent-btn ent-btn-secondary" onClick={exportProducts}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:"64px 0" }}>
          <div className="ent-spinner" style={{ margin:"0 auto 12px" }} /><p style={{ color:"#9ca3af" }}>Calculating valuation…</p>
        </div>
      ) : data ? (
        <>
          {/* KPI strip */}
          <div className="ent-grid-3" style={{ marginBottom:20 }}>
            <div className="ent-stat-card">
              <div style={{ width:36, height:36, borderRadius:8, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center", color:"#1d4ed8", marginBottom:12 }}>
                <CurrencyDollar size={18} />
              </div>
              <div style={{ fontSize:"1.5rem", fontWeight:700, color:"#111827", marginBottom:4 }}>
                ₹{data.totalInventoryValue?.toLocaleString(undefined, { maximumFractionDigits:2 })}
              </div>
              <div style={{ fontSize:"0.8125rem", color:"#4b5563" }}>Total Inventory Value</div>
            </div>
            <div className="ent-stat-card">
              <div style={{ width:36, height:36, borderRadius:8, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center", color:"#1d4ed8", marginBottom:12 }}>
                <BoxSeam size={18} />
              </div>
              <div style={{ fontSize:"1.5rem", fontWeight:700, color:"#111827", marginBottom:4 }}>{data.totalProducts}</div>
              <div style={{ fontSize:"0.8125rem", color:"#4b5563" }}>Products Tracked</div>
            </div>
            <div className="ent-stat-card">
              <div style={{ width:36, height:36, borderRadius:8, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center", color:"#1d4ed8", marginBottom:12 }}>
                <Truck size={18} />
              </div>
              <div style={{ fontSize:"1.5rem", fontWeight:700, color:"#111827", marginBottom:4 }}>{supplierLabels.length}</div>
              <div style={{ fontSize:"0.8125rem", color:"#4b5563" }}>Suppliers</div>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:16, marginBottom:20 }}>
            {/* Top / Bottom products */}
            <div className="ent-card" style={{ padding:20 }}>
              <h3 style={{ fontSize:"0.9375rem", fontWeight:600, color:"#111827", marginBottom:14 }}>Highest Value Products</h3>
              {data.topProducts?.map((p, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #f3f4f6" }}>
                  <div>
                    <div style={{ fontWeight:500, color:"#111827", fontSize:"0.875rem" }}>{p.productName}</div>
                    <div style={{ fontSize:"0.75rem", color:"#9ca3af" }}>{p.productId} · {p.stock} units × ₹{p.purchasePrice}</div>
                  </div>
                  <span style={{ fontWeight:700, color:"#1d4ed8" }}>₹{p.inventoryValue?.toLocaleString(undefined, { maximumFractionDigits:2 })}</span>
                </div>
              ))}
            </div>

            {/* Value by supplier chart */}
            <div className="ent-card" style={{ padding:20 }}>
              <h3 style={{ fontSize:"0.9375rem", fontWeight:600, color:"#111827", marginBottom:14 }}>Value by Supplier</h3>
              {supplierLabels.length > 0 ? <Bar data={chartData} options={chartOpts} /> : <p style={{ color:"#9ca3af", fontSize:"0.875rem" }}>No supplier data</p>}
            </div>
          </div>

          {/* Full table */}
          <div className="ent-table-wrap">
            <div className="ent-table-toolbar">
              <div className="ent-search-wrap">
                <span className="ent-search-icon" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
                  <BoxSeam size={13} />
                </span>
                <input className="ent-search" placeholder="Filter products…" value={search}
                  onChange={e => setSearch(e.target.value)} />
              </div>
              <span style={{ fontSize:"0.8125rem", color:"#9ca3af" }}>{filtered.length} products</span>
            </div>
            <div className="ent-table-scroll">
              <table className="ent-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Stock (units)</th>
                    <th>Purchase Price</th>
                    <th>Inventory Value</th>
                    <th>Supplier</th>
                    <th>% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => {
                    const pct = data.totalInventoryValue > 0 ? ((p.inventoryValue / data.totalInventoryValue) * 100).toFixed(1) : 0;
                    return (
                      <tr key={i}>
                        <td>
                          <div className="primary" style={{ fontWeight:500 }}>{p.productName}</div>
                          <div style={{ fontSize:"0.75rem", color:"#9ca3af" }}>{p.productId}</div>
                        </td>
                        <td><code style={{ background:"#f3f4f6", border:"1px solid #e5e7eb", borderRadius:4, padding:"2px 6px", fontSize:"0.78rem" }}>{p.sku}</code></td>
                        <td style={{ fontWeight:600 }}>{p.stock}</td>
                        <td>₹{p.purchasePrice}</td>
                        <td style={{ fontWeight:700, color:"#111827" }}>₹{p.inventoryValue?.toLocaleString(undefined, { maximumFractionDigits:2 })}</td>
                        <td style={{ color:"#4b5563" }}>{p.vendorId || "—"}</td>
                        <td>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <div style={{ width:48, height:5, background:"#f3f4f6", borderRadius:999, overflow:"hidden" }}>
                              <div style={{ width:`${Math.min(pct, 100)}%`, height:"100%", background:"#1d4ed8", borderRadius:999 }} />
                            </div>
                            <span style={{ fontSize:"0.8125rem", fontWeight:600 }}>{pct}%</span>
                          </div>
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
        <div className="ent-card"><div className="ent-empty"><div className="ent-empty-title">No data available</div></div></div>
      )}
      <style>{`@keyframes ent-spin{to{transform:rotate(360deg)}}.ent-spinner{width:32px;height:32px;border:2.5px solid #e5e7eb;border-top-color:#1d4ed8;border-radius:50%;animation:ent-spin .7s linear infinite}`}</style>
    </AppShell>
  );
}
