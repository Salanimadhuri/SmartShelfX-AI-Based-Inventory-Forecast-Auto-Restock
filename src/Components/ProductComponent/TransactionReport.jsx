import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllTransactions } from "../../Services/TransactionService";

const styles = {
  container: {
    fontFamily: 'Segoe UI, Arial, sans-serif',
    padding: '30px',
    maxWidth: '1200px',
    margin: 'auto',
  },
  title: {
    textAlign: 'center',
    color: '#007bff',
    marginBottom: '25px',
    fontSize: '2.5em',
    fontWeight: '700',
    textDecoration: 'underline',
    textUnderlineOffset: '8px',
    textDecorationColor: '#007bff',
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginTop: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '900px',
  },
  tableHeader: {
    padding: '12px 15px',
    textAlign: 'left',
    backgroundColor: '#343a40',
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableCell: {
    padding: '12px 15px',
    borderBottom: '1px solid #dee2e6',
    fontSize: '0.95em',
    color: '#495057',
  },
  tableRowOdd: { backgroundColor: '#f8f9fa' },
  tableRowEven: { backgroundColor: '#fff' },
  returnButtonContainer: {
    marginTop: '25px',
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
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
 return `${dd}-${mm}-${yyyy}`; 
};

const TransactionReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);

  // Read transaction type (issue/purchase/all)
  const queryParams = new URLSearchParams(location.search);
  const filterType = queryParams.get("type"); // "issue", "purchase", or null

  const storedUser = localStorage.getItem("loggedInUser");
  let user = { username: "unknown" };
  if (storedUser) {
    try {
      if (storedUser.startsWith("{")) user = JSON.parse(storedUser);
      else user.username = storedUser;
    } catch (error) {
      console.error(error);
    }
  }

  const fetchTransactions = async () => {
    try {
      const res = await getAllTransactions();
      let data = res.data;

      // 🔹 Apply filtering based on "type" parameter
      if (filterType === "issue") {
        data = data.filter(t => t.transactionType === "issue");
      } else if (filterType === "purchase") {
        data = data.filter(t => t.transactionType === "purchase");
      }

      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    if (!storedUser) navigate("/login");
    else fetchTransactions();
  }, [filterType]);

  const handleReturn = () => {
    const role = localStorage.getItem("loggedInRole");
    if (role === "Admin") navigate("/AdminMenu");
    else if (role === "Manager") navigate("/ManagerMenu");
    else if (role === "Vendor") navigate("/VendorMenu");
    else navigate("/login");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        {filterType === "issue"
          ? "Issued History"
          : filterType === "purchase"
          ? "Purchase History"
          : "All Transactions "}
      </h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>ID</th>
              <th style={styles.tableHeader}>Product ID</th>
              <th style={styles.tableHeader}>Quantity</th>
              <th style={styles.tableHeader}>Rate</th>
              <th style={styles.tableHeader}>Type</th>
              <th style={styles.tableHeader}>Value</th>
              <th style={styles.tableHeader}>Date</th>
              <th style={styles.tableHeader}>User</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, idx) => (
              <tr key={t.transactionId} style={idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                <td style={styles.tableCell}>{t.transactionId}</td>
                <td style={styles.tableCell}>{t.productId}</td>
                <td style={styles.tableCell}>{t.quantity}</td>
                <td style={styles.tableCell}>{t.rate}</td>
                <td style={styles.tableCell}>{t.transactionType === "issue" ? "OUT" : "IN"}</td>
                <td style={styles.tableCell}>{t.transactionValue}</td>
                <td style={styles.tableCell}>{formatDate(t.transactionDate)}</td>
                <td style={styles.tableCell}>{t.userId || user.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.returnButtonContainer}>
        <button style={styles.returnButton} onClick={handleReturn}>
          Return
        </button>
      </div>
    </div>
  );
};

export default TransactionReport;