import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TypingUsername } from "@/components/typing-username";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lnky - One link for all your links",
  description: "Create your personalized link-in-bio page in seconds. Share your content, social profiles, and more with a single link.",
  openGraph: {
    title: "Lnky - One link for all your links",
    description: "Create your personalized link-in-bio page in seconds. Share your content, social profiles, and more with a single link.",
    url: "https://lnky.lol",
    siteName: "Lnky",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lnky - One link for all your links",
    description: "Create your personalized link-in-bio page in seconds. Share your content, social profiles, and more with a single link.",
  },
};

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  // Fetch stats
  const [userCount, linkCount, viewsAggregate] = await Promise.all([
    db.user.count(),
    db.link.count(),
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
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-7xl flex items-center justify-center gap-6 xl:gap-10">
          {/* Laptop Mockup - hidden on mobile */}
          <div className="hidden lg:flex items-center relative w-[340px] xl:w-[420px] shrink overflow-hidden">
            <Image
              src="https://3pekix3gj9.ufs.sh/f/P0hjn6zoBOGuHyrNeGkde98TuayRrMZs6h0QgoSYfKAE2OH3"
              alt="Lnky dashboard preview"
              width={420}
              height={280}
              className="drop-shadow-2xl w-full h-auto"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          </div>

          {/* Main Content */}
          <div className="max-w-2xl lg:max-w-lg text-center shrink-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
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
                <p className="text-xs sm:text-sm text-muted-foreground">Total Users</p>
              </div>
              <div className="border-l border-r border-border px-4 sm:px-8">
                <p className="text-2xl sm:text-3xl font-bold">{linkCount.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Links</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold">{totalViews.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>

            {/* Example URL preview */}
            <div className="mt-8 sm:mt-10 p-3 sm:p-4 bg-muted rounded-lg inline-block">
              <p className="text-muted-foreground text-xs sm:text-sm">Your link will look like:</p>
              <p className="text-base sm:text-lg font-mono mt-1">
                lnky.lol/<TypingUsername />
              </p>
            </div>
          </div>

          {/* Phone Mockup - hidden on mobile, shown on lg */}
          <div className="hidden lg:flex items-center relative w-[340px] xl:w-[420px] shrink overflow-hidden">
            <Image
              src="https://3pekix3gj9.ufs.sh/f/P0hjn6zoBOGum966tEq4REO6aFC9q21QyAKYVdPriwB5lLIT"
              alt="Lnky profile preview"
              width={1600}
              height={1200}
              className="drop-shadow-2xl w-full h-auto"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Phone Mockup - visible only on mobile/tablet */}
        <div className="lg:hidden relative mt-12 sm:mt-16 max-h-[500px] overflow-hidden">
          <Image
            src="https://3pekix3gj9.ufs.sh/f/P0hjn6zoBOGuSa5Gw03gDrVwvIEkbWuMhpimTLz4lfR807PQ"
            alt="Lnky profile preview"
            width={380}
            height={760}
            className="drop-shadow-2xl"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-muted-foreground text-xs sm:text-sm">
          Built with ❤️ by grz3chotnik
        </div>
      </footer>
    </div>
  );
}
