// pages/about.tsx
import React from "react";
import PageLayout from "../../components/PageLayout"; // Adjust the import path as necessary

const About = () => {
  return (
    <PageLayout>
      <div className="container mx-auto my-8 p-4 h-full">
        <h1 className="text-xl font-bold mb-4">About Prompt Lib</h1>
        <p className="mb-2">
          {`Prompt Lib is a community-driven platform designed to share and explore creative prompts for AI models and beyond. Our mission is to foster a collaborative environment where anyone can contribute their ideas, learn from others, and enhance their creative workflow.`}
        </p>
        <p className="mb-4">
          {`Whether you're a writer seeking inspiration, a developer exploring AI, or someone passionate about creativity, you're welcome here. Our community thrives on the diverse contributions from members around the world, and we believe that collective wisdom can drive innovation and inspiration.`}
        </p>
        <p>
          {`Interested in contributing? We'd love to have you on board! Check out our `}
          <a
            href="https://github.com/gustavhartz/prompt-lib"
            className="text-blue-500 hover:underline"
          >
            GitHub repository
          </a>
          {` to see how you can get involved, report issues, suggest features, or submit your prompts. Your input is invaluable in making Prompt Lib a richer resource for everyone.`}
        </p>
      </div>
    </PageLayout>
  );
};

export default About;
