import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update user profile
export const createOrUpdateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    height: v.optional(v.float64()),
    weight: v.optional(v.float64()),
    gender: v.optional(
      v.union(v.literal("male"), v.literal("female"), v.literal("other"))
    ),
    calorieGoal: v.optional(v.float64()),
    proteinGoal: v.optional(v.float64()),
    carbGoal: v.optional(v.float64()),
    fatGoal: v.optional(v.float64()),
    dateOfBirth: v.optional(v.float64()),
    profileCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      return await ctx.db.patch(existingUser._id, {
        ...args,
        updatedAt: now,
      });
    } else {
      // Create new user
      return await ctx.db.insert("users", {
        ...args,
        profileCompleted: false, // <-- Always set false on creation
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Check if user profile is complete
export const isProfileComplete = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user?.profileCompleted ?? false;
  },
});

// Update user goals
export const updateUserGoals = mutation({
  args: {
    clerkId: v.string(),
    calorieGoal: v.optional(v.float64()),
    proteinGoal: v.optional(v.float64()),
    carbGoal: v.optional(v.float64()),
    fatGoal: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const { clerkId, ...goals } = args;

    return await ctx.db.patch(user._id, {
      ...goals,
      updatedAt: Date.now(),
    });
  },
});

// Get all user data for export (profile, food items, daily logs)
export const getAllUserDataForExport = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    // Get user profile
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get all food items created by user
    const foodItems = await ctx.db
      .query("foodItems")
      .withIndex("by_created_by", (q) => q.eq("createdBy", args.clerkId))
      .collect();

    // Get all daily logs for user
    const dailyLogs = await ctx.db
      .query("dailyLogs")
      .withIndex("by_user_date", (q) => q.eq("userId", args.clerkId))
      .collect();

    // Get food item details for each daily log
    const dailyLogsWithFood = await Promise.all(
      dailyLogs.map(async (log) => {
        const foodItem = await ctx.db.get(log.foodItemId);
        return {
          ...log,
          foodItem,
        };
      })
    );

    return {
      user,
      foodItems,
      dailyLogs: dailyLogsWithFood,
      exportDate: new Date().toISOString(),
      totalFoodItems: foodItems.length,
      totalDailyLogs: dailyLogs.length,
    };
  },
});
