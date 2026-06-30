import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../UI/AppShell";
import { getAllProducts } from "../../Services/ProductService";
import { createPO, getPOById, updatePO, generatePOId } from "../../Services/PurchaseOrderService";
import { PlusCircle, Trash, CheckCircle, ExclamationCircle } from "react-bootstrap-icons";
import "../UI/EnterpriseStyles.css";

export default function PurchaseOrderForm() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const role     = localStorage.getItem("loggedInRole") || "Admin";

  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(isEdit);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [errors,    setErrors]    = useState({});
  const [form, setForm] = useState({
    id: "", poNumber: "", supplierId: "", orderDate: "", expectedDeliveryDate: "",
    status: "DRAFT", notes: "", items: [],
  });

  useEffect(() => {
    getAllProducts().then(r => setProducts(r.data)).catch(console.error);
    if (isEdit) {
      getPOById(id).then(r => {
        const d = r.data;
        setForm({
          id:                   d.id || "",
          poNumber:             d.poNumber || "",
          supplierId:           d.supplierId || "",
          orderDate:            d.orderDate || "",
          expectedDeliveryDate: d.expectedDeliveryDate || "",
          status:               d.status || "DRAFT",
          notes:                d.notes || "",
          items:                d.items || [],
        });
      }).catch(console.error).finally(() => setLoading(false));
    } else {
      generatePOId().then(r => setForm(p => ({ ...p, poNumber: r.data, id: r.data }))).catch(console.error);
    }
  }, [id, isEdit]);

  const setField = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const addItem = () => setForm(p => ({
    ...p,
    items: [...p.items, { productId:"", productName:"", quantity:"", unitCost:"", totalCost:0 }],
  }));

  const updateItem = (i, key, val) => setForm(p => {
    const items = [...p.items];
    items[i] = { ...items[i], [key]: val };
    if (key === "productId") {
      const prod = products.find(x => x.productId === val);
      if (prod) {
        items[i].productName = prod.productName;
        items[i].unitCost    = prod.purchasePrice || "";
      }
    }
    if (key === "quantity" || key === "unitCost") {
      const q = parseFloat(items[i].quantity) || 0;
      const c = parseFloat(items[i].unitCost)  || 0;
      items[i].totalCost = q * c;
    }
    return { ...p, items };
  });

  const removeItem = (i) => setForm(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));

  const totalAmount = form.items.reduce((s, it) => s + (parseFloat(it.totalCost) || 0), 0);

  const validate = () => {
    const e = {};
    if (!form.supplierId.trim()) e.supplierId = "Supplier ID is required";
    if (!form.orderDate)         e.orderDate  = "Order date is required";
    if (form.items.length === 0) e.items = "Add at least one item";
    form.items.forEach((it, i) => {
      if (!it.productId)              e[`item_${i}_product`]  = "Select product";
      if (!it.quantity || it.quantity <= 0) e[`item_${i}_qty`] = "Enter qty";
      if (!it.unitCost || it.unitCost <= 0) e[`item_${i}_cost`] = "Enter cost";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, totalAmount };
      if (isEdit) await updatePO(id, payload);
      else        await createPO(payload);
      setSaved(true);
      setTimeout(() => navigate("/PurchaseOrders"), 1500);
    } catch (err) {
      setErrors({ general: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (saved) return (
    <div style={{ minHeight:"100vh", background:"#f9fafb", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font,'Inter',sans-serif)" }}>
      <div style={{ textAlign:"center" }}>
        <CheckCircle size={40} color="#16a34a" style={{ marginBottom:12 }} />
        <h3 style={{ fontWeight:700, color:"#111827", marginBottom:6 }}>Purchase Order {isEdit ? "Updated" : "Created"}</h3>
        <p style={{ color:"#6b7280", fontSize:"0.875rem" }}>Redirecting to PO list…</p>
      </div>
    </div>
  );

  return (
    <AppShell role={role} breadcrumb={[
      { label: "Dashboard", href: role === "Manager" ? "/ManagerMenu" : "/AdminMenu" },
      { label: "Purchase Orders", href: "/PurchaseOrders" },
      { label: isEdit ? `Edit ${form.poNumber}` : "New Purchase Order" },
    ]}>
      <div className="ent-page-header">
        <div>
          <h2 className="ent-page-title">{isEdit ? "Edit Purchase Order" : "New Purchase Order"}</h2>
          <p className="ent-page-subtitle">{isEdit ? `Editing ${form.poNumber}` : "Create a new purchase order"}</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:"64px 0" }}>
          <div className="ent-spinner" style={{ margin:"0 auto 12px" }} />
          <p style={{ color:"#9ca3af" }}>Loading…</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="ent-alert ent-alert-error">
              <ExclamationCircle size={15} /> {errors.general}
            </div>
          )}

          {/* Header card */}
          <div className="ent-card" style={{ padding:"24px", marginBottom:16 }}>
            <h3 style={{ fontSize:"0.9375rem", fontWeight:600, color:"#111827", marginBottom:16 }}>Order Details</h3>
            <div className="ent-grid-2">
              <div className="ent-field">
                <label className="ent-label">PO Number</label>
                <input className="ent-input" value={form.poNumber} disabled />
              </div>
              <div className="ent-field">
                <label className="ent-label">Supplier ID *</label>
                <input className={`ent-input${errors.supplierId?" error":""}`}
                  value={form.supplierId} onChange={e => setField("supplierId", e.target.value)}
                  placeholder="e.g. V001" />
                {errors.supplierId && <p className="ent-error">{errors.supplierId}</p>}
              </div>
              <div className="ent-field">
                <label className="ent-label">Order Date *</label>
                <input type="date" className={`ent-input${errors.orderDate?" error":""}`}
                  value={form.orderDate} onChange={e => setField("orderDate", e.target.value)} />
                {errors.orderDate && <p className="ent-error">{errors.orderDate}</p>}
              </div>
              <div className="ent-field">
                <label className="ent-label">Expected Delivery</label>
                <input type="date" className="ent-input"
                  value={form.expectedDeliveryDate} onChange={e => setField("expectedDeliveryDate", e.target.value)} />
              </div>
              <div className="ent-field" style={{ gridColumn:"1/-1" }}>
                <label className="ent-label">Notes</label>
                <textarea className="ent-input" rows={2} style={{ resize:"vertical" }}
                  value={form.notes} onChange={e => setField("notes", e.target.value)}
                  placeholder="Optional notes for this order…" />
              </div>
            </div>
          </div>

          {/* Items card */}
          <div className="ent-card" style={{ padding:"24px", marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h3 style={{ fontSize:"0.9375rem", fontWeight:600, color:"#111827" }}>Order Items</h3>
              <button type="button" className="ent-btn ent-btn-secondary ent-btn-sm" onClick={addItem}>
                <PlusCircle size={13} /> Add Item
              </button>
            </div>
            {errors.items && <div className="ent-alert ent-alert-error"><ExclamationCircle size={14} />{errors.items}</div>}

            {form.items.length === 0 ? (
              <div style={{ textAlign:"center", padding:"32px 0", color:"#9ca3af", fontSize:"0.875rem" }}>
                No items yet. Click "Add Item" to begin.
              </div>
            ) : (
              <div className="ent-table-scroll">
                <table className="ent-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Unit Cost (₹)</th>
                      <th>Total Cost</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((item, i) => (
                      <tr key={i}>
                        <td>
                          <select className={`ent-input${errors[`item_${i}_product`]?" error":""}`}
                            value={item.productId} onChange={e => updateItem(i, "productId", e.target.value)}
                            style={{ minWidth:180 }}>
                            <option value="">Select product…</option>
                            {products.map(p => (
                              <option key={p.productId} value={p.productId}>{p.productName}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input type="number" className={`ent-input${errors[`item_${i}_qty`]?" error":""}`}
                            value={item.quantity} min="1"
                            onChange={e => updateItem(i, "quantity", e.target.value)}
                            style={{ width:90 }} placeholder="0" />
                        </td>
                        <td>
                          <input type="number" className={`ent-input${errors[`item_${i}_cost`]?" error":""}`}
                            value={item.unitCost} min="0"
                            onChange={e => updateItem(i, "unitCost", e.target.value)}
                            style={{ width:100 }} placeholder="0.00" />
                        </td>
                        <td style={{ fontWeight:600, color:"#111827" }}>
                          ₹{(item.totalCost || 0).toLocaleString(undefined, { maximumFractionDigits:2 })}
                        </td>
                        <td>
                          <button type="button" className="ent-btn ent-btn-danger ent-btn-sm" onClick={() => removeItem(i)}>
                            <Trash size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {form.items.length > 0 && (
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:14, paddingTop:12, borderTop:"1px solid #f3f4f6" }}>
                <div style={{ fontSize:"1rem", fontWeight:700, color:"#111827" }}>
                  Total: ₹{totalAmount.toLocaleString(undefined, { maximumFractionDigits:2 })}
                </div>
              </div>
            )}
          </div>

          <div style={{ display:"flex", gap:8 }}>
            <button type="submit" disabled={saving} className="ent-btn ent-btn-primary ent-btn-lg">
              {saving ? "Saving…" : isEdit ? "Update Purchase Order" : "Create Purchase Order"}
            </button>
            <button type="button" className="ent-btn ent-btn-ghost ent-btn-lg"
              onClick={() => navigate("/PurchaseOrders")}>
              Cancel
            </button>
          </div>
        </form>
      )}
      <style>{`@keyframes ent-spin{to{transform:rotate(360deg)}}.ent-spinner{width:32px;height:32px;border:2.5px solid #e5e7eb;border-top-color:#1d4ed8;border-radius:50%;animation:ent-spin .7s linear infinite}`}</style>
    </AppShell>
  );
}
