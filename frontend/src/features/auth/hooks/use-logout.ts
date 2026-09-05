import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../api/auth.api";
import { authKeys } from "./use-current-user";
import { pollKeys } from "../../polls/hooks/use-polls";
import { statsKeys } from "../../dashboard/hooks/use-stats";

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: authKeys.all });
            queryClient.removeQueries({ queryKey: pollKeys.all });
            queryClient.removeQueries({ queryKey: statsKeys.all });
        },
    })
}