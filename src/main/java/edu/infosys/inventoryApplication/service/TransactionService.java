package edu.infosys.inventoryApplication.service;

import org.springframework.stereotype.Service;
import edu.infosys.inventoryApplication.bean.Transaction;

@Service
public class TransactionService {

    public Double calculateTransactionValue(Double quantity, Double rate) {
        if (quantity == null || rate == null)
            return 0.0;
        return quantity * rate;
    }

    public boolean isStockOut(Transaction transaction) {
        return "OUT".equalsIgnoreCase(transaction.getTransactionType());
    }

    public boolean isStockIn(Transaction transaction) {
        return "IN".equalsIgnoreCase(transaction.getTransactionType());
    }
    public Transaction prepareTransaction(Transaction transaction) {
        transaction.setTransactionValue(calculateTransactionValue(
            transaction.getQuantity(), transaction.getRate()
        ));
        return transaction;
    }
    

}
