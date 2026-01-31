"use client";

import * as React from "react";
import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import { cn } from "@/lib/utils";
import { Button } from "./button";

function AlertDialog({
  children,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Root>) {
  return (
    <BaseAlertDialog.Root {...props}>
      {children}
    </BaseAlertDialog.Root>
  );
}

function AlertDialogTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Trigger>) {
  return (
    <BaseAlertDialog.Trigger
      className={cn(className)}
      {...props}
    />
  );
}

function AlertDialogPortal({ children }: { children: React.ReactNode }) {
  return <BaseAlertDialog.Portal keepMounted>{children}</BaseAlertDialog.Portal>;
}

function AlertDialogBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Backdrop>) {
  return (
    <BaseAlertDialog.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Popup>) {
  return (
    <AlertDialogPortal>
      <AlertDialogBackdrop />
      <BaseAlertDialog.Popup
        className={cn(
          "bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg outline-none sm:max-w-md",
          "data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 duration-200",
          className
        )}
        {...props}
      >
        {children}
      </BaseAlertDialog.Popup>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Title>) {
  return (
    <BaseAlertDialog.Title
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Description>) {
  return (
    <BaseAlertDialog.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function AlertDialogClose({
  className,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Close>) {
  return (
    <BaseAlertDialog.Close
      className={cn(className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Close>) {
  return (
    <BaseAlertDialog.Close
      render={(closeProps) => (
        <Button variant="destructive" {...closeProps} {...props} className={cn(className)}>
          {children}
        </Button>
      )}
    />
  );
}

function AlertDialogCancel({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseAlertDialog.Close>) {
  return (
    <BaseAlertDialog.Close
      render={(closeProps) => (
        <Button variant="outline" {...closeProps} {...props} className={cn(className)}>
          {children}
        </Button>
      )}
    />
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
  AlertDialogAction,
  AlertDialogCancel,
};
