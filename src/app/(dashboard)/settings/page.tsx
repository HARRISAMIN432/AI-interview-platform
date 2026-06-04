import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="animate-fade-in-up max-w-lg">
      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
      >
        Settings
      </h1>
      <p className="text-sm mb-8" style={{ color: "#4a6a7a" }}>
        Manage your account and preferences.
      </p>
      <div
        className="rounded-2xl p-6"
        style={{ background: "#0c1a27", border: "1px solid #152636" }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ color: "#4a6a7a" }}
        >
          Account
        </p>
        <div className="flex items-center gap-4">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-12 h-12",
              },
            }}
          />
          <p className="text-sm" style={{ color: "#7a9aaa" }}>
            Manage your account settings, security preferences, and sign-in
            options.
          </p>
        </div>
      </div>
    </div>
  );
}
