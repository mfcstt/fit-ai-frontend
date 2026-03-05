"use client";

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { completeWorkoutSessionAction } from "../_actions";

interface CompleteWorkoutButtonProps {
  workoutPlanId: string;
  workoutDayId: string;
  workoutSessionId: string;
}

export function CompleteWorkoutButton({
  workoutPlanId,
  workoutDayId,
  workoutSessionId,
}: CompleteWorkoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await completeWorkoutSessionAction(
        workoutPlanId,
        workoutDayId,
        workoutSessionId
      );
    });
  };

  return (
    <Button
      variant="outline"
      className="w-full rounded-full"
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending ? "Concluindo..." : "Marcar como concluído"}
    </Button>
  );
}
