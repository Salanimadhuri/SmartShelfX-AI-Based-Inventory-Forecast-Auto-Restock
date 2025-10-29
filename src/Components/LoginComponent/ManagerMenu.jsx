import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const ManagerMenu = () => {
  return (
    <div className=".container" style={{ background: "linear-gradient(to bottom right, #f1f8e9, #dcedc8, #c5e1a5)", minHeight: "100vh" }}>
      <br />

      {/* Header Section */}
      <div align="center" style={{ backgroundColor: '#e8f5e9', padding: '15px 0', borderBottom: '3px solid #33691e' }}>
        <h1 className="text-center" style={{ color: '#1b5e20', fontFamily: "'Poppins', sans-serif", fontWeight: '600', letterSpacing: '1px' }}>
          <u><i>Inventory Manager Menu</i></u>
        </h1>
      </div>

      {/* Navigation Bar */}
      <Navbar expand="lg" style={{ background: 'linear-gradient(90deg, #81c784, #66bb6a, #4caf50)', boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)' }}>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" style={{ fontWeight: "500" }}>

            {/* SKU Dropdown */}
            <NavDropdown title="SKU" id="collasible-nav-dropdown-sku">
              <NavDropdown.Item href="/SkuRepo?from=manager">SKU List</NavDropdown.Item>
            </NavDropdown>

            {/* Product Dropdown */}
            <NavDropdown title="Product" id="collasible-nav-dropdown-product">
              <NavDropdown.Item href="MngProdRepo">Product List</NavDropdown.Item>
              <NavDropdown.Item href="">Product Analysis</NavDropdown.Item>
            </NavDropdown>

             {/* Transaction Dropdown */}
             <NavDropdown title="Transaction" id="collasible-nav-dropdown">
              <NavDropdown.Item href="/Transactions?type=issue">
                Issued History
              </NavDropdown.Item>

              <NavDropdown.Item href="/Transactions?type=purchase">
                Purchase History
              </NavDropdown.Item>

              <NavDropdown.Item href="/Transactions">
                Transaction History
              </NavDropdown.Item>
            </NavDropdown>

            {/* User Details Link */}
            <Nav.Link href="/ShowSingleUser" style={{ color: "white", fontWeight: "600", textShadow: "1px 1px 3px #1b5e20" }}>
              Show User Details
            </Nav.Link>

            {/* Logout Link */}
            <Nav.Link href="/" style={{ color: "white", fontWeight: "600", textShadow: "1px 1px 3px #1b5e20" }}>
              Logout
            </Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default ManagerMenu;