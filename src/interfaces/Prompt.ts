// interfaces/Prompt.ts
export interface Prompt {
  id: number;
  rank: number;
  title: string;
  description: string;
  tags: string[];
  upVotes: number;
  downVotes: number;
  userVote: number; // 1 for upvote, -1 for downvote, 0 for no vote
  isFavorite: boolean;
  author: string;
}
