import { prisma } from "../../../services/prismaClient.js";
import { redisClientInstance } from "../../../services/redisClient.js";
import { featuredPostsSetName } from "./featuredPostsSet.js";

export async function addFeaturedPostsToRedis() {
  try {
    const posts = await prisma.post.findMany({});
    const redis = redisClientInstance();

    await Promise.all(
      posts.map((post) => {
        return redis.zAdd(featuredPostsSetName, [
          {
            value: post.id.toString(),
            score: post.views,
          },
        ]);
      })
    );

    const sortedViews = posts
      .map((post) => post.id.toString())
      .sort((a, b) => parseInt(b) - parseInt(a));
    console.log("Sorted views:", sortedViews);

    await redis.zRemRangeByRank(featuredPostsSetName, 0, -11);

    console.log("✅ Added featured posts to Redis");
  } catch (error) {
    console.log(error);
  }
}
