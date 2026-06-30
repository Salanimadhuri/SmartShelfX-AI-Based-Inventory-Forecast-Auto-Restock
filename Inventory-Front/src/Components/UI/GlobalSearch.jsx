import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, BoxSeam, CreditCard, FileEarmarkText, HouseDoor } from "react-bootstrap-icons";
import { globalSearch } from "../../Services/SearchService";

const TYPE_ICON = {
  product:       <BoxSeam size={14} color="#1d4ed8" />,
  transaction:   <CreditCard size={14} color="#d97706" />,
  purchaseOrder: <FileEarmarkText size={14} color="#16a34a" />,
  page:          <HouseDoor size={14} color="#6b7280" />,
};

const TYPE_LABEL = {
  product:       "Product",
  transaction:   "Transaction",
  purchaseOrder: "Purchase Order",
  page:          "Page",
};

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function GlobalSearch({ onClose }) {
  const navigate   = useNavigate();
  const inputRef   = useRef(null);
  const wrapRef    = useRef(null);
  const [query,    setQuery]    = useState("");
  const [results,  setResults]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const debouncedQuery = useDebounce(query, 300);

  // Auto-focus when opened
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length < 1) { setResults(null); setError(""); return; }
    setLoading(true); setError("");
    globalSearch(debouncedQuery)
      .then(r => setResults(r.data))
      .catch(() => setError("Search failed. Please try again."))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const handleSelect = useCallback((href) => {
    onClose();
    navigate(href);
  }, [navigate, onClose]);

  // Flatten all results into one list for display
  const allResults = results ? [
    ...(results.products       || []),
    ...(results.purchaseOrders || []),
    ...(results.transactions   || []),
    ...(results.pages          || []),
  ] : [];

  return (
    // Backdrop
    <div style={{
      position:   "fixed", inset: 0,
      background: "rgba(0,0,0,0.45)",
      zIndex:     1000,
      display:    "flex", alignItems: "flex-start",
      justifyContent: "center",
      paddingTop: "80px",
    }}>
      <div ref={wrapRef} style={{
        width:        "100%",
        maxWidth:     "580px",
        background:   "#fff",
        borderRadius: "16px",
        boxShadow:    "0 24px 64px rgba(0,0,0,0.22)",
        overflow:     "hidden",
        animation:    "gsIn 0.18s ease-out both",
      }}>
        <style>{`
          @keyframes gsIn { from { opacity:0; transform:scale(0.96) translateY(-8px); } to { opacity:1; transform:scale(1) translateY(0); } }
          .gs-row { display:flex; align-items:center; gap:12px; padding:10px 16px; cursor:pointer; transition:background 0.12s; border-radius:0; }
          .gs-row:hover { background:#f0f4ff; }
          .gs-row:focus { background:#f0f4ff; outline:none; }
        `}</style>

        {/* Input bar */}
        <div style={{ display:"flex", alignItems:"center", padding:"14px 16px", borderBottom:"1px solid #f3f4f6", gap:10 }}>
          {loading
            ? <div style={{ width:18, height:18, border:"2px solid #e5e7eb", borderTopColor:"#1d4ed8", borderRadius:"50%", animation:"ent-spin 0.7s linear infinite", flexShrink:0 }} />
            : <Search size={18} color="#9ca3af" style={{ flexShrink:0 }} />}
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products, transactions, orders, pages…"
            style={{
              flex:1, border:"none", outline:"none",
              fontSize:"0.9625rem", color:"#111827",
              background:"transparent", fontFamily:"var(--font,'Inter',sans-serif)",
            }}
          />
          {query && (
            <button onClick={() => setQuery("")}
              style={{ background:"none", border:"none", cursor:"pointer", padding:2, display:"flex", alignItems:"center", color:"#9ca3af" }}>
              <X size={16} />
            </button>
          )}
          <button onClick={onClose}
            style={{ background:"#f3f4f6", border:"none", cursor:"pointer", borderRadius:6, padding:"3px 8px", fontSize:"0.75rem", color:"#6b7280", fontFamily:"inherit" }}>
            Esc
          </button>
        </div>

        {/* Results area */}
        <div style={{ maxHeight:"440px", overflowY:"auto" }}>

          {/* Error */}
          {error && (
            <div style={{ padding:"14px 16px", color:"#dc2626", fontSize:"0.875rem" }}>⚠ {error}</div>
          )}

          {/* Empty query hint */}
          {!query && !results && !error && (
            <div style={{ padding:"28px 16px", textAlign:"center" }}>
              <Search size={28} color="#d1d5db" style={{ marginBottom:8 }} />
              <p style={{ color:"#9ca3af", fontSize:"0.875rem", margin:0 }}>
                Start typing to search products, transactions, purchase orders…
              </p>
            </div>
          )}

          {/* No results */}
          {query && results && allResults.length === 0 && !loading && (
            <div style={{ padding:"28px 16px", textAlign:"center" }}>
              <p style={{ color:"#9ca3af", fontSize:"0.875rem", margin:0 }}>
                No results found for <strong>"{query}"</strong>
              </p>
            </div>
          )}

          {/* Results grouped by type */}
          {results && allResults.length > 0 && (() => {
            const groups = {};
            allResults.forEach(r => { if (!groups[r.type]) groups[r.type] = []; groups[r.type].push(r); });
            return Object.entries(groups).map(([type, items]) => (
              <div key={type}>
                <div style={{ padding:"8px 16px 4px", fontSize:"0.7rem", fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.6px" }}>
                  {TYPE_LABEL[type] || type}
                </div>
                {items.map((item, i) => (
                  <div key={i} className="gs-row" tabIndex={0}
                    onClick={() => handleSelect(item.href)}
                    onKeyDown={e => e.key === "Enter" && handleSelect(item.href)}
                    role="button" aria-label={item.title}>
                    <div style={{ width:32, height:32, borderRadius:8, background:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {TYPE_ICON[item.type] || <BoxSeam size={14} />}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:600, color:"#111827", fontSize:"0.875rem", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {item.title}
                        {item.status === "low" && (
                          <span style={{ marginLeft:8, fontSize:"0.7rem", fontWeight:700, background:"#fef3c7", color:"#d97706", border:"1px solid #fde68a", borderRadius:4, padding:"1px 6px" }}>
                            Low Stock
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize:"0.75rem", color:"#9ca3af", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {item.subtitle}
                      </div>
                    </div>
                    <span style={{ fontSize:"0.72rem", color:"#d1d5db", flexShrink:0 }}>→</span>
                  </div>
                ))}
              </div>
            ));
          })()}
        </div>

        {/* Footer hint */}
        {results && allResults.length > 0 && (
          <div style={{ padding:"8px 16px", borderTop:"1px solid #f3f4f6", display:"flex", gap:16, fontSize:"0.72rem", color:"#9ca3af" }}>
            <span>↵ to select</span>
            <span>Esc to close</span>
            <span style={{ marginLeft:"auto" }}>{results.totalResults} result{results.totalResults !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>
    </div>
  );
}
