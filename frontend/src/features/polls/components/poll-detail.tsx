"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CheckIcon,
  CircleCheckIcon,
  HourglassIcon,
  LoaderCircleIcon,
  LockIcon,
  TrophyIcon,
  UsersIcon,
  VoteIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { Poll, PollOption, PollResults } from "../types/poll.types";

interface PollDetailProps {
  poll: Poll;
  results: PollResults;
  onVote: (optionId: string) => Promise<void>;
}

const STATUS_LABEL: Record<Poll["status"], string> = {
  published: "Live",
  draft: "Draft",
  closed: "Closed",
};

const NOTICE_CLASSES =
  "flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/50 p-4";

function optionLetter(index: number): string {
  return String.fromCharCode(65 + (index % 26));
}

function PollStatusBadge({ status }: { status: Poll["status"] }) {
  return (
    <Badge
      variant={status === "published" ? "default" : "secondary"}
      className="gap-1.5 capitalize"
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full bg-current",
          status === "published" && "animate-pulse",
        )}
      />
      {STATUS_LABEL[status]}
    </Badge>
  );
}

interface VoteOptionProps {
  option: PollOption;
  letter: string;
  percentage: number;
  voteCount: number;
  isLeading: boolean;
  isYourVote: boolean;
  numLeaders: number;
  selected: boolean;
  disabled: boolean;
  delay: number;
  onSelect: () => void;
}

function VoteOption({
  option,
  letter,
  percentage,
  voteCount,
  isLeading,
  isYourVote,
  numLeaders,
  selected,
  disabled,
  delay,
  onSelect,
}: VoteOptionProps) {
  const roundedPercentage = Math.round(percentage);
  const animatableWidth =
    percentage > 0 ? `${Math.max(Math.min(percentage, 100), 2)}%` : "0%";

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 380, damping: 28 }}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      className={cn(
        "group relative flex w-full items-center gap-3.5 overflow-hidden rounded-2xl border bg-card p-4 text-left shadow-xs outline-none transition-[border-color,background-color,box-shadow] duration-200 sm:gap-4 sm:p-5",
        "focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/25",
        selected
          ? "border-primary/70 shadow-sm"
          : "border-border hover:border-foreground/25 hover:shadow-sm",
        disabled && "cursor-not-allowed",
      )}
    >
      {/* Full-height background range fill */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ width: animatableWidth }}
        transition={{ type: "spring", stiffness: 110, damping: 24 }}
        className={cn(
          "absolute inset-y-0 left-0 z-0",
          selected
            ? "bg-primary/[0.12]"
            : "bg-primary/[0.06] group-hover:bg-primary/[0.09]",
        )}
      />

      {/* Range edge marker line at the tip of the fill */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ left: animatableWidth }}
        transition={{ type: "spring", stiffness: 110, damping: 24 }}
        className={cn(
          "absolute inset-y-0 z-0 w-px",
          selected ? "bg-primary/60" : "bg-primary/25",
        )}
      />

      <span
        aria-hidden
        className={cn(
          "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums transition-colors duration-200 sm:size-10",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-muted text-muted-foreground group-hover:border-foreground/25",
        )}
      >
        {letter}
      </span>

      <span className="relative z-10 min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={cn(
              "font-medium leading-snug text-pretty",
              selected && "font-semibold",
            )}
          >
            {option.text}
          </span>

          {isLeading && (
            <Badge variant="secondary" className="gap-1">
              <TrophyIcon className="size-2.5" />
              {numLeaders > 1 ? "Tied" : "Leading"}
            </Badge>
          )}

          {isYourVote && (
            <Badge
              variant="outline"
              className="gap-1 border-primary/30 text-primary"
            >
              <CheckIcon className="size-2.5" />
              Your vote
            </Badge>
          )}
        </span>

        <span className="mt-1 block text-sm text-muted-foreground tabular-nums">
          <span
            className={cn(
              "font-semibold",
              selected ? "text-primary" : "text-foreground",
            )}
          >
            {roundedPercentage}%
          </span>
          <span aria-hidden className="mx-1 text-muted-foreground/60">
            ·
          </span>
          {voteCount} vote{voteCount === 1 ? "" : "s"}
        </span>
      </span>

      <span
        aria-hidden
        className={cn(
          "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-input bg-background group-hover:border-foreground/30",
        )}
      >
        <AnimatePresence>
          {selected && (
            <motion.span
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 90, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 24 }}
              className="flex"
            >
              <CheckIcon className="size-3.5" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}

export function PollDetail({ poll, results, onVote }: PollDetailProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const storageKey = `poll:${poll.id}:vote`;

  const [votedState, setVotedState] = useState<{
    voted: boolean;
    optionId: string | null;
  }>(() => {
    if (typeof window === "undefined") {
      return { voted: false, optionId: null };
    }

    try {
      const raw = sessionStorage.getItem(storageKey);

      if (raw) {
        const parsed = JSON.parse(raw) as { optionId?: string };

        if (
          parsed.optionId &&
          poll.options.some((option) => option.id === parsed.optionId)
        ) {
          return { voted: true, optionId: parsed.optionId };
        }
      }
    } catch {
      // Ignore malformed or unavailable storage.
    }

    return { voted: false, optionId: null };
  });

  const hasVoted = votedState.voted;
  const canVote = poll.status === "published" && !hasVoted;

  const selectedOption = useMemo(
    () => poll.options.find((option) => option.id === selectedOptionId) ?? null,
    [poll.options, selectedOptionId],
  );

  const votedOption = useMemo(
    () =>
      poll.options.find((option) => option.id === votedState.optionId) ?? null,
    [poll.options, votedState.optionId],
  );

  const resultByOptionId = useMemo(() => {
    const map = new Map<string, { voteCount: number; percentage: number }>();

    for (const option of poll.options) {
      const result = results.options.find(
        (optionResult) => optionResult.optionId === option.id,
      );

      const voteCount = result?.voteCount ?? 0;
      const percentage =
        results.totalVotes === 0 ? 0 : (voteCount / results.totalVotes) * 100;

      map.set(option.id, { voteCount, percentage });
    }

    return map;
  }, [poll.options, results]);

  const maxVoteCount = useMemo(
    () =>
      results.options.reduce(
        (max, option) => Math.max(max, option.voteCount),
        0,
      ),
    [results.options],
  );

  const leaderCount = useMemo(
    () =>
      results.options.filter(
        (option) => option.voteCount === maxVoteCount && maxVoteCount > 0,
      ).length,
    [results.options, maxVoteCount],
  );

  function handleSelect(optionId: string) {
    if (!canVote) {
      return;
    }

    setSelectedOptionId(optionId);
  }

  function handleOptionsKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!canVote || poll.options.length === 0) {
      return;
    }

    const currentIndex =
      selectedOptionId === null
        ? -1
        : poll.options.findIndex((option) => option.id === selectedOptionId);

    let nextIndex = -1;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = Math.min(currentIndex + 1, poll.options.length - 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = Math.max(currentIndex - 1, 0);
    }

    if (nextIndex >= 0 && nextIndex !== currentIndex) {
      event.preventDefault();
      setSelectedOptionId(poll.options[nextIndex].id);
    }
  }

  async function handleVote() {
    if (!selectedOption || isVoting) {
      return;
    }

    setIsVoting(true);

    try {
      await onVote(selectedOption.id);

      setVotedState({ voted: true, optionId: selectedOption.id });

      try {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify({ optionId: selectedOption.id }),
        );
      } catch {
        // Storage can be unavailable (e.g. private mode); state still updates.
      }
    } finally {
      setIsVoting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="relative mx-auto max-w-2xl overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl"
        />

        <CardHeader className="relative gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <PollStatusBadge status={poll.status} />

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground tabular-nums">
              <UsersIcon className="size-4" />
              {results.totalVotes} vote{results.totalVotes === 1 ? "" : "s"}
            </div>
          </div>

          <div className="space-y-2">
            <CardTitle className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {poll.title}
            </CardTitle>

            {poll.description && (
              <CardDescription className="text-base text-pretty sm:text-lg">
                {poll.description}
              </CardDescription>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative space-y-9">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <VoteIcon className="size-4" />
              </span>

              <div>
                <h2 className="font-heading text-base font-medium">
                  Cast your vote
                </h2>
                <p className="text-sm text-muted-foreground">
                  {canVote
                    ? "Select one answer, then submit."
                    : "Voting is not open for this poll."}
                </p>
              </div>
            </div>

            <div
              role="radiogroup"
              aria-label="Poll options"
              onKeyDown={handleOptionsKeyDown}
              className="space-y-3"
            >
              {poll.options.map((option, index) => {
                const result = resultByOptionId.get(option.id) ?? {
                  voteCount: 0,
                  percentage: 0,
                };

                const isLeading =
                  maxVoteCount > 0 && result.voteCount === maxVoteCount;

                const isYourVote =
                  hasVoted && votedState.optionId === option.id;

                return (
                  <VoteOption
                    key={option.id}
                    option={option}
                    letter={optionLetter(index)}
                    percentage={result.percentage}
                    voteCount={result.voteCount}
                    isLeading={isLeading}
                    isYourVote={isYourVote}
                    numLeaders={leaderCount}
                    selected={
                      canVote
                        ? selectedOptionId === option.id
                        : hasVoted && votedState.optionId === option.id
                    }
                    disabled={!canVote}
                    delay={0.05 + index * 0.04}
                    onSelect={() => handleSelect(option.id)}
                  />
                );
              })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {canVote && (
                <motion.div
                  key="ballot-actions"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-3"
                >
                  {selectedOption ? (
                    <div className="flex flex-col gap-3 rounded-2xl border border-primary/25 bg-primary/[0.04] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <CircleCheckIcon className="size-5 shrink-0 text-primary" />
                        <p className="min-w-0 truncate text-sm">
                          <span className="text-muted-foreground">
                            Selected:{" "}
                          </span>
                          <span className="font-semibold">
                            {selectedOption.text}
                          </span>
                        </p>
                      </div>

                      <Button
                        size="lg"
                        className="shrink-0"
                        disabled={isVoting}
                        onClick={handleVote}
                      >
                        {isVoting ? (
                          <LoaderCircleIcon className="animate-spin" />
                        ) : (
                          <VoteIcon />
                        )}
                        {isVoting ? "Submitting…" : "Cast vote"}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-muted-foreground">
                        Choose an option above to continue.
                      </p>

                      <Button size="lg" className="shrink-0" disabled>
                        <VoteIcon />
                        Cast vote
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {hasVoted && poll.status === "published" && votedOption && (
                <motion.div
                  key="vote-recorded"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/[0.04] p-4"
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckIcon className="size-3.5" strokeWidth={3} />
                  </span>

                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">
                      Your vote has been recorded
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You chose{" "}
                      <span className="font-semibold text-foreground">
                        {votedOption.text}
                      </span>
                      . Live results update below in real time.
                    </p>
                  </div>
                </motion.div>
              )}

              {poll.status === "closed" && (
                <motion.div
                  key="poll-closed"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className={NOTICE_CLASSES}
                >
                  <LockIcon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">Poll closed</p>
                    <p className="text-sm text-muted-foreground">
                      Voting is no longer accepted. The results below are final.
                    </p>
                  </div>
                </motion.div>
              )}

              {poll.status === "draft" && (
                <motion.div
                  key="poll-draft"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className={NOTICE_CLASSES}
                >
                  <HourglassIcon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">
                      Voting has not started
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This poll is still a draft. Voting opens once its
                      published.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </CardContent>
      </Card>
    </motion.div>
  );
}
