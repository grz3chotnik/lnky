"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing-client";
import { ImageIcon, X, RotateCcw, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/ui/color-picker";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface CustomizationProps {
  currentBackgroundUrl: string | null;
  currentCursorUrl: string | null;
  currentBgColor: string | null;
  currentTextColor: string | null;
  currentAccentColor: string | null;
}

export function Customization({
  currentBackgroundUrl,
  currentCursorUrl,
  currentBgColor,
  currentTextColor,
  currentAccentColor,
}: CustomizationProps) {
  const router = useRouter();

  // Background state
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(currentBackgroundUrl);
  const bgInputRef = useRef<HTMLInputElement>(null);

  // Cursor state
  const [cursorUrl, setCursorUrl] = useState<string | null>(currentCursorUrl);
  const cursorInputRef = useRef<HTMLInputElement>(null);

  // Color state
  const [bgColor, setBgColor] = useState(currentBgColor || "");
  const [textColor, setTextColor] = useState(currentTextColor || "");
  const [accentColor, setAccentColor] = useState(currentAccentColor || "");
  const [savingColors, setSavingColors] = useState(false);

  // Loading states
  const [removingBg, setRemovingBg] = useState(false);
  const [removingCursor, setRemovingCursor] = useState(false);

  const { startUpload: uploadBackground, isUploading: uploadingBg } = useUploadThing("backgroundImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) {
        setBackgroundUrl(res[0].url);
        toast.success("Background image uploaded");
        router.refresh();
      }
    },
    onUploadError: (err) => {
      toast.error(err.message || "Failed to upload background");
      setBackgroundUrl(currentBackgroundUrl);
    },
  });

  const { startUpload: uploadCursor, isUploading: uploadingCursor } = useUploadThing("cursorImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) {
        setCursorUrl(res[0].url);
        toast.success("Cursor image uploaded");
        router.refresh();
      }
    },
    onUploadError: (err) => {
      toast.error(err.message || "Failed to upload cursor");
      setCursorUrl(currentCursorUrl);
    },
  });

  const handleBgSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setBackgroundUrl(objectUrl);
    await uploadBackground([file]);
    URL.revokeObjectURL(objectUrl);
  };

  const handleCursorSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setCursorUrl(objectUrl);
    await uploadCursor([file]);
    URL.revokeObjectURL(objectUrl);
  };

  const removeBackground = async () => {
    setRemovingBg(true);
    try {
      await fetch("/api/user/background", { method: "DELETE" });
      setBackgroundUrl(null);
      toast.success("Background image removed");
      router.refresh();
    } catch {
      toast.error("Failed to remove background");
    } finally {
      setRemovingBg(false);
    }
  };

  const removeCursor = async () => {
    setRemovingCursor(true);
    try {
      await fetch("/api/user/cursor", { method: "DELETE" });
      setCursorUrl(null);
      toast.success("Cursor image removed");
      router.refresh();
    } catch {
      toast.error("Failed to remove cursor");
    } finally {
      setRemovingCursor(false);
    }
  };

  const saveColors = async () => {
    setSavingColors(true);
    try {
      await fetch("/api/user/colors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bgColor: bgColor || null,
          textColor: textColor || null,
          accentColor: accentColor || null,
        }),
      });
      toast.success("Colors saved");
      router.refresh();
    } catch {
      toast.error("Failed to save colors");
    } finally {
      setSavingColors(false);
    }
  };

  const resetColors = async () => {
    setSavingColors(true);
    try {
      await fetch("/api/user/colors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bgColor: null,
          textColor: null,
          accentColor: null,
        }),
      });
      setBgColor("");
      setTextColor("");
      setAccentColor("");
      toast.success("Colors reset");
      router.refresh();
    } catch {
      toast.error("Failed to reset colors");
    } finally {
      setSavingColors(false);
    }
  };

  const hasColorChanges =
    bgColor !== (currentBgColor || "") ||
    textColor !== (currentTextColor || "") ||
    accentColor !== (currentAccentColor || "");

  const hasAnyColors = bgColor || textColor || accentColor || currentBgColor || currentTextColor || currentAccentColor;

  return (
    <div className="space-y-5">
      {/* Colors */}
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-2">
            <ColorPicker value={bgColor} onChange={setBgColor} />
            <Label className="text-xs text-muted-foreground">Background</Label>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ColorPicker value={textColor} onChange={setTextColor} />
            <Label className="text-xs text-muted-foreground">Text</Label>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ColorPicker value={accentColor} onChange={setAccentColor} />
            <Label className="text-xs text-muted-foreground">Accent</Label>
          </div>
        </div>

        {(hasColorChanges || hasAnyColors) && (
          <div className="flex gap-2">
            {hasColorChanges && (
              <Button size="sm" onClick={saveColors} disabled={savingColors} className="flex-1">
                {savingColors ? "Saving..." : "Save colors"}
              </Button>
            )}
            {hasAnyColors && (
              <Button
                size="sm"
                variant="outline"
                onClick={resetColors}
                disabled={savingColors}
                className="gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Background Upload */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => bgInputRef.current?.click()}
            disabled={uploadingBg}
            className="w-14 h-14 rounded-lg overflow-hidden bg-muted border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer flex items-center justify-center"
          >
            {backgroundUrl ? (
              <Image
                src={backgroundUrl}
                alt="Background"
                fill
                className="object-cover"
              />
            ) : (
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
            )}
            {uploadingBg && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </button>
          {backgroundUrl && !uploadingBg && (
            <AlertDialog>
              <AlertDialogTrigger className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 cursor-pointer">
                <X className="w-3 h-3" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove background image?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove your background image.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={removeBackground}>
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Background image</p>
          <p>Upload an image (max 8MB)</p>
        </div>
        <input
          ref={bgInputRef}
          type="file"
          accept="image/*"
          onChange={handleBgSelect}
          className="hidden"
        />
      </div>

      {/* Cursor Upload */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => cursorInputRef.current?.click()}
            disabled={uploadingCursor}
            className="w-14 h-14 rounded-lg overflow-hidden bg-muted border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer flex items-center justify-center"
          >
            {cursorUrl ? (
              <Image
                src={cursorUrl}
                alt="Cursor"
                width={32}
                height={32}
                className="object-contain"
              />
            ) : (
              <MousePointer2 className="w-5 h-5 text-muted-foreground" />
            )}
            {uploadingCursor && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </button>
          {cursorUrl && !uploadingCursor && (
            <AlertDialog>
              <AlertDialogTrigger className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 cursor-pointer">
                <X className="w-3 h-3" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove custom cursor?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove your custom cursor image.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={removeCursor}>
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Custom cursor</p>
          <p>Upload an image (max 512KB, 32x32 recommended)</p>
        </div>
        <input
          ref={cursorInputRef}
          type="file"
          accept="image/png,image/gif,image/webp"
          onChange={handleCursorSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
