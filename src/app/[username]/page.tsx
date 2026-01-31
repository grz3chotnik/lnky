import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { getPlatformById } from "@/lib/social-platforms";
import { TrackView } from "@/components/track-view";
import {EyeIcon} from "lucide-react";

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

  // Separate regular links from social links
  const regularLinks = user.links.filter((l) => l.type !== "social");
  const socialLinks = user.links.filter((l) => l.type === "social");

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
          {regularLinks.length === 0 && socialLinks.length === 0 ? (
            <p className="text-center opacity-60">
              No links yet
            </p>
          ) : (
            regularLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center w-full p-4 rounded-xl font-medium hover:scale-[1.02] transition-all duration-200 backdrop-blur-md"
                style={{
                  backgroundColor: user.accentColor
                    ? `${user.accentColor}cc`
                    : "rgba(255, 255, 255, 0.15)",
                  color: user.accentColor ? "#fff" : undefined,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                {link.imageUrl && (
                  <div className="absolute left-4 w-10 h-10 rounded-lg overflow-hidden">
                    <Image
                      src={link.imageUrl}
                      alt=""
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <span className="text-center">
                  {link.title}
                </span>
              </a>
            ))
          )}
        </div>

        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-4 mt-8">
            {socialLinks.map((link) => {
              const platform = getPlatformById(link.platform ?? "");
              if (!platform) return null;
              const Icon = platform.icon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-200 backdrop-blur-md"
                  style={{
                    backgroundColor: user.accentColor
                      ? `${user.accentColor}cc`
                      : "rgba(255, 255, 255, 0.15)",
                    color: user.accentColor ? "#fff" : undefined,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                  title={platform.name}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center space-y-2">
          <p className="text-xs opacity-40">{user.profileViews.toLocaleString()} views  </p>

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
    title: `${user.displayName || `@${user.username}`}`,
    description: user.bio || `Check out ${user.displayName || user.username}'s links`,
  };
}
