import React, { useEffect, useState, useMemo } from "react";
import AppShell from "../UI/AppShell";
import { getAbcAnalysis } from "../../Services/AnalyticsService";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Search } from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";
ChartJS.register(ArcElement, Tooltip, Legend);

const CLS_STYLE = {
  A: { cls:"ent-badge-green",  bg:"#dcfce7", border:"#bbf7d0", color:"#16a34a" },
  B: { cls:"ent-badge-blue",   bg:"#dbeafe", border:"#bfdbfe", color:"#1d4ed8" },
  C: { cls:"ent-badge-gray",   bg:"#f3f4f6", border:"#e5e7eb", color:"#6b7280" },
};

export default function AbcAnalysis() {
  const role     = localStorage.getItem("loggedInRole") || "Admin";
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("ALL");

  useEffect(() => {
    getAbcAnalysis().then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!data?.products) return [];
    let d = data.products;
    if (filter !== "ALL") d = d.filter(p => p.abcClass === filter);
    if (search) d = d.filter(p =>
      p.productName?.toLowerCase().includes(search.toLowerCase()) ||
      p.productId?.toLowerCase().includes(search.toLowerCase())
    );
    return d;
  }, [data, filter, search]);

  const donutData = data ? {
    labels: ["Class A (High Revenue)", "Class B (Medium)", "Class C (Low)"],
    datasets: [{ data: [data.countA, data.countB, data.countC], backgroundColor:["#16a34a","#1d4ed8","#9ca3af"], borderWidth:0, hoverOffset:4 }],
  } : null;

  return (
    <AppShell role={role} breadcrumb={[
      { label:"Dashboard", href: role==="Manager"?"/ManagerMenu":"/AdminMenu" },
      { label:"ABC Analysis" }
    ]}>
      <div className="ent-page-header">
        <div>
          <h2 className="ent-page-title">ABC Analysis</h2>
          <p className="ent-page-subtitle">Revenue-based product classification — A: high value, B: medium, C: low</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:"64px 0" }}>
          <div className="ent-spinner" style={{ margin:"0 auto 12px" }} />
          <p style={{ color:"#9ca3af" }}>Running ABC analysis…</p>
        </div>
      ) : data ? (
        <>
          {/* Summary cards */}
          <div className="ent-grid-3" style={{ marginBottom:20 }}>
            {[
              { cls:"A", count:data.countA, label:"Class A Products", desc:"Top ~70% of revenue", pct: data.totalProducts > 0 ? ((data.countA/data.totalProducts)*100).toFixed(0) : 0 },
              { cls:"B", count:data.countB, label:"Class B Products", desc:"Next ~20% of revenue", pct: data.totalProducts > 0 ? ((data.countB/data.totalProducts)*100).toFixed(0) : 0 },
              { cls:"C", count:data.countC, label:"Class C Products", desc:"Remaining ~10% of revenue", pct: data.totalProducts > 0 ? ((data.countC/data.totalProducts)*100).toFixed(0) : 0 },
            ].map(c => {
              const s = CLS_STYLE[c.cls];
              return (
                <div key={c.cls} className="ent-stat-card" style={{ borderLeft:`4px solid ${s.color}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <span style={{ fontSize:"1.5rem", fontWeight:800, color:s.color }}>Class {c.cls}</span>
                    <span className={`ent-badge ${s.cls}`}>{c.pct}% of products</span>
                  </div>
                  <div style={{ fontSize:"2rem", fontWeight:700, color:"#111827", marginBottom:4 }}>{c.count}</div>
                  <div style={{ fontSize:"0.8125rem", fontWeight:500, color:"#4b5563", marginBottom:2 }}>{c.label}</div>
                  <div style={{ fontSize:"0.75rem", color:"#9ca3af" }}>{c.desc}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:16, marginBottom:20 }}>
            {/* Legend / insights */}
            <div className="ent-card" style={{ padding:20 }}>
              <h3 style={{ fontSize:"0.9375rem", fontWeight:600, color:"#111827", marginBottom:14 }}>What This Means</h3>
              {[
                { cls:"A", label:"Prioritize — critical stock", detail:`${data.countA} products generate ~70% of revenue. Keep high stock levels, frequent reorders, and close monitoring.` },
                { cls:"B", label:"Monitor regularly", detail:`${data.countB} products generate ~20% of revenue. Standard reorder policies. Review quarterly.` },
                { cls:"C", label:"Minimize investment", detail:`${data.countC} products generate ~10% of revenue. Consider reducing safety stock. Review for discontinuation.` },
              ].map(item => {
                const s = CLS_STYLE[item.cls];
                return (
                  <div key={item.cls} style={{ padding:"12px 14px", borderRadius:8, background:s.bg, border:`1px solid ${s.border}`, marginBottom:10 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                      <span style={{ fontWeight:700, color:s.color, fontSize:"0.875rem" }}>Class {item.cls} — {item.label}</span>
                    </div>
                    <p style={{ margin:0, fontSize:"0.8125rem", color:"#374151", lineHeight:1.55 }}>{item.detail}</p>
                  </div>
                );
              })}
              <div style={{ marginTop:12, padding:"10px 12px", background:"#f9fafb", borderRadius:8, border:"1px solid #e5e7eb", fontSize:"0.8125rem", color:"#4b5563" }}>
                <strong>Total Revenue Tracked:</strong> ₹{data.totalRevenue?.toLocaleString(undefined, { maximumFractionDigits:2 })}
              </div>
            </div>

            {/* Donut chart */}
            <div className="ent-card" style={{ padding:20, display:"flex", flexDirection:"column", alignItems:"center" }}>
              <h3 style={{ fontSize:"0.9375rem", fontWeight:600, color:"#111827", marginBottom:14, alignSelf:"flex-start" }}>Distribution</h3>
              {donutData && <Doughnut data={donutData} options={{ plugins:{ legend:{ position:"bottom", labels:{ font:{ size:12 }, color:"#4b5563" } } } }} />}
            </div>
          </div>

          {/* Product table */}
          <div className="ent-table-wrap">
            <div className="ent-table-toolbar">
              <div className="ent-search-wrap">
                <span className="ent-search-icon" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
                  <Search size={13} />
                </span>
                <input className="ent-search" placeholder="Search products…" value={search}
                  onChange={e => { setSearch(e.target.value); }} />
              </div>
              <div style={{ display:"flex", gap:6 }}>
                {["ALL","A","B","C"].map(f => (
                  <button key={f} className={`ent-btn ent-btn-sm ${filter===f?"ent-btn-primary":"ent-btn-secondary"}`}
                    onClick={() => setFilter(f)}>{f === "ALL" ? "All" : `Class ${f}`}</button>
                ))}
              </div>
              <span style={{ fontSize:"0.8125rem", color:"#9ca3af" }}>{filtered.length} products</span>
            </div>
            <div className="ent-table-scroll">
              <table className="ent-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Product</th>
                    <th>Supplier</th>
                    <th>Revenue</th>
                    <th>Revenue %</th>
                    <th>Cumulative %</th>
                    <th>Class</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => {
                    const s = CLS_STYLE[p.abcClass] || CLS_STYLE.C;
                    return (
                      <tr key={i}>
                        <td style={{ color:"#9ca3af", fontWeight:500 }}>#{i+1}</td>
                        <td>
                          <div className="primary" style={{ fontWeight:500 }}>{p.productName}</div>
                          <div style={{ fontSize:"0.75rem", color:"#9ca3af" }}>{p.productId}</div>
                        </td>
                        <td style={{ color:"#4b5563" }}>{p.vendorId || "—"}</td>
                        <td style={{ fontWeight:600, color:"#111827" }}>₹{p.revenue?.toLocaleString(undefined, { maximumFractionDigits:2 })}</td>
                        <td>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <div style={{ width:52, height:5, background:"#f3f4f6", borderRadius:999, overflow:"hidden" }}>
                              <div style={{ width:`${Math.min(p.revenuePercent, 100)}%`, height:"100%", background:s.color, borderRadius:999 }} />
                            </div>
                            <span style={{ fontSize:"0.8125rem", fontWeight:600 }}>{p.revenuePercent}%</span>
                          </div>
                        </td>
                        <td style={{ color:"#4b5563" }}>{p.cumulativePercent}%</td>
                        <td>
                          <span className={`ent-badge ${s.cls}`} style={{ fontWeight:700 }}>Class {p.abcClass}</span>
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
            <div className="ent-empty-title">No transaction data available</div>
            <div className="ent-empty-text">Make some issue transactions first to generate ABC analysis.</div>
          </div>
        </div>
      )}
      <style>{`@keyframes ent-spin{to{transform:rotate(360deg)}}.ent-spinner{width:32px;height:32px;border:2.5px solid #e5e7eb;border-top-color:#1d4ed8;border-radius:50%;animation:ent-spin .7s linear infinite}`}</style>
    </AppShell>
  );
}
