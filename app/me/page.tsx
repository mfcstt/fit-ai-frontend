import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import dayjs from "dayjs";
import { Weight, Ruler, BicepsFlexed, User } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { getHomeData, getMe } from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/app/_components/bottom-nav";
import { StatCard } from "@/app/_components/stat-card";
import { SignOutButton } from "./_components/sign-out-button";

export default async function ProfilePage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs();
  const [response, homeResponse] = await Promise.all([
    getMe(),
    getHomeData(today.format("YYYY-MM-DD")),
  ]);

  if (response.status !== 200 || !response.data) redirect("/");

  const me = response.data;
  const user = session.data.user;
  const weightKg = (me.weightInGrams / 1000).toFixed(1);
  const workoutPlanHref =
    homeResponse.status === 200
      ? `/workout-plans/${homeResponse.data.activeWorkoutPlanId}`
      : undefined;

  console.log(me);

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex h-14 items-center px-5">
        <p className="font-sans text-[22px] font-bold uppercase leading-tight text-foreground">
          Fit.ai
        </p>
      </div>

      <div className="flex flex-col items-center gap-5 p-5">
        <div className="flex w-full items-center gap-3">
          {user.image && (
            <Image
              src={user.image}
              alt={user.name ?? ""}
              width={52}
              height={52}
              className="rounded-full object-cover"
            />
          )}
          <div className="flex flex-col gap-1.5">
            <p className="text-lg font-semibold leading-tight text-foreground">
              {user.name}
            </p>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          <StatCard icon={Weight} value={weightKg} label="KG" />
          <StatCard
            icon={Ruler}
            value={String(me.heightInCentimeters)}
            label="CM"
          />
          <StatCard
            icon={BicepsFlexed}
            value={`${me.bodyFatPercentage}%`}
            label="GC"
          />
          <StatCard icon={User} value={String(me.age)} label="ANOS" />
        </div>

        <SignOutButton />
      </div>

      <BottomNav workoutPlanHref={workoutPlanHref} />
    </div>
  );
}
