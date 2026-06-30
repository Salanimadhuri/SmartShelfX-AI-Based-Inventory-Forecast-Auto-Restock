package edu.infosys.inventoryApplication.controller;

import edu.infosys.inventoryApplication.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/inventory/auth")
public class PasswordResetController {

    @Autowired
    private PasswordResetService resetService;

    /** GET /inventory/auth/mail-status — tells frontend if mail is configured */
    @GetMapping("/mail-status")
    public Map<String, Object> mailStatus() {
        return Map.of(
            "mailConfigured",   resetService.isMailConfigured(),
            "googleConfigured", true    // Google OAuth2 credentials are now configured
        );
    }

    /** POST /inventory/auth/forgot-password  { "email": "..." } */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "").trim();
        if (email.isEmpty() || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", "Please provide a valid email address."));
        }
        return ResponseEntity.ok(resetService.requestReset(email));
    }

    /** GET /inventory/auth/validate-token?token=... */
    @GetMapping("/validate-token")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestParam String token) {
        return ResponseEntity.ok(resetService.validateToken(token));
    }

    /** POST /inventory/auth/reset-password  { "token": "...", "newPassword": "..." } */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> body) {
        String token    = body.getOrDefault("token",       "").trim();
        String password = body.getOrDefault("newPassword", "").trim();
        if (token.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", "Token is required."));
        }
        Map<String, Object> result = resetService.resetPassword(token, password);
        if (Boolean.TRUE.equals(result.get("success"))) return ResponseEntity.ok(result);
        return ResponseEntity.badRequest().body(result);
    }
}
