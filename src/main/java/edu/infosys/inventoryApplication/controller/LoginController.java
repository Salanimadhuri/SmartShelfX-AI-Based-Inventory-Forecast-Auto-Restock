package edu.infosys.inventoryApplication.controller;

import org.springframework.security.core.Authentication;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import edu.infosys.inventoryApplication.InventoryApplication;
import edu.infosys.inventoryApplication.bean.InventoryUser;
import edu.infosys.inventoryApplication.config.EncoderConfig;
import edu.infosys.inventoryApplication.service.InventoryUserService;

@RestController
@RequestMapping("/inventory/")
@CrossOrigin(origins = "http://localhost:3838")
public class LoginController {

    private final InventoryApplication inventoryApplication;
	@Autowired
	private InventoryUserService service;
	
	@Autowired
	private EncoderConfig econfig;
	
	@Autowired
    private AuthenticationManager authenticationManager;

    LoginController(InventoryApplication inventoryApplication) {
        this.inventoryApplication = inventoryApplication;
    }
	
	@PostMapping("/login")
	public void registerNewUser(@RequestBody InventoryUser user ) {
		PasswordEncoder bCrypt=econfig.passwordEcoder();
		String encodedPassword=bCrypt.encode(user.getPassword());
		user.setPassword(encodedPassword);
		service.save(user);
	}
	
	@GetMapping("/login/{userId}/{password}")
	public String validateUser(@PathVariable String userId,@PathVariable String password) {
		String role="false";
		try {
			 Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userId, password));
		 	    role=service.getRole();
		 	     SecurityContextHolder.getContext().setAuthentication(authentication);
			}catch(Exception ex) {}
		return role;
	}
	
	@GetMapping("/login")
	public InventoryUser getSingleUserDetails() {
		return service.getUser();
	}
	
	@GetMapping("/login/{role}")
	public List<String> getUsersByRole(@PathVariable String role) {
		return service.getUsersByRole(role);
	}
	@GetMapping("/role")
	public String getUserRole() {
		return service.getRole();
	}
}
	
