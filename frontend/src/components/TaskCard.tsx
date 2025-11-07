import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export enum TaskStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export type Assignee = {
    id: string;
    email: string
}

export type Task = {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: number | null;
    dueDate: string | null;
    createdAt: string;
    assignee?: Assignee;
    projectId?: string;
    project?: { id: string; name: string };
}

interface TaskCardProps {
    task: Task;
    onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '10px',
        margin: '5px 0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: 'white',
        cursor: 'grab',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
            <h4>{task.title}</h4>
            {task.project && <p>Project: {task.project.name}</p>}
            <p>{task.description}</p>
        </div>
    );
};

export default TaskCard;
