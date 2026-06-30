package edu.infosys.inventoryApplication.bean;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_token")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String token;

    @Column(nullable = false)
    private String username;   // links to InventoryUser.username

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    private boolean used = false;

    public PasswordResetToken() {}

    public PasswordResetToken(String token, String username, String email, LocalDateTime expiryDate) {
        this.token      = token;
        this.username   = username;
        this.email      = email;
        this.expiryDate = expiryDate;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }

    // Getters & setters
    public Long getId()                  { return id; }
    public String getToken()             { return token; }
    public void setToken(String t)       { this.token = t; }
    public String getUsername()          { return username; }
    public void setUsername(String u)    { this.username = u; }
    public String getEmail()             { return email; }
    public void setEmail(String e)       { this.email = e; }
    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime d) { this.expiryDate = d; }
    public boolean isUsed()              { return used; }
    public void setUsed(boolean u)       { this.used = u; }
}
