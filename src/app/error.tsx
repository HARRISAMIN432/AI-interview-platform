"use client";

import { RootErrorBoundary } from "@/components/shared/error-boundary";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ margin: 0, backgroundColor: "#060f18" }}>
        <RootErrorBoundary error={error} reset={reset} />
      </body>
    </html>
  );
}
