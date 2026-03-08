import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get all tasks
export const list = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query('tasks').order('desc').collect();
	}
});

// Add a new task
export const add = mutation({
	args: { text: v.string() },
	handler: async (ctx, args) => {
		const text = args.text.trim();
		if (!text) throw new Error('Task text cannot be empty');
		return await ctx.db.insert('tasks', { text, done: false });
	}
});

// Toggle done state
export const toggle = mutation({
	args: { id: v.id('tasks'), done: v.boolean() },
	handler: async (ctx, args) => {
		const task = await ctx.db.get(args.id);
		if (!task) throw new Error('Task not found');
		await ctx.db.patch(args.id, { done: args.done });
	}
});

// Delete a task
export const remove = mutation({
	args: { id: v.id('tasks') },
	handler: async (ctx, args) => {
		const task = await ctx.db.get(args.id);
		if (!task) throw new Error('Task not found');
		await ctx.db.delete(args.id);
	}
});

// Update task text and/or done state
export const update = mutation({
	args: { id: v.id('tasks'), text: v.string(), done: v.boolean() },
	handler: async (ctx, args) => {
		const task = await ctx.db.get(args.id);
		if (!task) throw new Error('Task not found');
		const text = args.text.trim();
		if (!text) throw new Error('Task text cannot be empty');
		await ctx.db.patch(args.id, { text, done: args.done });
	}
});