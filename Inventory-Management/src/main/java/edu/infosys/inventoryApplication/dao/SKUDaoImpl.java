package edu.infosys.inventoryApplication.dao;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import edu.infosys.inventoryApplication.bean.SKU;

@Repository
@Service
public class SKUDaoImpl implements SKUDao {
	@Autowired
	private SKURepository repository;
	
	@Override
	public void save(SKU sku) {
		// TODO Auto-generated method stub
		repository.save(sku);
	}

	@Override
	public SKU findSKUById(String id) {
		// TODO Auto-generated method stub
		return repository.findById(id).get();
	}

	@Override
	public void removeSKU(String id) {
		// TODO Auto-generated method stub
		repository.deleteById(id);
	}

	@Override
	public List<SKU> showAllSKUs() {
		// TODO Auto-generated method stub
		return repository.findAll();
	}
	
	@Override
	public List<String> getSkuIdList() {
		// TODO Auto-generated method stub
		return repository.getSkuIdList();
	}
	 
	public void update(SKU sku) {
		repository.save(sku);
	}
	 

}
