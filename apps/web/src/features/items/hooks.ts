import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createItem, listItems } from "./api";

export const useItems = () => {
  return useQuery({
    queryKey: ["items"],
    queryFn: listItems
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
