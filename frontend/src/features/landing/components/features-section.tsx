import {
  BarChart3Icon,
  BellIcon,
  CompassIcon,
  GitBranchIcon,
  RadioIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  ZapIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "./fade-in";
import { SectionHeading } from "./section-heading";

const features = [
  {
    icon: ZapIcon,
    title: "Create Polls Quickly",
    description:
      "Add a question and options, configure voting settings, save drafts, publish, and close polls — all from one place.",
  },
  {
    icon: RadioIcon,
    title: "Real-Time Results",
    description:
      "Poll results update live over a WebSocket connection the moment votes arrive — no page refresh required.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Anonymous or Authenticated Voting",
    description:
      "Creators decide whether participants vote anonymously or through authenticated accounts, with one vote per identity enforced.",
  },
  {
    icon: BarChart3Icon,
    title: "Powerful Analytics",
    description:
      "View votes, percentages, response trends, engagement, and poll activity to understand how your audience reacted.",
  },
  {
    icon: GitBranchIcon,
    title: "Poll Lifecycle Management",
    description:
      "Move polls through draft, published, and closed states with clear status badges at every step.",
  },
  {
    icon: SlidersHorizontalIcon,
    title: "Flexible Voting Controls",
    description:
      "Single-choice voting, change and remove votes, anonymous mode, and result visibility controls per poll.",
  },
  {
    icon: BellIcon,
    title: "Notifications",
    description:
      "Stay informed when polls receive activity, comments, milestones, or status updates.",
  },
  {
    icon: CompassIcon,
    title: "Search and Discovery",
    description:
      "Discover interesting public polls, search by keyword, filter results, and browse categories.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <SectionHeading
            eyebrow="Features"
            title="Everything a polling platform needs, without the clutter."
            description="From a quick team poll to community-wide discussions — Pollly covers the full lifecycle of collecting and understanding opinions."
          />
        </FadeIn>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <FadeIn key={feature.title} delay={Math.min(index * 0.04, 0.3)}>
                <Card className="group h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <CardHeader>
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="pt-3 text-base">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}