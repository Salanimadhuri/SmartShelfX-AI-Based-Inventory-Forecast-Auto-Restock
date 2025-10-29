import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { save } from '../../Services/SKUService';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', // vertically center
    padding: '1rem',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  card: {
    backgroundColor: '#fff',
    padding: '1rem', // reduced padding
    borderRadius: '10px',
    boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '350px', // narrower card
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '0.8rem', // reduced spacing
    fontSize: '1.3rem', // slightly smaller
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: '0.8rem', // smaller spacing between fields
  },
  label: {
    display: 'block',
    marginBottom: '0.2rem',
    fontWeight: '500',
    color: '#555',
    fontSize: '0.85rem',
  },
  input: {
    width: '100%',
    padding: '0.35rem', // smaller height
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '0.85rem',
    boxSizing: 'border-box',
  },
  inputError: {
    border: '1px solid #dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: '0.75rem',
    marginTop: '0.2rem',
  },
  submitButton: {
    width: '100%',
    padding: '0.5rem', // smaller button height
    backgroundColor: '#0d6efd',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

const SKUAddition = () => {
  const [sku, setSku] = useState({ skuId: "", skuDescription: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setSku(prev => ({ ...prev, [name]: value }));
  };

  const saveSku = async () => {
    try {
      await save(sku);
      alert("New SKU added successfully!");
      navigate('/AdminMenu');
    } catch (error) {
      console.error("Error saving SKU:", error);
      alert("Failed to add SKU. Please try again.");
    }
  };

  const handleValidation = (e) => {
    e.preventDefault();
    let tempErrors = {};
    let isValid = true;

    if (!sku.skuId.trim()) {
      tempErrors.skuId = "SKU ID is required";
      isValid = false;
    }

    if (!sku.skuDescription.trim()) {
      tempErrors.skuDescription = "SKU description is required";
      isValid = false;
    }

    setErrors(tempErrors);
    if (isValid) saveSku();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Add New SKU</h2>
        <form onSubmit={handleValidation}>
  <div style={styles.formGroup}>
    <label style={styles.label}>SKU ID:</label>
    <input
      type="text"
      name="skuId"
      value={sku.skuId}
      onChange={onChangeHandler}
      style={{ 
        ...styles.input, 
        ...(errors.skuId ? styles.inputError : {}) 
      }}
      placeholder="Enter SKU ID"
    />
    {errors.skuId && <p style={styles.errorText}>{errors.skuId}</p>}
  </div>

  <div style={styles.formGroup}>
    <label style={styles.label}>SKU Description:</label>
    <input
      type="text"
      name="skuDescription"
      value={sku.skuDescription}
      onChange={onChangeHandler}
      style={{ 
        ...styles.input, 
        ...(errors.skuDescription ? styles.inputError : {}) 
      }}
      placeholder="Enter SKU description"
    />
    {errors.skuDescription && <p style={styles.errorText}>{errors.skuDescription}</p>}
  </div>

  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
    <button type="submit" style={styles.submitButton}>
      Add SKU
    </button>
    <button
    type="button"
    style={{ ...styles.submitButton, backgroundColor: '#ffc107' }}
    onClick={() => setSku({ skuId: "", skuDescription: "" })}
  >
    Reset
  </button>
    <button
      type="button"
      style={{ 
        ...styles.submitButton, 
        backgroundColor: '#6c757d' 
      }}
      onClick={() => navigate('/AdminMenu')}
    >
      Return
    </button>
  </div>
</form>

      </div>
    </div>
  );
};

export default SKUAddition;