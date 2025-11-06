import React, { useState } from 'react';
import { addCommentToTask } from '../services/taskService';
import type { Comment } from '../types';

interface CommentsSectionProps {
    taskId: string;
    comments: Comment[];
    token: string;
    onCommentAdded: (newComment: Comment) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ taskId, comments, token, onCommentAdded }) => {
    const [newCommentContent, setNewCommentContent] = useState('');

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommentContent.trim()) return;

        try {
            const addedComment = await addCommentToTask(taskId, newCommentContent, token);
            onCommentAdded(addedComment);
            setNewCommentContent('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    return (
        <div className="comments-section">
            <h3>Comments</h3>
            <div className="comments-list">
                {comments.length === 0 ? (
                    <p>No comments yet.</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                            <p className="comment-author">{comment.author.username}</p>
                            <p className="comment-content">{comment.content}</p>
                            <p className="comment-timestamp">
                                {new Date(comment.timestamp).toLocaleString()}
                            </p>
                        </div>
                    ))
                )}
            </div>
            <form onSubmit={handleAddComment} className="add-comment-form">
                <textarea
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                />
                <button type="submit">Add Comment</button>
            </form>
        </div>
    );
};

export default CommentsSection;
