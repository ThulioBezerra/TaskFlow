package com.taskflow.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    private String passwordResetToken;
    private OffsetDateTime passwordResetTokenExpiry;

    @JsonIgnore // Added for serialization
    @OneToMany(mappedBy = "assignee")
    private Set<Task> assignedTasks;

    @JsonIgnore // Added for serialization
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProjectMembership> memberships;

    @JsonIgnore // Added for serialization
    @OneToMany(mappedBy = "author")
    private Set<Comment> comments;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "user_badges",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "badge_id")
    )
    private Set<Badge> badges;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
    }
}
