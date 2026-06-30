package edu.infosys.inventoryApplication.config;

import edu.infosys.inventoryApplication.bean.InventoryUser;
import edu.infosys.inventoryApplication.dao.InventoryUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Configuration
@EnableMethodSecurity
public class SystemConfig {

    @Value("${app.frontend-url:http://localhost:3838}")
    private String frontendUrl;

    @Autowired
    private InventoryUserRepository userRepo;

    @Autowired
    private EncoderConfig encoderConfig;

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of("http://localhost:3838", frontendUrl));
        cfg.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);
        cfg.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

    @Bean
    @SuppressWarnings("deprecation")
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.GET,    "/inventory/**").permitAll()
                .requestMatchers(HttpMethod.POST,   "/inventory/**").permitAll()
                .requestMatchers(HttpMethod.PUT,    "/inventory/**").permitAll()
                .requestMatchers(HttpMethod.PATCH,  "/inventory/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/inventory/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oauth2SuccessHandler())
            );
        return http.build();
    }

    /**
     * After successful Google login:
     * 1. Auto-create user if first time
     * 2. Redirect to frontend dashboard with role and username as query params
     */
    @Bean
    public AuthenticationSuccessHandler oauth2SuccessHandler() {
        return new AuthenticationSuccessHandler() {
            @Override
            public void onAuthenticationSuccess(HttpServletRequest request,
                                                HttpServletResponse response,
                                                Authentication authentication) throws IOException {

                OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
                String email        = oauthUser.getAttribute("email");
                String name         = oauthUser.getAttribute("name");
                String username     = email != null ? email.split("@")[0] : "google_user";

                // Find or create user
                Optional<InventoryUser> existing = userRepo.findByEmail(email);
                String role;

                if (existing.isPresent()) {
                    role = existing.get().getRole();
                } else {
                    // Auto-register as Manager (safe default)
                    InventoryUser newUser = new InventoryUser(
                        username,
                        encoderConfig.passwordEncoder().encode("google-oauth-" + username),
                        new ArrayList<>(),
                        username, name, email,
                        encoderConfig.passwordEncoder().encode("google-oauth-" + username),
                        "Manager"
                    );
                    userRepo.save(newUser);
                    role = "Manager";
                }

                // Redirect to frontend with user info
                String redirectUrl = frontendUrl + "/oauth2/callback"
                    + "?username=" + username
                    + "&role=" + role
                    + "&email=" + (email != null ? email : "");

                response.sendRedirect(redirectUrl);
            }
        };
    }
}
