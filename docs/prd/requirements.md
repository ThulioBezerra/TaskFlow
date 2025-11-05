# Requirements

## Functional Requirements

*   **FR1:** Users must be able to register and log in using an email and password. The system will use JWT for authentication.
*   **FR2:** The system must support three basic user roles: Administrator, Manager, and Collaborator.
*   **FR3:** Users must be able to create, edit, delete, and assign tasks.
*   **FR4:** Tasks must include the following fields: title, description, assignee, status (To Do, In Progress, Completed), priority, and due date.
*   **FR5:** Tasks must be viewable in a Kanban board format.
*   **FR6:** Users must be able to filter and search tasks by their status, assignee, and priority.
*   **FR7:** Users must be able to create projects and associate tasks with them.
*   **FR8:** Projects must have a name, description, and a list of team members.
*   **FR9:** Users must be able to add comments to tasks.
*   **FR10:** Users must be able to attach files to tasks via drag and drop.
*   **FR11:** The system will include a foundational gamification system where users can earn and display badges based on task completion.
*   **FR12:** The system must be able to send basic notifications (e.g., "Task created," "Task completed") to a designated Slack or Microsoft Teams channel.

## Non Functional Requirements

*   **NFR1:** The application must be a desktop-first responsive web application, ensuring usability on common mobile browser resolutions.
*   **NFR2:** The application must be compatible with the latest stable versions of Chrome, Firefox, Safari, and Edge.
*   **NFR3:** Real-time interactions, such as moving a task on the Kanban board, must be reflected for all connected users near-instantly.
*   **NFR4:** The MVP will be built using a monolithic architecture, but with clear logical boundaries between components to facilitate future migration to microservices.
*   **NFR5:** The architecture must incorporate a real-time communication layer (e.g., WebSockets with STOMP) to support collaborative features.
*   **NFR6:** The system must expose a clear API layer to support the frontend client and future integrations.

## Security and Compliance
*   **NFR7:** The system must be designed to comply with data protection regulations such as LGPD and GDPR, particularly concerning user data handling, consent, and the right to be forgotten.
*   **NFR8:** JWTs issued upon login must have a clearly defined, short expiration period (e.g., 15 minutes) to minimize security risks. A refresh token mechanism will be implemented to allow for seamless re-authentication without requiring users to log in repeatedly.
*   **NFR9:** All user passwords must be securely hashed and salted using a strong, industry-standard algorithm (e.g., bcrypt).
