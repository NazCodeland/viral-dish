// convex\schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  videos: defineTable({
    title: v.string(),
    videoKey: v.string(),
    posterStorageId: v.optional(v.id("_storage")),
    userId: v.id("users"),

    description: v.string(),
    ingredients: v.array(v.string()),
    cuisine: v.string(),

    // Commerce Data (Updated to match Svelte types)
    price: v.number(),
    restaurantName: v.string(),
    arrivalTime: v.string(),
    arrivalMinutes: v.number(),
    distanceKm: v.number(),

    // Metrics (Added denormalized counters for fast feed loading)
    views: v.number(),
    likesCount: v.number(),
    savesCount: v.number(),
    commentsCount: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_views", ["views"])
    .index("by_cuisine", ["cuisine"]),

  partners: defineTable({
    userId: v.id("users"),
    handle: v.string(), // Added to satisfy CreatorHeader.svelte
    bio: v.string(),
    cuisine: v.string(),
    isVerified: v.boolean(),
  }).index("by_user", ["userId"]),

  orders: defineTable({
    userId: v.id("users"),
    videoId: v.id("videos"),
    status: v.union(
      v.literal("placed"),
      v.literal("preparing"),
      v.literal("delivering"),
      v.literal("delivered"),
      v.literal("cancelled"),
    ),
    quantity: v.number(),
    totalPrice: v.number(),
    deliveryAddress: v.string(),
    paymentLast4: v.string(),
    orderTime: v.number(),
  }).index("by_user_status", ["userId", "status"]),

  // Social Tables (Added Saves and Comments)
  likes: defineTable({
    userId: v.id("users"),
    videoId: v.id("videos"),
  })
    .index("by_user", ["userId"])
    .index("by_video", ["videoId"]),

  saves: defineTable({
    userId: v.id("users"),
    videoId: v.id("videos"),
  })
    .index("by_user", ["userId"])
    .index("by_video", ["videoId"]),

  comments: defineTable({
    userId: v.id("users"),
    videoId: v.id("videos"),
    text: v.string(),
    createdAt: v.number(),
  }).index("by_video", ["videoId"]),

  delivery_addresses: defineTable({
    userId: v.id("users"),
    label: v.string(),
    address: v.string(),
    isDefault: v.boolean(),
  }).index("by_user", ["userId"]),

  payment_methods: defineTable({
    userId: v.id("users"),
    last4: v.string(),
    brand: v.string(),
    isDefault: v.boolean(),
  }).index("by_user", ["userId"]),
});
