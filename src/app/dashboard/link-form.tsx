"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "@base-ui/react/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ChevronDown, Link as LinkIcon } from "lucide-react";
import { socialPlatforms, getPlatformById } from "@/lib/social-platforms";
import { toast } from "sonner";

interface LinkFormProps {
  userId: string;
  linkCount: number;
}

export function LinkForm({ userId, linkCount }: LinkFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const platform = selectedPlatform ? getPlatformById(selectedPlatform) : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    let finalUrl = url.trim();
    const finalTitle = title.trim() || (platform ? platform.name : "");

    // Build URL for social platforms
    if (platform) {
      if (platform.baseUrl && !finalUrl.startsWith("http") && !finalUrl.startsWith("mailto:")) {
        finalUrl = platform.baseUrl + finalUrl.replace(/^@/, "");
      } else if (!finalUrl.startsWith("http") && !finalUrl.startsWith("mailto:")) {
        finalUrl = "https://" + finalUrl;
      }
    } else {
      if (finalUrl && !finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
        finalUrl = `https://${finalUrl}`;
      }
    }

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: finalTitle,
          url: finalUrl,
          order: linkCount,
          type: platform ? "social" : "link",
          platform: platform ? platform.id : null,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setError(data.error || "Failed to add link");
        } catch {
          setError(`Server error: ${res.status}`);
        }
        return;
      }

      setTitle("");
      setUrl("");
      setSelectedPlatform("");
      toast.success("Link added");
      router.refresh();
    } catch (err) {
      console.error("Link form error:", err);
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  const handleSelectPlatform = (platformId: string) => {
    if (platformId === "custom") {
      setSelectedPlatform("");
      setTitle("");
    } else {
      const p = getPlatformById(platformId);
      setSelectedPlatform(platformId);
      setTitle(p?.name || "");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-2.5 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        {/* Platform selector dropdown */}
        <Menu.Root>
          <Menu.Trigger className="flex items-center justify-between gap-2 h-9 px-3 rounded-md border border-input bg-background text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer min-w-[140px]">
            {platform ? (
              <>
                {(() => {
                  const Icon = platform.icon;
                  return <Icon className="w-4 h-4" />;
                })()}
                <span className="flex-1 text-left">{platform.name}</span>
              </>
            ) : (
              <>
                <LinkIcon className="w-4 h-4" />
                <span className="flex-1 text-left">Custom Link</span>
              </>
            )}
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={4}>
              <Menu.Popup className="z-50 min-w-[180px] rounded-md border bg-popover p-1 shadow-md data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95">
                <Menu.Item
                  onClick={() => handleSelectPlatform("custom")}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer outline-none hover:bg-accent hover:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                >
                  <LinkIcon className="w-4 h-4" />
                  Custom Link
                </Menu.Item>
                <Menu.Separator className="my-1 h-px bg-border" />
                {socialPlatforms.map((p) => {
                  const Icon = p.icon;
                  return (
                    <Menu.Item
                      key={p.id}
                      onClick={() => handleSelectPlatform(p.id)}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer outline-none hover:bg-accent hover:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                    >
                      <Icon className="w-4 h-4" />
                      {p.name}
                    </Menu.Item>
                  );
                })}
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={platform ? platform.name : "Title"}
          required={!platform}
          className="sm:flex-1"
        />
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          type="text"
          placeholder={platform?.placeholder || "URL"}
          required
          className="sm:flex-[2]"
        />
        <Button type="submit" disabled={loading} className="gap-1.5">
          <Plus className="w-4 h-4" />
          <span>{loading ? "Adding..." : "Add"}</span>
        </Button>
      </div>
    </form>
  );
}
