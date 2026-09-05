import Link from "next/link"

import { motion } from "motion/react"
import { ArrowUpRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { Poll } from "../../types/poll.types"

const STATUS_VARIANT = {
  published: "default",
  draft: "secondary",
  closed: "outline",
} as const

interface TrendingPollCardProps {
  poll: Poll
  rank: number
}

export function TrendingPollCard({ poll, rank }: TrendingPollCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.15 }}
      className="h-full"
    >
      <Link href={`/polls/${poll.id}`} className="block h-full">
        <Card className="group h-full cursor-pointer transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                #{String(rank).padStart(2, "0")}
              </span>
              <Badge variant={STATUS_VARIANT[poll.status]}>{poll.status}</Badge>
            </div>

            <CardTitle className="line-clamp-2 text-base">
              {poll.title}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              By {poll.authorName || "Anonymous"}
            </p>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="flex items-baseline gap-1.5">
              <p className="text-3xl font-semibold tracking-tight">
                {poll.options.length}
              </p>
              <p className="text-sm text-muted-foreground">
                {poll.options.length === 1 ? "option" : "options"}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {poll.options.slice(0, 3).map((option) => (
                <span
                  key={option.id}
                  className="line-clamp-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {option.text}
                </span>
              ))}
              {poll.options.length > 3 && (
                <span className="rounded-full bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground">
                  +{poll.options.length - 3}
                </span>
              )}
            </div>
          </CardContent>

          <CardFooter className="mt-auto">
            <span className="text-xs text-muted-foreground">
              {poll.status === "published"
                ? "Open for voting"
                : poll.status === "closed"
                  ? "Voting closed"
                  : "Not published yet"}
            </span>
            <ArrowUpRightIcon className="ml-auto size-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}