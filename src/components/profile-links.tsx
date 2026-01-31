"use client";

import Image from "next/image";

interface Link {
  id: string;
  title: string;
  url: string;
  imageUrl: string | null;
  type: string;
  platform: string | null;
}

interface ProfileLinksProps {
  links: Link[];
  accentColor: string | null;
}

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
  } catch {
    return "";
  }
}

export function ProfileLinks({ links, accentColor }: ProfileLinksProps) {
  if (links.length === 0) {
    return (
      <p className="text-center opacity-60">
        No links yet
      </p>
    );
  }

  return (
    <>
      {links.map((link) => {
        const faviconUrl = !link.imageUrl ? getFaviconUrl(link.url) : null;

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-full p-4 rounded-xl font-medium hover:scale-[1.02] transition-all duration-200 backdrop-blur-md"
            style={{
              backgroundColor: accentColor
                ? `${accentColor}cc`
                : "rgba(255, 255, 255, 0.15)",
              color: accentColor ? "#fff" : undefined,
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {/* Show custom image or favicon */}
            {link.imageUrl ? (
              <div className="absolute left-4 w-10 h-10 rounded-lg overflow-hidden">
                <Image
                  src={link.imageUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : faviconUrl ? (
              <div className="absolute left-4 w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={faviconUrl}
                  alt=""
                  className="w-6 h-6"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : null}
            <span className="text-center">
              {link.title}
            </span>
          </a>
        );
      })}
    </>
  );
}
