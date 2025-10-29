import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../../LoginView.css';
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const AllProductAnalysis = () => {
    let navigate = useNavigate();
    const [productSale, setProductSale] = useState([]);

    const setProductSalesData = () => {
        fetch("http://localhost:9898/inventory/analysis")
            .then((res) => res.json())
            .then((data) => {
                const formatted = Object.entries(data).map(([productName, totalSalesValue]) => ({
                    productName,
                    totalSalesValue,
                }));
                setProductSale(formatted);
            });
    };

    useEffect(() => {
        setProductSalesData();
    }, []);

    const chartData = {
        labels: productSale.map((p) => p.productName),
        datasets: [
            {
                data: productSale.map((p) => p.totalSalesValue),
                backgroundColor: [
                    "#ff6384",
                    "#36a2eb",
                    "#ffce56",
                    "#4bc0c0",
                    "#9966ff",
                    "#ff9f40",
                ],
            },
        ],
    };

    const returnBack = () => {
        navigate('/AdminMenu');
    };

    return (
        <div
            style={{
                background: "linear-gradient(to bottom right, #e3f2fd, #bbdefb, #90caf9)",
                minHeight: "100vh",
                fontFamily: "'Poppins', sans-serif",
                padding: "20px",
            }}
        >
            {/* Header */}
            <div
                align="center"
                style={{
                    backgroundColor: "#e1f5fe",
                    padding: "15px 0",
                    borderBottom: "3px solid #1976d2",
                    marginBottom: "30px",
                }}
            >
                <h1 style={{ color: "#0d47a1", fontWeight: "600", letterSpacing: "1px" }}>
                    <u><i>Product Sale Dashboard</i></u>
                </h1>
                <p style={{ color: "#1565c0" }}>
                    Overview of total sales for each produt (Purchased)
                </p>
            </div>

            {/* Table and Chart Section */}
            <div style={{ display: "flex", justifyContent: "center", gap: "80px", flexWrap: "wrap" }}>
                {/* Table Card */}
                <div
                    style={{
                        background: "white",
                        borderRadius: "12px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                        padding: "20px",
                        minWidth: "300px",
                    }}
                >
                    <h4 style={{ color: "#0d47a1", textAlign: "center", marginBottom: "15px" }}>
                        Product Sales Summary
                    </h4>
                    <table className="w-full border">
                        <thead>
                            <tr style={{ backgroundColor: "#bbdefb" }}>
                                <th className="border px-4 py-2">Product Name</th>
                                <th className="border px-4 py-2">Sales Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productSale.map((p, i) => (
                                <tr key={i} className="text-center hover:bg-blue-50">
                                    <td className="border px-4 py-2">{p.productName}</td>
                                    <td className="border px-4 py-2">{p.totalSalesValue.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Chart Card */}
                <div
                    style={{
                        background: "white",
                        borderRadius: "12px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                        padding: "20px",
                        maxWidth: "400px",
                        textAlign: "center",
                    }}
                >
                    <h4 style={{ color: "#0d47a1", marginBottom: "10px" }}>
                        Total Sale per Product
                    </h4>
                    <p style={{ fontSize: "14px", color: "#424242" }}>
                        Hover over each slice to see product sales distribution
                    </p>
                    <Pie data={chartData} />
                </div>
            </div>

            {/* Return Button */}
            <div style={{ textAlign: "center", marginTop: "40px" }}>
                <button
                    onClick={returnBack}
                    className="btn btn-success"
                    style={{
                        backgroundColor: "#388e3c",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontWeight: "600",
                        color: "white",
                        boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
                    }}
                >
                    Return
                </button>
            </div>
        </div>
    );
};

export default AllProductAnalysis;
