<script lang="ts">
	let {
		topics
	}: {
		topics: { topic: string; attempts: number; percentage: number }[];
	} = $props();
</script>

{#if topics.length}
	<ul class="topics">
		{#each topics as t (t.topic)}
			<li>
				<div class="row">
					<span class="name">{t.topic}</span>
					<span class="score">{t.percentage}%</span>
				</div>
				<div class="bar" aria-hidden="true">
					<div class="fill" style:width={`${t.percentage}%`}></div>
				</div>
				<span class="meta">{t.attempts} {t.attempts === 1 ? 'attempt' : 'attempts'}</span>
			</li>
		{/each}
	</ul>
{:else}
	<p class="empty">Take a quiz and the topics you struggle with will show up here.</p>
{/if}

<style>
	.topics {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
	}

	.name {
		font-weight: 500;
	}

	.score {
		font-variant-numeric: tabular-nums;
		color: var(--muted);
	}

	.bar {
		margin-top: 0.4rem;
		height: 6px;
		border-radius: 3px;
		background: var(--bg);
		overflow: hidden;
	}

	.fill {
		height: 100%;
		border-radius: 3px;
		background: var(--accent);
	}

	.meta {
		font-size: 0.8rem;
		color: var(--muted);
	}

	.empty {
		color: var(--muted);
		margin: 0;
	}
</style>
