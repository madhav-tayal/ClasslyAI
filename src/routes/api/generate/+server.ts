import { json, error } from '@sveltejs/kit';
import { generateText } from '$lib/server/gemini';
import { throttle } from '$lib/server/ratelimit';
import type { RequestHandler } from './$types';

const MIN_INTERVAL_MS = 10_000;

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const wait = throttle(`generate:${getClientAddress()}`, MIN_INTERVAL_MS);
	if (wait) {
		error(429, `Too many requests. Please wait ${wait} seconds before trying again.`);
	}

	const body = await request.json();
	const topic = body.topic;

	if (!topic || typeof topic !== 'string') {
		error(400, 'Missing required field: topic');
	}

	const prompt = `You are an expert tutor. Generate a concise but thorough study guide about "${topic}".
Include:
- A brief overview (2-3 sentences)
- 4-6 key concepts, each with a title and explanation
- 3 important takeaways

Return ONLY valid JSON in this exact format:
{
  "topic": "${topic}",
  "overview": "...",
  "concepts": [
    { "title": "...", "explanation": "..." }
  ],
  "takeaways": ["...", "...", "..."]
}`;

	try {
		const data = await generateText(prompt);
		const cleaned = data.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
		const parsed = JSON.parse(cleaned);
		return json({ success: true, data: parsed });
	} catch (err) {
		console.error('Gemini generate error:', err);
		const e = err as unknown as { status?: number; message?: string };
		if (e?.status === 503 || e?.message?.toString().toLowerCase().includes('high demand')) {
			throw error(503, 'Model is currently unavailable. Please try again later.');
		}
		if (e?.message?.includes('API key')) {
			throw error(500, e.message);
		}
		throw error(500, 'Failed to generate study material');
	}
};
