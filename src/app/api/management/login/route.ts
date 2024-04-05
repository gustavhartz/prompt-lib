import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { logger } from "@/utils/logger";

import prisma from "@/prisma";
export async function GET() {
  logger.info("API: Management Login GET");
  let session = await getSession();
  if (session) {
    let user = await prisma.user.upsert({
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
    if (!user.username) {
      redirect("/onboarding");
    }
  }
  redirect("/");
}
