import { query } from './_generated/server';
import { v } from 'convex/values';

// Everything the dashboard needs in one round trip, so the page isn't firing
// four separate queries and stitching them together on the client.
export const summary = query({
	args: { trendSize: v.optional(v.number()) },
	handler: async (ctx, args) => {
		const attempts = await ctx.db.query('attempts').order('desc').collect();
		const materials = await ctx.db.query('materials').collect();

		const quizzesTaken = attempts.length;
		const averageScore = quizzesTaken
			? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / quizzesTaken)
			: 0;
		const bestScore = quizzesTaken ? Math.max(...attempts.map((a) => a.percentage)) : 0;

		// Oldest to newest so the chart reads left to right
		const trendSize = args.trendSize ?? 8;
		const trend = attempts
			.slice(0, trendSize)
			.reverse()
			.map((a) => ({ at: a._creationTime, topic: a.topic, percentage: a.percentage }));

		return {
			quizzesTaken,
			averageScore,
			bestScore,
			materialsSaved: materials.length,
			trend,
			weakTopics: weakestTopics(attempts)
		};
	}
});

type Attempt = { topic: string; correct: number; total: number };

// Average per topic, worst first. Topics you've only seen once still count —
// with a handful of attempts total, requiring a minimum would show nothing.
function weakestTopics(attempts: Attempt[]) {
	const byTopic = new Map<string, { correct: number; total: number; attempts: number }>();

	for (const attempt of attempts) {
		const row = byTopic.get(attempt.topic) ?? { correct: 0, total: 0, attempts: 0 };
		row.correct += attempt.correct;
		row.total += attempt.total;
		row.attempts += 1;
		byTopic.set(attempt.topic, row);
	}

	return [...byTopic.entries()]
		.map(([topic, row]) => ({
			topic,
			attempts: row.attempts,
			percentage: Math.round((row.correct / row.total) * 100)
		}))
		.sort((a, b) => a.percentage - b.percentage)
		.slice(0, 5);
}
