// Get the top x prompts with pagination
import { Prisma, Post } from "@prisma/client";
import prisma from ".";

type TopPosts = Post & {
  upvotes: number;
  downvotes: number;
  reports: number;
};

export const topPrompts = (results = 20, page = 1) => Prisma.sql`SELECT 
p.*,
v.upvotes,
v.downvotes,
v.reports
FROM 
"Post" p
LEFT JOIN (
SELECT 
    v2."postId",
    COUNT(*) FILTER (WHERE v2."value" = 'UPVOTE') AS upvotes,
    COUNT(*) FILTER (WHERE v2."value" = 'DOWNVOTE') AS downvotes,
    COUNT(*) FILTER (WHERE v2."value" = 'REPORT') AS reports
FROM 
    "Vote" v2    
GROUP BY 
    v2."postId"
) v ON p."id" = v."postId"
ORDER BY v.upvotes DESC, p."createdAt" DESC
LIMIT ${results} OFFSET ${page * results}`;

export const getTopPrompts = async (
  results = 20,
  page = 0,
): Promise<TopPosts[]> => {
  const prompts = (await prisma.$queryRaw(
    topPrompts(results, page),
  )) as TopPosts[];
  return prompts;
};
