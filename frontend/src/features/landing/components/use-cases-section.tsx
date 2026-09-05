import {
  Building2Icon,
  Code2Icon,
  GraduationCapIcon,
  MicIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "./fade-in";
import { SectionHeading } from "./section-heading";

const useCases = [
  {
    icon: GraduationCapIcon,
    title: "Students",
    description:
      "Classroom voting, quick feedback, and university discussions.",
  },
  {
    icon: UsersIcon,
    title: "Communities",
    description:
      "Ask members questions and understand community opinion.",
  },
  {
    icon: Building2Icon,
    title: "Teams",
    description:
      "Collect fast internal feedback and make decisions together.",
  },
  {
    icon: SparklesIcon,
    title: "Creators",
    description:
      "Ask audiences what content they want to see next.",
  },
  {
    icon: Code2Icon,
    title: "Developers",
    description:
      "Run community polls, feature voting, and technical surveys.",
  },
  {
    icon: MicIcon,
    title: "Events",
    description:
      "Collect opinions before, during, and after events.",
  },
];

export function UseCasesSection() {
  return (
    <section className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <SectionHeading
            align="center"
            eyebrow="Use cases"
            title="One platform, many conversations."
            description="Pollly is built for anyone who needs a clear signal from a group of people."
          />
        </FadeIn>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <FadeIn key={useCase.title} delay={Math.min(index * 0.04, 0.3)}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader className="flex-row items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-4.5" />
                    </span>
                    <CardTitle className="text-base">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-muted-foreground">
                    {useCase.description}
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