"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth");
  };

  return (
    <Button
      variant="ghost"
      className="gap-2 text-destructive hover:text-destructive"
      onClick={handleSignOut}
    >
      <span className="text-base font-semibold">Sair da conta</span>
      <LogOut className="size-4" />
    </Button>
  );
}
