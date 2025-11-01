package edu.infosys.inventoryApplication.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import edu.infosys.inventoryApplication.bean.Product;
import edu.infosys.inventoryApplication.dao.ProductDao;
import edu.infosys.inventoryApplication.service.ProductService;

@RestController
@RequestMapping("/inventory/")
@CrossOrigin(origins = "http://localhost:3838")
public class ProductController {
	@Autowired
	private ProductService service;
	@Autowired
	private ProductDao productDao ;
	
	@GetMapping("/product")
	public List displayAllProducts() {
		// TODO Auto-generated method stub
		List<Product>productList=productDao.showAllProducts();
		return productList;
	}
	
	@PostMapping("/product")
	public void saveNewProduct(@RequestBody Product product) {
		// TODO Auto-generated method stub
		Product finalProduct=service.setSalesPrice(product);
		productDao.save(finalProduct);
	}

	@GetMapping("/product/{id}")
	public Product showAProduct(@PathVariable String id) {
		// TODO Auto-generated method stub
		Product product=productDao.findProductById(id);
		return product;
	}

	@DeleteMapping("/product/{id}")
	public void deleteAProduct(@PathVariable String id) {
		// TODO Auto-generated method stub
		productDao.removeProduct(id);
	}

	
	@PutMapping("/product/{qty}/{flag}")
	public void editProductStock(@RequestBody Product product,@PathVariable double qty,@PathVariable int flag) {
		Product updatedProduct=service.stockEdit(product,qty,flag);
		productDao.save(updatedProduct);
	}
	
	@PutMapping("/product")
	public void editProductPrice(@RequestBody Product product) {
		Product updatedProduct=service.setSalesPrice(product);
		productDao.save(updatedProduct);
	}
	
	@GetMapping("/id-gen")
	public String productIdGenerator() {
		// TODO Auto-generated method stub
		return productDao.generateId();
	}
}
