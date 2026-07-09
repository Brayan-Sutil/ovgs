import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createItem, listItems } from "./api";

export const useItems = (enabled = true) => {
  return useQuery({
    queryKey: ["items"],
    queryFn: listItems,
    enabled
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["items"] });
    }
  });
};
