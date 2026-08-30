"use client";

import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AccountDetails } from "@/src/features/user/components/account-details";
import { ProfileForm } from "@/src/features/user/components/profile-form";
import { ProfileHeader } from "@/src/features/user/components/profile-header";
import { useMyProfile } from "@/src/features/user/hooks/useUser";

export default function ProfilePage() {
  const profileQuery = useMyProfile();

  if (profileQuery.isPending) {
    return <ProfileSkeleton />;
  }

  if (profileQuery.isError) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border py-20 text-center">
          <h1 className="text-lg font-semibold">Could not load profile</h1>

          <p className="max-w-sm text-sm text-muted-foreground">
            Something went wrong while fetching your profile. Please try
            again.
          </p>

          <Button
            variant="outline"
            className="mt-4"
            onClick={() => profileQuery.refetch()}
          >
            Try again
          </Button>
        </div>
      </main>
    );
  }

  const user = profileQuery.data;

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-8"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your personal information and account settings.
          </p>
        </div>

        <ProfileHeader user={user} />

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account details</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileForm user={user} />
          </TabsContent>

          <TabsContent value="account" className="mt-6">
            <AccountDetails user={user} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}

function ProfileSkeleton() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>

        <Skeleton className="h-48 w-full rounded-3xl" />

        <div className="space-y-4">
          <Skeleton className="h-10 w-64 rounded-full" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </div>
    </main>
  );
}