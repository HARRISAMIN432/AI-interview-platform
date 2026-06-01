import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden"
      style={{ backgroundColor: "#060f18" }}
    >
      {/* Background hex grid */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.025 }}
      >
        <defs>
          <pattern
            id="hex"
            x="0"
            y="0"
            width="56"
            height="97"
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points="28,0 56,14 56,42 28,56 0,42 0,14"
              fill="none"
              stroke="#00e5a0"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>

      {/* Glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,229,160,0.05) 0%, transparent 65%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="relative max-w-md w-full text-center">
        {/* 404 large text */}
        <div
          className="text-[120px] font-black leading-none mb-2"
          style={{
            fontFamily: "var(--font-syne)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(0,229,160,0.15)",
            letterSpacing: "-0.05em",
          }}
        >
          404
        </div>

        {/* Icon */}
        <div
          className="mx-auto mb-6 flex items-center justify-center rounded-2xl"
          style={{
            width: 64,
            height: 64,
            background: "rgba(0,229,160,0.06)",
            border: "1px solid rgba(0,229,160,0.15)",
          }}
        >
          <FileQuestion size={28} color="#00e5a0" />
        </div>

        <h1
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: "var(--font-syne)", color: "#dff0ea" }}
        >
          Page not found
        </h1>

        <p
          className="text-sm mb-8"
          style={{
            color: "#4a6a7a",
            fontFamily: "var(--font-dm-sans)",
            lineHeight: 1.65,
          }}
        >
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all active:scale-[0.97]"
            style={{
              background: "#00c98a",
              color: "#050d14",
              fontFamily: "var(--font-syne)",
              boxShadow: "0 4px 20px rgba(0,201,138,0.3)",
            }}
          >
            <Home size={14} strokeWidth={2.5} />
            Go to Dashboard
          </Link>

          <BackButton />
        </div>
      </div>
    </div>
  );
}
