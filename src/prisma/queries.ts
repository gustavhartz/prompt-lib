import { Prisma, Post } from "@prisma/client";
import prisma from ".";

export type EnrichedPrompt = Post & {
  upVotes: bigint;
  downVotes: bigint;
  reports: bigint;
  author: string;
  isLiked: boolean;
};

type PaginatedQuery<T> = {
  data: T;
  totalCount: BigInt;
};

type CountQueryResult = [{ count: BigInt }];

const baseQuery = (promptId?: string, userId?: string) => {
  return Prisma.sql`select
      p.id,
      p."createdAt",
      p.title,
      p.description,
      p.prompt,
      p.tags,
      voteCounts."upVotes",
      voteCounts."downVotes",
      voteCounts.reports,
      u.username as author,
      ${
        userId
          ? Prisma.sql`case
    when lfilter."postId" is not null then true
    else false
  end`
          : Prisma.sql`false`
      } as "isLiked"
  from
      "Post" p
  left join (
      select
          v."postId",
          COUNT(*) filter (
          where v."value" = 'UPVOTE') as "upVotes",
          COUNT(*) filter (
          where v."value" = 'DOWNVOTE') as "downVotes",
          COUNT(*) filter (
          where v."value" = 'REPORT') as reports
      from
          "Vote" v
      ${promptId ? Prisma.sql`where v."postId" = ${promptId}` : Prisma.empty}
      group by
          v."postId"
    ) as voteCounts on
      voteCounts."postId" = p.id
  left join "User" u on
      u.id = p."authorId"
    ${
      userId
        ? Prisma.sql`left join (
      select
        l."postId",
        l."userId",
        l."createdAt"
      from
        "Like" l
      where
        l."userId" = ${userId}) lfilter on
      lfilter."postId" = p.id`
        : Prisma.empty
    }
  ${promptId ? Prisma.sql`where p.id = ${promptId}` : Prisma.empty}`;
};

const getPromptsQuery = (results = 20, page = 0, userId?: string) => {
  if (results > 100) {
    results = 100;
  }
  const offset = page * results;
  return Prisma.sql`
  ${baseQuery(undefined, userId)}
  order by
    voteCounts."upVotes" desc,
    p."createdAt" desc
  limit ${results} offset ${offset}
  `;
};

const getPromptQuery = (promptId: string, userId?: string) => {
  return Prisma.sql`
  ${baseQuery(promptId, userId)}
  `;
};

const searchPromptsQuery = (
  results = 20,
  page = 0,
  searchQuery: string,
  userId?: string,
) => {
  if (results > 100) {
    results = 100;
  }
  const offset = page * results;
  return Prisma.sql`
  ${baseQuery(undefined, userId)}
  where p.title ILIKE ${searchQuery} OR p.description ILIKE ${searchQuery} OR p.prompt ILIKE ${searchQuery}
  order by
    voteCounts."upVotes" desc,
    p."createdAt" desc
  limit ${results} offset ${offset}
  `;
};

const getLikedPromptsQuery = (results = 20, page = 0, userId: string) => {
  if (results > 100) {
    results = 100;
  }
  const offset = page * results;
  return Prisma.sql`
  ${baseQuery(undefined, userId)}
  where lfilter."userId" = ${userId}
  order by
  lfilter."createdAt" desc
  limit ${results} offset ${offset}
  `;
};

export const getPrompts = async (
  results = 20,
  page = 0,
  userId = "",
): Promise<PaginatedQuery<EnrichedPrompt[]>> => {
  const queryData = getPromptsQuery(results, page, userId);
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
  userId?: string,
): Promise<EnrichedPrompt[]> => {
  const query = getPromptQuery(promptId, userId);
  const prompts = (await prisma.$queryRaw(query, promptId)) as EnrichedPrompt[];
  return prompts;
};

export const searchPrompts = async (
  results = 20,
  page = 0,
  searchQuery: string,
  userId?: string,
): Promise<PaginatedQuery<EnrichedPrompt[]>> => {
  const queryData = searchPromptsQuery(results, page, searchQuery, userId);
  const queryCount = Prisma.sql`SELECT COUNT(*) FROM "Post" p where p.title ILIKE ${searchQuery} OR p.description ILIKE ${searchQuery} OR p.prompt ILIKE ${searchQuery}`;
  console.log(queryData.statement);
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

export const getLikedPrompts = async (
  results = 20,
  page = 0,
  userId: string,
): Promise<PaginatedQuery<EnrichedPrompt[]>> => {
  const queryData = getLikedPromptsQuery(results, page, userId);
  const queryCount = Prisma.sql`
select
	COUNT(id)
from
	"Post" p
left join "Like" l on
	l."postId" = p.id
where
	l."userId" = ${userId}  
  `;
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
