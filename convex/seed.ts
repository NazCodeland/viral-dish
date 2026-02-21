/* convex/seed.ts */
import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existingVideos = await ctx.db.query("videos").first();
    if (existingVideos) {
      console.log("Database already seeded. Skipping...");
      return "Database already seeded!";
    }

    // -------------------------------------------------------------------------
    // USERS (CREATORS)
    // -------------------------------------------------------------------------
    const melissaId = await ctx.db.insert("users", {
      name: "BakedByMelissa",
      email: "melissa@example.com",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    });

    const marcoId = await ctx.db.insert("users", {
      name: "ChefMarco",
      email: "marco@example.com",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    });

    const grillId = await ctx.db.insert("users", {
      name: "GrillMaster",
      email: "grill@example.com",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    });

    // -------------------------------------------------------------------------
    // VIDEOS (THE FEED)
    // -------------------------------------------------------------------------
    await ctx.db.insert("videos", {
      userId: melissaId,
      title: "Green Goddess Salad",
      description:
        "The viral salad that everyone is talking about! Crunchy, healthy, and delicious.",
      videoKey:
        "https://videos.pexels.com/video-files/4252348/4252348-hd_720_1280_30fps.mp4",
      ingredients: ["Cabbage", "Cucumber", "Chives", "Spinach", "Basil"],
      cuisine: "Vegan",
      price: 18.5,
      restaurantName: "Tony's Italian",
      arrivalTime: "1:45 PM",
      arrivalMinutes: 25,
      distanceKm: 1.2,
      views: 12400,
      likesCount: 12400,
      savesCount: 320,
      commentsCount: 42,
    });

    await ctx.db.insert("videos", {
      userId: marcoId,
      title: "Spicy Vodka Rigatoni",
      description: "Creamy, spicy, perfect pasta. A classic date night dish.",
      videoKey:
        "https://videos.pexels.com/video-files/3209663/3209663-uhd_2560_1440_25fps.mp4",
      ingredients: ["Rigatoni", "Vodka Sauce", "Chili Flakes", "Parmesan"],
      cuisine: "Italian",
      price: 24.0,
      restaurantName: "Carbone",
      arrivalTime: "2:15 PM",
      arrivalMinutes: 45,
      distanceKm: 2.5,
      views: 8200,
      likesCount: 8200,
      savesCount: 210,
      commentsCount: 31,
    });

    await ctx.db.insert("videos", {
      userId: grillId,
      title: "Double Wagyu Smash",
      description:
        "The best burger you'll ever taste. Double patty, extra cheese.",
      videoKey:
        "https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4",
      ingredients: [
        "Wagyu Beef",
        "American Cheese",
        "Special Sauce",
        "Brioche Bun",
      ],
      cuisine: "American",
      price: 16.0,
      restaurantName: "BurgerJoint",
      arrivalTime: "1:30 PM",
      arrivalMinutes: 15,
      distanceKm: 0.5,
      views: 22100,
      likesCount: 22100,
      savesCount: 890,
      commentsCount: 156,
    });

    await ctx.db.insert("videos", {
      userId: marcoId,
      title: "Creamy Pesto Fusilli",
      description:
        "Fresh basil pesto with homemade fusilli. Simple and elegant.",
      videoKey:
        "https://videos.pexels.com/video-files/3209663/3209663-uhd_2560_1440_25fps.mp4",
      ingredients: ["Fusilli", "Basil Pesto", "Pine Nuts", "Olive Oil"],
      cuisine: "Italian",
      price: 19.5,
      restaurantName: "Marco's Kitchen",
      arrivalTime: "2:00 PM",
      arrivalMinutes: 30,
      distanceKm: 1.8,
      views: 5400,
      likesCount: 5400,
      savesCount: 140,
      commentsCount: 18,
    });

    await ctx.db.insert("videos", {
      userId: melissaId,
      title: "Kale & Quinoa Bowl",
      description: "Superfood power bowl with lemon vinaigrette.",
      videoKey:
        "https://videos.pexels.com/video-files/4252348/4252348-hd_720_1280_30fps.mp4",
      ingredients: ["Kale", "Quinoa", "Chickpeas", "Lemon"],
      cuisine: "Vegan",
      price: 14.0,
      restaurantName: "Green Life",
      arrivalTime: "1:40 PM",
      arrivalMinutes: 20,
      distanceKm: 0.8,
      views: 3100,
      likesCount: 3100,
      savesCount: 95,
      commentsCount: 9,
    });

    await ctx.db.insert("videos", {
      userId: grillId,
      title: "The Midnight Slider",
      description: "Perfect for late night cravings. Open until 3am.",
      videoKey:
        "https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4",
      ingredients: ["Beef Patty", "Cheddar", "Onions", "Pickles"],
      cuisine: "American",
      price: 12.0,
      restaurantName: "Night Bites",
      arrivalTime: "1:25 PM",
      arrivalMinutes: 10,
      distanceKm: 0.2,
      views: 15600,
      likesCount: 15600,
      savesCount: 430,
      commentsCount: 67,
    });

    return "Database seeded with 6 videos!";
  },
});
