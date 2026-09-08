import { useMutation, useQueryClient } from "@tanstack/react-query";

import { register } from "../api/auth.api";
import { authKeys } from "./use-current-user";

export function useRegister() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: register,
        onSuccess: (user) => {
            queryClient.setQueryData(authKeys.me(), user);
        },
    })
}

