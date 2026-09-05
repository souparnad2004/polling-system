"use client"

import * as React from "react"

import { NavMain, type NavMainItem } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { useCurrentUser } from "@/src/features/auth/hooks/use-current-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  CompassIcon,
  LayoutDashboardIcon,
  PlusCircleIcon,
  VoteIcon,
} from "lucide-react";

const data = {
  menu: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Explore",
      url: "/polls",
      icon: <CompassIcon />,
    },
    {
      title: "My Polls",
      url: "/polls/mine",
      icon: <VoteIcon />,
    },
    {
      title: "Create Poll",
      url: "/polls/create",
      icon: <PlusCircleIcon />,
    },
  ] satisfies NavMainItem[],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: currentUser, isPending } = useCurrentUser()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain label="Menu" items={data.menu} />
      </SidebarContent>

      <SidebarFooter>
        {isPending || !currentUser ? (
          <SidebarMenuPlaceholder />
        ) : (
          <NavUser
            user={{
              name: currentUser.displayName,
              email: currentUser.email,
              avatar: "",
            }}
          />
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

function SidebarMenuPlaceholder() {
  return <div className="h-12 animate-pulse rounded-lg bg-sidebar-accent" />
}
