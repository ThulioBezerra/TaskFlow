import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import KanbanColumn from './KanbanColumn';
import { getTasks, updateTaskStatus } from '../services/taskService';
import { getProjects } from '../services/projectService';
import type { Task } from './TaskCard';
import type { ProjectSummary } from '../types';
import TaskDetailsModal from './TaskDetailsModal';

const KanbanBoard: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [filterProjectId, setFilterProjectId] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const fetchedProjects = await getProjects("DUMMY_TOKEN");
                setProjects(fetchedProjects);
            } catch (err) {
                console.error('Error fetching projects:', err);
            }
        };
        fetchProjects();
    }, []);

    const { data: tasks = [], isLoading } = useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: () => getTasks("DUMMY_TOKEN"),
    });

    const mutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) => updateTaskStatus(id, status, "DUMMY_TOKEN"),
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

    const filteredTasks = filterProjectId
        ? tasks.filter(task => task.project?.id === filterProjectId)
        : tasks;

    const columns = {
        'TO_DO': filteredTasks.filter(t => t.status === 'TO_DO'),
        'IN_PROGRESS': filteredTasks.filter(t => t.status === 'IN_PROGRESS'),
        'DONE': filteredTasks.filter(t => t.status === 'DONE'),
    };

    return (
        <>
            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                <label htmlFor="projectFilter">Filter by Project: </label>
                <select
                    id="projectFilter"
                    value={filterProjectId || ''}
                    onChange={(e) => setFilterProjectId(e.target.value || undefined)}
                >
                    <option value="">All Projects</option>
                    {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                </select>
            </div>
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
