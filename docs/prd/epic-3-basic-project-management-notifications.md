# Epic 3 Basic Project Management & Notifications

### Story 3.1: Project Creation and Management
As an **authenticated user**,
I want to **create new projects with a name, description, and team members**,
so that **I can organize my tasks into distinct workstreams.**

**Acceptance Criteria:**
1.  A "Create Project" option is available in the application.
2.  The project creation form requires a project name and allows for a description.
3.  The user creating the project is automatically assigned as a 'Manager' or 'Administrator' for that project.
4.  Users can invite other registered users to join the project as 'Collaborators'.
5.  Project details (name, description, members) can be viewed and edited by authorized users.
6.  Projects are persisted to the database.

### Story 3.2: Linking Tasks to Projects
As an **authenticated user**,
I want to **associate tasks with a specific project**,
so that **all relevant tasks are grouped under their respective workstreams.**

**Acceptance Criteria:**
1.  When creating a new task, the user can select an existing project to link it to.
2.  When editing an existing task, the user can change its associated project.
3.  The Kanban board view can be filtered to show tasks belonging to a specific project.
4.  Tasks are displayed with an indicator of their associated project.

### Story 3.3: Basic External Notifications
As a **project manager**,
I want to **configure basic notifications to be sent to a designated Slack or Microsoft Teams channel**,
so that **my team stays informed about key task updates.**

**Acceptance Criteria:**
1.  In project settings, a 'Notifications' section is available.
2.  Managers can input a webhook URL for a Slack or Microsoft Teams channel.
3.  Managers can select which events trigger a notification (e.g., "Task Created," "Task Completed," "Task Status Changed").
4.  When a selected event occurs, a concise notification message is sent to the configured webhook URL.
5.  The notification message includes relevant task details (e.g., task title, new status, assignee).
