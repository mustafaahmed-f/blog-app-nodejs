import { describe, it, expect, vi, beforeEach } from "vitest";

const {
  checkIdAndUserMock,
  nextMock,
  reqMock,
  resMock,
  JSDOM,
  sanitizeMock,
  uploadToCloudinaryMock,
  removeImgKeysFromRedis,
  removeUploadedImagesMock,
  returnedPost,
  createPostMock,
  uploadPostImagesMock,
} = vi.hoisted(() => ({
  checkIdAndUserMock: vi.fn(),
  nextMock: vi.fn(),
  reqMock: {
    file: { buffer: {} },
    body: {
      draftId: "draft-12345",

      title: "How to Learn RabbitMQ Step by Step",

      categoryId: "cat_tech_backend",

      tags: "RabbitMQ, NodeJS, Messaging, Backend",

      delta: JSON.stringify({
        ops: [
          { insert: "RabbitMQ is a message broker.\n" },
          { insert: "It is used for async communication.\n" },
        ],
      }),

      desc: "A complete beginner-friendly guide to RabbitMQ with Node.js",

      html: `
             <h1>Learn RabbitMQ</h1>
             <p>This is <strong>safe</strong> HTML content.</p>
             <script>alert("xss")</script>
              `,

      deletedIds: JSON.stringify(["temp_img_1", "temp_img_2"]),
    },
  },
  resMock: {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  },
  JSDOM: vi.fn(
    class {
      window: any = {};
      constructor(s: string) {}
    }
  ),
  sanitizeMock: vi.fn().mockReturnValue(""),
  uploadToCloudinaryMock: vi.fn().mockResolvedValue({
    secure_url: "",
    public_id: "",
  }),
  removeUploadedImagesMock: vi.fn().mockResolvedValue({}),
  removeImgKeysFromRedis: vi.fn().mockResolvedValue({}),
  createPostMock: vi.fn().mockResolvedValue({}),
  returnedPost: {
    tags: [
      { id: "tag1", name: "RabbitMQ" },
      { id: "tag2", name: "NodeJS" },
      { id: "tag3", name: "Messaging" },
      { id: "tag4", name: "Backend" },
    ],
    title: "How to Learn RabbitMQ Step by Step",
    categoryId: "cat_tech_backend",
    delta: JSON.stringify({
      ops: [
        { insert: "RabbitMQ is a message broker.\n" },
        { insert: "It is used for async communication.\n" },
      ],
    }),
    desc: "A complete beginner-friendly guide to RabbitMQ with Node.js",
    html: `<h1>Learn RabbitMQ</h1>
         <p>This is <strong>safe</strong> HTML content.</p>
         <script>alert("xss")</script>`,
    draftId: "draft-12345",
    createdAt: new Date(),
    updatedAt: new Date(),
    img: null,
    isEdited: false,
    slug: "rabbitmq-step-by-step",
    img_publicId: null,
    views: 0,
    userEmail: "user@example.com",
  },
  uploadPostImagesMock: vi.fn().mockResolvedValue({}),
}));

//==============================================================================
//==============================================================================

vi.mock("../../../utils/helperMethods/checkIdAndUser.js", () => ({
  checkIdAndUser: checkIdAndUserMock,
}));

vi.mock("jsdom", () => ({
  JSDOM,
}));

vi.mock("dompurify", () => ({
  default: vi.fn().mockReturnValue({
    sanitize: sanitizeMock,
  }),
}));

vi.mock("../../../utils/helperMethods/uploadToCloudinary.js", () => ({
  uploadToCloudinary: uploadToCloudinaryMock,
}));

vi.mock("../utils/removeUploadedImages.js", () => ({
  removeUploadedImages: removeUploadedImagesMock,
}));

vi.mock("../utils/removeImgKeysFromRedis.js", () => ({
  removeImgKeysFromRedis: removeImgKeysFromRedis,
}));

createPostMock.mockResolvedValue(returnedPost);

vi.mock("../../../services/prismaClient.js", () => ({
  prisma: {
    post: {
      create: createPostMock,
    },
  },
}));

vi.mock("../utils/uploadPostImages.js", () => ({
  uploadPostImages: uploadPostImagesMock,
}));

//==============================================================================
//==============================================================================

describe("addPost()", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it.skip("should throw an error if checkIdAndUser threw an error", async () => {});
});
