import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { showAllSKUs, removeSKU } from '../../Services/SKUService';

const styles = {
  container: {
    fontFamily: 'Segoe UI, Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    minHeight: '80vh',
  },
  card: {
    width: '100%',
    maxWidth: '900px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '30px',
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
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
  },
  th: {
    backgroundColor: '#343a40',
    color: 'white',
    padding: '12px',
  },
  td: {
    padding: '12px',
    textAlign: 'center',
  },
  buttonUpdate: {
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    padding: '6px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: '0.2s',
  },
  buttonDelete: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '6px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: '0.2s',
  },
  buttonReturn: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 22px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    transition: '0.2s',
  },
};

const SKUReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [skuList, setSkuList] = useState([]);

  useEffect(() => {
    showAllSKUs().then((response) => setSkuList(response.data));
  }, []);

  const returnBack = () => {
    const params = new URLSearchParams(location.search);
    const from = params.get("from");

    if (from === "manager") navigate("/ManagerMenu");
    else navigate("/AdminMenu");
  };

  const deleteSKU = (id) => {
    removeSKU(id).then(() => {
      const remainSkus = skuList.filter((sku) => sku.skuId !== id);
      setSkuList(remainSkus);
    });
  };

  return (
    <div style={styles.container}>
      {/* Hover effect added via style tag */}
      <style>
        {`
          tr:hover {
            background-color: #f1f1f1;
          }
          button:hover {
            opacity: 0.85;
            transform: scale(1.03);
          }
        `}
      </style>

      <div style={styles.card}>
        <h3 style={styles.title}>SKU List</h3>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>SKU Id</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Update SKU</th>
                <th style={styles.th}>Delete SKU</th>
              </tr>
            </thead>
            <tbody>
              {skuList.map((sku) => (
                <tr key={sku.skuId}>
                  <td style={styles.td}>{sku.skuId}</td>
                  <td style={styles.td}>{sku.skuDescription}</td>
                  <td style={styles.td}>
                    <Link to={`/update-sku/${sku.skuId}`}>
                      <button style={styles.buttonUpdate}>Update</button>
                    </Link>
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.buttonDelete}
                      onClick={() => deleteSKU(sku.skuId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button style={styles.buttonReturn} onClick={returnBack}>Return</button>
        </div>
      </div>
    </div>
  );
};

export default SKUReport;
