export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface Attachment {
    id: string;
    name: string;
    url: string;
    type: string;
    fileName: string;
}

export interface Comment {
    id: string;
    content: string;
    author: { id: string; username: string; };
    timestamp: string;
}