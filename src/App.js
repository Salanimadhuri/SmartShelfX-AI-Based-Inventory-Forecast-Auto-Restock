import { BrowserRouter, Routes, Route } from "react-router-dom";
import VendorMenu from "./Components/LoginComponent/VendorMenu";
import LoginPage from "./Components/LoginComponent/LoginPage";
import RegisterUser from "./Components/LoginComponent/RegisterUser";
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
import EditStock from "./Components/ProductComponent/EditStock"; // ✅ Import added
import TransactionReport from "./Components/ProductComponent/TransactionReport";
import AllProductAnalysis from "./Components/ProductComponent/AllProductAnalysis";
import SingleProductDemand from "./Components/ProductComponent/SingleProductDemand";


// inside <Routes>


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path="/Register" element={<RegisterUser />} />
          <Route path="/ShowSingleUser" element={<ShowSingleUser />} />
          <Route path="/AdminMenu" element={<AdminMenu />} />
          <Route path="/ManagerMenu" element={<ManagerMenu />} />
          <Route path="/VendorMenu" element={<VendorMenu />} />
          <Route path="/SkuAdd" element={<SKUAddition />} />
          <Route path="/SkuRepo" element={<SKUReport />} />
          <Route path="/update-sku/:id" element={<SKUUpdate />} />
          <Route path="/view-product/:pid" element={<ViewProduct />} />
          <Route path="/ProductAdd" element={<ProductAddition />} />
          <Route path="/AdProdRepo" element={<AdminProductReport />} />
          <Route path="/MngProdRepo" element={<ManagerProductReport />} />
          <Route path="/update-price/:id" element={<EditProductPrice />} />
              <Route path="/Transactions" element={<TransactionReport />} />
          <Route path="/AllProductAnalysis" element={<AllProductAnalysis />} />

   {/* ✅ New routes for issuing & purchasing stock */}
          <Route path="/issue-product/:id" element={<EditStock mode="issue" />} />
          <Route path="/purchase-product/:id" element={<EditStock mode="purchase" />} />
          <Route path="/SingleProductDemand" element={<SingleProductDemand />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
