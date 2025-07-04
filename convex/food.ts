import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new food item
export const createFoodItem = mutation({
  args: {
    name: v.string(),
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    fiber: v.optional(v.number()),
    items: v.optional(
      v.array(v.object({ name: v.string(), quantity: v.string() }))
    ),
    // clickedTime: v.number(),
    servingSize: v.string(),
    imageUrl: v.string(),
    compressedImageUrl: v.string(),
    isCustom: v.boolean(),
    barcode: v.optional(v.string()),
    createdById: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("foodItems", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get food items by name (search)
export const searchFoodItems = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("foodItems")
      .withIndex("by_name")
      .filter(
        (q) =>
          q.gte(q.field("name"), args.searchTerm) &&
          q.lt(q.field("name"), args.searchTerm + "\uffff")
      )
      .take(10);
  },
});

// Get food item by barcode
export const getFoodItemByBarcode = query({
  args: { barcode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("foodItems")
      .withIndex("by_barcode", (q) => q.eq("barcode", args.barcode))
      .first();
  },
});

// Get custom food items created by user
export const getCustomFoodItems = query({
  args: { createdBy: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("foodItems")
      .withIndex("by_created_by", (q) => q.eq("createdBy", args.createdBy))
      .filter((q) => q.eq(q.field("isCustom"), true))
      .collect();
  },
});

// Add food to daily log
export const addFoodToDailyLog = mutation({
  args: {
    userId: v.string(),
    date: v.string(),
    foodItemId: v.id("foodItems"),
    quantity: v.number(),
    mealType: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner"),
      v.literal("snack")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("dailyLogs", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get daily log for a specific date
export const getDailyLog = query({
  args: { userId: v.string(), date: v.string() },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("dailyLogs")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId).eq("date", args.date)
      )
      .collect();

    // Get food item details for each log
    const logsWithFood = await Promise.all(
      logs.map(async (log) => {
        const foodItem = await ctx.db.get(log.foodItemId);
        return {
          ...log,
          foodItem,
        };
      })
    );

    return logsWithFood;
  },
});

// Delete food from daily log
export const deleteFoodFromDailyLog = mutation({
  args: { logId: v.id("dailyLogs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.logId);
  },
});

export const getFoodItemById = query({
  args: { id: v.id("foodItems") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
