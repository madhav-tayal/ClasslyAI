<script lang="ts">
	let {
		quizzesTaken,
		averageScore,
		bestScore,
		materialsSaved
	}: {
		quizzesTaken: number;
		averageScore: number;
		bestScore: number;
		materialsSaved: number;
	} = $props();

	const tiles = $derived([
		{ label: 'Quizzes taken', value: String(quizzesTaken) },
		{ label: 'Average score', value: quizzesTaken ? `${averageScore}%` : '—' },
		{ label: 'Best score', value: quizzesTaken ? `${bestScore}%` : '—' },
		{ label: 'Notes saved', value: String(materialsSaved) }
	]);
</script>

<div class="tiles">
	{#each tiles as tile (tile.label)}
		<div class="tile">
			<span class="value">{tile.value}</span>
			<span class="label">{tile.label}</span>
		</div>
	{/each}
</div>

<style>
	.tiles {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 1rem;
		width: 100%;
	}

	.tile {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 1.5rem;
		background: var(--mg);
		border: 1px solid var(--border);
		border-radius: var(--radius);
	}

	.value {
		font-size: 2rem;
		font-weight: 600;
		line-height: 1;
	}

	.label {
		font-size: 0.9rem;
		color: var(--muted);
	}
</style>
