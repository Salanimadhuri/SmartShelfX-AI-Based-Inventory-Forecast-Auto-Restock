package edu.infosys.inventoryApplication.bean;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Product {
    @Id
    private String productId;
    private String productName;
    private String sku;
    private Double purchasePrice;
    private Double salesPrice;
    private Double reorderLevel;
    private Double stock;
    private String vendorId;
    
    // 1. ADDED: Declaration for the new 'status' field
    private Boolean status; 

    public Product() {
        super();
    }

    // 2. UPDATED: Constructor to include 'status'
    public Product(String productId, String productName, String sku, Double purchasePrice, Double salesPrice,
                   Double reorderLevel, Double stock, String vendorId, Boolean status) {
        super();
        this.productId = productId;
        this.productName = productName;
        this.sku = sku;
        this.purchasePrice = purchasePrice;
        this.salesPrice = salesPrice;
        this.reorderLevel = reorderLevel;
        this.stock = stock;
        this.vendorId = vendorId;
        this.status = status; // Initialize the new field
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }
    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public Double getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(Double purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public Double getSalesPrice() {
        return salesPrice;
    }

    public void setSalesPrice(Double salesPrice) {
        this.salesPrice = salesPrice;
    }

    public Double getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Double reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public Double getStock() {
        return stock;
    }

    public void setStock(Double stock) {
        this.stock = stock;
    }

    public String getVendorId() {
        return vendorId;
    }

    public void setVendorId(String vendorId) {
        this.vendorId = vendorId;
    }

    // 3. CORRECTED: Getter for status (getStatus)
    public Boolean getStatus() {
        return status;
    }
    
    // 4. CORRECTED: Setter for status (setStatus) - Typo fixed
    public void setStatus(Boolean status) {
        this.status = status; 
    }

    // 5. UPDATED: toString() to include 'status'
    @Override
    public String toString() {
        return "Product [productId=" + productId + ", productName=" + productName + ", sku=" + sku +
               ", purchasePrice=" + purchasePrice + ", salesPrice=" + salesPrice +
               ", reorderLevel=" + reorderLevel + ", stock=" + stock + ", vendorId=" + vendorId + 
               ", status=" + status + "]"; 
    }
}