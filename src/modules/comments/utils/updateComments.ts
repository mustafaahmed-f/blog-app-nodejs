import { prisma } from "../../../services/prismaClient.js";

export async function updateComments() {
  const comments = await prisma.comment.findMany();

  await Promise.all(
    comments.map((item: any, i: number) => {
      return prisma.comment.update({
        where: { id: item.id },
        data: {
          createdAt: new Date(Date.now() + i * 1000),
        },
      });
    })
  );

  console.log(`✅ Updated ${comments.length} fake comments`);
}
