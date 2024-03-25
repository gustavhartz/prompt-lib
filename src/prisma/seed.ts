import { PrismaClient, VoteType } from "@prisma/client";

// Random text generator
function randomText(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const prisma = new PrismaClient();

async function main() {
  // Generate 3 users
  await prisma.user.createMany({
    data: [...Array(3)].map(() => ({
      // Corrected from Array.from({ length: 3 }) for consistency
      username: randomText(10),
    })),
    skipDuplicates: true, // Skip if duplicate usernames exist (optional)
  });

  const users = await prisma.user.findMany();

  // Create posts for each user
  const posts = await Promise.all(
    users.map((user) =>
      prisma.post.create({
        data: {
          title: "Sample Post Title",
          description: "This is a sample post description",
          prompt: "Sample prompt for the post",
          tags: ["tag1", "tag2"],
          author: { connect: { id: user.id } },
        },
      }),
    ),
  );
  // Create a vote for each post by the post's author
  await Promise.all(
    posts.map((post) =>
      prisma.vote.create({
        data: {
          user: { connect: { id: post.authorId } },
          post: { connect: { id: post.id } },
          value: VoteType.UPVOTE,
        },
      }),
    ),
  );

  // Create a like for each post by a random user
  await Promise.all(
    posts.map((post) => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      return prisma.like.create({
        data: {
          user: { connect: { id: randomUser.id } },
          post: { connect: { id: post.id } },
        },
      });
    }),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
