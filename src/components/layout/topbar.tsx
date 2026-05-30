"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Bell, Search, X, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  resume: "Resumes",
  interview: "Interviews",
  analytics: "Analytics",
  "job-descriptions": "Job Board",
  settings: "Settings",
  support: "Support",
  new: "New",
  feedback: "Feedback",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => ({
    label: ROUTE_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));
}

// Mock notifications — replace with real data
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "Interview Complete",
    body: "Your Senior PM mock scored 88/100",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    title: "ATS Score Ready",
    body: "Resume matched 74% for Stripe Staff Design",
    time: "1h ago",
    unread: true,
  },
  {
    id: "3",
    title: "Feedback Generated",
    body: "Full report for Technical Architect interview",
    time: "3h ago",
    unread: false,
  },
];

export function Topbar() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close notif dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className="hidden lg:flex items-center justify-between shrink-0 px-6 lg:px-8"
      style={{
        height: 64,
        backgroundColor: "#060f18",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Left: breadcrumbs + tab-like nav */}
      <div className="flex items-center gap-1">
        {/* Tab navigation — matches the "My Documents / Recent Activity" in the design */}
        <nav className="flex items-center gap-1">
          {["My Documents", "Recent Activity"].map((tab, i) => (
            <button
              key={tab}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-150",
                i === 0
                  ? "text-[#dff0ea] border-b-2 border-[#00e5a0]"
                  : "text-[#3d6070] hover:text-[#8acfba]",
              )}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Right: search + notifications + avatar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex items-center">
          {searchOpen ? (
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{
                background: "#0e1e2d",
                border: "1px solid #1a3048",
                width: 260,
              }}
            >
              <Search size={14} color="#3d6070" />
              <input
                ref={searchRef}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search simulations..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{
                  color: "#dff0ea",
                  fontFamily: "var(--font-dm-sans)",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchOpen(false);
                    setSearchValue("");
                  }
                }}
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchValue("");
                }}
              >
                <X size={13} color="#3d6070" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all hover:bg-[rgba(255,255,255,0.04)]"
              style={{
                background: "#0e1e2d",
                border: "1px solid #152636",
                color: "#3d6070",
                minWidth: 200,
              }}
            >
              <Search size={14} />
              <span
                className="text-sm"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Search simulations...
              </span>
            </button>
          )}
        </div>

        {/* Notification bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex items-center justify-center rounded-xl transition-all hover:bg-[rgba(255,255,255,0.04)]"
            style={{
              width: 40,
              height: 40,
              background: "#0e1e2d",
              border: "1px solid #152636",
              color: "#3d6070",
            }}
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 flex items-center justify-center text-[9px] font-bold rounded-full"
                style={{
                  width: 14,
                  height: 14,
                  background: "#00e5a0",
                  color: "#050d14",
                  fontFamily: "var(--font-syne)",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {notifOpen && (
            <div
              className="absolute right-0 mt-2 z-50 rounded-2xl overflow-hidden"
              style={{
                width: 320,
                background: "#0e1e2d",
                border: "1px solid #1a3048",
                boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid #152636" }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: "#dff0ea", fontFamily: "var(--font-syne)" }}
                >
                  Notifications
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(0,229,160,0.1)",
                    color: "#00e5a0",
                    border: "1px solid rgba(0,229,160,0.2)",
                  }}
                >
                  {unreadCount} new
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: "#152636" }}>
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <div
                      className="mt-1 shrink-0 rounded-full"
                      style={{
                        width: 7,
                        height: 7,
                        background: n.unread ? "#00e5a0" : "transparent",
                        border: n.unread
                          ? "none"
                          : "1px solid rgba(255,255,255,0.1)",
                        boxShadow: n.unread
                          ? "0 0 6px rgba(0,229,160,0.5)"
                          : "none",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: "#dff0ea" }}
                      >
                        {n.title}
                      </p>
                      <p
                        className="text-xs mt-0.5 truncate"
                        style={{ color: "#4a6a7a" }}
                      >
                        {n.body}
                      </p>
                    </div>
                    <span
                      className="text-[10px] shrink-0 mt-0.5"
                      style={{ color: "#2a4050" }}
                    >
                      {n.time}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="px-4 py-2.5 text-center"
                style={{ borderTop: "1px solid #152636" }}
              >
                <button
                  className="text-xs font-medium transition-colors hover:text-[#00e5a0]"
                  style={{ color: "#4a6a7a" }}
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User avatar — desktop only shows inside sidebar, but mobile shows here */}
        <div className="lg:hidden">
          <UserButton
            appearance={{
              variables: {
                colorPrimary: "#00c98a",
                colorBackground: "#0e1e2d",
                colorText: "#dff0ea",
              },
              elements: {
                userButtonBox: "w-full",
                userButtonTrigger: cn(
                  "flex items-center gap-3 rounded-xl p-2 transition-all hover:bg-[rgba(255,255,255,0.04)] w-full",
                ),
                userButtonAvatarBox: "w-8 h-8 shrink-0",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
