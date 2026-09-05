"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRightIcon,
  CheckIcon,
  CreditCardIcon,
  RadioIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "./dashboard-preview";

const trustIndicators = [
  "Free to get started",
  "No credit card required",
  "Real-time results",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pt-32 pb-16 sm:px-6 sm:pt-40 sm:pb-20 lg:px-8">
      {/* Subtle background tint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_-10%,color-mix(in_oklch,var(--secondary)_45%,transparent),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Badge
              variant="outline"
              className="gap-2 rounded-full py-1 pr-3 pl-1.5"
            >
              <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                <RadioIcon className="size-3" />
                Live
              </span>
              Results stream over WebSockets — no refresh needed
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55, ease: "easeOut" }}
            className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Create polls. Collect opinions. See results live.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.55, ease: "easeOut" }}
            className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
          >
            Pollly is a full-stack polling platform. Create a poll in seconds,
            share it anywhere, and let people vote anonymously or with an
            account — while results update in real time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.55, ease: "easeOut" }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              render={<Link href="/polls/create" />}
              nativeButton={false}
            >
              Create Your First Poll
              <ArrowRightIcon />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/polls" />}
              nativeButton={false}
            >
              Explore Polls
            </Button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
          >
            {trustIndicators.map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <CheckIcon className="size-4 text-primary" />
                {item}
              </li>
            ))}
            <li className="inline-flex items-center gap-2">
              <CreditCardIcon className="size-4 text-primary" />
              Takes about a minute
            </li>
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
          className="relative mx-auto mt-16 max-w-5xl sm:mt-20"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}