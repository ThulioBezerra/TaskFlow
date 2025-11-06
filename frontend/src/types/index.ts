export interface Comment {
    id: string;
    author: {
        id: string;
        username: string;
    };
    content: string;
    timestamp: string; // ISO 8601 string
}

export interface Attachment {
    id: string;
    fileName: string;
    fileType: string;
    url: string;
    taskId: string;
    uploadedAt: string; // ISO 8601 string
}
