"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AppSidebar, type DashboardView } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";
import { usePolls } from "@/src/features/polls/hooks/use-polls";
import { useMyProfile } from "@/src/features/user/hooks/use-user";

import { DashboardCreatePollPanel } from "../components/dashboard-create-poll-panel";
import { DashboardOverview } from "../components/dashboard-overview";
import { DashboardPollsPanel } from "../components/dashboard-polls-panel";
import { DashboardProfilePanel } from "../components/dashboard-profile-panel";

const VIEW_TITLES: Record<DashboardView, string> = {
  dashboard: "Dashboard",
  polls: "My Polls",
  create: "Create Poll",
  profile: "Profile",
};

export function DashboardPage() {
  const [activeView, setActiveView] = useState<DashboardView>("dashboard");
  const router = useRouter();
  const pollsQuery = usePolls();
  const profileQuery = useMyProfile();
  const polls = pollsQuery.data ?? [];

  return (
    <SidebarProvider>
      <AppSidebar activeView={activeView} onViewChange={setActiveView} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Polling System
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{VIEW_TITLES[activeView]}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-6 md:pt-0">
          {activeView === "dashboard" && (
            <DashboardOverview
              polls={polls}
              isPending={pollsQuery.isPending}
            />
          )}

          {activeView === "polls" && (
            <DashboardPollsPanel
              polls={polls}
              isPending={pollsQuery.isPending}
              isError={pollsQuery.isError}
              onRetry={() => pollsQuery.refetch()}
            />
          )}

          {activeView === "create" && (
            <DashboardCreatePollPanel
              onCreated={(pollId) => {
                toast.add({
                  title: "Success",
                  description: "Poll created successfully",
                  type: "success",
                });

                router.push(`/poll/${pollId}`);
              }}
            />
          )}

          {activeView === "profile" && (
            <DashboardProfilePanel
              isPending={profileQuery.isPending}
              isError={profileQuery.isError}
              onRetry={() => profileQuery.refetch()}
              user={profileQuery.data ?? null}
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
