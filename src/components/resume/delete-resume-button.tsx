"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteResumeButtonProps {
  resumeId: string;
  fileName: string;
}

export function DeleteResumeButton({
  resumeId,
  fileName,
}: DeleteResumeButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/resume/${resumeId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Delete failed.");
          setConfirming(false);
          return;
        }

        // Navigate back to resume list after delete
        router.push("/resume");
        router.refresh();
      } catch {
        setError("Network error. Please try again.");
        setConfirming(false);
      }
    });
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <p
          className="text-xs shrink-0"
          style={{ color: "#f87171", fontFamily: "var(--font-dm-sans)" }}
        >
          Delete forever?
        </p>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
          style={{
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.25)",
            color: "#f87171",
            fontFamily: "var(--font-syne)",
          }}
        >
          {isPending ? (
            <Loader2 size={11} className="animate-spin" />
          ) : (
            <Trash2 size={11} strokeWidth={2} />
          )}
          {isPending ? "Deleting…" : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-lg px-3 py-1.5 text-xs transition-all hover:bg-[rgba(255,255,255,0.04)]"
          style={{ color: "#4a6a7a", fontFamily: "var(--font-dm-sans)" }}
        >
          Cancel
        </button>
        {error && (
          <p
            className="text-xs"
            style={{ color: "#f87171", fontFamily: "var(--font-dm-sans)" }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all hover:bg-[rgba(239,68,68,0.08)]"
      style={{
        color: "#3d6070",
        border: "1px solid #152636",
        fontFamily: "var(--font-dm-sans)",
      }}
      title={`Delete ${fileName}`}
    >
      <Trash2 size={12} strokeWidth={1.8} />
      Delete
    </button>
  );
}
