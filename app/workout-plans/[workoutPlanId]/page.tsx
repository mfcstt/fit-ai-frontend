import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Goal } from "lucide-react";
import dayjs from "dayjs";
import { authClient } from "@/app/_lib/auth-client";
import { getWorkoutPlanById } from "@/app/_lib/api/fetch-generated";
import { WorkoutDayCard } from "@/app/_components/workout-day-card";
import { RestDayCard } from "@/app/_components/rest-day-card";
import { BottomNav } from "@/app/_components/bottom-nav";

interface WorkoutPlanPageProps {
  params: Promise<{
    workoutPlanId: string;
  }>;
}

export default async function WorkoutPlanPage({
  params,
}: WorkoutPlanPageProps) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const { workoutPlanId } = await params;
  const response = await getWorkoutPlanById(workoutPlanId);

  if (response.status !== 200) redirect("/");

  const workoutPlan = response.data;
  const bannerImage = workoutPlan.workoutDays.find(
    (d) => !d.isRest && d.coverImageUrl,
  )?.coverImageUrl;

  const DAYS_OF_WEEK = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const todayWeekDay = DAYS_OF_WEEK[dayjs().day()];

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="relative flex h-74 flex-col items-start justify-between overflow-hidden rounded-b-4xl px-5 pb-10 pt-5">
        {bannerImage && (
          <Image
            src={bannerImage}
            alt={workoutPlan.name}
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
              "linear-gradient(238deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
          }}
        />

        <div className="relative flex w-full items-center justify-between">
          <Link href="/">
            <ChevronLeft className="size-6 text-background" />
          </Link>
          <p className="font-sans text-[22px] font-bold uppercase leading-tight text-background">
            Fit.ai
          </p>
          <div className="size-6" />
        </div>

        <div className="relative flex flex-col gap-3">
          <div className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1.5">
            <Goal className="size-4 text-primary-foreground" />
            <span className="text-xs font-semibold uppercase text-primary-foreground">
              {workoutPlan.name}
            </span>
          </div>
          <p className="text-2xl font-semibold leading-tight text-background">
            Plano de Treino
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5">
        {workoutPlan.workoutDays.map((day) =>
          day.isRest ? (
            <RestDayCard
              key={day.id}
              weekDay={day.weekDay}
              isToday={day.weekDay === todayWeekDay}
            />
          ) : (
            <Link
              key={day.id}
              href={`/workout-plans/${workoutPlanId}/days/${day.id}`}
            >
              <WorkoutDayCard
                name={day.name}
                weekDay={day.weekDay}
                estimatedDurationInSeconds={day.estimatedDurationInSeconds}
                exercisesCount={day.exercisesCount}
                coverImageUrl={day.coverImageUrl}
                isToday={day.weekDay === todayWeekDay}
              />
            </Link>
          ),
        )}
      </div>

      <BottomNav workoutPlanHref={`/workout-plans/${workoutPlanId}`} />
    </div>
  );
}
