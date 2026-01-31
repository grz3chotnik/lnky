import {
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Github,
  Music,
  Twitch,
  Mail,
  type LucideIcon,
} from "lucide-react";

export interface SocialPlatform {
  id: string;
  name: string;
  icon: LucideIcon;
  placeholder: string;
  baseUrl?: string;
}

export const socialPlatforms: SocialPlatform[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    placeholder: "username",
    baseUrl: "https://instagram.com/",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music,
    placeholder: "username",
    baseUrl: "https://tiktok.com/@",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    placeholder: "channel URL or @handle",
  },
  {
    id: "twitter",
    name: "X / Twitter",
    icon: Twitter,
    placeholder: "username",
    baseUrl: "https://x.com/",
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: Music,
    placeholder: "profile or playlist URL",
  },
  {
    id: "github",
    name: "GitHub",
    icon: Github,
    placeholder: "username",
    baseUrl: "https://github.com/",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    placeholder: "profile URL",
  },
  {
    id: "twitch",
    name: "Twitch",
    icon: Twitch,
    placeholder: "username",
    baseUrl: "https://twitch.tv/",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    placeholder: "profile URL",
  },
  {
    id: "email",
    name: "Email",
    icon: Mail,
    placeholder: "your@email.com",
    baseUrl: "mailto:",
  },
];

export function getPlatformById(id: string): SocialPlatform | undefined {
  return socialPlatforms.find((p) => p.id === id);
}
