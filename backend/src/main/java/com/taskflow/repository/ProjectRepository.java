package com.taskflow.repository;

import java.util.List;
import com.taskflow.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByMembers_Id(UUID userId); 
}