import { prisma } from "../../../services/prismaClient.js";

export async function addCateogiresToDB() {
  const categories = [
    {
      slug: "style",
      title: "Style",
      img: "https://img.icons8.com/color/48/clothes.png",
    },
    {
      slug: "fashion",
      title: "Fashion",
      img: "https://img.icons8.com/color/48/hanger.png",
    },
    {
      slug: "food",
      title: "Food",
      img: "https://img.icons8.com/color/48/restaurant.png",
    },
    {
      slug: "travel",
      title: "Travel",
      img: "https://img.icons8.com/color/48/globe.png",
    },
    {
      slug: "culture",
      title: "Culture",
      img: "https://img.icons8.com/color/48/museum.png",
    },
    {
      slug: "coding",
      title: "Coding",
      img: "https://img.icons8.com/color/48/source-code.png",
    },
  ];

  //   for (const category of categories) {
  //     await prisma.category.upsert({
  //       where: { slug: category.slug },
  //       update: {},
  //       create: category,
  //     });
  //   }

  await Promise.all(
    categories.map(async (category) => {
      return prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      });
    })
  );

  console.log("✅ Categories seeded successfully!");
}
