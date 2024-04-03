// components/PromptMetadata.tsx
import React from "react";
import { formatDistanceToNow } from "date-fns";

interface PromptMetadataProps {
  author: string;
  createdAt: Date;
  tags: string[];
}

const PromptMetadata: React.FC<PromptMetadataProps> = ({
  author,
  createdAt,
  tags,
}) => {
  return (
    <div className="flex justify-between items-start">
      <span className="text-xs text-gray-500">
        Author: {author} | {formatDistanceToNow(createdAt)} ago
      </span>
      <div className="flex overflow-x-auto gap-1">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="font-semibold inline-block py-1 px-2 uppercase rounded text-blue-600 bg-blue-200"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PromptMetadata;
