package edu.infosys.inventoryApplication.dao;

import java.util.List;

import edu.infosys.inventoryApplication.bean.Product;

public interface ProductDao {
	public void save(Product product);
	public Product findProductById(String id);
	public String generateId();
	public void removeProduct(String id);
	public List<Product> showAllProducts();
	public Double findReorderLevelByProductId(String id);
	
}

