import React from "react";
import Sidebar from "./Sidebar"; // Assuming Sidebar is in the components folder

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 w-max ">{children}</main>
    </div>
  );
};

export default PageLayout;
