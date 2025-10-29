package edu.infosys.inventoryApplication.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.infosys.inventoryApplication.bean.Transaction;
import edu.infosys.inventoryApplication.bean.ProductSales;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {


    @Query("select max(t.transactionId) from Transaction t")
    Long findMaxTransactionId();

    @Query("select t from Transaction t where t.transactionType = ?1")
    List<Transaction> findTransactionsByType(String type);

    @Query("SELECT new edu.infosys.inventoryApplication.bean.ProductSales(p.productName, SUM(t.transactionValue)) " +
           "FROM Product p JOIN Transaction t ON p.productId = t.productId " +
           "WHERE t.transactionType='OUT' GROUP BY p.productId ")
    List<ProductSales> getProductWiseTotalSale();
    
    @Query("SELECT t.transactionValue from Transaction t WHERE t.transactionType='OUT' and t.productId=?1")
    List<Double> getDemandByProduct(String productId);

}

