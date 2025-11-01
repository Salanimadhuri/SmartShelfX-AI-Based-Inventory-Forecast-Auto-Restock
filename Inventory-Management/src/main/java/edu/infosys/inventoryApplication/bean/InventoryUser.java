package edu.infosys.inventoryApplication.bean;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

@Entity
public class InventoryUser extends User {
	@Id
	private String username;
	private String personalName;
	private String password;
	private String email;
	private String role;
	public InventoryUser() {
		super("abc","pqr",new ArrayList<>());
	}
	
	public InventoryUser(String username, String password, Collection<? extends GrantedAuthority> authorities,
			String username2, String personalName2,String email2, String password2, String role2) {
		super(username, password, authorities);
		this.username = username2;
		this.password = password2;
		this.personalName=personalName2;
		this.email = email2;
		this.role = role2;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPersonalName() {
		return personalName;
	}
	public void setPersonalName(String personalName) {
		this.personalName = personalName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	@Override
	public String toString() {
		return "InventoryUser [username=" + username + ", personalName=" + personalName + ", password=" + password
				+ ", email=" + email + ", role=" + role + "]";
	}
	
	
}
