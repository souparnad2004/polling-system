"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Poll, PollResult } from "@/src/features/polls/poll.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";


interface PollDetailProps{
    poll: Poll;
    results: PollResult;
    onVote: (optionId: string) => Promise<void>;
}

export function PollDetail({poll, results, onVote}: PollDetailProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const [isVoting, setIsVoting] = useState<boolean>(false);

    async function handleVote() {
        if(!selectedOption || isVoting) return;

        setIsVoting(true);
        try {
            await onVote(selectedOption);
        } finally {
            setIsVoting(false);
        }
    }

    return (
        <motion.div>
            <Card>
                <CardHeader>
                    <div>
                        <Badge variant={"secondary"}>{poll.status}</Badge>
                        <span>{results.totalVotes} votes</span>
                    </div>
                    <div>
                        <CardTitle>
                            {poll.title}
                        </CardTitle>
                        {poll.description && <CardDescription>{poll.description}</CardDescription>}
                    </div>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                        {poll.options.map((option) => (
                            <Label key={option.id} htmlFor={option.id}>
                                <RadioGroupItem value={option.id} id={option.id} disabled={isVoting} />
                                <span>{option.text}</span>
                            </Label>
                        ))}
                    </RadioGroup>
                    {poll.status === "published" && (<Button disabled={!selectedOption || isVoting } onClick={handleVote}>
                        {isVoting ? "Submitting..." : "Vote"}
                    </Button>)}
                    <div>
                        <div>
                            <h2>
                                Results
                            </h2>
                            <p>
                                Current Vote distribution
                            </p>
                        </div>
                        <div>
                            {results.options.map((option) => {
                                const percentage = results.totalVotes === 0 ? 0 : (option.voteCount / results.totalVotes) * 100;

                                return (
                                    <div key={option.optionId}>
                                        <span>{option.option}</span>
                                        <span>{option.voteCount} votes</span>
                                        <span>{percentage.toFixed(2)}%</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}