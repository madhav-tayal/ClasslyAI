import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Newest first, optionally capped for the dashboard
export const list = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, args) => {
		const materials = await ctx.db.query('materials').order('desc').collect();
		return args.limit ? materials.slice(0, args.limit) : materials;
	}
});

// Single guide, used when you open one from the history list
export const get = query({
	args: { id: v.id('materials') },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	}
});

// Save a guide that came back from Gemini
export const save = mutation({
	args: {
		topic: v.string(),
		overview: v.string(),
		concepts: v.array(v.object({ title: v.string(), explanation: v.string() })),
		takeaways: v.array(v.string())
	},
	handler: async (ctx, args) => {
		const topic = args.topic.trim();
		if (!topic) throw new Error('Topic cannot be empty');
		return await ctx.db.insert('materials', { ...args, topic });
	}
});

export const remove = mutation({
	args: { id: v.id('materials') },
	handler: async (ctx, args) => {
		const material = await ctx.db.get(args.id);
		if (!material) throw new Error('Material not found');
		await ctx.db.delete(args.id);
	}
});
