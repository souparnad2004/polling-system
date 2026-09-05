import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FadeIn } from "./fade-in";

export function CTASection() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-[2rem] border bg-card px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Turn questions into conversations.
            </h2>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Create your first poll, share it with your audience, and watch
              responses arrive in real time.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                render={<Link href="/polls/create" />}
                nativeButton={false}
              >
                Create a Poll
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
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}