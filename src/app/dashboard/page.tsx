import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkForm } from "./link-form";
import { ScrollableLinks } from "./scrollable-links";
import { SignOutButton } from "./sign-out-button";
import { ProfileImageUpload } from "./profile-image-upload";
import { Customization } from "./customization";
import { Statistics } from "./statistics";
import { ProfileEdit } from "./profile-edit";
import { ExternalLink } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const links = await db.link.findMany({
    where: { userId: session.user.id },
    orderBy: { order: "asc" },
  });

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Lnky
          </Link>
          <SignOutButton />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <ProfileImageUpload
                currentImageUrl={user?.avatarUrl ?? null}
                username={session.user.username}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h2 className="font-semibold truncate">
                    {user?.displayName || session.user.username}
                  </h2>
                  <ProfileEdit
                    currentDisplayName={user?.displayName ?? null}
                    currentBio={user?.bio ?? null}
                  />
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  lnky.lol/{session.user.username}
                </p>
                {user?.bio && (
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {user.bio}
                  </p>
                )}
              </div>
              <Button variant="outline" size="sm" className="shrink-0 gap-1.5" asChild>
                <Link href={`/${session.user.username}`} target="_blank">
                  <span className="hidden sm:inline">View</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Statistics userId={session.user.id} />

        {/* Links Section */}
        <div className="space-y-6">
          {/* Add Link Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Add a link</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <LinkForm userId={session.user.id} linkCount={links.length} />
            </CardContent>
          </Card>

          {/* Links List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Your links ({links.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {links.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">
                  No links yet. Add your first link above!
                </p>
              ) : (
                <ScrollableLinks links={links} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Customization */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Customization</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Customization
              currentBackgroundUrl={user?.backgroundUrl ?? null}
              currentCursorUrl={user?.cursorUrl ?? null}
              currentBgColor={user?.bgColor ?? null}
              currentTextColor={user?.textColor ?? null}
              currentAccentColor={user?.accentColor ?? null}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
