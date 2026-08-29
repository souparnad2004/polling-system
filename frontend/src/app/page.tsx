import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">
        Polling System
      </h1>

      <p className="mt-2 text-muted-foreground">
        Create polls, vote and see results in real life
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link href="/login">
          <Button variant="outline">
            Sign in
          </Button>
        </Link>

        <Link href="/register">
          <Button>
            Create Account
          </Button>
        </Link>
      </div>
    </main>
  );
}