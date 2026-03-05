import { Calendar, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEK_DAY_LABELS: Record<string, string> = {
  SUNDAY: "DOMINGO",
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
};

interface RestDayCardProps {
  weekDay: string;
  isToday?: boolean;
}

export function RestDayCard({ weekDay, isToday }: RestDayCardProps) {
  const weekDayLabel = WEEK_DAY_LABELS[weekDay] ?? weekDay;

  return (
    <div className="flex h-27.5 w-full flex-col items-start justify-between rounded-xl bg-muted p-5">
      <div className="flex items-center justify-center">
        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-1.5 backdrop-blur-sm",
            isToday
              ? "bg-primary text-primary-foreground"
              : "bg-foreground/8 text-foreground",
          )}
        >
          <Calendar className="size-3.5" />
          <span className="text-xs font-semibold uppercase">
            {isToday ? "HOJE" : weekDayLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Zap className="size-5 text-foreground" />
        <p className="text-2xl font-semibold leading-tight text-foreground">
          Descanso
        </p>
      </div>
    </div>
  );
}
