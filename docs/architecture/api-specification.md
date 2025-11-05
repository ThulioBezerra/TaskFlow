# API Specification

This section defines the REST API for the TaskFlow application. The API will be documented using Swagger (SpringDoc), and the specification will adhere to the OpenAPI 3.0 standard.

## REST API Specification

```yaml
openapi: 3.0.0
info:
  title: TaskFlow API
  version: 1.0.0
  description: API for the TaskFlow project management application.
servers:
  - url: http://localhost:8080/api
    description: Local development server

paths:
  /auth/register:
    post:
      summary: Register a new user
      description: Creates a new user account with the 'COLLABORATOR' role.
      # Request body and responses would be defined here
  /auth/login:
    post:
      summary: Log in a user
      description: Authenticates a user and returns a JWT.
      # Request body and responses would be defined here

  /projects:
    get:
      summary: Get all projects for the current user
      description: Returns a list of projects the authenticated user is a member of.
    post:
      summary: Create a new project
      description: Creates a new project and assigns the creator as a manager.

  /projects/{projectId}:
    get:
      summary: Get a single project by ID
      description: Returns detailed information about a specific project.
    put:
      summary: Update a project
      description: Updates the name or description of a project.

  /projects/{projectId}/tasks:
    get:
      summary: Get all tasks for a project
      description: Returns a list of all tasks associated with a specific project.
    post:
      summary: Create a new task in a project
      description: Creates a new task and links it to the specified project.

  /tasks/{taskId}:
    get:
      summary: Get a single task by ID
      description: Returns detailed information about a specific task.
    put:
      summary: Update a task
      description: Updates a task's details (title, status, assignee, etc.).
    delete:
      summary: Delete a task
      description: Deletes a task from the system.

  /tasks/{taskId}/comments:
    get:
      summary: Get all comments for a task
      description: Returns a list of all comments on a specific task.
    post:
      summary: Add a comment to a task
      description: Creates a new comment on a specific task.

  /tasks/{taskId}/attachments:
    post:
      summary: Attach a file to a task
      description: Uploads a file and attaches it to a specific task.

  /users/me/badges:
    get:
      summary: Get badges for the current user
      description: Returns a list of badges earned by the authenticated user.
```
