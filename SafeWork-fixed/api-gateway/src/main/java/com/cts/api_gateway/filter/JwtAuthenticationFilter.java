package com.cts.api_gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    @Value("${jwt.secret}")
    private String secret;

    public JwtAuthenticationFilter() {
        super(Config.class);
    }

    public static class Config {
        private String allowedRoles;
        public String getAllowedRoles() { return allowedRoles; }
        public void setAllowedRoles(String allowedRoles) { this.allowedRoles = allowedRoles; }
    }

    @Override
    public List<String> shortcutFieldOrder() {
        return Arrays.asList("allowedRoles");
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            // 1. Check Authorization header
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(exchange, "Missing Authorization Header", HttpStatus.UNAUTHORIZED);
            }

            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return onError(exchange, "Invalid Authorization Header", HttpStatus.UNAUTHORIZED);
            }

            String token = authHeader.substring(7);

            try {
                // 2. Validate JWT and extract claims
                SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                String userRole = claims.get("role", String.class);

                // 3. Role-based access check — trim BOTH sides to handle YAML spaces
                if (config.getAllowedRoles() != null && !config.getAllowedRoles().isEmpty()) {
                    List<String> authorizedRoles = Arrays.stream(config.getAllowedRoles().split(","))
                            .map(String::trim)
                            .collect(Collectors.toList());

                    if (userRole == null || !authorizedRoles.contains(userRole.trim().toUpperCase())) {
                        return onError(exchange, "Forbidden: insufficient role", HttpStatus.FORBIDDEN);
                    }
                }

                // 4. Forward user context to downstream services as headers
                Object userIdObj = claims.get("userId");
                String userId = userIdObj != null ? userIdObj.toString() : "";
                String subject = claims.getSubject() != null ? claims.getSubject() : "";

                ServerHttpRequest mutatedRequest = request.mutate()
                        .header("X-User-Id", userId)
                        .header("X-User-Role", userRole != null ? userRole : "")
                        .header("X-User-Email", subject)
                        .build();

                return chain.filter(exchange.mutate().request(mutatedRequest).build());

            } catch (Exception e) {
                return onError(exchange, "Invalid or Expired Token", HttpStatus.UNAUTHORIZED);
            }
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String msg, HttpStatus status) {
        exchange.getResponse().setStatusCode(status);
        return exchange.getResponse().setComplete();
    }
}
