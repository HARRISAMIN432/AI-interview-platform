import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Mail, BookOpen, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Support",
};

export default async function SupportPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const links = [
    {
      icon: BookOpen,
      title: "Getting started",
      description:
        "Upload a resume, add a job description, then start a mock interview.",
      href: "/dashboard",
    },
    {
      icon: MessageCircle,
      title: "Interview help",
      description:
        "Review completed sessions under Interviews or open the full feedback report.",
      href: "/interview",
    },
    {
      icon: Mail,
      title: "Contact",
      description:
        "Email harrisaminjutt@gmail.com for account or billing questions.",
      href: "mailto:harrisaminjutt@gmail.com",
    },
  ];

  return (
    <div className="animate-fade-in-up max-w-2xl">
      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
      >
        Support
      </h1>
      <p className="text-sm mb-8" style={{ color: "#4a6a7a" }}>
        Help resources and ways to reach us.
      </p>
      <div className="space-y-4">
        {links.map(({ icon: Icon, title, description, href }) => (
          <Link
            key={title}
            href={href}
            className="flex gap-4 rounded-2xl p-5 transition-colors hover:border-[rgba(0,229,160,0.2)]"
            style={{ background: "#0c1a27", border: "1px solid #152636" }}
          >
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-xl"
              style={{
                width: 40,
                height: 40,
                background: "rgba(0,229,160,0.08)",
              }}
            >
              <Icon size={18} color="#00e5a0" />
            </div>
            <div>
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
              >
                {title}
              </p>
              <p
                className="text-xs"
                style={{ color: "#4a6a7a", lineHeight: 1.6 }}
              >
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
