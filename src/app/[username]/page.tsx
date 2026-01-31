import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";

// Public Profile Page - Shows user's links at /username
// This is what visitors see when they click someone's lnky link

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  // Find the user by username
  const user = await db.user.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      links: {
        where: { active: true }, // Only show active links
        orderBy: { order: "asc" },
      },
    },
  });

  // If user doesn't exist, show 404
  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          {/* Avatar placeholder - could be user's avatar if they have one */}
          <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">
              {(user.displayName || user.username)[0].toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold">
            {user.displayName || `@${user.username}`}
          </h1>
          {user.bio && (
            <p className="text-muted-foreground mt-2">{user.bio}</p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4">
          {user.links.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No links yet
            </p>
          ) : (
            user.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full p-4 bg-card border rounded-xl text-center font-medium hover:bg-accent hover:scale-[1.02] transition-all duration-200"
              >
                {link.title}
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Create your own lnky
          </Link>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;

  const user = await db.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (!user) {
    return { title: "User not found" };
  }

  return {
    title: `${user.displayName || `@${user.username}`} | Lnky`,
    description: user.bio || `Check out ${user.displayName || user.username}'s links`,
  };
}
