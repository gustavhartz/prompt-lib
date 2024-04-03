import React from "react";
import Link from "next/link";
import PromptCopyAction from "./PromptCopyAction";

interface PromptContentProps {
  title: string;
  description: string;
  prompt?: string; // Optional
  link?: string; // Optional
}

const PromptContent: React.FC<PromptContentProps> = ({
  title,
  description,
  prompt,
  link,
}) => {
  const content = (
    <>
      <h3 className="text-xl font-semibold break-words text-blue-600">
        {title}
      </h3>
      <p className="text-gray-600 mt-2">{description}</p>
      {prompt && (
        <div className="px-6 py-4 bg-blue-50 text-gray-800">
          <pre className="whitespace-pre-wrap">{prompt}</pre>
          <PromptCopyAction prompt={prompt} />
        </div>
      )}
    </>
  );

  // If `link` prop is provided, wrap the content in a clickable element
  return link ? (
    <Link href={link} passHref>
      <div className="block hover:bg-gray-50 -m-4 p-4">{content}</div>
    </Link>
  ) : (
    <div>{content}</div>
  );
};

export default PromptContent;
