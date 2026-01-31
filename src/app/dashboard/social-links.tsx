"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { socialPlatforms, getPlatformById } from "@/lib/social-platforms";
import { X } from "lucide-react";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface SocialLinksProps {
  existingLinks: SocialLink[];
}

export function SocialLinks({ existingLinks }: SocialLinksProps) {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const existingPlatforms = new Set(existingLinks.map((l) => l.platform));
  const availablePlatforms = socialPlatforms.filter(
    (p) => !existingPlatforms.has(p.id)
  );

  const platform = selectedPlatform
    ? getPlatformById(selectedPlatform)
    : null;

  async function handleAdd() {
    if (!platform || !inputValue.trim()) return;

    setLoading(true);

    let url = inputValue.trim();
    if (platform.baseUrl && !url.startsWith("http") && !url.startsWith("mailto:")) {
      url = platform.baseUrl + url.replace(/^@/, "");
    } else if (!url.startsWith("http") && !url.startsWith("mailto:")) {
      url = "https://" + url;
    }

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: platform.name,
          url,
          type: "social",
          platform: platform.id,
          order: 1000 + existingLinks.length,
        }),
      });

      if (res.ok) {
        setSelectedPlatform(null);
        setInputValue("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Existing social links */}
      {existingLinks.length > 0 && (
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5">
          {existingLinks.map((link) => {
            const p = getPlatformById(link.platform ?? "");
            if (!p) return null;
            const Icon = p.icon;
            const isDeleting = deletingId === link.id;
            return (
              <div
                key={link.id}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-primary/10 text-sm"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{p.name}</span>
                </div>
                <button
                  onClick={() => handleDelete(link.id)}
                  disabled={isDeleting}
                  className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                >
                  {isDeleting ? (
                    <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <X className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add new social link */}
      {selectedPlatform && platform ? (
        <div className="space-y-3 p-3 rounded-lg border bg-muted/50">
          <div className="flex items-center gap-2 text-sm font-medium">
            {(() => {
              const Icon = platform.icon;
              return <Icon className="w-4 h-4" />;
            })()}
            <span>Add {platform.name}</span>
          </div>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={platform.placeholder}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={loading || !inputValue.trim()}
              className="flex-1"
            >
              {loading ? "Adding..." : "Add"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedPlatform(null);
                setInputValue("");
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : availablePlatforms.length > 0 ? (
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5">
          {availablePlatforms.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border hover:border-primary hover:bg-accent transition-colors text-sm"
              >
                <Icon className="w-4 h-4" />
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      {existingLinks.length === 0 && availablePlatforms.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-2">
          No social platforms available
        </p>
      )}
    </div>
  );
}
