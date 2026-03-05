import { headers } from "next/headers";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import { Flame, CircleCheck, CirclePercent, Hourglass } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { getHomeData, getStats } from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/app/_components/bottom-nav";
import { StatCard } from "@/app/_components/stat-card";
import { ConsistencyHeatmap } from "@/app/_components/consistency-heatmap";

function formatTotalTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h${String(minutes).padStart(2, "0")}m`;
}

export default async function StatsPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs();
  const from = today.subtract(2, "month").startOf("month").format("YYYY-MM-DD");
  const to = today.endOf("month").format("YYYY-MM-DD");

  const [response, homeResponse] = await Promise.all([
    getStats({ from, to }),
    getHomeData(today.format("YYYY-MM-DD")),
  ]);

  if (response.status !== 200) redirect("/");

  const stats = response.data;
  const hasStreak = stats.workoutStreak > 0;
  const workoutPlanHref =
    homeResponse.status === 200
      ? `/workout-plans/${homeResponse.data.activeWorkoutPlanId}`
      : undefined;

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex h-14 items-center px-5">
        <p className="font-sans text-[22px] font-bold uppercase leading-tight text-foreground">
          Fit.ai
        </p>
      </div>

      <div className="flex flex-col gap-5 px-5">
        <div
          className="relative flex flex-col items-center justify-center gap-6 overflow-hidden rounded-xl px-5 py-10"
        >
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: hasStreak
                ? "linear-gradient(135deg, #f06100 0%, #8b2500 50%, #1a0a00 100%)"
                : "linear-gradient(135deg, #6b6b6b 0%, #3d3d3d 50%, #1a1a1a 100%)",
            }}
          />
          <div className="relative flex flex-col items-center gap-3">
            <div className="flex items-center rounded-full border border-background/12 bg-background/12 p-3 backdrop-blur-sm">
              <Flame className="size-8 text-background" />
            </div>
            <div className="flex flex-col items-center gap-1 text-background">
              <p className="text-5xl font-semibold leading-none">
                {stats.workoutStreak} dias
              </p>
              <p className="text-base text-background/60">Sequência Atual</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-lg font-semibold text-foreground">Consistência</p>
          <ConsistencyHeatmap consistencyByDay={stats.consistencyByDay} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={CircleCheck}
            value={String(stats.completedWorkoutsCount)}
            label="Treinos Feitos"
          />
          <StatCard
            icon={CirclePercent}
            value={`${Math.round(stats.conclusionRate * 100)}%`}
            label="Taxa de conclusão"
          />
        </div>

        <StatCard
          icon={Hourglass}
          value={formatTotalTime(stats.totalTimeInSeconds)}
          label="Tempo Total"
        />
      </div>

      <BottomNav workoutPlanHref={workoutPlanHref} />
    </div>
  );
}
