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
    author: { id: string; username: string; };
    timestamp: string;
}

export interface ProjectSummary {
    id: string;
    name: string;
}

export interface UserSummary {
  id: string;
  email: string;
}
