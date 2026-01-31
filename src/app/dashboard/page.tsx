import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkForm } from "./link-form";
import { LinkList } from "./link-list";
import { SignOutButton } from "./sign-out-button";

// Dashboard Page - Protected route where users manage their links
// This is a Server Component that fetches data directly

export default async function DashboardPage() {
  // Get current session (user must be logged in due to middleware)
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch user's links from database
  const links = await db.link.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
  });

  // Get user profile data
  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            lnky
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={`/${session.user.username}`}
              target="_blank"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View your page
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Preview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Your link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <code className="bg-muted px-3 py-2 rounded text-sm">
                {typeof window !== "undefined" ? window.location.origin : "lnky.com"}/{session.user.username}
              </code>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${session.user.username}`} target="_blank">
                  Preview
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Add Link Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add a link</CardTitle>
            </CardHeader>
            <CardContent>
              <LinkForm userId={session.user.id} linkCount={links.length} />
            </CardContent>
          </Card>

          {/* Links List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your links ({links.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {links.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No links yet. Add your first link!
                </p>
              ) : (
                <LinkList links={links} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
