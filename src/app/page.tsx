import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  // Fetch stats
  const [userCount, linkCount, viewsAggregate] = await Promise.all([
    db.user.count(),
    db.link.count({ where: { type: "link" } }),
    db.user.aggregate({ _sum: { profileViews: true } }),
  ]);
  const totalViews = viewsAggregate._sum.profileViews ?? 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-4xl font-bold">
            Lnky
          </Link>
          <div className="flex gap-2">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6 ">
            One link for all your links
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto">
            Create your personalized link-in-bio page in seconds. Share your
            content, social profiles, and more with a single link.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get started for free
                </Button>
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="mt-10 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-sm sm:max-w-none mx-auto">
            <div>
              <p className="text-2xl sm:text-3xl font-bold">{userCount.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Users</p>
            </div>
            <div className="border-l border-r border-border px-4 sm:px-8">
              <p className="text-2xl sm:text-3xl font-bold">{linkCount.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Links</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold">{totalViews.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Views</p>
            </div>
          </div>

          {/* Example URL preview */}
          <div className="mt-8 sm:mt-10 p-3 sm:p-4 bg-muted rounded-lg inline-block">
            <p className="text-muted-foreground text-xs sm:text-sm">Your link will look like:</p>
            <p className="text-base sm:text-lg font-mono mt-1">
              lnky.lol/<span className="text-primary font-semibold">yourname</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-muted-foreground text-xs sm:text-sm">
          Built with ❤️ by <Link href="https://github.com/grz3chotnik" >grz3chotnik</Link>
        </div>
      </footer>
    </div>
  );
}
