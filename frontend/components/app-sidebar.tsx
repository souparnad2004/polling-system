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
import {
  BarChart3Icon,
  CompassIcon,
  LayoutDashboardIcon,
  PlusCircleIcon,
  UserIcon,
  VoteIcon,
} from "lucide-react";

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
  account: [
    {
      title: "Profile",
      url: "/profile",
      icon: <UserIcon />,
    },
  ] satisfies NavMainItem[],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain label="Menu" items={data.menu} />
        <NavMain label="Account" items={data.account} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
