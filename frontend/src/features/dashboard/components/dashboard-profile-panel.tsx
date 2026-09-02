"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountDetails } from "@/src/features/user/components/account-details";
import { ProfileHeader } from "@/src/features/user/components/profile-header";
import type { User } from "@/src/features/user/types/user.types";

interface DashboardProfilePanelProps {
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  user: User | null;
}

export function DashboardProfilePanel({
  isPending,
  isError,
  onRetry,
  user,
}: DashboardProfilePanelProps) {
  if (isPending) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        </div>

        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <h2 className="font-semibold">Could not load profile</h2>
          <p className="text-sm text-muted-foreground">
            Something went wrong while fetching your profile.
          </p>
          <Button variant="outline" className="mt-2" onClick={onRetry}>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your personal information and account settings.
        </p>
      </div>

      <ProfileHeader user={user} />
      <AccountDetails user={user} />
    </div>
  );
}
