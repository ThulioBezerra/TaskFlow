import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard, { Task } from './TaskCard';

interface KanbanColumnProps {
    id: string;
    title: string;
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, tasks, onTaskClick }) => {
    const { setNodeRef } = useDroppable({ id });

    const style = {
        width: '300px',
        minHeight: '500px',
        margin: '0 10px',
        padding: '10px',
        backgroundColor: '#f4f5f7',
        borderRadius: '4px',
    };

    return (
        <div ref={setNodeRef} style={style}>
            <h3>{title}</h3>
            <SortableContext
                id={id}
                items={tasks.map(t => t.id)}
                strategy={verticalListSortingStrategy}
            >
                {tasks.map(task => <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />)}
            </SortableContext>
        </div>
    );
};

export default KanbanColumn;
