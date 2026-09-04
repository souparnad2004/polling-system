"use client"

import * as React from "react"

import { NavMain, type NavMainItem } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
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
  user: {
    name: "My account",
    email: "you@example.com",
    avatar: "",
  },
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain label="Menu" items={data.menu} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
