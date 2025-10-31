import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProductPrice } from "../../Services/ProductService";

const EditProductPrice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productId: "",
    productName: "",
    productPrice: ""
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getProductById(id);
        setForm({
          productId: data.productId ?? "",
          productName: data.productName ?? "",
          productPrice: data.productPrice ?? "",
            status: true, 
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load product.");
      }
    };
    if (id) load();
  }, [id]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, productPrice: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProductPrice(id, form.productPrice);
      alert("Price updated successfully.");
      navigate("/AdProdRepo");
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa" // 🔹 light background like in your photo
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "400px",
          textAlign: "center"
        }}
      >
        <h2
          style={{
            marginBottom: "1.5rem",
            color: "#007bff",
            fontWeight: "700",
            textDecoration: "underline",
            textUnderlineOffset: "6px"
          }}
        >
          Update Product Price
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label>Product ID:</label>
            <input
              type="text"
              className="form-control"
              value={form.productId}
              disabled
            />
          </div>

          <div className="mb-3 text-start">
            <label>Product Name:</label>
            <input
              type="text"
              className="form-control"
              value={form.productName}
              disabled
            />
          </div>

          <div className="mb-3 text-start">
            <label>Product Price:</label>
            <input
              type="number"
              className="form-control"
              value={form.productPrice}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#28a745",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                marginRight: "10px",
                fontWeight: "bold"
              }}
            >
              Update Product Price
            </button>

            <button
              type="button"
              onClick={() => navigate("/AdProdRepo")}
              style={{
                backgroundColor: "#6c757d",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold"
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPrice;
