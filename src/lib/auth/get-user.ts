import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db/prisma";

export async function getUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}
