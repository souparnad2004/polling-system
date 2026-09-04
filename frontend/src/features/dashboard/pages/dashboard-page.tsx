"use client";

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
import { useMyProfile } from "@/src/features/user/hooks/use-user";

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
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <ThemeToggle />
          </div>
        </header>

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
