import React, { useEffect, useState, useCallback } from "react";
// Import useLocation to read the state passed during navigation
import { useNavigate, useLocation } from "react-router-dom";
import { getAllProducts, deleteProduct } from "../../Services/ProductService";
import { getAllTransactions } from "../../Services/TransactionService";

const styles = {
  // ... (Your existing styles object)
  container: {
    fontFamily: 'Segoe UI, Arial, sans-serif',
    padding: '20px',
    maxWidth: '1300px',
    margin: 'auto',
    borderRadius: '10px',
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
  table: {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'auto', // Allow columns to adjust automatically
  minWidth: '0',        // Remove forced min width
},
tableWrapper: {
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  overflowX: 'auto',   // Keep in case table is wider than container
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
    transition: 'background-color 0.2s, transform 0.1s',
  },
  viewButton: { backgroundColor: '#17a2b8' },
  issueButton: { backgroundColor: '#ffc107', color: '#000' },
  purchaseButton: { backgroundColor: '#28a745' },
  priceUpdateButton: { backgroundColor: '#007bff' },
  deleteButton: { backgroundColor: '#dc3545' },
  returnButtonContainer: {
    marginTop: '20px',
    textAlign: 'center',
  },
  returnButton: {
    backgroundColor: '#17a2b8',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: 'bold',
    transition: 'background-color 0.2s, transform 0.1s',
  },
  transactionSection: {
    marginTop: "30px",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#eaf4ff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  transactionTitle: {
    color: "#007bff",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  lowStockRow: {
    backgroundColor: '#fff3f3',
  },
};

const AdminProductReport = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get location object

  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showTransactionValue, setShowTransactionValue] = useState(false);
  const [loading, setLoading] = useState(true);
  


  // Wrap data loading functions in useCallback to prevent re-creation
  const loadProducts = useCallback(async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array, this function is stable

  const loadTransactions = useCallback(async () => {
    try {
      const response = await getAllTransactions();
      setTransactions(response.data);
      setShowTransactionValue(true); // Show transactions when loaded
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, []); // Empty dependency array, this function is stable

  // This effect runs when the component loads
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // This effect runs when we return to this page with a message
  useEffect(() => {
    if (location.state?.message) {
      // A success message was passed, so reload transactions
      loadTransactions();
      
      // Clear the location state so the message doesn't re-appear on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.message, loadTransactions, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p.productId !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Updated function: Just navigate.
  const handleIssue = (id) => {
    navigate(`/issue-product/${id}`);
  };

  // Updated function: Just navigate.
  const handlePurchase = (id) => {
    navigate(`/purchase-product/${id}`);
  };

  const handlePriceUpdate = (id) => navigate(`/update-price/${id}`);

  if (loading) return <div>Loading products...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Product List</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>ID</th>
              <th style={styles.tableHeader}>Name</th>
              <th style={styles.tableHeader}>SKU</th>
              <th style={styles.tableHeader}>Purchase Price</th>
              <th style={styles.tableHeader}>Stock</th>
              <th style={styles.tableHeader}>Reorder Level</th>
              <th style={styles.tableHeader}>Vendor ID</th>
              <th  style={styles.tableHeader}>Stock Status</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.productId} >
                <td style={styles.tableCell}>{p.productId}</td>
                <td style={styles.tableCell}>{p.productName}</td>
                <td style={styles.tableCell}>{p.sku}</td>
                <td style={styles.tableCell}>{p.purchasePrice}</td>
                <td style={styles.tableCell}>{p.stock}</td>
                <td style={styles.tableCell}>{p.reorderLevel}</td>
                <td style={styles.tableCell}>{p.vendorId}</td>
                                 <td style={styles.tableCell}>
                    {p.stock > p.reorderLevel ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>Permitted to Issue</span>
                    ) : (
                      <span style={{ color: "red", fontWeight: "bold" }}>Reorder Level Reached</span>
                    )}
                  </td>

                <td style={{ ...styles.tableCell, ...styles.actionsCell }}>
                  <button
                    style={{ ...styles.actionButton, ...styles.viewButton }}
                    onClick={() => navigate(`/view-product/${p.productId}`)}
                  >
                    View
                  </button>
                  <button
                    style={{ ...styles.actionButton, ...styles.issueButton }}
                    onClick={() => handleIssue(p.productId)}
                  >
                    Issue
                  </button>
                  <button
                    style={{ ...styles.actionButton, ...styles.purchaseButton }}
                    onClick={() => handlePurchase(p.productId)}
                  >
                    Purchase
                  </button>
                  <button
                    style={{ ...styles.actionButton, ...styles.priceUpdateButton }}
                    onClick={() => handlePriceUpdate(p.productId)}
                  >
                    Update Price
                  </button>
                  <button
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                    onClick={() => handleDelete(p.productId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     

      <div style={styles.returnButtonContainer}>
        {/* "Clear Message" button appears only if there is a message */}
       
       <button
          style={styles.returnButton}
          onClick={() => {
            // Just navigate. Remove the lines for setMessage
            // and setShowTransactionValue.
            navigate("/AdminMenu");
          }}
        >
          Return
        </button>
      </div>
    </div>
  );
};

export default AdminProductReport;