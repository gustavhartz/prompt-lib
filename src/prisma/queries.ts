import { Prisma, Post, VoteType } from "@prisma/client";
import prisma from ".";

export type EnrichedPrompt = Post & {
  upVotes: bigint;
  downVotes: bigint;
  reports: bigint;
  author: string;
  userVote?: VoteType;
  isFavorite?: boolean;
};

type PaginatedQuery<T> = {
  data: T;
  totalCount: BigInt;
};

type CountQueryResult = [{ count: BigInt }];

export const getPrompts = async (
  results = 20,
  page = 0,
): Promise<PaginatedQuery<EnrichedPrompt[]>> => {
  if (results > 100) {
    results = 100;
  }
  const offset = page * results;
  const queryData = Prisma.sql`SELECT 
  p.id,
  p."createdAt",
  p.title,
  p.description,
  p.prompt,
  p.tags,
  voteCounts."upVotes",
  voteCounts."downVotes",
  voteCounts.reports,
  u.username as author
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
  LIMIT ${results} OFFSET ${offset}
  `;
  const queryCount = Prisma.sql`SELECT COUNT(id) FROM "Post"`;
  const [prompts, totalCount]: [EnrichedPrompt[], CountQueryResult] =
    await prisma.$transaction([
      prisma.$queryRaw(queryData, results, page),
      prisma.$queryRaw(queryCount),
    ]);
  return {
    data: prompts,
    totalCount: totalCount[0].count,
  };
};

export const getPrompt = async (
  promptId: string,
): Promise<EnrichedPrompt[]> => {
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
  u.username as author
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
  const prompts = (await prisma.$queryRaw(query, promptId)) as EnrichedPrompt[];
  return prompts;
};

export const searchPrompts = async (
  results = 20,
  page = 0,
  searchQuery: string,
): Promise<PaginatedQuery<EnrichedPrompt[]>> => {
  if (results > 100) {
    results = 100;
  }
  const queryData = Prisma.sql`SELECT 
  p.id,
  p."createdAt",
  p.title,
  p.description,
  p.prompt,
  p.tags,
  voteCounts."upVotes",
  voteCounts."downVotes",
  voteCounts.reports,
  u.username as author
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

  const queryCount = Prisma.sql`SELECT COUNT(*) FROM "Post" where p.title ILIKE ${searchQuery} OR p.description ILIKE ${searchQuery} OR p.prompt ILIKE ${searchQuery}`;

  const [prompts, totalCount]: [EnrichedPrompt[], CountQueryResult] =
    await prisma.$transaction([
      prisma.$queryRaw(queryData, results, page),
      prisma.$queryRaw(queryCount),
    ]);

  return {
    data: prompts,
    totalCount: totalCount[0].count,
  };
};
