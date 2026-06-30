package edu.infosys.inventoryApplication.controller;

import edu.infosys.inventoryApplication.bean.Product;
import edu.infosys.inventoryApplication.dao.ProductRepository;
import edu.infosys.inventoryApplication.dao.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/inventory/notifications")
public class NotificationController {

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private TransactionRepository transactionRepo;

    // In-memory store (survives per JVM session — sufficient for H2 in-memory DB)
    private final Map<Long, Map<String, Object>> store = new ConcurrentHashMap<>();
    private final AtomicLong idGen = new AtomicLong(1000);

    // ── GET all notifications (auto-generates from live data) ──
    @GetMapping
    public List<Map<String, Object>> getAll() {
        // Rebuild live alerts from product data
        rebuildLiveAlerts();
        List<Map<String, Object>> list = new ArrayList<>(store.values());
        list.sort((a, b) -> String.valueOf(b.get("createdAt")).compareTo(String.valueOf(a.get("createdAt"))));
        return list;
    }

    // ── GET unread count ──
    @GetMapping("/unread-count")
    public Map<String, Object> getUnreadCount() {
        rebuildLiveAlerts();
        long unread = store.values().stream().filter(n -> Boolean.FALSE.equals(n.get("read"))).count();
        return Map.of("count", unread);
    }

    // ── MARK single notification as read ──
    @PatchMapping("/{id}/read")
    public Map<String, Object> markRead(@PathVariable Long id) {
        Map<String, Object> n = store.get(id);
        if (n != null) {
            n.put("read", true);
            return n;
        }
        return Map.of("error", "Not found");
    }

    // ── MARK ALL as read ──
    @PatchMapping("/read-all")
    public Map<String, Object> markAllRead() {
        store.values().forEach(n -> n.put("read", true));
        return Map.of("success", true);
    }

    // ── ADD manual notification ──
    @PostMapping
    public Map<String, Object> addNotification(@RequestBody Map<String, Object> body) {
        long id = idGen.incrementAndGet();
        Map<String, Object> n = new LinkedHashMap<>();
        n.put("id",        id);
        n.put("type",      body.getOrDefault("type",    "INFO"));
        n.put("title",     body.getOrDefault("title",   "System Message"));
        n.put("message",   body.getOrDefault("message", ""));
        n.put("read",      false);
        n.put("createdAt", LocalDateTime.now().toString());
        store.put(id, n);
        return n;
    }

    // ── Rebuild alerts from live product data ──
    private void rebuildLiveAlerts() {
        List<Product> products = productRepo.findAll();

        // Remove stale auto-generated alerts before rebuilding
        store.entrySet().removeIf(e -> {
            Object auto = e.getValue().get("auto");
            return Boolean.TRUE.equals(auto);
        });

        for (Product p : products) {
            if (p.getStock() == null || p.getReorderLevel() == null) continue;

            double stock   = p.getStock();
            double reorder = p.getReorderLevel();
            String name    = p.getProductName() != null ? p.getProductName() : p.getProductId();

            if (stock == 0) {
                // Out of stock
                long id = Math.abs((p.getProductId() + "_OOS").hashCode());
                if (!store.containsKey(id)) {
                    Map<String, Object> n = new LinkedHashMap<>();
                    n.put("id",         id);
                    n.put("type",       "ERROR");
                    n.put("title",      "Out of Stock");
                    n.put("message",    "\"" + name + "\" is completely out of stock. Restock immediately.");
                    n.put("productId",  p.getProductId());
                    n.put("read",       false);
                    n.put("auto",       true);
                    n.put("createdAt",  LocalDateTime.now().toString());
                    store.put(id, n);
                }
            } else if (stock <= reorder * 0.5) {
                // Critical low stock
                long id = Math.abs((p.getProductId() + "_CRITICAL").hashCode());
                if (!store.containsKey(id)) {
                    Map<String, Object> n = new LinkedHashMap<>();
                    n.put("id",        id);
                    n.put("type",      "ERROR");
                    n.put("title",     "Critical Stock Level");
                    n.put("message",   "\"" + name + "\" has critically low stock (" + (int)stock + " units). Below 50% of reorder level.");
                    n.put("productId", p.getProductId());
                    n.put("read",      false);
                    n.put("auto",      true);
                    n.put("createdAt", LocalDateTime.now().toString());
                    store.put(id, n);
                }
            } else if (stock <= reorder) {
                // Low stock
                long id = Math.abs((p.getProductId() + "_LOW").hashCode());
                if (!store.containsKey(id)) {
                    Map<String, Object> n = new LinkedHashMap<>();
                    n.put("id",        id);
                    n.put("type",      "WARNING");
                    n.put("title",     "Low Stock Alert");
                    n.put("message",   "\"" + name + "\" has reached its reorder level (" + (int)stock + " / " + (int)reorder + " units).");
                    n.put("productId", p.getProductId());
                    n.put("read",      false);
                    n.put("auto",      true);
                    n.put("createdAt", LocalDateTime.now().toString());
                    store.put(id, n);
                }
            }
        }
    }
}
