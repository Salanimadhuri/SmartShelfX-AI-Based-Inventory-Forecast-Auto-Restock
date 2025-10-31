import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../Services/ProductService";

const styles = {
  container: {
    fontFamily: 'Segoe UI, Arial, sans-serif',
    padding: '20px',
    maxWidth: '1300px', // wider like admin version
    margin: '40px auto',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#007bff',
    marginBottom: '20px',
    fontSize: '2em',
    fontWeight: '700',
    textDecoration: 'underline',
    textUnderlineOffset: '6px',
    textDecorationColor: '#007bff',
  },
  tableWrapper: {
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'auto',
    minWidth: '0',
  },
  tableHeader: {
    padding: '10px 12px',
    textAlign: 'left',
    backgroundColor: '#343a40',
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableCell: {
    padding: '10px 12px',
    textAlign: 'left',
    borderBottom: '1px solid #dee2e6',
    fontSize: '0.9em',
    color: '#495057',
    whiteSpace: 'nowrap',
  },
  actionsCell: {
    whiteSpace: 'nowrap',
  },
  actionButton: {
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85em',
    fontWeight: 'bold',
    marginRight: '5px',
    color: '#fff',
  },
  viewButton: { backgroundColor: '#17a2b8' },
  issueButton: { backgroundColor: '#ffc107', color: '#000' },
  purchaseButton: { backgroundColor: '#28a745' },
  returnButtonContainer: { marginTop: '20px', textAlign: 'center' },
  returnButton: {
    backgroundColor: '#17a2b8',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
  },
  lowStockRow: { backgroundColor: '#fff3f3' }, // highlight low stock
};

const ManagerProductReport = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleView = (id) => navigate(`/view-product/${id}`);
  const handleIssue = (id) => navigate(`/issue-product/${id}?returnPath=/MngProdRepo`);
  const handlePurchase = (id) => navigate(`/purchase-product/${id}?returnPath=/MngProdRepo`);

  if (loading) return <div>Loading products...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Product List</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Product ID</th>
              <th style={styles.tableHeader}>Product Name</th>
              <th style={styles.tableHeader}>SKU</th>
              <th style={styles.tableHeader}>Purchase Price</th>
              <th style={styles.tableHeader}>Stock</th>
              <th style={styles.tableHeader}>Reorder Level</th>
              <th style={styles.tableHeader}>Vendor ID</th>
              <th style={styles.tableHeader}>Stock Status</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ ...styles.tableCell, textAlign: "center" }}>No products found.</td>
              </tr>
            ) : (
              products.map((prod) => (
             <tr key={prod.productId} >
                  <td style={styles.tableCell}>{prod.productId}</td>
                  <td style={styles.tableCell}>{prod.productName}</td>
                  <td style={styles.tableCell}>{prod.sku}</td>
                  <td style={styles.tableCell}>{prod.purchasePrice}</td>
                  <td style={styles.tableCell}>{prod.stock}</td>
                  <td style={styles.tableCell}>{prod.reorderLevel}</td>
                  <td style={styles.tableCell}>{prod.vendorId}</td>
                  <td style={styles.tableCell}>
                    {prod.stock > prod.reorderLevel ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>Permitted to Issue</span>
                    ) : (
                      <span style={{ color: "red", fontWeight: "bold" }}>Reorder Level Reached</span>
                    )}
                  </td>
                  <td style={{ ...styles.tableCell, ...styles.actionsCell }}>
                    <button style={{ ...styles.actionButton, ...styles.viewButton }} onClick={() => handleView(prod.productId)}>View</button>
                    <button style={{ ...styles.actionButton, ...styles.issueButton }} onClick={() => handleIssue(prod.productId)}>Issue</button>
                    <button style={{ ...styles.actionButton, ...styles.purchaseButton }} onClick={() => handlePurchase(prod.productId)}>Purchase</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.returnButtonContainer}>
        <button style={styles.returnButton} onClick={() => navigate("/ManagerMenu")}>Return</button>
      </div>
    </div>
  );
};

export default ManagerProductReport;
