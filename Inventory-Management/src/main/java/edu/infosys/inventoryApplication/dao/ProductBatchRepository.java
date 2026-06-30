package edu.infosys.inventoryApplication.dao;

import edu.infosys.inventoryApplication.bean.ProductBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface ProductBatchRepository extends JpaRepository<ProductBatch, String> {

    List<ProductBatch> findByProductId(String productId);

    @Query("SELECT b FROM ProductBatch b WHERE b.expiryDate <= ?1 AND b.remainingQuantity > 0")
    List<ProductBatch> findExpiringBefore(LocalDate date);

    @Query("SELECT b FROM ProductBatch b WHERE b.expiryDate < CURRENT_DATE AND b.remainingQuantity > 0")
    List<ProductBatch> findExpired();

    @Query("SELECT MAX(b.batchNumber) FROM ProductBatch b WHERE b.batchNumber LIKE 'BAT%'")
    String findMaxBatchNumber();

    @Query("SELECT MAX(b.id) FROM ProductBatch b WHERE b.id LIKE 'B%'")
    String findMaxId();
}
