export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface Attachment {
    id: string;
    fileName: string;
    fileType: string;
    url: string;
    taskId: string;
    uploadedAt: string;
}

export interface Comment {
    id: string;
    content: string;
    author: { id: string; email: string; };
    timestamp: string;
}

export interface ProjectSummary {
    id: string;
    name: string;
    members: ProjectUser[];
}

export interface UserSummary {
  id: string;
  email: string;
}

export interface ProjectUser {
  id: string;
  email: string;
}

export interface ProjectResponse {
  id: string;
  name: string;
  description: string | null;
  manager: ProjectUser | null;
  members: ProjectUser[];
}

export interface ProjectSummary {
  id: string;
  name: string;
}

export interface AllUsers {
  email: string
}