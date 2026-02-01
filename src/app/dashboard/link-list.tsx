"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImagePlus, X, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing-client";
import { getPlatformById } from "@/lib/social-platforms";
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

interface Link {
  id: string;
  title: string;
  url: string;
  imageUrl: string | null;
  active: boolean;
  order: number;
  type: string;
  platform: string | null;
}

interface LinkListProps {
  links: Link[];
}

interface SortableLinkItemProps {
  link: Link;
  onDelete: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
  onImageUpdate: (id: string, imageUrl: string | null) => void;
  isDeleting: boolean;
}

function SortableLinkItem({
  link,
  onDelete,
  onToggle,
  onImageUpdate,
  isDeleting,
}: SortableLinkItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const platform = link.platform ? getPlatformById(link.platform) : null;
  const isSocial = link.type === "social" && platform;

  const { startUpload } = useUploadThing("linkImage", {
    onClientUploadComplete: async (res) => {
      if (res?.[0]?.url) {
        await fetch(`/api/links/${link.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: res[0].url }),
        });
        onImageUpdate(link.id, res[0].url);
        toast.success("Link image uploaded");
      }
      setUploading(false);
    },
    onUploadError: (err) => {
      toast.error(err.message || "Failed to upload image");
      setUploading(false);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await startUpload([file]);
  };

  const handleRemoveImage = async () => {
    try {
      await fetch(`/api/links/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: null }),
      });
      onImageUpdate(link.id, null);
      toast.success("Link image removed");
    } catch {
      toast.error("Failed to remove image");
    }
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 border rounded-lg bg-card ${
        !link.active ? "opacity-50" : ""
      } ${isDragging ? "opacity-70 shadow-lg z-50" : ""}`}
    >
      <button
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {/* Icon/Image section */}
      <div className="relative">
        {link.imageUrl ? (
          // Custom image (for both regular and social links)
          <AlertDialog>
            <div className="relative w-10 h-10 rounded overflow-hidden group">
              <Image
                src={link.imageUrl}
                alt=""
                fill
                className="object-cover"
              />
              <AlertDialogTrigger className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <X className="w-4 h-4 text-white" />
              </AlertDialogTrigger>
            </div>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove image?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove the custom image from this link.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRemoveImage}>
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : isSocial ? (
          // Social platform icon (clickable to upload)
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              (() => {
                const Icon = platform.icon;
                return <Icon className="w-5 h-5" />;
              })()
            )}
          </button>
        ) : (
          // Upload button for regular links
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-10 h-10 rounded border-2 border-dashed border-muted-foreground/30 hover:border-primary flex items-center justify-center transition-colors"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <ImagePlus className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="flex-1 min-w-0 mr-2">
        <p className="font-medium truncate">{link.title}</p>
        <p className="text-sm text-muted-foreground truncate">{link.url}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggle(link.id, link.active)}
        >
          {link.active ? "Hide" : "Show"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(link.id)}
          disabled={isDeleting}
          className="text-destructive hover:text-destructive"
        >
          {isDeleting ? "..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}

export function LinkList({ links: initialLinks }: LinkListProps) {
  const router = useRouter();
  const [links, setLinks] = useState(initialLinks);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDelete(linkId: string) {
    setDeletingId(linkId);
    try {
      const res = await fetch(`/api/links/${linkId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLinks((prev) => prev.filter((l) => l.id !== linkId));
        router.refresh();
      }
    } catch {
      // Failed to delete
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
      setLinks((prev) =>
        prev.map((l) => (l.id === linkId ? { ...l, active: !currentActive } : l))
      );
      router.refresh();
    } catch {
      // Failed to toggle
    }
  }

  function handleImageUpdate(linkId: string, imageUrl: string | null) {
    setLinks((prev) =>
      prev.map((l) => (l.id === linkId ? { ...l, imageUrl } : l))
    );
    router.refresh();
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over.id);
      const newLinks = arrayMove(links, oldIndex, newIndex);
      setLinks(newLinks);
      const reorderedIds = newLinks.map((l) => l.id);
      try {
        await fetch("/api/links/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ linkIds: reorderedIds }),
        });
        router.refresh();
      } catch {
        setLinks(initialLinks);
      }
    }
  }

  if (!mounted) {
    return (
      <div className="space-y-3">
        {links.map((link) => {
          const platform = link.platform ? getPlatformById(link.platform) : null;
          const isSocial = link.type === "social" && platform;
          return (
            <div
              key={link.id}
              className={`flex items-center gap-2 p-3 border rounded-lg bg-card ${
                !link.active ? "opacity-50" : ""
              }`}
            >
              <div className="text-muted-foreground">
                <GripVertical className="w-5 h-5" />
              </div>
              {link.imageUrl ? (
                <div className="relative w-10 h-10 rounded overflow-hidden">
                  <Image
                    src={link.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              ) : isSocial ? (
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  {(() => {
                    const Icon = platform.icon;
                    return <Icon className="w-5 h-5" />;
                  })()}
                </div>
              ) : (
                <div className="w-10 h-10 rounded border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                  <ImagePlus className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0 mr-2">
                <p className="font-medium truncate">{link.title}</p>
                <p className="text-sm text-muted-foreground truncate">{link.url}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  {link.active ? "Hide" : "Show"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {links.map((link) => (
            <SortableLinkItem
              key={link.id}
              link={link}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onImageUpdate={handleImageUpdate}
              isDeleting={deletingId === link.id}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
