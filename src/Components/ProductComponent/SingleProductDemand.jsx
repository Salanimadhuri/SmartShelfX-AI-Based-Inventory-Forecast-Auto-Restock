import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getAllProducts } from "../../Services/ProductService";
import { getDemandByProduct } from "../../Services/TransactionService";

// Chart.js registration
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

// Custom styles
const styles = {
  bg: {
    background: "radial-gradient(circle at 20% 40%, #e3f2fd 60%, #1976d2 120%)",
    minHeight: "100vh",
    padding: "2.5rem",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    width: "100%",
    maxWidth: "820px",
    background: "rgba(255,255,255,0.96)",
    boxShadow: "0 6px 50px 0 rgba(25, 118, 210, 0.18)",
    borderRadius: "18px",
    padding: "3rem 2.2rem 2.2rem",
    backdropFilter: "blur(3px)",
    animation: "fadeIn 0.9s cubic-bezier(.39,.575,.565,1.000)"
  },
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "scale(0.98)" },
    to: { opacity: 1, transform: "scale(1)" }
  },
  title: {
    textAlign: "center",
    color: "#1565c0",
    fontWeight: "bold",
    fontSize: "2rem",
    marginBottom: "7px",
    letterSpacing: "2px"
  },
  subtitle: {
    color: "#1976d2",
    marginBottom: "24px",
    fontWeight: "500"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    marginBottom: "26px"
  },
  label: {
    fontWeight: "600",
    color: "#1565c0",
    fontSize: "1.07rem",
    marginBottom: "4px"
  },
  select: {
    padding: "11px 24px 11px 12px",
    borderRadius: "10px",
    border: "2px solid #1976d2",
    background: "#e3f2fd",
    fontWeight: "500",
    color: "#1565c0",
    boxShadow: "0 1px 4px #90caf9",
    fontSize: "1.08rem",
    outline: "none",
    minWidth: "250px",
    cursor: "pointer"
  },
  chartTitle: {
    color: "#1976d2",
    marginBottom: "14px",
    fontWeight: "700",
    fontSize: "1.15rem",
    textShadow: "0 1px 3px #bbdefb"
  },
  infoText: {
    color: "#455a64",
    fontSize: "1.09rem"
  },
  errorText: {
    color: "#d32f2f",
    fontSize: "1.08rem",
    marginBottom: "12px",
    fontWeight: "500"
  },
  buttonGroup: {
    textAlign: "center",
    marginTop: "48px"
  },
  button: {
    backgroundColor: "#388e3c",
    border: "none",
    padding: "12px 30px",
    borderRadius: "10px",
    fontWeight: "700",
    color: "white",
    fontSize: "1.08rem",
    cursor: "pointer",
    boxShadow: "0 3px 18px rgba(56,142,60,0.13)",
    transition: "all 0.22s",
    letterSpacing: "1px"
  },
  buttonHover: {
    backgroundColor: "#1976d2"
  },
  skeleton: {
    background: "linear-gradient(90deg, #e3f2fd 25%, #bbdefb 50%, #e3f2fd 75%)",
    minHeight: "40px",
    borderRadius: "10px",
    marginBottom: "14px",
    animation: "pulse 1.8s infinite"
  },
  "@keyframes pulse": {
    "0%": { opacity: 0.7 },
    "50%": { opacity: 1 },
    "100%": { opacity: 0.7 }
  }
};


// Utility for skeleton loader
const Skeleton = ({ height = 40 }) => (
  <div style={{ ...styles.skeleton, height: `${height}px` }} />
);

const SingleProductDemand = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [demandData, setDemandData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchingProducts, setFetchingProducts] = useState(true);
  const navigate = useNavigate();

  // Fetch product data on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setFetchingProducts(true);
      try {
        const response = await getAllProducts();
        setProducts(response.data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setFetchingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // On dropdown change fetch demand data
  const handleProductChange = async (event) => {
    const productId = event.target.value;
    setSelectedProduct(productId);
    setError("");
    setDemandData([]);

    if (productId) {
      setLoading(true);
      try {
        const response = await getDemandByProduct(productId);
        setDemandData(response.data);
      } catch (err) {
        setError("Failed to load demand data");
      } finally {
        setLoading(false);
      }
    }
  };

  // Chart data setup
  const chartData = {
    labels: demandData.map((_, i) => `T${i + 1}`),
    datasets: [
      {
        label: "Product Demand (Quantity)",
        data: demandData,
        borderColor: "#1976d2",
        backgroundColor: "rgba(25, 118, 210, 0.11)",
        fill: true,
        tension: 0.42,
        pointRadius: 6,
        pointBackgroundColor: "#0d47a1",
      },
    ],
  };

  // Chart options (for realistic UX)
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: { color: "#1976d2", font: { size: 15 } }
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (ctx) => `Qty: ${ctx.parsed.y}`,
        }
      }
    },
    elements: {
      line: { borderWidth: 3 },
      point: { hitRadius: 9 }
    },
    scales: {
      x: {
        ticks: { color: "#1976d2", font: { size: 14, weight: "bold" } },
        grid: { display: false }
      },
      y: {
        ticks: { color: "#1976d2", font: { size: 14, weight: "bold" } },
        grid: { borderDash: [4,4], color: "#bbdefb" }
      }
    }
  };
  const returnBack = () => {
  navigate("/AdminMenu");
};


  // Render Logic
  const renderChartArea = () => {
    if (loading) return <Skeleton height={320} />;
    if (error) return <div style={styles.errorText}>{error}</div>;
    if (demandData.length > 0) {
      const prod = products.find((p) => p.productId === selectedProduct);
      return (
        <div>
          <h4 style={styles.chartTitle}>
            Demand Trend for {prod?.productName || "Product"}
          </h4>
          <Line data={chartData} options={chartOptions} />
        </div>
      );
    }
    
    return (
      <div style={styles.infoText}>
        {selectedProduct ? "No demand data found for selected product." : "Select a product to view demand trend."}
      </div>
    );
  };

  // Return button hover handler
  const [isBtnHovered, setBtnHovered] = useState(false);

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        {/* Title */}
        <h2 style={styles.title}>📊 Single Product Demand</h2>
        <p style={styles.subtitle}>
          Quickly analyze demand trends for your products below.
        </p>

        {/* Product Dropdown */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Select Product</label>
          {fetchingProducts ?
            <Skeleton height={45} /> :
            <select
              style={styles.select}
              value={selectedProduct}
              onChange={handleProductChange}
            >
              <option value="">-- Choose a Product --</option>
              {products.map((p, i) => (
                <option key={i} value={p.productId}>{p.productName}</option>
              ))}
            </select>
          }
        </div>

        {/* Chart Area */}
        {renderChartArea()}

        {/* Return Button */}
        <div style={styles.buttonGroup}>
          <button
            style={{
              ...styles.button,
              ...(isBtnHovered ? styles.buttonHover : {})
            }}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            onClick={returnBack}
          >
             Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductDemand;
