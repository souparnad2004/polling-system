"use client";

import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type { User } from "../types/user.types";

interface ProfileHeaderProps {
  user: User;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const displayName = user.displayName || "Anonymous";
  const isActive = user.status === "active";
  const memberSince = format(new Date(user.createdAt), "MMMM yyyy");

  return (
    <Card className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-28 bg-linear-to-r from-primary/15 via-secondary/25 to-accent/15"
      />

      <CardContent className="relative flex flex-col gap-6 pt-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex items-end gap-4">
            <Avatar
              size="lg"
              className="size-20 data-[size=lg]:size-20"
            >
              <AvatarFallback className="from-primary/15 to-secondary/30 text-xl font-semibold">
                {getInitials(displayName) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-tight">
                {displayName}
              </h1>

              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

          <Badge
            variant={isActive ? "secondary" : "destructive"}
            className="h-6 w-fit"
          >
            <span
              aria-hidden="true"
              className={cn(
                "size-1.5 rounded-full",
                isActive ? "bg-primary" : "bg-destructive",
              )}
            />
            {user.status}
          </Badge>
        </div>

        <Separator />

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays aria-hidden="true" className="size-4" />
          Member since {memberSince}
        </div>
      </CardContent>
    </Card>
  );
}