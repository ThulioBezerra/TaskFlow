# User Flows

### Onboarding: Registration & Login

**User Goal:** To create a new account or access an existing account to use TaskFlow.

**Entry Points:**
*   Navigating to the application's root URL for the first time.
*   Being logged out and returning to the application.

**Success Criteria:**
*   A new user successfully creates an account and is logged in.
*   An existing user successfully logs in and is taken to their main dashboard.

**Flow Diagram**
```mermaid
graph TD
    A[Start] --> B{Has Account?};
    B -- No --> C[Registration Screen];
    C --> D[Enter Email & Password];
    D --> E{Valid & Unique?};
    E -- No --> F[Show Error];
    F --> D;
    E -- Yes --> G[Create User Record];
    G --> H[Log User In];
    H --> I[Main Dashboard];
    B -- Yes --> J[Login Screen];
    J --> K[Enter Email & Password];
    K --> L{Credentials Valid?};
    L -- No --> M[Show Error];
    M --> K;
    L -- Yes --> H;
```

**Edge Cases & Error Handling:**
*   User enters an email that is already registered.
*   User enters a password that doesn't meet security requirements (e.g., too short).
*   User enters incorrect login credentials.
*   User forgets their password (Note: Password reset flow is not in MVP but should be considered).

### Core Task Management: Create, View, and Update Tasks

**User Goal:** To create a new task, view it on the Kanban board, and update its status by moving it.

**Entry Points:**
*   Clicking a "Create Task" button from the Main Dashboard or Kanban Board.
*   Interacting with the Kanban board to view and move tasks.

**Success Criteria:**
*   A user can successfully create a new task, and it appears in the "To Do" column.
*   A user can drag a task from one column (e.g., "To Do") and drop it into another (e.g., "In Progress").
*   The task's status is updated in real-time for all project members.

**Flow Diagram**
```mermaid
graph TD
    A[Start on Kanban Board] --> B{Action?};
    B -- Create New Task --> C[Open Create Task Form];
    C --> D[Enter Title & Description];
    D --> E[Submit Form];
    E --> F{Valid?};
    F -- No --> G[Show Validation Error];
    G --> D;
    F -- Yes --> H["Create Task in DB (Status: To Do)"];
    H --> I[Display New Task on Board];
    I --> A;

    B -- Update Task Status --> J[Select & Drag Task Card];
    J --> K[Drop Card in New Column];
    K --> L[Update Task Status in DB];
    L --> M[Reflect Change on Board in Real-Time];
    M --> A;

```

**Edge Cases & Error Handling:**
*   User tries to create a task without a title.
*   A network error occurs while creating or updating a task.
*   Two users attempt to move the same task simultaneously (the system should gracefully handle the conflict, likely on a first-come, first-served basis).
