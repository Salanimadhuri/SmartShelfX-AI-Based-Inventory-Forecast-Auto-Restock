/**
 * AIService.jsx
 * Placeholder AI service — derive insights from existing product/transaction data.
 * When a real Python FastAPI or Spring Boot AI endpoint is ready,
 * replace the computation logic below with actual API calls.
 */

/** Compute AI inventory insights from product list */
export const getInventoryInsights = (products) => {
  if (!products || products.length === 0) return null;

  const total = products.length;
  const lowStock = products.filter((p) => p.stock <= p.reorderLevel);
  const healthyStock = products.filter((p) => p.stock > p.reorderLevel * 2);
  const criticalStock = products.filter((p) => p.stock === 0 || p.stock < p.reorderLevel * 0.5);

  const healthScore = Math.round(((total - lowStock.length) / total) * 100);
  const avgStock = Math.round(products.reduce((s, p) => s + p.stock, 0) / total);

  // Sort by stock descending (fast moving = high stock turnover; we approximate by high reorder)
  const fastMoving = [...products]
    .sort((a, b) => b.reorderLevel - a.reorderLevel)
    .slice(0, 3);
  const slowMoving = [...products]
    .sort((a, b) => a.reorderLevel - b.reorderLevel)
    .slice(0, 3);

  return {
    healthScore,
    totalProducts: total,
    lowStockCount: lowStock.length,
    criticalCount: criticalStock.length,
    healthyCount: healthyStock.length,
    avgStock,
    lowStockItems: lowStock,
    criticalItems: criticalStock,
    fastMoving,
    slowMoving,
  };
};

/** Compute AI transaction insights from transaction list */
export const getTransactionInsights = (transactions) => {
  if (!transactions || transactions.length === 0) return null;

  const issues = transactions.filter((t) => t.transactionType === "issue");
  const purchases = transactions.filter((t) => t.transactionType === "purchase");

  const totalRevenue = issues.reduce((s, t) => s + (t.transactionValue || 0), 0);
  const totalPurchaseCost = purchases.reduce((s, t) => s + (t.transactionValue || 0), 0);
  const grossProfit = totalRevenue - totalPurchaseCost;

  // Group by product
  const productSales = {};
  issues.forEach((t) => {
    productSales[t.productId] = (productSales[t.productId] || 0) + (t.quantity || 0);
  });

  // Sort products by quantity sold
  const sorted = Object.entries(productSales).sort((a, b) => b[1] - a[1]);
  const topProduct = sorted[0];
  const bottomProduct = sorted[sorted.length - 1];

  // Recent 7 days vs previous 7 days
  const now = new Date();
  const last7 = new Date(now); last7.setDate(now.getDate() - 7);
  const prev7 = new Date(now); prev7.setDate(now.getDate() - 14);

  const recentIssues = issues.filter((t) => new Date(t.transactionDate) >= last7);
  const previousIssues = issues.filter(
    (t) => new Date(t.transactionDate) >= prev7 && new Date(t.transactionDate) < last7
  );

  const recentQty = recentIssues.reduce((s, t) => s + (t.quantity || 0), 0);
  const prevQty = previousIssues.reduce((s, t) => s + (t.quantity || 0), 0);
  const demandChange = prevQty > 0 ? Math.round(((recentQty - prevQty) / prevQty) * 100) : 0;

  // Average daily transactions
  const avgDailyIssues = issues.length > 0 ? (recentQty / 7).toFixed(1) : 0;

  return {
    totalRevenue: totalRevenue.toFixed(2),
    totalPurchaseCost: totalPurchaseCost.toFixed(2),
    grossProfit: grossProfit.toFixed(2),
    profitMargin: totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0,
    totalTransactions: transactions.length,
    issueCount: issues.length,
    purchaseCount: purchases.length,
    topProduct,
    bottomProduct,
    demandChange,
    recentQty,
    prevQty,
    avgDailyIssues,
  };
};

/** Compute AI demand forecast insights for a single product */
export const getProductDemandInsights = (productName, demandData) => {
  if (!demandData || demandData.length === 0) return null;

  const avg = demandData.reduce((s, v) => s + v, 0) / demandData.length;
  const max = Math.max(...demandData);
  const min = Math.min(...demandData);
  const latest = demandData[demandData.length - 1];
  const previous = demandData.length > 1 ? demandData[demandData.length - 2] : avg;

  const trend = latest > previous ? "increasing" : latest < previous ? "decreasing" : "stable";
  const trendPct = previous > 0 ? Math.abs(((latest - previous) / previous) * 100).toFixed(1) : 0;

  // Simple linear forecast for next 7 days (slope of last 3 points)
  const slice = demandData.slice(-3);
  const slope = slice.length > 1 ? (slice[slice.length - 1] - slice[0]) / (slice.length - 1) : 0;
  const forecastNext = Math.max(0, Math.round(latest + slope));
  const forecastWeek = Math.max(0, Math.round(latest + slope * 7));

  // Days until restock needed (rough estimate based on avg daily demand)
  const daysOfStock = avg > 0 ? Math.round(max / avg) : "N/A";

  // Volatility
  const variance = demandData.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / demandData.length;
  const stdDev = Math.sqrt(variance);
  const volatility = avg > 0 ? ((stdDev / avg) * 100).toFixed(0) : 0;
  const isVolatile = volatility > 30;

  return {
    productName,
    avg: avg.toFixed(1),
    max,
    min,
    latest,
    trend,
    trendPct,
    forecastNext,
    forecastWeek,
    daysOfStock,
    volatility,
    isVolatile,
    dataPoints: demandData.length,
  };
};

/** Compute AI sales insights from product-wise sales data */
export const getSalesInsights = (salesData) => {
  if (!salesData || salesData.length === 0) return null;

  const total = salesData.reduce((s, p) => s + p.totalSalesValue, 0);
  const sorted = [...salesData].sort((a, b) => b.totalSalesValue - a.totalSalesValue);
  const topSeller = sorted[0];
  const bottomSeller = sorted[sorted.length - 1];

  // Concentration: top product share
  const topShare = total > 0 ? ((topSeller.totalSalesValue / total) * 100).toFixed(1) : 0;
  const isConcentrated = topShare > 50;

  // Revenue distribution
  const avgSales = total / salesData.length;
  const aboveAvg = salesData.filter((p) => p.totalSalesValue > avgSales);
  const belowAvg = salesData.filter((p) => p.totalSalesValue < avgSales);

  return {
    totalRevenue: total.toFixed(2),
    topSeller,
    bottomSeller,
    topShare,
    isConcentrated,
    avgSales: avgSales.toFixed(2),
    aboveAvgCount: aboveAvg.length,
    belowAvgCount: belowAvg.length,
    productCount: salesData.length,
    sorted,
  };
};
