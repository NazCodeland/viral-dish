// convex/videos.ts
import { query } from "./_generated/server";

export const getFeed = query({
  args: {},
  handler: async (ctx) => {
    const videos = await ctx.db
      .query("videos")
      .withIndex("by_views")
      .order("desc")
      .take(10);

    const results = await Promise.all(
      videos.map(async (video) => {
        // Join with users for avatar
        const user = await ctx.db.get(video.userId);

        // Join with partners for handle (the creator's public profile)
        const partner = await ctx.db
          .query("partners")
          .withIndex("by_user", (q) => q.eq("userId", video.userId))
          .unique();

        return {
          _id: video._id,
          title: video.title,
          videoKey: video.videoKey,
          posterUrl: null, // posterStorageId needs a storage URL — handle when adding uploads
          price: video.price,
          restaurantName: video.restaurantName,
          arrivalTime: video.arrivalTime,
          arrivalMinutes: video.arrivalMinutes,
          distanceKm: video.distanceKm,
          likesCount: video.likesCount,
          savesCount: video.savesCount,
          commentsCount: video.commentsCount,
          creator: {
            handle: partner?.handle ?? user?.name ?? "Unknown",
            avatarUrl: user?.image ?? "",
          },
        };
      }),
    );

    return results;
  },
});
