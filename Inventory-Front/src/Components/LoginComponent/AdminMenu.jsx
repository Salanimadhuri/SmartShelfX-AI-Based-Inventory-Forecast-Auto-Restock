import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const AdminMenu = () => {
  return (
    <div
      className="container-fluid"
      style={{
        background: "linear-gradient(135deg, #f3f5ff 0%, #e8edff 100%)",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Header Section */}
      <div
        align="center"
        style={{
          background: "linear-gradient(90deg, #243b55 0%, #141e30 100%)",
          padding: "28px 0",
          color: "#fdd835",
          fontWeight: 800,
          fontSize: "2.5rem",
          letterSpacing: "1.5px",
          textShadow: "2px 2px 10px rgba(0,0,0,0.4)",
          borderBottom: "3px solid #fbc02d",
          boxShadow: "0 4px 20px rgba(36,59,85,0.4)",
        }}
      >
        SmartShelf<span style={{ color: "#ffffff" }}>FX</span>
      </div>

      {/* Navigation Bar */}
      <Navbar
        expand="lg"
        style={{
          background: "#ffffff",
          borderRadius: "14px",
          margin: "30px auto",
          boxShadow: "0 4px 25px rgba(0,0,0,0.08)",
          maxWidth: "88%",
          padding: "12px 24px",
        }}
      >
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav style={{ fontWeight: "500", width: "100%", fontSize: "1rem" }}>
            <NavDropdown title="SKU" id="sku-nav-dropdown">
              <NavDropdown.Item href="/SkuRepo?from=admin">SKU List</NavDropdown.Item>
              <NavDropdown.Item href="/SkuAdd">SKU Addition</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Product" id="product-nav-dropdown">
              <NavDropdown.Item href="/AdProdRepo">Product List</NavDropdown.Item>
              <NavDropdown.Item href="/ProductAdd">Product Addition</NavDropdown.Item>
              <NavDropdown title="Product Analysis" id="product-analysis-dropdown" drop="end">
                <NavDropdown.Item href="/AllProductAnalysis">All Product Sales</NavDropdown.Item>
                <NavDropdown.Item href="/SingleProductDemand">Single Product Demand</NavDropdown.Item>
              </NavDropdown>
            </NavDropdown>

            <NavDropdown title="Transaction" id="transaction-nav-dropdown">
              <NavDropdown.Item href="/Transactions?type=issue">Issued History</NavDropdown.Item>
              <NavDropdown.Item href="/Transactions?type=purchase">Purchase History</NavDropdown.Item>
              <NavDropdown.Item href="/Transactions">Transaction History</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              href="/ShowSingleUser"
              style={{
                color: "#283593",
                fontWeight: 600,
                marginLeft: "10px",
                marginRight: "auto",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.color = "#1a237e")}
              onMouseOut={(e) => (e.target.style.color = "#283593")}
            >
              Show User Details
            </Nav.Link>

            <Nav.Link
              href="/"
              style={{
                color: "#fff",
                fontWeight: 600,
                background: "linear-gradient(90deg, #fbc02d, #f57f17)",
                borderRadius: "10px",
                marginLeft: "auto",
                marginRight: "10px",
                textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
                padding: "8px 18px",
                transition: "0.3s",
                boxShadow: "0 3px 10px rgba(251,192,45,0.4)",
              }}
              onMouseOver={(e) =>
                (e.target.style.background = "linear-gradient(90deg, #f9a825, #f57f17)")
              }
              onMouseOut={(e) =>
                (e.target.style.background = "linear-gradient(90deg, #fbc02d, #f57f17)")
              }
            >
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Welcome Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          marginTop: "60px",
          textAlign: "center",
          gap: "70px",
        }}
      >
        <div style={{ maxWidth: "480px", textAlign: "left" }}>
          <h2 style={{ fontWeight: 700, color: "#141e30", marginBottom: "14px" }}>
            Welcome, Admin
          </h2>
          <p
            style={{
              color: "#555",
              lineHeight: "1.7",
              fontSize: "1.05rem",
            }}
          >
            Manage your <b>SmartShelfFX</b> dashboard effortlessly.
            Monitor stock levels, predict demand, and streamline your supply chain
            all from one intelligent, data-driven interface.
          </p>
        </div>

        {/* Updated Image Styling */}
        <div
          style={{
            position: "relative",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(36,59,85,0.3)",
            border: "3px solid rgba(36,59,85,0.15)",
            transition: "all 0.5s ease",
            maxWidth: "440px",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = "0 14px 40px rgba(36,59,85,0.45)";
            e.currentTarget.style.border = "3px solid #fbc02d";
            e.currentTarget.style.transform = "scale(1.03)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(36,59,85,0.3)";
            e.currentTarget.style.border = "3px solid rgba(36,59,85,0.15)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <img
            src="https://media.istockphoto.com/id/1333702066/photo/erp-hexagonal-touch-screen-concept.jpg?s=612x612&w=0&k=20&c=s1SZKDlIZIPBYamiTwIR2t-74F53B84EpTTRNjA1nQE="
            alt="SmartShelfFX Dashboard"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
