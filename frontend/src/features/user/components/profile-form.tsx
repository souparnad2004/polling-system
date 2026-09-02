"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

import { useUpdateProfile } from "../hooks/use-update-profile";
import { userKeys } from "../hooks/use-user";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "../schemas/update-profile.schema";
import type { User } from "../types/user.types";

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const updateProfileMutation = useUpdateProfile();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      displayName: user.displayName ?? "",
    },
  });

  const onSubmit = (data: UpdateProfileInput) => {
    updateProfileMutation.mutate(data, {
      onSuccess: (updatedUser) => {
        queryClient.setQueryData(userKeys.me(), updatedUser);

        reset({
          displayName: updatedUser.displayName ?? "",
        });

        toast.add({
          title: "Success",
          description: "Profile updated successfully",
          type: "success",
        });
      },
      onError: (error) => {
        toast.add({
          title: "Error",
          description: error.message,
          type: "error",
        });
      },
    });
  };

  const isLoading = updateProfileMutation.isPending;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Profile information</CardTitle>
        <CardDescription>
          This is how others see you on the platform.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display name</Label>

            <Input
              id="displayName"
              placeholder="Your name"
              autoComplete="name"
              {...register("displayName")}
            />

            {errors.displayName && (
              <p className="text-sm text-destructive">
                {errors.displayName.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderCircle
                    aria-hidden="true"
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>

            {isDirty && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => reset()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}