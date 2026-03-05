"use client";

import { Button } from "@/components/ui/button";

import { useTransition } from "react";
import { startWorkoutSessionAction } from "../_actions";

interface StartWorkoutButtonProps {
  workoutPlanId: string;
  workoutDayId: string;
}

export function StartWorkoutButton({
  workoutPlanId,
  workoutDayId,
}: StartWorkoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await startWorkoutSessionAction(workoutPlanId, workoutDayId);
    });
  };

  return (
    <Button
      className="w-full rounded-full"
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending ? "Iniciando..." : "Iniciar Treino"}
    </Button>
  );
}
