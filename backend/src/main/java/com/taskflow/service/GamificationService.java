package com.taskflow.service;

import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.taskflow.model.Badge;
import com.taskflow.model.TaskStatus;
import com.taskflow.model.User;
import com.taskflow.repository.BadgeRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GamificationService {

    private final BadgeRepository badgeRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public void checkAndAwardBadges(User user) {
        long completedTasks = taskRepository.countByAssigneeAndStatus(user, TaskStatus.DONE);

        if (completedTasks >= 1) {
            awardBadge(user, "First Task Completed");
        }

        if (completedTasks >= 5) {
            awardBadge(user, "5 Tasks Completed");
        }
    }

    private void awardBadge(User user, String badgeName) {
        Optional<Badge> badgeOptional = badgeRepository.findByName(badgeName);
        if (badgeOptional.isPresent()) {
            Badge badge = badgeOptional.get();
            if (Objects.isNull(user)) {
                throw new IllegalArgumentException("User cannot be null");
            }
            if (Objects.isNull(user.getBadges())) {
                throw new IllegalArgumentException("Bagde cannot be null");
            }
            if (!user.getBadges().contains(badge)) {
                user.getBadges().add(badge);
                userRepository.save(user);
            }
        }
    }
}
