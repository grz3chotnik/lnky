"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// List of user's links with delete functionality

interface Link {
  id: string;
  title: string;
  url: string;
  active: boolean;
}

interface LinkListProps {
  links: Link[];
}

export function LinkList({ links }: LinkListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(linkId: string) {
    setDeletingId(linkId);

    try {
      const res = await fetch(`/api/links/${linkId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh(); // Refresh to update the list
      }
    } catch (error) {
      console.error("Failed to delete link:", error);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggle(linkId: string, currentActive: boolean) {
    try {
      await fetch(`/api/links/${linkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive }),
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to toggle link:", error);
    }
  }

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <div
          key={link.id}
          className={`flex items-center justify-between p-3 border rounded-lg ${
            !link.active ? "opacity-50" : ""
          }`}
        >
          <div className="flex-1 min-w-0 mr-4">
            <p className="font-medium truncate">{link.title}</p>
            <p className="text-sm text-muted-foreground truncate">{link.url}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggle(link.id, link.active)}
            >
              {link.active ? "Hide" : "Show"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(link.id)}
              disabled={deletingId === link.id}
              className="text-destructive hover:text-destructive"
            >
              {deletingId === link.id ? "..." : "Delete"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
