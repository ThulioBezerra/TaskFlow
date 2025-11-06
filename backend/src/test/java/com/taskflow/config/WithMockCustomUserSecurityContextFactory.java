package com.taskflow.config;

import com.taskflow.model.Role;
import com.taskflow.model.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

public class WithMockCustomUserSecurityContextFactory implements WithSecurityContextFactory<WithMockCustomUser> {

    @Override
    public SecurityContext createSecurityContext(WithMockCustomUser customUser) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();

        User principal = User.builder()
                .email(customUser.username())
                .password(customUser.password())
                .role(Role.valueOf(customUser.role()))
                .build();

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                principal,
                principal.getPassword(),
                principal.getAuthorities()
        );

        context.setAuthentication(token);
        return context;
    }
}
