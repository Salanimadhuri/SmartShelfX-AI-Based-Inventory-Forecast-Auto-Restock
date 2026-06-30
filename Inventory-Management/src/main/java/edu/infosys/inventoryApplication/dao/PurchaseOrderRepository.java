package edu.infosys.inventoryApplication.dao;

import edu.infosys.inventoryApplication.bean.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, String> {

    @Query("SELECT p FROM PurchaseOrder p WHERE p.status NOT IN ('RECEIVED','CANCELLED')")
    List<PurchaseOrder> findOpenOrders();

    @Query("SELECT p FROM PurchaseOrder p WHERE p.status = 'SENT' OR p.status = 'PARTIALLY_RECEIVED'")
    List<PurchaseOrder> findPendingDeliveries();

    @Query("SELECT p FROM PurchaseOrder p WHERE p.status = 'RECEIVED' ORDER BY p.updatedAt DESC")
    List<PurchaseOrder> findRecentlyReceived();

    @Query("SELECT p FROM PurchaseOrder p WHERE p.supplierId = ?1")
    List<PurchaseOrder> findBySupplierId(String supplierId);

    @Query("SELECT MAX(p.poNumber) FROM PurchaseOrder p WHERE p.poNumber LIKE 'PO%'")
    String findMaxPoNumber();
}
