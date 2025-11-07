// src/hooks/useTasks.ts (apenas o useTaskDetails)
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  updateTask,
  deleteTask,
  fetchCommentsForTask,
  type UpdateTaskRequest,
} from "../services/taskService";
import type { Task } from "../components/TaskCard";
import { TaskStatus } from "../components/TaskCard";
import type { Comment } from "../types";

type UseTaskDetailsArgs = {
  task: Task;
  onClose: () => void;
};

// util segura p/ input type=date
function toYMD(dateStr?: string | null): string {
  if (!dateStr) return "";
  // aceita "YYYY-MM-DD" direto; se vier ISO, corta a parte da data
  return dateStr.length >= 10 ? dateStr.slice(0, 10) : "";
}

export default function useTaskDetails({ task, onClose }: UseTaskDetailsArgs) {
  const qc = useQueryClient();

  // ---- Form state (inicial)
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<number>(task.priority ?? 0);
  const [dueDate, setDueDate] = useState<string>(toYMD(task.dueDate));
  const [status, setStatus] = useState<TaskStatus>(task.status);

  // IMPORTANTE: seu select usa **email** como value
  const [selectedAssigneeId, setSelectedAssigneeId] =
    useState<string | undefined>(task.assignee?.email);
  const [selectedProjectId, setSelectedProjectId] =
    useState<string | undefined>(task.project?.id);

  // ---- Sincroniza quando a task prop mudar (abrir outra task sem desmontar)
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority ?? 0);
    setDueDate(toYMD(task.dueDate));
    setStatus(task.status);
    setSelectedAssigneeId(task.assignee?.email);
    setSelectedProjectId(task.project?.id);
  }, [task]);

  // ---- Comentários
  const { data: comments = [], isLoading: loadingComments } = useQuery<Comment[]>({
    queryKey: ["task-comments", task.id],
    queryFn: () => fetchCommentsForTask(task.id),
    enabled: Boolean(task.id),
    staleTime: 60_000,
  });

  // ---- Mutations
  const updateMutation = useMutation({
    mutationFn: (payload: UpdateTaskRequest) => updateTask(task.id, payload),
    onSuccess: () => {
      // revalida lista/colunas do kanban
      qc.invalidateQueries({ queryKey: ["tasks"] });
      // se o backend eventualmente gerar system-comments, revalida:
      // qc.invalidateQueries({ queryKey: ["task-comments", task.id] });
      onClose();
    },
    onError: (err) => {
      // coloque seu toast aqui se quiser
      console.error("updateTask failed:", err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(task.id),
    // Optimistic update p/ sumir na hora
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["tasks"] });
      const prev = qc.getQueryData<Task[]>(["tasks"]);
      qc.setQueryData<Task[]>(["tasks"], (old = []) => old.filter(t => t.id !== task.id));
      return { prev };
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["tasks"], ctx.prev);
      console.error("deleteTask failed:", err);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onSuccess: () => {
      onClose();
    },
  });

  // ---- Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Semântica:
    // undefined → não altera
    // ''       → null (desassocia)
    // string   → valor (email/id conforme seu backend)
    const assignee =
      selectedAssigneeId === undefined
        ? undefined
        : selectedAssigneeId === ""
        ? null
        : selectedAssigneeId;

    const project =
      selectedProjectId === undefined
        ? undefined
        : selectedProjectId === ""
        ? null
        : selectedProjectId;

    // ⚠️ Se seu backend espera *email*, prefira enviar assigneeEmail.
    // Duas opções:
    // 1) Mudar o tipo em taskService UpdateTaskRequest para `assigneeEmail?: string | null`
    // 2) Manter o tipo e mapear aqui p/ backend (mostrado abaixo)

    const payload: UpdateTaskRequest & Record<string, unknown> = {
      title,
      description,
      priority,
      dueDate: dueDate || null,
      status,
      projectId: project,
    };

    // remapeia p/ assigneeEmail se você usa email:
    if (assignee === undefined) {
      // não mexe
    } else if (assignee === null) {
      // desassocia
      (payload as any).assigneeEmail = null;
    } else {
      // email selecionado
      (payload as any).assigneeEmail = assignee;
    }

    // opcional: remova a chave antiga se existir (se você trocou a API)
    delete (payload as any).assigneeId;

    updateMutation.mutate(payload);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate();
    }
  };

  const loadingAny = loadingComments;

  return {
    // estado
    title, setTitle,
    description, setDescription,
    priority, setPriority,
    dueDate, setDueDate,
    status, setStatus,
    selectedAssigneeId, setSelectedAssigneeId,
    selectedProjectId, setSelectedProjectId,

    // data
    comments,

    // flags
    loadingAny,
    updateIsPending: updateMutation.isPending,
    deleteIsPending: deleteMutation.isPending,

    // actions
    handleSubmit,
    handleDelete,
  };
}
