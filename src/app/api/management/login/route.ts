import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

import prisma from "@/prisma";
export async function GET() {
  let session = await getSession();
  if (session) {
    await prisma.user.upsert({
      where: {
        id: session.user.sub,
      },
      update: {
        lastLogin: new Date(),
      },
      create: {
        id: session.user.sub,
        lastLogin: new Date(),
      },
    });
  }
  redirect("/");
}
