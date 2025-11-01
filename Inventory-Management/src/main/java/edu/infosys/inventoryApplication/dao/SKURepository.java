package edu.infosys.inventoryApplication.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.infosys.inventoryApplication.bean.SKU;

public interface SKURepository extends JpaRepository<SKU,String> {
	
	@Query("select skuId from SKU")
	public List<String> getSkuIdList();
}
