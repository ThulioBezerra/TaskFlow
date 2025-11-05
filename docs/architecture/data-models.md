# Data Models

This section defines the core data entities for the TaskFlow application. These models are derived from the functional requirements and user stories in the PRD.

## User

**Purpose:** Represents an individual who can log in and interact with the application.

**Key Attributes:**
- `id`: `UUID` - Unique identifier for the user.
- `email`: `String` - User's email address, used for login. Must be unique.
- `password`: `String` - Hashed and salted password.
- `role`: `Enum` - User's role (`ADMINISTRATOR`, `MANAGER`, `COLLABORATOR`).
- `createdAt`: `Timestamp` - When the user account was created.

### TypeScript Interface
```typescript
export enum UserRole {
  ADMINISTRATOR = 'ADMINISTRATOR',
  MANAGER = 'MANAGER',
  COLLABORATOR = 'COLLABORATOR',
}

export interface User {
  id: string; // UUID
  email: string;
  role: UserRole;
  createdAt: string; // ISO 8601
}
```

### Relationships
- One-to-Many: A `User` can be assigned to many `Tasks`.
- Many-to-Many: A `User` can be a member of many `Projects`.

## Project

**Purpose:** A container for organizing related tasks and team members.

**Key Attributes:**
- `id`: `UUID` - Unique identifier for the project.
- `name`: `String` - The name of the project.
- `description`: `String` - A brief description of the project.
- `createdAt`: `Timestamp` - When the project was created.

### TypeScript Interface
```typescript
export interface Project {
  id: string; // UUID
  name: string;
  description?: string;
  members: User[];
  createdAt: string; // ISO 8601
}
```

### Relationships
- Many-to-Many: A `Project` can have many `Users` (members).
- One-to-Many: A `Project` can have many `Tasks`.

## Task

**Purpose:** Represents a single unit of work to be completed.

**Key Attributes:**
- `id`: `UUID` - Unique identifier for the task.
- `title`: `String` - The title of the task.
- `description`: `String` - Detailed description of the task.
- `status`: `Enum` - Current status (`TO_DO`, `IN_PROGRESS`, `COMPLETED`).
- `priority`: `Enum` - Priority level (`LOW`, `MEDIUM`, `HIGH`).
- `dueDate`: `Date` - When the task is due.
- `createdAt`: `Timestamp` - When the task was created.

### TypeScript Interface
```typescript
export enum TaskStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Task {
  id: string; // UUID
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // ISO 8601 Date
  assignee?: User;
  project: Project;
  comments: Comment[];
  attachments: Attachment[];
  createdAt: string; // ISO 8601
}
```

### Relationships
- Many-to-One: Many `Tasks` belong to one `Project`.
- Many-to-One: Many `Tasks` can be assigned to one `User`.
- One-to-Many: A `Task` can have many `Comments`.
- One-to-Many: A `Task` can have many `Attachments`.

## Comment

**Purpose:** Represents a comment made on a task for collaboration.

**Key Attributes:**
- `id`: `UUID` - Unique identifier for the comment.
- `content`: `String` - The text of the comment.
- `createdAt`: `Timestamp` - When the comment was posted.

### TypeScript Interface
```typescript
export interface Comment {
  id: string; // UUID
  content: string;
  author: User;
  createdAt: string; // ISO 8601
}
```

### Relationships
- Many-to-One: Many `Comments` belong to one `Task`.
- Many-to-One: Many `Comments` are written by one `User` (author).

## Attachment

**Purpose:** Represents a file attached to a task.

**Key Attributes:**
- `id`: `UUID` - Unique identifier for the attachment.
- `fileName`: `String` - The name of the uploaded file.
- `fileUrl`: `String` - The path or URL to access the file.
- `fileType`: `String` - The MIME type of the file.
- `uploadedAt`: `Timestamp` - When the file was uploaded.

### TypeScript Interface
```typescript
export interface Attachment {
  id: string; // UUID
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string; // ISO 8601
}
```

### Relationships
- Many-to-One: Many `Attachments` belong to one `Task`.

## Badge

**Purpose:** Represents a gamification achievement that users can earn.

**Key Attributes:**
- `id`: `UUID` - Unique identifier for the badge.
- `name`: `String` - The name of the badge (e.g., "First Task Completed").
- `description`: `String` - How to earn the badge.
- `iconUrl`: `String` - URL to the badge's icon.

### TypeScript Interface
```typescript
export interface Badge {
  id: string; // UUID
  name: string;
  description: string;
  iconUrl: string;
}
```

### Relationships
- Many-to-Many: A `Badge` can be earned by many `Users`.
