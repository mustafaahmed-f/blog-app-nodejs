import { faker } from "@faker-js/faker";
import { prisma } from "../../../services/prismaClient.js";

const userEmail = "mostafa@gmail.com";
const postSlug = "Post1";

export async function addCommentsToDB(count: number) {
  const commentsData = Array.from({ length: count }).map(() => {
    return {
      desc: faker.lorem.words({ min: 1, max: 10 }),
      userEmail,
      postSlug,
    };
  });

  // Insert all in bulk
  await prisma.comment.createMany({
    data: commentsData,
  });

  console.log(`✅ Added ${count} fake comments`);
}
