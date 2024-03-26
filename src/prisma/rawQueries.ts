// Get the top x prompts with pagination
import { Prisma, Post, VoteType } from "@prisma/client";
import prisma from ".";

type TopPosts = Post & {
  upVotes: number;
  downVotes: number;
  reports: number;
  author: string;
  userVote: VoteType;
  isFavorite: boolean;
};

export const topPrompts = (results = 20, page = 1) => Prisma.sql`SELECT 
p.*,
v."upVotes",
v."downVotes",
v.reports,
'Some random author' as author,
'UPVOTE' as "userVote",
true as "isFavorite"
FROM 
"Post" p
LEFT JOIN (
SELECT 
    v2."postId",
    COUNT(*) FILTER (WHERE v2."value" = 'UPVOTE') AS "upVotes",
    COUNT(*) FILTER (WHERE v2."value" = 'DOWNVOTE') AS "downVotes",
    COUNT(*) FILTER (WHERE v2."value" = 'REPORT') AS reports
FROM 
    "Vote" v2    
GROUP BY 
    v2."postId"
) v ON p."id" = v."postId"
ORDER BY v."upVotes" DESC, p."createdAt" DESC
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
