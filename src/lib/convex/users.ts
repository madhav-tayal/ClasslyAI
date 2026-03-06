import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get
export const list = query({
	handler: async (ctx) => {
		return await ctx.db.query('users').collect();
	}
});

// Add
export const add = mutation({
	args: { name: v.string(), user: v.string(), id: v.id('users') },
	handler: async (ctx, args) => {
		await ctx.db.insert('users', { name: args.name });
	}
});

// Delete
export const remove = mutation({
	args: { id: v.id('users') },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
	}
});
