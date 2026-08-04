import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Newest first. The dashboard table and the trend chart both read this.
export const list = query({
	args: { limit: v.optional(v.number()) },
	handler: async (ctx, args) => {
		const attempts = await ctx.db.query('attempts').order('desc').collect();
		return args.limit ? attempts.slice(0, args.limit) : attempts;
	}
});

export const listForQuiz = query({
	args: { quizId: v.id('quizzes') },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('attempts')
			.withIndex('by_quiz', (q) => q.eq('quizId', args.quizId))
			.order('desc')
			.collect();
	}
});

// Called once the answers have been graded
export const record = mutation({
	args: {
		quizId: v.id('quizzes'),
		correct: v.number(),
		total: v.number(),
		wrongQuestions: v.array(v.string())
	},
	handler: async (ctx, args) => {
		const quiz = await ctx.db.get(args.quizId);
		if (!quiz) throw new Error('Quiz not found');
		if (args.total <= 0) throw new Error('An attempt needs at least one question');

		return await ctx.db.insert('attempts', {
			quizId: args.quizId,
			topic: quiz.topic,
			correct: args.correct,
			total: args.total,
			percentage: Math.round((args.correct / args.total) * 100),
			wrongQuestions: args.wrongQuestions
		});
	}
});

export const remove = mutation({
	args: { id: v.id('attempts') },
	handler: async (ctx, args) => {
		const attempt = await ctx.db.get(args.id);
		if (!attempt) throw new Error('Attempt not found');
		await ctx.db.delete(args.id);
	}
});
