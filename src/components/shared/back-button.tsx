"use client";

import { ArrowLeft } from "lucide-react";

export function BackButton() {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all hover:bg-[rgba(255,255,255,0.03)]"
      style={{
        border: "1px solid #1a3048",
        color: "#5a8090",
        fontFamily: "var(--font-dm-sans)",
      }}
    >
      <ArrowLeft size={14} />
      Go back
    </button>
  );
}
