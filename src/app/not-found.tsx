"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const pathname = usePathname();

  // Check if this looks like a username route (e.g., /john)
  const isUsernameRoute = pathname && /^\/[a-z0-9-]+$/i.test(pathname);
  const username = isUsernameRoute ? pathname.slice(1) : null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>

        {username ? (
          <>
            <h2 className="text-2xl font-semibold mb-2">
              @{username} is available!
            </h2>
            <p className="text-muted-foreground mb-6">
              This username hasn&apos;t been claimed yet. Sign up now to make it yours!
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <Link href="/signup">Claim @{username}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Go home</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
            <p className="text-muted-foreground mb-6">
              The page you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button asChild>
              <Link href="/">Go home</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
