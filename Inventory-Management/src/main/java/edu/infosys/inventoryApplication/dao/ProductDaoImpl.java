package edu.infosys.inventoryApplication.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import edu.infosys.inventoryApplication.bean.Product;

@Repository
@Service
public class ProductDaoImpl implements ProductDao {
	@Autowired
	private ProductRepository repository;
	
	@Override
	public void save(Product product) {
		// TODO Auto-generated method stub
		repository.save(product);
	}

	@Override
	public Product findProductById(String id) {
		// TODO Auto-generated method stub
		return repository.findById(id).get();
	}

	@Override
	public String generateId() {
		// TODO Auto-generated method stub
		String id=repository.findMaxProductId();
		if(id==null)
			id="P10001";
		else {
			int x=Integer.parseInt(id.substring(1));
			x++;
			id="P"+x;
		}
		return id;
	}

	@Override
	public void removeProduct(String id) {
		// TODO Auto-generated method stub
		repository.deleteById(id);
	}

	@Override
	public List<Product> showAllProducts() {
		// TODO Auto-generated method stub
		return repository.findAll();
	}

	@Override
	public Double findReorderLevelByProductId(String id) {
		// TODO Auto-generated method stub
		return repository.findReorderLevelByProductId(id);
	}

}
