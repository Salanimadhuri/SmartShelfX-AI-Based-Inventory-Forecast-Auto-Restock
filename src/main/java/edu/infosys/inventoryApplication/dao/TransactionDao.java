package edu.infosys.inventoryApplication.dao;

import java.util.List;
import edu.infosys.inventoryApplication.bean.Transaction;
import edu.infosys.inventoryApplication.bean.ProductSales;

public interface TransactionDao {
    public void save(Transaction transaction);
    public Transaction findById(Long id);
    public Long generateId();
    public List<Transaction> findAll();
    public void deleteById(Long id);
    public List<Transaction> findTransactionsByType(String type);
    public void removeTransactionById(Long id);
    public List<ProductSales> getProductWiseTotalSale();
    public  List<Double> getDemandByProduct(String productId);
    	
}