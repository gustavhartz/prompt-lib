import { Post, PrismaClient, VoteType } from "@prisma/client";
import fs from "fs";
const csv = require("csv-parser");

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
      id: randomText(10),
      lastLogin: new Date(),
    })),
    skipDuplicates: true, // Skip if duplicate usernames exist (optional)
  });

  const users = await prisma.user.findMany();

  // Create posts for each user
  // read csv file and create posts
  const results: any = [];
  console.log(process.cwd());
  await new Promise<void>((resolve, reject) => {
    console.log(process.cwd());
    fs.createReadStream("src/prisma/prompts_final.csv")
      .pipe(csv())
      .on("data", (data: any) => {
        results.push(data);
      })
      .on("end", () => {
        console.log("CSV file has been parsed successfully.");
        resolve();
      })
      .on("error", (error: any) => {
        console.error("Error while parsing CSV:", error);
        reject(error);
      });
  });

  let idx = 0;
  let posts: Post[] = [];
  // columns Title	Prompt	Tags	Source	Author	Description	Tags	Json
  for (const record in results) {
    const title = results[idx].Title;
    const prompt = results[idx].Prompt;
    const tags = results[idx].Tags;
    const description = results[idx].Description;
    const tagsArray = tags.split(",").map((tag: string) => tag.trim());

    let p = await prisma.post.create({
      data: {
        title: title,
        prompt: prompt,
        tags: tagsArray,
        authorId: users[0].id,
        description: description,
      },
    });
    posts.push(p);
    idx++;
  }

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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
