package edu.infosys.inventoryApplication.bean;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Transaction {

    @Id
    private Long transactionId;
    private String transactionType; // "IN" or "OUT"
    private String productId;
    private Double rate; 
    private Double quantity;
    private Double transactionValue;
    private String userId;
    private String transactionDate;

    public Transaction() {
        super();
    }

    public Transaction(Long transactionId, String transactionType, String productId, Double rate,
                       Double quantity, Double transactionValue, String userId, String transactionDate) {
        super();
        this.transactionId = transactionId;
        this.transactionType = transactionType;
        this.productId = productId;
        this.rate = rate; 
        this.quantity = quantity;
        this.transactionValue = transactionValue;
        this.userId = userId;
        this.transactionDate = transactionDate;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public Double getRate() {
        return rate;
    }

    public void setRate(Double rate) {
        this.rate = rate;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getTransactionValue() {
        return transactionValue;
    }

    public void setTransactionValue(Double transactionValue) {
        this.transactionValue = transactionValue;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(String transactionDate) {
        this.transactionDate = transactionDate;
    }

    @Override
    public String toString() {
        return "Transaction [transactionId=" + transactionId + ", transactionType=" + transactionType + 
               ", productId=" + productId + ", rate=" + rate + ", quantity=" + quantity + 
               ", transactionValue=" + transactionValue + ", userId=" + userId + 
               ", transactionDate=" + transactionDate + "]";
    }
}
