"use client";

import PageLayout from "@/components/PageLayout";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function ProfileClient() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <PageLayout>
      {user && (
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )}
      {!user && <div>Not logged in</div>}
    </PageLayout>
  );
}
