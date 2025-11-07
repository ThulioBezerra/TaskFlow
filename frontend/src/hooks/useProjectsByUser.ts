import { api } from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { ProjectSummary } from "../types";
export async function getProjectsByUser() {
  try {
    const response = await api.get("/projects/user");
    console.log("Fetched projects by user:", response.data);
    return response.data;
  } catch (error) {
    toast.error("Não há projetos para seu usuário.");
  }
}
export function useProjectsByUser() {
  const {
    data: projects = [] as ProjectSummary[],
    isFetched,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => getProjectsByUser(),
    queryKey: ["users-list"],
  });
  return { projects, isFetched, isLoading, isError };
}
