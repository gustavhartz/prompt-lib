// Get the top x prompts with pagination
import { Prisma, Post, VoteType } from "@prisma/client";
import prisma from ".";

export type Prompts = Post & {
  upVotes: number;
  downVotes: number;
  author: string;
};

export const getPrompts = async (
  results = 20,
  page = 0,
): Promise<Prompts[]> => {
  if (results > 100) {
    throw new Error("Results must be less than or equal 100");
  }
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
  u.username
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
  ORDER BY 
  voteCounts."upVotes" DESC, 
  p."createdAt" DESC
  LIMIT ${results} OFFSET ${page} * ${results}
  `;
  const prompts = (await prisma.$queryRaw(query, results, page)) as Prompts[];
  return prompts;
};

export const getPrompt = async (promptId: string): Promise<Prompts[]> => {
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
  u.username
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
  WHERE v."postId" = ${promptId}   
  GROUP BY 
      v."postId"
  ) AS voteCounts ON voteCounts."postId" = p.id
  LEFT JOIN "User" u ON u.id = p."authorId"
  WHERE p.id = ${promptId}
  `;
  const prompts = (await prisma.$queryRaw(query, promptId)) as Prompts[];
  return prompts;
};

export const getLikedPrompts = async (
  results = 20,
  page = 0,
  userId: string,
): Promise<Prompts[]> => {
  if (results > 100) {
    throw new Error("Results must be less than or equal 100");
  }
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
  u.username
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
  where p.id in (select "postId" from "Like" l where l."userId"=${userId})
  ORDER BY 
  voteCounts."upVotes" DESC, 
  p."createdAt" DESC
  LIMIT ${results} OFFSET ${page} * ${results}
  `;
  const prompts = (await prisma.$queryRaw(query, results, page)) as Prompts[];
  return prompts;
};

export const searchPrompts = async (
  results = 20,
  page = 0,
  searchQuery: string,
): Promise<Prompts[]> => {
  if (results > 100) {
    throw new Error("Results must be less than or equal 100");
  }
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
  u.username
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
  where p.title ILIKE ${searchQuery} OR p.description ILIKE ${searchQuery} OR p.prompt ILIKE ${searchQuery}
  ORDER BY 
  voteCounts."upVotes" DESC, 
  p."createdAt" DESC
  LIMIT ${results} OFFSET ${page} * ${results}
  `;
  const prompts = (await prisma.$queryRaw(query, results, page)) as Prompts[];
  return prompts;
};
