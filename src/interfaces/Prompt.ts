// interfaces/Prompt.ts
import { VoteType } from "@prisma/client";
export interface Prompt {
  id: string;
  title: string;
  description: string;
  tags: string[];
  upVotes: number;
  downVotes: number;
  userVote: VoteType; // 1 for upvote, -1 for downvote, 0 for no vote
  isFavorite: boolean;
  author: string;
}
