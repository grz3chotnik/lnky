"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface LinkFormProps {
  userId: string;
  linkCount: number;
}

export function LinkForm({ userId, linkCount }: LinkFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setError("");

    const formData = new FormData(form);
    const title = formData.get("title") as string;
    let url = formData.get("url") as string;

    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          url,
          order: linkCount,
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

      form.reset();
      router.refresh();
    } catch (err) {
      console.error("Link form error:", err);
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-2.5 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          name="title"
          placeholder="Title"
          required
          className="sm:flex-1"
        />
        <Input
          name="url"
          type="text"
          placeholder="URL"
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
