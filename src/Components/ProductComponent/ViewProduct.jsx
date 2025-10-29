

import React, { useEffect, useState } from 'react';
import { getProductById } from '../../Services/ProductService';
import { getUserRole } from '../../Services/LoginService';
import { useParams, useNavigate } from "react-router-dom";

// Inline Styles
const styles = {
  container: {
    fontFamily: 'Segoe UI, Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: '20px',
    backgroundColor: '#f8f9fa',
  },
  card: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '30px',
  },
  title: {
    textAlign: 'center',
    color: '#007bff',
    marginBottom: '25px',
    fontSize: '2em',
    fontWeight: '700',
    textDecoration: 'underline',
    textUnderlineOffset: '6px',
    textDecorationColor: '#007bff',
  },
  row: {
    marginBottom: '10px',
    fontSize: '1em',
    color: '#495057',
  },
  label: {
    fontWeight: 'bold',
    marginRight: '5px',
  },
  reorderStatus: {
    marginTop: '15px',
    fontWeight: 'bold',
    fontSize: '1.1em',
    textAlign: 'center',
    padding: '10px',
    borderRadius: '5px',
  },
  buttonContainer: {
    textAlign: 'center',
    marginTop: '20px',
  },
  button: {
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s, transform 0.1s',
  },
  buttonHover: {
    backgroundColor: '#138496',
    transform: 'scale(1.02)',
  },
};

const ViewProduct = () => {
  const { pid } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState("");
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

  // ✅ Fetch product details
  const setProductData = () => {
    getProductById(pid)
      .then(response => setProduct(response.data))
      .catch(error => console.error(" Error fetching product:", error));
  };

  // ✅ Fetch user role
  const setUserRoleData = () => {
    getUserRole()
      .then(response => setRole(response.data))
      .catch(error => console.error("Error fetching user role:", error));
  };

  useEffect(() => {
    setProductData();
    setUserRoleData();
  }, [pid]);

  // ✅ Navigate back depending on role
  const returnBack = () => {
    if (role === "Admin") navigate('/AdProdRepo');
    else if (role === "Manager") navigate('/MngProdRepo');
    else navigate('/');
  };

  // ✅ Calculate reorder status
  const getReorderStatus = () => {
    if (product.stock <= product.reorderLevel) {
      return {
        message: " Reorder Level Reached ",
        color: "#dc3545", // red
        background: "#f8d7da",
      };
    } else {
      return {
        message: "Permitted to Issue",
        color: "#28a745", // green
        background: "#d4edda",
      };
    }
  };

  const reorder = getReorderStatus();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.title}>View Product Details</h3>

        <div style={styles.row}><span style={styles.label}>Product ID:</span>{product.productId}</div>
        <div style={styles.row}><span style={styles.label}>SKU:</span>{product.sku}</div>
        <div style={styles.row}><span style={styles.label}>Product Name:</span>{product.productName}</div>
        <div style={styles.row}><span style={styles.label}>Purchase Price:</span>₹{product.purchasePrice}</div>
        <div style={styles.row}><span style={styles.label}>Sales Price:</span>₹{product.salesPrice}</div>
        <div style={styles.row}><span style={styles.label}>Reorder Level:</span>{product.reorderLevel}</div>
        <div style={styles.row}><span style={styles.label}>Stock:</span>{product.stock}</div>
        <div style={styles.row}><span style={styles.label}>Vendor:</span>{product.vendorId}</div>

        {/* Reorder Status */}
        <div
          style={{
            ...styles.reorderStatus,
            color: reorder.color,
            backgroundColor: reorder.background,
          }}
        >
          {reorder.message}
        </div>

        <div style={styles.buttonContainer}>
          <button
            style={styles.button}
            onClick={returnBack}
            onMouseOver={e => e.target.style.backgroundColor = '#138496'}
            onMouseOut={e => e.target.style.backgroundColor = '#17a2b8'}
          >
          Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
