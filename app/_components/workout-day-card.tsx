import { Calendar, Timer, Dumbbell } from "lucide-react";
import Image from "next/image";

const WEEK_DAY_LABELS: Record<string, string> = {
  SUNDAY: "DOMINGO",
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
};

interface WorkoutDayCardProps {
  name: string;
  weekDay: string;
  estimatedDurationInSeconds: number;
  exercisesCount: number;
  coverImageUrl?: string;
}

export function WorkoutDayCard({
  name,
  weekDay,
  estimatedDurationInSeconds,
  exercisesCount,
  coverImageUrl,
}: WorkoutDayCardProps) {
  const durationMinutes = Math.round(estimatedDurationInSeconds / 60);
  const weekDayLabel = WEEK_DAY_LABELS[weekDay] ?? weekDay;

  return (
    <div className="relative flex h-41.75 w-full flex-col items-start justify-between overflow-clip rounded-xl p-5">
      {coverImageUrl && (
        <Image
          src={coverImageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

      <div className="relative flex items-center justify-center">
        <div className="flex items-center gap-1 rounded-full bg-white/16 px-2.5 py-1.5 backdrop-blur-sm">
          <Calendar className="size-3.5 text-background" />
          <span className="text-xs font-semibold uppercase text-background">
            {weekDayLabel}
          </span>
        </div>
      </div>

      <div className="relative flex flex-col gap-2">
        <p className="text-2xl font-semibold leading-tight text-background">
          {name}
        </p>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <Timer className="size-3.5 text-background/70" />
            <span className="text-xs text-background/70">
              {durationMinutes}min
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Dumbbell className="size-3.5 text-background/70" />
            <span className="text-xs text-background/70">
              {exercisesCount} exercícios
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
