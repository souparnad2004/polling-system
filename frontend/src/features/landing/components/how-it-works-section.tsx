import {
  BarChart3Icon,
  FileTextIcon,
  RadioIcon,
  SendIcon,
} from "lucide-react";

import { FadeIn } from "./fade-in";
import { SectionHeading } from "./section-heading";

const steps = [
  {
    icon: FileTextIcon,
    number: "1",
    title: "Create",
    description:
      "Write your question, add options, and configure voting settings like anonymous voting and vote changes.",
  },
  {
    icon: SendIcon,
    number: "2",
    title: "Publish",
    description:
      "Publish your poll and share the link anywhere. Drafts stay private until you are ready.",
  },
  {
    icon: RadioIcon,
    number: "3",
    title: "Collect Responses",
    description:
      "Participants vote through a simple, responsive interface — anonymously or with an account.",
  },
  {
    icon: BarChart3Icon,
    number: "4",
    title: "Analyze",
    description:
      "Watch results update live and understand response trends with per-poll analytics.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y bg-muted/35 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <SectionHeading
            align="center"
            eyebrow="How it works"
            title="From question to decision in four steps."
            description="Pollly keeps the mechanics quiet so you can focus on the conversation."
          />
        </FadeIn>

        <div className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line on desktop */}
          <div
            aria-hidden="true"
            className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-px bg-border lg:block"
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <FadeIn key={step.number} delay={index * 0.08}>
                <div className="relative flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
                  <div className="relative z-10 flex size-14 items-center justify-center rounded-2xl border bg-background text-primary shadow-sm">
                    <Icon className="size-6" />
                    <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {step.number}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}