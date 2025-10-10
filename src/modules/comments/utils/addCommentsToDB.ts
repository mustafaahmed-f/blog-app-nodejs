import { faker } from "@faker-js/faker";
import { prisma } from "../../../services/prismaClient.js";

const userEmail = "mostafafikry97@gmail.com";
const postSlug = "First-post-after-auth-two-mustafaahmed97";

export async function addCommentsToDB(count: number) {
  const commentsData = Array.from({ length: count }).map((_, i) => {
    return {
      desc: faker.lorem.words({ min: 1, max: 10 }),
      userEmail,
      postSlug,
      createdAt: new Date(Date.now() + i * 1000),
    };
  });

  // Insert all in bulk
  await prisma.comment.createMany({
    data: commentsData,
  });

  console.log(`✅ Added ${count} fake comments`);
}
