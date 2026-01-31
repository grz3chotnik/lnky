"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Dialog({ children, ...props }: React.ComponentProps<typeof BaseDialog.Root>) {
  return (
    <BaseDialog.Root data-slot="dialog" {...props}>
      {children}
    </BaseDialog.Root>
  );
}

function DialogTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Trigger>) {
  return (
    <BaseDialog.Trigger
      data-slot="dialog-trigger"
      className={cn(className)}
      {...props}
    />
  );
}

function DialogPortal({ children }: { children: React.ReactNode }) {
  return <BaseDialog.Portal data-slot="dialog-portal">{children}</BaseDialog.Portal>;
}

function DialogClose({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Close>) {
  return (
    <BaseDialog.Close
      data-slot="dialog-close"
      className={cn(className)}
      {...props}
    />
  );
}

function DialogBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Backdrop>) {
  return (
    <BaseDialog.Backdrop
      data-slot="dialog-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 transition-opacity data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof BaseDialog.Popup> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogBackdrop />
      <BaseDialog.Popup
        data-slot="dialog-content"
        className={cn(
          "bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg outline-none sm:max-w-lg",
          "data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 duration-200",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <BaseDialog.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </BaseDialog.Close>
        )}
      </BaseDialog.Popup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogBackdrop,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
