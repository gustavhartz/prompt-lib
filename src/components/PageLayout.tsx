"use client";
import React from "react";
import Header from "./Header"; // Adjust the import path as necessary
import { useUser } from "@auth0/nextjs-auth0/client";
import LoadingScreen from "./LoadingScreen";
import toast from "react-hot-toast";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    toast.error(error.message);
    return null; // or a more elaborate error handling
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthed={!!user} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default PageLayout;
