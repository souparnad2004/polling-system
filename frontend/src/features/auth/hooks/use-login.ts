import { login } from "../api/auth.api";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "./use-current-user";
import { pollKeys } from "../../polls/hooks/use-polls";
import { statsKeys } from "../../dashboard/hooks/use-stats";

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: (user) => {
            queryClient.removeQueries({ queryKey: pollKeys.all });
            queryClient.removeQueries({ queryKey: statsKeys.all });
            queryClient.setQueryData(authKeys.me(), user);
        },
    })
}