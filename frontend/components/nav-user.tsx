"use client"

import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react"
import { useLogout } from "@/src/features/auth/hooks/use-logout"
import { toast } from "./ui/toast"
import { useRouter } from "next/navigation"


export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const logout = useLogout();
  const router = useRouter();

  const onLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.replace("/");
      },
      onError: (error) => {
        toast.add({
          title: "Error",
          description: error.message,
          type: "error",
        });
      },
    });

  }
  const { isMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar>
              {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
              <AvatarFallback>{user.email.at(0)?.toLocaleUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem
              render={<Link href="/profile" />}
              className="p-0 font-normal cursor-pointer"
            >
              <Avatar>
                {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                <AvatarFallback>{user.email.at(0)?.toLocaleUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} disabled={logout.isPending}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
