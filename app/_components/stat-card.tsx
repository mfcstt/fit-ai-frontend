import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

export function StatCard({ icon: Icon, value, label }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
      <div className="flex items-center justify-center rounded-full bg-primary/8 p-2.5">
        <Icon className="size-4 text-primary" />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-2xl font-semibold leading-tight text-foreground">
          {value}
        </p>
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
