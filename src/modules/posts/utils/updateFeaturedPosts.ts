import { prisma } from "../../../services/prismaClient.js";
import { redisClientInstance } from "../../../services/redisClient.js";
import { handlePrismaError } from "../../../utils/helperMethods/handlePrismaError.js";
import { featuredPostsSetName } from "./featuredPostsSet.js";

export async function updateFeaturedPosts(currentPost: any) {
  try {
    const redisClient = redisClientInstance();

    // Get the lowest-scoring (least viewed) post in the featured set
    const lowestPost = await redisClient.zRangeWithScores(
      featuredPostsSetName,
      0,
      0
    );

    // If no posts yet, just add this one
    if (!lowestPost.length) {
      await redisClient.zAdd(featuredPostsSetName, {
        score: currentPost.views,
        value: currentPost.id,
      });
      return { success: true };
    }

    const { score: lowestScore, value: lowestPostId } = lowestPost[0];

    // Compare and replace if currentPost has higher views
    if (currentPost.views > lowestScore) {
      await redisClient.zRem(featuredPostsSetName, lowestPostId);
      await redisClient.zAdd(featuredPostsSetName, {
        score: currentPost.views,
        value: currentPost.id,
      });
    }

    return { success: true };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
