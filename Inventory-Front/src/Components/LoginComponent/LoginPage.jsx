import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Person, Lock } from 'react-bootstrap-icons'; // (Requires: npm install react-bootstrap-icons)
import { validateUser } from '../../Services/LoginService'; // (Adjust path if needed)

// --- 1. STYLES OBJECT (THEMED FOR SMARTSHELFX) ---
const styles = {
  // Full-screen split-layout
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  
  // --- BRANDING PANEL (Left Side) ---
  brandPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    // Dark, professional tech gradient
    background: 'linear-gradient(135deg, #0a192f, #1e3a5f)',
    color: 'white',
    // Hides this panel on small screens
    '@media (max-width: 768px)': {
      display: 'none',
    }
  },
  brandTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: '1.2rem',
    color: '#a8b2d1', // Light blue-grey text
    textAlign: 'center',
  },

  // --- FORM PANEL (Right Side) ---
  formPanel: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f7fa', // Light grey background
    padding: '2rem',
  },
  formContainer: {
    width: '100%',
    maxWidth: '420px',
  },
  formCard: {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
  formTitle: {
    textAlign: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#0a192f', // Dark blue text
    marginBottom: '2rem',
  },
  
  // --- Form Elements ---
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#333',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  inputGroupFocus: {
     borderColor: '#007bff',
     boxShadow: '0 0 0 3px rgba(0,123,255,0.1)',
  },
  inputIcon: {
    padding: '0.75rem',
    color: '#666',
    borderRight: '1px solid #ccc',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '0 8px 8px 0',
    fontSize: '1rem',
    outline: 'none',
  },
  submitButton: {
    width: '100%',
    padding: '0.8rem',
    backgroundColor: '#007bff', // Bright Tech Blue
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  submitButtonHover: {
     backgroundColor: '#0056b3',
  },
  
  // --- Register Link ---
  registerSection: {
    textAlign: 'center',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e0e0e0',
  },
  registerText: {
    color: '#555',
    marginBottom: '0.75rem',
  },
  registerButton: {
    backgroundColor: 'transparent',
    color: '#007bff',
    border: '1px solid #007bff',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s',
  },
  registerButtonHover: {
    backgroundColor: '#007bff',
    color: 'white',
  },

  // --- Error Styling ---
  errorText: {
    color: '#dc3545',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  },
  inputError: {
    borderColor: '#dc3545',
  }
};

// --- Helper to convert styles object to CSS string ---
// This is a simple utility to make the <style> tag work.
// It doesn't handle media queries, so those are for inline style logic.
const generateCssString = (stylesObj) => {
  let cssString = "";
  for (const [key, value] of Object.entries(stylesObj)) {
    // This is a simplified version. For full CSS-in-JS,
    // we'd use a library, but this works for this component.
    if (typeof value === 'object' && !key.startsWith('@')) {
      let styles = "";
      for (const [prop, val] of Object.entries(value)) {
        // Convert camelCase to kebab-case (e.g., backgroundColor -> background-color)
        const cssProp = prop.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
        styles += `${cssProp}: ${val};\n`;
      }
      cssString += `.${key} { ${styles} }\n`;
    }
  }
  return cssString;
};

// --- This component injects the styles into the <head> ---
const PageStyles = () => {
  // A more robust way to handle dynamic styles
  // We'll use inline styles directly for simplicity
  return null; 
};


// --- 2. YOUR LOGIN COMPONENT (NO LOGIC CHANGED) ---
const LoginPage = () => {

  // --- NO CHANGES TO ANY OF YOUR LOGIC ---
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isUsernameFocused, setUsernameFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);

  let navigate = useNavigate();

  const checkLogin = (e) => {
    e.preventDefault();
    validateUser(formData.username, formData.password).then((response) => {
      let role = String(response.data);
      localStorage.setItem("loggedInUser", JSON.stringify({ username: formData.username }));
      localStorage.setItem("loggedInRole", role);
      if (role === "Admin")
        navigate('/AdminMenu');
      else if (role === "Manager")
        navigate('/ManagerMenu');
      else if (role === 'Vendor')
        navigate('/VendorMenu');
      else
        alert("Wrong Userid/Password");
    });
  }

  const onChangeHandler = (event) => {
    event.persist();
    const name = event.target.name;
    const value = event.target.value;
    setFormData(values => ({ ...values, [name]: value }));
  };

  const handleValidation = (event) => {
    event.preventDefault();
    let tempErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      tempErrors.username = "User Name is required";
      isValid = false;
    }

    if (!formData.password.trim()) {
      tempErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(tempErrors);
    if (isValid) {
      checkLogin(event);
    }
  };

  const registerNewUser = (e) => {
    navigate('/Register');
  }
  // --- END OF UNCHANGED LOGIC ---


  // --- 3. THE RENDERED JSX (NEW DESIGN) ---
  return (
    <div style={styles.container}>
      
      {/* 1. Branding Side */}
      {/* This inline media query is a simple way to handle responsiveness 
          without a full CSS-in-JS library */}
      <style>
        {`
          @media (max-width: 768px) {
            .brand-panel-responsive {
              display: none !important;
            }
          }
        `}
      </style>
      <div style={styles.brandPanel} className="brand-panel-responsive">
        <div>
          <h1 style={styles.brandTitle}>SmartShelfX</h1>
          <p style={styles.brandSubtitle}>AI-Based Inventory Forecast & Auto-Restock</p>
        </div>
      </div>

      {/* 2. Form Side */}
      <div style={styles.formPanel}>
        <div style={styles.formContainer}>
          <div style={styles.formCard}>
            
            <h2 style={styles.formTitle}>Login</h2>

            <form onSubmit={handleValidation} noValidate>
              
              {/* Username Input */}
              <div style={styles.formGroup}>
                <label htmlFor="username" style={styles.label}>User Name</label>
                <div style={{
                  ...styles.inputGroup,
                  ...(isUsernameFocused ? styles.inputGroupFocus : {}),
                  ...(errors.username ? styles.inputError : {})
                }}>
                  <span style={styles.inputIcon}><Person size={20} /></span>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    style={styles.input}
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={onChangeHandler}
                    onFocus={() => setUsernameFocused(true)}
                    onBlur={() => setUsernameFocused(false)}
                  />
                </div>
                {errors.username && <div style={styles.errorText}>{errors.username}</div>}
              </div>

              {/* Password Input */}
              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>Password</label>
                <div style={{
                  ...styles.inputGroup,
                  ...(isPasswordFocused ? styles.inputGroupFocus : {}),
                  ...(errors.password ? styles.inputError : {})
                }}>
                  <span style={styles.inputIcon}><Lock size={20} /></span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    style={styles.input}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={onChangeHandler}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                </div>
                {errors.password && <div style={styles.errorText}>{errors.password}</div>}
              </div>

              {/* Submit Button */}
              <div style={{...styles.formGroup, marginTop: '2rem'}}>
                <button
                  type="submit"
                  style={styles.submitButton}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = styles.submitButtonHover.backgroundColor}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = styles.submitButton.backgroundColor}
                >
                  Login
                </button>
              </div>
            </form>

            {/* Register Section */}
            <div style={styles.registerSection}>
              <p style={styles.registerText}>Don't have an account?</p>
              <button
                style={styles.registerButton}
                onClick={registerNewUser}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = styles.registerButtonHover.backgroundColor;
                  e.currentTarget.style.color = styles.registerButtonHover.color;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = styles.registerButton.backgroundColor;
                  e.currentTarget.style.color = styles.registerButton.color;
                }}
              >
                Register New User
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;