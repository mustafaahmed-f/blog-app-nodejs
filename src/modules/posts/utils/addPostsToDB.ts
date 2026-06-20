import { faker } from "@faker-js/faker";
import { prisma } from "../../../services/prismaClient.js";

const categoryIds = [
  "cmqff7kxh0000ns7nr0rsdd0u",
  "cmqff7kxw0001ns7nt1bqbpbf",
  "cmqff7kxw0002ns7noth2vmsr",
  "cmqff7kxx0003ns7nmzw4ddfj",
  "cmqff7kxx0004ns7nrzox1m2s",
  "cmqff7ky40005ns7n8k0s0w7v",
];

// Quill.js Delta format
interface DeltaOp {
  insert?: string;
  attributes?: Record<string, any>;
  delete?: number;
  retain?: number;
}

interface QuillDelta {
  ops: DeltaOp[];
}

const category = faker.helpers.arrayElement([
  "culture",
  "fashion",
  "coding",
  "style",
  "travel",
  "food",
]);

/**
 * Generates a random Quill.js Delta object with formatted content
 */
function generateQuillDelta(): QuillDelta {
  const paragraphs = faker.number.int({ min: 3, max: 6 });
  const ops: DeltaOp[] = [];

  for (let i = 0; i < paragraphs; i++) {
    const sentences = faker.number.int({ min: 2, max: 4 });

    for (let j = 0; j < sentences; j++) {
      const sentence = faker.lorem.sentence();
      const formattingChance = Math.random();

      if (formattingChance < 0.3) {
        // Bold text
        ops.push({
          insert: sentence,
          attributes: { bold: true },
        });
      } else if (formattingChance < 0.5) {
        // Italic text
        ops.push({
          insert: sentence,
          attributes: { italic: true },
        });
      } else if (formattingChance < 0.65) {
        // Bold and Italic
        ops.push({
          insert: sentence,
          attributes: { bold: true, italic: true },
        });
      } else if (formattingChance < 0.8) {
        // Link
        ops.push({
          insert: faker.lorem.words(3),
          attributes: {
            link: faker.internet.url(),
          },
        });
        ops.push({
          insert: " " + faker.lorem.words(2),
        });
      } else {
        // Normal text
        ops.push({
          insert: sentence,
        });
      }

      // Add space between sentences
      ops.push({
        insert: " ",
      });
    }

    // Add paragraph break
    ops.push({
      insert: "\n",
    });
  }

  return { ops };
}

/**
 * Converts Quill Delta format to HTML
 */
function deltaToHtml(delta: QuillDelta): string {
  let html = "";
  let inParagraph = false;

  for (const op of delta.ops) {
    if (op.insert) {
      let text = op.insert;

      // Handle newlines
      if (text.includes("\n")) {
        if (inParagraph) {
          html += "</p>";
          inParagraph = false;
        }
        html += "<p>";
        inParagraph = true;
        text = text.replace(/\n/g, "</p><p>");
        continue;
      }

      if (!inParagraph) {
        html += "<p>";
        inParagraph = true;
      }

      // Apply formatting
      if (op.attributes?.bold) {
        text = `<strong>${text}</strong>`;
      }
      if (op.attributes?.italic) {
        text = `<em>${text}</em>`;
      }
      if (op.attributes?.link) {
        text = `<a href="${op.attributes.link}" target="_blank">${text}</a>`;
      }

      html += text;
    }
  }

  if (inParagraph) {
    html += "</p>";
  }

  return html || "<p>Empty post</p>";
}

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

/**
 * Adds Quill.js-formatted fake posts to the database
 * Generates realistic posts with Delta format and HTML representation
 * @param count - Number of fake posts to create (default: 10)
 * @param userEmail - Email of the user creating the posts (default: "mostafafikry97@gmail.com")
 */
export async function addQuillPostsToDB(
  count: number = 10,
  userEmail: string = "mostafafikry97@gmail.com",
) {
  try {
    // Fetch all tags and categories from DB
    const allTags = await prisma.tag.findMany();
    const tagIds = allTags.map((tag: any) => tag.id);

    const allCategories = await prisma.category.findMany();
    const availableCategoryIds = allCategories.map((cat: any) => cat.id);

    if (availableCategoryIds.length === 0) {
      console.warn(
        "⚠️ No categories found in database. Please create categories first.",
      );
      return;
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      console.warn(
        `⚠️ User with email "${userEmail}" not found. Please create the user first.`,
      );
      return;
    }

    console.log(`📝 Creating ${count} Quill.js-formatted posts...`);

    for (let i = 0; i < count; i++) {
      // Generate unique title and slug
      let title = faker.lorem.words({ min: 3, max: 6 });
      let slug = faker.helpers.slugify(title.toLowerCase());
      let slugExists = true;
      let attempts = 0;

      // Ensure unique slug
      while (slugExists && attempts < 5) {
        const existing = await prisma.post.findUnique({ where: { slug } });
        if (existing) {
          title = faker.lorem.words({ min: 3, max: 6 });
          slug = faker.helpers.slugify(title.toLowerCase());
          attempts++;
        } else {
          slugExists = false;
        }
      }

      const desc = faker.lorem.paragraph();
      const categoryId = faker.helpers.arrayElement(availableCategoryIds);
      const views = faker.number.int({ min: 0, max: 500 });

      // Generate Quill Delta and HTML
      const delta = generateQuillDelta();
      const html = deltaToHtml(delta);

      // Pick random tags
      const chosenTagIds = faker.helpers.arrayElements(tagIds, {
        min: 0,
        max: Math.min(3, tagIds.length),
      });

      await prisma.post.create({
        data: {
          title,
          desc,
          slug,
          html,
          delta: JSON.stringify(delta),
          img: `https://picsum.photos/seed/${category}-quill-${i}/800/600`,
          categoryId,
          userEmail,
          views,
          tags: {
            connect: chosenTagIds.map((id) => ({ id })),
          },
        },
      });
    }

    console.log(
      `✅ Successfully added ${count} Quill.js-formatted fake posts!`,
    );
  } catch (error) {
    console.error("❌ Error seeding Quill posts:", error);
    throw error;
  }
}
