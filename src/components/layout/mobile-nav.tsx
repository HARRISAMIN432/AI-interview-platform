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
  Menu,
  X,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Resumes", href: "/resume", icon: FileText },
  { label: "Interviews", href: "/interview", icon: Video },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
  { label: "Job Board", href: "/job-descriptions", icon: Briefcase },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Support", href: "/support", icon: HelpCircle },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile topbar */}
      <header
        className="lg:hidden flex items-center justify-between px-4 shrink-0"
        style={{
          height: 60,
          backgroundColor: "#07111c",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(145deg, #00e5a0 0%, #00916a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 12px rgba(0,229,160,0.25)",
            }}
          >
            <Layers size={14} color="#050d14" strokeWidth={2.2} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-syne)",
                color: "#e8faf4",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1,
              }}
            >
              Interview Pro
            </div>
            <div
              style={{
                color: "#00e5a0",
                fontSize: 8,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              Elite Tier
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-center rounded-xl transition-all"
            style={{
              width: 38,
              height: 38,
              background: "#0e1e2d",
              border: "1px solid #1a3048",
              color: "#5a8090",
            }}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Drawer overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 transition-opacity duration-300",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        style={{ backgroundColor: "rgba(5,13,20,0.85)" }}
        onClick={() => setOpen(false)}
      />

      {/* Drawer panel */}
      <div
        className={cn(
          "lg:hidden fixed left-0 top-0 bottom-0 z-50 flex flex-col transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        style={{
          width: 260,
          backgroundColor: "#07111c",
          borderRight: "1px solid rgba(0,229,160,0.06)",
        }}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-4 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(145deg, #00e5a0 0%, #00916a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Layers size={14} color="#050d14" strokeWidth={2.2} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-syne)",
                color: "#e8faf4",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              Interview Pro
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center rounded-lg"
            style={{ width: 32, height: 32, color: "#3d6070" }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 relative",
                  active
                    ? "text-[#00e5a0] bg-[rgba(0,229,160,0.08)]"
                    : "text-[#3d6070] hover:text-[#8acfba]",
                )}
              >
                {active && (
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
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                <span
                  className="text-sm font-medium"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Upgrade CTA */}
        <div
          className="px-4 pb-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <button
            className="w-full mt-4 rounded-xl py-3 text-sm font-bold transition-all active:scale-[0.97]"
            style={{
              fontFamily: "var(--font-syne)",
              background: "linear-gradient(135deg, #00e5a0, #00916a)",
              color: "#050d14",
              boxShadow: "0 4px 20px rgba(0,229,160,0.25)",
            }}
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </>
  );
}
