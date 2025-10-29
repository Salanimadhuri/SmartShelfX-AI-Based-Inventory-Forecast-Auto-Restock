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

import edu.infosys.inventoryApplication.bean.SKU;
import edu.infosys.inventoryApplication.dao.SKUDao;

@RestController
@RequestMapping("/inventory/")
@CrossOrigin(origins = "http://localhost:3838")
public class SKUController {
	@Autowired
	private SKUDao skuDao;
	
	@PostMapping("/SKU")
	public void save(@RequestBody SKU sku) {
		// TODO Auto-generated method stub
		skuDao.save(sku);
	}

	@GetMapping("/SKU/{id}")
	public SKU findSKUById(@PathVariable String id) {
		// TODO Auto-generated method stub
		return skuDao.findSKUById(id);
	}

	@DeleteMapping("/SKU/{id}")
	public void removeSKU(@PathVariable String id) {
		// TODO Auto-generated method stub
		skuDao.removeSKU(id);
	}

	@GetMapping("/SKU")
	public List<SKU> showAllSKUs() {
		// TODO Auto-generated method stub
		return skuDao.showAllSKUs();
	}
	@PutMapping("/SKU")
	public void update(@RequestBody SKU sku) {
		skuDao.save(sku);
	}
	
	
	@GetMapping("/all-ids")
	public List<String> getSkuIdList() {
		// TODO Auto-generated method stub
		return skuDao.getSkuIdList();
	}
}
