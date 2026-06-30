package edu.infosys.inventoryApplication.controller;

import edu.infosys.inventoryApplication.bean.Product;
import edu.infosys.inventoryApplication.bean.PurchaseOrder;
import edu.infosys.inventoryApplication.bean.PurchaseOrderItem;
import edu.infosys.inventoryApplication.dao.ProductRepository;
import edu.infosys.inventoryApplication.dao.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/inventory/")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderRepository poRepo;

    @Autowired
    private ProductRepository productRepo;

    // ── GET all POs ──
    @GetMapping("/purchase-orders")
    public List<PurchaseOrder> getAll() {
        return poRepo.findAll();
    }

    // ── GET single PO ──
    @GetMapping("/purchase-orders/{id}")
    public ResponseEntity<PurchaseOrder> getById(@PathVariable String id) {
        Optional<PurchaseOrder> po = poRepo.findById(id);
        return po.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // ── GET open POs for dashboard widget ──
    @GetMapping("/purchase-orders/open")
    public List<PurchaseOrder> getOpen() {
        return poRepo.findOpenOrders();
    }

    // ── GET pending deliveries ──
    @GetMapping("/purchase-orders/pending")
    public List<PurchaseOrder> getPending() {
        return poRepo.findPendingDeliveries();
    }

    // ── GET recently received ──
    @GetMapping("/purchase-orders/received")
    public List<PurchaseOrder> getReceived() {
        return poRepo.findRecentlyReceived();
    }

    // ── GET POs by supplier ──
    @GetMapping("/purchase-orders/supplier/{supplierId}")
    public List<PurchaseOrder> getBySupplierId(@PathVariable String supplierId) {
        return poRepo.findBySupplierId(supplierId);
    }

    // ── CREATE PO ──
    @PostMapping("/purchase-orders")
    public ResponseEntity<PurchaseOrder> create(@RequestBody PurchaseOrder po) {
        po.setId(generatePoId());
        po.setPoNumber(generatePoNumber());
        if (po.getOrderDate() == null) po.setOrderDate(LocalDate.now());
        if (po.getStatus() == null) po.setStatus(PurchaseOrder.POStatus.DRAFT);

        // link items back to PO and compute totals
        double total = 0;
        for (PurchaseOrderItem item : po.getItems()) {
            item.setPurchaseOrder(po);
            if (item.getUnitCost() != null && item.getQuantity() != null) {
                item.setTotalCost(item.getQuantity() * item.getUnitCost());
                total += item.getTotalCost();
            }
            // auto-fill product name
            if (item.getProductId() != null && item.getProductName() == null) {
                productRepo.findById(item.getProductId())
                    .ifPresent(p -> item.setProductName(p.getProductName()));
            }
        }
        po.setTotalAmount(total);
        return ResponseEntity.ok(poRepo.save(po));
    }

    // ── UPDATE PO ──
    @PutMapping("/purchase-orders/{id}")
    public ResponseEntity<PurchaseOrder> update(@PathVariable String id, @RequestBody PurchaseOrder updated) {
        return poRepo.findById(id).map(existing -> {
            existing.setSupplierId(updated.getSupplierId());
            existing.setOrderDate(updated.getOrderDate());
            existing.setExpectedDeliveryDate(updated.getExpectedDeliveryDate());
            existing.setNotes(updated.getNotes());
            if (existing.getStatus() == PurchaseOrder.POStatus.DRAFT) {
                existing.setStatus(updated.getStatus());
                existing.getItems().clear();
                double total = 0;
                for (PurchaseOrderItem item : updated.getItems()) {
                    item.setPurchaseOrder(existing);
                    if (item.getUnitCost() != null && item.getQuantity() != null) {
                        item.setTotalCost(item.getQuantity() * item.getUnitCost());
                        total += item.getTotalCost();
                    }
                    existing.getItems().add(item);
                }
                existing.setTotalAmount(total);
            } else {
                existing.setStatus(updated.getStatus());
            }
            return ResponseEntity.ok(poRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── CHANGE STATUS ──
    @PatchMapping("/purchase-orders/{id}/status")
    public ResponseEntity<PurchaseOrder> changeStatus(@PathVariable String id,
                                                       @RequestBody Map<String, String> body) {
        return poRepo.findById(id).map(po -> {
            String newStatus = body.get("status");
            po.setStatus(PurchaseOrder.POStatus.valueOf(newStatus));
            return ResponseEntity.ok(poRepo.save(po));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── RECEIVE PO — updates product stock ──
    @PostMapping("/purchase-orders/{id}/receive")
    public ResponseEntity<PurchaseOrder> receivePO(@PathVariable String id) {
        return poRepo.findById(id).map(po -> {
            for (PurchaseOrderItem item : po.getItems()) {
                productRepo.findById(item.getProductId()).ifPresent(product -> {
                    double newStock = product.getStock() + item.getQuantity();
                    product.setStock(newStock);
                    if (newStock > product.getReorderLevel()) product.setStatus(true);
                    productRepo.save(product);
                    item.setReceivedQuantity(item.getQuantity());
                });
            }
            po.setStatus(PurchaseOrder.POStatus.RECEIVED);
            return ResponseEntity.ok(poRepo.save(po));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── DELETE (only DRAFT) ──
    @DeleteMapping("/purchase-orders/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        return poRepo.findById(id).map(po -> {
            if (po.getStatus() == PurchaseOrder.POStatus.DRAFT ||
                po.getStatus() == PurchaseOrder.POStatus.CANCELLED) {
                poRepo.deleteById(id);
                return ResponseEntity.ok().<Void>build();
            }
            return ResponseEntity.badRequest().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── GENERATE PO ID ──
    @GetMapping("/purchase-orders/generate-id")
    public String generatePoIdEndpoint() {
        return generatePoId();
    }

    // ── DASHBOARD SUMMARY ──
    @GetMapping("/purchase-orders/summary")
    public Map<String, Object> getSummary() {
        List<PurchaseOrder> all = poRepo.findAll();
        long open     = all.stream().filter(p -> p.getStatus() != PurchaseOrder.POStatus.RECEIVED && p.getStatus() != PurchaseOrder.POStatus.CANCELLED).count();
        long pending  = all.stream().filter(p -> p.getStatus() == PurchaseOrder.POStatus.SENT || p.getStatus() == PurchaseOrder.POStatus.PARTIALLY_RECEIVED).count();
        long received = all.stream().filter(p -> p.getStatus() == PurchaseOrder.POStatus.RECEIVED).count();
        double totalValue = all.stream().filter(p -> p.getStatus() != PurchaseOrder.POStatus.CANCELLED).mapToDouble(p -> p.getTotalAmount() == null ? 0 : p.getTotalAmount()).sum();

        return Map.of(
            "openOrders", open,
            "pendingDeliveries", pending,
            "receivedOrders", received,
            "totalPOValue", totalValue,
            "totalOrders", all.size()
        );
    }

    private String generatePoId() {
        String maxId = poRepo.findMaxPoNumber();
        if (maxId == null) return "PO10001";
        try {
            int num = Integer.parseInt(maxId.replace("PO", ""));
            return "PO" + (num + 1);
        } catch (NumberFormatException e) {
            return "PO" + System.currentTimeMillis();
        }
    }

    private String generatePoNumber() {
        return generatePoId();
    }
}
