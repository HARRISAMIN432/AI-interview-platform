"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to your monitoring service (Sentry, etc.)
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div
      className="min-h-[60vh] flex items-center justify-center p-8"
      style={{ backgroundColor: "#060f18" }}
    >
      <div
        className="max-w-md w-full rounded-2xl p-8 text-center"
        style={{
          background: "#0c1a27",
          border: "1px solid rgba(239,68,68,0.2)",
          boxShadow: "0 0 40px rgba(239,68,68,0.06)",
        }}
      >
        {/* Icon */}
        <div
          className="mx-auto mb-5 flex items-center justify-center rounded-2xl"
          style={{
            width: 56,
            height: 56,
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <AlertTriangle size={24} color="#f87171" />
        </div>

        {/* Heading */}
        <h2
          className="text-xl font-bold mb-2"
          style={{
            fontFamily: "var(--font-syne)",
            color: "#dff0ea",
          }}
        >
          Something went wrong
        </h2>

        {/* Message */}
        <p
          className="text-sm mb-1"
          style={{ color: "#4a6a7a", fontFamily: "var(--font-dm-sans)" }}
        >
          {error.message ||
            "An unexpected error occurred while loading this page."}
        </p>

        {error.digest && (
          <p className="text-xs mb-6" style={{ color: "#2a4050" }}>
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all active:scale-[0.97]"
            style={{
              background: "#00c98a",
              color: "#050d14",
              fontFamily: "var(--font-syne)",
              boxShadow: "0 4px 16px rgba(0,201,138,0.25)",
            }}
          >
            <RefreshCw size={14} strokeWidth={2.5} />
            Try again
          </button>

          <Link
            href="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all hover:bg-[rgba(255,255,255,0.04)]"
            style={{
              border: "1px solid #1a3048",
              color: "#5a8090",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Root-level error boundary ─────────────────────────────────────
export function RootErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Root Error]", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: "#060f18" }}
    >
      <div className="max-w-md w-full text-center">
        {/* Emerald glow backdrop */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(0,229,160,0.03) 0%, transparent 60%)",
          }}
        />

        <div
          className="relative mx-auto mb-6 flex items-center justify-center rounded-2xl"
          style={{
            width: 64,
            height: 64,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <AlertTriangle size={28} color="#f87171" />
        </div>

        <h1
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: "var(--font-syne)", color: "#dff0ea" }}
        >
          Application Error
        </h1>
        <p
          className="text-sm mb-8"
          style={{
            color: "#4a6a7a",
            fontFamily: "var(--font-dm-sans)",
            lineHeight: 1.65,
          }}
        >
          {error.message ||
            "A critical error occurred. Please refresh the page or contact support if this persists."}
        </p>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all active:scale-[0.97]"
          style={{
            background: "#00c98a",
            color: "#050d14",
            fontFamily: "var(--font-syne)",
            boxShadow: "0 4px 20px rgba(0,201,138,0.3)",
          }}
        >
          <RefreshCw size={14} strokeWidth={2.5} />
          Reload application
        </button>
      </div>
    </div>
  );
}
