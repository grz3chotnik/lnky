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
import { GripVertical, ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing-client";

interface Link {
  id: string;
  title: string;
  url: string;
  imageUrl: string | null;
  active: boolean;
  order: number;
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

  const { startUpload } = useUploadThing("linkImage", {
    onClientUploadComplete: async (res) => {
      if (res?.[0]?.url) {
        // Update the link with the new image URL
        await fetch(`/api/links/${link.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: res[0].url }),
        });
        onImageUpdate(link.id, res[0].url);
      }
      setUploading(false);
    },
    onUploadError: () => {
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
    await fetch(`/api/links/${link.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: null }),
    });
    onImageUpdate(link.id, null);
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

      {/* Image thumbnail or upload button */}
      <div className="relative">
        {link.imageUrl ? (
          <div className="relative w-10 h-10 rounded overflow-hidden group">
            <Image
              src={link.imageUrl}
              alt=""
              fill
              className="object-cover"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
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
      setLinks((prev) =>
        prev.map((l) => (l.id === linkId ? { ...l, active: !currentActive } : l))
      );
      router.refresh();
    } catch (error) {
      console.error("Failed to toggle link:", error);
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
      } catch (error) {
        console.error("Failed to reorder links:", error);
        setLinks(initialLinks);
      }
    }
  }

  if (!mounted) {
    return (
      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className={`flex items-center gap-2 p-3 border rounded-lg bg-card ${
              !link.active ? "opacity-50" : ""
            }`}
          >
            <div className="text-muted-foreground">
              <GripVertical className="w-5 h-5" />
            </div>
            <div className="w-10 h-10 rounded border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <ImagePlus className="w-4 h-4 text-muted-foreground" />
            </div>
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
        ))}
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
