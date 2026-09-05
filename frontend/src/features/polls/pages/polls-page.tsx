"use client";

import { useRef, useState } from "react";

import { FlameIcon, SearchIcon, TagsIcon, VoteIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { TrendingPollCard } from "../components/explore/trending-poll-card";
import { Poll } from "../types/poll.types";
import { useTrendingPolls } from "../hooks/use-polls";
import { PollsShell } from "../components/polls-layout";

// const CATEGORIES = [
//   "Technology",
//   "Sports",
//   "Education",
//   "Health",
//   "Entertainment",
//   "Science",
//   "Business",
//   "Travel",
//   "Food",
//   "Gaming",
// ];

export function PollsPage() {
  const pollsQuery = useTrendingPolls();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  // const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const polls = pollsQuery.data ?? [];
  
  const trendingPolls = [...polls].sort((a, b) => {
    if (b.voteCount && a.voteCount && b.voteCount !== a.voteCount)
      return b.voteCount - a.voteCount;
    const createdAtDifference =
      new Date(b.createdAt ?? "").getTime() -
      new Date(a.createdAt ?? "").getTime();
    if (createdAtDifference !== 0) return createdAtDifference;
    return b.id.localeCompare(a.id);
  });

  const normalizedQuery = query.trim().toLowerCase();
  const visiblePolls = trendingPolls.filter((poll) => {
    const searchable = `${poll.title} ${poll.description ?? ""}`.toLowerCase();
    return searchable.includes(normalizedQuery);
  });

  return (
    <PollsShell onFocusSearch={() => searchInputRef.current?.focus()}>
      <main className="flex flex-1 flex-col gap-10 p-4 md:p-8">
        <section className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">
            Discover Polls
          </h1>
          <p className="text-sm text-muted-foreground">
            Explore trending polls and share your opinion.
          </p>
        </section>

        <div className="relative w-full max-w-xl">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search polls..."
            className="h-11 rounded-3xl bg-card pl-10 shadow-sm"
          />
        </div>

        <section
          aria-labelledby="trending-heading"
          className="flex flex-col gap-4"
        >
          <SectionHeading
            id="trending-heading"
            icon={<FlameIcon />}
            title="Trending"
            description="The published polls getting the most attention right now."
          />

          {pollsQuery.isPending ? (
            <TrendingSkeleton />
          ) : pollsQuery.isError ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                <h2 className="font-semibold">Could not load polls</h2>
                <p className="text-sm text-muted-foreground">
                  Something went wrong while fetching polls.
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => pollsQuery.refetch()}
                >
                  Try again
                </Button>
              </CardContent>
            </Card>
          ) : visiblePolls.length === 0 ? (
            <Empty className="py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <VoteIcon />
                </EmptyMedia>
                <EmptyTitle>
                  {normalizedQuery
                    ? "No matching polls"
                    : "No polls to discover yet"}
                </EmptyTitle>
                <EmptyDescription>
                  {normalizedQuery
                    ? "Try a different search term or clear the search."
                    : "Be the first to create a poll — published polls show up here."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visiblePolls.map((poll: Poll, index: number) => (
                <TrendingPollCard key={poll.id} poll={poll} rank={index + 1} />
              ))}
            </div>
          )}
        </section>

        <section
          aria-labelledby="categories-heading"
          className="flex flex-col gap-4"
        >
          <SectionHeading
            id="categories-heading"
            icon={<TagsIcon />}
            title="Categories"
            description="Browse polls by topic."
          />

          {/* <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  type="button"
                  size="sm"
                  variant={activeCategory === category ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() =>
                    setActiveCategory(
                      activeCategory === category ? null : category,
                    )
                  }
                >
                  {category}
                </Button>
              ))}
            </div> */}
        </section>
      </main>
    </PollsShell>
  );
}

function SectionHeading({
  id,
  icon,
  title,
  description,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <h2 id={id} className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function TrendingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="flex flex-col gap-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-10 w-12" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
