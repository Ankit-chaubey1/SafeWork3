package com.cts.employee_service.client;

import com.cts.employee_service.dto.UserPublicDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Feign client to call User Service.
 * Uses the /internal/create endpoint which is open without JWT
 * for service-to-service communication.
 */
@FeignClient(name = "USER-SERVICE")
public interface UserClient {

    @PostMapping("/users/internal/create")
    UserPublicDto createUser(@RequestBody UserPublicDto userPublicDto);
}
