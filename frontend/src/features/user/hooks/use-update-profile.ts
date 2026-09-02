import { useMutation } from "@tanstack/react-query";

import { updateMyProfile } from "../api/user.api";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateMyProfile,
  });
}