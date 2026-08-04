import { env } from '$env/dynamic/private';
import { GoogleGenAI } from '@google/genai';

function getGemini() {
	const apiKey = env.GEMINI_API_KEY;
	if (!apiKey) {
		throw new Error('GEMINI_API_KEY is not set. Add it to your .env file.');
	}
	return new GoogleGenAI({ apiKey });
}

/**
 * Send a prompt to Gemini and return the raw text response.
 *
 *
 */
export async function generateText(
	prompt: string,
	opts?: { maxAttempts?: number; baseDelayMs?: number }
): Promise<string> {
	const gemini = getGemini();
	const model = env.GEMINI_MODEL ?? 'gemini-3-flash-preview';
	const maxAttempts = opts?.maxAttempts ?? 5;
	const baseDelay = opts?.baseDelayMs ?? 300; // ms
	let attempt = 0;

	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	while (true) {
		attempt++;
		try {
			const response = await gemini.models.generateContent({
				model,
				contents: prompt
			});

			if (!response.text) {
				throw new Error('Gemini did not return a response');
			}
			return response.text;
		} catch (err) {
			const e = err as unknown as {
				status?: number;
				code?: number;
				message?: string;
				error?: { code?: number };
			};
			// A rejected key looks like any other 400, and the raw Google error is a
			// wall of JSON, so it gets called out here instead.
			if (e?.message?.toString().includes('API_KEY_INVALID')) {
				throw new Error('Gemini rejected the API key. Check GEMINI_API_KEY in .env.local.');
			}

			const retryable =
				e?.status === 503 ||
				e?.code === 503 ||
				e?.message?.toString().toLowerCase().includes('high demand') ||
				(e?.error && e.error.code === 503);

			if (!retryable || attempt >= maxAttempts) {
				throw err;
			}

			const jitter = Math.random() * 300;
			const backoff = Math.pow(2, attempt - 1) * baseDelay + jitter;
			console.warn(
				`Gemini request failed (attempt ${attempt}/${maxAttempts}). Retrying in ${Math.round(backoff)}ms.`
			);
			await sleep(backoff);
		}
	}
}

/**
 * Send a prompt to Gemini and parse the response as JSON.
 * Strips markdown fences if Gemini wraps the output in ```json … ```.
 */
export async function generateJSON<JSON>(prompt: string): Promise<JSON> {
	const text = await generateText(prompt);
	const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
	return JSON.parse(cleaned);
}
