"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import type { Poll, PollResults } from "../../api/poll.api";

interface PollDetailProps {
  poll: Poll;
  results: PollResults;
  onVote: (optionId: string) => Promise<void>;
}

export function PollDetail({ poll, results, onVote }: PollDetailProps) {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const [isVoting, setIsVoting] = useState(false);

  async function handleVote() {
    if (!selectedOption || isVoting) {
      return;
    }

    try {
      setIsVoting(true);

      await onVote(selectedOption);
    } finally {
      setIsVoting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Badge variant="secondary">{poll.status}</Badge>

            <span className="text-sm text-muted-foreground">
              {results.totalVotes} votes
            </span>
          </div>

          <div>
            <CardTitle className="text-2xl">{poll.title}</CardTitle>

            {poll.description && (
              <CardDescription className="mt-2">
                {poll.description}
              </CardDescription>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <RadioGroup
            value={selectedOption}
            onValueChange={setSelectedOption}
            className="space-y-3"
          >
            {poll.options.map((option) => (
              <Label
                key={option.id}
                htmlFor={option.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-muted"
              >
                <RadioGroupItem value={option.id} id={option.id} />

                <span>{option.text}</span>
              </Label>
            ))}
          </RadioGroup>

          {poll.status === "published" && (
            <Button
              className="w-full"
              disabled={!selectedOption || isVoting}
              onClick={handleVote}
            >
              {isVoting ? "Submitting..." : "Vote"}
            </Button>
          )}

          <div className="space-y-4">
            <div>
              <h2 className="font-semibold">Results</h2>

              <p className="text-sm text-muted-foreground">
                Current vote distribution
              </p>
            </div>

            <div className="space-y-5">
              {results.options.map((option) => {
                const percentage =
                  results.totalVotes === 0
                    ? 0
                    : (option.voteCount / results.totalVotes) * 100;

                return (
                  <div key={option.optionId} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{option.option}</span>

                      <span className="text-muted-foreground">
                        {option.voteCount} ({Math.round(percentage)}
                        %)
                      </span>
                    </div>

                    <Progress value={percentage} />
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
