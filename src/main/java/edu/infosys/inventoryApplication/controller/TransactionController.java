package edu.infosys.inventoryApplication.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import edu.infosys.inventoryApplication.bean.Product;
import edu.infosys.inventoryApplication.bean.ProductSales;
import edu.infosys.inventoryApplication.bean.Transaction;
import edu.infosys.inventoryApplication.dao.TransactionDao;
import edu.infosys.inventoryApplication.dao.ProductRepository;
import edu.infosys.inventoryApplication.service.ProductService;
import edu.infosys.inventoryApplication.service.TransactionService;

@RestController
@RequestMapping("/inventory/")
@CrossOrigin(origins = "http://localhost:3838")
public class TransactionController {

    @Autowired
    private TransactionDao dao;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private ProductService productService;

    @GetMapping("/transaction")
    public List<Transaction> getAllTransactions() {
        return dao.findAll();
    }

    @GetMapping("/transaction/{id}")
    public Transaction getTransaction(@PathVariable Long id) {
        return dao.findById(id);
    }

    @PostMapping("/transaction")
    public void saveTransaction(@RequestBody Transaction transaction) {

        Product product = productRepository.findById(transaction.getProductId()).orElse(null);
        if (product == null) {
            throw new RuntimeException("Product not found for ID: " + transaction.getProductId());
        }

        if ("purchase".equalsIgnoreCase(transaction.getTransactionType())) {
            transaction.setRate(product.getPurchasePrice());
        } else if ("issue".equalsIgnoreCase(transaction.getTransactionType())) {
            transaction.setRate(product.getSalesPrice());
        }

        Double transactionValue = transactionService.calculateTransactionValue(
                transaction.getQuantity(),
                transaction.getRate()
        );
        transaction.setTransactionValue(transactionValue);

        if (transactionService.isStockOut(transaction)) {
            productService.stockEdit(product, transaction.getQuantity(), 2); // decrease
        } else if (transactionService.isStockIn(transaction)) {
            productService.stockEdit(product, transaction.getQuantity(), 1); // increase
        }

        productRepository.save(product);
        dao.save(transaction);
    }

    @DeleteMapping("/transaction/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        dao.deleteById(id);
    }

    @GetMapping("/transaction-id")
    public Long generateTransactionId() {
        return dao.generateId();
    }

    @GetMapping("/analysis")
    public List<ProductSales> getProductWiseTotalSale() {
        return dao.getProductWiseTotalSales();
    }

    @GetMapping("/analysis/{id}")
    public List<Double> getDemandByProduct(@PathVariable String id) {
        return dao.getDemandByProduct(id);
    }
}