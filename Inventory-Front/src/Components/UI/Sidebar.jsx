/**
 * Sidebar — Enterprise left navigation sidebar
 * Props: role ("Admin"|"Manager"|"Vendor"), activePath
 */
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BoxSeam, TagFill, ClipboardData, PlusCircle, BarChartLine,
  GraphUp, CreditCard, ArrowUpCircle, ArrowDownCircle,
  PersonCircle, HouseDoor, ChevronDown, ChevronRight,
  ShieldLock, PersonBadge, Truck, FileEarmarkArrowDown,
  FileEarmarkArrowUp, CalendarEvent, GraphUpArrow,
} from "react-bootstrap-icons";
import "./EnterpriseStyles.css";

const NAV_CONFIG = {
  Admin: [
    {
      section: "Overview",
      items: [
        { label: "Dashboard", href: "/AdminMenu", icon: <HouseDoor size={15} /> },
      ],
    },
    {
      section: "Inventory",
      items: [
        {
          label: "SKU", icon: <TagFill size={15} />,
          children: [
            { label: "SKU List", href: "/SkuRepo?from=admin", icon: <ClipboardData size={13} /> },
            { label: "Add SKU",  href: "/SkuAdd",             icon: <PlusCircle    size={13} /> },
          ],
        },
        {
          label: "Products", icon: <BoxSeam size={15} />,
          children: [
            { label: "Product List",    href: "/AdProdRepo",          icon: <ClipboardData size={13} /> },
            { label: "Add Product",     href: "/ProductAdd",          icon: <PlusCircle    size={13} /> },
            { label: "Sales Analysis",  href: "/AllProductAnalysis",  icon: <BarChartLine  size={13} /> },
            { label: "Demand Forecast", href: "/SingleProductDemand", icon: <GraphUp       size={13} /> },
          ],
        },
        {
          label: "Transactions", icon: <CreditCard size={15} />,
          children: [
            { label: "All Transactions", href: "/Transactions",              icon: <CreditCard      size={13} /> },
            { label: "Issue History",    href: "/Transactions?type=issue",   icon: <ArrowUpCircle   size={13} /> },
            { label: "Purchase History", href: "/Transactions?type=purchase",icon: <ArrowDownCircle size={13} /> },
          ],
        },
        {
          label: "Purchase Orders", icon: <FileEarmarkArrowDown size={15} />,
          children: [
            { label: "All Orders",  href: "/PurchaseOrders",     icon: <ClipboardData  size={13} /> },
            { label: "New Order",   href: "/PurchaseOrders/new", icon: <PlusCircle     size={13} /> },
          ],
        },
        {
          label: "Batch & Expiry", icon: <CalendarEvent size={15} />,
          children: [
            { label: "Batch Records", href: "/Batches",     icon: <ClipboardData size={13} /> },
            { label: "Add Batch",     href: "/Batches/new", icon: <PlusCircle    size={13} /> },
          ],
        },
      ],
    },
    {
      section: "Analytics",
      items: [
        { label: "Inventory Valuation", href: "/Valuation",    icon: <BarChartLine    size={15} /> },
        { label: "ABC Analysis",        href: "/AbcAnalysis",  icon: <GraphUpArrow    size={15} /> },
        { label: "Import / Export",     href: "/ImportExport", icon: <FileEarmarkArrowUp size={15} /> },
      ],
    },
    {
      section: "Account",
      items: [
        { label: "My Profile", href: "/ShowSingleUser", icon: <PersonCircle size={15} /> },
      ],
    },
  ],
  Manager: [
    {
      section: "Overview",
      items: [
        { label: "Dashboard", href: "/ManagerMenu", icon: <HouseDoor size={15} /> },
      ],
    },
    {
      section: "Inventory",
      items: [
        {
          label: "SKU", icon: <TagFill size={15} />,
          children: [
            { label: "SKU List", href: "/SkuRepo?from=manager", icon: <ClipboardData size={13} /> },
          ],
        },
        {
          label: "Products", icon: <BoxSeam size={15} />,
          children: [
            { label: "Product List", href: "/MngProdRepo", icon: <ClipboardData size={13} /> },
          ],
        },
        {
          label: "Transactions", icon: <CreditCard size={15} />,
          children: [
            { label: "All Transactions", href: "/Transactions",               icon: <CreditCard      size={13} /> },
            { label: "Issue History",    href: "/Transactions?type=issue",    icon: <ArrowUpCircle   size={13} /> },
            { label: "Purchase History", href: "/Transactions?type=purchase", icon: <ArrowDownCircle size={13} /> },
          ],
        },
        {
          label: "Purchase Orders", icon: <FileEarmarkArrowDown size={15} />,
          children: [
            { label: "All Orders", href: "/PurchaseOrders",     icon: <ClipboardData size={13} /> },
            { label: "New Order",  href: "/PurchaseOrders/new", icon: <PlusCircle    size={13} /> },
          ],
        },
        {
          label: "Batch & Expiry", icon: <CalendarEvent size={15} />,
          children: [
            { label: "Batch Records", href: "/Batches",     icon: <ClipboardData size={13} /> },
            { label: "Add Batch",     href: "/Batches/new", icon: <PlusCircle    size={13} /> },
          ],
        },
      ],
    },
    {
      section: "Analytics",
      items: [
        { label: "Inventory Valuation", href: "/Valuation",    icon: <BarChartLine    size={15} /> },
        { label: "ABC Analysis",        href: "/AbcAnalysis",  icon: <GraphUpArrow    size={15} /> },
        { label: "Import / Export",     href: "/ImportExport", icon: <FileEarmarkArrowUp size={15} /> },
      ],
    },
    {
      section: "Account",
      items: [
        { label: "My Profile", href: "/ShowSingleUser", icon: <PersonCircle size={15} /> },
      ],
    },
  ],
  Vendor: [
    {
      section: "Account",
      items: [
        { label: "Dashboard",  href: "/VendorMenu",     icon: <HouseDoor   size={15} /> },
        { label: "My Profile", href: "/ShowSingleUser", icon: <PersonCircle size={15} /> },
      ],
    },
  ],
};

const ROLE_ICONS = {
  Admin:   <ShieldLock size={13} />,
  Manager: <PersonBadge size={13} />,
  Vendor:  <Truck size={13} />,
};

export default function Sidebar({ role = "Admin" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const sections = NAV_CONFIG[role] || NAV_CONFIG.Admin;

  const currentPath = location.pathname + location.search;
  const isActive = (href) => href && currentPath === href;

  // Track which parent items are expanded
  const [expanded, setExpanded] = useState(() => {
    const init = {};
    sections.forEach((sec) => {
      sec.items.forEach((item) => {
        if (item.children) {
          const anyActive = item.children.some((c) => currentPath === c.href);
          if (anyActive) init[item.label] = true;
        }
      });
    });
    return init;
  });

  const toggle = (label) => setExpanded((p) => ({ ...p, [label]: !p[label] }));

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInRole");
    navigate("/");
  };

  return (
    <nav className="ent-sidebar">
      {/* Logo */}
      <a href={role === "Admin" ? "/AdminMenu" : role === "Manager" ? "/ManagerMenu" : "/VendorMenu"}
        className="ent-sidebar-logo" style={{ textDecoration: "none" }}>
        <div className="ent-sidebar-logo-icon">
          <BoxSeam size={16} color="#fff" />
        </div>
        <span className="ent-sidebar-logo-text">
          Smart<span>ShelfX</span>
        </span>
      </a>

      {/* Role badge */}
      <div style={{ padding: "8px 16px" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "#f0f4ff", color: "#3b5bdb", border: "1px solid #c5d0fa",
          borderRadius: 6, padding: "3px 8px", fontSize: "0.75rem", fontWeight: 600,
        }}>
          {ROLE_ICONS[role]} {role}
        </span>
      </div>

      {/* Nav sections */}
      <div style={{ flex: 1, padding: "4px 8px", overflowY: "auto" }}>
        {sections.map((sec) => (
          <div key={sec.section} className="ent-sidebar-section">
            <div className="ent-sidebar-section-label">{sec.section}</div>
            {sec.items.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    className={`ent-nav-item${item.children.some(c => isActive(c.href)) ? " active" : ""}`}
                    onClick={() => toggle(item.label)}
                    style={{ justifyContent: "space-between" }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      {item.icon} {item.label}
                    </span>
                    {expanded[item.label]
                      ? <ChevronDown size={12} style={{ opacity: 0.5 }} />
                      : <ChevronRight size={12} style={{ opacity: 0.5 }} />}
                  </button>
                  {expanded[item.label] && (
                    <div className="ent-nav-sub">
                      {item.children.map((child) => (
                        <a key={child.href} href={child.href}
                          className={`ent-nav-item${isActive(child.href) ? " active" : ""}`}
                          style={{ textDecoration: "none" }}>
                          {child.icon} {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a key={item.label} href={item.href}
                  className={`ent-nav-item${isActive(item.href) ? " active" : ""}`}
                  style={{ textDecoration: "none" }}>
                  {item.icon} {item.label}
                </a>
              )
            )}
          </div>
        ))}
      </div>

      {/* Bottom logout */}
      <div className="ent-sidebar-bottom">
        <button className="ent-nav-item" onClick={handleLogout}
          style={{ color: "#dc2626", width: "100%" }}>
          <ArrowUpCircle size={15} /> Sign out
        </button>
      </div>
    </nav>
  );
}
