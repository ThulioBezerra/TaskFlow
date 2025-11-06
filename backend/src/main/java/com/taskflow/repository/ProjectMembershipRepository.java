package com.taskflow.repository;

import com.taskflow.model.ProjectMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProjectMembershipRepository extends JpaRepository<ProjectMembership, UUID> {
}
