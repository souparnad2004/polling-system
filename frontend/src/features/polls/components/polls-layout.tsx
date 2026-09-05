"use client";

import { ReactNode } from "react";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";


interface PollsShellProps {
  onFocusSearch?: () => void;
  children: ReactNode;
}

// Shared layout shell for the polls feature pages (Explore / My Polls /
// Poll Analytics). Centralizes the sidebar + sticky header so each page only
// declares its own <main> content — one shell, three pages.
export function PollsShell({ onFocusSearch, children }: PollsShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader onFocusSearch={onFocusSearch} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}