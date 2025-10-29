import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const AdminMenu = () => {
  return (
    <div
      className="container-fluid"
      style={{
        background: "linear-gradient(135deg, #e3f2fd 55%, #bbdefb 100%)",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Header Section */}
      <div
        align="center"
        style={{
          background: "linear-gradient(90deg, #1e88e5 65%, #1976d2 100%)",
          padding: "18px 0",
          color: "#fff",
          fontWeight: 800,
          fontSize: "2.05rem",
          letterSpacing: "1px",
          boxShadow: "0 4px 14px rgba(25, 118, 210, 0.15)",
          borderRadius: "0 0 22px 22px",
        }}
      >
        Inventory Admin Dashboard
      </div>

      {/* Navigation Bar */}
      <Navbar
        expand="lg"
        style={{
          background: "#fff",
          borderRadius: "0 0 13px 13px",
          margin: "28px auto 15px",
          boxShadow: "0 3px 18px rgba(21,101,192,0.12)",
          maxWidth: "90%",
          padding: "10px 22px",
        }}
      >
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav style={{ fontWeight: "400", width: "100%" }}>
            {/* SKU Dropdown */}
            <NavDropdown title="SKU" id="sku-nav-dropdown">
              <NavDropdown.Item href="/SkuRepo?from=admin">SKU List</NavDropdown.Item>
              <NavDropdown.Item href="/SkuAdd">SKU Addition</NavDropdown.Item>
            </NavDropdown>
            {/* Product Dropdown */}
            <NavDropdown title="Product" id="product-nav-dropdown">
              <NavDropdown.Item href="/AdProdRepo">Product List</NavDropdown.Item>
              <NavDropdown.Item href="/ProductAdd">Product Addition</NavDropdown.Item>
              <NavDropdown
                title="Product Analysis"
                id="product-analysis-dropdown"
                drop="end"
              >
                <NavDropdown.Item href="/AllProductAnalysis">All Product Sales</NavDropdown.Item>
                <NavDropdown.Item href="/SingleProductDemand">Single Product Demand</NavDropdown.Item>
              </NavDropdown>
            </NavDropdown>
            {/* Transaction Dropdown */}
            <NavDropdown title="Transaction" id="transaction-nav-dropdown">
              <NavDropdown.Item href="/Transactions?type=issue">Issued History</NavDropdown.Item>
              <NavDropdown.Item href="/Transactions?type=purchase">Purchase History</NavDropdown.Item>
              <NavDropdown.Item href="/Transactions">Transaction History</NavDropdown.Item>
            </NavDropdown>
            {/* Push Logout to far right */}
            <Nav.Link
              href="/"
              style={{
                color: "#fff",
                fontWeight: 600,
                background: "linear-gradient(90deg, #ef5350, #e53935 80%)",
                borderRadius: "8px",
                marginLeft: "auto",
                marginRight: "10px",
                textShadow: "1px 1px 3px #0d47a1",
                padding: "8px 16px",
                transition: "0.3s",
                display: "inline-block"
              }}
              onMouseOver={e => (e.target.style.background = "#c62828")}
              onMouseOut={e => (e.target.style.background = "linear-gradient(90deg, #ef5350, #e53935 80%)")}
            >
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Center Section (like a SaaS dashboard landing) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "40px auto 0",
          background: "#fff",
          maxWidth: "640px",
          borderRadius: "18px",
          boxShadow: "0 6px 24px 0 rgba(25, 118, 210, 0.11)",
          padding: "40px 34px 35px"
        }}
      >
        <img
          src="https://media.istockphoto.com/id/2238885639/photo/artificial-intelligence-concept-with-business-analytics-big-data-visualization-and-futuristic.jpg?s=2048x2048&w=is&k=20&c=Tf0wPxiHLF8z1uuTWqC30bTilVOcc18DZR-Nrr8DSpQ="
          alt="AI Inventory Analytics"
          style={{
            maxWidth: "340px",
            width: "99%",
            borderRadius: "15px",
            marginBottom: "22px",
            boxShadow: "0 2px 10px rgba(33,150,243,0.12)",
            objectFit: "cover"
          }}
        />
        <p
          style={{
            color: "#14518c",
            fontSize: "1.09rem",
            marginTop: "10px",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          Manage inventory, track SKUs &amp; products, get smart analytics, and automate restocking efficiently—all in one dashboard.
        </p>
      </div>
    </div>
  );
};

export default AdminMenu;
