import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "./auth";
import { db } from "./db";

const f = createUploadthing();

export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();

      if (!session?.user?.id) {
        throw new Error("Unauthorized");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Update user's avatarUrl in database
      await db.user.update({
        where: { id: metadata.userId },
        data: { avatarUrl: file.ufsUrl },
      });

      return { url: file.ufsUrl };
    }),

  backgroundImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();

      if (!session?.user?.id) {
        throw new Error("Unauthorized");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.user.update({
        where: { id: metadata.userId },
        data: { backgroundUrl: file.ufsUrl },
      });

      return { url: file.ufsUrl };
    }),

  linkImage: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();

      if (!session?.user?.id) {
        throw new Error("Unauthorized");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),

  cursorImage: f({ image: { maxFileSize: "512KB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();

      if (!session?.user?.id) {
        throw new Error("Unauthorized");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.user.update({
        where: { id: metadata.userId },
        data: { cursorUrl: file.ufsUrl },
      });

      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
