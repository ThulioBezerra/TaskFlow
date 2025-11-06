package com.taskflow.config;

import com.taskflow.model.User;
import com.taskflow.model.UserRole;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

import java.util.UUID;

public class WithMockCustomUserSecurityContextFactory implements WithSecurityContextFactory<WithMockCustomUser> {

    @Override
    public SecurityContext createSecurityContext(WithMockCustomUser customUser) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();

        User user = User.builder()
                .id(UUID.randomUUID()) // Generate a random ID for the mock user
                .email(customUser.username())
                .password(customUser.password())
                .role(UserRole.valueOf(customUser.role()))
                .build();

        CustomUserDetails principal = new CustomUserDetails(user);
        CustomAuthenticationToken authentication = new CustomAuthenticationToken(principal, null, principal.getAuthorities());
        context.setAuthentication(authentication);

        return context;
    }
}