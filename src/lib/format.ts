// Convex hands back _creationTime as a millisecond timestamp.

export function shortDate(ms: number): string {
	return new Date(ms).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

export function relativeDate(ms: number): string {
	const days = Math.floor((Date.now() - ms) / 86_400_000);
	if (days <= 0) return 'today';
	if (days === 1) return 'yesterday';
	if (days < 7) return `${days} days ago`;
	return shortDate(ms);
}
