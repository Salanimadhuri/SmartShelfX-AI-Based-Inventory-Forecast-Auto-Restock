package edu.infosys.inventoryApplication.service;

import edu.infosys.inventoryApplication.bean.InventoryUser;
import edu.infosys.inventoryApplication.bean.PasswordResetToken;
import edu.infosys.inventoryApplication.dao.InventoryUserRepository;
import edu.infosys.inventoryApplication.dao.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
public class PasswordResetService {

    @Autowired private InventoryUserRepository   userRepo;
    @Autowired private PasswordResetTokenRepository tokenRepo;

    // JavaMailSender is optional — only autowired when spring.mail.username is configured
    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.frontend-url:http://localhost:3838}")
    private String frontendUrl;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final SecureRandom           rng    = new SecureRandom();

    /** Returns true when mail is actually configured */
    public boolean isMailConfigured() {
        return mailSender != null && mailUsername != null && !mailUsername.isBlank();
    }

    /**
     * Step 1: generate token, save, optionally send email.
     * Returns a map describing what happened.
     */
    public java.util.Map<String, Object> requestReset(String email) {
        Optional<InventoryUser> optUser = userRepo.findByEmail(email);

        // Always respond the same way to prevent user-enumeration
        if (optUser.isEmpty()) {
            return java.util.Map.of(
                "success", true,
                "message", "If that email exists, a reset link has been sent.",
                "mailSent", false
            );
        }

        InventoryUser user = optUser.get();

        // Delete any existing unused tokens for this user
        tokenRepo.deleteExistingTokensForUser(user.getUsername());

        // Generate token
        byte[] bytes = new byte[32];
        rng.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        PasswordResetToken prt = new PasswordResetToken(
            rawToken,
            user.getUsername(),
            email,
            LocalDateTime.now().plusMinutes(15)
        );
        tokenRepo.save(prt);

        boolean mailSent = false;
        String devToken  = null;

        if (isMailConfigured()) {
            try {
                sendResetEmail(email, user.getPersonalName(), rawToken);
                mailSent = true;
            } catch (Exception e) {
                // log but don't expose to client
                System.err.println("[PasswordReset] Email send failed: " + e.getMessage());
            }
        } else {
            // Dev mode: expose token in response so it can be tested without SMTP
            devToken = rawToken;
        }

        var result = new java.util.LinkedHashMap<String, Object>();
        result.put("success",  true);
        result.put("message",  mailSent
            ? "A password reset link has been sent to " + email
            : "Mail not configured. Use the token below to test reset.");
        result.put("mailSent", mailSent);
        if (devToken != null) result.put("devToken", devToken); // only in dev / no-mail mode
        return result;
    }

    /**
     * Step 2: validate token and set new password.
     */
    public java.util.Map<String, Object> resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> optToken = tokenRepo.findByToken(token);

        if (optToken.isEmpty()) {
            return java.util.Map.of("success", false, "message", "Invalid or expired reset token.");
        }

        PasswordResetToken prt = optToken.get();

        if (prt.isUsed()) {
            return java.util.Map.of("success", false, "message", "This reset link has already been used.");
        }
        if (prt.isExpired()) {
            return java.util.Map.of("success", false, "message", "This reset link has expired. Please request a new one.");
        }
        if (newPassword == null || newPassword.trim().length() < 5) {
            return java.util.Map.of("success", false, "message", "Password must be at least 5 characters.");
        }

        // Update password
        Optional<InventoryUser> optUser = userRepo.findById(prt.getUsername());
        if (optUser.isEmpty()) {
            return java.util.Map.of("success", false, "message", "User not found.");
        }

        InventoryUser user = optUser.get();
        user.setPassword(encoder.encode(newPassword));
        userRepo.save(user);

        // Invalidate token
        prt.setUsed(true);
        tokenRepo.save(prt);

        return java.util.Map.of("success", true, "message", "Password updated successfully. You can now sign in.");
    }

    /** Validate a token without consuming it (for the reset form page) */
    public java.util.Map<String, Object> validateToken(String token) {
        Optional<PasswordResetToken> opt = tokenRepo.findByToken(token);
        if (opt.isEmpty())          return java.util.Map.of("valid", false, "message", "Invalid token.");
        if (opt.get().isUsed())     return java.util.Map.of("valid", false, "message", "Token already used.");
        if (opt.get().isExpired())  return java.util.Map.of("valid", false, "message", "Token expired.");
        return java.util.Map.of("valid", true, "email", opt.get().getEmail());
    }

    private void sendResetEmail(String to, String name, String token) throws Exception {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        MimeMessage msg = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject("SmartShelfX — Password Reset Request");
        helper.setText(buildEmailHtml(name, resetUrl), true);
        mailSender.send(msg);
    }

    private String buildEmailHtml(String name, String resetUrl) {
        return """
            <!DOCTYPE html>
            <html><body style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:32px;">
              <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #e2e8f0;box-shadow:0 4px 16px rgba(0,0,0,0.07);">
                <div style="text-align:center;margin-bottom:24px;">
                  <div style="width:44px;height:44px;background:linear-gradient(135deg,#2563eb,#3b82f6);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;">
                    <span style="color:#fff;font-size:18px;font-weight:700;">S</span>
                  </div>
                  <h2 style="color:#0f172a;margin:12px 0 0;font-size:1.2rem;">SmartShelfX</h2>
                </div>
                <h1 style="color:#0f172a;font-size:1.3rem;margin-bottom:8px;">Reset your password</h1>
                <p style="color:#64748b;font-size:0.9rem;line-height:1.6;">Hi %s,</p>
                <p style="color:#64748b;font-size:0.9rem;line-height:1.6;">
                  We received a request to reset your SmartShelfX password. Click the button below to set a new password. This link expires in <strong>15 minutes</strong>.
                </p>
                <div style="text-align:center;margin:28px 0;">
                  <a href="%s" style="background:linear-gradient(90deg,#2563eb,#3b82f6);color:#fff;padding:13px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:0.95rem;display:inline-block;">
                    Reset Password
                  </a>
                </div>
                <p style="color:#94a3b8;font-size:0.78rem;line-height:1.6;">
                  If you didn't request this, you can safely ignore this email. Your password will not change.
                </p>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
                <p style="color:#cbd5e1;font-size:0.72rem;text-align:center;">SmartShelfX Enterprise · Secure Password Reset</p>
              </div>
            </body></html>
            """.formatted(name != null ? name : "there", resetUrl);
    }
}
