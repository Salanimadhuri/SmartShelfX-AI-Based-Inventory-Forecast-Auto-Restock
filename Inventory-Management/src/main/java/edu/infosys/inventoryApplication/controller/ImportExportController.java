package edu.infosys.inventoryApplication.controller;

import edu.infosys.inventoryApplication.bean.Product;
import edu.infosys.inventoryApplication.bean.Transaction;
import edu.infosys.inventoryApplication.dao.ProductRepository;
import edu.infosys.inventoryApplication.dao.TransactionRepository;
import edu.infosys.inventoryApplication.service.ProductService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/inventory/")
public class ImportExportController {

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private TransactionRepository transactionRepo;

    @Autowired
    private ProductService productService;

    // ══════════════════════════════════════════════════
    // EXPORT ENDPOINTS
    // ══════════════════════════════════════════════════

    /** Export all products as CSV */
    @GetMapping("/export/products")
    public void exportProducts(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"products.csv\"");

        List<Product> products = productRepo.findAll();
        PrintWriter pw = new PrintWriter(new OutputStreamWriter(response.getOutputStream(), StandardCharsets.UTF_8));

        pw.println("productId,productName,sku,purchasePrice,salesPrice,stock,reorderLevel,vendorId,status");
        for (Product p : products) {
            pw.printf("%s,%s,%s,%.2f,%.2f,%.2f,%.2f,%s,%s%n",
                nullSafe(p.getProductId()), csvEscape(p.getProductName()), nullSafe(p.getSku()),
                p.getPurchasePrice() != null ? p.getPurchasePrice() : 0,
                p.getSalesPrice() != null ? p.getSalesPrice() : 0,
                p.getStock() != null ? p.getStock() : 0,
                p.getReorderLevel() != null ? p.getReorderLevel() : 0,
                nullSafe(p.getVendorId()),
                p.getStatus() != null ? p.getStatus() : false);
        }
        pw.flush();
    }

    /** Export all transactions as CSV */
    @GetMapping("/export/transactions")
    public void exportTransactions(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"transactions.csv\"");

        List<Transaction> transactions = transactionRepo.findAll();
        PrintWriter pw = new PrintWriter(new OutputStreamWriter(response.getOutputStream(), StandardCharsets.UTF_8));

        pw.println("transactionId,transactionType,productId,rate,quantity,transactionValue,userId,transactionDate");
        for (Transaction t : transactions) {
            pw.printf("%s,%s,%s,%.2f,%.2f,%.2f,%s,%s%n",
                nullSafe(String.valueOf(t.getTransactionId())),
                nullSafe(t.getTransactionType()),
                nullSafe(t.getProductId()),
                t.getRate() != null ? t.getRate() : 0,
                t.getQuantity() != null ? t.getQuantity() : 0,
                t.getTransactionValue() != null ? t.getTransactionValue() : 0,
                nullSafe(t.getUserId()),
                nullSafe(t.getTransactionDate()));
        }
        pw.flush();
    }

    /** Download sample products import template */
    @GetMapping("/export/template/products")
    public void downloadProductTemplate(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"product_import_template.csv\"");

        PrintWriter pw = new PrintWriter(new OutputStreamWriter(response.getOutputStream(), StandardCharsets.UTF_8));
        pw.println("productName,sku,purchasePrice,stock,reorderLevel,vendorId");
        pw.println("Sample Product A,SKU-001,100.00,50,10,V001");
        pw.println("Sample Product B,SKU-002,250.00,30,5,V002");
        pw.flush();
    }

    // ══════════════════════════════════════════════════
    // IMPORT ENDPOINTS
    // ══════════════════════════════════════════════════

    /** Preview CSV before import — returns parsed rows + errors */
    @PostMapping("/import/products/preview")
    public ResponseEntity<Map<String, Object>> previewProductImport(
            @RequestParam("file") MultipartFile file) throws IOException {

        List<Map<String, Object>> rows = new ArrayList<>();
        List<Map<String, Object>> errors = new ArrayList<>();
        int rowNum = 0;

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String headerLine = reader.readLine(); // skip header
            if (headerLine == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Empty file"));
            }

            String line;
            while ((line = reader.readLine()) != null) {
                rowNum++;
                String[] cols = line.split(",", -1);
                Map<String, Object> row = new LinkedHashMap<>();
                Map<String, Object> err = new LinkedHashMap<>();
                err.put("row", rowNum);
                List<String> messages = new ArrayList<>();

                try {
                    String productName = cols.length > 0 ? cols[0].trim() : "";
                    String sku         = cols.length > 1 ? cols[1].trim() : "";
                    String priceStr    = cols.length > 2 ? cols[2].trim() : "";
                    String stockStr    = cols.length > 3 ? cols[3].trim() : "";
                    String reorderStr  = cols.length > 4 ? cols[4].trim() : "";
                    String vendorId    = cols.length > 5 ? cols[5].trim() : "";

                    if (productName.isEmpty()) messages.add("productName is required");
                    if (sku.isEmpty())         messages.add("sku is required");

                    double price = 0, stock = 0, reorder = 0;
                    try { price = Double.parseDouble(priceStr); }
                    catch (NumberFormatException e) { messages.add("purchasePrice must be a number"); }
                    try { stock = Double.parseDouble(stockStr); }
                    catch (NumberFormatException e) { messages.add("stock must be a number"); }
                    try { reorder = Double.parseDouble(reorderStr); }
                    catch (NumberFormatException e) { messages.add("reorderLevel must be a number"); }

                    row.put("row", rowNum);
                    row.put("productName", productName);
                    row.put("sku", sku);
                    row.put("purchasePrice", price);
                    row.put("stock", stock);
                    row.put("reorderLevel", reorder);
                    row.put("vendorId", vendorId);
                    row.put("valid", messages.isEmpty());
                    row.put("errors", messages);
                    rows.add(row);

                    if (!messages.isEmpty()) {
                        err.put("messages", messages);
                        errors.add(err);
                    }
                } catch (Exception e) {
                    messages.add("Could not parse row: " + e.getMessage());
                    err.put("messages", messages);
                    errors.add(err);
                }
            }
        }

        long valid = rows.stream().filter(r -> Boolean.TRUE.equals(r.get("valid"))).count();
        return ResponseEntity.ok(Map.of(
            "totalRows", rowNum,
            "validRows", valid,
            "errorRows", errors.size(),
            "rows", rows,
            "errors", errors
        ));
    }

    /** Commit product import — saves valid rows */
    @PostMapping("/import/products/commit")
    public ResponseEntity<Map<String, Object>> commitProductImport(
            @RequestParam("file") MultipartFile file) throws IOException {

        List<String> saved = new ArrayList<>();
        List<String> skipped = new ArrayList<>();
        int rowNum = 0;

        // Find max existing product id
        String maxId = productRepo.findMaxProductId();
        int idCounter = 10001;
        if (maxId != null) {
            try { idCounter = Integer.parseInt(maxId.replace("P", "")) + 1; }
            catch (NumberFormatException ignored) {}
        }

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            reader.readLine(); // skip header
            String line;
            while ((line = reader.readLine()) != null) {
                rowNum++;
                String[] cols = line.split(",", -1);
                try {
                    String productName = cols.length > 0 ? cols[0].trim() : "";
                    String sku         = cols.length > 1 ? cols[1].trim() : "";
                    double price       = cols.length > 2 ? Double.parseDouble(cols[2].trim()) : 0;
                    double stock       = cols.length > 3 ? Double.parseDouble(cols[3].trim()) : 0;
                    double reorder     = cols.length > 4 ? Double.parseDouble(cols[4].trim()) : 0;
                    String vendorId    = cols.length > 5 ? cols[5].trim() : "";

                    if (productName.isEmpty() || sku.isEmpty()) {
                        skipped.add("Row " + rowNum + ": missing name or sku");
                        continue;
                    }

                    Product p = new Product();
                    p.setProductId("P" + idCounter++);
                    p.setProductName(productName);
                    p.setSku(sku);
                    p.setPurchasePrice(price);
                    p.setSalesPrice(price * 1.20);
                    p.setStock(stock);
                    p.setReorderLevel(reorder);
                    p.setVendorId(vendorId);
                    p.setStatus(stock > reorder);
                    productRepo.save(p);
                    saved.add(p.getProductId() + " - " + productName);
                } catch (Exception e) {
                    skipped.add("Row " + rowNum + ": " + e.getMessage());
                }
            }
        }

        return ResponseEntity.ok(Map.of(
            "savedCount", saved.size(),
            "skippedCount", skipped.size(),
            "saved", saved,
            "skipped", skipped
        ));
    }

    // helpers
    private String nullSafe(String s) { return s != null ? s : ""; }
    private String csvEscape(String s) {
        if (s == null) return "";
        if (s.contains(",") || s.contains("\"") || s.contains("\n"))
            return "\"" + s.replace("\"", "\"\"") + "\"";
        return s;
    }
}
