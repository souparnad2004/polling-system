"use client"

import { BarChart3Icon, BellIcon, SearchIcon } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface ExploreHeaderProps {
  onFocusSearch: () => void
}

export function ExploreHeader({ onFocusSearch }: ExploreHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-xl">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-vertical:h-4 data-vertical:self-auto"
      />

      <div className="hidden items-center gap-2 sm:flex">
        <div className="flex size-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BarChart3Icon className="size-3.5" />
        </div>
        <span className="text-sm font-semibold tracking-tight">Pollly</span>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Search polls"
                onClick={onFocusSearch}
              />
            }
          >
            <SearchIcon />
          </TooltipTrigger>
          <TooltipContent>Search polls</TooltipContent>
        </Tooltip>

        <ThemeToggle />

        <div className="relative">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Notifications"
                />
              }
            >
              <BellIcon />
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
          <span className="pointer-events-none absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-background" />
        </div>
      </div>
    </header>
  )
}