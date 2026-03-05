import { headers } from "next/headers";
import { authClient } from "./_lib/auth-client";
import { redirect } from "next/navigation";
import { getHomeData } from "./_lib/api/fetch-generated";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Flame } from "lucide-react";
import { BottomNav } from "@/app/_components/bottom-nav";
import { WorkoutDayCard } from "@/app/_components/workout-day-card";
import { Button } from "@/components/ui/button";
import { ConsistencyWeek } from "./_components/consistency-week";

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const homeData = await getHomeData(dayjs().format("YYYY-MM-DD"));

  if (homeData.status !== 200) redirect("/auth");

  const { todayWorkoutDay, workoutStreak, consistencyByDay, activeWorkoutPlanId } = homeData.data;
  const userName = session.data.user.name ?? "Atleta";

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="relative flex h-74 flex-col items-start justify-between overflow-hidden rounded-b-4xl px-5 pb-10 pt-5">
        {todayWorkoutDay?.coverImageUrl && (
          <Image
            src={todayWorkoutDay.coverImageUrl}
            alt="Banner"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div
          className="absolute inset-0 rounded-b-4xl"
          style={{
            backgroundImage:
              "linear-gradient(242deg, rgba(0,0,0,0) 34%, rgb(0,0,0) 100%)",
          }}
        />

        <p className="relative font-sans text-[22px] font-bold uppercase leading-tight text-background">
          Fit.ai
        </p>

        <div className="relative flex w-full items-end justify-between">
          <div className="flex flex-col gap-1.5">
            <p className="text-2xl font-semibold leading-tight text-background">
              Olá, {userName}
            </p>
            <p className="text-sm text-background/70">Bora treinar hoje?</p>
          </div>
          <Button className="rounded-full px-4 py-2">Bora!</Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-5 pt-5">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-foreground">Consistência</p>
          <button className="text-xs text-primary">Ver histórico</button>
        </div>

        <div className="flex items-center gap-3">
          <ConsistencyWeek consistencyByDay={consistencyByDay} />

          <div className="flex items-center gap-2 rounded-xl bg-[rgba(240,97,0,0.08)] px-5 py-2 self-stretch">
            <Flame className="size-5 text-[#f06100]" />
            <span className="text-base font-semibold text-foreground">
              {workoutStreak}
            </span>
          </div>
        </div>
      </div>

      {todayWorkoutDay && (
        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-foreground">
              Treino de Hoje
            </p>
            <Link
              href={`/workout-plans/${activeWorkoutPlanId}`}
              className="text-xs text-primary"
            >
              Ver treinos
            </Link>
          </div>

          <Link
            href={`/workout-plans/${todayWorkoutDay.workoutPlanId}/days/${todayWorkoutDay.id}`}
          >
            <WorkoutDayCard
              name={todayWorkoutDay.name}
              weekDay={todayWorkoutDay.weekDay}
              estimatedDurationInSeconds={
                todayWorkoutDay.estimatedDurationInSeconds
              }
              exercisesCount={todayWorkoutDay.exercisesCount}
              coverImageUrl={todayWorkoutDay.coverImageUrl}
            />
          </Link>
        </div>
      )}

      <BottomNav
        workoutPlanHref={`/workout-plans/${activeWorkoutPlanId}`}
      />
    </div>
  );
}