"use client"

import * as React from "react"

import { NavMain, type NavMainItem } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, VoteIcon, PlusCircleIcon, UserIcon, BarChart3Icon } from "lucide-react"

export type DashboardView = "dashboard" | "polls" | "create" | "profile"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeView?: DashboardView
  onViewChange?: (view: DashboardView) => void
}

const data = {
  user: {
    name: "My account",
    email: "you@example.com",
    avatar: "",
  },
  teams: [
    {
      name: "Polling System",
      logo: <BarChart3Icon />,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      view: "dashboard" as const,
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "My Polls",
      url: "/polls",
      view: "polls" as const,
      icon: <VoteIcon />,
    },
    {
      title: "Create poll",
      url: "/polls/create",
      view: "create" as const,
      icon: <PlusCircleIcon />,
    },
    {
      title: "Profile",
      url: "/profile",
      view: "profile" as const,
      icon: <UserIcon />,
    },
  ] satisfies NavMainItem[],
}

export function AppSidebar({
  activeView,
  onViewChange,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain}
          activeView={activeView}
          onViewChange={(view) => onViewChange?.(view as DashboardView)}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
