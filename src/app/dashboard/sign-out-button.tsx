"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

// Sign out button component
// "use client" because signOut is a client-side function

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign out
    </Button>
  );
}
