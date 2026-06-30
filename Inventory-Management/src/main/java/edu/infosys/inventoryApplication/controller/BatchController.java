package edu.infosys.inventoryApplication.controller;

import edu.infosys.inventoryApplication.bean.ProductBatch;
import edu.infosys.inventoryApplication.dao.ProductBatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/inventory/")
public class BatchController {

    @Autowired
    private ProductBatchRepository batchRepo;

    @GetMapping("/batches")
    public List<ProductBatch> getAll() {
        return batchRepo.findAll();
    }

    @GetMapping("/batches/product/{productId}")
    public List<ProductBatch> getByProduct(@PathVariable String productId) {
        return batchRepo.findByProductId(productId);
    }

    @GetMapping("/batches/{id}")
    public ResponseEntity<ProductBatch> getById(@PathVariable String id) {
        return batchRepo.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/batches")
    public ResponseEntity<ProductBatch> create(@RequestBody ProductBatch batch) {
        batch.setId(generateId());
        batch.setBatchNumber(generateBatchNumber());
        if (batch.getRemainingQuantity() == null) batch.setRemainingQuantity(batch.getQuantity());
        return ResponseEntity.ok(batchRepo.save(batch));
    }

    @PutMapping("/batches/{id}")
    public ResponseEntity<ProductBatch> update(@PathVariable String id,
                                                @RequestBody ProductBatch updated) {
        return batchRepo.findById(id).map(b -> {
            b.setManufactureDate(updated.getManufactureDate());
            b.setExpiryDate(updated.getExpiryDate());
            b.setQuantity(updated.getQuantity());
            b.setRemainingQuantity(updated.getRemainingQuantity());
            b.setSupplierId(updated.getSupplierId());
            return ResponseEntity.ok(batchRepo.save(b));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/batches/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        batchRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ── EXPIRY MONITORING ──
    @GetMapping("/batches/expiry/summary")
    public Map<String, Object> expirySummary() {
        LocalDate now = LocalDate.now();
        List<ProductBatch> expired   = batchRepo.findExpired();
        List<ProductBatch> within7   = batchRepo.findExpiringBefore(now.plusDays(7));
        List<ProductBatch> within30  = batchRepo.findExpiringBefore(now.plusDays(30));

        // remove already-expired from within7/within30
        within7.removeIf(b -> b.getExpiryDate().isBefore(now));
        within30.removeIf(b -> b.getExpiryDate().isBefore(now));

        return Map.of(
            "expired",        expired,
            "expiredCount",   expired.size(),
            "within7Days",    within7,
            "within7Count",   within7.size(),
            "within30Days",   within30,
            "within30Count",  within30.size()
        );
    }

    @GetMapping("/batches/expiry/expired")
    public List<ProductBatch> getExpired() {
        return batchRepo.findExpired();
    }

    @GetMapping("/batches/expiry/soon")
    public List<ProductBatch> getExpiringSoon() {
        LocalDate cutoff = LocalDate.now().plusDays(30);
        List<ProductBatch> list = batchRepo.findExpiringBefore(cutoff);
        list.removeIf(b -> b.getExpiryDate().isBefore(LocalDate.now()));
        return list;
    }

    private String generateId() {
        String max = batchRepo.findMaxId();
        if (max == null) return "B10001";
        try {
            int num = Integer.parseInt(max.replace("B", ""));
            return "B" + (num + 1);
        } catch (NumberFormatException e) {
            return "B" + System.currentTimeMillis();
        }
    }

    private String generateBatchNumber() {
        String max = batchRepo.findMaxBatchNumber();
        if (max == null) return "BAT10001";
        try {
            int num = Integer.parseInt(max.replace("BAT", ""));
            return "BAT" + (num + 1);
        } catch (NumberFormatException e) {
            return "BAT" + System.currentTimeMillis();
        }
    }
}
