import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import KanbanColumn from './KanbanColumn';
import { getTasks, updateTaskStatus } from '../services/taskService';
import type { Task } from './TaskCard';
import TaskDetailsModal from './TaskDetailsModal';

const KanbanBoard: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const { data: tasks = [], isLoading } = useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: () => getTasks("DUMMY_TOKEN"),
    });

    const mutation = useMutation({
        mutationFn: ({ id, status }: { id: number, status: string }) => updateTaskStatus(id, status, "DUMMY_TOKEN"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const activeTask = tasks.find(t => t.id === active.id);
            if (activeTask) {
                mutation.mutate({ id: activeTask.id, status: over.id as string });
            }
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const columns = {
        'TO_DO': tasks.filter(t => t.status === 'TO_DO'),
        'IN_PROGRESS': tasks.filter(t => t.status === 'IN_PROGRESS'),
        'DONE': tasks.filter(t => t.status === 'DONE'),
    };

    return (
        <>
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <KanbanColumn id="TO_DO" title="To Do" tasks={columns['TO_DO']} onTaskClick={setSelectedTask} />
                    <KanbanColumn id="IN_PROGRESS" title="In Progress" tasks={columns['IN_PROGRESS']} onTaskClick={setSelectedTask} />
                    <KanbanColumn id="DONE" title="Done" tasks={columns['DONE']} onTaskClick={setSelectedTask} />
                </div>
            </DndContext>
            {selectedTask && (
                <TaskDetailsModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    token="DUMMY_TOKEN"
                />
            )}
        </>
    );
};

export default KanbanBoard;
