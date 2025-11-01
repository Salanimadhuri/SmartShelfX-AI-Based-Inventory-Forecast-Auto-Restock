package edu.infosys.inventoryApplication.dao;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.infosys.inventoryApplication.bean.InventoryUser;

public interface InventoryUserRepository extends JpaRepository<InventoryUser,String> {
	@Query("select u.username from InventoryUser u where u.role=?1")  
	List<String> getUsersByRole(String role);
}
