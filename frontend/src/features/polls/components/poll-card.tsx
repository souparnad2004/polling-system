import Link from "next/link";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Poll } from "../poll.api";

interface PollCardProps {
  poll: Poll;
}

export function PollCard({
  poll,
}: PollCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
    >
      <Link href={`/polls/${poll.id}`}>
        <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <Badge variant="secondary">
                {poll.status}
              </Badge>

              <span className="text-sm text-muted-foreground">
                {poll.options.length} options
              </span>
            </div>

            <CardTitle className="line-clamp-2">
              {poll.title}
            </CardTitle>
          </CardHeader>

          {poll.description && (
            <CardContent>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {poll.description}
              </p>
            </CardContent>
          )}
        </Card>
      </Link>
    </motion.div>
  );
}