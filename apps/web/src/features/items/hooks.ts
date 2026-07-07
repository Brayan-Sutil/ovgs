import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createItem, listItems } from "./api";

export function useItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: listItems
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["items"] });
    }
  });
}
