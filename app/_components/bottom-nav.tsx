"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Calendar,
  ChartNoAxesColumn,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatOpenButton } from "@/app/_components/chat-open-button";

interface BottomNavProps {
  workoutPlanHref?: string;
}

export function BottomNav({ workoutPlanHref }: BottomNavProps) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isCalendar = pathname.startsWith("/workout-plans");
  const isStats = pathname === "/stats";
  const isMe = pathname === "/me";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-6 rounded-t-[20px] border border-border bg-background px-6 py-4">
      <Link href="/" className="p-3">
        <House
          className={cn(
            "size-6",
            isHome ? "text-foreground" : "text-muted-foreground"
          )}
        />
      </Link>
      {workoutPlanHref ? (
        <Link href={workoutPlanHref} className="p-3">
          <Calendar
            className={cn(
              "size-6",
              isCalendar ? "text-foreground" : "text-muted-foreground"
            )}
          />
        </Link>
      ) : (
        <span className="p-3">
          <Calendar className="size-6 text-muted-foreground" />
        </span>
      )}
      <ChatOpenButton />
      <Link href="/stats" className="p-3">
        <ChartNoAxesColumn
          className={cn(
            "size-6",
            isStats ? "text-foreground" : "text-muted-foreground"
          )}
        />
      </Link>
      <Link href="/me" className="p-3">
        <UserRound
          className={cn(
            "size-6",
            isMe ? "text-foreground" : "text-muted-foreground"
          )}
        />
      </Link>
    </nav>
  );
}