package com.taskflow.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

import com.taskflow.model.User;
import com.taskflow.model.UserRole;
import com.taskflow.repository.UserRepository;

public class WithMockCustomUserSecurityContextFactory implements WithSecurityContextFactory<WithMockCustomUser> {

    @Autowired
    private UserRepository userRepository;

    @Override
    public SecurityContext createSecurityContext(WithMockCustomUser customUser) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();

        User user = userRepository.findByEmail(customUser.username())
                .orElseGet(() -> {
                    User u = new User();
                    u.setEmail(customUser.username());
                    u.setPassword(customUser.password());
                    u.setRole(UserRole.valueOf(customUser.role()));
                    return userRepository.save(u);
                });

        CustomUserDetails principal = new CustomUserDetails(user);

        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                principal,
                principal.getPassword(),
                principal.getAuthorities());

        context.setAuthentication(token);
        return context;
    }
}
