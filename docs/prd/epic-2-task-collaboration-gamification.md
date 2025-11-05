# Epic 2 Task Collaboration & Gamification

### Story 2.1: Task Commenting
As an **authenticated user**,
I want to **add comments to tasks**,
so that **I can communicate and collaborate with my team members about specific tasks.**

**Acceptance Criteria:**
1.  The task detail view includes a section for comments.
2.  Users can type and submit new comments.
3.  Comments are displayed chronologically, showing the author and timestamp.
4.  Comments are persisted to the database.
5.  Real-time updates ensure new comments appear for all active users viewing the task.

### Story 2.2: File Attachments to Tasks
As an **authenticated user**,
I want to **attach files to tasks via drag and drop**,
so that **I can provide relevant documents or resources for the task.**

**Acceptance Criteria:**
1.  The task detail view includes an area for file attachments.
2.  Users can drag and drop files onto this area to upload them.
3.  Uploaded files are associated with the task and stored securely.
4.  Attached files are listed in the task detail view, with options to download them.
5.  The system handles common file types (e.g., images, PDFs, documents).

### Story 2.3: Foundational Badge System
As an **authenticated user**,
I want to **earn and display badges based on task completion**,
so that **my efforts are recognized and I feel more motivated.**

**Acceptance Criteria:**
1.  A system exists to define and manage badges (e.g., "First Task Completed," "5 Tasks Completed").
2.  When a user completes a task, the system checks if any badge criteria are met.
3.  If criteria are met, the user is awarded the corresponding badge.
4.  Earned badges are displayed on the user's profile page.
5.  A notification (e.g., a subtle animation or message) informs the user when they earn a new badge.
