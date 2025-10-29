import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const VendorMenu = () => {
  return (
    <div
      className=".container"
      style={{
        background: "linear-gradient(to bottom right, #f3e5f5, #e1bee7, #ce93d8)",
        minHeight: "100vh",
      }}
    >
      <br />

      {/* Header Section */}
      <div
        align="center"
        style={{
          backgroundColor: "#e1bee7",
          padding: "15px 0",
          borderBottom: "3px solid #8e24aa",
        }}
      >
        <h1
          className="text-center"
          style={{
            color: "#6a1b9a",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "600",
            letterSpacing: "1px",
          }}
        >
          <u><i>Inventory Vendor Menu</i></u>
        </h1>
      </div>

      {/* Navigation Bar */}
      <Navbar
        expand="lg"
        style={{
          background: "linear-gradient(90deg, #ba68c8, #ab47bc, #8e24aa)",
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" style={{ fontWeight: "500" }}>
            <Nav.Link href="/ShowSingleUser" style={{ color: "white" }}>
              <b>Show User Details</b>
            </Nav.Link>
            <Nav.Link href="/" style={{ color: "white" }}>
              <b>Logout</b>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default VendorMenu;
