import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const question = v.object({
	question: v.string(),
	options: v.array(v.string()),
	answer: v.string()
});

export default defineSchema({
	tasks: defineTable({
		text: v.string(),
		done: v.boolean()
	}),

	users: defineTable({
		name: v.string()
	}),

	// Study guides come back from Gemini as one JSON blob, so we store them shaped
	// the same way the /api/generate route returns them.
	materials: defineTable({
		topic: v.string(),
		overview: v.string(),
		concepts: v.array(v.object({ title: v.string(), explanation: v.string() })),
		takeaways: v.array(v.string())
	}).index('by_topic', ['topic']),

	quizzes: defineTable({
		topic: v.string(),
		questions: v.array(question)
	}).index('by_topic', ['topic']),

	// One row per time a quiz is taken. Keeping the questions out of here and
	// referencing the quiz means retaking a quiz doesn't duplicate all that text.
	attempts: defineTable({
		quizId: v.id('quizzes'),
		topic: v.string(),
		correct: v.number(),
		total: v.number(),
		percentage: v.number(),
		// Which questions were missed, so the dashboard can point at weak topics.
		wrongQuestions: v.array(v.string())
	}).index('by_quiz', ['quizId'])
});
