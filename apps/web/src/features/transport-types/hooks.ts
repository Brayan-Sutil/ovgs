import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTransportType, listTransportTypes, updateTransportType } from "./api";

export function useTransportTypes() {
  return useQuery({
    queryKey: ["transport-types"],
    queryFn: listTransportTypes
  });
}

export function useCreateTransportType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransportType,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transport-types"] });
    }
  });
}

export function useUpdateTransportType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload
    }: {
      id: string;
      payload: Parameters<typeof updateTransportType>[1];
    }) => updateTransportType(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transport-types"] });
      void queryClient.invalidateQueries({ queryKey: ["customers"] });
    }
  });
}
