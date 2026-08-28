import { motion } from "motion/react";
import { Poll } from "../poll.api";
import { Badge, Link } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PollCardProps {
  poll: Poll;
}

export function PollCard({ poll }: PollCardProps) {
  return (
    <motion.div>
      <Link href={`/polls/${poll.id}`}>
        <Card>
          <CardHeader>
            <div>
              <Badge>{poll.status}</Badge>
              <span>{poll.options.length} options</span>
            </div>
            <CardTitle>{poll.title}</CardTitle>
          </CardHeader>
          {poll.description && <CardContent>{poll.description}</CardContent>}
        </Card>
      </Link>
    </motion.div>
  );
}
