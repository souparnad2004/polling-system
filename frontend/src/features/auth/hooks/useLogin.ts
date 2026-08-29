import { login } from "../api/login.api";

import { useMutation } from "@tanstack/react-query";

export function useLogin() {
    return useMutation({
        mutationFn: login
    })
}