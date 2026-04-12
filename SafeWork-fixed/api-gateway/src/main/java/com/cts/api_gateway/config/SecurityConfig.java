    package com.cts.api_gateway.config;

    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
    import org.springframework.security.config.web.server.ServerHttpSecurity;
    import org.springframework.security.web.server.SecurityWebFilterChain;

    @Configuration
    @EnableWebFluxSecurity
    public class SecurityConfig {

        @Bean
        public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
            http
                // Disable CSRF for stateless APIs
                .csrf(ServerHttpSecurity.CsrfSpec::disable)

                // Configure authorization
                .authorizeExchange(exchanges -> exchanges
                    // Allow all requests - JWT validation is handled by GatewayFilter
                    .anyExchange().permitAll()
                )

                // Configure CORS
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowedOrigins(java.util.Arrays.asList("*"));
                    config.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(java.util.Arrays.asList("*"));
                    config.setAllowCredentials(false);
                    return config;
                }));



            return http.build();
        }
    }
