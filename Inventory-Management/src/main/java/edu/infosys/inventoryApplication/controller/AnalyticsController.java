package edu.infosys.inventoryApplication.controller;

import edu.infosys.inventoryApplication.bean.Product;
import edu.infosys.inventoryApplication.bean.Transaction;
import edu.infosys.inventoryApplication.dao.ProductRepository;
import edu.infosys.inventoryApplication.dao.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/inventory/")
public class AnalyticsController {

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private TransactionRepository transactionRepo;

    // ── Feature 3: Inventory Valuation ──
    @GetMapping("/analytics/valuation")
    public Map<String, Object> getValuation() {
        List<Product> products = productRepo.findAll();

        double totalValue = products.stream()
            .mapToDouble(p -> (p.getStock() != null ? p.getStock() : 0)
                            * (p.getPurchasePrice() != null ? p.getPurchasePrice() : 0))
            .sum();

        // Value by supplier (vendorId)
        Map<String, Double> bySupplier = products.stream()
            .collect(Collectors.groupingBy(
                p -> p.getVendorId() != null ? p.getVendorId() : "Unknown",
                Collectors.summingDouble(p ->
                    (p.getStock() != null ? p.getStock() : 0)
                    * (p.getPurchasePrice() != null ? p.getPurchasePrice() : 0))
            ));

        // Top 5 by value
        List<Map<String, Object>> topProducts = products.stream()
            .map(p -> {
                Map<String, Object> m = new LinkedHashMap<>();
                double val = (p.getStock() != null ? p.getStock() : 0)
                           * (p.getPurchasePrice() != null ? p.getPurchasePrice() : 0);
                m.put("productId", p.getProductId());
                m.put("productName", p.getProductName());
                m.put("stock", p.getStock());
                m.put("purchasePrice", p.getPurchasePrice());
                m.put("inventoryValue", val);
                return m;
            })
            .sorted((a, b) -> Double.compare((Double) b.get("inventoryValue"), (Double) a.get("inventoryValue")))
            .limit(5)
            .collect(Collectors.toList());

        // Bottom 5
        List<Map<String, Object>> bottomProducts = products.stream()
            .map(p -> {
                Map<String, Object> m = new LinkedHashMap<>();
                double val = (p.getStock() != null ? p.getStock() : 0)
                           * (p.getPurchasePrice() != null ? p.getPurchasePrice() : 0);
                m.put("productId", p.getProductId());
                m.put("productName", p.getProductName());
                m.put("stock", p.getStock());
                m.put("purchasePrice", p.getPurchasePrice());
                m.put("inventoryValue", val);
                return m;
            })
            .sorted(Comparator.comparingDouble(m -> (Double) m.get("inventoryValue")))
            .limit(5)
            .collect(Collectors.toList());

        // Per-product list for table
        List<Map<String, Object>> allValuation = products.stream()
            .map(p -> {
                Map<String, Object> m = new LinkedHashMap<>();
                double val = (p.getStock() != null ? p.getStock() : 0)
                           * (p.getPurchasePrice() != null ? p.getPurchasePrice() : 0);
                m.put("productId", p.getProductId());
                m.put("productName", p.getProductName());
                m.put("sku", p.getSku());
                m.put("vendorId", p.getVendorId());
                m.put("stock", p.getStock());
                m.put("purchasePrice", p.getPurchasePrice());
                m.put("inventoryValue", val);
                return m;
            })
            .sorted((a, b) -> Double.compare((Double) b.get("inventoryValue"), (Double) a.get("inventoryValue")))
            .collect(Collectors.toList());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalInventoryValue", totalValue);
        result.put("totalProducts", products.size());
        result.put("valueBySupplier", bySupplier);
        result.put("topProducts", topProducts);
        result.put("bottomProducts", bottomProducts);
        result.put("allProducts", allValuation);
        return result;
    }

    // ── Feature 4: ABC Analysis ──
    @GetMapping("/analytics/abc")
    public Map<String, Object> getAbcAnalysis() {
        List<Transaction> transactions = transactionRepo.findAll();
        List<Product> products = productRepo.findAll();

        // Sum revenue per product from issue transactions
        Map<String, Double> revenueByProduct = new HashMap<>();
        for (Transaction t : transactions) {
            if ("issue".equalsIgnoreCase(t.getTransactionType())) {
                revenueByProduct.merge(
                    t.getProductId(),
                    t.getTransactionValue() != null ? t.getTransactionValue() : 0.0,
                    Double::sum
                );
            }
        }

        double totalRevenue = revenueByProduct.values().stream().mapToDouble(Double::doubleValue).sum();

        // Sort products by revenue descending
        List<Map<String, Object>> sorted = products.stream()
            .map(p -> {
                Map<String, Object> m = new LinkedHashMap<>();
                double rev = revenueByProduct.getOrDefault(p.getProductId(), 0.0);
                double pct = totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0;
                m.put("productId", p.getProductId());
                m.put("productName", p.getProductName());
                m.put("sku", p.getSku());
                m.put("vendorId", p.getVendorId());
                m.put("revenue", rev);
                m.put("revenuePercent", Math.round(pct * 100.0) / 100.0);
                return m;
            })
            .sorted((a, b) -> Double.compare((Double) b.get("revenue"), (Double) a.get("revenue")))
            .collect(Collectors.toList());

        // Assign ABC class based on cumulative revenue %
        double cumulative = 0;
        for (Map<String, Object> item : sorted) {
            double pct = (Double) item.get("revenuePercent");
            cumulative += pct;
            String cls;
            if (cumulative <= 70) cls = "A";       // top ~70% of revenue = Class A
            else if (cumulative <= 90) cls = "B";   // next 20% = Class B
            else cls = "C";                          // remaining 10% = Class C
            item.put("abcClass", cls);
            item.put("cumulativePercent", Math.round(cumulative * 100.0) / 100.0);
        }

        long countA = sorted.stream().filter(m -> "A".equals(m.get("abcClass"))).count();
        long countB = sorted.stream().filter(m -> "B".equals(m.get("abcClass"))).count();
        long countC = sorted.stream().filter(m -> "C".equals(m.get("abcClass"))).count();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("products", sorted);
        result.put("totalRevenue", totalRevenue);
        result.put("countA", countA);
        result.put("countB", countB);
        result.put("countC", countC);
        result.put("totalProducts", sorted.size());
        return result;
    }

    // ── Feature 4: ABC for a date range ──
    @GetMapping("/analytics/abc/range")
    public Map<String, Object> getAbcForRange(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {
        // For simplicity delegate to full analysis (date filtering can be added with proper date parsing)
        return getAbcAnalysis();
    }
}
