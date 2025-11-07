import React, { useState } from 'react';
import { addCommentToTask } from '../services/taskService';
import type { Comment } from '../types';

interface CommentsSectionProps {
  taskId: string;
  comments: Comment[];
  onCommentAdded: (newComment: Comment) => void;
}

// helper seguro para datas
function formatWhen(c: any): string {
  const candidate: string | number | undefined =
    c?.createdAt ?? c?.created_at ?? c?.timestamp;

  if (candidate == null) return '—';

  // alguns backends mandam epoch em segundos
  const asNumber = Number(candidate);
  const date =
    !Number.isNaN(asNumber) && `${candidate}`.length <= 10
      ? new Date(asNumber * 1000)
      : new Date(candidate);

  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  taskId,
  comments,
  onCommentAdded,
}) => {
  const [newCommentContent, setNewCommentContent] = useState('');

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;

    try {
      const added = await addCommentToTask(taskId, newCommentContent.trim());
      onCommentAdded(added);
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
          comments.map((c) => (
            <div key={c.id} className="comment-item">
              <p className="comment-author">{c.author.email}</p>
              <p className="comment-content">{c.content}</p>
              <p className="comment-timestamp">{formatWhen(c)}</p>
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
