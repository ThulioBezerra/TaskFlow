# Epic 1 Foundation & Core Task Management

### Story 1.1: Project Scaffolding
As a **Developer**,
I want **a Monorepo with a Spring Boot backend and a React/Vite frontend**,
so that **I have a clean, organized structure for building the application.**

**Acceptance Criteria:**
1.  A Monorepo is initialized.
2.  A Spring Boot application is created within a `backend` directory.
3.  A React/Vite (TypeScript) application is created within a `frontend` directory.
4.  Basic README files are present in both directories.
5.  The backend can be run, and the frontend can be started.

### Story 1.2: User Registration
As a **new user**,
I want to **register for an account using my email and a password**,
so that **I can access the application.**

**Acceptance Criteria:**
1.  A registration endpoint `POST /api/auth/register` exists.
2.  It accepts an email and password.
3.  It validates that the email is not already in use.
4.  It securely hashes and salts the password before storing it in the database.
5.  Upon successful registration, a new user record is created with the 'Collaborator' role by default.
6.  A success response is returned.

### Story 1.3: User Login
As a **registered user**,
I want to **log in with my email and password**,
so that **I can access my tasks and projects.**

**Acceptance Criteria:**
1.  A login endpoint `POST /api/auth/login` exists.
2.  It accepts an email and password.
3.  It validates the credentials against the stored user data.
4.  Upon successful authentication, a JWT is generated and returned to the client.
5.  The JWT contains user information like user ID and role.
6.  Failed login attempts return an appropriate error message.

### Story 1.4: Basic Task Creation
As an **authenticated user**,
I want to **create a new task with a title and description**,
so that **I can start tracking my work.**

**Acceptance Criteria:**
1.  An authenticated user can access a form to create a new task.
2.  The form requires a 'title' and allows for a 'description'.
3.  Upon submission, a new task is created with a default status of "To Do".
4.  The creator is automatically assigned as the 'assignee'.
5.  The new task is persisted to the database.

### Story 1.5: Kanban Board View & Interaction
As an **authenticated user**,
I want to **see all my tasks on a Kanban board and move them between columns**,
so that **I can visualize and update my workflow in real-time.**

**Acceptance Criteria:**
1.  A Kanban board view is available after login.
2.  The board has three distinct columns: "To Do", "In Progress", and "Completed".
3.  Tasks are displayed as cards within the column corresponding to their status.
4.  Users can drag and drop a task card from one column to another.
5.  Dropping a card in a new column updates the task's status in the backend in real-time.

### Story 1.6: Task Editing and Details
As an **authenticated user**,
I want to **edit a task's details, including its title, description, assignee, priority, and due date**,
so that **I can keep my tasks up-to-date.**

**Acceptance Criteria:**
1.  Clicking on a task card opens a detailed view or modal.
2.  From this view, the user can edit the title, description, priority, and due date.
3.  The user can re-assign the task to another user in the project.
4.  Changes are saved to the database upon submission.
5.  The task card on the Kanban board reflects the updated information.
