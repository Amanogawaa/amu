import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Query to get the current authenticated user with their profile
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const authUser = await ctx.db.get(userId);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    return {
      ...authUser,
      ...profile,
    };
  },
});

/**
 * Mutation to update user profile
 */
export const updateUserProfile = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    photoURL: v.optional(v.string()),
    isPrivate: v.optional(v.boolean()),
    program: v.optional(v.string()),
    yearLevel: v.optional(v.string()),
    githubUsername: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Find existing profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    const updates: Record<string, unknown> = {
      updatedAt: Date.now(),
      ...Object.fromEntries(
        Object.entries(args).filter(([, v]) => v !== undefined),
      ),
    };

    if (profile) {
      // Update existing profile
      await ctx.db.patch(profile._id, updates);
    } else {
      // Create new profile
      await ctx.db.insert("profiles", {
        userId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...updates,
      });
    }

    // Return updated data
    const authUser = await ctx.db.get(userId);
    const updatedProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    return {
      ...authUser,
      ...updatedProfile,
    };
  },
});

/**
 * Mutation to create user profile after password authentication
 */
export const createUserProfile = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    program: v.optional(v.string()),
    yearLevel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      return existingProfile;
    }

    // Create new profile
    await ctx.db.insert("profiles", {
      userId,
      firstName: args.firstName,
      lastName: args.lastName,
      program: args.program,
      yearLevel: args.yearLevel,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const authUser = await ctx.db.get(userId);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    return {
      ...authUser,
      ...profile,
    };
  },
});
