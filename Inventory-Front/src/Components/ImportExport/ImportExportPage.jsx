import React, { useState, useRef } from "react";
import AppShell from "../UI/AppShell";
import { exportProducts, exportTransactions, downloadTemplate, previewImport, commitImport } from "../../Services/ImportExportService";
import { Download, Upload, FileEarmarkArrowUp, CheckCircle, ExclamationCircle, FileEarmarkSpreadsheet } from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

export default function ImportExportPage() {
  const role     = localStorage.getItem("loggedInRole") || "Admin";
  const fileRef  = useRef(null);
  const [tab,         setTab]         = useState("export");
  const [preview,     setPreview]     = useState(null);
  const [importing,   setImporting]   = useState(false);
  const [committed,   setCommitted]   = useState(null);
  const [importError, setImportError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(null); setCommitted(null); setImportError("");
    try {
      const r = await previewImport(file);
      setPreview(r.data);
    } catch {
      setImportError("Failed to parse file. Ensure it is a valid CSV.");
    }
  };

  const handleCommit = async () => {
    if (!selectedFile || !preview?.validRows) return;
    setImporting(true);
    try {
      const r = await commitImport(selectedFile);
      setCommitted(r.data);
      setPreview(null);
    } catch {
      setImportError("Import failed. Please try again.");
    } finally {
      setImporting(false);
    }
  };

  const Section = ({ icon, title, desc, action, actionLabel, variant="secondary" }) => (
    <div className="ent-card" style={{ padding:20, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:40, height:40, borderRadius:10, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center", color:"#1d4ed8", flexShrink:0 }}>
          {icon}
        </div>
        <div>
          <div style={{ fontWeight:600, color:"#111827", fontSize:"0.9375rem" }}>{title}</div>
          <div style={{ color:"#6b7280", fontSize:"0.8125rem", marginTop:2 }}>{desc}</div>
        </div>
      </div>
      <button className={`ent-btn ent-btn-${variant}`} onClick={action}>
        {variant === "primary" ? <Upload size={15} /> : <Download size={15} />} {actionLabel}
      </button>
    </div>
  );

  return (
    <AppShell role={role} breadcrumb={[
      { label:"Dashboard", href: role==="Manager"?"/ManagerMenu":"/AdminMenu" },
      { label:"Import / Export" }
    ]}>
      <div className="ent-page-header">
        <div>
          <h2 className="ent-page-title">Import &amp; Export</h2>
          <p className="ent-page-subtitle">Bulk import products via CSV or export data for analysis</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:20, borderBottom:"1px solid #e5e7eb", paddingBottom:0 }}>
        {[{ key:"export", label:"Export Data" }, { key:"import", label:"Import Data" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding:"9px 20px", background:"none", border:"none", cursor:"pointer",
            fontFamily:"inherit", fontSize:"0.9rem", fontWeight:500,
            color: tab===t.key ? "#1d4ed8" : "#6b7280",
            borderBottom: tab===t.key ? "2px solid #1d4ed8" : "2px solid transparent",
            marginBottom:-1,
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "export" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12, maxWidth:680 }}>
          <Section icon={<FileEarmarkSpreadsheet size={20} />}
            title="Export Products"
            desc="Download all product inventory as a CSV file with prices, stock levels, and supplier info."
            action={exportProducts} actionLabel="Download Products CSV" />
          <Section icon={<FileEarmarkSpreadsheet size={20} />}
            title="Export Transactions"
            desc="Download complete transaction history (issues and purchases) as CSV."
            action={exportTransactions} actionLabel="Download Transactions CSV" />
          <Section icon={<FileEarmarkArrowUp size={20} />}
            title="Sample Import Template"
            desc="Download a blank CSV template to use for bulk product imports."
            action={downloadTemplate} actionLabel="Download Template" />
        </div>
      )}

      {tab === "import" && (
        <div style={{ maxWidth:720 }}>
          {/* Step 1 – select file */}
          <div className="ent-card" style={{ padding:"24px", marginBottom:16 }}>
            <h3 style={{ fontSize:"0.9375rem", fontWeight:600, color:"#111827", marginBottom:6 }}>Step 1 — Select CSV File</h3>
            <p style={{ color:"#6b7280", fontSize:"0.8125rem", marginBottom:16 }}>
              Upload a CSV with columns: <code style={{ background:"#f3f4f6", padding:"1px 6px", borderRadius:4, fontSize:"0.78rem" }}>productName, sku, purchasePrice, stock, reorderLevel, vendorId</code>
            </p>
            <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
              <button className="ent-btn ent-btn-secondary" onClick={() => fileRef.current?.click()}>
                <Upload size={14} /> Choose File
              </button>
              <button className="ent-btn ent-btn-ghost ent-btn-sm" onClick={downloadTemplate}>
                <Download size={13} /> Get Template
              </button>
              {selectedFile && <span style={{ fontSize:"0.875rem", color:"#374151", fontWeight:500 }}>{selectedFile.name}</span>}
            </div>
            <input type="file" accept=".csv" ref={fileRef} style={{ display:"none" }} onChange={handleFileSelect} />
          </div>

          {importError && (
            <div className="ent-alert ent-alert-error"><ExclamationCircle size={14} />{importError}</div>
          )}

          {/* Step 2 – preview */}
          {preview && (
            <div className="ent-card" style={{ padding:"24px", marginBottom:16 }}>
              <h3 style={{ fontSize:"0.9375rem", fontWeight:600, color:"#111827", marginBottom:14 }}>Step 2 — Review Preview</h3>
              <div style={{ display:"flex", gap:12, marginBottom:16, flexWrap:"wrap" }}>
                {[
                  { label:"Total Rows", value:preview.totalRows, cls:"ent-badge-blue" },
                  { label:"Valid",      value:preview.validRows, cls:"ent-badge-green" },
                  { label:"Errors",     value:preview.errorRows, cls: preview.errorRows > 0 ? "ent-badge-red" : "ent-badge-gray" },
                ].map(c => (
                  <div key={c.label} style={{ display:"flex", alignItems:"center", gap:8, background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:"8px 14px", fontSize:"0.8125rem" }}>
                    <span className={`ent-badge ${c.cls}`}>{c.value}</span>
                    <span style={{ color:"#4b5563" }}>{c.label}</span>
                  </div>
                ))}
              </div>

              {preview.errors?.length > 0 && (
                <div className="ent-alert ent-alert-warning" style={{ flexDirection:"column", alignItems:"flex-start" }}>
                  <strong style={{ marginBottom:6 }}>Row Errors:</strong>
                  {preview.errors.map((e, i) => (
                    <div key={i} style={{ fontSize:"0.8125rem" }}>Row {e.row}: {e.messages?.join(", ")}</div>
                  ))}
                </div>
              )}

              <div className="ent-table-scroll" style={{ marginBottom:16 }}>
                <table className="ent-table">
                  <thead>
                    <tr>
                      <th>Row</th>
                      <th>Product Name</th>
                      <th>SKU</th>
                      <th>Purchase Price</th>
                      <th>Stock</th>
                      <th>Reorder Level</th>
                      <th>Vendor ID</th>
                      <th>Valid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows?.map(r => (
                      <tr key={r.row} style={{ background: r.valid ? undefined : "#fef2f2" }}>
                        <td style={{ color:"#9ca3af" }}>{r.row}</td>
                        <td className="primary">{r.productName || "—"}</td>
                        <td>{r.sku || "—"}</td>
                        <td>{r.purchasePrice}</td>
                        <td>{r.stock}</td>
                        <td>{r.reorderLevel}</td>
                        <td>{r.vendorId || "—"}</td>
                        <td>{r.valid
                          ? <span className="ent-badge ent-badge-green">OK</span>
                          : <span className="ent-badge ent-badge-red" title={r.errors?.join(", ")}>Error</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {preview.validRows > 0 && (
                <button className="ent-btn ent-btn-primary ent-btn-lg" onClick={handleCommit} disabled={importing}>
                  {importing ? "Importing…" : `Import ${preview.validRows} Valid Products`}
                </button>
              )}
            </div>
          )}

          {/* Step 3 – success */}
          {committed && (
            <div className="ent-card" style={{ padding:"24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <CheckCircle size={28} color="#16a34a" />
                <div>
                  <div style={{ fontWeight:700, color:"#111827", fontSize:"1rem" }}>Import Complete</div>
                  <div style={{ color:"#6b7280", fontSize:"0.875rem" }}>{committed.savedCount} products imported · {committed.skippedCount} skipped</div>
                </div>
              </div>
              {committed.skipped?.length > 0 && (
                <div style={{ background:"#fef9c3", border:"1px solid #fde68a", borderRadius:8, padding:"12px 14px", fontSize:"0.8125rem", color:"#713f12" }}>
                  <strong>Skipped rows:</strong>
                  <ul style={{ margin:"6px 0 0 16px", padding:0 }}>
                    {committed.skipped.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
              <button className="ent-btn ent-btn-secondary" style={{ marginTop:14 }}
                onClick={() => { setCommitted(null); setPreview(null); setSelectedFile(null); }}>
                Import Another File
              </button>
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes ent-spin{to{transform:rotate(360deg)}}.ent-spinner{width:32px;height:32px;border:2.5px solid #e5e7eb;border-top-color:#1d4ed8;border-radius:50%;animation:ent-spin .7s linear infinite}`}</style>
    </AppShell>
  );
}
