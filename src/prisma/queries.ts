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

export const getTopPrompts = async (
  results = 20,
  page = 0,
  userId = "",
): Promise<TopPosts[]> => {
  const query = Prisma.sql`SELECT 
  p.id,
  p."createdAt",
  p.title,
  p.description,
  p.prompt,
  p.tags,
  voteCounts."upVotes",
  voteCounts."downVotes",
  voteCounts.reports,
  u.username,
  userVote.value AS userVoteValue,
  COALESCE(userLike."postId", 'false') AS userLiked
  FROM 
  "Post" p
  LEFT JOIN (
  SELECT 
      v."postId",
      COUNT(*) FILTER (WHERE v."value" = 'UPVOTE') AS "upVotes",
      COUNT(*) FILTER (WHERE v."value" = 'DOWNVOTE') AS "downVotes",
      COUNT(*) FILTER (WHERE v."value" = 'REPORT') AS reports
  FROM 
      "Vote" v   
  GROUP BY 
      v."postId"
  ) AS voteCounts ON voteCounts."postId" = p.id
  LEFT JOIN "User" u ON u.id = p."authorId"
  LEFT JOIN (
  SELECT "postId", "value" 
  FROM "Vote" 
  WHERE "userId" = ${userId}
  ) AS userVote ON userVote."postId" = p.id
  LEFT JOIN (
  SELECT "postId" 
  FROM "Like" 
  WHERE "userId" = ${userId}
  ) AS userLike ON userLike."postId" = p.id 
  ORDER BY 
  voteCounts."upVotes" DESC, 
  p."createdAt" DESC
  LIMIT ${results} OFFSET ${page} * ${results}
  `;
  const prompts = (await prisma.$queryRaw(
    query,
    results,
    page,
    userId,
  )) as TopPosts[];
  return prompts;
};
