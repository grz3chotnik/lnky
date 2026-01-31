"use client";

import { useEffect } from "react";

interface TrackViewProps {
  username: string;
}

export function TrackView({ username }: TrackViewProps) {
  useEffect(() => {
    // Track the view after a short delay to avoid counting refreshes
    const timer = setTimeout(() => {
      fetch(`/api/views/${username}`, { method: "POST" }).catch(() => {
        // Silently fail - views are not critical
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [username]);

  return null;
}
