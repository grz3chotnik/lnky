import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { TrackView } from "@/components/track-view";
import { ProfileLinks } from "@/components/profile-links";

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

  // Build custom styles
  const customStyles: React.CSSProperties = {};
  if (user.bgColor) customStyles.backgroundColor = user.bgColor;
  if (user.textColor) customStyles.color = user.textColor;

  const hasCustomBg = user.bgColor || user.backgroundUrl;

  return (
    <div
      className={`min-h-screen py-12 px-4 relative ${
        !hasCustomBg ? "bg-gradient-to-b from-background to-muted/50" : ""
      }`}
      style={customStyles}
    >
      <TrackView username={user.username} />

      {/* Background Image */}
      {user.backgroundUrl && (
        <div className="fixed inset-0 -z-10">
          <Image
            src={user.backgroundUrl}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center backdrop-blur-md bg-white/10 border border-white/20">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.displayName || user.username}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                className="text-3xl font-bold"
                style={{ color: user.accentColor || undefined }}
              >
                {(user.displayName || user.username)[0].toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold">
            {user.displayName || `@${user.username}`}
          </h1>
          {user.bio && (
            <p className="mt-2 opacity-80">{user.bio}</p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4">
          <ProfileLinks links={user.links} accentColor={user.accentColor} />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center space-y-2">
          <p className="text-xs opacity-40">{user.profileViews.toLocaleString()} views</p>

          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Create your own Lnky
          </Link>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;

  const user = await db.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (!user) {
    return { title: "User not found" };
  }

  const displayName = user.displayName || `@${user.username}`;
  const description = user.bio || `Check out ${displayName}'s links on Lnky`;
  const url = `https://lnky.lol/${user.username}`;

  return {
    title: displayName,
    description,
    openGraph: {
      title: displayName,
      description,
      url,
      siteName: "Lnky",
      type: "profile",
      ...(user.avatarUrl && {
        images: [
          {
            url: user.avatarUrl,
            width: 400,
            height: 400,
            alt: displayName,
          },
        ],
      }),
    },
    twitter: {
      card: user.avatarUrl ? "summary" : "summary",
      title: displayName,
      description,
      ...(user.avatarUrl && {
        images: [user.avatarUrl],
      }),
    },
  };
}
