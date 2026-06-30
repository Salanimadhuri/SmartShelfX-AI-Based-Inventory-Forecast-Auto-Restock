import { BrowserRouter, Routes, Route } from "react-router-dom";
import VendorMenu from "./Components/LoginComponent/VendorMenu";
import LoginPage from "./Components/LoginComponent/LoginPage";
import RegisterUser from "./Components/LoginComponent/RegisterUser";
import ResetPasswordPage from "./Components/LoginComponent/ResetPasswordPage";
import OAuth2Callback   from "./Components/LoginComponent/OAuth2Callback";
import AdminMenu from "./Components/LoginComponent/AdminMenu";
import ManagerMenu from "./Components/LoginComponent/ManagerMenu";
import ShowSingleUser from "./Components/LoginComponent/ShowSingleUser";
import './App.css';
import SKUAddition from "./Components/SKUComponent/SKUAddition";
import SKUReport from "./Components/SKUComponent/SKUReport";
import SKUUpdate from "./Components/SKUComponent/SKUUpdate";
import ViewProduct from "./Components/ProductComponent/ViewProduct";
import AdminProductReport from "./Components/ProductComponent/AdminProductReport";
import ManagerProductReport from "./Components/ProductComponent/ManagerProductReport";
import ProductAddition from "./Components/ProductComponent/ProductAddition";
import EditProductPrice from "./Components/ProductComponent/EditProductPrice";
import EditStock from "./Components/ProductComponent/EditStock";
import TransactionReport from "./Components/ProductComponent/TransactionReport";
import AllProductAnalysis from "./Components/ProductComponent/AllProductAnalysis";
import SingleProductDemand from "./Components/ProductComponent/SingleProductDemand";
// Feature 1 — Purchase Orders
import PurchaseOrderList   from "./Components/PurchaseOrders/PurchaseOrderList";
import PurchaseOrderForm   from "./Components/PurchaseOrders/PurchaseOrderForm";
import PurchaseOrderDetail from "./Components/PurchaseOrders/PurchaseOrderDetail";
// Feature 2 — Batch & Expiry
import BatchList from "./Components/Batches/BatchList";
import BatchForm from "./Components/Batches/BatchForm";
// Feature 3 & 4 — Analytics
import InventoryValuation from "./Components/Analytics/InventoryValuation";
import AbcAnalysis        from "./Components/Analytics/AbcAnalysis";
// Feature 5 — Import/Export
import ImportExportPage from "./Components/ImportExport/ImportExportPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path='/' element={<LoginPage />} />
          <Route path="/Register" element={<RegisterUser />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/oauth2/callback" element={<OAuth2Callback />} />
          <Route path="/ShowSingleUser" element={<ShowSingleUser />} />
          {/* Dashboards */}
          <Route path="/AdminMenu"   element={<AdminMenu />} />
          <Route path="/ManagerMenu" element={<ManagerMenu />} />
          <Route path="/VendorMenu"  element={<VendorMenu />} />
          {/* SKU */}
          <Route path="/SkuAdd"          element={<SKUAddition />} />
          <Route path="/SkuRepo"         element={<SKUReport />} />
          <Route path="/update-sku/:id"  element={<SKUUpdate />} />
          {/* Products */}
          <Route path="/view-product/:pid"        element={<ViewProduct />} />
          <Route path="/ProductAdd"               element={<ProductAddition />} />
          <Route path="/AdProdRepo"               element={<AdminProductReport />} />
          <Route path="/MngProdRepo"              element={<ManagerProductReport />} />
          <Route path="/update-price/:id"         element={<EditProductPrice />} />
          <Route path="/issue-product/:id"        element={<EditStock mode="issue" />} />
          <Route path="/purchase-product/:id"     element={<EditStock mode="purchase" />} />
          {/* Transactions */}
          <Route path="/Transactions" element={<TransactionReport />} />
          {/* Analysis */}
          <Route path="/AllProductAnalysis"  element={<AllProductAnalysis />} />
          <Route path="/SingleProductDemand" element={<SingleProductDemand />} />
          {/* Feature 1 — Purchase Orders */}
          <Route path="/PurchaseOrders"         element={<PurchaseOrderList />} />
          <Route path="/PurchaseOrders/new"     element={<PurchaseOrderForm />} />
          <Route path="/PurchaseOrders/:id"     element={<PurchaseOrderDetail />} />
          <Route path="/PurchaseOrders/:id/edit" element={<PurchaseOrderForm />} />
          {/* Feature 2 — Batches */}
          <Route path="/Batches"     element={<BatchList />} />
          <Route path="/Batches/new" element={<BatchForm />} />
          {/* Feature 3 & 4 — Analytics */}
          <Route path="/Valuation"   element={<InventoryValuation />} />
          <Route path="/AbcAnalysis" element={<AbcAnalysis />} />
          {/* Feature 5 — Import / Export */}
          <Route path="/ImportExport" element={<ImportExportPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
