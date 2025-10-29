import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getAllProducts, issueProduct, purchaseProduct } from "../../Services/ProductService";
import { generateTransactionId, saveTransaction } from "../../Services/TransactionService";

// STYLES ARE UNCHANGED
const styles = {
  container: { fontFamily: "Segoe UI, Arial, sans-serif", padding: "20px", backgroundColor: "#f9fafb", minHeight: "100vh" },
  card: { backgroundColor: "white", padding: "30px 40px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", maxWidth: "650px", margin: "auto", border: "1px solid #e5e7eb" },
  title: { textAlign: "center", fontSize: "24px", fontWeight: "bold", color: "#111827", borderBottom: "2px solid #007bff", paddingBottom: "8px", marginBottom: "20px" },
  infoBox: { backgroundColor: "#f8fafc", borderRadius: "8px", padding: "15px 20px", marginBottom: "25px", border: "1px solid #e5e7eb" },
  infoRow: { display: "grid", gridTemplateColumns: "180px 1fr", padding: "4px 0", fontSize: "16px" },
  label: { fontWeight: "600", color: "#374151" },
  input: { width: "100%", padding: "10px", marginTop: "8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "15px" },
  buttonContainer: { display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" },
  button: { backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "6px", padding: "10px 25px", fontWeight: "600", cursor: "pointer" },
  returnButton: { backgroundColor: "#198754" },
  summary: { textAlign: "center", marginTop: "20px", fontSize: "18px", fontWeight: "bold" },
  reorderAlert: { textAlign: "center", color: "red", fontWeight: "600", marginTop: "10px" },
  success: { textAlign: "center", color: "green", fontWeight: "600", marginTop: "10px" },
  error: { textAlign: "center", color: "red", fontWeight: "600", marginTop: "10px" },
};

const EditStock = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const returnPath = queryParams.get("returnPath") || "/AdProdRepo";

  const [product, setProduct] = useState({
     productId: "",
  productName: "",
  sku: "",
  purchasePrice: 0.0,
  salesPrice: 0.0,
  reorderLevel: 0.0,
  stock: 0.0,
  vendorId: "",
  status: true, 
  });
  const [quantity, setQuantity] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [showReorderAlert, setShowReorderAlert] = useState(false);

  // This new state will hold the message we pass back to the report page
  const [navMessage, setNavMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      // ... (This useEffect is unchanged)
      try {
        const res = await getAllProducts();
        const found = res.data.find((p) => String(p.productId) === id);
      setProduct({ ...found, status: true });
  const resTransaction = await generateTransactionId();
        setTransactionId(resTransaction.data);
      } catch (err) {
        console.error("Error fetching product or transaction ID:", err);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    // ... (This useEffect is unchanged)
    if (product && mode === "issue") {
      const enteredQuantity = Number(quantity);
      if (!isNaN(enteredQuantity) && enteredQuantity > 0) {
        setShowReorderAlert(product.stock - enteredQuantity <= product.reorderLevel);
      } else {
        setShowReorderAlert(false);
      }
    }
  }, [quantity, product, mode]);

  // *** THIS FUNCTION IS UPDATED ***
  const handleSave = async () => {
    const enteredQuantity = Number(quantity);

    if (!enteredQuantity || isNaN(enteredQuantity) || enteredQuantity <= 0) {
      setMessage("Please enter a valid quantity!");
      setMessageType("error");
      return;
    }

    const txnDate = transactionDate || new Date().toISOString().split("T")[0];

    const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    const rate = mode === "issue" ? product.salesPrice : product.purchasePrice;
    const calculatedTxnValue = enteredQuantity * rate; // Calculate value

    const transaction = {
      transactionId,
      transactionType: mode,
      productId: product.productId,
      quantity: enteredQuantity,
      rate,
      transactionValue: calculatedTxnValue, // Use calculated value
      transactionDate: txnDate,
      userId: user.username || "unknown",
    };

    try {
      await saveTransaction(transaction);
      
      let baseSuccessMessage = "";

      if (mode === "issue") {
        await issueProduct(id, enteredQuantity);
        baseSuccessMessage = "Issued successfully!";
      } else {
        await purchaseProduct(id, enteredQuantity);
        baseSuccessMessage = "Purchased successfully!";
      }

      // 1. Set the message for the *next* page
      setNavMessage(baseSuccessMessage); 

      // 2. Set the message to display *on this page*
      setMessage(`${baseSuccessMessage} Transaction Value: ₹${calculatedTxnValue}`);
      
      setMessageType("success");
      setShowReorderAlert(false);

      // 3. REMOVED the setTimeout navigation
      // setTimeout(() => navigate(returnPath), 2000); // <-- THIS IS GONE

    } catch (error) {
      console.error("Error updating stock:", error);
      setMessage("Operation failed!");
      setMessageType("error");
    }
  };

  if (!product) return <div>Loading product details...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{mode === "issue" ? "Product Issue" : "Product Purchase"}</h2>

        <div style={styles.infoBox}>
          {/* ... (Unchanged InfoBox JSX) ... */}
          <div style={styles.infoRow}><span style={styles.label}>Product Id:</span> {product.productId}</div>
          <div style={styles.infoRow}><span style={styles.label}>SKU:</span> {product.sku}</div>
          <div style={styles.infoRow}><span style={styles.label}>Product Name:</span> {product.productName}</div>
          <div style={styles.infoRow}><span style={styles.label}>{mode === "issue" ? "Sales Price:" : "Purchase Price:"}</span> ₹{mode === "issue" ? product.salesPrice : product.purchasePrice}</div>
          <div style={styles.infoRow}><span style={styles.label}>Reorder Level:</span> {product.reorderLevel}</div>
          <div style={styles.infoRow}><span style={styles.label}>Stock:</span> {product.stock}</div>
          <div style={styles.infoRow}><span style={styles.label}>Vendor:</span> {product.vendorId}</div>
        </div>

        <div>
          {/* ... (Unchanged Input fields JSX) ... */}
          <div style={styles.infoRow}>
            <span style={styles.label}>Transaction Id:</span>
            <input type="text" value={transactionId} readOnly style={styles.input} />
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Select Transaction Date:</span>
            <input type="date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} style={styles.input} />
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>{mode === "issue" ? "Enter Issued Stock Quantity:" : "Enter Purchased Stock Quantity:"}</span>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={styles.input} />
          </div>

          {/* This will now show "Purchased successfully! Transaction Value: ₹24000" */}
          {message && <p style={messageType === "success" ? styles.success : styles.error}>{message}</p>}
          {showReorderAlert && <div style={styles.reorderAlert}>⚠ Product reached Re-Order Level!</div>}
        </div>

        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={handleSave}>Save</button>
          
          {/* *** THIS BUTTON IS UPDATED *** */}
          <button 
            style={{ ...styles.button, ...styles.returnButton }} 
            onClick={() => navigate(returnPath, { state: { message: navMessage || undefined } })}
          >
            Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStock;