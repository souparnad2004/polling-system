import Link from "next/link";
import { BarChart3Icon, GitBranchIcon } from "lucide-react";


const columns = [
  {
    title: "Product",
    links: [
      { label: "Explore", href: "/polls" },
      { label: "Create Poll", href: "/polls/create" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Analytics", href: "#analytics" },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "Live Results", href: "#live-results" },
      { label: "Anonymous Voting", href: "#features" },
      { label: "Poll Analytics", href: "#analytics" },
      { label: "Discussions", href: "#features" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "GitHub", href: "https://github.com/souparnad2004/polling-system" },
      { label: "API", href: "/api" },
      { label: "Help", href: "#faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/35">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 font-heading font-semibold tracking-tight">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <BarChart3Icon className="size-5" />
              </span>
              <span className="text-base">Pollly</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              A full-stack polling platform for creating polls, collecting
              opinions, and watching results update in real time.
            </p>
            <a
              href="https://github.com/souparnad2004/polling-system"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <GitBranchIcon className="size-4" />
              GitHub
            </a>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold">{column.title}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Pollly. All rights reserved.</p>
          <p>Created for teams, classrooms, communities, and creators.</p>
        </div>
      </div>
    </footer>
  );
}