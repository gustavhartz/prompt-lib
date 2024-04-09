import React from "react";
import PageLayout from "../../components/PageLayout"; // Adjust the import path as needed
import HeroSection from "../../components/HeroSection"; // Assuming you have a HeroSection component

const BlockedPage = () => {
  return (
    <PageLayout>
      <HeroSection
        title="Rate Limit Exceeded"
        description="Oops! It looks like you've hit our rate limits."
      >
        <div className="mt-4 text-center">
          <p className="text-white text-opacity-90 mb-6">
            We understand your enthusiasm, but we have to ensure fair usage for
            all our users.
          </p>
          <p className="text-white text-opacity-90 mb-6">
            Please wait a while before attempting new actions. This helps us
            serve everyone better.
          </p>
          <a
            href="/"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Return Home
          </a>
        </div>
      </HeroSection>
    </PageLayout>
  );
};

export default BlockedPage;
