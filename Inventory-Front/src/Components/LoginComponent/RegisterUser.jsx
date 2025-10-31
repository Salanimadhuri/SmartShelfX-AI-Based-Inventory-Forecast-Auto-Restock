import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../../LoginView.css';
import { registerNewUser } from '../../Services/LoginService';

const styles = {
  // Full-screen container
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem 1rem', // Added padding for smaller screens
    backgroundColor: '#f4f7fa', // Light grey background
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  // The card container (REDUCED WIDTH)
  cardContainer: {
    width: '100%',
    maxWidth: '500px', // This makes the form narrower
  },
  // The card itself
  formCard: {
    backgroundColor: '#ffffff',
    padding: '2rem', // Reduced padding
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
  // The "New User Registration" title
  formTitle: {
    textAlign: 'center',
    fontSize: '1.8rem', // Slightly smaller
    fontWeight: 'bold',
    color: '#0a192f', // Dark blue text
    marginBottom: '1.5rem',
    textDecoration: 'underline',
    fontStyle: 'italic',
  },
  
  // --- Form Elements ---
  formGroup: {
    marginBottom: '1rem', // Tighter spacing
  },
  label: {
    display: 'block',
    marginBottom: '0.4rem',
    fontWeight: '600',
    color: '#333',
    fontSize: '0.9rem',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  inputGroupFocus: {
     borderColor: '#007bff',
     boxShadow: '0 0 0 3px rgba(0,123,255,0.1)',
  },
  inputIcon: {
    padding: '0.6rem 0.75rem',
    color: '#666',
    borderRight: '1px solid #ccc',
  },
  input: {
    width: '100%',
    padding: '0.6rem 0.75rem', // Smaller height
    border: 'none',
    borderRadius: '0 8px 8px 0',
    fontSize: '0.9rem',
    outline: 'none',
  },
  // Style for the new <select> dropdown
  select: {
    width: '100%',
    padding: '0.6rem 0.75rem', // Smaller height
    border: 'none',
    borderRadius: '0 8px 8px 0',
    fontSize: '0.9rem',
    outline: 'none',
    backgroundColor: 'white',
    appearance: 'none', // Hides default dropdown arrow
  },
  submitButton: {
    width: '100%',
    padding: '0.7rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },

  // --- Back to Login Link ---
  backSection: {
    textAlign: 'center',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e0e0e0',
  },
  backButton: {
    backgroundColor: 'transparent',
    color: '#555',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  
  // --- Error Styling ---
  errorText: {
    color: '#dc3545',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
    paddingLeft: '0.25rem',
  },
  inputError: {
    borderColor: '#dc3545', // Red border for the whole group
  }
};
const RegisterUser = () => {

  const [inventoryUser, setInventoryUser] = useState({
    username: "",
    personalName: "",
    password: "",
    email: "",
    role: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  let navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const saveUser = (event) => {
    event.preventDefault();
    if (inventoryUser.password === confirmPassword) {
      registerNewUser(inventoryUser).then((response) => {
        alert("User is registered successfully...Go For Login");
        navigate('/');
      });
    }
  };
  const onChangeHandler = (event) => {
    event.persist();
    const name = event.target.name;
    const value = event.target.value;
    setInventoryUser(values => ({ ...values, [name]: value }));
  };
  const handleValidation = (event) => {
    event.preventDefault();
    let tempErrors = {};
    let isValid = true;

    if (!inventoryUser.username.trim()) {
      tempErrors.username = "User Name is required";
      isValid = false;
    }

    if (!inventoryUser.password.trim()) {
      tempErrors.password = "Password is required";
      isValid = false;
    }
    else if (inventoryUser.password.length < 5 || inventoryUser.passwordlength > 10) {
      tempErrors.password = "Password must be 5-10 characters long";
      isValid = false;
    }
    else if (inventoryUser.password !== confirmPassword) {
      tempErrors.password = "Both the passwords are not matched";
      isValid = false;
    }
    if (!inventoryUser.personalName.trim()) {
      tempErrors.personalName = "Personal Name is required";
      isValid = false;
    }
    if (!inventoryUser.email.trim()) {
      tempErrors.email = "Email is required";
      isValid = false;
    }
    else if (!emailPattern.test(inventoryUser.email)) {
      tempErrors.email = "Invalid Email Format";
      isValid = false;
    }
    if (!inventoryUser.role.trim()) {
      tempErrors.role = "Role is required";
      isValid = false;
    }
    if (!confirmPassword.trim()) {
      tempErrors.confirmPassword = "Confirm Password is required";
      isValid = false;
    }

    setErrors(tempErrors);
    if (isValid) {
      saveUser(event);
    }
  };
  return (
   <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
  <div className="row w-100 justify-content-center">
    <div className="col-md-6">
      <div className="card shadow p-4">
        <div className="card-body">
          <h2 className="text-center text-primary mb-4 fw-bold"><u>New User Registration</u></h2>
          <form method="post">
            <div className="form-group mb-3">
              <label>User Name:</label>
              <input
                placeholder="Enter your username"
                name="username"
                className="form-control"
                value={inventoryUser.username}
                onChange={(event) => onChangeHandler(event)}
              />
              {errors.username && <p className="text-danger">{errors.username}</p>}
            </div>

            <div className="form-group mb-3">
              <label>Password:</label>
              <input
               placeholder="Enter your password"
                type="password"
                name="password"
                className="form-control"
                value={inventoryUser.password}
                onChange={(event) => onChangeHandler(event)}
              />
              {errors.password && <p className="text-danger">{errors.password}</p>}
            </div>

            <div className="form-group mb-3">
              <label>Confirm Password:</label>
              <input
               placeholder="Confirm password"
                type="password"
                name="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword}</p>}
            </div>

            <div className="form-group mb-3">
              <label>User's Personal Name:</label>
              <input
                placeholder="Enter your personal name"
                name="personalName"
                className="form-control"
                value={inventoryUser.personalName}
                onChange={(event) => onChangeHandler(event)}
              />
              {errors.personalName && <p className="text-danger">{errors.personalName}</p>}
            </div>

            <div className="form-group mb-3">
              <label>User's Email ID:</label>
              <input
                placeholder="Enter your personal Email ID"
                name="email"
                className="form-control"
                value={inventoryUser.email}
                onChange={(event) => onChangeHandler(event)}
              />
              {errors.email && <p className="text-danger">{errors.email}</p>}
            </div>

            <div className="form-group mb-4">
              <label>Select Role:</label>
              <input
                list="types"
                name="role"
                className="form-control"
                value={inventoryUser.role}
                onChange={(event) => onChangeHandler(event)}
              />
              <datalist id="types">
                <option value="Manager" />
                <option value="Admin" />
                <option value="Vendor" />
              </datalist>
              {errors.role && <p className="text-danger">{errors.role}</p>}
            </div>

            <div className="text-center">
              <button className="btn btn-primary" onClick={handleValidation}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};
export default RegisterUser;