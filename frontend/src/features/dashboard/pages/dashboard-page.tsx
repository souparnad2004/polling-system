"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useMyProfile } from "@/src/features/user/hooks/use-user";
import { AppHeader } from "@/components/app-header";

import { DashboardOverview } from "../components/dashboard-overview";
import { usePollOverview } from "../hooks/use-stats";
import { AppSidebar } from "@/components/app-sidebar";

export function DashboardPage() {
  const profileQuery = useMyProfile();
  const overviewQuery = usePollOverview();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />

        <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-6 md:pt-0">
          <DashboardOverview
            userName={profileQuery.data?.displayName}
            overview={overviewQuery.data}
            overviewIsPending={overviewQuery.isPending}
            overviewIsError={overviewQuery.isError}
            onRetry={() => overviewQuery.refetch()}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
