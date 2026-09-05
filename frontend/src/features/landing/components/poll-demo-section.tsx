"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CheckIcon, RadioIcon, RotateCcwIcon, VoteIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { FadeIn } from "./fade-in";
import { SectionHeading } from "./section-heading";

const totalResponses = 2_481;

const options = [
  { label: "Node.js", votes: 1_042, pct: 42 },
  { label: "Go", votes: 595, pct: 24 },
  { label: "Python", votes: 496, pct: 20 },
  { label: "Java", votes: 348, pct: 14 },
];

function optionLetter(index: number) {
  return String.fromCharCode(65 + (index % 26));
}

export function PollDemoSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const selectedOption = options.find((o) => o.label === selected) ?? null;

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <SectionHeading
            eyebrow="Try it"
            title="This is what voting looks like."
            description="Pick an option, submit your vote, and watch the results fill in. This is the same feeling participants get on any published poll."
          />
        </FadeIn>

        <FadeIn delay={0.08}>
          <Card className="mx-auto mt-12 max-w-2xl">
            <CardHeader className="border-b pb-5">
              <div className="flex items-center justify-between gap-3">
                <Badge className="gap-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                  <RadioIcon className="size-3" />
                  Live
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {totalResponses.toLocaleString()} responses
                </span>
              </div>
              <h3 className="pt-3 font-heading text-xl leading-snug font-semibold tracking-tight">
                Which technology would you choose for your next backend project?
              </h3>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              {submitted ? (
                <ResultsView
                  selectedOption={selectedOption}
                  onReset={() => {
                    setSubmitted(false);
                    setSelected(null);
                  }}
                />
              ) : (
                <VoteView
                  selected={selected}
                  onSelect={setSelected}
                  onSubmit={() => setSubmitted(true)}
                />
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </section>
  );
}

interface VoteViewProps {
  selected: string | null;
  onSelect: (value: string) => void;
  onSubmit: () => void;
}

function VoteView({ selected, onSelect, onSubmit }: VoteViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <RadioGroup
        value={selected ?? undefined}
        onValueChange={(value) => onSelect(String(value))}
        aria-label="Poll options"
      >
        {options.map((option, index) => (
          <div
            key={option.label}
            onClick={() => onSelect(option.label)}
            className={cn(
              "flex cursor-pointer items-center gap-3.5 rounded-2xl border bg-card p-4 transition-colors hover:border-foreground/25 hover:bg-muted/40 sm:gap-4",
              selected === option.label
                ? "border-primary/70 bg-primary/[0.04]"
                : "border-border",
            )}
          >
            <RadioGroupItem value={option.label} className="shrink-0" />
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold text-muted-foreground">
              {optionLetter(index)}
            </span>
            <span className="text-sm font-medium">{option.label}</span>
          </div>
        ))}
      </RadioGroup>

      <Button
        size="lg"
        className="mt-1 w-full"
        disabled={!selected}
        onClick={onSubmit}
      >
        <VoteIcon />
        Submit Vote
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Voting is anonymous and takes one click — no account required.
      </p>
    </div>
  );
}

interface ResultsViewProps {
  selectedOption: { label: string } | null;
  onReset: () => void;
}

function ResultsView({ selectedOption, onReset }: ResultsViewProps) {
  return (
    <div className="flex flex-col gap-4">
      {selectedOption ? (
        <div className="flex items-center gap-3 rounded-2xl border border-primary/25 bg-primary/[0.04] p-4">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CheckIcon className="size-3.5" strokeWidth={3} />
          </span>
          <p className="text-sm">
            Your vote for{" "}
            <span className="font-semibold">{selectedOption.label}</span> has
            been recorded.
          </p>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={onReset}>
            <RotateCcwIcon />
            Vote again
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-3" aria-label="Live results">
        {options.map((option, index) => (
          <div
            key={option.label}
            className={cn(
              "relative overflow-hidden rounded-2xl border p-4 transition-colors",
              selectedOption?.label === option.label
                ? "border-primary/60"
                : "border-border",
            )}
          >
            <motion.div
              aria-hidden="true"
              initial={{ width: 0 }}
              animate={{ width: `${option.pct}%` }}
              transition={{
                delay: 0.15 + index * 0.1,
                duration: 0.6,
                ease: "easeOut",
              }}
              className={cn(
                "absolute inset-y-0 left-0",
                selectedOption?.label === option.label
                  ? "bg-primary/10"
                  : "bg-primary/[0.06]",
              )}
            />
            <div className="relative z-10 flex items-center gap-3">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  selectedOption?.label === option.label
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-muted text-muted-foreground",
                )}
              >
                {optionLetter(index)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm font-medium">
                    {option.label}
                  </span>
                  <span className="font-mono text-sm font-semibold tabular-nums">
                    {option.pct}%
                  </span>
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {option.votes.toLocaleString()} votes
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t pt-4 text-xs text-muted-foreground">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-50" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        Results are updating live. New votes appear instantly.
      </div>
    </div>
  );
}