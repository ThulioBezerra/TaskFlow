import { api } from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AllUsers } from "../types";
export async function getUsers() {
  try {
    const response = await api.get("/users/");
    return response.data;
  } catch (error) {
    toast.error("Não há usuários com este e-mail.");
  }
}
export function useUsers() {
  const {
    data: users = [] as AllUsers[],
    isFetched,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => getUsers(),
    queryKey: ["users-list"],
  });
  return { users, isFetched, isLoading, isError };
}
