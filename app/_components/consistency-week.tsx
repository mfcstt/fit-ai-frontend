import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import type { GetHomeData200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";

const WEEK_DAY_SHORT_LABELS = ["S", "T", "Q", "Q", "S", "S", "D"];

interface ConsistencyWeekProps {
  consistencyByDay: GetHomeData200ConsistencyByDay;
}

export function ConsistencyWeek({ consistencyByDay }: ConsistencyWeekProps) {
  const today = dayjs();
  const startOfWeek = today.startOf("week").add(1, "day");

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = startOfWeek.add(i, "day");
    const dateKey = date.format("YYYY-MM-DD");
    const consistency = consistencyByDay[dateKey];
    const isToday = date.isSame(today, "day");

    return {
      label: WEEK_DAY_SHORT_LABELS[i],
      dateKey,
      completed: consistency?.workoutDayCompleted ?? false,
      started: consistency?.workoutDayStarted ?? false,
      isToday,
    };
  });

  return (
    <div className="flex flex-1 items-center justify-between rounded-xl border border-border p-5">
      {days.map((day) => (
        <div key={day.dateKey} className="flex flex-col items-center gap-1.5">
          <div
            className={cn(
              "size-5 rounded-md border border-border",
              day.completed && "border-transparent bg-primary",
              !day.completed && day.started && "border-transparent bg-primary/30",
              day.isToday &&
                !day.completed &&
                !day.started &&
                "border-primary border-[1.6px]"
            )}
          />
          <span className="text-xs text-muted-foreground">{day.label}</span>
        </div>
      ))}
    </div>
  );
}
