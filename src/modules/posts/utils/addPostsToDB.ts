import { faker } from "@faker-js/faker";
import { prisma } from "../../../services/prismaClient.js";

const categoryIds = [
  "cmfk0p6jm0000mscgvvv1t3eb",
  "cmfk0p6jn0001mscg1850zgv3",
  "cmfk0p6jn0002mscgwkwbhgu4",
  "cmfk0p6jn0003mscg65ndln6a",
  "cmfk0p6jo0004mscgwvbdn4an",
  "cmfk0p6jp0005mscglzuqyo6q",
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
          img: faker.image.urlLoremFlickr({ category: "animals" }),
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
