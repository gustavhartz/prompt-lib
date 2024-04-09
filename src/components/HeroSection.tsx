// components/HeroSection.tsx
import React from "react";

interface HeroSectionProps {
  title: string;
  description: string;
  children?: React.ReactNode; // For additional content like search bar or buttons
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-200 to-blue-500 animate-gradient-x p-12 text-center rounded-lg shadow-md overflow-hidden">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
        {title}
      </h1>
      <p className="text-white text-opacity-80 mb-6">{description}</p>
      {children}
    </div>
  );
};

export default HeroSection;
