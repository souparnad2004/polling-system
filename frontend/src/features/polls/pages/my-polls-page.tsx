"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useState } from "react";

import {
  PlusIcon,
  SearchIcon,
  VoteIcon,
} from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

import { ExploreHeader } from "../components/explore/explore-header";
import { MyPollRow } from "../components/my-poll-row";
import { usePolls } from "../hooks/use-polls";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
  { value: "closed", label: "Closed" },
] as const;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "most-votes", label: "Most votes" },
  { value: "oldest", label: "Oldest" },
] as const;

type StatusFilter = (typeof STATUS_OPTIONS)[number]["value"];
type SortFilter = (typeof SORT_OPTIONS)[number]["value"];

function isStatusFilter(value: string | null): value is StatusFilter {
  return typeof value === "string" && STATUS_OPTIONS.some((option) => option.value === value);
}

export function MyPollsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pollsQuery = usePolls();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortFilter>("newest");

  // The ?status= query param is the single source of truth so the sidebar
  // links (Drafts / All / Published / Closed) and the toolbar Select stay in
  // sync with each other and survive refreshes.
  const statusParam = searchParams.get("status");
  const status: StatusFilter = isStatusFilter(statusParam) ? statusParam : "all";

  const setStatus = (next: StatusFilter) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next === "all") {
      params.delete("status");
    } else {
      params.set("status", next);
    }

    const queryString = params.toString();
    router.replace(queryString ? `/polls/mine?${queryString}` : "/polls/mine", {
      scroll: false,
    });
  };

  const polls = pollsQuery.data ?? [];
  const normalizedQuery = query.trim().toLowerCase();

  const visiblePolls = polls
    .filter((poll) => {
      const matchesStatus = status === "all" || poll.status === status;
      const searchable = `${poll.title} ${poll.description ?? ""}`.toLowerCase();
      const matchesQuery = searchable.includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    })
    .sort((a, b) => {
      if (sort === "most-votes") {
        return (b.voteCount ?? 0) - (a.voteCount ?? 0);
      }
      if (sort === "oldest") {
        return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();
      }
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    });

  return (
    <SidebarProvider>
      <AppSidebar/>

      <SidebarInset>
        <ExploreHeader
          onFocusSearch={() => document.getElementById("mine-search")?.focus()}
        />

        <main className="flex flex-1 flex-col gap-6 p-4 md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl font-semibold tracking-tight">My Polls</h1>
              <p className="text-sm text-muted-foreground">
                Manage your polls across the full draft → published → closed lifecycle.

              </p>
            </div>

            <Link href="/polls/create">
              <Button>
                <PlusIcon />
                Create Poll
              </Button>
            </Link>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative w-full max-w-md">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="mine-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search polls..."
                className="rounded-3xl bg-card pl-10 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as StatusFilter)}
              >
                <SelectTrigger size="sm" className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={(value) => setSort(value as SortFilter)}>
                <SelectTrigger size="sm" className="w-36">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
{pollsQuery.isPending ? (
            <MyPollsSkeleton />
          ) : pollsQuery.isError ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                <h2 className="font-semibold">Could not load your polls</h2>
                <p className="text-sm text-muted-foreground">
                  Something went wrong while fetching your polls.</p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => pollsQuery.refetch()}
                >
                  Try again
                </Button>
              </CardContent>
            </Card>
          ) : polls.length === 0 ? (
            <Empty className="py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <VoteIcon />
                </EmptyMedia>
                <EmptyTitle>No polls yet</EmptyTitle>
                <EmptyDescription>
                  Be the first to create a poll and manage it here.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : visiblePolls.length === 0 ? (
            <Empty className="py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SearchIcon />
                </EmptyMedia>
                <EmptyTitle>No matching polls</EmptyTitle>
                <EmptyDescription>
                  Try a different search term or clear the filters.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-4">
              {visiblePolls.map((poll) => (
                <MyPollRow key={poll.id} poll={poll} />
              ))}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function MyPollsSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="flex flex-col gap-3 py-6">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full max-w-40" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}