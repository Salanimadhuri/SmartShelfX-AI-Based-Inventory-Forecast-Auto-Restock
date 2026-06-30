package edu.infosys.inventoryApplication.bean;

import jakarta.persistence.*;

@Entity
@Table(name = "purchase_order_item")
public class PurchaseOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private PurchaseOrder purchaseOrder;

    private String productId;
    private String productName;
    private Double quantity;
    private Double unitCost;
    private Double totalCost;
    private Double receivedQuantity = 0.0;

    public PurchaseOrderItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public PurchaseOrder getPurchaseOrder() { return purchaseOrder; }
    public void setPurchaseOrder(PurchaseOrder purchaseOrder) { this.purchaseOrder = purchaseOrder; }
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }
    public Double getUnitCost() { return unitCost; }
    public void setUnitCost(Double unitCost) { this.unitCost = unitCost; }
    public Double getTotalCost() { return totalCost; }
    public void setTotalCost(Double totalCost) { this.totalCost = totalCost; }
    public Double getReceivedQuantity() { return receivedQuantity; }
    public void setReceivedQuantity(Double receivedQuantity) { this.receivedQuantity = receivedQuantity; }
}
