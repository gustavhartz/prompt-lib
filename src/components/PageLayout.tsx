"use client";
import React from "react";
import Sidebar from "./Sidebar"; // Assuming Sidebar is in the components folder
import { useUser } from "@auth0/nextjs-auth0/client";
import LoadingScreen from "./LoadingScreen"; // Assuming LoadingScreen is in the components folder

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const { user, error, isLoading } = useUser();

  // TODO: Style loading and pass user to sidebar

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    console.log(error);
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar isAuthed={!!user} />
      <main className="flex-1 ml-64 p-8 w-max ">{children}</main>
    </div>
  );
};

export default PageLayout;
