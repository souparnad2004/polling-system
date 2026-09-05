import { Suspense } from "react";

import { MyPollsPage } from "@/src/features/polls/pages/my-polls-page";

// MyPollsPage reads ?status= via useSearchParams(), which requires a Suspense
// boundary for the prerendered shell.
export default function MyPollsRoute() {
  return (
    <Suspense fallback={null}>
      <MyPollsPage />
    </Suspense>
  );
}