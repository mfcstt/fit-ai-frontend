import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CircleHelp, Zap } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { getWorkoutDayById } from "@/app/_lib/api/fetch-generated";
import { WorkoutDayCard } from "@/app/_components/workout-day-card";
import { BottomNav } from "@/app/_components/bottom-nav";
import { Button } from "@/components/ui/button";
import { StartWorkoutButton } from "./_components/start-workout-button";
import { CompleteWorkoutButton } from "./_components/complete-workout-button";
import dayjs from "dayjs";

interface WorkoutDayPageProps {
  params: Promise<{
    workoutPlanId: string;
    workoutDayId: string;
  }>;
}

export default async function WorkoutDayPage({ params }: WorkoutDayPageProps) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const { workoutPlanId, workoutDayId } = await params;

  const response = await getWorkoutDayById(workoutPlanId, workoutDayId);

  if (response.status !== 200) redirect("/");

  const workoutDay = response.data;

  const today = dayjs().format("YYYY-MM-DD");
  const todaySession = workoutDay.sessions.find(
    (s) => s.startedAt === today
  );
  const isCompleted = todaySession?.completedAt != null;
  const hasStartedSession = todaySession != null;

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-center justify-between">
          <Link href={`/workout-plans/${workoutPlanId}`}>
            <ChevronLeft className="size-6 text-foreground" />
          </Link>
          <p className="text-lg font-semibold text-foreground">
            Treino de Hoje
          </p>
          <div className="size-6" />
        </div>

        <WorkoutDayCard
          name={workoutDay.name}
          weekDay={workoutDay.weekDay}
          estimatedDurationInSeconds={workoutDay.estimatedDurationInSeconds}
          exercisesCount={workoutDay.exercises.length}
          coverImageUrl={workoutDay.coverImageUrl}
        />

        <div className="flex flex-col gap-3">
          {workoutDay.exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="flex flex-col justify-center gap-3 rounded-xl border border-border p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-foreground">
                  {exercise.name}
                </p>
                <Link
                  href={`?chat_open=true&initial_message=${encodeURIComponent(`Como executar exercício ${exercise.name} corretamente?`)}`}
                  scroll={false}
                >
                  <CircleHelp className="size-5 text-muted-foreground" />
                </Link>
              </div>
              <div className="flex gap-1.5">
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold uppercase text-muted-foreground">
                  {exercise.sets} séries
                </span>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold uppercase text-muted-foreground">
                  {exercise.reps} reps
                </span>
                <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold uppercase text-muted-foreground">
                  <Zap className="size-3.5" />
                  {exercise.restTimeInSeconds}S
                </span>
              </div>
            </div>
          ))}
        </div>

        {isCompleted ? (
          <Button variant="ghost" className="w-full rounded-full" disabled>
            Concluído
          </Button>
        ) : hasStartedSession ? (
          <CompleteWorkoutButton
            workoutPlanId={workoutPlanId}
            workoutDayId={workoutDayId}
            workoutSessionId={todaySession.id}
          />
        ) : (
          <StartWorkoutButton
            workoutPlanId={workoutPlanId}
            workoutDayId={workoutDayId}
          />
        )}
      </div>

      <BottomNav
        workoutPlanHref={`/workout-plans/${workoutPlanId}`}
      />
    </div>
  );
}
