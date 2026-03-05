import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import type { GetStats200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abril",
  "Maio",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

interface ConsistencyHeatmapProps {
  consistencyByDay: GetStats200ConsistencyByDay;
}

function getWeeksForMonth(year: number, month: number) {
  const firstDay = dayjs(new Date(year, month, 1));
  const lastDay = firstDay.endOf("month");

  const startOfFirstWeek = firstDay.startOf("week").add(1, "day");
  const weeks: dayjs.Dayjs[][] = [];

  let weekStart = startOfFirstWeek;

  while (weekStart.isBefore(lastDay) || weekStart.isSame(lastDay, "day")) {
    const week: dayjs.Dayjs[] = [];
    for (let d = 0; d < 7; d++) {
      const day = weekStart.add(d, "day");
      if (day.month() === month) {
        week.push(day);
      }
    }
    if (week.length > 0) {
      weeks.push(week);
    }
    weekStart = weekStart.add(7, "day");
  }

  return weeks;
}

export function ConsistencyHeatmap({
  consistencyByDay,
}: ConsistencyHeatmapProps) {
  const today = dayjs();
  const months = Array.from({ length: 3 }, (_, i) => {
    const m = today.subtract(2 - i, "month");
    return { year: m.year(), month: m.month() };
  });

  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl border border-border p-5">
      {months.map(({ year, month }) => {
        const weeks = getWeeksForMonth(year, month);

        return (
          <div key={`${year}-${month}`} className="flex flex-col gap-1.5">
            <p className="text-xs text-muted-foreground">
              {MONTH_LABELS[month]}
            </p>
            <div className="flex gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const dayInWeek = week.find(
                      (d) =>
                        (d.day() === 0 ? 6 : d.day() - 1) === dayIndex,
                    );

                    if (!dayInWeek) {
                      return <div key={dayIndex} className="size-5" />;
                    }

                    const dateKey = dayInWeek.format("YYYY-MM-DD");
                    const consistency = consistencyByDay[dateKey];

                    return (
                      <div
                        key={dayIndex}
                        className={cn(
                          "size-5 rounded-md",
                          consistency?.workoutDayCompleted
                            ? "bg-primary"
                            : consistency?.workoutDayStarted
                              ? "bg-primary/30"
                              : "border border-border",
                        )}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
