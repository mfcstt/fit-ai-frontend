"use client";

import {
  House,
  Calendar,
  Sparkles,
  ChartNoAxesColumn,
  UserRound,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  workoutPlanHref?: string;
}

export function BottomNav({ workoutPlanHref }: BottomNavProps) {
  const pathname = usePathname();


  const navItems = [
    { icon: House, href: "/", label: "Home", exact: true },
    { icon: Calendar, href: workoutPlanHref ?? "#", label: "Plano", prefix: "/workout-plans" },
    { icon: Sparkles, href: "#", label: "AI", isCenter: true },
    { icon: ChartNoAxesColumn, href: "/stats", label: "Estatísticas" },
    { icon: UserRound, href: "/me", label: "Perfil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-6 rounded-t-4xl border-t border-border bg-background px-6 py-4">
      {navItems.map((item) => {
        const isActive =
          item.href !== "#" &&
          (item.prefix
            ? pathname.startsWith(item.prefix)
            : item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href));

        if (item.isCenter) {
          return (
            <button
              key={item.label}
              className="flex items-center justify-center rounded-full bg-primary p-4"
            >
              <item.icon className="size-6 text-primary-foreground" />
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center p-3 text-muted-foreground",
              isActive && "text-foreground"
            )}
          >
            <item.icon className="size-6" />
          </Link>
        );
      })}
    </nav>
  );
}
