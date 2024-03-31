import prisma from "@/prisma";
import { getLikedPrompts } from "@/prisma/queries";
import { getSession } from "@auth0/nextjs-auth0";

type GetLikePromptRequest = {
  postId: string;
  results: number;
  page: number;
};

export const GET = async (req: Request) => {
  // validate input
  const {
    postId: promptId,
    results,
    page,
  }: GetLikePromptRequest = await req.json();

  if (!promptId) {
    return new Response("Missing required fields", { status: 400 });
  }

  // get all liked prompts
  const session = await getSession();
  const userId = session?.user.sub;
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // get liked prompts ids
  let data = await getLikedPrompts(results, page, userId);

  return new Response(JSON.stringify(data), { status: 200 });
};

type PostLikePromptRequest = {
  postId: string;
};

export const POST = async (req: Request) => {
  const session = await getSession();
  const userId = session?.user.sub;
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { postId: promptId }: PostLikePromptRequest = await req.json();
  if (!promptId) {
    return new Response("Missing required fields", { status: 400 });
  }

  // create like
  await prisma.like.create({
    data: {
      postId: promptId,
      userId: userId,
    },
  });
  return new Response("", { status: 200 });
};