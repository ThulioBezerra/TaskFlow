package com.taskflow.config;

import com.taskflow.model.Badge;
import com.taskflow.repository.BadgeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final BadgeRepository badgeRepository;

    public DataInitializer(BadgeRepository badgeRepository) {
        this.badgeRepository = badgeRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (badgeRepository.findByName("First Task Completed").isEmpty()) {
            Badge firstTaskBadge = Badge.builder()
                    .name("First Task Completed")
                    .description("Completed your very first task.")
                    .icon("first-task-icon")
                    .build();
            badgeRepository.save(firstTaskBadge);
        }

        if (badgeRepository.findByName("5 Tasks Completed").isEmpty()) {
            Badge fiveTasksBadge = Badge.builder()
                    .name("5 Tasks Completed")
                    .description("Completed 5 tasks.")
                    .icon("five-tasks-icon")
                    .build();
            badgeRepository.save(fiveTasksBadge);
        }
    }
}
