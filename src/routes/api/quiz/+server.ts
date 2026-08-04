import { json, error } from '@sveltejs/kit';
import { generateJSON } from '$lib/server/gemini';
import { throttle } from '$lib/server/ratelimit';
import type { QuizQuestion } from '$lib/quiz';
import type { RequestHandler } from './$types';

const MIN_INTERVAL_MS = 10_000;

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const wait = throttle(`quiz:${getClientAddress()}`, MIN_INTERVAL_MS);
	if (wait) {
		error(429, `Too many requests. Please wait ${wait} seconds before trying again.`);
	}

	const body = await request.json();
	const topic = body.topic;
	const count = body.count ?? 5;

	if (!topic || typeof topic !== 'string') {
		error(400, 'Missing required field: topic');
	}

	const prompt = `Generate ${count} multiple choice questions about "${topic}".
Each question should have exactly 4 options labeled A, B, C, D.
Return ONLY valid JSON in this exact format:
[
  {
    "question": "...",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "answer": "A"
  }
]`;

	try {
		const quizData = await generateJSON<QuizQuestion[]>(prompt);
		return json({ success: true, quizData });
	} catch (err) {
		console.error('Gemini quiz error:', err);
		const e = err as unknown as { message?: string };
		if (e?.message?.includes('API key')) {
			error(500, e.message);
		}
		error(500, 'Failed to generate quiz questions');
	}
};
