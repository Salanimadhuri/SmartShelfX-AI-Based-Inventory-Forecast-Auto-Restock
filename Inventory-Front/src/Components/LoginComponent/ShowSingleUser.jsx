import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSingleUserDetails } from '../../Services/LoginService';

const styles = {
  container: {
    fontFamily: 'Segoe UI, Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: '20px',
    backgroundColor: '#f0f2f5',
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
    color: '#17a2b8',
    marginBottom: '25px',
    fontSize: '2em',
    fontWeight: '700',
    textDecoration: 'underline',
    textUnderlineOffset: '6px',
    textDecorationColor: '#17a2b8',
  },
  row: {
    marginBottom: '12px',
    fontSize: '1em',
    color: '#495057',
  },
  label: {
    fontWeight: 'bold',
    marginRight: '5px',
  },
  buttonContainer: {
    textAlign: 'center',
    marginTop: '20px',
  },
  button: {
    backgroundColor: '#ffc107',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s, transform 0.1s',
  },
};

const ShowSingleUser = () => {
  const [inventoryUser, setInventoryUser] = useState({
    username: "",
    personalName: "",
    password: "",
    email: "",
    role: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    getSingleUserDetails()
      .then(response => setInventoryUser(response.data))
      .catch(error => console.error("Error fetching user details:", error));
  }, []);

  const returnBack = () => {
    if (inventoryUser.role === 'Manager') navigate('/ManagerMenu');
    else if (inventoryUser.role === 'Vendor') navigate('/VendorMenu');
    else navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.title}>User Details</h3>

        <div style={styles.row}><span style={styles.label}>User Id:</span>{inventoryUser.username}</div>
        <div style={styles.row}><span style={styles.label}>Personal Name:</span>{inventoryUser.personalName}</div>
        <div style={styles.row}><span style={styles.label}>Email:</span>{inventoryUser.email}</div>
        <div style={styles.row}><span style={styles.label}>Role:</span>{inventoryUser.role}</div>

        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={returnBack}>Return</button>
        </div>
      </div>
    </div>
  );
};

export default ShowSingleUser;
