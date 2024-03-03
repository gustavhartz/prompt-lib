import React from "react";
import Sidebar from "./Sidebar"; // Assuming Sidebar is in the components folder
import { useUser } from "@auth0/nextjs-auth0/client";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Ensure this import is added

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const { user, error, isLoading } = useUser();

  // TODO: Style loading and pass user to sidebar

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
      </div>
    );
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
