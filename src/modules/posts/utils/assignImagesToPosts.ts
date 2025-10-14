import { prisma } from "../../../services/prismaClient.js";

export async function assignRandomImages() {
  try {
    // Fetch all posts
    const posts = await prisma.post.findMany();

    // Loop through posts and update each with a random image URL
    await Promise.all(
      posts.map((post: any, index: number) =>
        prisma.post.update({
          where: { id: post.id },
          data: {
            img: `https://picsum.photos/seed/${index + 1}/600/400`,
          },
        })
      )
    );

    console.log("✅ All posts updated with random images!");
  } catch (error) {
    console.error("❌ Error updating posts:", error);
  } finally {
    await prisma.$disconnect();
  }
}
