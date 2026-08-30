"use client";

import { format } from "date-fns";
import { AtSign, BadgeCheck, CalendarDays } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type { User } from "../types/user.types";

interface AccountDetailsProps {
  user: User;
}

interface AccountDetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}

function AccountDetailItem({
  icon,
  label,
  value,
  mono,
}: AccountDetailItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border bg-muted/50">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>

        <p
          className={cn(
            "truncate text-sm font-medium",
            mono && "font-mono text-xs",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export function AccountDetails({ user }: AccountDetailsProps) {
  const memberSince = format(new Date(user.createdAt), "MMMM d, yyyy");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Account details</CardTitle>
        <CardDescription>
          Read-only information about your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6">
          <AccountDetailItem
            icon={
              <AtSign
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
            }
            label="Email address"
            value={user.email}
          />

          <Separator />

          <AccountDetailItem
            icon={
              <CalendarDays
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
            }
            label="Member since"
            value={memberSince}
          />

          <Separator />

          <AccountDetailItem
            icon={
              <BadgeCheck
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
            }
            label="Account status"
            value={user.status}
          />

        </div>
      </CardContent>
    </Card>
  );
}