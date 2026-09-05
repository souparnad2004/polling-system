import {
  DatabaseIcon,
  KeyRoundIcon,
  ServerIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "./fade-in";
import { SectionHeading } from "./section-heading";

const items = [
  {
    icon: KeyRoundIcon,
    title: "Secure authentication",
    description:
      "Password hashing, signed httpOnly session cookies, and rate-limited login attempts.",
  },
  {
    icon: ServerIcon,
    title: "Server-side validation",
    description:
      "Every request is validated and every vote rule is enforced on the server.",
  },
  {
    icon: DatabaseIcon,
    title: "Database constraints",
    description:
      "Unique constraints enforce one vote per poll per identity — no double counting.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Protected management actions",
    description:
      "Publishing, editing, closing, and deleting are guarded by ownership checks.",
  },
];

export function SecuritySection() {
  return (
    <section
      id="security"
      className="scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <SectionHeading
            align="center"
            eyebrow="Security"
            title="Designed with secure authentication and reliable data handling."
            description="Pollly is built with security and consistency in mind — from validation at the edge to constraints in the database."
          />
        </FadeIn>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={Math.min(index * 0.04, 0.3)}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-4.5" />
                    </div>
                    <CardTitle className="pt-2.5 text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.15}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-6 text-muted-foreground">
            These are engineering choices implemented server-side in the
            codebase — not third-party certifications. Authentication,
            validation, constraints, and ownership checks are enforced on every
            protected action.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}