package edu.infosys.inventoryApplication.bean;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_batch")
public class ProductBatch {

    @Id
    private String id;

    private String batchNumber;
    private String productId;
    private String productName;
    private LocalDate manufactureDate;
    private LocalDate expiryDate;
    private Double quantity;
    private Double remainingQuantity;
    private String supplierId;
    private String purchaseOrderId;
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    public ProductBatch() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public LocalDate getManufactureDate() { return manufactureDate; }
    public void setManufactureDate(LocalDate manufactureDate) { this.manufactureDate = manufactureDate; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }
    public Double getRemainingQuantity() { return remainingQuantity; }
    public void setRemainingQuantity(Double remainingQuantity) { this.remainingQuantity = remainingQuantity; }
    public String getSupplierId() { return supplierId; }
    public void setSupplierId(String supplierId) { this.supplierId = supplierId; }
    public String getPurchaseOrderId() { return purchaseOrderId; }
    public void setPurchaseOrderId(String purchaseOrderId) { this.purchaseOrderId = purchaseOrderId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
