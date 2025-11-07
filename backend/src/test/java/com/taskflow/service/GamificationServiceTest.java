package com.taskflow.service;

import java.util.HashSet;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.taskflow.model.Badge;
import com.taskflow.model.TaskStatus;
import com.taskflow.model.User;
import com.taskflow.repository.BadgeRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class GamificationServiceTest {

    @Mock
    private BadgeRepository badgeRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private TaskRepository taskRepository;
    @InjectMocks
    private GamificationService gamificationService;

    private User user;
    private Badge firstTaskBadge;
    private Badge fiveTasksBadge;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setBadges(new HashSet<>());

        firstTaskBadge = Badge.builder().name("First Task Completed").build();
        fiveTasksBadge = Badge.builder().name("5 Tasks Completed").build();
    }

    @Test
    void checkAndAwardBadges_FirstTaskCompleted_AwardsBadge() {
        when(taskRepository.countByAssigneeAndStatus(user, TaskStatus.DONE)).thenReturn(1L);
        when(badgeRepository.findByName("First Task Completed")).thenReturn(Optional.of(firstTaskBadge));

        gamificationService.checkAndAwardBadges(user);

        verify(userRepository, times(1)).save(user);
        assert (user.getBadges().contains(firstTaskBadge));
    }

    @Test
    void checkAndAwardBadges_FiveTasksCompleted_AwardsBadge() {
        when(taskRepository.countByAssigneeAndStatus(user, TaskStatus.DONE)).thenReturn(5L);
        when(badgeRepository.findByName("First Task Completed")).thenReturn(Optional.of(firstTaskBadge));
        when(badgeRepository.findByName("5 Tasks Completed")).thenReturn(Optional.of(fiveTasksBadge));

        gamificationService.checkAndAwardBadges(user);

        verify(userRepository, times(2)).save(user);
        assert (user.getBadges().contains(firstTaskBadge));
        assert (user.getBadges().contains(fiveTasksBadge));
    }
}
