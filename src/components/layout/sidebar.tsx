"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Video,
  BarChart2,
  Briefcase,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Resumes",
    href: "/resume",
    icon: FileText,
  },
  {
    label: "Interviews",
    href: "/interview",
    icon: Video,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart2,
  },
  {
    label: "Job Board",
    href: "/job-descriptions",
    icon: Briefcase,
  },
];

const BOTTOM_ITEMS = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Support", href: "/support", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col relative transition-all duration-300 ease-in-out shrink-0",
        collapsed ? "w-[72px]" : "w-[220px]",
      )}
      style={{
        backgroundColor: "#07111c",
        borderRight: "1px solid rgba(0,229,160,0.06)",
      }}
    >
      {/* Top emerald accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, #00e5a0 50%, transparent)",
          opacity: 0.4,
        }}
      />

      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-5 shrink-0",
          collapsed && "justify-center px-0",
        )}
      >
        {/* Logo mark */}
        <div
          className="shrink-0"
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: "linear-gradient(145deg, #00e5a0 0%, #00916a 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(0,229,160,0.28)",
          }}
        >
          <Layers size={16} color="#050d14" strokeWidth={2.2} />
        </div>

        {/* Logo text */}
        {!collapsed && (
          <div className="overflow-hidden">
            <div
              style={{
                fontFamily: "var(--font-syne)",
                color: "#e8faf4",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              Interview Pro
            </div>
            <div
              style={{
                color: "#00e5a0",
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginTop: 3,
              }}
            >
              Elite Tier
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div
        className="mx-3 mb-4"
        style={{ height: 1, backgroundColor: "rgba(255,255,255,0.04)" }}
      />

      {/* Nav items */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl transition-all duration-150 relative",
                collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5",
                active
                  ? "text-[#00e5a0]"
                  : "text-[#3d6070] hover:text-[#8acfba]",
              )}
              style={
                active
                  ? {
                      background: "rgba(0,229,160,0.08)",
                    }
                  : {}
              }
              title={collapsed ? item.label : undefined}
            >
              {/* Active left bar */}
              {active && !collapsed && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                  style={{
                    width: 3,
                    height: 20,
                    background: "#00e5a0",
                    boxShadow: "0 0 8px rgba(0,229,160,0.6)",
                  }}
                />
              )}

              <Icon
                size={18}
                strokeWidth={active ? 2.2 : 1.8}
                className="shrink-0"
              />

              {!collapsed && (
                <span
                  className="text-sm font-medium tracking-wide truncate"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-2 pb-4 space-y-0.5">
        {/* Divider */}
        <div
          className="mx-1 mb-3"
          style={{ height: 1, backgroundColor: "rgba(255,255,255,0.04)" }}
        />

        {BOTTOM_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl transition-all duration-150",
                collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5",
                active
                  ? "text-[#00e5a0] bg-[rgba(0,229,160,0.08)]"
                  : "text-[#2a4455] hover:text-[#5a8090]",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={17} strokeWidth={1.8} className="shrink-0" />
              {!collapsed && (
                <span
                  className="text-sm font-medium tracking-wide"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}

        {/* Upgrade button */}
        {!collapsed && (
          <div className="mt-3 px-1">
            <button
              className="w-full rounded-xl py-2.5 text-sm font-bold transition-all duration-150 active:scale-[0.97]"
              style={{
                fontFamily: "var(--font-syne)",
                background: "linear-gradient(135deg, #00e5a0, #00916a)",
                color: "#050d14",
                letterSpacing: "0.01em",
                boxShadow: "0 4px 20px rgba(0,229,160,0.25)",
              }}
            >
              Upgrade to Pro
            </button>
          </div>
        )}

        {/* Divider */}
        <div
          className="mx-1 my-3"
          style={{ height: 1, backgroundColor: "rgba(255,255,255,0.04)" }}
        />

        {/* User button */}
        <div
          className={cn(
            "flex items-center",
            collapsed ? "justify-center" : "px-2",
          )}
        >
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
                  collapsed && "justify-center",
                ),
                userButtonAvatarBox: "w-8 h-8 shrink-0",
              },
            }}
          />
        </div>
      </div>

      {/* Collapse toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[76px] z-10 flex items-center justify-center transition-all duration-150 hover:scale-110"
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          backgroundColor: "#0e1e2d",
          border: "1px solid rgba(0,229,160,0.2)",
          color: "#00e5a0",
        }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight size={12} strokeWidth={2.5} />
        ) : (
          <ChevronLeft size={12} strokeWidth={2.5} />
        )}
      </button>
    </aside>
  );
}
