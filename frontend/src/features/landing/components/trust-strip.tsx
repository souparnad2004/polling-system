import {
  Building2Icon,
  Code2Icon,
  GraduationCapIcon,
  LayersIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";

const audiences = [
  { label: "Communities", icon: UsersIcon },
  { label: "Students", icon: GraduationCapIcon },
  { label: "Teams", icon: LayersIcon },
  { label: "Creators", icon: SparklesIcon },
  { label: "Organizations", icon: Building2Icon },
  { label: "Developers", icon: Code2Icon },
];

export function TrustStrip() {
  return (
    <section aria-label="Who Pollly is for" className="border-y bg-muted/35">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-7 sm:px-6 lg:flex-row lg:px-8">
        <p className="text-sm font-medium text-foreground">
          Built for communities, teams, classrooms, creators, and developers.
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {audiences.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Icon className="size-4" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}