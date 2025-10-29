package edu.infosys.inventoryApplication.dao;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import edu.infosys.inventoryApplication.bean.Transaction;
import edu.infosys.inventoryApplication.bean.ProductSales;
@Service
@Repository
public class TransactionDaoImpl implements TransactionDao {

    @Autowired
    private TransactionRepository repository;

    @Override
    public void save(Transaction transaction) {
        repository.save(transaction);
    }

    @Override
    public Transaction findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<Transaction> findAll() {
        return repository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Long generateId() {
        Long id = repository.findMaxTransactionId();
        return (id == null) ? 100001L : id + 1;
    }

    @Override
    public List<Transaction> findTransactionsByType(String type) {
        return repository.findTransactionsByType(type);
    }

    @Override
    public void removeTransactionById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<ProductSales> getProductWiseTotalSale() {
        return repository.getProductWiseTotalSale();
    }

    @Override
    public List<Double> getDemandByProduct(String productId) {
        return repository.getDemandByProduct(productId);
    }
}
