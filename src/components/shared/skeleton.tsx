import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-lg", className)}
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        ...style,
      }}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "#0c1a27",
        border: "1px solid #152636",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

// ─── Interview card skeleton ───────────────────────────────────────
export function InterviewCardSkeleton() {
  return (
    <div
      className="flex items-center gap-4 py-4 px-5"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      <Skeleton className="h-3 w-3 rounded-full flex-shrink-0" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-7 w-16 rounded-lg" />
    </div>
  );
}

// ─── Resume card skeleton ──────────────────────────────────────────
export function ResumeCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "#0c1a27",
        border: "1px solid #152636",
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-7 w-16 rounded-full" />
      </div>
      <Skeleton className="h-2 w-full rounded-full mb-3" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}

// ─── Feedback report skeleton ──────────────────────────────────────
export function FeedbackSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "#0c1a27", border: "1px solid #152636" }}
      >
        <Skeleton className="h-6 w-48 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      {/* Score grid */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      {/* Content */}
      <div
        className="rounded-2xl p-6 space-y-3"
        style={{ background: "#0c1a27", border: "1px solid #152636" }}
      >
        <Skeleton className="h-5 w-36 mb-4" />
        {[...Array(4)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-4"
            style={{ width: `${75 + i * 5}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard hero skeleton ───────────────────────────────────────
export function HeroSkeleton() {
  return (
    <div
      className="rounded-2xl p-7"
      style={{
        background: "#0c1a27",
        border: "1px solid #152636",
        minHeight: 180,
      }}
    >
      <Skeleton className="h-7 w-72 mb-3" />
      <Skeleton className="h-4 w-full mb-1.5" />
      <Skeleton className="h-4 w-4/5 mb-6" />
      <div className="flex gap-3">
        <Skeleton className="h-11 w-44 rounded-xl" />
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Table skeleton ────────────────────────────────────────────────
export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "#0c1a27", border: "1px solid #152636" }}
    >
      {/* Header */}
      <div
        className="grid grid-cols-4 gap-4 px-5 py-4"
        style={{ borderBottom: "1px solid #152636" }}
      >
        {["ROLE TYPE", "DATE", "DURATION", "SCORE"].map((h) => (
          <Skeleton key={h} className="h-3 w-20" />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <InterviewCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Sidebar skeleton (for SSR placeholders) ──────────────────────
export function SidebarSkeleton() {
  return (
    <div
      className="hidden lg:flex flex-col w-[220px] shrink-0 p-4 space-y-3"
      style={{
        backgroundColor: "#07111c",
        borderRight: "1px solid rgba(0,229,160,0.06)",
      }}
    >
      <Skeleton className="h-10 w-10 rounded-xl" />
      <div className="space-y-1 mt-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
