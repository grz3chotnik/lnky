"use client";

import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";

function Popover({
  children,
  ...props
}: React.ComponentProps<typeof BasePopover.Root>) {
  return (
    <BasePopover.Root data-slot="popover" {...props}>
      {children}
    </BasePopover.Root>
  );
}

function PopoverTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BasePopover.Trigger>) {
  return (
    <BasePopover.Trigger
      data-slot="popover-trigger"
      className={cn(className)}
      {...props}
    />
  );
}

function PopoverContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof BasePopover.Popup> & {
  sideOffset?: number;
}) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner sideOffset={sideOffset}>
        <BasePopover.Popup
          data-slot="popover-content"
          className={cn(
            "bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-hidden",
            "data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          {...props}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  );
}

function PopoverTitle({
  className,
  ...props
}: React.ComponentProps<typeof BasePopover.Title>) {
  return (
    <BasePopover.Title
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  );
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<typeof BasePopover.Description>) {
  return (
    <BasePopover.Description
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
};
