import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  icon?: LucideIcon;
}

export function EmptyState({
  heading,
  body,
  ctaLabel,
  ctaHref,
  icon: Icon = Inbox,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
      <div
        className="flex items-center justify-center rounded-2xl mb-4"
        style={{
          width: 56,
          height: 56,
          background: "rgba(0,229,160,0.06)",
          border: "1px solid rgba(0,229,160,0.12)",
        }}
      >
        <Icon size={22} color="#00e5a0" strokeWidth={1.5} />
      </div>
      <p
        className="text-sm font-semibold mb-1"
        style={{ color: "#7a9aaa", fontFamily: "var(--font-syne)" }}
      >
        {heading}
      </p>
      <p
        className="text-xs max-w-xs mb-5"
        style={{ color: "#3d6070", fontFamily: "var(--font-dm-sans)", lineHeight: 1.6 }}
      >
        {body}
      </p>
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-bold"
          style={{
            background: "#00c98a",
            color: "#050d14",
            fontFamily: "var(--font-syne)",
          }}
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
