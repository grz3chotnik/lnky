"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing-client";
import { X } from "lucide-react";

interface ProfileImageUploadProps {
  currentImageUrl: string | null;
  username: string;
}

export function ProfileImageUpload({ currentImageUrl, username }: ProfileImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
  const [error, setError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { startUpload, isUploading } = useUploadThing("profileImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) {
        setPreviewUrl(res[0].url);
        router.refresh();
      }
    },
    onUploadError: (err) => {
      setError(err.message || "Upload failed");
      setPreviewUrl(currentImageUrl);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    await startUpload([file]);
    URL.revokeObjectURL(objectUrl);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    setError(null);

    try {
      const res = await fetch("/api/user/avatar", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove");
      setPreviewUrl(null);
      router.refresh();
    } catch {
      setError("Failed to remove image");
    } finally {
      setIsRemoving(false);
    }
  };

  const isLoading = isUploading || isRemoving;

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isLoading}
        className="relative w-14 h-14 rounded-full overflow-hidden bg-muted border-2 border-border hover:border-primary transition-colors cursor-pointer"
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={`${username}'s profile`}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl font-bold text-muted-foreground">
            {username.charAt(0).toUpperCase()}
          </div>
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>

      {previewUrl && !isLoading && (
        <button
          type="button"
          onClick={handleRemove}
          className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="absolute -bottom-5 left-0 right-0 text-xs text-destructive text-center truncate">
          {error}
        </p>
      )}
    </div>
  );
}
