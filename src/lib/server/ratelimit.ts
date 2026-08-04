// Small in-memory throttle for the Gemini routes. It is per-process, so on a
// serverless host each instance keeps its own counter — good enough to stop a
// stuck button hammering the API, not a real quota system.

const lastCall = new Map<string, number>();

// Stops the map growing forever if keys stop being reused
const MAX_KEYS = 500;

/**
 * Returns the seconds still to wait, or 0 if the call is allowed through.
 */
export function throttle(key: string, intervalMs: number): number {
	const now = Date.now();
	const previous = lastCall.get(key);

	if (previous !== undefined && now - previous < intervalMs) {
		return Math.ceil((intervalMs - (now - previous)) / 1000);
	}

	if (lastCall.size >= MAX_KEYS) {
		lastCall.clear();
	}

	lastCall.set(key, now);
	return 0;
}
