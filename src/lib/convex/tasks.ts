import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('tasks').collect();
  }
});

// Add
export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert('tasks', { text: args.text, done: false });
  }
});

// Toggle
export const toggle = mutation({
  args: { id: v.id('tasks'), done: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { done: args.done });
  }
});

// Delete
export const remove = mutation({
  args: { id: v.id('tasks') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  }
});

// Update
export const update = mutation({
  args: { id: v.id('tasks'), text: v.string(), done: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { text: args.text, done: args.done });
  }
});
