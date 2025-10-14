import { faker } from "@faker-js/faker";
import { prisma } from "../../../services/prismaClient.js";

const categoryIds = [
  "cmggucl6p0000o3amqwxfut73",
  "cmggucl6p0001o3amdumt9igq",
  "cmggucl6p0002o3am8jmnrkb2",
  "cmggucl6r0003o3am8tbcmp60",
  "cmggucl6r0004o3am4w77px0a",
  "cmggucl6r0005o3amwgmmvw77",
];

const category = faker.helpers.arrayElement([
  "culture",
  "fashion",
  "coding",
  "style",
  "travel",
  "food",
]);

export async function addPostsToDB(count: number = 10) {
  try {
    // fetch all tags from DB to randomly attach them
    const allTags = await prisma.tag.findMany();
    const tagIds = allTags.map((tag: any) => tag.id);

    for (let i = 0; i < count; i++) {
      const title = faker.lorem.words(4);
      const desc = faker.lorem.words(15);
      const slug = faker.helpers.slugify(title.toLowerCase());
      const categoryId = faker.helpers.arrayElement(categoryIds);
      const views = faker.number.int({ min: 5, max: 100 });

      // pick some random tags
      const chosenTagIds = faker.helpers.arrayElements(tagIds, {
        min: 1,
        max: 3,
      });

      await prisma.post.create({
        data: {
          title,
          desc,
          slug,
          html: "",
          delta: "",
          img: `https://picsum.photos/seed/${category}-${i}/800/600`,
          categoryId,
          userEmail: "mostafafikry97@gmail.com",
          tags: {
            connect: chosenTagIds.map((id) => ({ id })),
          },
          views,
        },
      });
    }

    console.log(`✅ Successfully added ${count} fake posts!`);
  } catch (error) {
    console.error("❌ Error seeding posts:", error);
  }
}
