import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './TaskCard.css';

export enum TaskStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export type Assignee = { id: string; email: string };

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
};

interface TaskCardProps {
  task: Task;
  onClick: () => void;        // abrir modal de detalhes/edição
}

const statusLabel: Record<TaskStatus, string> = {
  [TaskStatus.TO_DO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.DONE]: 'Done',
};

const priorityLabel = (p: number | null) => {
  if (p === null || p === undefined) return '—';
  return String(p);
};

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    // 1) nada de onClick no wrapper; evita conflitos com drag
    <div ref={setNodeRef} style={style} className="tf-card" draggable={false}>
      <div className="tf-card__top">
        {/* 2) listeners/attributes SOMENTE no handle */}
        <div
          className="tf-card__drag"
          {...attributes}
          {...listeners}
          title="Arrastar"
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        >
          <span className="tf-card__drag-dots" />
        </div>

        <div className="tf-card__title-wrap">
          <h4 className="tf-card__title" title={task.title}>
            {task.title}
          </h4>
          <span className={`tf-chip tf-chip--${task.status.toLowerCase()}`}>
            {statusLabel[task.status]}
          </span>
        </div>

        {/* 3) botão seguro: não arrasta, não propaga, não submete nada */}
        <button
          type="button"
          className="primary-button tf-card__edit"
          draggable={false}
          onMouseDown={(e) => e.stopPropagation()}   // evita iniciar drag
          onPointerDown={(e) => e.stopPropagation()}  // cobre mobile/pointer
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick(); // abre o modal
          }}
        >
          Editar
        </button>
      </div>

      {task.description && (
        <p className="tf-card__desc" title={task.description}>
          {task.description}
        </p>
      )}

      <div className="tf-card__meta">
        <div className="tf-meta__item" title={task.project?.name || 'Sem projeto'}>
          <span className="tf-meta__label">Projeto</span>
          <span className="tf-meta__value">{task.project?.name ?? '—'}</span>
        </div>

        <div className="tf-meta__item" title={task.assignee?.email || 'Sem responsável'}>
          <span className="tf-meta__label">Assignee</span>
          <span className="tf-meta__value tf-assignee">{task.assignee?.email ?? '—'}</span>
        </div>

        <div className="tf-meta__item" title={task.dueDate ?? '—'}>
          <span className="tf-meta__label">Due</span>
          <span className="tf-meta__value">{formatDate(task.dueDate)}</span>
        </div>

        <div className="tf-meta__item" title={String(task.priority ?? '—')}>
          <span className="tf-meta__label">Pri</span>
          <span className="tf-meta__value">{priorityLabel(task.priority)}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
