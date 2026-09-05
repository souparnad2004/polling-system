"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BarChart3Icon, MenuIcon } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCurrentUser } from "@/src/features/auth/hooks/use-current-user";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Live Results", href: "#live-results" },
  { label: "Analytics", href: "#analytics" },
  { label: "Security", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const user = useCurrentUser();
  const signedIn = Boolean(user.data);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b bg-background/85 shadow-sm backdrop-blur-xl supports-backdrop-filter:bg-background/70"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-heading font-semibold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <BarChart3Icon className="size-5" />
          </span>
          <span className="text-base">Pollly</span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          <div className="hidden items-center gap-2 sm:flex">
            {signedIn ? (
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/dashboard" />}
                nativeButton={false}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign In
                </Link>
                <Button
                  size="sm"
                  render={<Link href="/register" />}
                  nativeButton={false}
                >
                  Create Account
                </Button>
              </>
            )}
          </div>

          <MobileNav signedIn={signedIn} />
        </div>
      </div>
    </header>
  );
}

function MobileNav({ signedIn }: { signedIn: boolean }) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation menu"
          />
        }
      >
        <MenuIcon />
      </SheetTrigger>

      <SheetContent className="gap-0 p-0">
        <div className="flex h-16 items-center border-b px-6">
          <SheetTitle className="text-sm text-muted-foreground">
            Menu
          </SheetTitle>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="flex flex-col gap-1 px-4 py-4"
        >
          {navLinks.map((link) => (
            <SheetClose key={link.href} render={<a href={link.href} />}>
              <span className="block rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                {link.label}
              </span>
            </SheetClose>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t p-4">
          {signedIn ? (
            <Button
              render={<Link href="/dashboard" />}
              nativeButton={false}
              className="w-full"
            >
              Open Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                render={<Link href="/login" />}
                nativeButton={false}
                className="w-full"
              >
                Sign In
              </Button>
              <Button
                render={<Link href="/register" />}
                nativeButton={false}
                className="w-full"
              >
                Create Account
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}