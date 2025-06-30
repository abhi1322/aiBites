import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - extends Clerk user data
  users: defineTable({
    clerkId: v.string(), // Clerk user ID
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profileImage: v.optional(v.string()), // Profile image URL
    height: v.optional(v.float64()), // cm
    weight: v.optional(v.float64()), // kg
    gender: v.optional(
      v.union(v.literal("male"), v.literal("female"), v.literal("other"))
    ),
    calorieGoal: v.optional(v.float64()), // Daily calorie goal
    proteinGoal: v.optional(v.float64()), // Daily protein goal (grams)
    carbGoal: v.optional(v.float64()), // Daily carb goal (grams)
    fatGoal: v.optional(v.float64()), // Daily fat goal (grams)
    dateOfBirth: v.optional(v.float64()), // Date of birth as timestamp
    profileCompleted: v.optional(v.boolean()), // Whether user has completed profile setup
    createdAt: v.number(), // Timestamp
    updatedAt: v.number(), // Timestamp
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // Food items table - stores food information
  foodItems: defineTable({
    name: v.string(),
    calories: v.number(),
    protein: v.optional(v.number()), // grams
    carbs: v.optional(v.number()), // grams
    fat: v.optional(v.number()), // grams
    fiber: v.optional(v.number()), // grams
    sugar: v.optional(v.number()), // grams
    sodium: v.optional(v.number()), // mg
    servingSize: v.optional(v.string()), // e.g., "1 cup", "100g"
    barcode: v.optional(v.string()), // For packaged foods
    imageUrl: v.optional(v.string()), // Food image URL
    isCustom: v.boolean(), // Whether this is a user-created food
    createdBy: v.optional(v.string()), // Clerk user ID who created this
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_barcode", ["barcode"])
    .index("by_created_by", ["createdBy"]),

  // Daily food logs - tracks what user ate each day
  dailyLogs: defineTable({
    userId: v.string(), // Clerk user ID
    date: v.string(), // YYYY-MM-DD format
    foodItemId: v.id("foodItems"),
    quantity: v.number(), // How many servings
    mealType: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner"),
      v.literal("snack")
    ),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user_meal", ["userId", "date", "mealType"])
    .index("by_food_item", ["foodItemId"]),
});
