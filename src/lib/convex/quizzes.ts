import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Quiz history list. Search is done here rather than client side so the
// history panel doesn't have to hold every quiz in memory.
export const list = query({
	args: { search: v.optional(v.string()), limit: v.optional(v.number()) },
	handler: async (ctx, args) => {
		let quizzes = await ctx.db.query('quizzes').order('desc').collect();

		const search = args.search?.trim().toLowerCase();
		if (search) {
			quizzes = quizzes.filter((q) => q.topic.toLowerCase().includes(search));
		}

		return args.limit ? quizzes.slice(0, args.limit) : quizzes;
	}
});

export const get = query({
	args: { id: v.id('quizzes') },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	}
});

// Store a freshly generated quiz so it can be retaken later
export const save = mutation({
	args: {
		topic: v.string(),
		questions: v.array(
			v.object({
				question: v.string(),
				options: v.array(v.string()),
				answer: v.string()
			})
		)
	},
	handler: async (ctx, args) => {
		const topic = args.topic.trim();
		if (!topic) throw new Error('Topic cannot be empty');
		if (!args.questions.length) throw new Error('A quiz needs at least one question');
		return await ctx.db.insert('quizzes', { topic, questions: args.questions });
	}
});

// Deleting a quiz takes its attempts with it, otherwise the dashboard ends up
// counting scores for a quiz you can no longer open.
export const remove = mutation({
	args: { id: v.id('quizzes') },
	handler: async (ctx, args) => {
		const quiz = await ctx.db.get(args.id);
		if (!quiz) throw new Error('Quiz not found');

		const attempts = await ctx.db
			.query('attempts')
			.withIndex('by_quiz', (q) => q.eq('quizId', args.id))
			.collect();

		for (const attempt of attempts) {
			await ctx.db.delete(attempt._id);
		}

		await ctx.db.delete(args.id);
	}
});
