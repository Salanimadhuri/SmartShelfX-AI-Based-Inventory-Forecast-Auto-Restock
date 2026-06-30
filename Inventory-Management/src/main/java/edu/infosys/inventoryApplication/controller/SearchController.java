package edu.infosys.inventoryApplication.controller;

import edu.infosys.inventoryApplication.bean.Product;
import edu.infosys.inventoryApplication.bean.Transaction;
import edu.infosys.inventoryApplication.dao.ProductRepository;
import edu.infosys.inventoryApplication.dao.TransactionRepository;
import edu.infosys.inventoryApplication.dao.PurchaseOrderRepository;
import edu.infosys.inventoryApplication.bean.PurchaseOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/inventory/search")
public class SearchController {

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private TransactionRepository transactionRepo;

    @Autowired
    private PurchaseOrderRepository poRepo;

    /**
     * Global search across products, transactions, and purchase orders.
     * GET /inventory/search?q=keyword
     */
    @GetMapping
    public Map<String, Object> search(@RequestParam(name = "q", defaultValue = "") String query) {
        if (query == null || query.trim().length() < 1) {
            return Map.of("products", List.of(), "transactions", List.of(), "purchaseOrders", List.of(), "query", query);
        }

        String q = query.trim().toLowerCase();

        // ── Search products ──
        List<Map<String, Object>> products = productRepo.findAll().stream()
            .filter(p ->
                contains(p.getProductId(), q)   ||
                contains(p.getProductName(), q)  ||
                contains(p.getSku(), q)           ||
                contains(p.getVendorId(), q)
            )
            .limit(8)
            .map(p -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id",          p.getProductId());
                m.put("type",        "product");
                m.put("title",       p.getProductName());
                m.put("subtitle",    "SKU: " + nvl(p.getSku()) + " · Stock: " + nvl(p.getStock()) + " · Vendor: " + nvl(p.getVendorId()));
                m.put("href",        "/view-product/" + p.getProductId());
                m.put("status",      p.getStock() != null && p.getReorderLevel() != null && p.getStock() <= p.getReorderLevel() ? "low" : "ok");
                return m;
            })
            .collect(Collectors.toList());

        // ── Search transactions ──
        List<Map<String, Object>> transactions = transactionRepo.findAll().stream()
            .filter(t ->
                contains(String.valueOf(t.getTransactionId()), q) ||
                contains(t.getProductId(), q)                      ||
                contains(t.getTransactionType(), q)                ||
                contains(t.getUserId(), q)
            )
            .limit(5)
            .map(t -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id",       t.getTransactionId());
                m.put("type",     "transaction");
                m.put("title",    "Txn #" + t.getTransactionId() + " — " + nvl(t.getTransactionType()).toUpperCase());
                m.put("subtitle", "Product: " + nvl(t.getProductId()) + " · Qty: " + nvl(t.getQuantity()) + " · " + nvl(t.getTransactionDate()));
                m.put("href",     "/Transactions");
                return m;
            })
            .collect(Collectors.toList());

        // ── Search purchase orders ──
        List<Map<String, Object>> pos = poRepo.findAll().stream()
            .filter(po ->
                contains(po.getPoNumber(), q)  ||
                contains(po.getSupplierId(), q) ||
                contains(po.getStatus() != null ? po.getStatus().name() : null, q)
            )
            .limit(5)
            .map(po -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id",       po.getId());
                m.put("type",     "purchaseOrder");
                m.put("title",    "PO: " + po.getPoNumber());
                m.put("subtitle", "Supplier: " + nvl(po.getSupplierId()) + " · Status: " + (po.getStatus() != null ? po.getStatus().name() : ""));
                m.put("href",     "/PurchaseOrders/" + po.getId());
                return m;
            })
            .collect(Collectors.toList());

        // ── Navigation pages ──
        List<Map<String, Object>> pages = getPageMatches(q);

        return Map.of(
            "query",          query,
            "products",       products,
            "transactions",   transactions,
            "purchaseOrders", pos,
            "pages",          pages,
            "totalResults",   products.size() + transactions.size() + pos.size() + pages.size()
        );
    }

    private boolean contains(Object field, String q) {
        if (field == null) return false;
        return field.toString().toLowerCase().contains(q);
    }

    private String nvl(Object v) {
        return v == null ? "" : v.toString();
    }

    private List<Map<String, Object>> getPageMatches(String q) {
        List<Map<String, Object>> pages = new ArrayList<>();
        Map<String, String> nav = new LinkedHashMap<>();
        nav.put("dashboard",       "/AdminMenu");
        nav.put("products",        "/AdProdRepo");
        nav.put("product list",    "/AdProdRepo");
        nav.put("add product",     "/ProductAdd");
        nav.put("sku",             "/SkuRepo?from=admin");
        nav.put("sku list",        "/SkuRepo?from=admin");
        nav.put("transactions",    "/Transactions");
        nav.put("purchase orders", "/PurchaseOrders");
        nav.put("batches",         "/Batches");
        nav.put("valuation",       "/Valuation");
        nav.put("abc analysis",    "/AbcAnalysis");
        nav.put("import export",   "/ImportExport");
        nav.put("profile",         "/ShowSingleUser");
        nav.put("sales analysis",  "/AllProductAnalysis");
        nav.put("demand forecast", "/SingleProductDemand");

        for (Map.Entry<String, String> e : nav.entrySet()) {
            if (e.getKey().contains(q)) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("type",     "page");
                m.put("title",    capitalize(e.getKey()));
                m.put("subtitle", "Go to page");
                m.put("href",     e.getValue());
                pages.add(m);
            }
        }
        return pages.stream().limit(4).collect(Collectors.toList());
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }
}
