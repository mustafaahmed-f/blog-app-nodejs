import { faker } from "@faker-js/faker";
import { prisma } from "../../../services/prismaClient.js";

const categoryIds = [
  "0604398e-89c1-11f0-b2e4-8e549a0925b3",
  "06044440-89c1-11f0-b2e4-8e549a0925b3",
  "cbbd1c9e-89c0-11f0-b2e4-8e549a0925b3",
  "d3b06665-85a4-11f0-8ca3-ea9210427500",
  "e484b349-89c0-11f0-b2e4-8e549a0925b3",
  "e484bf8b-89c0-11f0-b2e4-8e549a0925b3",
];

export async function addPostsToDB(count: number = 10) {
  try {
    // fetch all tags from DB to randomly attach them
    const allTags = await prisma.tag.findMany();
    const tagIds = allTags.map((tag) => tag.id);

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
          img: faker.image.urlLoremFlickr({ category: "nature" }),
          categoryId,
          userEmail: "mostafa@gmail.com",
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
