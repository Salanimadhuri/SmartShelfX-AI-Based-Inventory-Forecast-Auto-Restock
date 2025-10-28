package edu.infosys.inventoryApplication.service;
 
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
 
import edu.infosys.inventoryApplication.bean.InventoryUser;
import edu.infosys.inventoryApplication.dao.InventoryUserRepository;
 
@Service
public class InventoryUserService implements UserDetailsService {
 
    @Autowired
    private InventoryUserRepository repository;
 
    private String userId;
    private String role;
    private InventoryUser user;
 
    public void save(InventoryUser user) {
        repository.save(user);
    }
 
    public String getUserId() {
        return userId;
    }
 
    public String getRole() {
        return role;
    }
 
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        InventoryUser user = repository.findById(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        this.user= repository.findById(username).get();
        this.userId = user.getUsername();
        this.role = user.getRole();
        return user;
    }
    public List<String> getUsersByRole(String role){
    	return repository.getUsersByRole (role);
    }
    public InventoryUser getUser() {
    	return user;
    }
}