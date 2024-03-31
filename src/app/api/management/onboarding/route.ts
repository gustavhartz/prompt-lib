// app/api/protected/route.js
import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/prisma";
import { Prisma } from "@prisma/client";
import { logger } from "@/utils/logger";

export type onboardingResponse = {
  statusCode: number;
  message: string;
};
export type onboardingRequest = {
  username: string;
};

export async function POST(request: Request) {
  logger.info("API: Onboarding POST");
  let session = await getSession();

  // Check if the user is authenticated
  if (!session) {
    logger.info("Unauthorized request");
    return Response.json({ message: "Unauthorized", statusCode: 401 });
  }

  let data = await request.json();
  // validate the data format
  if (!data.username) {
    logger.error("Invalid onboarding request");
    return Response.json({ message: "Invalid request", statusCode: 400 });
  }
  try {
    // update the user with the username
    await prisma.user.update({
      where: {
        id: session.user.sub,
      },
      data: {
        username: data.username,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        // The username is already taken
        return Response.json({
          message: "Username already taken",
          statusCode: 409,
        });
      }
    }
    return Response.json({ message: "Internal server error", statusCode: 500 });
  }
  return Response.json({ message: "Onboarding completed", statusCode: 200 });
}
