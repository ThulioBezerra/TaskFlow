export interface Comment {
    id: string;
    author: {
        id: string;
        username: string;
    };
    content: string;
    timestamp: string; // ISO 8601 string
}
